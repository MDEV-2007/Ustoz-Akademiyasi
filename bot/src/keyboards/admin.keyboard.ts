import { InlineKeyboard } from 'grammy';
import { LeadAdminItem } from '../types/api.types';
import { BOT_CALLBACK_PREFIXES } from '../config/constants';

export function getAdminMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text('📋 So‘nggi arizalar (Leads)', 'adm_act:leads_1')
    .row()
    .text('🔄 Status bo‘yicha filtr', 'adm_act:filter_status')
    .row()
    .text('🏠 Asosiy menyuga qaytish', 'nav:main');
}

export function getAdminLeadsKeyboard(
  leads: LeadAdminItem[],
  page: number,
  totalPages: number,
): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const lead of leads) {
    const statusIcon =
      lead.status === 'NEW'
        ? '🆕'
        : lead.status === 'CONTACTED'
        ? '📞'
        : lead.status === 'SCHEDULED'
        ? '🗓'
        : lead.status === 'CONVERTED'
        ? '🎯'
        : lead.status === 'CANCELLED'
        ? '❌'
        : '⚪️';

    keyboard
      .text(
        `${statusIcon} ${lead.referenceId} — ${lead.fullName.slice(0, 18)}`,
        `${BOT_CALLBACK_PREFIXES.ADMIN_LEAD}${lead.id}`,
      )
      .row();
  }

  // Pagination row
  if (totalPages > 1) {
    if (page > 1) {
      keyboard.text('⬅️ Oldingi', `${BOT_CALLBACK_PREFIXES.ADMIN_PAGE}${page - 1}`);
    }
    keyboard.text(`${page} / ${totalPages}`, 'noop');
    if (page < totalPages) {
      keyboard.text('Keyingi ➡️', `${BOT_CALLBACK_PREFIXES.ADMIN_PAGE}${page + 1}`);
    }
    keyboard.row();
  }

  keyboard.text('🔄 Yangilash', `adm_act:leads_${page}`).row();
  keyboard.text('⬅️ Admin panel', 'adm_act:menu');
  return keyboard;
}

export function getAdminLeadDetailKeyboard(leadId: string): InlineKeyboard {
  return new InlineKeyboard()
    .text('📞 Bog‘lanildi', `${BOT_CALLBACK_PREFIXES.ADMIN_STATUS}${leadId}:CONTACTED`)
    .text('🗓 Belgilandi', `${BOT_CALLBACK_PREFIXES.ADMIN_STATUS}${leadId}:SCHEDULED`)
    .row()
    .text('🎯 Mijoz bo‘ldi', `${BOT_CALLBACK_PREFIXES.ADMIN_STATUS}${leadId}:CONVERTED`)
    .text('❌ Bekor qilindi', `${BOT_CALLBACK_PREFIXES.ADMIN_STATUS}${leadId}:CANCELLED`)
    .row()
    .text('⬅️ Arizalar ro‘yxatiga qaytish', 'adm_act:leads_1');
}
