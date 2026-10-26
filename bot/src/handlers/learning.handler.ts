import { Composer } from 'grammy';
import { MyContext } from '../types/context';
import { apiClient } from '../services/api-client.service';
import { BOT_CALLBACK_PREFIXES, BOT_STRINGS } from '../config/constants';
import {
  getLearningMenuKeyboard,
  getAlphabetOverviewKeyboard,
  getAlphabetGroupKeyboard,
  getAlphabetQuizKeyboard,
  getArticlesListKeyboard,
  getArticleDetailKeyboard,
} from '../keyboards/learning.keyboard';
import { safeEditOrReply } from '../utils/formatters';

export const learningComposer = new Composer<MyContext>();

// -------------------------------------------------------------
// 1. Data Definitions for 4 Alphabet Groups
// -------------------------------------------------------------
const ALPHABET_GROUPS: Record<
  number,
  {
    title: string;
    range: string;
    letters: {
      num: number;
      name: string;
      glyph: string;
      translit: string;
      desc: string;
      exampleArabic: string;
      exampleTranslit: string;
      exampleMeaning: string;
    }[];
    quiz: {
      question: string;
      correctLetter: string;
      options: { label: string; isCorrect: boolean }[];
    };
  }
> = {
  1: {
    title: '1-guruh (1–7 harflar)',
    range: 'Alifdan Xogacha (ا — خ)',
    letters: [
      {
        num: 1,
        name: 'Alif',
        glyph: 'ا',
        translit: 'A / I / U',
        desc: 'Cho‘ziq unli yoki hamza uchun tayanch harf.',
        exampleArabic: 'أَدَبٌ',
        exampleTranslit: 'Adab',
        exampleMeaning: 'Odob, axloq',
      },
      {
        num: 2,
        name: 'Ba',
        glyph: 'ب',
        translit: 'B',
        desc: 'Ikki labning bir-biriga tegishidan chiquvchi jarangdor tovush.',
        exampleArabic: 'بَابٌ',
        exampleTranslit: 'Bab',
        exampleMeaning: 'Eshik',
      },
      {
        num: 3,
        name: 'Ta',
        glyph: 'ت',
        translit: 'T',
        desc: 'Til uchining yuqori tishlar tubiga tegishidan chiquvchi mayin T.',
        exampleArabic: 'تَمْرٌ',
        exampleTranslit: 'Tamr',
        exampleMeaning: 'Xurmo',
      },
      {
        num: 4,
        name: 'Sa',
        glyph: 'ث',
        translit: 'S / Th',
        desc: 'Til uchini tishlar orasiga chiqarib aytiladigan sirg‘aluvchi S.',
        exampleArabic: 'ثَمَرٌ',
        exampleTranslit: 'Samar',
        exampleMeaning: 'Meva, hosil',
      },
      {
        num: 5,
        name: 'Jim',
        glyph: 'ج',
        translit: 'J',
        desc: 'Til o‘rtasi tanglayga tegishidan hosil bo‘luvchi jarangdor J.',
        exampleArabic: 'جَمَلٌ',
        exampleTranslit: 'Jamal',
        exampleMeaning: 'Tuya',
      },
      {
        num: 6,
        name: 'Ha',
        glyph: 'ح',
        translit: 'H',
        desc: 'Tomoq o‘rtasidan chiquvchi nafis, mayin H tovushi.',
        exampleArabic: 'حَلِيبٌ',
        exampleTranslit: 'Halib',
        exampleMeaning: 'Sut',
      },
      {
        num: 7,
        name: 'Xo',
        glyph: 'خ',
        translit: 'X',
        desc: 'Tomoq yuqorisidan chiquvchi xirillovchi yo‘g‘on X tovushi.',
        exampleArabic: 'خُبْزٌ',
        exampleTranslit: 'Xubz',
        exampleMeaning: 'Non',
      },
    ],
    quiz: {
      question: 'Qaysi harf «Ba» (B tovushi) hisoblanadi?',
      correctLetter: 'ب',
      options: [
        { label: 'ت (Ta)', isCorrect: false },
        { label: 'ب (Ba)', isCorrect: true },
        { label: 'ث (Sa)', isCorrect: false },
        { label: 'ن (Nun)', isCorrect: false },
      ],
    },
  },
  2: {
    title: '2-guruh (8–14 harflar)',
    range: 'Daldan Sodgacha (د — ص)',
    letters: [
      {
        num: 8,
        name: 'Dal',
        glyph: 'د',
        translit: 'D',
        desc: 'Til uchi yuqori tishlar tubiga tegib ochilganda chiquvchi jarangdor D.',
        exampleArabic: 'دَرْسٌ',
        exampleTranslit: 'Dars',
        exampleMeaning: 'Dars, saboq',
      },
      {
        num: 9,
        name: 'Zal',
        glyph: 'ذ',
        translit: 'Z / Dh',
        desc: 'Til uchining tishlar orasiga chiqishi bilan hosil bo‘luvchi yumshoq Z.',
        exampleArabic: 'ذَهَبٌ',
        exampleTranslit: 'Zahab',
        exampleMeaning: 'Oltin',
      },
      {
        num: 10,
        name: 'Ro',
        glyph: 'ر',
        translit: 'R',
        desc: 'Til uchi orqasining yuqori tanglayga titrab tegishidan chiquvchi R.',
        exampleArabic: 'رَجُلٌ',
        exampleTranslit: 'Rajul',
        exampleMeaning: 'Kishi, erkak',
      },
      {
        num: 11,
        name: 'Za',
        glyph: 'ز',
        translit: 'Z',
        desc: 'Til uchining pastki tishlar orqasiga yaqinlashuvidan chiquvchi Z.',
        exampleArabic: 'زَهْرَةٌ',
        exampleTranslit: 'Zahra',
        exampleMeaning: 'Gul',
      },
      {
        num: 12,
        name: 'Sin',
        glyph: 'س',
        translit: 'S',
        desc: 'Jarangsiz, hushtaksimon mayin S tovushi.',
        exampleArabic: 'سَلَامٌ',
        exampleTranslit: 'Salam',
        exampleMeaning: 'Tinchlik, salom',
      },
      {
        num: 13,
        name: 'Shin',
        glyph: 'ش',
        translit: 'Sh',
        desc: 'Til o‘rtasining yuqori tanglayga yaqinlashuvidan chiquvchi Sh.',
        exampleArabic: 'شَمْسٌ',
        exampleTranslit: 'Shams',
        exampleMeaning: 'Quyosh',
      },
      {
        num: 14,
        name: 'Sod',
        glyph: 'ص',
        translit: 'S (yo‘g‘on)',
        desc: 'Til orqasi tanglayga ko‘tarilishi bilan hosil bo‘ladigan yo‘g‘on S.',
        exampleArabic: 'صَبَاحٌ',
        exampleTranslit: 'Sabah',
        exampleMeaning: 'Tong, ertalab',
      },
    ],
    quiz: {
      question: 'Qaysi harf «Ro» tovushini bildiradi?',
      correctLetter: 'ر',
      options: [
        { label: 'د (Dal)', isCorrect: false },
        { label: 'ر (Ro)', isCorrect: true },
        { label: 'ز (Za)', isCorrect: false },
        { label: 'ذ (Zal)', isCorrect: false },
      ],
    },
  },
  3: {
    title: '3-guruh (15–21 harflar)',
    range: 'Zoddan Qofgacha (ض — ق)',
    letters: [
      {
        num: 15,
        name: 'Zod',
        glyph: 'ض',
        translit: 'D/Z (yo‘g‘on)',
        desc: 'Tilning yon chetining yuqori oziq tishlarga tegishidan chiquvchi yo‘g‘on tovush.',
        exampleArabic: 'ضَوْءٌ',
        exampleTranslit: 'Zav’',
        exampleMeaning: 'Nur, yorug‘lik',
      },
      {
        num: 16,
        name: 'To',
        glyph: 'ط',
        translit: 'T (yo‘g‘on)',
        desc: 'Til uchi va usti tanglayga qoplanishidan chiquvchi yo‘g‘on T.',
        exampleArabic: 'طَالِبٌ',
        exampleTranslit: 'Tolib',
        exampleMeaning: 'Talaba, o‘quvchi',
      },
      {
        num: 17,
        name: 'Zo',
        glyph: 'ظ',
        translit: 'Z (yo‘g‘on)',
        desc: 'Til uchining tishlar orasidan chiqishi bilan hosil bo‘ladigan yo‘g‘on Z.',
        exampleArabic: 'ظِلٌّ',
        exampleTranslit: 'Zill',
        exampleMeaning: 'Soya',
      },
      {
        num: 18,
        name: 'Ayn',
        glyph: 'ع',
        translit: '‘ (Ayn)',
        desc: 'Tomoq o‘rtasining qisilishi bilan chiquvchi chuqur unli/undosh.',
        exampleArabic: 'عِلْمٌ',
        exampleTranslit: '‘Ilm',
        exampleMeaning: 'Ilm, bilim',
      },
      {
        num: 19,
        name: 'G‘oyn',
        glyph: 'غ',
        translit: 'G‘ (yo‘g‘on)',
        desc: 'Tomoq yuqorisidan chiquvchi yo‘g‘on, jarangdor G‘ tovushi.',
        exampleArabic: 'غُرْفَةٌ',
        exampleTranslit: 'G‘urfa',
        exampleMeaning: 'Xona',
      },
      {
        num: 20,
        name: 'Fa',
        glyph: 'ف',
        translit: 'F',
        desc: 'Yuqori kurak tishlar pastki lab ichki qismiga tegishi bilan chiquvchi F.',
        exampleArabic: 'فِكْرَةٌ',
        exampleTranslit: 'Fikra',
        exampleMeaning: 'Fikr, g‘oya',
      },
      {
        num: 21,
        name: 'Qof',
        glyph: 'ق',
        translit: 'Q (yo‘g‘on)',
        desc: 'Til tubining yumshoq tanglayga tegishidan chiquvchi qat’iy, chuqur Q.',
        exampleArabic: 'قَلَمٌ',
        exampleTranslit: 'Qalam',
        exampleMeaning: 'Qalam',
      },
    ],
    quiz: {
      question: 'Qaysi harf «Ayn» (ع) hisoblanadi?',
      correctLetter: 'ع',
      options: [
        { label: 'غ (G‘oyn)', isCorrect: false },
        { label: 'ع (Ayn)', isCorrect: true },
        { label: 'ح (Ha)', isCorrect: false },
        { label: 'ء (Hamza)', isCorrect: false },
      ],
    },
  },
  4: {
    title: '4-guruh (22–28 harflar)',
    range: 'Kafdan Yagacha (ك — ي)',
    letters: [
      {
        num: 22,
        name: 'Kaf',
        glyph: 'ك',
        translit: 'K',
        desc: 'Til tubining qattiq tanglayga tegishidan hosil bo‘ladigan mayin K.',
        exampleArabic: 'كِتَابٌ',
        exampleTranslit: 'Kitab',
        exampleMeaning: 'Kitob',
      },
      {
        num: 23,
        name: 'Lam',
        glyph: 'ل',
        translit: 'L',
        desc: 'Til uchi va ikki yonining yuqori milklarga tegishidan chiquvchi L.',
        exampleArabic: 'لِسَانٌ',
        exampleTranslit: 'Lisan',
        exampleMeaning: 'Til, nutq',
      },
      {
        num: 24,
        name: 'Mim',
        glyph: 'م',
        translit: 'M',
        desc: 'Ikki labning jipslashuvidan va burun rezonansidan hosil bo‘luvchi M.',
        exampleArabic: 'مَسْجِدٌ',
        exampleTranslit: 'Masjid',
        exampleMeaning: 'Masjid',
      },
      {
        num: 25,
        name: 'Nun',
        glyph: 'ن',
        translit: 'N',
        desc: 'Til uchining yuqori milkka tegishidan va dimoqdan chiquvchi N.',
        exampleArabic: 'نُورٌ',
        exampleTranslit: 'Nur',
        exampleMeaning: 'Nur, ziyo',
      },
      {
        num: 26,
        name: 'Hav',
        glyph: 'هـ',
        translit: 'H (yengil)',
        desc: 'Tomoq tubidan erkin nafas chiqishi bilan hosil bo‘ladigan yengil H.',
        exampleArabic: 'هِلَالٌ',
        exampleTranslit: 'Hilal',
        exampleMeaning: 'Hilol, yangi oy',
      },
      {
        num: 27,
        name: 'Vav',
        glyph: 'و',
        translit: 'V / U',
        desc: 'Lablarning oldinga cho‘chchayishi bilan hosil bo‘luvchi lab undoshi yoki cho‘ziq U.',
        exampleArabic: 'وَرْدٌ',
        exampleTranslit: 'Vard',
        exampleMeaning: 'Atirgul, gul',
      },
      {
        num: 28,
        name: 'Ya',
        glyph: 'ي',
        translit: 'Y / I',
        desc: 'Til o‘rtasining tanglayga yaqinlashuvi bilan chiquvchi Y yoki cho‘ziq I.',
        exampleArabic: 'يَدٌ',
        exampleTranslit: 'Yad',
        exampleMeaning: 'Qo‘l',
      },
    ],
    quiz: {
      question: 'Qaysi harf «Kitab» (كِتَابٌ) so‘zining boshidagi harf?',
      correctLetter: 'ك',
      options: [
        { label: 'ك (Kaf)', isCorrect: true },
        { label: 'ل (Lam)', isCorrect: false },
        { label: 'م (Mim)', isCorrect: false },
        { label: 'ق (Qof)', isCorrect: false },
      ],
    },
  },
};

// -------------------------------------------------------------
// 2. Menu Navigation Handlers
// -------------------------------------------------------------

learningComposer.hears(
  [
    BOT_STRINGS.MENU_LEARNING,
    '📖 Ta’lim resurslari',
    '📖 Arab tilini o‘rganish',
    '📖 Изучение арабского',
    '📖 Learn Arabic',
    /^📖 (Arab tilini o‘rganish|Ta’lim resurslari|Изучение арабского|Learn Arabic)/i,
  ],
  async (ctx) => {
    const lang = ctx.session.language || 'uz';
    const text =
      lang === 'ru'
        ? `📖 <b>Изучение арабского языка</b>\n\nИзучайте арабский язык по эффективной методике Ustoz Akademiyasi.\n\nВыберите нужный раздел:`
        : lang === 'en'
        ? `📖 <b>Learn Arabic</b>\n\nMaster the Arabic language systematically with Ustoz Akademiyasi.\n\nPlease select a section below:`
        : `📖 <b>Arab Tilini O‘rganish</b>\n\nUstoz Akademiyasining tizimli metodikasi bilan arab tilini oson va to‘g‘ri o‘rganing.\n\nQuyidagi bo‘limlardan birini tanlang:`;

    await ctx.reply(text, {
      reply_markup: getLearningMenuKeyboard(),
      parse_mode: 'HTML',
    });
  },
);

learningComposer.callbackQuery('nav:learning', async (ctx) => {
  await ctx.answerCallbackQuery();
  await safeEditOrReply(
    ctx,
    `📖 <b>Arab Tilini O‘rganish</b>\n\n` +
      `Ustoz Akademiyasining tizimli metodikasi bilan arab tilini oson va to‘g‘ri o‘rganing.\n\n` +
      `Quyidagi bo‘limlardan birini tanlang:`,
    { reply_markup: getLearningMenuKeyboard(), parse_mode: 'HTML' },
  );
});

// -------------------------------------------------------------
// 3. Alphabet Overview
// -------------------------------------------------------------

learningComposer.callbackQuery('learn_sec:alphabet', async (ctx) => {
  await ctx.answerCallbackQuery();

  const text =
    `📖 <b>Arab Alifbosi (Al-Huruf al-Hijaiyya)</b>\n\n` +
    `Arab tili alifbosi <b>28 ta asosiy harfdan</b> iborat bo‘lib, o‘ngdan chapga qarab o‘qiladi va yoziladi.\n\n` +
    `Harflarni qulay va tez o‘rganishingiz uchun 4 ta guruhga ajratdik:\n` +
    `• <b>1-guruh:</b> 1–7 harflar (ا — خ)\n` +
    `• <b>2-guruh:</b> 8–14 harflar (د — ص)\n` +
    `• <b>3-guruh:</b> 15–21 harflar (ض — ق)\n` +
    `• <b>4-guruh:</b> 22–28 harflar (ك — ي)\n\n` +
    `O‘rganishni boshlash uchun guruhlardan birini tanlang:`;

  await safeEditOrReply(ctx, text, {
    reply_markup: getAlphabetOverviewKeyboard(),
    parse_mode: 'HTML',
  });
});

// -------------------------------------------------------------
// 4. Alphabet Groups (1 to 4)
// -------------------------------------------------------------

learningComposer.callbackQuery(new RegExp(`^alpha_grp:([1-4])$`), async (ctx) => {
  const grpNum = parseInt(ctx.match[1], 10);
  await ctx.answerCallbackQuery();

  const grp = ALPHABET_GROUPS[grpNum];
  if (!grp) return;

  const parts: string[] = [];
  parts.push(`📖 <b>${grp.title} — ${grp.range}</b>\n`);

  for (const l of grp.letters) {
    parts.push(
      `<b>${l.num}. ${l.name} (${l.glyph})</b> [${l.translit}]\n` +
        `• <i>Makhraj:</i> ${l.desc}\n` +
        `• <i>Misol:</i> <b>${l.exampleArabic}</b> [${l.exampleTranslit}] — ${l.exampleMeaning}`,
    );
  }

  const text = parts.join('\n\n');

  await safeEditOrReply(ctx, text, {
    reply_markup: getAlphabetGroupKeyboard(grpNum),
    parse_mode: 'HTML',
  });
});

// -------------------------------------------------------------
// 5. Letter Recognition Interactive Quiz
// -------------------------------------------------------------

learningComposer.callbackQuery(new RegExp(`^alpha_quiz:([1-4])$`), async (ctx) => {
  const grpNum = parseInt(ctx.match[1], 10);
  await ctx.answerCallbackQuery();

  const grp = ALPHABET_GROUPS[grpNum];
  if (!grp) return;

  const text =
    `🎯 <b>${grp.title} Bilim Sinovi</b>\n\n` +
    `Savol: <b>${grp.quiz.question}</b>\n\n` +
    `To‘g‘ri javobni tanlang:`;

  await safeEditOrReply(ctx, text, {
    reply_markup: getAlphabetQuizKeyboard(grpNum, grp.quiz.options),
    parse_mode: 'HTML',
  });
});

learningComposer.callbackQuery(new RegExp(`^quiz_ans:([1-4]):([01])$`), async (ctx) => {
  const grpNum = parseInt(ctx.match[1], 10);
  const isCorrect = ctx.match[2] === '1';

  if (isCorrect) {
    await ctx.answerCallbackQuery({
      text: '🎉 Barakalloh! To‘g‘ri javob!',
      show_alert: true,
    });
  } else {
    await ctx.answerCallbackQuery({
      text: '❌ Noto‘g‘ri. Harf shaklini qayta ko‘rib chiqing va qayta urinib ko‘ring.',
      show_alert: true,
    });
  }
});

// -------------------------------------------------------------
// 6. Section 2: Pronunciation & Makhorij
// -------------------------------------------------------------

learningComposer.callbackQuery('learn_sec:pronunciation', async (ctx) => {
  await ctx.answerCallbackQuery();

  const text =
    `🗣 <b>Arab Tili Maxrajlari (Tovush o‘rinlari)</b>\n\n` +
    `Arab tilida harflar 5 ta asosiy nutq a’zosidan hosil bo‘ladi:\n\n` +
    `1. <b>Al-Javf (الْجَوْفُ) — Og‘iz bo‘shlig‘i:</b>\n` +
    `Cho‘ziq unlilar (Alif, Vav, Ya).\n\n` +
    `2. <b>Al-Halq (الْحَلْقُ) — Tomoq:</b>\n` +
    `ء , هـ , ع , ح , غ , خ harflari.\n\n` +
    `3. <b>Al-Lisan (اللِّسَانُ) — Til:</b>\n` +
    `18 ta harf tilning tubi, o‘rtasi va uchidan chiqadi.\n\n` +
    `4. <b>Ash-Shafatayn (الشَّفَتَانِ) — Lablar:</b>\n` +
    `ف , ب , م , و harflari lablar ishtirokida hosil bo‘ladi.\n\n` +
    `5. <b>Al-Xayshum (الْخَيْشُومُ) — Dimoq:</b>\n` +
    `G‘unna (dimoqdan chiquvchi ohang).\n\n` +
    `<i>Batafsil talaffuzni bepul sinov darsida ustoz bilan amaliy mashq qiling!</i>`;

  await safeEditOrReply(ctx, text, {
    reply_markup: getLearningMenuKeyboard(),
    parse_mode: 'HTML',
  });
});

// -------------------------------------------------------------
// 7. Section 3: Daily Phrases
// -------------------------------------------------------------

learningComposer.callbackQuery('learn_sec:phrases', async (ctx) => {
  await ctx.answerCallbackQuery();

  const text =
    `💬 <b>Kundalik Arabcha Iboralar</b>\n\n` +
    `• <b>السَّلَامُ عَلَيْكُمْ</b> [As-salamu alaykum] — Sizga tinchlik bo‘lsin\n` +
    `• <b>أَهْلًا وَسَهْلًا</b> [Ahlan va sahlan] — Xush kelibsiz\n` +
    `• <b>صَبَاحُ الْخَيْرِ</b> [Sabahul-xoyr] — Xayrli tong\n` +
    `• <b>مَسَاءُ الْخَيْرِ</b> [Masa’ul-xoyr] — Xayrli kech\n` +
    `• <b>شُكْرًا جَزِيلًا</b> [Shukran jazilan] — Katta rahmat\n` +
    `• <b>عَفْوًا</b> [Afvan] — Arzimaydi / Kechirasiz\n` +
    `• <b>كَيْفَ حَالُكَ؟</b> [Kayfa haluk?] — Ahvolingiz qanday?\n` +
    `• <b>الْحَمْدُ لِلَّهِ</b> [Alhamdulillah] — Allohga hamd bo‘lsin\n` +
    `• <b>مَعَ السَّلَامَةِ</b> [Ma’as-salama] — Salomat bo‘ling`;

  await safeEditOrReply(ctx, text, {
    reply_markup: getLearningMenuKeyboard(),
    parse_mode: 'HTML',
  });
});

// -------------------------------------------------------------
// 8. Section 4: Articles from Backend
// -------------------------------------------------------------

learningComposer.callbackQuery('learn_sec:articles', async (ctx) => {
  await ctx.answerCallbackQuery();

  try {
    const articles = await apiClient.getArticles({ limit: 10 });

    if (!articles || articles.length === 0) {
      await safeEditOrReply(ctx, 'ℹ️ Hozirda maqolalar mavjud emas.', {
        reply_markup: getLearningMenuKeyboard(),
        parse_mode: 'HTML',
      });
      return;
    }

    const text =
      `📄 <b>Ustoz Akademiyasi Maqolalari va Lug‘ati</b>\n\n` +
      `Quyidagi maqolalardan birini tanlang:`;

    await safeEditOrReply(ctx, text, {
      reply_markup: getArticlesListKeyboard(articles),
      parse_mode: 'HTML',
    });
  } catch {
    await ctx.reply('⚠️ Maqolalarni yuklashda xatolik yuz berdi.');
  }
});

learningComposer.callbackQuery(
  new RegExp(`^${BOT_CALLBACK_PREFIXES.LEARNING_ARTICLE}(.+)$`),
  async (ctx) => {
    const slug = ctx.match[1];
    await ctx.answerCallbackQuery();

    try {
      const article = await apiClient.getArticleBySlug(slug);

      let text = `📄 <b>${article.title}</b>\n\n${article.excerpt}\n\n`;

      if (article.items && article.items.length > 0) {
        text += `🔤 <b>Lug‘at:</b>\n`;
        for (const item of article.items.slice(0, 6)) {
          text += `• <b>${item.arabicText}</b> [${item.translit}] — ${item.translation}\n`;
        }
      }

      await safeEditOrReply(ctx, text, {
        reply_markup: getArticleDetailKeyboard(),
        parse_mode: 'HTML',
      });
    } catch {
      await ctx.reply('⚠️ Maqola ma’lumotini yuklab bo‘lmadi.');
    }
  },
);
