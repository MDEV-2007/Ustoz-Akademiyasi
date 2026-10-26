import { InlineKeyboard } from 'grammy';
import { Branch } from '../types/api.types';
import { BOT_CALLBACK_PREFIXES } from '../config/constants';

export function getBranchesListKeyboard(branches: Branch[]): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  for (const branch of branches) {
    const cleanName = branch.name.replace(/ filiali$/i, '');
    const cleanArea = (branch.district || branch.area || '')
      .split('/')[0]
      .trim()
      .replace(/ tumani$/i, '')
      .replace(/ metro yo‘nalishi$/i, '');

    const label = cleanArea ? `🏛 ${cleanName} (${cleanArea})` : `🏛 ${branch.name}`;
    keyboard.text(label, `${BOT_CALLBACK_PREFIXES.BRANCH_DETAIL}${branch.slug}`).row();
  }

  keyboard.text('📝 Sinov darsiga yozilish', 'nav:register').row();
  keyboard.text('🏠 Bosh menyu', 'nav:main');

  return keyboard;
}

export function getBranchDetailKeyboard(branch: Branch): InlineKeyboard {
  const keyboard = new InlineKeyboard();

  keyboard.text('📝 Sinov darsiga yozilish', `${BOT_CALLBACK_PREFIXES.BRANCH_REGISTER}${branch.slug}`).row();

  // If verified coordinates exist
  if (branch.latitude && branch.longitude) {
    keyboard.text('📍 Telegram lokatsiya ko‘rish', `${BOT_CALLBACK_PREFIXES.BRANCH_MAP}${branch.slug}`).row();
    keyboard
      .url('🗺 Google Maps', `https://www.google.com/maps?q=${branch.latitude},${branch.longitude}`)
      .url('🚕 Yandex Xarita', `https://yandex.uz/maps/?pt=${branch.longitude},${branch.latitude}&z=16&l=map`)
      .row();
  }

  keyboard.text('🔙 Filiallar ro‘yxati', 'nav:branches');
  keyboard.text('🏠 Bosh menyu', 'nav:main');

  return keyboard;
}
