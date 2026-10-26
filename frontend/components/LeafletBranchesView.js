'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Navigation, ArrowRight, Search, CheckCircle2, MapPin, ExternalLink, Calendar, Image as ImageIcon } from 'lucide-react';
import ImageLightbox from './ui/ImageLightbox';
import 'leaflet/dist/leaflet.css';

// Verified Tashkent coordinates for all 8 branches
export const BRANCHES_COORDINATES = {
  archakocha: {
    lat: 41.3195,
    lng: 69.2155,
    district: {
      uz: 'Shayxontohur tumani',
      ru: 'Шайхантахурский район',
      en: 'Shaykhontohur District'
    },
    addressFull: {
      uz: 'Archa ko‘cha, Kichik halqa yo‘li 66 (Mo‘ljal: Shofayz ko‘prigi yaqinida)',
      ru: 'ул. Арчакуча, МКАД 66 (Ориентир: возле моста Шофайз)',
      en: 'Archakocha, Small Ring Road 66 (Landmark: near Shofayz bridge)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  'yangi-toshmi': {
    lat: 41.3530,
    lng: 69.2080,
    district: {
      uz: 'Olmazor tumani',
      ru: 'Алмазарский район',
      en: 'Almazar District'
    },
    addressFull: {
      uz: 'Farovon ko‘chasi, 1 (Mo‘ljal: Makro chorrahasi)',
      ru: 'ул. Фаровон, 1 (Ориентир: перекресток Макро)',
      en: 'Farovon St, 1 (Landmark: Makro crossroads)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  qoraqamish: {
    lat: 41.3650,
    lng: 69.2220,
    district: {
      uz: 'Olmazor tumani',
      ru: 'Алмазарский район',
      en: 'Almazar District'
    },
    addressFull: {
      uz: 'Qoraqamish 2/1 (Mo‘ljal: “Zeb-ziynat” to‘yxonasi yonida)',
      ru: 'Каракамыш 2/1 (Ориентир: возле ресторана «Зеб-зийнат»)',
      en: 'Qoraqamish 2/1 (Landmark: next to Zeb-Ziynat wedding hall)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  algoritm: {
    lat: 41.2640,
    lng: 69.1620,
    district: {
      uz: 'Uchtepa tumani',
      ru: 'Учтепинский район',
      en: 'Uchtepa District'
    },
    addressFull: {
      uz: 'Sugalli ota ko‘chasi, 56/1-uy (Mo‘ljal: “Zarhal” to‘yxonasi ro‘parasida)',
      ru: 'ул. Сугалли ота, 56/1 (Ориентир: напротив свадебного зала «Зархал»)',
      en: 'Sugalli ota St, 56/1 (Landmark: opposite Zarhal wedding hall)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  yunusobod: {
    lat: 41.3685,
    lng: 69.2885,
    district: {
      uz: 'Yunusobod tumani',
      ru: 'Юнусабадский район',
      en: 'Yunusobod District'
    },
    addressFull: {
      uz: 'Yunusobod 18-kvartal, 48B (Mo‘ljal: Havas do‘koni 2-qavat)',
      ru: 'Юнусабад 18-й квартал, 48Б (Ориентир: магазин Havas, 2-й этаж)',
      en: 'Yunusobod 18th block, 48B (Landmark: Havas store, 2nd floor)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  sergeli: {
    lat: 41.2260,
    lng: 69.2210,
    district: {
      uz: 'Sergeli tumani',
      ru: 'Сергелийский район',
      en: 'Sergeli District'
    },
    addressFull: {
      uz: 'Sergeli-VII dahasi, 29B (Mo‘ljal: 3-metro Sergili bekati)',
      ru: 'массив Сергели-VII, 29Б (Ориентир: 3-я станция метро Сергели)',
      en: 'Sergeli-VII, 29B (Landmark: Metro Station 3 Sergeli)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  tinchlik: {
    lat: 41.3285,
    lng: 69.2140,
    district: {
      uz: 'Shayxontohur / Olmazor',
      ru: 'Шайхантахурский / Алмазарский район',
      en: 'Shaykhontohur / Almazar District'
    },
    addressFull: {
      uz: 'Chig‘atoy darvoza 2A (Mo‘ljal: Olmazor yong‘in xavfsizligi bo‘limi, Tinchlik metrosi)',
      ru: 'Чигатой дарвоза 2А (Ориентир: Алмазарский отдел пожарной безопасности, станция метро Тинчлик)',
      en: 'Chigatoy darvoza 2A (Landmark: Almazar fire safety dept, Tinchlik metro)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  kattaqani: {
    lat: 41.2815,
    lng: 69.1765,
    district: {
      uz: 'Uchtepa tumani',
      ru: 'Учтепинский район',
      en: 'Uchtepa District'
    },
    addressFull: {
      uz: 'Qurilish 3-tor ko‘chasi, 3A (Mo‘ljal: “Doka xleb” ro‘parasi)',
      ru: 'ул. Курилиш 3-й проезд, 3А (Ориентир: напротив «Дока хлеб»)',
      en: 'Qurilish 3rd lane, 3A (Landmark: opposite Doka bread)'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
  beruniy: {
    lat: 41.3440,
    lng: 69.2050,
    district: {
      uz: 'Olmazor tumani',
      ru: 'Алмазарский район',
      en: 'Almazar District'
    },
    addressFull: {
      uz: 'Toshkent sh., Olmazor tumani, Talabalar shaharchasi, Beruniy metrosi',
      ru: 'г. Ташкент, Алмазарский район, Студенческий городок, станция метро Беруни',
      en: 'Tashkent, Almazar District, Students Campus, Beruniy metro'
    },
    hours: {
      uz: 'Har kuni: 09:00 — 20:00',
      ru: 'Ежедневно: 09:00 — 20:00',
      en: 'Daily: 09:00 — 20:00'
    }
  },
};

export default function LeafletBranchesView({
  branches = [],
  initialBranchSlug = null,
  onEnroll = () => {},
  phoneDisplay = '+998 (55) 518-44-00',
  phoneHref = 'tel:+998555184400',
  locale = 'uz',
}) {
  const [selectedSlug, setSelectedSlug] = useState(
    initialBranchSlug && BRANCHES_COORDINATES[initialBranchSlug]
      ? initialBranchSlug
      : branches[0]?.slug || 'archakocha'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [lightboxImage, setLightboxImage] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Merge branch data with precise geo coordinates preserving localization
  const enrichedBranches = branches.map((b) => {
    const geo = BRANCHES_COORDINATES[b.slug] || {
      lat: 41.311082,
      lng: 69.240562,
      district: { uz: 'Toshkent shahri', ru: 'г. Ташкент', en: 'Tashkent City' },
      addressFull: { uz: 'Toshkent shahri', ru: 'г. Ташкент', en: 'Tashkent City' },
      hours: { uz: 'Har kuni: 09:00 — 20:00', ru: 'Ежедневно: 09:00 — 20:00', en: 'Daily: 09:00 — 20:00' }
    };
    const defaultDistrict = geo.district?.[locale] || geo.district?.uz || geo.district;
    const defaultAddress = geo.addressFull?.[locale] || geo.addressFull?.uz || geo.addressFull;
    const defaultHours = geo.hours?.[locale] || geo.hours?.uz || geo.hours;

    return {
      ...b,
      lat: geo.lat,
      lng: geo.lng,
      district: b.area || defaultDistrict,
      addressFull: b.addressNote || b.address || defaultAddress,
      hours: b.hours || b.workingHours || defaultHours,
    };
  });

  const selectedBranch =
    enrichedBranches.find((b) => b.slug === selectedSlug) || enrichedBranches[0];

  const filteredBranches = enrichedBranches.filter((b) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.name.toLowerCase().includes(q) ||
      b.district.toLowerCase().includes(q) ||
      b.addressFull.toLowerCase().includes(q)
    );
  });

  // Initialize Leaflet Map safely in client
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (!mapContainerRef.current) return;
      if (mapInstanceRef.current) return; // already initialized

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      const initialLat = selectedBranch?.lat || 41.311082;
      const initialLng = selectedBranch?.lng || 69.240562;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 12,
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // OpenStreetMap standard tiles — completely free, no API key required, full Tashkent coverage
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers for each branch
      enrichedBranches.forEach((b) => {
        const isCurrent = b.slug === selectedSlug;
        const iconHtml = createMarkerHtml(isCurrent);

        const customIcon = L.divIcon({
          className: 'leaflet-custom-branch-marker',
          html: iconHtml,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const marker = L.marker([b.lat, b.lng], { icon: customIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedSlug(b.slug);
        });

        markersRef.current[b.slug] = marker;
      });
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update marker styles and pan when selectedSlug changes
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedBranch) return;

    import('leaflet').then(({ default: L }) => {
      // Smoothly pan map to selected branch
      mapInstanceRef.current.flyTo([selectedBranch.lat, selectedBranch.lng], 14, {
        duration: 0.8,
      });

      // Update marker icons to reflect active state
      enrichedBranches.forEach((b) => {
        const marker = markersRef.current[b.slug];
        if (marker) {
          const isCurrent = b.slug === selectedSlug;
          const iconHtml = createMarkerHtml(isCurrent);
          marker.setIcon(
            L.divIcon({
              className: 'leaflet-custom-branch-marker',
              html: iconHtml,
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            })
          );
        }
      });
    });
  }, [selectedSlug]);

  const createMarkerHtml = (isActive) => {
    if (isActive) {
      return `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background-color: rgba(7, 150, 111, 0.25); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width: 32px; height: 32px; border-radius: 9999px; background-color: #073F31; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(7, 63, 49, 0.35); display: flex; align-items: center; justify-content: center;">
            <div style="width: 10px; height: 10px; border-radius: 9999px; background-color: #63E6BE;"></div>
          </div>
        </div>
      `;
    }
    return `
      <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
        <div style="width: 24px; height: 24px; border-radius: 9999px; background-color: #073F31; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; border-radius: 9999px; background-color: #ffffff;"></div>
        </div>
      </div>
    `;
  };

  const getRouteUrl = (branch) => {
    return `https://yandex.com/maps/?rtext=~${branch.lat},${branch.lng}&rtt=auto`;
  };

  const labels = {
    uz: {
      addressLabel: 'Manzil',
      hoursLabel: 'Ish tartibi',
      phoneLabel: 'Telefon',
      routeBtn: 'Marshrut tuzish',
      callBtn: 'Qo‘ng‘iroq qilish',
      enrollBtn: 'Sinov darsiga yozilish',
      statusOpen: 'Ochiq',
      searchPlaceholder: 'Filial yoki tuman bo‘yicha qidiring...',
    },
    ru: {
      addressLabel: 'Адрес',
      hoursLabel: 'График работы',
      phoneLabel: 'Телефон',
      routeBtn: 'Построить маршрут',
      callBtn: 'Позвонить в филиал',
      enrollBtn: 'Записаться на урок',
      statusOpen: 'Открыто',
      searchPlaceholder: 'Поиск по названию или району...',
    },
    en: {
      addressLabel: 'Address',
      hoursLabel: 'Working Hours',
      phoneLabel: 'Phone',
      routeBtn: 'Get Directions',
      callBtn: 'Call Branch',
      enrollBtn: 'Free Trial Lesson',
      statusOpen: 'Open',
      searchPlaceholder: 'Search branch or district...',
    },
  }[locale] || labels.uz;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* LEFT COLUMN: Scrollable Cards List (Matching exact screenshot structure) */}
      <div className="lg:col-span-5 space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#65756F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            placeholder={labels.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#073F31]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#07966F] focus:border-transparent transition"
          />
        </div>

        {/* Branches list */}
        <div className="space-y-3.5 max-h-[640px] overflow-y-auto pr-1 no-scrollbar">
          {filteredBranches.map((b) => {
            const isSelected = b.slug === selectedSlug;
            return (
              <div
                key={b.slug}
                onClick={() => setSelectedSlug(b.slug)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F8FAF8] border-[#07966F] shadow-sm ring-1 ring-[#07966F]/25'
                    : 'bg-white border-[#073F31]/15 hover:border-[#07966F]/50 hover:bg-[#F8FAF8]/50'
                }`}
              >
                {/* Header with Name & Status Indicator */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <h3 className="text-base font-bold text-[#14231F] leading-snug">
                    Ustoz Akademiyasi — {b.name.replace(/ filiali/i, '')}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-shrink-0 pt-0.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#07966F] animate-pulse" />
                  </div>
                </div>

                {/* Geolocation poster button if available */}
                {b.image && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxImage({ src: b.image, title: `Ustoz Akademiyasi — ${b.name.replace(/ filiali/i, '')}` });
                    }}
                    className="mb-3 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#E8ECE9]/80 hover:bg-[#07966F]/15 text-[#073F31] hover:text-[#07966F] text-xs font-semibold border border-[#073F31]/10 transition cursor-pointer w-full justify-center"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-[#07966F]" />
                    <span>Geopozitsiya posteri (foto)</span>
                  </button>
                )}

                {/* Address */}
                <div className="space-y-0.5 mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#65756F]">
                    {labels.addressLabel}
                  </span>
                  <p className="text-xs text-[#14231F] font-medium leading-relaxed">
                    {b.addressFull}
                  </p>
                </div>

                {/* Working Hours */}
                <div className="space-y-0.5 mb-2.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#65756F]">
                    {labels.hoursLabel}
                  </span>
                  <p className="text-xs text-[#14231F] font-medium">
                    {b.hours}
                  </p>
                </div>

                {/* Phone */}
                <div className="space-y-0.5 mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#65756F]">
                    {labels.phoneLabel}
                  </span>
                  <p className="text-xs text-[#07966F] font-bold">
                    {phoneDisplay}
                  </p>
                </div>

                {/* Bottom Action Links */}
                <div className="pt-3 border-t border-[#073F31]/10 flex items-center justify-between gap-3 text-xs">
                  <a
                    href={getRouteUrl(b)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-[#073F31] hover:text-[#07966F] flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>{labels.routeBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href={phoneHref}
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#65756F] hover:text-[#073F31] font-semibold text-xs"
                    >
                      {labels.callBtn}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Leaflet Map Container with Non-intrusive Floating Card */}
      <div className="lg:col-span-7 sticky top-24">
        <div className="relative rounded-3xl overflow-hidden border border-[#073F31]/15 shadow-xl h-[560px] sm:h-[600px] lg:h-[640px] bg-[#E8ECE9]">
          {/* Leaflet DOM container */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Branch Card (Bottom Left of the Map, compact & doesn't block map pins) */}
          {selectedBranch && (
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-4 border border-[#073F31]/15 shadow-2xl z-[1000] animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* District & Status */}
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#65756F]">
                  {selectedBranch.district}
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#07966F]" />
              </div>

              {/* Title */}
              <h4 className="text-sm font-bold text-[#14231F] mb-1">
                Ustoz Akademiyasi — {selectedBranch.name.replace(/ filiali/i, '')}
              </h4>

              {/* Address */}
              <p className="text-xs text-[#65756F] leading-snug mb-2 line-clamp-2">
                {selectedBranch.addressFull}
              </p>

              {/* Hours */}
              <div className="text-xs text-[#14231F] mb-2">
                <span className="text-[#65756F]">{labels.hoursLabel}: </span>
                <span className="font-semibold">{selectedBranch.hours}</span>
              </div>

              {/* Geopozitsiya posteri link if available */}
              {selectedBranch.image && (
                <button
                  type="button"
                  onClick={() => setLightboxImage({ src: selectedBranch.image, title: `Ustoz Akademiyasi — ${selectedBranch.name.replace(/ filiali/i, '')}` })}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#07966F] hover:text-[#073F31] hover:underline mb-3 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Geopozitsiya posterini ko‘rish (foto)</span>
                </button>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-[#073F31]/10">
                <a
                  href={getRouteUrl(selectedBranch)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-[#073F31] hover:bg-[#07966F] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{labels.routeBtn}</span>
                </a>

                <a
                  href={phoneHref}
                  className="w-9 h-9 rounded-xl border border-[#073F31]/20 bg-white hover:bg-[#F8FAF8] text-[#073F31] flex items-center justify-center transition cursor-pointer flex-shrink-0"
                  title={labels.callBtn}
                  aria-label={labels.callBtn}
                >
                  <Phone className="w-3.5 h-3.5 text-[#073F31]" />
                </a>

                <button
                  type="button"
                  onClick={() => onEnroll(selectedBranch.slug)}
                  className="py-2 px-3 rounded-xl bg-[#63E6BE] hover:bg-[#63E6BE]/90 text-[#14231F] font-bold text-xs flex items-center justify-center transition cursor-pointer"
                >
                  <span>{labels.enrollBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full Branch Geolocation Poster */}
      <ImageLightbox
        isOpen={Boolean(lightboxImage)}
        onClose={() => setLightboxImage(null)}
        items={lightboxImage ? [lightboxImage] : []}
      />
    </div>
  );
}
