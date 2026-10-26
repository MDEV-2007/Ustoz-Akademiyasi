import { PrismaClient, UserRole, UserStatus, ContentStatus, GeneralStatus } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting idempotent database seed for Ustoz Akademiyasi...');

  // 1. Initial Super Admin Bootstrap
  const adminEmail = process.env.SUPERADMIN_EMAIL || 'admin@ustozakademiyasi.uz';
  const adminPassword = process.env.SUPERADMIN_PASSWORD || 'SecureAdminPassword2026!#';
  const adminName = process.env.SUPERADMIN_NAME || 'Bosh Administrator';

  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await argon2.hash(adminPassword);
    await prisma.user.create({
      data: {
        fullName: adminName,
        email: adminEmail,
        passwordHash,
        role: UserRole.SUPER_ADMIN,
        status: UserStatus.ACTIVE,
        phone: '+998555184400',
      },
    });
    console.log(`✅ Super Admin created: ${adminEmail}`);
  } else {
    console.log(`ℹ️ Super Admin already exists: ${adminEmail}`);
  }

  // 2. Course Categories
  const categoriesData = [
    { name: 'Bolalar uchun', slug: 'bolalar-uchun', description: '4 yosh va undan katta bolajonlar uchun', sortOrder: 1 },
    { name: "Boshlang'ich", slug: 'boshlangich', description: '0 dan boshlovchilar va harflar maxraji', sortOrder: 2 },
    { name: 'Sertifikat', slug: 'sertifikat', description: 'Grammatika (Sarf, Nahv) va CEFR tayyorlov', sortOrder: 3 },
    { name: 'Muloqot', slug: 'muloqot', description: 'Kundalik va kasbiy arab tili suhbat kursi', sortOrder: 4 },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const record = await prisma.courseCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: { name: cat.name, slug: cat.slug, description: cat.description, sortOrder: cat.sortOrder, status: GeneralStatus.ACTIVE },
    });
    categoryMap.set(cat.name, record.id);
  }
  console.log(`✅ Seeded ${categoryMap.size} course categories.`);

  // 3. Courses
  const coursesData = [
    {
      slug: 'hilol-kids',
      title: 'Hilol Kids 4+',
      categoryName: 'Bolalar uchun',
      audience: '4 yosh va undan katta bolajonlar uchun',
      level: "Boshlang'ich (0 dan)",
      shortSummary: "Farzandingizni arab tiliga ibratli multfilmlar, raqam va so'z topish o'yinlari hamda ko'rgazmali mashg'ulotlar orqali qiziqtirib o'rgatuvchi maxsus dastur.",
      methodology: "Telegram va Instagram sahifalarimizda namoyish etilganidek, darslar bolajonlar sevib tomosha qiladigan multfilmlarning maxsus arabcha talqini hamda «Bolajonlar bilan raqamlarni topish o'yini» kabi jamoaviy mashg'ulotlar asosida olib boriladi.",
      entryRequirements: "4 yoshdan boshlab qabul qilinadi. Oldindan harf tanish talab etilmaydi.",
      durationNote: "Bosqichma-bosqich o'quv dasturi (guruh jadvali filial ma'muriyati bilan belgilanadi)",
      priceStatus: "Oylik to'lov miqdori tanlangan filial va guruh jadvaliga ko'ra +998 55 518 44 00 orqali tasdiqlanadi",
      plateType: 'kids-numbers',
      featured: true,
      objectives: [
        "Arab alifbosidagi 28 ta harfni rangli kartochkalar va o'yinlar yordamida tanish",
        "Arab raqamlari (١ dan ١٠ gacha) va kundalik buyumlar nomini eslab qolish",
        "Maxsus dublyaj qilingan ibratli multfilmlar orqali eshitib tushunish ko'nikmasini shakllantirish",
        "Bolalar psixologiyasiga mos muhitda talaffuzni to'g'ri shakllantirish",
      ],
      syllabus: [
        { module: '1-bosqich: Harflar va Tovushlar olami', topics: "Alifbo harflarini ko'rgazmali plakatlar va talaffuz o'yinlari orqali o'zlashtirish." },
        { module: '2-bosqich: Arabcha raqamlar va kundalik lug‘at', topics: "Raqamlarni topish o'yini, oila a'zolari, ranglar va tabiatga oid eng kerakli so'zlar." },
        { module: '3-bosqich: Multfilm va Jonli nutq', topics: "Qisqa arabcha multfilmlarni ko'rish, qahramonlar iboralarini takrorlash va kichik dialoglar." },
      ],
      faqs: [
        { q: 'Farzandim hali o‘qish va yozishni bilmaydi, kursga qatnasha oladimi?', a: 'Ha, Hilol Kids 4+ dasturi aynan 4 yoshdan boshlab harf tanimaydigan bolajonlar uchun eshitish, ko‘rish va o‘yin metodikasi asosida tuzilgan.' },
      ],
    },
    {
      slug: 'professional-fonetika',
      title: 'Professional Fonetika',
      categoryName: "Boshlang'ich",
      audience: 'Arab tilini 0 dan boshlovchi o‘smirlar va kattalar',
      level: 'A1 — Harflar maxraji va to‘g‘ri o‘qish',
      shortSummary: "Arab harflarini o'zbek tovushlariga o'xshatmasdan, o'zining asl maxraji (chiqish nuqtasi) va sifatlaridan to'g'ri talaffuz qilish hamda ravon o'qish kursi.",
      methodology: "Har bir harfning artikulyatsion o'rni (bo'g'iz, til, lablar) ustoz nazoratida individual mashq qilinadi. Harakatlar (fatha, kasra, damma), tanvin, sukun va tashdid qoidalari amaliy matnlar ustida mustahkamlanadi.",
      entryRequirements: "Arab tilini umuman bilmaydigan (0 dan boshlovchi) yoki talaffuzini to'g'rilamoqchi bo'lganlar uchun.",
      durationNote: "Boshlang'ich fonetika va o'qish bosqichi (guruh jadvali filialda aniqlashtiriladi)",
      priceStatus: "Kurs to'lovi va dars vaqtlari +998 55 518 44 00 call-markazi orqali ma'lum qilinadi",
      plateType: 'phonetics-calligraphy',
      featured: true,
      objectives: [
        "28 ta arab harfining aniq maxrajini (talaffuz nuqtasini) amaliy o'zlashtirish",
        "Qalin va ingichka harflarni bir-biridan xatosiz farqlash",
        "Harflarning so'z boshida, o'rtasida va oxirida bog'lanish shakllarini yozish va o'qish",
        "Harakatli arabcha so'z va jumlalarni ravon o'qish darajasiga chiqish",
      ],
      syllabus: [
        { module: '1-modul: Bo‘g‘iz va Til tubi harflari maxraji', topics: "Alif, Ha, Xo, Ayn, G'ayn, Qof va Kaf harflarining to'g'ri talaffuzi va harakatlar." },
        { module: '2-modul: Til o‘rtasi, uchi va Lab harflari', topics: "Jim, Shin, Sod, Dod, To, Zo hamda sirg'aluvchi harflar ustida fonetik mashqlar." },
        { module: '3-modul: Cho‘ziq unlilar (Mad), Sukun va Tashdid', topics: "Murakkab bo'g'inli so'zlarni to'xtab va ulab o'qish amaliyoti." },
      ],
      faqs: [
        { q: 'Nima uchun grammatikadan oldin Professional Fonetika o‘qilishi shart?', a: 'Arab tilida bitta harfning maxraji o‘zgarsa, so‘zning ma’nosi butunlay o‘zgarib ketadi. Shu bois poydevor to‘g‘ri maxrajdan boshlanadi.' },
      ],
    },
    {
      slug: 'grammatika-va-cefr',
      title: 'Grammatika va CEFR',
      categoryName: 'Sertifikat',
      audience: 'Tizimli grammatika hamda Milliy/Xalqaro sertifikat (CEFR) maqsad qilganlar',
      level: 'A2 – B1 – B2 – C1 bosqichlari',
      shortSummary: "Arab tili grammatikasi (Sarf va Nahv) qoidalarini chuqur o'zlashtirish hamda to'rtta ko'nikma bo'yicha CEFR va milliy sertifikat imtihonlariga tizimli tayyorlov.",
      methodology: "C1 darajali tajribali ustozlar metodikasi asosida o'quvchilarga so'z yasalishi (Sarf), gap tuzilishi (Nahv), o'qib tushunish (Reading), tinglab tushunish (Listening), yozma nutq (Writing) va og'zaki nutq (Speaking) kompleks o'rgatiladi.",
      entryRequirements: "Arab harflarida ravon o'qiy olish va yozish ko'nikmasi (Fonetika bosqichini tugatgan bo'lish).",
      durationNote: "Darajalar kesimida tizimli kurs (kirish suhbati/testi orqali mos guruhga joylashtiriladi)",
      priceStatus: "Daraja va guruh turiga ko'ra +998 55 518 44 00 orqali tasdiqlanadi",
      plateType: 'graduation-cefr',
      featured: true,
      objectives: [
        "Arab tilida fe'l boblarini, zamonlarni va ism turlarini (Sarf) mustaqil tahlil qilish",
        "Murakkab gap tuzilishi va e'rob qoidalarini (Nahv) matnlarda qo'llash",
        "Harakatsiz (vokalsiz) zamonaviy va klassik arab matnlarini o'qib tushunish",
        "CEFR imtihonining 4 ta bo'limi bo'yicha test va insho yozish ko'nikmalarini shakllantirish",
      ],
      syllabus: [
        { module: '1-modul: Fundamental Sarf va Nahv asoslari', topics: "Ismiy va fe'liy jumlalar, olmoshlar, ko'plik shakllari va zamonlar tizimi." },
        { module: '2-modul: Akademik lug‘at va Matn tahlili', topics: "Maqolalar, rasmiy matnlar va audio materiallarni tahlil qilish." },
        { module: '3-modul: CEFR Imtihon Strategiyasi (Reading, Listening, Writing, Speaking)', topics: "Vaqt taqsimoti, esse tuzilishi va og'zaki suhbat savollariga mantiqiy javob berish." },
      ],
      faqs: [
        { q: 'Darajamni bilmasam, qaysi guruhdan boshlayman?', a: 'Sinov darsiga yozilganingizda ustozlarimiz o‘qish va grammatik bilimingizni tekshirib, sizga eng mos bosqichni tavsiya etadilar.' },
      ],
    },
    {
      slug: 'kundalik-va-kasbiy-arab-tili',
      title: 'Kundalik va Kasbiy Arab Tili',
      categoryName: 'Muloqot',
      audience: 'Sayohat, kundalik muloqot va arab tiliga oid kasblarga qiziquvchilar',
      level: "Boshlang'ich va O'rta darajalar",
      shortSummary: "Kundalik hayotda eng ko'p ishlatiladigan arabcha so'z va iboralar, shuningdek arab tilini bilish orqali egallash mumkin bo'lgan kasbiy yo'nalishlar uchun amaliy muloqot kursi.",
      methodology: "Markazimizning «Kundalik hayotda kerak bo'ladigan 10 ta Arabcha so'z» va «Arab tilidagi kasblar» mavzusidagi o'quv materiallari asosida jonli vaziyatlar (aeroport, bozor, mehmonxona, ish suhbati) modellashtiriladi.",
      entryRequirements: "Boshlang'ich o'qish ko'nikmasi tavsiya etiladi.",
      durationNote: "Amaliy so'zlashuv va lug'at boyitish dasturi",
      priceStatus: "Filial ma'muriyati bilan +998 55 518 44 00 orqali aniqlashtiriladi",
      plateType: 'careers-chalkboard',
      featured: false,
      objectives: [
        "Kundalik hayotda eng ko'p qo'llaniladigan faol so'z va iboralarni erkin ishlatish",
        "Safar, ziyorat va mehmonxona vaziyatlarida mustaqil muloqot qilish",
        "Arab tili bilan bog'liq zamonaviy kasbiy terminologiyani tushunish",
        "Eshitib tushunish va og'zaki javob qaytarish tezligini oshirish",
      ],
      syllabus: [
        { module: '1-modul: Kundalik muloqot va Tanishuv', topics: "Salomlashish, hol-ahvol so'rash, oila, vaqt va kundalik ehtiyoj iboralari." },
        { module: '2-modul: Safar, Ziyorat va Xizmat ko‘rsatish', topics: "Yo'l so'rash, xarid qilish, transport va tibbiy yordam vaziyatlarida suhbat." },
        { module: '3-modul: Arab tilidagi kasblar va Rasmiy muomala', topics: "Tarjimonlik, ta'lim, turizm va xalqaro hamkorlik sohalaridagi asosiy tushunchalar." },
      ],
      faqs: [
        { q: 'Bu kurs faqat grammatikadan iboratmi?', a: 'Yo‘q, ushbu yo‘nalishda asosiy urg‘u og‘zaki nutq, faol iboralar va amaliy vaziyatlarda gapirishga qaratiladi.' },
      ],
    },
  ];

  const courseMap = new Map<string, string>();
  for (const c of coursesData) {
    const categoryId = categoryMap.get(c.categoryName)!;
    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        shortDescription: c.shortSummary,
        description: c.methodology,
        categoryId,
        targetAudience: c.audience,
        level: c.level,
        entryRequirements: c.entryRequirements,
        durationNote: c.durationNote,
        priceStatus: c.priceStatus,
        methodology: c.methodology,
        plateType: c.plateType,
        featured: c.featured,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: c.slug,
        title: c.title,
        shortDescription: c.shortSummary,
        description: c.methodology,
        categoryId,
        targetAudience: c.audience,
        level: c.level,
        entryRequirements: c.entryRequirements,
        durationNote: c.durationNote,
        priceStatus: c.priceStatus,
        methodology: c.methodology,
        plateType: c.plateType,
        featured: c.featured,
        status: ContentStatus.PUBLISHED,
      },
    });

    courseMap.set(c.slug, course.id);

    // Replace outcomes
    await prisma.courseOutcome.deleteMany({ where: { courseId: course.id } });
    await prisma.courseOutcome.createMany({
      data: c.objectives.map((text, idx) => ({ courseId: course.id, text, sortOrder: idx + 1 })),
    });

    // Replace syllabus modules
    await prisma.courseModule.deleteMany({ where: { courseId: course.id } });
    await prisma.courseModule.createMany({
      data: c.syllabus.map((s, idx) => ({ courseId: course.id, title: s.module, topics: s.topics, sortOrder: idx + 1 })),
    });

    // Replace faqs
    await prisma.courseFaq.deleteMany({ where: { courseId: course.id } });
    await prisma.courseFaq.createMany({
      data: c.faqs.map((f, idx) => ({ courseId: course.id, question: f.q, answer: f.a, sortOrder: idx + 1 })),
    });
  }
  console.log(`✅ Seeded ${courseMap.size} verified courses.`);

  // 4. Branches
  const branchesData = [
    {
      slug: 'archakocha',
      name: "Archako'cha filiali",
      officialLabel: "ARCHAKO'CHA FILIALI",
      area: "Shayxontohur / Ko'kcha yo'nalishi",
      addressNote: "Toshkent sh., Archako'cha hududi (aniq mo'ljal va xarita lokatsiyasi call-markaz orqali yuboriladi)",
      highlight: "Barcha asosiy o'quv yo'nalishlari va sinov darslari faol olib boriladigan filial.",
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr', 'kundalik-va-kasbiy-arab-tili'],
    },
    {
      slug: 'yangi-toshmi',
      name: 'Yangi ToshMI filiali',
      officialLabel: 'YANGI TOSHMI FILIALI',
      area: 'Olmazor / Yangi ToshMI hududi',
      addressNote: 'Toshkent sh., Yangi ToshMI hududi (aniq mo‘ljal va lokatsiya +998 55 518 44 00 orqali taqdim etiladi)',
      highlight: 'Talabalar, kattalar va bolajonlar uchun qulay o‘quv xonalariga ega filial.',
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr'],
    },
    {
      slug: 'qoraqamish',
      name: 'Qoraqamish filiali',
      officialLabel: 'QORAQAMISH FILIALI',
      area: 'Olmazor / Qoraqamish dahasi',
      addressNote: 'Toshkent sh., Qoraqamish dahasi (aniq bino va mo‘ljal ro‘yxatdan o‘tilganda yuboriladi)',
      highlight: "Instagram sahifamizda yoritilganidek, tantanali bitiruv tadbirlari va sertifikat topshirish marosimlari o'tkaziladigan faol filial.",
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr', 'kundalik-va-kasbiy-arab-tili'],
    },
    {
      slug: 'algoritm',
      name: 'Algoritm filiali',
      officialLabel: 'ALGARITM FILIALI',
      area: 'Uchtepa / Chilonzor (Algoritm dahasi)',
      addressNote: 'Toshkent sh., Algoritm mavzesi (aniq lokatsiya operator tomonidan Telegram orqali yuboriladi)',
      highlight: 'Algoritm va unga tutash hududlardagi o‘quvchilar uchun qulay filial.',
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr'],
    },
    {
      slug: 'yunusobod',
      name: 'Yunusobod filiali',
      officialLabel: 'YUNUSOBOD FILIALI',
      area: 'Yunusobod tumani',
      addressNote: 'Toshkent sh., Yunusobod tumani (aniq mo‘ljal +998 55 518 44 00 orqali tasdiqlanadi)',
      highlight: 'Yunusobod tumani aholisi va yoshlari uchun barcha bosqichdagi arab tili guruhlari.',
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr', 'kundalik-va-kasbiy-arab-tili'],
    },
    {
      slug: 'sergeli',
      name: 'Sergeli filiali',
      officialLabel: 'SERGILI FILIALI',
      area: 'Sergeli tumani',
      addressNote: 'Toshkent sh., Sergeli tumani (aniq lokatsiya call-markaz orqali yuboriladi)',
      highlight: 'Sergeli hududida bolajonlar va kattalar uchun tizimli arab tili darslari.',
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr'],
    },
    {
      slug: 'tinchlik',
      name: 'Tinchlik filiali',
      officialLabel: 'TINCHLIK FILIALI',
      area: 'Tinchlik metro yo‘nalishi',
      addressNote: 'Toshkent sh., Tinchlik hududi (aniq mo‘ljal va xarita havolasi +998 55 518 44 00 orqali beriladi)',
      highlight: 'Transport va metroga yaqin hududda joylashgan qulay filial.',
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr'],
    },
    {
      slug: 'beruniy',
      name: 'Beruniy filiali',
      officialLabel: 'BERUNIY FILIALI',
      area: 'Olmazor / Beruniy metro yo‘nalishi',
      addressNote: 'Toshkent sh., Beruniy hududi (aniq mo‘ljal operator tomonidan ma‘lum qilinadi)',
      highlight: 'Talabalar shaharchasi va Beruniy yo‘nalishidagi o‘quvchilar uchun faol filial.',
      courses: ['hilol-kids', 'professional-fonetika', 'grammatika-va-cefr', 'kundalik-va-kasbiy-arab-tili'],
    },
  ];

  for (const b of branchesData) {
    const branch = await prisma.branch.upsert({
      where: { slug: b.slug },
      update: {
        name: b.name,
        officialLabel: b.officialLabel,
        area: b.area,
        addressNote: b.addressNote,
        highlight: b.highlight,
        status: GeneralStatus.ACTIVE,
      },
      create: {
        slug: b.slug,
        name: b.name,
        officialLabel: b.officialLabel,
        area: b.area,
        addressNote: b.addressNote,
        highlight: b.highlight,
        status: GeneralStatus.ACTIVE,
      },
    });

    // Link BranchCourses
    for (const cSlug of b.courses) {
      const cId = courseMap.get(cSlug);
      if (cId) {
        await prisma.branchCourse.upsert({
          where: { branchId_courseId: { branchId: branch.id, courseId: cId } },
          update: {},
          create: { branchId: branch.id, courseId: cId },
        });
      }
    }
  }
  console.log(`✅ Seeded 8 verified Tashkent branches and course availability.`);

  // 5. Teachers & Departments
  const teachersData = [
    {
      slug: 'ustoz-abdulloh',
      fullName: 'Ustoz Abdulloh',
      department: 'Professional Fonetika kafedrasi',
      badge: 'Maxraj mutaxassisi',
      qualification: 'Arab fonetikasi va klassik talaffuz mutaxassisi',
      focus: '28 ta arab harfining artikulyatsion nuqtalari, boshlang‘ich talaffuz va eshitish mashqlari',
      biography: 'Ustoz Akademiyasida 0 dan boshlovchi o‘quvchilarga harflar maxraji va fonetika asoslaridan dars beradi.',
      photo: '/teachers/teacher_1.png',
      yearsOfExperience: 5,
      displayOrder: 1,
    },
    {
      slug: 'ustoz-muhammad',
      fullName: 'Ustoz Muhammad',
      department: 'Grammatika va CEFR kafedrasi',
      badge: 'C1 daraja (CEFR)',
      qualification: 'Xalqaro va milliy CEFR C1 sertifikati sohibi, filolog',
      focus: 'Sarf va Nahv qoidalari, CEFR imtihoni (Reading, Listening, Writing, Speaking)',
      biography: 'Grammatika va xalqaro sertifikat imtihonlariga tizimli tayyorlov bo‘yicha katta o‘qituvchi.',
      photo: '/teachers/teacher_2.png',
      yearsOfExperience: 6,
      displayOrder: 2,
    },
    {
      slug: 'ustoz-ibrohim',
      fullName: 'Ustoz Ibrohim',
      department: 'Kundalik va Kasbiy Arab Tili',
      badge: 'Intensiv so‘zlashuv',
      qualification: 'Amaliy muloqot va faol leksika mutaxassisi',
      focus: 'Sayohat, biznes va kundalik muloqotda kerak bo‘ladigan eng faol mavzular va jonli nutq',
      biography: 'O‘quvchilarda arab tilida erkin fikrlash va ravon so‘zlashish ko‘nikmalarini shakllantiradi.',
      photo: '/teachers/teacher_3.png',
      yearsOfExperience: 4,
      displayOrder: 3,
    },
    {
      slug: 'ustoz-hasan',
      fullName: 'Ustoz Hasan',
      department: 'Qiroat va Fonetika kafedrasi',
      badge: 'Harflar nozikligi',
      qualification: 'Qiroat va klassik arab tili talaffuz mutaxassisi',
      focus: 'Ko‘pincha bir xil o‘qiladigan va o‘xshash harflarning nozik fonetik farqlari',
      biography: 'Arab tilidagi nozik tovushlar va qiyosiy maxraj qoidalarini aniq o‘rgatadi.',
      photo: '/teachers/teacher_4.png',
      yearsOfExperience: 5,
      displayOrder: 4,
    },
  ];

  for (const t of teachersData) {
    await prisma.teacher.upsert({
      where: { slug: t.slug },
      update: {
        fullName: t.fullName,
        department: t.department,
        badge: t.badge,
        qualification: t.qualification,
        focus: t.focus,
        biography: t.biography,
        photo: t.photo,
        yearsOfExperience: t.yearsOfExperience,
        displayOrder: t.displayOrder,
        status: GeneralStatus.ACTIVE,
      },
      create: {
        slug: t.slug,
        fullName: t.fullName,
        department: t.department,
        badge: t.badge,
        qualification: t.qualification,
        focus: t.focus,
        biography: t.biography,
        photo: t.photo,
        yearsOfExperience: t.yearsOfExperience,
        displayOrder: t.displayOrder,
        status: GeneralStatus.ACTIVE,
      },
    });
  }
  console.log(`✅ Seeded verified teachers with photos.`);

  // 6. Verified Articles
  const articlesData = [
    {
      slug: 'kundalik-hayotda-kerak-boladigan-10-ta-arabcha-soz',
      title: "Kundalik hayotda kerak bo'ladigan 10 ta Arabcha so'z va ibora",
      topic: "Kundalik lug'at",
      readTime: '4 daqiqa',
      sourceNote: 'Instagram (@ustoz_akademiyasi) rasmiy o‘quv rukni asosida',
      excerpt: "Arab tilini o'rganishni boshlagan har bir inson kundalik suhbatda, salomlashishda va o'zaro hurmat bildirishda eng ko'p ishlatadigan 10 ta muhim ibora.",
      intro: "Til o'rganishning eng samarali usuli — har kuni eng ko'p takrorlanadigan jonli so'zlarni to'g'ri talaffuz bilan nutqqa kiritishdir. Ustoz Akademiyasi ustozlari kundalik muloqotda eng zarur bo'lgan 10 ta arabcha so'z va iborani jamlab chiqdilar.",
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
        { ar: 'مَعَ السَّلَامَةِ', tr: "Ma'as-salama", uz: 'Xayr, omonlikda ko‘rishguncha' },
      ],
    },
    {
      slug: 'arab-tilini-organishdagi-5-ta-muhim-sir',
      title: "Arab tilini oson o'rganishdagi 5 ta muhim sir",
      topic: 'Metodika va Tavsiya',
      readTime: '5 daqiqa',
      sourceNote: 'Telegram (t.me/ustozakademiyasi) kanalidagi maxsus qo‘llanma asosida',
      excerpt: "Nima uchun ba'zi o'quvchilar arab tilini oylar davomida qiynalib o'rganadi, tizimli yondashganlar esa qisqa vaqtda ravon o'qish va tushunishga chiqadi?",
      intro: "Rasmiy Telegram kanalimizning qadab qo'yilgan (pinned) xabarida ta'kidlanganidek, arab tilini oson o'zlashtirish uchun tartibli poydevor zarur.",
      items: [
        { ar: '١. الْمَخْرَجُ الصَّحِيحُ', tr: "1-sir: Harfni boshidanoq to'g'ri maxrajdan o'rganish", uz: "Arab harflarini kirill yoki lotin harflariga o'xshatib yodlamang." },
        { ar: '٢. الْمُدَاوَمَةُ الْيَوْمِيَّةُ', tr: '2-sir: Kunlik uzluksizlik (oz-ozdan, lekin har kuni)', uz: "Haftada bir kun 3 soat o'qigandan ko'ra, har kuni 20–30 daqiqa davomida takrorlash samaraliroq." },
      ],
    },
  ];

  for (const a of articlesData) {
    const art = await prisma.article.upsert({
      where: { slug: a.slug },
      update: {
        title: a.title,
        topic: a.topic,
        readTime: a.readTime,
        sourceNote: a.sourceNote,
        excerpt: a.excerpt,
        intro: a.intro,
        status: ContentStatus.PUBLISHED,
      },
      create: {
        slug: a.slug,
        title: a.title,
        topic: a.topic,
        readTime: a.readTime,
        sourceNote: a.sourceNote,
        excerpt: a.excerpt,
        intro: a.intro,
        status: ContentStatus.PUBLISHED,
      },
    });

    await prisma.articleItem.deleteMany({ where: { articleId: art.id } });
    await prisma.articleItem.createMany({
      data: a.items.map((item, idx) => ({
        articleId: art.id,
        arabicText: item.ar,
        translit: item.tr,
        translation: item.uz,
        sortOrder: idx + 1,
      })),
    });
  }
  console.log(`✅ Seeded verified educational articles.`);

  // 7. FAQs
  const faqsData = [
    { category: "Boshlang'ich", question: 'Arab tilini umuman 0 dan boshlasam, qaysi kursga yozilishim kerak?', answer: "Agar siz hali arab harflarini tanimasangiz yoki talaffuzingizda ikkilanish bo'lsa, o'qishni «Professional Fonetika» kursidan boshlaysiz. Bu bosqichda 28 ta harfning maxraji va o'qish qoidalari to'liq o'rgatiladi.", sortOrder: 1 },
    { category: 'Bolalar uchun', question: 'Hilol Kids 4+ kursiga necha yoshdan qabul qilinadi va darslar qanday o‘tiladi?', answer: "Hilol Kids 4+ dasturiga 4 yoshdan boshlab bolajonlar qabul qilinadi. Darslar zerikarli yodlashsiz — maxsus arabcha multfilmlar, «Bolajonlar bilan raqamlarni topish o'yini» va ko'rgazmali kartochkalar orqali olib boriladi.", sortOrder: 2 },
    { category: 'Filiallar', question: 'Toshkent shahrining qaysi hududlarida filiallaringiz bor?', answer: "Ustoz Akademiyasining Toshkent shahrida 8 ta filiali faoliyat yuritadi: Archako'cha, Yangi ToshMI, Qoraqamish, Algoritm, Yunusobod, Sergeli, Tinchlik va Beruniy filiallari.", sortOrder: 3 },
    { category: 'Sertifikat', question: 'Grammatika va CEFR kursida qaysi darajalarga tayyorlanadi?', answer: "Fonetika bosqichini tamomlagan o'quvchilar Sarf va Nahv qoidalari bilan birga A2, B1, B2 hamda C1 (Milliy va xalqaro CEFR) sertifikat imtihonlarining 4 ta bo'limiga tizimli tayyorlanadilar.", sortOrder: 4 },
    { category: "To'lov va Jadval", question: 'Kurs narxlari va dars vaqtlarini qanday bilsam bo‘ladi?', answer: "Har bir filialdagi guruhlar jadvali hamda joriy o'quv to'lovlari bo'yicha aniq ma'lumot olish uchun saytdagi sinov darsi shaklini to'ldiring yoki +998 55 518 44 00 raqamiga qo'ng'iroq qiling.", sortOrder: 5 },
    { category: 'Sinov darsi', question: 'Sinov darsiga qanday yozilaman va u qanday o‘tadi?', answer: "«Bepul sinov darsiga yozilish» sahifasida ismingiz, telefon raqamingiz, kurs va o'zingizga yaqin filialni tanlaysiz. Ma'muriyatimiz siz bilan bog'lanib, darajangizga mos guruh va vaqtni belgilab beradi.", sortOrder: 6 },
  ];

  for (const f of faqsData) {
    const existing = await prisma.fAQ.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.fAQ.create({ data: { question: f.question, answer: f.answer, category: f.category, sortOrder: f.sortOrder, status: GeneralStatus.ACTIVE } });
    }
  }
  console.log(`✅ Seeded verified FAQs.`);

  // 8. Achievements
  const achievementsData = [
    { title: 'Bitiruvchilar', value: '15,000+', unit: 'o‘quvchilar', icon: 'Award', sortOrder: 1 },
    { title: 'Toshkentdagi filiallar', value: '8 ta', unit: 'rasmiy filial', icon: 'MapPin', sortOrder: 2 },
    { title: 'Instagram obunachilar', value: '134K+', unit: 'kuzatuvchi', icon: 'Users', sortOrder: 3 },
    { title: 'CEFR C1 daraja', value: 'C1', unit: 'tayyorlov bosqichi', icon: 'GraduationCap', sortOrder: 4 },
  ];

  for (const ach of achievementsData) {
    const existing = await prisma.achievement.findFirst({ where: { title: ach.title } });
    if (!existing) {
      await prisma.achievement.create({ data: { title: ach.title, value: ach.value, unit: ach.unit, icon: ach.icon, displayOrder: ach.sortOrder, status: GeneralStatus.ACTIVE } });
    }
  }
  console.log(`✅ Seeded verified achievements.`);

  // 9. Site Settings
  const defaultSettings = [
    {
      key: 'brand_info',
      value: {
        name: 'Ustoz Akademiyasi',
        sloganPrimary: "O'QI VA KO'TARIL!",
        sloganSecondary: 'Zulmatlardan Nur tomon',
        city: 'Toshkent shahri',
        branchesCount: 8,
      },
      description: "Asosiy brend nomi va shiorlar",
    },
    {
      key: 'contact_info',
      value: {
        phoneDisplay: '+998 55 518 44 00',
        phoneHref: 'tel:+998555184400',
        phoneRaw: '+998555184400',
      },
      description: "Yagona call-markaz telefon raqamlari",
    },
    {
      key: 'social_links',
      value: {
        instagramHandle: '@ustoz_akademiyasi',
        instagramUrl: 'https://instagram.com/ustoz_akademiyasi',
        telegramHandle: '@ustozakademiyasi',
        telegramUrl: 'https://t.me/ustozakademiyasi',
      },
      description: "Rasmiy ijtimoiy tarmoq sahifalari",
    },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description, isPublic: true },
      create: { key: s.key, value: s.value, description: s.description, isPublic: true },
    });
  }
  console.log(`✅ Seeded public site settings.`);

  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
