import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { isAuthorizedAdmin } from '../middleware/authorization.middleware';
import { apiClient } from '../services/api-client.service';
import { escapeHtml } from '../utils/formatters';

export const operatorChannelComposer = new Composer<MyContext>();

const STATUS_ACTION_LABELS: Record<string, string> = {
  contacted: 'CONTACTED',
  callback: 'CALLBACK',
  trial: 'TRIAL_BOOKED',
  enrolled: 'ENROLLED',
  not_interested: 'NOT_INTERESTED',
};

const STATUS_DISPLAY_UZ: Record<string, string> = {
  CONTACTED: 'Bog‘lanildi',
  CALLBACK: 'Qayta qo‘ng‘iroq',
  TRIAL_BOOKED: 'Sinov darsi belgilandi',
  ENROLLED: 'Qabul qilindi (Talaba)',
  NOT_INTERESTED: 'Qiziqmadi',
};

// Listen for bot being added to channel or messages posted in channel
operatorChannelComposer.on('my_chat_member', async (ctx) => {
  const chat = ctx.chat;
  const newStatus = ctx.myChatMember?.new_chat_member?.status;
  if (chat && (chat.type === 'channel' || chat.type === 'supergroup')) {
    console.log(`\n====================================================`);
    console.log(`🎯 BOT KANALGA QO‘SHILDI!`);
    console.log(`📌 Kanal nomi: "${chat.title}"`);
    console.log(`🆔 KANAL CHAT ID: ${chat.id}`);
    console.log(`📊 Bot huquqi: ${newStatus}`);
    console.log(`====================================================\n`);
  }
});

operatorChannelComposer.on('channel_post', async (ctx) => {
  const chat = ctx.chat;
  console.log(`\n====================================================`);
  console.log(`📬 KANALDA XABAR ANIQLANDI!`);
  console.log(`📌 Kanal nomi: "${chat.title}"`);
  console.log(`🆔 KANAL CHAT ID: ${chat.id}`);
  console.log(`====================================================\n`);
});

// Intercept all lead:* callbacks from operator channel or notification messages
operatorChannelComposer.callbackQuery(/^lead:(.+)$/, async (ctx) => {
  const userId = ctx.from?.id;

  // 1. Authorization check
  if (!isAuthorizedAdmin(userId)) {
    await ctx.answerCallbackQuery({
      text: "⛔️ Kechirasiz, sizda operatorlik amallarini bajarish huquqi yo‘q.",
      show_alert: true,
    });
    return;
  }

  const payload = ctx.match[1];
  const parts = payload.split(':');
  const action = parts[0];
  const leadId = parts.slice(1).join(':');

  const operatorName =
    [ctx.from?.first_name, ctx.from?.last_name].filter(Boolean).join(' ') ||
    (ctx.from?.username ? `@${ctx.from.username}` : `Operator (#${userId})`);

  // Action: Show Phone Number
  if (action === 'phone') {
    try {
      const lead = await apiClient.getLeadById(leadId);
      await ctx.answerCallbackQuery({
        text: `📞 O‘quvchi telefoni: ${lead.phoneFormatted || lead.phone}\n(Qo‘ng‘iroq qilish uchun nusxalang)`,
        show_alert: true,
      });
    } catch {
      await ctx.answerCallbackQuery({
        text: "Telefon raqamini yuklab bo‘lmadi.",
        show_alert: true,
      });
    }
    return;
  }

  // Action: View Details
  if (action === 'details') {
    try {
      const lead = await apiClient.getLeadById(leadId);
      const details =
        `📄 Ariza #${lead.referenceId}\n` +
        `👤 Ism: ${lead.fullName}\n` +
        `📞 Tel: ${lead.phoneFormatted}\n` +
        `📚 Kurs: ${lead.course?.title || lead.courseId}\n` +
        `📍 Filial: ${lead.branch?.name || lead.branchId}\n` +
        `📊 Status: ${lead.status}\n` +
        `🌐 Manba: ${lead.source}\n` +
        (lead.preferredTime ? `⏰ Qulay vaqt: ${lead.preferredTime}\n` : '') +
        (lead.notes ? `💬 Izoh: ${lead.notes}` : '');

      await ctx.answerCallbackQuery({
        text: details.slice(0, 200),
        show_alert: true,
      });
    } catch {
      await ctx.answerCallbackQuery({
        text: "Ariza ma’lumotlarini yuklab bo‘lmadi.",
        show_alert: true,
      });
    }
    return;
  }

  // Action: Self-Assign Operator
  if (action === 'assign') {
    try {
      await apiClient.updateLeadStatus(
        leadId,
        'CONTACTED',
        `Operator ${operatorName} tomonidan qabul qilindi`,
        operatorName,
      );

      await ctx.answerCallbackQuery({
        text: `👤 Siz ushbu arizaga mas’ul sifatida belgilandingiz (${operatorName})!`,
        show_alert: true,
      });
    } catch (err: any) {
      await ctx.answerCallbackQuery({
        text: `Xatolik: ${err.message}`,
        show_alert: true,
      });
    }
    return;
  }

  // Action: Update Status (contacted, callback, trial, enrolled, not_interested)
  const targetStatus = STATUS_ACTION_LABELS[action];
  if (targetStatus) {
    try {
      const comment = `Telegram operator kanali orqali yangilandi (${operatorName})`;
      await apiClient.updateLeadStatus(leadId, targetStatus, comment, operatorName);

      const statusNameUz = STATUS_DISPLAY_UZ[targetStatus] || targetStatus;
      await ctx.answerCallbackQuery({
        text: `✅ Status yangilandi: ${statusNameUz}\n👨‍💼 Operator: ${operatorName}`,
        show_alert: true,
      });
    } catch (err: any) {
      await ctx.answerCallbackQuery({
        text: `❌ Statusni yangilashda xatolik: ${err.message}`,
        show_alert: true,
      });
    }
    return;
  }

  await ctx.answerCallbackQuery({ text: 'Noma’lum buyruq.' });
});
