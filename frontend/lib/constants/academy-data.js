/**
 * Ustoz Akademiyasi — Verified Business Data & Educational Content Constants
 * Grounded in authentic academy records, Tashkent branch network, and verified curriculum.
 */

export const INITIAL_BRAND_CONFIG = {
  name: 'Ustoz Akademiyasi',
  sloganPrimary: "O'QI VA KO'TARIL!",
  sloganSecondary: 'Zulmatlardan Nur tomon',
  phoneDisplay: '+998 55 518 44 00',
  phoneHref: 'tel:+998555184400',
  phoneRaw: '+998555184400',
  instagramHandle: '@ustoz_akademiyasi',
  instagramUrl: 'https://instagram.com/ustoz_akademiyasi',
  instagramFollowers: '134K+',
  instagramPosts: '716+',
  telegramHandle: '@ustozakademiyasi',
  telegramUrl: 'https://t.me/ustozakademiyasi',
  facebookHandle: 'hiloltalimuz',
  facebookUrl: 'https://www.facebook.com/hiloltalimuz/',
  telegramSubscribers: '1,707+',
  telegramPhotos: '764',
  telegramVideos: '270',
  telegramPolls: '116',
  graduatesInstagram: '15,000+',
  graduatesTelegram: '5,000+',
  branchesCount: 8,
  city: 'Toshkent shahri'
};

export const INITIAL_COURSES = [
  {
    slug: 'hilol-kids',
    title: 'Hilol Kids 4+',
    category: 'Bolalar uchun',
    audience: '4 yosh va undan katta bolajonlar uchun',
    level: "Boshlang'ich (0 dan)",
    shortSummary:
      "Farzandingizni arab tiliga ibratli multfilmlar, raqam va so'z topish o'yinlari hamda ko'rgazmali mashg'ulotlar orqali qiziqtirib o'rgatuvchi maxsus dastur.",
    methodology:
      "Telegram va Instagram sahifalarimizda namoyish etilganidek, darslar bolajonlar sevib tomosha qiladigan multfilmlarning maxsus arabcha talqini hamda «Bolajonlar bilan raqamlarni topish o'yini» kabi jamoaviy mashg'ulotlar asosida olib boriladi.",
    entryRequirements: "4 yoshdan boshlab qabul qilinadi. Oldindan harf tanish talab etilmaydi.",
    durationNote: "Bosqichma-bosqich o'quv dasturi (guruh jadvali filial ma'muriyati bilan belgilanadi)",
    priceStatus: "Oylik to'lov miqdori tanlangan filial va guruh jadvaliga ko'ra +998 55 518 44 00 orqali tasdiqlanadi",
    objectives: [
      "Arab alifbosidagi 28 ta harfni rangli kartochkalar va o'yinlar yordamida tanish",
      "Arab raqamlari (١ dan ١٠ gacha) va kundalik buyumlar nomini eslab qolish",
      "Maxsus dublyaj qilingan ibratli multfilmlar orqali eshitib tushunish ko'nikmasini shakllantirish",
      "Bolalar psixologiyasiga mos muhitda talaffuzni to'g'ri shakllantirish"
    ],
    syllabus: [
      {
        module: '1-bosqich: Harflar va Tovushlar olami',
        topics: "Alifbo harflarini ko'rgazmali plakatlar va talaffuz o'yinlari orqali o'zlashtirish."
      },
      {
        module: '2-bosqich: Arabcha raqamlar va kundalik lug‘at',
        topics: "Raqamlarni topish o'yini, oila a'zolari, ranglar va tabiatga oid eng kerakli so'zlar."
      },
      {
        module: '3-bosqich: Multfilm va Jonli nutq',
        topics: "Qisqa arabcha multfilmlarni ko'rish, qahramonlar iboralarini takrorlash va kichik dialoglar."
      }
    ],
    faq: [
      {
        q: 'Farzandim hali o‘qish va yozishni bilmaydi, kursga qatnasha oladimi?',
        a: 'Ha, Hilol Kids 4+ dasturi aynan 4 yoshdan boshlab harf tanimaydigan bolajonlar uchun eshitish, ko‘rish va o‘yin metodikasi asosida tuzilgan.'
      },
      {
        q: 'Multfilmlar qayerdan olinadi?',
        a: 'Markazimiz bolalar sevib tomosha qiladigan foydali multfilmlarning maxsus arabcha o‘quv variantlarini tayyorlagan (rasmiy Telegram kanalimizda ham namunalari mavjud).'
      }
    ],
    plateType: 'kids-numbers'
  },
  {
    slug: 'professional-fonetika',
    title: 'Professional Fonetika',
    category: "Boshlang'ich",
    audience: 'Arab tilini 0 dan boshlovchi o‘smirlar va kattalar',
    level: 'A1 — Harflar maxraji va to‘g‘ri o‘qish',
    shortSummary:
      "Arab harflarini o'zbek tovushlariga o'xshatmasdan, o'zining asl maxraji (chiqish nuqtasi) va sifatlaridan to'g'ri talaffuz qilish hamda ravon o'qish kursi.",
    methodology:
      "Har bir harfning artikulyatsion o'rni (bo'g'iz, til, lablar) ustoz nazoratida individual mashq qilinadi. Harakatlar (fatha, kasra, damma), tanvin, sukun va tashdid qoidalari amaliy matnlar ustida mustahkamlanadi.",
    entryRequirements: "Arab tilini umuman bilmaydigan (0 dan boshlovchi) yoki talaffuzini to'g'rilamoqchi bo'lganlar uchun.",
    durationNote: "Boshlang'ich fonetika va o'qish bosqichi (guruh jadvali filialda aniqlashtiriladi)",
    priceStatus: "Kurs to'lovi va dars vaqtlari +998 55 518 44 00 call-markazi orqali ma'lum qilinadi",
    objectives: [
      "28 ta arab harfining aniq maxrajini (talaffuz nuqtasini) amaliy o'zlashtirish",
      "Qalin va ingichka harflarni bir-biridan xatosiz farqlash",
      "Harflarning so'z boshida, o'rtasida va oxirida bog'lanish shakllarini yozish va o'qish",
      "Harakatli arabcha so'z va jumlalarni ravon o'qish darajasiga chiqish"
    ],
    syllabus: [
      {
        module: '1-modul: Bo‘g‘iz va Til tubi harflari maxraji',
        topics: "Alif, Ha, Xo, Ayn, G'ayn, Qof va Kaf harflarining to'g'ri talaffuzi va harakatlar."
      },
      {
        module: '2-modul: Til o‘rtasi, uchi va Lab harflari',
        topics: "Jim, Shin, Sod, Dod, To, Zo hamda sirg'aluvchi harflar ustida fonetik mashqlar."
      },
      {
        module: '3-modul: Cho‘ziq unlilar (Mad), Sukun va Tashdid',
        topics: "Murakkab bo'g'inli so'zlarni to'xtab va ulab o'qish amaliyoti."
      }
    ],
    faq: [
      {
        q: 'Nima uchun grammatikadan oldin Professional Fonetika o‘qilishi shart?',
        a: 'Arab tilida bitta harfning maxraji o‘zgarsa, so‘zning ma’nosi butunlay o‘zgarib ketadi. Shu bois poydevor to‘g‘ri maxrajdan boshlanadi.'
      }
    ],
    plateType: 'phonetics-calligraphy'
  },
  {
    slug: 'grammatika-va-cefr',
    title: 'Grammatika va CEFR',
    category: 'Sertifikat',
    audience: 'Tizimli grammatika hamda Milliy/Xalqaro sertifikat (CEFR) maqsad qilganlar',
    level: 'A2 – B1 – B2 – C1 bosqichlari',
    shortSummary:
      "Arab tili grammatikasi (Sarf va Nahv) qoidalarini chuqur o'zlashtirish hamda to'rtta ko'nikma bo'yicha CEFR va milliy sertifikat imtihonlariga tizimli tayyorlov.",
    methodology:
      "C1 darajali tajribali ustozlar metodikasi asosida o'quvchilarga so'z yasalishi (Sarf), gap tuzilishi (Nahv), o'qib tushunish (Reading), tinglab tushunish (Listening), yozma nutq (Writing) va og'zaki nutq (Speaking) kompleks o'rgatiladi.",
    entryRequirements: "Arab harflarida ravon o'qiy olish va yozish ko'nikmasi (Fonetika bosqichini tugatgan bo'lish).",
    durationNote: "Darajalar kesimida tizimli kurs (kirish suhbati/testi orqali mos guruhga joylashtiriladi)",
    priceStatus: "Daraja va guruh turiga ko'ra +998 55 518 44 00 orqali tasdiqlanadi",
    objectives: [
      "Arab tilida fe'l boblarini, zamonlarni va ism turlarini (Sarf) mustaqil tahlil qilish",
      "Murakkab gap tuzilishi va e'rob qoidalarini (Nahv) matnlarda qo'llash",
      "Harakatsiz (vokalsiz) zamonaviy va klassik arab matnlarini o'qib tushunish",
      "CEFR imtihonining 4 ta bo'limi bo'yicha test va insho yozish ko'nikmalarini shakllantirish"
    ],
    syllabus: [
      {
        module: '1-modul: Fundamental Sarf va Nahv asoslari',
        topics: "Ismiy va fe'liy jumlalar, olmoshlar, ko'plik shakllari va zamonlar tizimi."
      },
      {
        module: '2-modul: Akademik lug‘at va Matn tahlili',
        topics: "Maqolalar, rasmiy matnlar va audio materiallarni tahlil qilish."
      },
      {
        module: '3-modul: CEFR Imtihon Strategiyasi (Reading, Listening, Writing, Speaking)',
        topics: "Vaqt taqsimoti, esse tuzilishi va og'zaki suhbat savollariga mantiqiy javob berish."
      }
    ],
    faq: [
      {
        q: 'Darajamni bilmasam, qaysi guruhdan boshlayman?',
        a: 'Sinov darsiga yozilganingizda ustozlarimiz o‘qish va grammatik bilimingizni tekshirib, sizga eng mos bosqichni tavsiya etadilar.'
      }
    ],
    plateType: 'graduation-cefr'
  },
  {
    slug: 'kundalik-va-kasbiy-arab-tili',
    title: 'Kundalik va Kasbiy Arab Tili',
    category: 'Muloqot',
    audience: 'Sayohat, kundalik muloqot va arab tiliga oid kasblarga qiziquvchilar',
    level: "Boshlang'ich va O'rta darajalar",
    shortSummary:
      "Kundalik hayotda eng ko'p ishlatiladigan arabcha so'z va iboralar, shuningdek arab tilini bilish orqali эгаllash mumkin bo'lgan kasbiy yo'nalishlar uchun amaliy muloqot kursi.",
    methodology:
      "Markazimizning «Kundalik hayotda kerak bo'ladigan 10 ta Arabcha so'z» va «Arab tilidagi kasblar» mavzusidagi o'quv materiallari asosida jonli vaziyatlar (aeroport, bozor, mehmonxona, ish suhbati) modellashtiriladi.",
    entryRequirements: "Boshlang'ich o'qish ko'nikmasi tavsiya etiladi.",
    durationNote: "Amaliy so'zlashuv va lug'at boyitish dasturi",
    priceStatus: "Filial ma'muriyati bilan +998 55 518 44 00 orqali aniqlashtiriladi",
    objectives: [
      "Kundalik hayotda eng ko'p qo'llaniladigan faol so'z va iboralarni erkin ishlatish",
      "Safar, ziyorat va mehmonxona vaziyatlarida mustaqil muloqot qilish",
      "Arab tili bilan bog'liq zamonaviy kasbiy terminologiyani tushunish",
      "Eshitib tushunish va og'zaki javob qaytarish tezligini oshirish"
    ],
    syllabus: [
      {
        module: '1-modul: Kundalik muloqot va Tanishuv',
        topics: "Salomlashish, hol-ahvol so'rash, oila, vaqt va kundalik ehtiyoj iboralari."
      },
      {
        module: '2-modul: Safar, Ziyorat va Xizmat ko‘rsatish',
        topics: "Yo'l so'rash, xarid qilish, transport va tibbiy yordam vaziyatlarida suhbat."
      },
      {
        module: '3-modul: Arab tilidagi kasblar va Rasmiy muomala',
        topics: "Tarjimonlik, ta'lim, turizm va xalqaro hamkorlik sohalaridagi asosiy tushunchalar."
      }
    ],
    faq: [
      {
        q: 'Bu kurs faqat grammatikadan iboratmi?',
        a: 'Yo‘q, ushbu yo‘nalishda asosiy urg‘u og‘zaki nutq, faol iboralar va amaliy vaziyatlarda gapirishga qaratiladi.'
      }
    ],
    plateType: 'careers-chalkboard'
  }
];

export const INITIAL_BRANCHES = [
  {
    slug: 'archakocha',
    name: "Archako'cha filiali",
    officialLabel: "ARCHAKO'CHA FILIALI",
    area: "Shayxontohur / Ko'kcha yo'nalishi",
    addressNote: "Archa ko‘cha, Kichik halqa yo‘li 66",
    landmark: "Shofayz ko‘prigi yaqinida",
    image: "/branches/branch_archakocha.png",
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR', 'Kundalik va Kasbiy Arab Tili'],
    highlight: "Barcha asosiy o'quv yo'nalishlari va sinov darslari faol olib boriladigan filial."
  },
  {
    slug: 'yangi-toshmi',
    name: 'Yangi ToshMI filiali',
    officialLabel: 'YANGI TOSHMI FILIALI',
    area: 'Olmazor / Yangi ToshMI hududi',
    addressNote: 'Farovon 1',
    landmark: 'Makro chorrahasi',
    image: '/branches/branch_toshmi.png',
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR'],
    highlight: 'Talabalar, kattalar va bolajonlar uchun qulay o‘quv xonalariga ega filial.'
  },
  {
    slug: 'qoraqamish',
    name: 'Qoraqamish filiali',
    officialLabel: 'QORAQAMISH FILIALI',
    area: 'Olmazor / Qoraqamish dahasi',
    addressNote: 'Qoraqamish 2/1',
    landmark: '“Zeb-ziynat” to‘yxonasi yonida',
    image: '/branches/branch_qoraqamish.png',
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR', 'Kundalik va Kasbiy Arab Tili'],
    highlight: "Instagram sahifamizda yoritilganidek, tantanali bitiruv tadbirlari va sertifikat topshirish marosimlari o'tkaziladigan faol filial."
  },
  {
    slug: 'algoritm',
    name: 'Algoritm filiali',
    officialLabel: 'ALGORITM FILIALI',
    area: 'Uchtepa tumani',
    addressNote: 'Sugalli ota ko‘chasi, 56/1-uy',
    landmark: '“Zarhal” to‘yxonasi ro‘parasida',
    image: '/branches/branch_algoritm.png',
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR'],
    highlight: 'Algoritm va unga tutash hududlardagi o‘quvchilar uchun qulay filial.'
  },
  {
    slug: 'yunusobod',
    name: 'Yunusobod filiali',
    officialLabel: 'YUNUSOBOD FILIALI',
    area: 'Yunusobod tumani',
    addressNote: 'Yunusobod 18-kvartal, 48B',
    landmark: 'Havas do‘koni 2-qavat',
    image: '/branches/branch_yunusobod.png',
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR', 'Kundalik va Kasbiy Arab Tili'],
    highlight: 'Yunusobod tumani aholisi va yoshlari uchun barcha bosqichdagi arab tili guruhlari.'
  },
  {
    slug: 'sergeli',
    name: 'Sergeli filiali',
    officialLabel: 'SERGILI FILIALI',
    area: 'Sergeli tumani',
    addressNote: 'Sergeli-VII dahasi, 29B',
    landmark: '3-metro (Sergili) bekati',
    image: '/branches/branch_sergeli.png',
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR'],
    highlight: 'Sergeli hududida bolajonlar va kattalar uchun tizimli arab tili darslari.'
  },
  {
    slug: 'tinchlik',
    name: 'Tinchlik filiali',
    officialLabel: 'TINCHLIK FILIALI',
    area: 'Shayxontohur / Olmazor',
    addressNote: 'Chig‘atoy darvoza 2A',
    landmark: 'Olmazor yong‘in xavfsizligi bo‘limi, Tinchlik metrosi',
    image: '/branches/branch_tinchlik.png',
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR'],
    highlight: 'Transport va metroga yaqin hududda joylashgan qulay filial.'
  },
  {
    slug: 'kattaqani',
    name: 'Katta qani filiali',
    officialLabel: 'KATTA QANI FILIALI',
    area: 'Uchtepa tumani',
    addressNote: 'Qurilish 3-tor ko‘chasi, 3A',
    landmark: '“Doka xleb” ro‘parasi',
    image: '/branches/branch_kattaqani.png',
    hours: 'Dushanba – Shanba (guruhlar jadvali bo‘yicha)',
    coursesAvailable: ['Hilol Kids 4+', 'Professional Fonetika', 'Grammatika va CEFR', 'Kundalik va Kasbiy Arab Tili'],
    highlight: 'Uchtepa va Katta Qani hududidagi o‘quvchilar uchun qulay sharoitlarga ega faol filial.'
  }
];

export const INITIAL_GRADUATES = [
  {
    id: 'grad-group-1',
    name: "Boshlang'ich Arab tili guruhi",
    teacher: 'Ustoz: Muhammad Nur',
    course: "Boshlang'ich Arab tili kursi",
    certificate: 'Fonetika va Boshlang‘ich rasmiy sertifikatlari',
    date: '2026',
    image: '/graduates/boshlangich_guruh_bitiruvchilari.jpg',
    quote: "Ustoz Muhammad Nur guruhi o'quvchilari fonetika va boshlang'ich arab tili bosqichini a'lo natijalar bilan tamomladilar.",
    badge: 'Guruhiy Bitiruv',
    achievement: "Ustoz Muhammad Nur guruhi to'liq tarkibda sertifikat oldi",
    isGroup: true,
    category: 'adults'
  },
  {
    id: 'grad-1',
    name: 'Hikmatullayev Xamidullo',
    course: 'Arab tili fonetikasi kursi',
    certificate: 'Maxraj va Fonetika sertifikati',
    date: '2026',
    image: '/graduates/hikmatullayev_xamidullo.png',
    quote: 'Arab harflari maxrajini to‘g‘ri o‘zlashtirib, Qur’on va arab matnlarini ravon o‘qish darajasiga erishdim.',
    badge: 'Fonetika Bitiruvchisi',
    achievement: 'A’lo baholar bilan tamomladi',
    category: 'adults'
  },
  {
    id: 'grad-2',
    name: 'To‘raboyev Bilol',
    course: 'Arab tili fonetikasi kursi',
    certificate: 'Maxraj va Fonetika sertifikati',
    date: '2026',
    image: '/graduates/toraboyev_bilol.png',
    quote: 'Ustozlar metodikasi tufayli qisqa muddatda harflarni bexato talaffuz qilishni o‘rgandim.',
    badge: 'Fonetika Bitiruvchisi',
    achievement: 'Maxsus sovg‘a va sertifikat sohibi',
    category: 'adults'
  },
  {
    id: 'grad-3',
    name: 'Alimov Abdulbosit',
    course: 'Arab tili fonetikasi kursi',
    certificate: 'Maxraj va Fonetika sertifikati',
    date: '2026',
    image: '/graduates/alimov_abdulbosit.png',
    quote: 'Darslar juda qiziqarli o‘tdi, yakuniy imtihondan a’lo bahoga o‘tib rasmiy sertifikat oldim.',
    badge: 'Fonetika Bitiruvchisi',
    achievement: 'Amaliy talaffuz bo‘yicha yuqori natija',
    category: 'adults'
  },
  {
    id: 'grad-4',
    name: 'Akbarov Mirsolih',
    course: 'Arab tili fonetikasi kursi',
    certificate: 'Maxraj va Fonetika sertifikati',
    date: '2026',
    image: '/graduates/akbarov_mirsolih.png',
    quote: 'Ustoz Akademiyasida tahsil olib, fonetika bosqichini muvaffaqiyatli tamomladim.',
    badge: 'Fonetika Bitiruvchisi',
    achievement: 'Mukammal maxraj sohibi',
    category: 'adults'
  },
  {
    id: 'grad-5',
    name: 'Olimov Muhammadamin',
    course: 'Arab tili fonetikasi kursi',
    certificate: 'Maxraj va Fonetika sertifikati',
    date: '2026',
    image: '/graduates/olimov_muhammadamin.png',
    quote: 'Arab tilini 0 dan boshlab, bugun rasmiy sertifikat sohibi bo‘lganimdan faxrlanaman.',
    badge: 'Fonetika Bitiruvchisi',
    achievement: 'Faol va namunali o‘quvchi',
    category: 'adults'
  }
];

export const INITIAL_KIDS_GRADUATES = [
  {
    id: 'kids-grad-1',
    title: 'Bitiruvchilarimiz taqdirlandi 🥳',
    subtitle: 'Ustoz Kids — Kichkintoylarimiz bitiruv marosimi',
    course: 'Hilol Kids 4+ dasturi',
    certificate: 'Hilol Kids rasmiy sertifikati va Oltin medallari',
    image: '/graduates/kids_bitiruvchilar.png',
    quote: 'Bolajonlarimiz o‘yinlar, ko‘rgazmali darslar va arabcha multfilmlar yordamida harflarni bexato o‘zlashtirib, birinchi katta natijalariga erishdilar!',
    badge: 'Kids Bitiruvchilar 🥳',
    achievement: 'Oltin medal va tojlari bilan taqdirlandi',
    category: 'kids'
  }
];

export const INITIAL_ARTICLES = [
  {
    slug: 'kundalik-hayotda-kerak-boladigan-10-ta-arabcha-soz',
    title: "Kundalik hayotda kerak bo'ladigan 10 ta Arabcha so'z va ibora",
    topic: "Kundalik lug'at",
    readTime: '4 daqiqa',
    sourceNote: 'Instagram (@ustoz_akademiyasi) rasmiy o‘quv rukni asosida',
    excerpt:
      "Arab tilini o'rganishni boshlagan har bir inson kundalik suhbatda, salomlashishda va o'zaro hurmat bildirishda eng ko'p ishlatadigan 10 ta muhim ibora.",
    intro:
      "Til o'rganishning eng samarali usuli — har kuni eng ko'p takrorlanadigan jonli so'zlarni to'g'ri talaffuz bilan nutqqa kiritishdir. Ustoz Akademiyasi ustozlari kundalik muloqotda eng zarur bo'lgan 10 ta arabcha so'z va iborani jamlab chiqdilar.",
    items: [
      { ar: 'السَّلَامُ عَلَيْكُمْ', tr: 'As-salamu alaykum', uz: 'Sizga tinchlik va omonlik bo‘lsin (Salomlashish)' },
      { ar: 'كَيْفَ حَالُكَ؟', tr: 'Kayfa haluka / haluki?', uz: 'Ahvolingiz qanday?' },
      { ar: 'بِخَيْرٍ، الْحَمْدُ لِلَّهِ', tr: 'Bixoyrin, alhamdulillah', uz: 'Yaxshiman, shukr' },
      { ar: 'شُكْرًا جَزِيلًا', tr: 'Shukron jazilan', uz: 'Katta rahmat / Tashakkur' },
      { ar: 'عَفْوًا', tr: 'Afvan', uz: 'Arzimaydi / Kechirasiz' },
      { ar: 'مِنْ فَضْلِكَ', tr: 'Min fadlika', uz: 'Iltimos / Marhamat qilib' },
      { ar: 'نَعَمْ / لَا', tr: "Na'am / Laa", uz: "Ha / Yo'q" },
      { ar: 'حَسَنًا', tr: 'Hasanan', uz: 'Yaxshi / Tushunarli' },
      { ar: 'مَا اسْمُكَ؟', tr: 'Masmuka / Masmuki?', uz: 'Ismingiz nima?' },
      { ar: 'مَعَ السَّلَامَةِ', tr: "Ma'as-salama", uz: 'Xayr, omonlikda ko‘rishguncha' }
    ],
    relatedCourseSlug: 'kundalik-va-kasbiy-arab-tili'
  },
  {
    slug: 'arab-tilini-organishdagi-5-ta-muhim-sir',
    title: "Arab tilini oson o'rganishdagi 5 ta muhim sir",
    topic: 'Metodika va Tavsiya',
    readTime: '5 daqiqa',
    sourceNote: 'Telegram (t.me/ustozakademiyasi) kanalidagi maxsus qo‘llanma asosida',
    excerpt:
      "Nima uchun ba'zi o'quvchilar arab tilini oylar davomida qiynalib o'rganadi, tizimli yondashganlar esa qisqa vaqtda ravon o'qish va tushunishga chiqadi?",
    intro:
      "Rasmiy Telegram kanalimizning qadab qo'yilgan (pinned) xabarida ta'kidlanganidek, arab tilini oson o'zlashtirish uchun tartibli poydevor zarur. Quyidagi 5 ta muhim qoida o'quvchilarimizga vaqtni tejash va sifatli natijaga erishishda yordam beradi.",
    items: [
      {
        ar: '١. الْمَخْرَجُ الصَّحِيحُ',
        tr: "1-sir: Harfni boshidanoq to'g'ri maxrajdan o'rganish",
        uz: "Arab harflarini kirill yoki lotin harflariga o'xshatib yodlamang. Ustoz yordamida har bir tovushning chiqish joyini (maxrajini) to'g'ri qo'yish keyinchalik xatosiz o'qish va eshitib tushunishni ta'minlaydi."
      },
      {
        ar: '٢. الْمُدَاوَمَةُ الْيَوْمِيَّةُ',
        tr: '2-sir: Kunlik uzluksizlik (oz-ozdan, lekin har kuni)',
        uz: "Haftada bir kun 3 soat o'qigandan ko'ra, har kuni 20–30 daqiqa davomida harf, so'z va audiolarni takrorlash xotirani 3 barobar mustahkamlaydi."
      },
      {
        ar: '٣. السَّمَاعُ وَالتَّكْرَارُ',
        tr: '3-sir: Eshitish va ovoz chiqarib o‘qish',
        uz: "Faqat ko'z bilan o'qish yetarli emas. Til mushaklari arab tovushlariga moslashishi uchun so'zlarni ovoz chiqarib, aniq talaffuz bilan o'qish kerak."
      },
      {
        ar: '٤. الْكَلِمَةُ فِي الْجُمْلَةِ',
        tr: "4-sir: So'zlarni yakka holda emas, jumla ichida yodlash",
        uz: "Yangi o'rganilgan har bir arabcha so'z ishtirokida oddiy bo'lsa ham 2-3 ta gap tuzish lug'atning faol xotiraga o'tishiga xizmat qiladi."
      },
      {
        ar: '٥. الْأُسْتَاذُ الْمُتَخَصِّصُ',
        tr: '5-sir: Tajribali ustoz va tizimli muhit',
        uz: "Mustaqil o'rganishda talaffuz xatolari sezilmay qoladi. Malakali ustoz xatolarni o'z vaqtida tuzatib, Zulmatlardan Nur tomon to'g'ri yo'nalish beradi."
      }
    ],
    relatedCourseSlug: 'professional-fonetika'
  },
  {
    slug: 'farzandingizni-arab-tiliga-multfilmlar-orqali-qiziqtirish',
    title: "Farzandingizni arab tiliga multfilmlar va o'yinlar orqali qiziqtirish",
    topic: 'Hilol Kids 4+',
    readTime: '4 daqiqa',
    sourceNote: 'Telegram va Instagramdagi bolajonlar dars lavhalari asosida',
    excerpt:
      "4–10 yoshli bolalar quruq qoidalarni emas, balki jonli tasvir, o'yin va multfilm qahramonlari nutqini tezroq qabul qiladilar.",
    intro:
      "«Farzandingizni arab tiliga qiziqtirish sirlari haqida bilasizmi? Biz bolalar sevib tomosha qiladigan multfilmlarning arabcha variantini tayyorlab qo'ydik» — ushbu yondashuv Hilol Kids 4+ dasturimizning asosini tashkil etadi.",
    items: [
      {
        ar: 'أَلْعَابُ الْأَرْقَامِ',
        tr: "Raqamlarni va harflarni topish o'yini",
        uz: "Darsda ustozalarimiz maxsus plakat va kartochkalar yordamida bolajonlar bilan raqamlarni topish o'yinini o'tkazadilar. Bu bolada diqqat va tezkor eslab qolishni rivojlantiradi."
      },
      {
        ar: 'الرُّسُومُ الْمُتَحَرِّكَةُ',
        tr: 'Arabcha multfilmlar orqali eshitish',
        uz: "Multfilm ko'rish orqali farzandingiz arabcha iboralarni tabiiy ohangda eshitadi va tilga bo'lgan qiziqishi yanada ortadi."
      },
      {
        ar: 'التَّشْجِيعُ وَالْمُكَافَأَةُ',
        tr: "Rag'batlantirish va bitiruv tadbirlari",
        uz: "Har bir bosqich yakunida bolajonlar ota-onalar ishtirokidagi bayramona tadbirlarda sertifikatlar bilan taqdirlanadilar."
      }
    ],
    relatedCourseSlug: 'hilol-kids'
  },
  {
    slug: 'arab-tilidagi-kasblar-va-imkoniyatlar',
    title: 'Arab tilidagi kasblar va til bilishning amaliy ahamiyati',
    topic: 'Kasb va Kelajak',
    readTime: '4 daqiqa',
    sourceNote: 'Instagram (@ustoz_akademiyasi) «Arab tilidagi kasblar» postidan',
    excerpt:
      "Arab tilini mukammal o'rganish va CEFR sertifikatiga ega bo'lish qaysi sohalarda kasbiy faoliyat yuritish imkonini beradi?",
    intro:
      "Arab tili BMTning 6 ta rasmiy tilidan biri bo'lib, 20 dan ortiq davlatning rasmiy muloqot tilidir. Ustoz Akademiyasida fonetika, grammatika va CEFR bosqichlarini muvaffaqiyatli tamomlagan bitiruvchilar quyidagi yo'nalishlarda o'z bilimlarini qo'llashlari mumkin.",
    items: [
      {
        ar: 'مُعَلِّمُ اللُّغَةِ الْعَرَبِيَّةِ',
        tr: "Arab tili o'qituvchisi va metodisti (Muallim)",
        uz: "Milliy va xalqaro CEFR (B2/C1) sertifikatiga ega mutaxassislar ta'lim muassasalarida va o'quv markazlarida dars berish imkoniyatiga ega bo'ladilar."
      },
      {
        ar: 'مُتَرْجِمٌ',
        tr: 'Yozma va sinxron tarjimon (Mutarjim)',
        uz: "Xalqaro uchrashuvlar, nashriyotlar, tijoriy shartnomalar va diplomatik tadbirlarda tarjimonlik faoliyati."
      },
      {
        ar: 'مُرْشِدٌ سِيَاحِيٌّ',
        tr: 'Turizm va Ziyorat yo‘lboshchisi (Gid)',
        uz: "O'zbekistonga tashrif buyuruvchi arab sayyohlari hamda ziyorat safarlarida guruhlarga hamrohlik qilish."
      },
      {
        ar: 'بَاحِثٌ عِلْمِيٌّ',
        tr: 'Ilmiy tadqiqotchi va manbashunos',
        uz: "Yurtimizda saqlanayotgan minglab nodir arabcha qo'lyozmalar va tarixiy manbalarni tadqiq etish."
      }
    ],
    relatedCourseSlug: 'grammatika-va-cefr'
  }
];

export const ARABIC_PLAYGROUND_LETTERS = [
  {
    id: 'alif',
    glyph: 'ا',
    forms: { isolated: 'ا', initial: 'ا', medial: 'ـا', final: 'ـا' },
    nameUz: 'Alif',
    nameRu: 'Алиф',
    nameEn: 'Alif',
    translit: 'A / I / U',
    makhrajZone: "Bo'g'iz bo'shlig'i (Jauf)",
    makhrajZoneRu: 'Полость гортани и рта (Джауф)',
    makhrajZoneEn: 'Throat & mouth cavity (Jawf)',
    makhrajDesc: "Ovoz paychalari va og'iz bo'shlig'idan to'siqsiz, erkin havo oqimi bilan chiqadi.",
    makhrajDescRu: 'Голосовые связки и полость рта пропускают свободный воздушный поток без преград.',
    makhrajDescEn: 'Air flows freely through the throat and oral cavity without obstructions.',
    harakat: { fatha: 'أَ (A)', kasra: 'إِ (I)', damma: 'أُ (U)' },
    exampleAr: 'أُسْتَاذٌ',
    exampleTr: 'Ustazun',
    exampleUz: 'Ustoz / Muallim',
    exampleRu: 'Учитель / Устоз',
    exampleEn: 'Teacher / Master',
    freq: 220
  },
  {
    id: 'ba',
    glyph: 'ب',
    forms: { isolated: 'ب', initial: 'بـ', medial: 'ـبـ', final: 'ـب' },
    nameUz: 'Ba',
    nameRu: 'Ба',
    nameEn: 'Ba',
    translit: 'B',
    makhrajZone: 'Ikki lab (Shafatayn)',
    makhrajZoneRu: 'Губы (Шафатайн)',
    makhrajZoneEn: 'Both lips (Shafatayn)',
    makhrajDesc: "Ikki labning bir-biriga jips tegib, tezda ochilishidan hosil bo'luvchi jarangli tovush.",
    makhrajDescRu: 'Плотное смыкание обеих губ с последующим звонким размыканием.',
    makhrajDescEn: 'Produced by closing both lips firmly and releasing them briskly.',
    harakat: { fatha: 'بَ (Ba)', kasra: 'بِ (Bi)', damma: 'بُ (Bu)' },
    exampleAr: 'بَيْتٌ',
    exampleTr: 'Baytun',
    exampleUz: 'Uy / Xonadon',
    exampleRu: 'Дом / Жилище',
    exampleEn: 'House / Home',
    freq: 246
  },
  {
    id: 'ta',
    glyph: 'ت',
    forms: { isolated: 'ت', initial: 'تـ', medial: 'ـتـ', final: 'ـت' },
    nameUz: 'Ta',
    nameRu: 'Та',
    nameEn: 'Ta',
    translit: 'T (ingichka)',
    makhrajZone: 'Til uchi va old tishlar tubi',
    makhrajZoneRu: 'Кончик языка и корни верхних зубов',
    makhrajZoneEn: 'Tip of tongue and base of upper teeth',
    makhrajDesc: "Tilning old uchi yuqori old kurak tishlarning milk bilan tutashgan joyiga tegishidan chiqadi.",
    makhrajDescRu: 'Прикосновение кончика языка к основанию верхних зубов у десен.',
    makhrajDescEn: 'Tip of the tongue touches the gumline of the upper incisors.',
    harakat: { fatha: 'تَ (Ta)', kasra: 'تِ (Ti)', damma: 'تُ (Tu)' },
    exampleAr: 'تِلْمِيذٌ',
    exampleTr: 'Tilmiyzun',
    exampleUz: "O'quvchi / Shogird",
    exampleRu: 'Ученик / Студент',
    exampleEn: 'Student / Disciple',
    freq: 261
  },
  {
    id: 'sa',
    glyph: 'ث',
    forms: { isolated: 'ث', initial: 'ثـ', medial: 'ـثـ', final: 'ـث' },
    nameUz: 'Sa (peltek)',
    nameRu: 'Са (межзубная)',
    nameEn: 'Tha (interdental)',
    translit: 'Th / S',
    makhrajZone: 'Til uchi va tishlar orasi',
    makhrajZoneRu: 'Кончик языка между передними зубами',
    makhrajZoneEn: 'Tip of tongue between teeth',
    makhrajDesc: "Til uchi yuqori old tishlarning qirrasiga yengil tegib, havo sirg'alib chiqadi.",
    makhrajDescRu: 'Кончик языка слегка касается краев верхних резцов, воздух мягко рассеивается.',
    makhrajDescEn: 'Tip of tongue gently touches the edge of upper front teeth.',
    harakat: { fatha: 'ثَ (Sa)', kasra: 'ثِ (Si)', damma: 'ثُ (Su)' },
    exampleAr: 'ثَلَاثَةٌ',
    exampleTr: 'Salasatun',
    exampleUz: 'Uch (3 raqami)',
    exampleRu: 'Три (число 3)',
    exampleEn: 'Three (number 3)',
    freq: 293
  },
  {
    id: 'jim',
    glyph: 'ج',
    forms: { isolated: 'ج', initial: 'جـ', medial: 'ـجـ', final: 'ـج' },
    nameUz: 'Jim',
    nameRu: 'Джим',
    nameEn: 'Jim',
    translit: 'J',
    makhrajZone: "Til o'rtasi (Vasatul-lisan)",
    makhrajZoneRu: 'Середина языка (Васатуль-лисан)',
    makhrajZoneEn: 'Middle of tongue (Wasat al-lisan)',
    makhrajDesc: "Tilning o'rta qismi yuqori qattiq tanglayga jips tegishidan hosil bo'ladi.",
    makhrajDescRu: 'Середина языка плотно прижимается к твердому нёбу.',
    makhrajDescEn: 'Center of the tongue presses firmly against the hard palate.',
    harakat: { fatha: 'جَ (Ja)', kasra: 'جِ (Ji)', damma: 'جُ (Ju)' },
    exampleAr: 'جَمِيلٌ',
    exampleTr: 'Jamilun',
    exampleUz: 'Chiroyli / Go‘zal',
    exampleRu: 'Красивый / Прекрасный',
    exampleEn: 'Beautiful / Handsome',
    freq: 311
  },
  {
    id: 'ha',
    glyph: 'ح',
    forms: { isolated: 'ح', initial: 'حـ', medial: 'ـحـ', final: 'ـح' },
    nameUz: 'Ha',
    nameRu: 'Ха (гортанная)',
    nameEn: 'Ha (throat)',
    translit: 'H (bo‘g‘iz)',
    makhrajZone: "Bo'g'iz o'rtasi (Vasatul-halq)",
    makhrajZoneRu: 'Середина гортани (Васатуль-хальк)',
    makhrajZoneEn: 'Middle of throat (Wasat al-halq)',
    makhrajDesc: "Bo'g'izning o'rta qismi torayib, toza va yumshoq havo ishqalanib chiqadi.",
    makhrajDescRu: 'Сужение средней части гортани с мягким придыханием чистого воздуха.',
    makhrajDescEn: 'Gentle constriction in the middle of the pharynx producing a warm friction.',
    harakat: { fatha: 'حَ (Ha)', kasra: 'حِ (Hi)', damma: 'حُ (Hu)' },
    exampleAr: 'حِكْمَةٌ',
    exampleTr: 'Hikmatun',
    exampleUz: 'Hikmat / Donolik',
    exampleRu: 'Мудрость',
    exampleEn: 'Wisdom',
    freq: 329
  },
  {
    id: 'ayn',
    glyph: 'ع',
    forms: { isolated: 'ع', initial: 'عـ', medial: 'ـعـ', final: 'ـع' },
    nameUz: 'Ayn',
    nameRu: '‘Айн',
    nameEn: '‘Ayn',
    translit: "‘A (chuqur)",
    makhrajZone: "Bo'g'iz o'rtasi (Vasatul-halq)",
    makhrajZoneRu: 'Середина гортани (Васатуль-хальк)',
    makhrajZoneEn: 'Middle of throat (Wasat al-halq)',
    makhrajDesc: "Bo'g'iz o'rtasidagi halqum qopqog'ining orqa devorga yaqinlashishidan chiqadigan xos arab tovushi.",
    makhrajDescRu: 'Сближение надгортанника с задней стенкой глотки, создающее глубокий арабский звук.',
    makhrajDescEn: 'Deep pharyngeal sound formed by pulling the epiglottis toward the back wall.',
    harakat: { fatha: 'عَ (‘A)', kasra: 'عِ (‘I)', damma: 'عُ (‘U)' },
    exampleAr: 'عِلْمٌ',
    exampleTr: 'Ilmun',
    exampleUz: 'Ilm / Bilim',
    exampleRu: 'Знание / Наука',
    exampleEn: 'Knowledge / Science',
    freq: 349
  },
  {
    id: 'qof',
    glyph: 'ق',
    forms: { isolated: 'ق', initial: 'قـ', medial: 'ـqـ', final: 'ـق' },
    nameUz: 'Qof',
    nameRu: 'Коф (твёрдая)',
    nameEn: 'Qaf (emphatic)',
    translit: 'Q (qalin)',
    makhrajZone: 'Til tubi va yumshoq tanglay',
    makhrajZoneRu: 'Корень языка и мягкое нёбо',
    makhrajZoneEn: 'Root of tongue & soft palate',
    makhrajDesc: "Tilning eng orqa (tub) qismi yuqori yumshoq tanglayga zarb bilan tegishidan qalin chiqadi.",
    makhrajDescRu: 'Задняя часть корня языка с силой смыкается с мягким нёбом.',
    makhrajDescEn: 'Back part of tongue strikes the soft palate producing an emphatic sound.',
    harakat: { fatha: 'قَ (Qo)', kasra: 'قِ (Qi)', damma: 'قُ (Qu)' },
    exampleAr: 'قَلَمٌ',
    exampleTr: 'Qolamun',
    exampleUz: 'Qalam',
    exampleRu: 'Ручка / Карандаш',
    exampleEn: 'Pen / Pencil',
    freq: 392
  },
  {
    id: 'kaf',
    glyph: 'ك',
    forms: { isolated: 'ك', initial: 'كـ', medial: 'ـكـ', final: 'ـك' },
    nameUz: 'Kaf',
    nameRu: 'Кяф (мягкая)',
    nameEn: 'Kaf (light)',
    translit: 'K (ingichka)',
    makhrajZone: 'Til tubidan biroz oldinroq',
    makhrajZoneRu: 'Передняя часть корня языка',
    makhrajZoneEn: 'Root of tongue near hard palate',
    makhrajDesc: "Qof harfi maxrajidan biroz oldinroqda, qattiq va yumshoq tanglay chegarasida hosil bo'ladi.",
    makhrajDescRu: 'Чуть впереди махраджа буквы Коф, на границе твердого и мягкого нёба.',
    makhrajDescEn: 'Positioned slightly ahead of Qaf, right at boundary of hard and soft palate.',
    harakat: { fatha: 'كَ (Ka)', kasra: 'كِ (Ki)', damma: 'كُ (Ku)' },
    exampleAr: 'كِتَابٌ',
    exampleTr: 'Kitabun',
    exampleUz: 'Kitob',
    exampleRu: 'Книга',
    exampleEn: 'Book',
    freq: 415
  },
  {
    id: 'mim',
    glyph: 'م',
    forms: { isolated: 'م', initial: 'مـ', medial: 'ـمـ', final: 'ـم' },
    nameUz: 'Mim',
    nameRu: 'Мим',
    nameEn: 'Mim',
    translit: 'M',
    makhrajZone: 'Ikki lab va dimog‘ (G‘unna)',
    makhrajZoneRu: 'Губы и носовая полость (Гунна)',
    makhrajZoneEn: 'Both lips with nasal resonance (Ghunnah)',
    makhrajDesc: "Ikki labning yumshoq birlashishi va dimog'da yengil ohang hosil bo'lishi bilan chiqadi.",
    makhrajDescRu: 'Мягкое смыкание губ с легким резонансом в носовой полости.',
    makhrajDescEn: 'Gentle closure of both lips with harmonic nasal resonance.',
    harakat: { fatha: 'مَ (Ma)', kasra: 'مِ (Mi)', damma: 'مُ (Mu)' },
    exampleAr: 'مُعَلِّمٌ',
    exampleTr: 'Muallimun',
    exampleUz: "O'qituvchi / Ustoz",
    exampleRu: 'Учитель / Устоз',
    exampleEn: 'Teacher / Instructor',
    freq: 440
  },
  {
    id: 'nun',
    glyph: 'ن',
    forms: { isolated: 'ن', initial: 'نـ', medial: 'ـنـ', final: 'ـن' },
    nameUz: 'Nun',
    nameRu: 'Нун',
    nameEn: 'Nun',
    translit: 'N',
    makhrajZone: 'Til uchi va yuqori tish milki',
    makhrajZoneRu: 'Кончик языка и десна верхних зубов',
    makhrajZoneEn: 'Tip of tongue & upper gum ridge',
    makhrajDesc: "Til uchi yuqori old tishlarning milkiga tegib, dimog' ohangi ishtirokida chiqadi.",
    makhrajDescRu: 'Кончик языка касается десен верхних резцов при участии носового звука.',
    makhrajDescEn: 'Tip of tongue touches the upper alveolar ridge with a light nasal hum.',
    harakat: { fatha: 'نَ (Na)', kasra: 'نِ (Ni)', damma: 'نُ (Nu)' },
    exampleAr: 'نُورٌ',
    exampleTr: 'Nurun',
    exampleUz: "Nur / Yorug'lik",
    exampleRu: 'Свет / Сияние',
    exampleEn: 'Light / Radiance',
    freq: 466
  },
  {
    id: 'shin',
    glyph: 'ش',
    forms: { isolated: 'ش', initial: 'شـ', medial: 'ـshـ', final: 'ـش' },
    nameUz: 'Shin',
    nameRu: 'Шин',
    nameEn: 'Shin',
    translit: 'Sh',
    makhrajZone: "Til o'rtasi (Tafashshi)",
    makhrajZoneRu: 'Середина языка (Тафашши)',
    makhrajZoneEn: 'Center of tongue (Tafashshi)',
    makhrajDesc: "Til o'rtasi yuqori tanglayga yaqinlashib, havo og'iz ichida keng tarqalib chiqadi.",
    makhrajDescRu: 'Середина языка приближается к нёбу, воздух широко рассеивается в полости рта.',
    makhrajDescEn: 'Center of tongue approaches the palate, dispersing air widely within mouth.',
    harakat: { fatha: 'شَ (Sha)', kasra: 'شِ (Shi)', damma: 'شُ (Shu)' },
    exampleAr: 'شَمْسٌ',
    exampleTr: 'Shamsun',
    exampleUz: 'Quyosh',
    exampleRu: 'Солнце',
    exampleEn: 'Sun',
    freq: 493
  }
];

export const PLAYGROUND_QUIZ = [
  {
    id: 1,
    arabicPrompt: 'نُورٌ',
    question: "Ustoz Akademiyasining «Zulmatlardan Nur tomon» shioridagi «نُورٌ» (Nurun) so'zining birinchi harfi qaysi?",
    questionRu: 'Какая первая буква в слове «نُورٌ» (Нурун) из девиза Ustoz Akademiyasi «Из тьмы к Свету»?',
    questionEn: 'Which letter begins the word «نُورٌ» (Nurun) from Ustoz Akademiyasi motto «From Darkness to Light»?',
    options: ['ن (Nun)', 'ب (Ba)', 'ت (Ta)', 'ق (Qof)'],
    optionsRu: ['ن (Нун)', 'ب (Ба)', 'ت (Та)', 'ق (Коф)'],
    optionsEn: ['ن (Nun)', 'ب (Ba)', 'ت (Ta)', 'ق (Qaf)'],
    correctIndex: 0,
    feedback: "To'g'ri! «ن» (Nun) harfi ustida bitta nuqta bilan yoziladi va «نُورٌ» (Nur) so'zi shu harfdan boshlanadi.",
    feedbackRu: 'Правильно! Буква «ن» (Нун) пишется с одной точкой сверху, и слово «نُورٌ» (Свет) начинается с этой буквы.',
    feedbackEn: 'Correct! The letter «ن» (Nun) is written with one dot above, and «نُورٌ» (Light) starts with this letter.'
  },
  {
    id: 2,
    arabicPrompt: 'عِلْمٌ',
    question: "Bo'g'izning o'rta qismidan chiqadigan va «عِلْمٌ» (Ilm) so'zining boshida kelgan harf qaysi?",
    questionRu: 'Какая буква образуется в средней части гортани и стоит в начале слова «عِلْمٌ» (Ильм)?',
    questionEn: 'Which letter originates from the middle of the throat and begins the word «عِلْمٌ» (Ilm)?',
    options: ['ح (Ha)', 'ع (Ayn)', 'ج (Jim)', 'ك (Kaf)'],
    optionsRu: ['ح (Ха)', 'ع (‘Айн)', 'ج (Джим)', 'ك (Кяф)'],
    optionsEn: ['ح (Ha)', 'ع (‘Ayn)', 'ج (Jim)', 'ك (Kaf)'],
    correctIndex: 1,
    feedback: "Barakalla! «ع» (Ayn) harfi bo'g'izning o'rta qismidan chiqadi va «عِلْمٌ» (Ilm) so'zining birinchi harfidir.",
    feedbackRu: 'Отлично! Буква «ع» (‘Айн) зарождается в середине гортани и является первой буквой слова «عِلْمٌ» (Знание).',
    feedbackEn: 'Great job! The letter «ع» (‘Ayn) comes from the middle of the throat and begins the word «عِلْمٌ» (Knowledge).'
  },
  {
    id: 3,
    arabicPrompt: '٥',
    question: "Bolajonlar bilan raqamlarni topish o'yinida o'rgatiladigan arabcha «٥» (Xomsatun) belgisi qaysi sonni bildiradi?",
    questionRu: 'Какое число обозначает арабский символ «٥» (Хомсатун) в развивающей игре для детей?',
    questionEn: 'Which number is represented by the Arabic symbol «٥» (Khamsatun) in our children’s game?',
    options: ['Zero (0)', 'Uch (3)', 'Besh (5)', 'Sakkiz (8)'],
    optionsRu: ['Ноль (0)', 'Три (3)', 'Пять (5)', 'Восемь (8)'],
    optionsEn: ['Zero (0)', 'Three (3)', 'Five (5)', 'Eight (8)'],
    correctIndex: 2,
    feedback: "To'ppa-to'g'ri! Arab raqamlarida «٥» belgisi 5 (Besh) raqamini ifodalaydi (0 esa nuqta «٠» shaklida yoziladi).",
    feedbackRu: 'Точно! В арабских цифрах символ «٥» обозначает число 5 (Пять), а 0 пишется как точка «٠».',
    feedbackEn: 'Spot on! In Arabic numerals, «٥» stands for 5 (Five), while 0 is written as a dot «٠».'
  },
  {
    id: 4,
    arabicPrompt: 'شُكْرًا',
    question: "Kundalik hayotda eng ko'p ishlatiladigan 10 ta so'zdan biri — «شُكْرًا» (Shukron) iborasining ma'nosi nima?",
    questionRu: 'Что означает одно из 10 самых популярных повседневных выражений — «شُكْرًا» (Шукран)?',
    questionEn: 'What does the essential everyday Arabic phrase «شُكْرًا» (Shukran) mean?',
    options: ['Xayrli kech', 'Rahmat / Tashakkur', 'Ismingiz nima?', 'Kechirasiz'],
    optionsRu: ['Добрый вечер', 'Спасибо / Благодарю', 'Как вас зовут?', 'Извините'],
    optionsEn: ['Good evening', 'Thank you / Gratitude', 'What is your name?', 'Excuse me'],
    correctIndex: 1,
    feedback: "Ajoyib! «شُكْرًا» (Shukron) — arab tilida minnatdorchilik bildirish («Rahmat») uchun ishlatiladi.",
    feedbackRu: 'Замечательно! «شُكْرًا» (Шукран) используется в арабском языке для выражения благодарности («Спасибо»).',
    feedbackEn: 'Wonderful! «شُكْرًا» (Shukran) is the primary Arabic phrase for expressing gratitude («Thank you»).'
  },
  {
    id: 5,
    arabicPrompt: 'أُسْتَاذٌ',
    question: "«أُسْتَاذٌ» (Ustazun) so'zida nechta nuqtali harf qatnashgan?",
    questionRu: 'Сколько букв с точками содержится в слове «أُسْتَاذٌ» (Устазун)?',
    questionEn: 'How many dotted letters appear in the word «أُسْتَاذٌ» (Ustadhun)?',
    options: ['1 ta (ذ — Zal harfi)', '3 ta', 'Umuman nuqta yo‘q', '4 ta'],
    optionsRu: ['1 буква (ذ — Заль)', '3 буквы', 'Ни одной точки', '4 буквы'],
    optionsEn: ['1 letter (ذ — Dhal)', '3 letters', 'No dots at all', '4 letters'],
    correctIndex: 0,
    feedback: "To'g'ri! «أُسْتَاذٌ» so'zining oxiridagi «ذ» (Zal) harfi ustida bitta nuqta bor (ت harfida esa ikkita nuqta bor).",
    feedbackRu: 'Верно! В слове «أُسْتَاذٌ» буква «ذ» (Заль) имеет одну точку сверху.',
    feedbackEn: 'Correct! In «أُسْتَاذٌ», the letter «ذ» (Dhal) at the end has one dot above.'
  }
];

export const KIDS_NUMBERS_DATA = [
  { id: 'n1', arNum: '١', wordAr: 'وَاحِدٌ', readUz: 'Vohidun', numLatin: '1', labelUz: 'Bir', labelRu: 'Один', labelEn: 'One' },
  { id: 'n2', arNum: '٢', wordAr: 'اِثْنَانِ', readUz: 'Isnani', numLatin: '2', labelUz: 'Ikki', labelRu: 'Два', labelEn: 'Two' },
  { id: 'n3', arNum: '٣', wordAr: 'ثَلَاثَةٌ', readUz: 'Salasatun', numLatin: '3', labelUz: 'Uch', labelRu: 'Три', labelEn: 'Three' },
  { id: 'n4', arNum: '٤', wordAr: 'أَرْبَعَةٌ', readUz: 'Arba‘atun', numLatin: '4', labelUz: "To'rt", labelRu: 'Четыре', labelEn: 'Four' },
  { id: 'n5', arNum: '٥', wordAr: 'خَمْسَةٌ', readUz: 'Xomsatun', numLatin: '5', labelUz: 'Besh', labelRu: 'Пять', labelEn: 'Five' },
  { id: 'n6', arNum: '٦', wordAr: 'سِتَّةٌ', readUz: 'Sittatun', numLatin: '6', labelUz: 'Olti', labelRu: 'Шесть', labelEn: 'Six' },
  { id: 'n7', arNum: '٧', wordAr: 'سَبْعَةٌ', readUz: 'Sab‘atun', numLatin: '7', labelUz: 'Yetti', labelRu: 'Семь', labelEn: 'Seven' },
  { id: 'n8', arNum: '٨', wordAr: 'ثَمَانِيَةٌ', readUz: 'Samaniyatun', numLatin: '8', labelUz: 'Sakkiz', labelRu: 'Восемь', labelEn: 'Eight' }
];

export const INITIAL_TEACHING_DEPARTMENTS = [
  {
    id: 'dept-phonetics',
    title: 'Professional Fonetika va Maxraj kafedrasi',
    badge: 'Maxraj va Talaffuz mutaxassislari',
    image: '/departments/dept_phonetics.png',
    qualification: 'Arab fonetikasi va klassik talaffuz qoidalari bo‘yicha malakali ustozlar',
    focus:
      "0 dan boshlagan o'quvchilarga 28 ta harfning artikulyatsion nuqtalarini (maxrajini) individual eshitish va tuzatish orqali o'rgatish.",
    coursesTaught: ['Professional Fonetika']
  },
  {
    id: 'dept-cefr',
    title: 'Grammatika (Sarf, Nahv) va CEFR kafedrasi',
    badge: 'C1 darajali sertifikatga ega ustozlar',
    image: '/departments/dept_cefr.png',
    qualification: 'Milliy va xalqaro CEFR (C1) sertifikatiga ega filolog va metodist ustozlar',
    focus:
      "Arab tili grammatikasi hamda Reading, Listening, Writing va Speaking ko'nikmalarini imtihon talablari asosida chuqurlashtirib o'qitish.",
    coursesTaught: ['Grammatika va CEFR', 'Kundalik va Kasbiy Arab Tili']
  },
  {
    id: 'dept-kids',
    title: 'Hilol Kids 4+ va Ayollar ta’limi bo‘limi',
    badge: 'Bolalar pedagogikasi va Ayol ustozalar',
    image: '/departments/dept_kids.png',
    qualification: 'Bolalar psixologiyasi va interaktiv metodikani egallagan muallimalar',
    focus:
      "4 yoshdan katta bolajonlarga o'yinlar, raqamli plakatlar va arabcha multfilmlar yordamida, shuningdek ayol-qizlar guruhlariga alohida qulay muhitda dars berish.",
    coursesTaught: ['Hilol Kids 4+', 'Professional Fonetika']
  }
];

export const INITIAL_TEACHERS = [
  {
    id: 'teacher-1',
    fullName: 'Ustoz Abdulloh',
    role: 'Bosh mutaxassis, Fonetika va Maxraj',
    department: 'Professional Fonetika kafedrasi',
    badge: 'Maxraj mutaxassisi',
    image: '/teachers/teacher_1.png',
    experience: '5 yillik tajriba',
    motto: "«Arab tilini Ustoz akademiyasida 0 dan o‘rganing»",
    description: 'Arab tilidagi 28 ta harfning artikulyatsion nuqtalarini aniq o‘rgatish va harflar talaffuzini to‘g‘rilash bo‘yicha ixtisoslashgan.',
    courses: ['Professional Fonetika', 'Boshlang‘ich Arab Tili'],
  },
  {
    id: 'teacher-2',
    fullName: 'Ustoz Muhammad',
    role: 'Katta o‘qituvchi, Sarf va Nahv',
    department: 'Grammatika va CEFR kafedrasi',
    badge: 'C1 daraja (CEFR)',
    image: '/teachers/teacher_2.png',
    experience: '6 yillik tajriba',
    motto: "«Eng katta motivatsiya — o‘quvchilarimning natijalari»",
    description: 'Sarf va Nahv qoidalarini amaliy tushuntirish, xalqaro CEFR imtihonlarining 4 ta ko‘nikmasi bo‘yicha yuqori ballarga tayyorlaydi.',
    courses: ['Grammatika va CEFR', 'Sarf va Nahv'],
  },
  {
    id: 'teacher-3',
    fullName: 'Ustoz Ibrohim',
    role: 'Leksika va Jonli nutq ustozi',
    department: 'Kundalik va Kasbiy Arab Tili',
    badge: 'Intensiv so‘zlashuv',
    image: '/teachers/teacher_3.png',
    experience: '4 yillik tajriba',
    motto: "«Arab tilidagi eng muhim va dolzarb mavzular»",
    description: 'Sayohat, biznes va muloqotda qo‘llaniladigan eng faol lug‘atlar, kundalik iboralar va erkin jonli nutqni shakllantiradi.',
    courses: ['Kundalik va Kasbiy Arab Tili', 'Intensiv Nutq'],
  },
  {
    id: 'teacher-4',
    fullName: 'Ustoz Hasan',
    role: 'Klassik Talaffuz va Harflar qiyosi',
    department: 'Qiroat va Fonetika kafedrasi',
    badge: 'Harflar nozikligi',
    image: '/teachers/teacher_4.png',
    experience: '5 yillik tajriba',
    motto: "«Ko‘pincha bir xil o‘qiladigan harflarning farqlari»",
    description: 'Talaffuzi o‘xshash va yanglish o‘qiladigan harflarning nozik farqlarini qiyosiy usulda tushuntirishga ixtisoslashgan.',
    courses: ['Professional Fonetika', 'Tajvid Asoslari'],
  },
];

export const INITIAL_FAQ_ITEMS = [
  {
    category: "Boshlang'ich",
    q: 'Arab tilini umuman 0 dan boshlasam, qaysi kursga yozilishim kerak?',
    a: "Agar siz hali arab harflarini tanimasangiz yoki talaffuzingizda ikkilanish bo'lsa, o'qishni «Professional Fonetika» kursidan boshlaysiz. Bu bosqichda 28 ta harfning maxraji va o'qish qoidalari to'liq o'rgatiladi."
  },
  {
    category: 'Bolalar uchun',
    q: 'Hilol Kids 4+ kursiga necha yoshdan qabul qilinadi va darslar qanday o‘tiladi?',
    a: "Hilol Kids 4+ dasturiga 4 yoshdan boshlab bolajonlar qabul qilinadi. Darslar zerikarli yodlashsiz — maxsus arabcha multfilmlar, «Bolajonlar bilan raqamlarni topish o'yini» va ko'rgazmali kartochkalar orqali olib boriladi."
  },
  {
    category: 'Filiallar',
    q: 'Toshkent shahrining qaysi hududlarida filiallaringiz bor?',
    a: "Ustoz Akademiyasining Toshkent shahrida 8 ta filiali faoliyat yuritadi: Archako'cha, Yangi ToshMI, Qoraqamish, Algoritm, Yunusobod, Sergeli, Tinchlik va Beruniy filiallari."
  },
  {
    category: 'Sertifikat',
    q: 'Grammatika va CEFR kursida qaysi darajalarga tayyorlanadi?',
    a: "Fonetika bosqichini tamomlagan o'quvchilar Sarf va Nahv qoidalari bilan birga A2, B1, B2 hamda C1 (Milliy va xalqaro CEFR) sertifikat imtihonlarining 4 ta bo'limiga tizimli tayyorlanadilar."
  },
  {
    category: "To'lov va Jadval",
    q: 'Kurs narxlari va dars vaqtlarini qanday bilsam bo‘ladi?',
    a: "Har bir filialdagi guruhlar jadvali (ertalabki, kunduzgi, kechki) hamda joriy o'quv to'lovlari bo'yicha aniq ma'lumot olish uchun saytdagi sinov darsi shaklini to'ldiring yoki +998 55 518 44 00 raqamiga qo'ng'iroq qiling."
  },
  {
    category: 'Sinov darsi',
    q: 'Sinov darsiga qanday yozilaman va u qanday o‘tadi?',
    a: "«Bepul sinov darsiga yozilish» sahifasida ismingiz, telefon raqamingiz, kurs va o'zingizga yaqin filialni tanlaysiz. Ma'muriyatimiz siz bilan bog'lanib, darajangizga mos guruh va vaqtni belgilab beradi."
  }
];
