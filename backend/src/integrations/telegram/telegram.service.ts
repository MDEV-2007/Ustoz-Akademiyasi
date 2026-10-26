import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const STATUS_LABELS: Record<string, string> = {
  NEW: '🟡 YANGI',
  CONTACTED: '📞 BOG‘LANILDI',
  CALLBACK: '🔄 QAYTA QO‘NG‘IROQ',
  INTERESTED: '💡 QIZIQMOQDA',
  TRIAL_BOOKED: '🎓 SINOV DARSI BELGILANDI',
  ENROLLED: '🟢 QABUL QILINDI',
  NOT_INTERESTED: '❌ QIZIQMADI',
  UNREACHABLE: '📵 BOG‘LANIB BO‘LMADI',
  DUPLICATE: '⚠️ TAKRORIY',
  SCHEDULED: '🎓 SINOV DARSI',
  ATTENDED: '✅ QATNASHDI',
  CONVERTED: '🟢 TALABA BO‘LDI',
  CANCELLED: '❌ BEKOR QILINDI',
  SPAM: '🚫 SPAM',
};

function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatLeadNotificationHtml(lead: {
  referenceId: string;
  fullName: string;
  phoneFormatted: string;
  courseTitle: string;
  branchName: string;
  source: string;
  inquiryType?: string;
  preferredTime?: string | null;
  notes?: string | null;
  status: string;
  assignedManagerName?: string | null;
  telegramUsername?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}): string {
  const statusLabel = STATUS_LABELS[lead.status] || lead.status;
  const timeFormatted = (lead.createdAt || new Date()).toLocaleString('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const lines = [
    `🎓 <b>YANGI ARIZA #${escapeHtml(lead.referenceId)}</b>`,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `👤 <b>O‘quvchi:</b> ${escapeHtml(lead.fullName)}`,
    `📞 <b>Telefon:</b> <code>${escapeHtml(lead.phoneFormatted)}</code>`,
    lead.telegramUsername ? `💬 <b>Telegram:</b> @${escapeHtml(lead.telegramUsername.replace('@', ''))}` : null,
    `📚 <b>Kurs:</b> ${escapeHtml(lead.courseTitle)}`,
    `📍 <b>Filial:</b> ${escapeHtml(lead.branchName)}`,
    lead.notes && /Ustoz:\s*[^|]+/i.test(lead.notes)
      ? `👨‍🏫 <b>Tanlangan ustoz:</b> ${escapeHtml((lead.notes.match(/Ustoz:\s*[^|]+/i)?.[0] ?? '').trim())}`
      : null,
    `🌐 <b>Manba:</b> ${escapeHtml(lead.source)}`,
    `📝 <b>So‘rov turi:</b> ${escapeHtml(lead.inquiryType || 'Sinov darsi')}`,
    `🕒 <b>Qabul qilindi:</b> ${timeFormatted}`,
    ``,
    `📌 <b>Status:</b> <b>${escapeHtml(statusLabel)}</b>`,
    `👨‍💼 <b>Mas’ul:</b> ${escapeHtml(lead.assignedManagerName || 'Biriktirilmagan')}`,
  ];

  if (lead.preferredTime) {
    lines.push(`⏰ <b>Qulay vaqt:</b> ${escapeHtml(lead.preferredTime)}`);
  }
  if (lead.notes) {
    lines.push(`💬 <b>Izoh:</b> <i>${escapeHtml(lead.notes)}</i>`);
  }

  return lines.filter((l) => l !== null).join('\n');
}

export function buildLeadInlineKeyboard(
  lead: {
    id: string;
    referenceId: string;
    phone: string;
    status: string;
  },
  publicAppUrl: string = 'http://localhost:3000',
) {
  const isHttps = typeof publicAppUrl === 'string' && publicAppUrl.startsWith('https://');
  const detailsButton = isHttps
    ? { text: '📋 CRM da ko‘rish', url: `${publicAppUrl}/admin/crm/leads?search=${encodeURIComponent(lead.referenceId)}` }
    : { text: '📋 Tafsilotlar', callback_data: `lead:details:${lead.id}` };

  return {
    inline_keyboard: [
      [
        { text: '📞 Telefon raqami', callback_data: `lead:phone:${lead.id}` },
        { text: '✅ Bog‘lanildi', callback_data: `lead:contacted:${lead.id}` },
      ],
      [
        { text: '🔄 Qayta qo‘ng‘iroq', callback_data: `lead:callback:${lead.id}` },
        { text: '🎓 Sinov darsi', callback_data: `lead:trial:${lead.id}` },
      ],
      [
        { text: '🟢 Qabul qilindi', callback_data: `lead:enrolled:${lead.id}` },
        { text: '❌ Qiziqmadi', callback_data: `lead:not_interested:${lead.id}` },
      ],
      [
        { text: '👤 Operator olish', callback_data: `lead:assign:${lead.id}` },
        detailsButton,
      ],
    ],
  };
}

export interface SendLeadNotificationResult {
  success: boolean;
  messageId?: number;
  chatId?: string;
  error?: string;
}

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatIds: string[];
  private readonly operatorIds: string[];
  private readonly publicAppUrl: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('telegram.botToken') || '';
    this.chatIds = this.configService.get<string[]>('telegram.chatIds') || [];
    this.operatorIds = this.configService.get<string[]>('telegram.operatorIds') || [];
    this.publicAppUrl = this.configService.get<string>('publicAppUrl') || 'http://localhost:3000';

    if (!this.botToken || this.chatIds.length === 0) {
      this.logger.log('ℹ️ Telegram integratsiyasi sozlanmagan yoki o‘chirilgan. Bildirishnomalar logda aks etadi.');
    } else {
      this.logger.log(`✅ Telegram integratsiyasi faol (${this.chatIds.length} ta manzil chat ID mavjud).`);
    }
  }

  isConfigured(): boolean {
    return Boolean(this.botToken && this.chatIds.length > 0);
  }

  getOperatorIds(): string[] {
    return this.operatorIds;
  }

  isAuthorizedOperator(telegramUserId: string | number): boolean {
    if (!telegramUserId) return false;
    const sId = String(telegramUserId);
    if (this.operatorIds.includes(sId) || this.chatIds.includes(sId)) {
      return true;
    }
    return false;
  }

  /**
   * Send lead notification with inline action buttons to the operator channel/chat.
   */
  async sendLeadNotificationWithButtons(lead: {
    id: string;
    referenceId: string;
    fullName: string;
    phone: string;
    phoneFormatted: string;
    courseTitle: string;
    branchName: string;
    source: string;
    inquiryType?: string;
    preferredTime?: string | null;
    notes?: string | null;
    status: string;
    assignedManagerName?: string | null;
    telegramUsername?: string | null;
    createdAt?: Date;
  }): Promise<SendLeadNotificationResult> {
    const text = formatLeadNotificationHtml(lead);
    const replyMarkup = buildLeadInlineKeyboard(lead, this.publicAppUrl);

    if (!this.isConfigured()) {
      this.logger.log(`[Telegram Mock Broadcast]\n${text}`);
      return { success: true };
    }

    // Deliver to the primary operator chat
    const targetChatId = this.chatIds[0];
    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: targetChatId,
          text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });

      const responseData: any = await res.json().catch(() => null);

      if (!res.ok || !responseData?.ok) {
        const errMsg = responseData?.description || `HTTP ${res.status}`;
        this.logger.error(`Telegram xatoligi [Chat: ${targetChatId}]: ${errMsg}`);
        return { success: false, chatId: targetChatId, error: errMsg };
      }

      const messageId = responseData.result?.message_id;
      this.logger.log(`✅ Ariza #${lead.referenceId} xabarnomasi Telegramga yetkazildi (msg: ${messageId})`);
      return {
        success: true,
        messageId,
        chatId: targetChatId,
      };
    } catch (err: any) {
      this.logger.error(`Telegram so‘rovida xatolik [Chat: ${targetChatId}]: ${err.message}`);
      return { success: false, chatId: targetChatId, error: err.message };
    }
  }

  /**
   * Edit existing operator notification message when lead status or assignment changes.
   */
  async updateLeadNotificationMessage(
    chatId: string,
    messageId: number,
    lead: {
      id: string;
      referenceId: string;
      fullName: string;
      phone: string;
      phoneFormatted: string;
      courseTitle: string;
      branchName: string;
      source: string;
      inquiryType?: string;
      preferredTime?: string | null;
      notes?: string | null;
      status: string;
      assignedManagerName?: string | null;
      telegramUsername?: string | null;
      createdAt?: Date;
    },
  ): Promise<boolean> {
    if (!this.isConfigured() || !chatId || !messageId) {
      return false;
    }

    const text = formatLeadNotificationHtml(lead);
    const replyMarkup = buildLeadInlineKeyboard(lead, this.publicAppUrl);

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/editMessageText`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text,
          parse_mode: 'HTML',
          reply_markup: replyMarkup,
        }),
      });

      const responseData: any = await res.json().catch(() => null);
      if (!res.ok || !responseData?.ok) {
        this.logger.warn(`Telegram xabarni tahrirlashda xatolik: ${responseData?.description || res.statusText}`);
        return false;
      }

      this.logger.log(`🔄 Telegramdagi xabar #${messageId} status bilan sinxron yangilandi (${lead.status})`);
      return true;
    } catch (err: any) {
      this.logger.error(`Telegram editMessageText xatoligi: ${err.message}`);
      return false;
    }
  }

  /**
   * Status change simple alert
   */
  async sendStatusChangeNotification(info: {
    referenceId: string;
    fullName: string;
    fromStatus: string;
    toStatus: string;
    changedByName?: string;
  }): Promise<boolean> {
    const fromLabel = STATUS_LABELS[info.fromStatus] || info.fromStatus;
    const toLabel = STATUS_LABELS[info.toStatus] || info.toStatus;

    const text = [
      `🔄 <b>STATUS O‘ZGARISHI — USTOZ AKADEMIYASI</b>`,
      `🆔 <b>Ariza ID:</b> <code>${escapeHtml(info.referenceId)}</code>`,
      `👤 <b>Mijoz:</b> ${escapeHtml(info.fullName)}`,
      `📊 <b>Status:</b> ${escapeHtml(fromLabel)} ➡️ <b>${escapeHtml(toLabel)}</b>`,
      info.changedByName ? `👨‍💼 <b>Mas’ul:</b> ${escapeHtml(info.changedByName)}` : null,
      `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`,
    ]
      .filter(Boolean)
      .join('\n');

    return this.broadcastMessage(text);
  }

  private async broadcastMessage(text: string): Promise<boolean> {
    if (!this.isConfigured()) {
      this.logger.log(`[Telegram Mock Broadcast]\n${text}`);
      return true;
    }

    let allSucceeded = true;
    for (const chatId of this.chatIds) {
      try {
        const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
          }),
        });

        if (!res.ok) {
          const errData = await res.text();
          this.logger.error(`Telegram xatoligi [Chat: ${chatId}]: ${errData}`);
          allSucceeded = false;
        }
      } catch (err: any) {
        this.logger.error(`Telegram so‘rovida xatolik [Chat: ${chatId}]: ${err.message}`);
        allSucceeded = false;
      }
    }
    return allSucceeded;
  }
}
