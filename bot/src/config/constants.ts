export type BotLanguage = 'uz' | 'ru' | 'en';

export interface LocalizedBotStrings {
  CHOOSE_LANGUAGE_PROMPT: string;
  MENU_COURSES: string;
  MENU_REGISTER: string;
  MENU_BRANCHES: string;
  MENU_TEACHERS: string;
  MENU_LEARNING: string;
  MENU_FAQ: string;
  MENU_CONTACT: string;
  MENU_LANG: string;
  BTN_BACK: string;
  BTN_CANCEL: string;
  BTN_MAIN_MENU: string;
  BTN_CONFIRM: string;
  BTN_EDIT: string;
  BTN_SHARE_PHONE: string;
  BTN_REGISTER_COURSE: string;
  BTN_REGISTER_BRANCH: string;
  BTN_OPEN_MAP: string;
  BTN_SEND_LOCATION: string;
  PRIVACY_NOTICE: string;
  HELP: string;
  WELCOME_HEADING: string;
  WELCOME_BODY: string;
  CHOOSE_SECTION: string;
  LANG_CHANGED: string;
}

export const BOT_LOCALIZED_STRINGS: Record<BotLanguage, LocalizedBotStrings> = {
  uz: {
    CHOOSE_LANGUAGE_PROMPT: `🌐 <b>Tilni tanlang / Выберите язык / Choose language:</b>\n\nIltimos, o‘zingizga qulay muloqot tilini tanlang 👇`,
    MENU_COURSES: '📚 Kurslar',
    MENU_REGISTER: '📝 Sinov darsiga yozilish',
    MENU_BRANCHES: '📍 Filiallar',
    MENU_TEACHERS: '👨‍🏫 Ustozlar',
    MENU_LEARNING: '📖 Arab tilini o‘rganish',
    MENU_FAQ: '❓ Savol-javob',
    MENU_CONTACT: '📞 Aloqa',
    MENU_LANG: '🌐 Tilni tanlash',
    BTN_BACK: '🔙 Orqaga',
    BTN_CANCEL: '❌ Bekor qilish',
    BTN_MAIN_MENU: '🏠 Bosh menyu',
    BTN_CONFIRM: '✅ Arizani yuborish',
    BTN_EDIT: '✏️ Ma’lumotlarni o‘zgartirish',
    BTN_SHARE_PHONE: '📱 Telefon raqamimni yuborish',
    BTN_REGISTER_COURSE: '📝 Sinov darsiga yozilish',
    BTN_REGISTER_BRANCH: '📝 Ushbu filialda o‘qish',
    BTN_OPEN_MAP: '🗺 Xaritada ochish',
    BTN_SEND_LOCATION: '📍 Lokatsiyani ko‘rish',
    PRIVACY_NOTICE: `🔒 <b>Maxfiylik eslatmasi:</b>\nKiritilgan ma’lumotlaringiz faqat dars jadvalini belgilash va siz bilan bog‘lanish uchun foydalaniladi. Ma’lumotlar uchinchi shaxslarga berilmaydi.`,
    HELP: `ℹ️ <b>Ustoz Akademiyasi bot yo‘riqnomasi</b>\n\nArab tilini sifatli va tizimli o‘rganishingiz uchun yordam beramiz:\n\n• 📚 <b>Kurslar</b> — Barcha darajadagi ta’lim yo‘nalishlari\n• 📝 <b>Sinov darsiga yozilish</b> — Bepul sinov darsi uchun tezkor ariza\n• 📍 <b>Filiallar</b> — Toshkentdagi 8 ta rasmiy filial manzillari va xaritalari\n• 👨‍🏫 <b>Ustozlar</b> — Kafedralar va malakali o‘qituvchilar jamoasi\n• ❓ <b>Savol-javob</b> — Ko‘p so‘raladigan savollarga javoblar\n• 📞 <b>Aloqa</b> — Call-markaz va ijtimoiy tarmoqlar\n\n<b>Buyruqlar:</b>\n/start — Botni qayta ishga tushirish\n/language — Muloqot tilini o‘zgartirish\n/help — Yordam ma’lumotlari\n/cancel — Ro‘yxatdan o‘tish jarayonini bekor qilish`,
    WELCOME_HEADING: 'Ustoz Akademiyasiga xush kelibsiz.',
    WELCOME_BODY: 'Arab tilini o‘rganish uchun kurslarimiz bilan tanishing, sinov darsiga yoziling yoki sizga yaqin filialni toping.\n\nQuyidagi bo‘limlardan birini tanlang:',
    CHOOSE_SECTION: 'Quyidagi bo‘limlardan birini tanlang 👇',
    LANG_CHANGED: '✅ Muloqot tili o‘zbek tiliga o‘zgartirildi.',
  },
  ru: {
    CHOOSE_LANGUAGE_PROMPT: `🌐 <b>Tilni tanlang / Выберите язык / Choose language:</b>\n\nПожалуйста, выберите удобный для вас язык общения 👇`,
    MENU_COURSES: '📚 Курсы',
    MENU_REGISTER: '📝 Запись на пробный урок',
    MENU_BRANCHES: '📍 Филиалы',
    MENU_TEACHERS: '👨‍🏫 Преподаватели',
    MENU_LEARNING: '📖 Изучение арабского',
    MENU_FAQ: '❓ Вопросы и ответы',
    MENU_CONTACT: '📞 Контакты',
    MENU_LANG: '🌐 Сменить язык',
    BTN_BACK: '🔙 Назад',
    BTN_CANCEL: '❌ Отмена',
    BTN_MAIN_MENU: '🏠 Главное меню',
    BTN_CONFIRM: '✅ Отправить заявку',
    BTN_EDIT: '✏️ Изменить данные',
    BTN_SHARE_PHONE: '📱 Отправить номер телефона',
    BTN_REGISTER_COURSE: '📝 Записаться на пробный урок',
    BTN_REGISTER_BRANCH: '📝 Записаться в этот филиал',
    BTN_OPEN_MAP: '🗺 Открыть на карте',
    BTN_SEND_LOCATION: '📍 Посмотреть локацию',
    PRIVACY_NOTICE: `🔒 <b>Политика конфиденциальности:</b>\nВаши данные используются исключительно для подбора группы и связи с вами. Данные третьим лицам не передаются.`,
    HELP: `ℹ️ <b>Руководство по боту Ustoz Akademiyasi</b>\n\nПомогаем качественно и системно изучать арабский язык:\n\n• 📚 <b>Курсы</b> — Все уровни обучения\n• 📝 <b>Запись на пробный урок</b> — Быстрая заявка на бесплатный урок\n• 📍 <b>Филиалы</b> — 8 официальных филиалов в Ташкенте и карта\n• 👨‍🏫 <b>Преподаватели</b> — Опытная команда педагогов\n• ❓ <b>Вопросы и ответы</b> — Ответы на частые вопросы\n• 📞 <b>Контакты</b> — Колл-центр и социальные сети\n\n<b>Команды:</b>\n/start — Перезапуск бота\n/language — Изменить язык\n/help — Справочная информация\n/cancel — Отменить текущее действие`,
    WELCOME_HEADING: 'Добро пожаловать в Ustoz Akademiyasi.',
    WELCOME_BODY: 'Познакомьтесь с курсами арабского языка, запишитесь на бесплатный пробный урок или найдите ближайший филиал.\n\nВыберите один из разделов ниже:',
    CHOOSE_SECTION: 'Выберите один из разделов ниже 👇',
    LANG_CHANGED: '✅ Язык общения изменен на русский.',
  },
  en: {
    CHOOSE_LANGUAGE_PROMPT: `🌐 <b>Tilni tanlang / Выберите язык / Choose language:</b>\n\nPlease select your preferred language 👇`,
    MENU_COURSES: '📚 Courses',
    MENU_REGISTER: '📝 Sign up for trial',
    MENU_BRANCHES: '📍 Branches',
    MENU_TEACHERS: '👨‍🏫 Teachers',
    MENU_LEARNING: '📖 Learn Arabic',
    MENU_FAQ: '❓ FAQ',
    MENU_CONTACT: '📞 Contact',
    MENU_LANG: '🌐 Change language',
    BTN_BACK: '🔙 Back',
    BTN_CANCEL: '❌ Cancel',
    BTN_MAIN_MENU: '🏠 Main menu',
    BTN_CONFIRM: '✅ Submit application',
    BTN_EDIT: '✏️ Edit details',
    BTN_SHARE_PHONE: '📱 Share phone number',
    BTN_REGISTER_COURSE: '📝 Sign up for trial',
    BTN_REGISTER_BRANCH: '📝 Study at this branch',
    BTN_OPEN_MAP: '🗺 Open on map',
    BTN_SEND_LOCATION: '📍 View location',
    PRIVACY_NOTICE: `🔒 <b>Privacy Notice:</b>\nYour information is used solely to schedule your class and contact you. We never share your data with third parties.`,
    HELP: `ℹ️ <b>Ustoz Akademiyasi Bot Guide</b>\n\nWe provide professional and structured Arabic language education:\n\n• 📚 <b>Courses</b> — Programs for all levels\n• 📝 <b>Trial Lesson</b> — Quick sign-up for a free trial\n• 📍 <b>Branches</b> — 8 official branches across Tashkent\n• 👨‍🏫 <b>Teachers</b> — Qualified native and academic faculty\n• ❓ <b>FAQ</b> — Answers to frequently asked questions\n• 📞 <b>Contact</b> — Call center and social media channels\n\n<b>Commands:</b>\n/start — Restart bot\n/language — Change language\n/help — Help and guidance\n/cancel — Cancel current process`,
    WELCOME_HEADING: 'Welcome to Ustoz Akademiyasi.',
    WELCOME_BODY: 'Explore our Arabic language courses, sign up for a free trial lesson, or find a branch near you.\n\nPlease choose an option below:',
    CHOOSE_SECTION: 'Please choose an option below 👇',
    LANG_CHANGED: '✅ Language switched to English.',
  },
};

// Backward-compatible default strings (defaulting to Uzbek)
export const BOT_STRINGS = BOT_LOCALIZED_STRINGS.uz;

export const BOT_CALLBACK_PREFIXES = {
  COURSE_PAGE: 'c_p:',
  COURSE_DETAIL: 'c_d:',
  COURSE_REGISTER: 'c_r:',
  BRANCH_PAGE: 'b_p:',
  BRANCH_DETAIL: 'b_d:',
  BRANCH_REGISTER: 'b_r:',
  BRANCH_MAP: 'b_m:',
  TEACHER_DETAIL: 't_d:',
  FAQ_CATEGORY: 'faq_c:',
  FAQ_ITEM: 'faq_i:',
  LEARNING_TOPIC: 'learn_t:',
  LEARNING_ARTICLE: 'learn_a:',
  ADMIN_PAGE: 'adm_p:',
  ADMIN_STATUS: 'adm_s:',
  ADMIN_LEAD: 'adm_l:',
  LANGUAGE: 'lang:',
};
