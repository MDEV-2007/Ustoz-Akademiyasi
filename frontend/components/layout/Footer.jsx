'use client';

import React from 'react';
import { BookOpen, MapPin, Phone } from 'lucide-react';
import { OfficialBrandShield, Instagram, TelegramIcon, FacebookIcon } from '@/components/ui/BrandShield';

export default function Footer({
  brandConfig,
  t,
  courses = [],
  branches = [],
  navigate,
}) {
  return (
    <footer className="bg-[#14231F] text-white/80 pt-14 pb-10 border-t border-white/10 text-sm">
      <div className="max-w-[1360px] 2xl:max-w-[1600px] min-[1920px]:max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <OfficialBrandShield size={36} />
              <div className="leading-none">
                <div className="font-extrabold text-base text-white">USTOZ</div>
                <div className="font-bold text-xs text-[#63E6BE]">AKADEMIYASI</div>
              </div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              {brandConfig.sloganSecondary} • {brandConfig.sloganPrimary}.{' '}
              {t.footer?.addressText ||
                'Toshkent shahrida 8 ta filial va 15,000+ bitiruvchiga ega arab tili o‘quv markazi.'}
            </p>
            <div className="pt-2">
              <a
                href={brandConfig.phoneHref}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sm font-bold text-[#63E6BE] transition"
              >
                <Phone className="w-4 h-4" />
                <span>{brandConfig.phoneDisplay}</span>
              </a>
            </div>
          </div>

          {/* Col 2: Course Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {t.footer?.coursesCol || t.nav?.courses || 'Kurslar'}
            </div>
            <ul className="space-y-2 text-xs">
              {courses.map((c) => (
                <li key={c.slug}>
                  <button
                    onClick={() => navigate(`/kurslar/${c.slug}`)}
                    className="hover:text-[#63E6BE] transition cursor-pointer py-1 block w-full text-left"
                  >
                    {c.title}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => navigate('/interaktiv-arab-tili')}
                  className="text-[#63E6BE] font-semibold hover:underline cursor-pointer py-1 block w-full text-left flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#63E6BE]" />
                  <span>
                    {t.footer?.interactiveLink ||
                      t.nav?.interactive ||
                      'Interaktiv Arab tili mashqlari'}
                  </span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: 8 Branches */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {t.footer?.branchesCol || t.nav?.allBranches || 'Toshkentdagi 8 ta filial'}
            </div>
            <ul className="grid grid-cols-2 gap-2 text-xs">
              {branches.map((b) => (
                <li key={b.slug}>
                  <button
                    onClick={() => navigate(`/filiallar/${b.slug}`)}
                    className="hover:text-[#63E6BE] transition text-left cursor-pointer py-1 flex items-center gap-1.5 w-full group"
                  >
                    <MapPin className="w-3 h-3 text-[#07966F] group-hover:text-[#63E6BE] flex-shrink-0 transition-colors" />
                    <span className="truncate">{b.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Academy, Articles & Legal */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              {t.footer?.infoCol || 'Markaz va Ma’lumotlar'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/markaz-haqida')}
                  className="hover:text-[#63E6BE] cursor-pointer py-1 block w-full text-left"
                >
                  {t.footer?.aboutLink || t.nav?.aboutCenter || 'Markaz haqida'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/ustozlar')}
                  className="hover:text-[#63E6BE] cursor-pointer py-1 block w-full text-left"
                >
                  {t.footer?.teachersLink || t.nav?.teachers || 'Ustozlar jamoasi'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/natijalar')}
                  className="hover:text-[#63E6BE] cursor-pointer py-1 block w-full text-left"
                >
                  {t.footer?.resultsLink || t.nav?.results || 'Bitiruvchilar va Natijalar'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/maqolalar')}
                  className="hover:text-[#63E6BE] cursor-pointer py-1 block w-full text-left"
                >
                  {t.footer?.articlesLink || t.nav?.articles || 'Foydali maqolalar'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/savol-javob')}
                  className="hover:text-[#63E6BE] cursor-pointer py-1 block w-full text-left"
                >
                  {t.footer?.faqLink || t.nav?.faq || 'Savol-Javob (FAQ)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/aloqa')}
                  className="hover:text-[#63E6BE] cursor-pointer py-1 block w-full text-left"
                >
                  {t.footer?.contactLink || t.nav?.contact || 'Aloqa'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/maxfiylik-siyosati')}
                  className="hover:text-[#63E6BE] cursor-pointer py-1 block w-full text-left"
                >
                  {t.footer?.privacyPolicy || 'Maxfiylik siyosati'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 text-center sm:text-left">
          <div>
            © 2026 Ustoz Akademiyasi. {t.footer?.rights || 'Barcha huquqlar himoyalangan.'}
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 sm:gap-3 w-full sm:w-auto">
            <a
              href={brandConfig.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition group shadow-xs text-[11px] sm:text-xs"
            >
              <Instagram className="w-3.5 h-3.5 text-[#E1306C] group-hover:scale-110 transition-transform" />
              <span>Instagram ({brandConfig.instagramFollowers})</span>
            </a>
            <a
              href={brandConfig.telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition group shadow-xs text-[11px] sm:text-xs"
            >
              <TelegramIcon className="w-3.5 h-3.5 text-[#2AABEE] group-hover:scale-110 transition-transform" />
              <span>Telegram ({brandConfig.telegramHandle})</span>
            </a>
            <a
              href={brandConfig.facebookUrl || 'https://www.facebook.com/hiloltalimuz/'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition group shadow-xs text-[11px] sm:text-xs"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2] fill-[#1877F2] group-hover:scale-110 transition-transform" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
