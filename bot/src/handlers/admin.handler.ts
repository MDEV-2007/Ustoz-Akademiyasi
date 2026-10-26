import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { requireAdminMiddleware } from '../middleware/authorization.middleware';
import { apiClient } from '../services/api-client.service';
import {
  getAdminMenuKeyboard,
  getAdminLeadsKeyboard,
  getAdminLeadDetailKeyboard,
} from '../keyboards/admin.keyboard';
import { BOT_CALLBACK_PREFIXES } from '../config/constants';

export const adminComposer = new Composer<MyContext>();

// Apply authorization guard to all admin routes
adminComposer.use(requireAdminMiddleware);

// /admin command
adminComposer.command('admin', async (ctx) => {
  const text =
    `🛡 <b>Ustoz Akademiyasi — Ma’muriyat Paneli</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━━\n\n` +
    `Siz tizim administratori sifatida avtorizatsiyadan o‘tgansiz.\n` +
    `Quyidagi bo‘limlardan birini tanlang:`;

  await ctx.reply(text, { reply_markup: getAdminMenuKeyboard() });
});

// /leads command
async function showAdminLeads(ctx: MyContext, page: number = 1) {
  try {
    const res = await apiClient.getAdminLeads(page, 5);
    const leads = res.data;
    const meta = res.meta;
    const totalPages = meta?.totalPages || 1;

    if (!leads || leads.length === 0) {
      await ctx.reply("ℹ️ Hozircha yangi arizalar mavjud emas.");
      return;
    }

    const text =
      `📋 <b>Sinov Darsiga Arizalar (Jami: ${meta?.total || leads.length} ta)</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n` +
      `Sahifa: <code>${page}/${totalPages}</code>\n\n` +
      `Batafsil ko‘rish yoki statusini o‘zgartirish uchun kerakli arizani bosing:`;

    const keyboard = getAdminLeadsKeyboard(leads, page, totalPages);

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await ctx.editMessageText(text, { reply_markup: keyboard });
    } else {
      await ctx.reply(text, { reply_markup: keyboard });
    }
  } catch (err: any) {
    const errMsg = `⚠️ Arizalarni yuklashda xatolik: ${err.message}`;
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text: errMsg, show_alert: true });
    } else {
      await ctx.reply(errMsg);
    }
  }
}

adminComposer.command('leads', (ctx) => showAdminLeads(ctx, 1));

// Callback for leads pagination
adminComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.ADMIN_PAGE}(\\d+)$`), async (ctx) => {
  const page = parseInt(ctx.match[1], 10) || 1;
  await showAdminLeads(ctx, page);
});

adminComposer.callbackQuery(new RegExp(`^adm_act:leads_(\\d+)$`), async (ctx) => {
  const page = parseInt(ctx.match[1], 10) || 1;
  await showAdminLeads(ctx, page);
});

adminComposer.callbackQuery('adm_act:menu', async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.editMessageText(
    `🛡 <b>Ustoz Akademiyasi — Ma’muriyat Paneli</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `Quyidagi bo‘limlardan birini tanlang:`,
    { reply_markup: getAdminMenuKeyboard() },
  );
});

// Callback for lead details
adminComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.ADMIN_LEAD}(.+)$`), async (ctx) => {
  const leadId = ctx.match[1];
  await ctx.answerCallbackQuery();

  try {
    const res = await apiClient.getAdminLeads(1, 50);
    const lead = res.data.find((l) => l.id === leadId || l.referenceId === leadId);

    if (!lead) {
      await ctx.reply("Ariza topilmadi.");
      return;
    }

    const text =
      `📄 <b>Ariza Tafsilotlari:</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🆔 <b>ID:</b> <code>${lead.referenceId}</code>\n` +
      `👤 <b>F.I.Sh:</b> ${lead.fullName}\n` +
      `📞 <b>Telefon:</b> <code>${lead.phoneFormatted}</code>\n` +
      `📖 <b>Kurs:</b> ${lead.course?.title || lead.courseId}\n` +
      `📍 <b>Filial:</b> ${lead.branch?.name || lead.branchId}\n` +
      `📊 <b>Status:</b> <i>${lead.status}</i>\n` +
      `🌐 <b>Manba:</b> ${lead.source}\n` +
      (lead.notes ? `💬 <b>Izoh:</b> ${lead.notes}\n` : '') +
      `🕒 <b>Vaqt:</b> ${new Date(lead.createdAt).toLocaleString('uz-UZ')}\n\n` +
      `Statusni o‘zgartirish uchun quyidagi tugmani bosing:`;

    await ctx.editMessageText(text, {
      reply_markup: getAdminLeadDetailKeyboard(lead.id),
    });
  } catch {
    await ctx.reply("Arizani yuklab bo‘lmadi.");
  }
});

// Callback for updating lead status
adminComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.ADMIN_STATUS}(.+):([A-Z_]+)$`), async (ctx) => {
  const leadId = ctx.match[1];
  const newStatus = ctx.match[2];

  try {
    await apiClient.updateLeadStatus(
      leadId,
      newStatus,
      `Status Telegram bot orqali o‘zgartirildi (Admin ID: ${ctx.from?.id})`,
    );

    await ctx.answerCallbackQuery({
      text: `✅ Status muvaffaqiyatli o‘zgartirildi: ${newStatus}`,
      show_alert: true,
    });

    // Refresh lead view
    await showAdminLeads(ctx, 1);
  } catch (err: any) {
    await ctx.answerCallbackQuery({
      text: `❌ Statusni o‘zgartirishda xatolik: ${err.message}`,
      show_alert: true,
    });
  }
});
