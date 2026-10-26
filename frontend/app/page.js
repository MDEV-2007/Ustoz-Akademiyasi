'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { I18nProvider, useI18n } from '@/lib/i18n';
import { UstozApi } from '@/lib/api-client';
import {
  INITIAL_BRAND_CONFIG,
  INITIAL_COURSES,
  INITIAL_BRANCHES,
  INITIAL_GRADUATES,
  INITIAL_KIDS_GRADUATES,
  INITIAL_ARTICLES,
  INITIAL_TEACHERS,
  INITIAL_TEACHING_DEPARTMENTS,
  INITIAL_FAQ_ITEMS,
  ARABIC_PLAYGROUND_LETTERS,
  PLAYGROUND_QUIZ,
  KIDS_NUMBERS_DATA
} from '@/lib/constants/academy-data';
import { formatUzbekPhoneInput, validateUzbekPhone } from '@/features/registration/validation';
import { submitRegistration } from '@/features/registration/registrationService';
import { playArabicAudio } from '@/lib/utils/audio';

// Shared UI & Layout Components
import BrandSplashScreen from '@/components/ui/BrandSplashScreen';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileNavDrawer from '@/components/layout/MobileNavDrawer';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import AdminDevModal from '@/components/modals/AdminDevModal';

// Route Subpages
import HomePage from '@/components/pages/HomePage';
import CoursesPage from '@/components/pages/CoursesPage';
import BranchesPage from '@/components/pages/BranchesPage';
import InteractiveArabicPage from '@/components/pages/InteractiveArabicPage';
import AboutFacultyPage from '@/components/pages/AboutFacultyPage';
import ArticlesPage from '@/components/pages/ArticlesPage';
import FAQPage from '@/components/pages/FAQPage';
import RegistrationPage from '@/components/pages/RegistrationPage';
import ContactPolicyPage from '@/components/pages/ContactPolicyPage';

export default function App({ initialLocale = 'uz', initialPath = '/' }) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <AppContent initialLocale={initialLocale} initialPath={initialPath} />
    </I18nProvider>
  );
}

function AppContent({ initialLocale = 'uz', initialPath = '/' }) {
  const { t, locale } = useI18n();

  // --- Live Data Synchronized with NestJS / PostgreSQL Backend ---
  const [coursesList, setCoursesList] = useState(INITIAL_COURSES);
  const [branchesList, setBranchesList] = useState(INITIAL_BRANCHES);
  const [departmentsList, setDepartmentsList] = useState(INITIAL_TEACHING_DEPARTMENTS);
  const [teachersList, setTeachersList] = useState(INITIAL_TEACHERS);
  const [articlesList, setArticlesList] = useState(INITIAL_ARTICLES);
  const [faqsList, setFaqsList] = useState(INITIAL_FAQ_ITEMS);
  const [brandConfig, setBrandConfig] = useState(INITIAL_BRAND_CONFIG);
  const [apiStatus, setApiStatus] = useState({ loading: false, connected: false, error: null });

  // Localize content reactively based on active language (uz, ru, en)
  const COURSES = useMemo(() => {
    return coursesList.map((c) => {
      const loc = t.courses?.items?.[c.slug];
      if (!loc) return c;
      return {
        ...c,
        title: loc.title || c.title,
        category: loc.category || c.category,
        audience: loc.audience || c.audience,
        level: loc.level || c.level,
        shortSummary: loc.shortSummary || c.shortSummary,
        methodology: loc.methodology || c.methodology,
        entryRequirements: loc.entryRequirements || c.entryRequirements,
        durationNote: loc.durationNote || c.durationNote,
        priceStatus: loc.priceStatus || c.priceStatus,
        objectives: loc.objectives || c.objectives,
        syllabus: loc.syllabus || c.syllabus
      };
    });
  }, [coursesList, t.courses]);

  const BRANCHES = useMemo(() => {
    return branchesList.map((b) => {
      const loc = t.branches?.items?.[b.slug];
      if (!loc) return b;
      return {
        ...b,
        name: loc.name || b.name,
        officialLabel: loc.officialLabel || b.officialLabel,
        area: loc.area || b.area,
        addressNote: loc.address || b.addressNote,
        hours: loc.workingHours || b.hours,
        highlight: loc.highlight || b.highlight
      };
    });
  }, [branchesList, t.branches]);

  const TEACHING_DEPARTMENTS = useMemo(() => {
    return departmentsList.map((d) => {
      const loc = t.departments?.items?.[d.id];
      if (!loc) return d;
      return {
        ...d,
        title: loc.title || d.title,
        badge: loc.badge || d.badge,
        qualification: loc.qualification || d.qualification,
        focus: loc.focus || d.focus
      };
    });
  }, [departmentsList, t.departments]);

  const TEACHERS = useMemo(() => {
    return teachersList.map((tch) => {
      const loc = t.teachers?.items?.[tch.id];
      if (!loc) return tch;
      return {
        ...tch,
        fullName: loc.fullName || tch.fullName,
        role: loc.role || tch.role,
        department: loc.department || tch.department,
        badge: loc.badge || tch.badge,
        experience: loc.experience || tch.experience,
        motto: loc.motto || tch.motto,
        description: loc.description || tch.description
      };
    });
  }, [teachersList, t.teachers]);

  const ARTICLES = useMemo(() => {
    return articlesList.map((a) => {
      const loc = t.articles?.items?.[a.slug];
      if (!loc) return a;
      return {
        ...a,
        title: loc.title || a.title,
        topic: loc.topic || a.topic,
        excerpt: loc.excerpt || a.excerpt,
        intro: loc.intro || a.intro
      };
    });
  }, [articlesList, t.articles]);

  const FAQ_ITEMS = useMemo(() => {
    return faqsList.map((f, idx) => {
      const loc = t.faq?.items?.[idx];
      if (!loc) return f;
      return {
        ...f,
        category: loc.category || f.category,
        q: loc.q || f.q,
        a: loc.a || f.a
      };
    });
  }, [faqsList, t.faq]);

  const BRAND_CONFIG = useMemo(() => {
    return {
      ...brandConfig,
      sloganPrimary: t.nav?.sloganPrimary || brandConfig.sloganPrimary,
      sloganSecondary: t.nav?.sloganSecondary || brandConfig.sloganSecondary
    };
  }, [brandConfig, t.nav]);

  // Router State
  const [route, setRoute] = useState(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.replace(/^\/(uz|ru|en)/, '') || '/';
      return { path: p, params: {} };
    }
    return { path: initialPath || '/', params: {} };
  });

  // Popstate history listener
  useEffect(() => {
    const syncFromUrl = (e) => {
      if (typeof window !== 'undefined') {
        const p = window.location.pathname.replace(/^\/(uz|ru|en)/, '') || '/';
        setRoute((prev) => (prev.path === p ? prev : { path: p, params: e?.state?.params || {} }));
      }
    };
    window.addEventListener('popstate', syncFromUrl);
    return () => window.removeEventListener('popstate', syncFromUrl);
  }, []);

  // Navigation UI State
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);

  // Filters
  const [courseFilter, setCourseFilter] = useState('all');

  // Interactive Arabic Playground State
  const [playgroundTab, setPlaygroundTab] = useState('harflar');
  const [selectedLetter, setSelectedLetter] = useState(ARABIC_PLAYGROUND_LETTERS[0]);
  const [audioStatus, setAudioStatus] = useState('idle');
  const [audioMessage, setAudioMessage] = useState('');

  // Quiz State
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState(null);
  const [quizResult, setQuizResult] = useState(null);

  // Kids Numbers Game
  const [kidsGameNumber, setKidsGameNumber] = useState(KIDS_NUMBERS_DATA[0]);
  const [kidsGameScore, setKidsGameScore] = useState(0);

  // Trial-Lesson Registration State
  const [regForm, setRegForm] = useState({
    fullName: '',
    phone: '+998 ',
    courseSlug: 'professional-fonetika',
    branchSlug: 'archakocha',
    selectedTeacher: '',
    notes: ''
  });
  const [regErrors, setRegErrors] = useState({});
  const [regSubmitStatus, setRegSubmitStatus] = useState('idle');
  const [confirmedLead, setConfirmedLead] = useState(null);
  const [lastSubmittedKey, setLastSubmittedKey] = useState('');
  const [telegramBotConfig, setTelegramBotConfig] = useState({ botToken: '', chatId: '' });
  const [customPhotos, setCustomPhotos] = useState({});

  // Read URL query params on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const branchParam = urlParams.get('branchSlug');
    const courseParam = urlParams.get('courseSlug');
    const teacherParam = urlParams.get('teacher');
    if (branchParam || courseParam || teacherParam) {
      setRegForm((prev) => ({
        ...prev,
        branchSlug: branchParam || prev.branchSlug,
        courseSlug: courseParam || prev.courseSlug,
        selectedTeacher: teacherParam || prev.selectedTeacher || '',
        notes: teacherParam
          ? `Ustoz: ${teacherParam.replace(/^Ustoz\s+/i, '').trim()} ustozni tanladi`
          : prev.notes
      }));
    }
  }, []);

  // Sync with NestJS Backend API
  useEffect(() => {
    let active = true;
    async function loadBackendData() {
      try {
        setApiStatus((prev) => ({ ...prev, loading: true }));
        const [coursesRes, branchesRes, teachersRes, articlesRes, faqsRes, settingsRes] =
          await Promise.allSettled([
            UstozApi.getCourses(),
            UstozApi.getBranches(),
            UstozApi.getTeachers(),
            UstozApi.getArticles(),
            UstozApi.getFaqs(),
            UstozApi.getSettings()
          ]);

        if (!active) return;

        if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value) && coursesRes.value.length > 0) {
          setCoursesList((prev) =>
            coursesRes.value.map((apiCourse) => {
              const localMatch = prev.find((c) => c.slug === apiCourse.slug || c.id === apiCourse.id);
              return {
                ...(localMatch || {}),
                ...apiCourse,
                title: apiCourse.title || localMatch?.title,
                shortSummary: apiCourse.shortSummary || apiCourse.description || localMatch?.shortSummary,
                syllabus: apiCourse.syllabus?.length > 0 ? apiCourse.syllabus : localMatch?.syllabus
              };
            })
          );
        }

        if (branchesRes.status === 'fulfilled' && Array.isArray(branchesRes.value) && branchesRes.value.length > 0) {
          setBranchesList((prev) =>
            branchesRes.value.map((apiBranch) => {
              const localMatch = prev.find((b) => b.slug === apiBranch.slug || b.id === apiBranch.id);
              return {
                ...(localMatch || {}),
                ...apiBranch,
                name: apiBranch.name || localMatch?.name,
                address: apiBranch.address || localMatch?.address,
                phone: apiBranch.phone || localMatch?.phone,
                landmark: apiBranch.landmark || localMatch?.landmark,
                workingHours: apiBranch.workingHours || localMatch?.workingHours
              };
            })
          );
        }

        if (settingsRes.status === 'fulfilled' && settingsRes.value) {
          const s = settingsRes.value;
          const brand = s.brand_info || {};
          const contact = s.contact_info || {};
          const social = s.social_links || {};
          setBrandConfig((prev) => ({
            ...prev,
            ...(brand.name ? { name: brand.name } : {}),
            ...(brand.branchesCount ? { branchesCount: brand.branchesCount } : {}),
            ...(contact.phoneDisplay ? { phoneDisplay: contact.phoneDisplay } : {}),
            ...(contact.phoneHref ? { phoneHref: contact.phoneHref } : {}),
            ...(contact.phoneRaw ? { phoneRaw: contact.phoneRaw } : {}),
            ...(social.instagramHandle ? { instagramHandle: social.instagramHandle } : {}),
            ...(social.telegramHandle ? { telegramHandle: social.telegramHandle } : {})
          }));
        }

        setApiStatus({ loading: false, connected: true, error: null });
      } catch (err) {
        if (!active) return;
        setApiStatus({ loading: false, connected: false, error: err.message });
      }
    }
    loadBackendData();
    return () => {
      active = false;
    };
  }, []);

  // Lock body scroll when mobile menu or admin modal is open
  useEffect(() => {
    if (mobileNavOpen || adminDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
        setMobileNavOpen(false);
        setAdminDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileNavOpen, adminDrawerOpen]);

  // Scroll Reveal Observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.innerWidth <= 768 || prefersReduced || !('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px 50px 0px' }
    );

    const elements = document.querySelectorAll('.reveal-on-scroll:not(.is-revealed)');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [route.path, courseFilter, coursesList, branchesList, teachersList, articlesList, faqsList]);

  // Navigate helper
  const navigate = useCallback(
    (path, params = {}) => {
      setOpenDropdown(null);
      setMobileNavOpen(false);

      if (path === '/royxatdan-otish') {
        const teacherNote = params.teacher
          ? `Ustoz: ${params.teacher.replace(/^Ustoz\s+/i, '').trim()} ustozni tanladi`
          : params.notes || '';

        setRegForm((prev) => ({
          ...prev,
          courseSlug: params.courseSlug || prev.courseSlug,
          branchSlug: params.branchSlug || prev.branchSlug,
          selectedTeacher: params.teacher || (params.selectedTeacher !== undefined ? params.selectedTeacher : prev.selectedTeacher),
          notes: teacherNote || prev.notes
        }));
        if (regSubmitStatus !== 'accepted') {
          setRegSubmitStatus('idle');
        }
      }

      setRoute({ path, params });

      if (typeof window !== 'undefined') {
        const activeLocale = locale || initialLocale || 'uz';
        const targetUrl = `/${activeLocale}${path === '/' ? '' : path}`;
        if (window.location.pathname !== targetUrl) {
          window.history.pushState({ path, params }, '', targetUrl);
        }
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [locale, initialLocale, regSubmitStatus]
  );

  // SEO Metadata
  const seoMeta = useMemo(() => {
    const base = 'Ustoz Akademiyasi — Toshkentdagi Arab Tili O‘quv Markazi';
    const p = route.path;

    if (p === '/') {
      return {
        title: `${base} | 8 ta Filial • Hilol Kids 4+ • Fonetika • CEFR`,
        description:
          "Ustoz Akademiyasi — Toshkent bo'ylab 8 ta filial va 15,000+ bitiruvchiga ega arab tili o'quv markazi. Hilol Kids 4+, Professional fonetika, Grammatika va CEFR kurslari. Tel: +998 55 518 44 00.",
        canonical: 'https://ustozakademiyasi.uz/'
      };
    }
    if (p === '/kurslar') {
      return {
        title: `Arab Tili Kurslari | Hilol Kids 4+, Fonetika, Grammatika va CEFR — Ustoz Akademiyasi`,
        description:
          "4 yoshdan katta bolalar va kattalar uchun arab tili kurslari: Hilol Kids 4+, Professional fonetika, Grammatika va CEFR tayyorlov dasturlari.",
        canonical: 'https://ustozakademiyasi.uz/kurslar'
      };
    }
    if (p.startsWith('/kurslar/')) {
      const slug = p.replace('/kurslar/', '');
      const c = COURSES.find((item) => item.slug === slug);
      return {
        title: c ? `${c.title} kursi — Ustoz Akademiyasi` : base,
        description: c ? c.shortSummary : '',
        canonical: `https://ustozakademiyasi.uz/kurslar/${slug}`
      };
    }
    if (p === '/filiallar') {
      return {
        title: `Toshkentdagi 8 ta Filialimiz Manzillari — Ustoz Akademiyasi`,
        description:
          "Archako'cha, Yangi ToshMI, Qoraqamish, Algoritm, Yunusobod, Sergeli, Tinchlik va Beruniy filiallari haqida ma'lumot.",
        canonical: 'https://ustozakademiyasi.uz/filiallar'
      };
    }
    if (p.startsWith('/filiallar/')) {
      const slug = p.replace('/filiallar/', '');
      const b = BRANCHES.find((item) => item.slug === slug);
      return {
        title: b ? `${b.name} — Ustoz Akademiyasi Toshkent` : base,
        description: b ? `${b.name}: mavjud arab tili kurslari, ish tartibi va sinov darsiga yozilish.` : '',
        canonical: `https://ustozakademiyasi.uz/filiallar/${slug}`
      };
    }
    return {
      title: base,
      description: 'Ustoz Akademiyasi — Arab tili markazi.',
      canonical: 'https://ustozakademiyasi.uz/'
    };
  }, [route.path, COURSES, BRANCHES]);

  const jsonLdString = useMemo(() => {
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Ustoz Akademiyasi',
      url: 'https://ustozakademiyasi.uz',
      telephone: BRAND_CONFIG.phoneDisplay,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Toshkent',
        addressCountry: 'UZ'
      }
    });
  }, [BRAND_CONFIG]);

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    const p = route.path;
    if (p === '/') return [];
    const homeLabel = locale === 'ru' ? 'Главная' : locale === 'en' ? 'Home' : 'Bosh sahifa';
    const items = [{ label: homeLabel, path: '/' }];

    if (p === '/kurslar') items.push({ label: t.nav?.courses || 'Kurslar', path: '/kurslar' });
    else if (p.startsWith('/kurslar/')) {
      const c = COURSES.find((x) => x.slug === p.replace('/kurslar/', ''));
      items.push({ label: t.nav?.courses || 'Kurslar', path: '/kurslar' });
      items.push({ label: c ? c.title : 'Kurs', path: p });
    } else if (p === '/filiallar') {
      items.push({ label: t.nav?.allBranches || 'Filiallar', path: '/filiallar' });
    } else if (p.startsWith('/filiallar/')) {
      const b = BRANCHES.find((x) => x.slug === p.replace('/filiallar/', ''));
      items.push({ label: t.nav?.allBranches || 'Filiallar', path: '/filiallar' });
      items.push({ label: b ? b.name : 'Filial', path: p });
    } else if (p === '/interaktiv-arab-tili') {
      items.push({ label: t.nav?.interactive || 'Interaktiv Arab Tili', path: p });
    } else if (p === '/markaz-haqida') {
      items.push({ label: t.nav?.aboutCenter || 'Markaz haqida', path: p });
    } else if (p === '/ustozlar') {
      items.push({ label: t.nav?.teachers || 'Ustozlar', path: p });
    } else if (p === '/natijalar') {
      items.push({ label: t.nav?.results || 'Natijalar', path: p });
    } else if (p === '/maqolalar') {
      items.push({ label: t.nav?.articles || 'Maqolalar', path: p });
    } else if (p.startsWith('/maqolalar/')) {
      const artSlug = p.replace('/maqolalar/', '');
      const currentArt = (ARTICLES || []).find((x) => x.slug === artSlug);
      items.push({ label: t.nav?.articles || 'Maqolalar', path: '/maqolalar' });
      items.push({ label: currentArt ? currentArt.title : 'Maqola', path: p });
    } else if (p === '/savol-javob') {
      items.push({ label: t.nav?.faq || 'Savol-Javob', path: p });
    } else if (p === '/royxatdan-otish') {
      items.push({ label: t.nav?.trialBtn || 'Ro‘yxatdan o‘tish', path: p });
    } else if (p === '/royxatdan-otish/tasdiq') {
      items.push({ label: 'Tasdiqnoma', path: p });
    } else if (p === '/aloqa') {
      items.push({ label: 'Aloqa', path: p });
    } else if (p === '/maxfiylik-siyosati') {
      items.push({ label: 'Maxfiylik siyosati', path: p });
    }
    return items;
  }, [route.path, locale, t.nav, COURSES, BRANCHES, ARTICLES]);

  // Audio Handler
  const playArabicPronunciation = (arabicText, freq = 340, labelUz = '') => {
    playArabicAudio(arabicText, freq, labelUz, (status, msg) => {
      setAudioStatus(status);
      setAudioMessage(msg);
    });
  };

  // Registration Handlers
  const handleRegChange = (field, val) => {
    let nextVal = val;
    if (field === 'phone') {
      nextVal = formatUzbekPhoneInput(val);
    }
    setRegForm((prev) => ({ ...prev, [field]: nextVal }));
    if (regErrors[field]) {
      setRegErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();
    const phoneCheck = validateUzbekPhone(regForm.phone);
    const dedupeKey = `${phoneCheck.e164}-${regForm.courseSlug}-${regForm.branchSlug}`;

    if (dedupeKey === lastSubmittedKey && regSubmitStatus === 'accepted') {
      setRegErrors({
        duplicate: "Ushbu telefon raqami va kurs bo'yicha ariza allaqachon yuborilgan."
      });
      return;
    }

    setRegErrors({});
    setRegSubmitStatus('submitting');

    const result = await submitRegistration({
      regForm,
      courses: COURSES,
      branches: BRANCHES,
      telegramBotConfig,
      sourceUrl: seoMeta.canonical
    });

    if (result.success) {
      setLastSubmittedKey(result.dedupeKey);
      setConfirmedLead(result.confirmedLead);
      setRegSubmitStatus('accepted');
      navigate('/royxatdan-otish/tasdiq');
    } else {
      setRegErrors(result.errors || {});
      setRegSubmitStatus('error');
    }
  };

  // Custom Photo Upload
  const handleCustomPhotoUpload = (slotKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomPhotos((prev) => ({ ...prev, [slotKey]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Quiz Handlers
  const handleQuizOptionSelect = (idx) => {
    if (quizSelectedOption !== null) return;
    setQuizSelectedOption(idx);
    const currentQuestion = PLAYGROUND_QUIZ[quizIndex];
    if (idx === currentQuestion.correctIndex) {
      setQuizResult('correct');
    } else {
      setQuizResult('incorrect');
    }
  };

  const resetQuiz = () => {
    setQuizIndex((prev) => (prev + 1) % PLAYGROUND_QUIZ.length);
    setQuizSelectedOption(null);
    setQuizResult(null);
  };

  // Kids Game Handlers
  const handleKidsGuess = (num) => {
    if (num.number === kidsGameNumber.number) {
      setKidsGameScore((prev) => prev + 1);
      const nextIdx = Math.floor(Math.random() * KIDS_NUMBERS_DATA.length);
      setKidsGameNumber(KIDS_NUMBERS_DATA[nextIdx]);
    }
  };

  // Visible Courses according to filter
  const visibleCourses = useMemo(() => {
    if (courseFilter === 'all' || courseFilter === 'Barchasi') return COURSES;
    if (courseFilter === 'kids') return COURSES.filter((c) => c.slug === 'hilol-kids');
    if (courseFilter === 'adults') return COURSES.filter((c) => c.slug === 'professional-fonetika');
    if (courseFilter === 'cert') return COURSES.filter((c) => c.slug === 'grammatika-cefr');
    if (courseFilter === 'conv') return COURSES.filter((c) => c.slug === 'sozlashuv');
    return COURSES;
  }, [COURSES, courseFilter]);

  // Route Content Dispatcher
  const renderCurrentPage = () => {
    const p = route.path;

    if (p === '/') {
      return (
        <HomePage
          brandConfig={BRAND_CONFIG}
          courses={COURSES}
          branches={BRANCHES}
          teachers={TEACHERS}
          departments={TEACHING_DEPARTMENTS}
          articles={ARTICLES}
          graduates={INITIAL_GRADUATES}
          kidsGraduates={INITIAL_KIDS_GRADUATES}
          faqItems={FAQ_ITEMS}
          navigate={navigate}
          courseFilter={courseFilter}
          setCourseFilter={setCourseFilter}
          visibleCourses={visibleCourses}
          customPhotos={customPhotos}
          playgroundTab={playgroundTab}
          setPlaygroundTab={setPlaygroundTab}
          selectedLetter={selectedLetter}
          setSelectedLetter={setSelectedLetter}
          audioPlaying={audioStatus === 'playing'}
          playArabicPronunciation={playArabicPronunciation}
          quizIndex={quizIndex}
          quizSelectedOption={quizSelectedOption}
          quizResult={quizResult}
          handleQuizOptionSelect={handleQuizOptionSelect}
          resetQuiz={resetQuiz}
          kidsGameNumber={kidsGameNumber}
          kidsGameScore={kidsGameScore}
          handleKidsGuess={handleKidsGuess}
          regForm={regForm}
          regErrors={regErrors}
          handleRegChange={handleRegChange}
          handleRegistrationSubmit={handleRegistrationSubmit}
          submitStatus={regSubmitStatus}
          apiDiagnostic={{
            backendStatus: apiStatus.connected ? 'online' : 'fallback',
            error: apiStatus.error
          }}
          t={t}
        />
      );
    }

    if (p === '/kurslar' || p.startsWith('/kurslar/')) {
      return (
        <CoursesPage
          path={p}
          courses={COURSES}
          branches={BRANCHES}
          customPhotos={customPhotos}
          brandConfig={BRAND_CONFIG}
          navigate={navigate}
          regForm={regForm}
          regErrors={regErrors}
          handleRegChange={handleRegChange}
          handleRegistrationSubmit={handleRegistrationSubmit}
          submitStatus={regSubmitStatus}
          apiDiagnostic={{
            backendStatus: apiStatus.connected ? 'online' : 'fallback',
            error: apiStatus.error
          }}
          t={t}
        />
      );
    }

    if (p === '/filiallar' || p.startsWith('/filiallar/')) {
      return (
        <BranchesPage
          path={p}
          branches={BRANCHES}
          navigate={navigate}
          brandConfig={BRAND_CONFIG}
          locale={locale}
          t={t}
        />
      );
    }

    if (p === '/interaktiv-arab-tili') {
      return (
        <InteractiveArabicPage
          playgroundTab={playgroundTab}
          setPlaygroundTab={setPlaygroundTab}
          selectedLetter={selectedLetter}
          setSelectedLetter={setSelectedLetter}
          audioPlaying={audioStatus === 'playing'}
          playArabicPronunciation={playArabicPronunciation}
          quizIndex={quizIndex}
          quizSelectedOption={quizSelectedOption}
          quizResult={quizResult}
          handleQuizOptionSelect={handleQuizOptionSelect}
          resetQuiz={resetQuiz}
          kidsGameNumber={kidsGameNumber}
          kidsGameScore={kidsGameScore}
          handleKidsGuess={handleKidsGuess}
          t={t}
        />
      );
    }

    if (p === '/markaz-haqida' || p === '/ustozlar' || p === '/natijalar') {
      return (
        <AboutFacultyPage
          path={p}
          teachers={TEACHERS}
          departments={TEACHING_DEPARTMENTS}
          graduates={INITIAL_GRADUATES}
          navigate={navigate}
          t={t}
        />
      );
    }

    if (p === '/maqolalar' || p.startsWith('/maqolalar/')) {
      return (
        <ArticlesPage
          path={p}
          articles={ARTICLES}
          courses={COURSES}
          navigate={navigate}
          playArabicPronunciation={playArabicPronunciation}
          t={t}
        />
      );
    }

    if (p === '/savol-javob') {
      return <FAQPage faqItems={FAQ_ITEMS} t={t} />;
    }

    if (p === '/royxatdan-otish' || p === '/royxatdan-otish/tasdiq') {
      return (
        <RegistrationPage
          path={p}
          courses={COURSES}
          branches={BRANCHES}
          brandConfig={BRAND_CONFIG}
          regForm={regForm}
          regErrors={regErrors}
          handleRegChange={handleRegChange}
          handleRegistrationSubmit={handleRegistrationSubmit}
          submitStatus={regSubmitStatus}
          apiDiagnostic={{
            backendStatus: apiStatus.connected ? 'online' : 'fallback',
            error: apiStatus.error
          }}
          confirmedLead={confirmedLead}
          navigate={navigate}
          locale={locale}
          t={t}
        />
      );
    }

    if (p === '/aloqa' || p === '/maxfiylik-siyosati') {
      return (
        <ContactPolicyPage
          path={p}
          brandConfig={BRAND_CONFIG}
          courses={COURSES}
          branches={BRANCHES}
          navigate={navigate}
          regForm={regForm}
          regErrors={regErrors}
          handleRegChange={handleRegChange}
          handleRegistrationSubmit={handleRegistrationSubmit}
          submitStatus={regSubmitStatus}
          confirmedLead={confirmedLead}
          locale={locale}
          t={t}
        />
      );
    }

    // Default fallback to HomePage
    return (
      <HomePage
        brandConfig={BRAND_CONFIG}
        courses={COURSES}
        branches={BRANCHES}
        teachers={TEACHERS}
        departments={TEACHING_DEPARTMENTS}
        articles={ARTICLES}
        graduates={INITIAL_GRADUATES}
        faqItems={FAQ_ITEMS}
        navigate={navigate}
        courseFilter={courseFilter}
        setCourseFilter={setCourseFilter}
        visibleCourses={visibleCourses}
        customPhotos={customPhotos}
        playgroundTab={playgroundTab}
        setPlaygroundTab={setPlaygroundTab}
        selectedLetter={selectedLetter}
        setSelectedLetter={setSelectedLetter}
        audioPlaying={audioStatus === 'playing'}
        playArabicPronunciation={playArabicPronunciation}
        quizIndex={quizIndex}
        quizSelectedOption={quizSelectedOption}
        quizResult={quizResult}
        handleQuizOptionSelect={handleQuizOptionSelect}
        resetQuiz={resetQuiz}
        kidsGameNumber={kidsGameNumber}
        kidsGameScore={kidsGameScore}
        handleKidsGuess={handleKidsGuess}
        regForm={regForm}
        regErrors={regErrors}
        handleRegChange={handleRegChange}
        handleRegistrationSubmit={handleRegistrationSubmit}
        submitStatus={regSubmitStatus}
        apiDiagnostic={{
          backendStatus: apiStatus.connected ? 'online' : 'fallback',
          error: apiStatus.error
        }}
        t={t}
      />
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-[#F8FAF8] text-[#14231F] antialiased"
      style={{
        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
      }}
    >

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />

      {/* Main Sticky Header */}
      <Header
        route={route}
        navigate={navigate}
        t={t}
        courses={COURSES}
        branches={BRANCHES}
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        mobileNavOpen={mobileNavOpen}
        setMobileNavOpen={setMobileNavOpen}
      />

      {/* Accessible Breadcrumbs trail */}
      <Breadcrumbs breadcrumbs={breadcrumbs} navigate={navigate} />

      {/* Main Page Content */}
      <main className="flex-1">{renderCurrentPage()}</main>

      {/* Site Footer */}
      <Footer
        brandConfig={BRAND_CONFIG}
        t={t}
        courses={COURSES}
        branches={BRANCHES}
        navigate={navigate}
      />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        route={route}
        navigate={navigate}
        t={t}
        brandConfig={BRAND_CONFIG}
        courses={COURSES}
        branches={BRANCHES}
      />

      {/* Technical / Developer Integration Modal */}
      <AdminDevModal
        adminDrawerOpen={adminDrawerOpen}
        setAdminDrawerOpen={setAdminDrawerOpen}
        telegramBotConfig={telegramBotConfig}
        setTelegramBotConfig={setTelegramBotConfig}
        customPhotos={customPhotos}
        handleCustomPhotoUpload={handleCustomPhotoUpload}
      />
    </div>
  );
}
