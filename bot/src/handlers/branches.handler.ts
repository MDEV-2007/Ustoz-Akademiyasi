import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { apiClient } from '../services/api-client.service';
import { BOT_CALLBACK_PREFIXES, BOT_STRINGS } from '../config/constants';
import { getBranchesListKeyboard, getBranchDetailKeyboard } from '../keyboards/branch.keyboard';
import { getMainMenuReplyKeyboard, getMainMenuInlineKeyboard } from '../keyboards/main-menu.keyboard';
import { Branch } from '../types/api.types';
import { escapeHtml, safeEditOrReply } from '../utils/formatters';

export const branchesComposer = new Composer<MyContext>();

// Helper to format branch details
export function formatBranchMessage(branch: Branch): string {
  const parts: string[] = [];

  parts.push(`📍 <b>${escapeHtml(branch.name)}</b>\n`);

  if (branch.area || branch.district) {
    parts.push(`🗺 <b>Hudud:</b> ${escapeHtml(branch.area || '')}${branch.district ? ` (${escapeHtml(branch.district)})` : ''}`);
  }

  if (branch.address) {
    parts.push(`📌 <b>Manzil:</b> ${escapeHtml(branch.address)}`);
  }

  if (branch.landmark) {
    parts.push(`🧭 <b>Mo‘ljal:</b> ${escapeHtml(branch.landmark)}`);
  }

  if (branch.workingHours) {
    parts.push(`🕘 <b>Ish vaqti:</b> ${escapeHtml(branch.workingHours)}`);
  }

  if (branch.phone) {
    parts.push(`☎️ <b>Telefon:</b> <code>${escapeHtml(branch.phone)}</code>`);
  }

  return parts.join('\n');
}

// Handler for Branches Menu Button & Callback
async function showBranchesList(ctx: MyContext) {
  try {
    const branches = await apiClient.getBranches();

    if (!branches || branches.length === 0) {
      const msg = "ℹ️ Hozirda faol filiallar ro‘yxati mavjud emas.";
      if (ctx.callbackQuery) {
        await ctx.answerCallbackQuery();
        await safeEditOrReply(ctx, msg, { reply_markup: getMainMenuInlineKeyboard(), parse_mode: 'HTML' });
      } else {
        await ctx.reply(msg, { reply_markup: getMainMenuReplyKeyboard(), parse_mode: 'HTML' });
      }
      return;
    }

    const text =
      `📍 <b>Filiallarimiz</b>\n\n` +
      `Toshkent shahridagi o‘zingizga eng yaqin filialni tanlang:`;

    const keyboard = getBranchesListKeyboard(branches);

    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery();
      await safeEditOrReply(ctx, text, { reply_markup: keyboard, parse_mode: 'HTML' });
    } else {
      await ctx.reply(text, { reply_markup: keyboard, parse_mode: 'HTML' });
    }
  } catch (err: any) {
    const errorMsg = "⚠️ Filiallar ro‘yxatini yuklashda xatolik yuz berdi.";
    if (ctx.callbackQuery) {
      await ctx.answerCallbackQuery({ text: errorMsg, show_alert: true });
    } else {
      await ctx.reply(errorMsg, { reply_markup: getMainMenuReplyKeyboard() });
    }
  }
}

branchesComposer.hears(
  [
    BOT_STRINGS.MENU_BRANCHES,
    '📍 Филиалы',
    '📍 Branches',
    /^📍 (Filiallar|Филиалы|Branches)/i,
  ],
  (ctx) => showBranchesList(ctx)
);
branchesComposer.callbackQuery('nav:branches', (ctx) => showBranchesList(ctx));

// Branch Detail
branchesComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.BRANCH_DETAIL}(.+)$`), async (ctx) => {
  const slug = ctx.match[1];
  try {
    const branch = await apiClient.getBranchBySlug(slug);
    if (!branch) {
      await ctx.answerCallbackQuery({ text: "Filial topilmadi", show_alert: true });
      return;
    }

    await ctx.answerCallbackQuery();
    const text = formatBranchMessage(branch);
    await safeEditOrReply(ctx, text, {
      reply_markup: getBranchDetailKeyboard(branch),
      parse_mode: 'HTML',
    });
  } catch (err: any) {
    await ctx.answerCallbackQuery({
      text: "Filial tafsilotini yuklab bo‘lmadi.",
      show_alert: true,
    });
  }
});

// Send Telegram Native Location
branchesComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.BRANCH_MAP}(.+)$`), async (ctx) => {
  const slug = ctx.match[1];
  await ctx.answerCallbackQuery();

  try {
    const branch = await apiClient.getBranchBySlug(slug);
    if (branch && branch.latitude && branch.longitude) {
      await ctx.replyWithLocation(branch.latitude, branch.longitude);
      await ctx.reply(`📍 <b>${branch.name}</b>\n🧭 Mo‘ljal: ${branch.landmark || branch.addressNote || 'Xaritada ko‘rsatilgan'}`);
    } else {
      await ctx.reply("ℹ️ Ushbu filial koordinatalari hozirda xaritada belgilanmagan. Iltimos, manzildan foydalaning.");
    }
  } catch {
    await ctx.reply("Lokatsiyani yuborishda xatolik yuz berdi.");
  }
});

// Direct Branch Registration
branchesComposer.callbackQuery(new RegExp(`^${BOT_CALLBACK_PREFIXES.BRANCH_REGISTER}(.+)$`), async (ctx) => {
  const slug = ctx.match[1];
  await ctx.answerCallbackQuery();

  try {
    const branch = await apiClient.getBranchBySlug(slug);
    ctx.session.registrationDraft = {
      branchSlug: branch.slug,
      branchName: branch.name,
      attributionSource: `BRANCH_VIEW_${branch.slug}`,
    };
  } catch {
    ctx.session.registrationDraft = {
      branchSlug: slug,
      attributionSource: `BRANCH_VIEW_${slug}`,
    };
  }

  await ctx.conversation.enter('registrationConversation');
});
