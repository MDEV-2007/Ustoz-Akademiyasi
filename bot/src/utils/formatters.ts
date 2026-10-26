export function escapeHtml(str?: string | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatPrice(amount?: number | string | null, currency: string = 'so‘m'): string {
  if (!amount) return '';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return String(amount);
  return `${num.toLocaleString('uz-UZ')} ${currency}`;
}

export async function safeEditOrReply(
  ctx: any,
  text: string,
  options?: any
): Promise<void> {
  const isPhotoMessage = Boolean(ctx.callbackQuery?.message && 'photo' in ctx.callbackQuery.message);

  if (isPhotoMessage) {
    try {
      await ctx.deleteMessage();
    } catch {
      // ignore if deletion fails
    }
    await ctx.reply(text, options);
    return;
  }

  try {
    await ctx.editMessageText(text, options);
  } catch (err: any) {
    if (
      err?.message?.includes('no text in the message') ||
      err?.message?.includes('message to edit not found') ||
      err?.description?.includes('there is no text in the message')
    ) {
      await ctx.reply(text, options);
    } else {
      throw err;
    }
  }
}
