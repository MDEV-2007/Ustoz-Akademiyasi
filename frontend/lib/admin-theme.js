/**
 * Ustoz Akademiyasi — Elite Enterprise Admin Design System Tokens
 * Unified tokens for Linear & Stripe-level UI consistency across all admin routes.
 */

const STYLES = {
  // Layout & Containers
  pageContainer: 'space-y-6 max-w-7xl mx-auto pb-16 min-w-0 w-full',
  pageHeader: 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E4E7EC] pb-5 min-w-0',
  pageTitle: 'text-2xl font-bold text-[#17212F] tracking-tight flex items-center gap-3 min-w-0 truncate',
  pageSubtitle: 'text-sm text-[#667085] mt-1',
  card: 'bg-white border border-[#E4E7EC] rounded-2xl shadow-xs overflow-hidden min-w-0',
  cardPadded: 'bg-white border border-[#E4E7EC] rounded-2xl shadow-xs p-5 sm:p-6 min-w-0',

  // Buttons
  btnPrimary: 'inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#086641] hover:bg-[#064E3B] active:bg-[#053D2E] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0',
  btnSecondary: 'inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-[#D0D5DD] hover:bg-[#F9FAFB] active:bg-[#F2F4F7] text-[#344054] rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex-shrink-0',
  btnDanger: 'inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs disabled:opacity-50 cursor-pointer flex-shrink-0',
  btnGhost: 'inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[#667085] hover:text-[#17212F] hover:bg-[#F2F4F7] rounded-lg text-xs font-semibold transition-colors cursor-pointer',

  // Inputs & Forms
  input: 'w-full h-10 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-xs text-[#17212F] placeholder-[#98A2B3] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all',
  select: 'w-full h-10 px-3.5 bg-white border border-[#D0D5DD] rounded-xl text-xs text-[#17212F] focus:outline-none focus:ring-2 focus:ring-[#086641]/20 focus:border-[#086641] transition-all cursor-pointer font-medium',
  label: 'block text-[11px] font-bold text-[#344054] uppercase tracking-wider mb-1.5',

  // Table elements - STRICT alignment, no wrapping on meta, tabular numerals
  table: 'w-full text-left text-xs text-[#344054] border-collapse',
  tableHead: 'bg-[#F8FAFC] border-b border-[#E4E7EC] text-[11px] font-bold text-[#667085] uppercase tracking-wider select-none',
  th: 'py-3.5 px-4 font-bold text-[#475467] whitespace-nowrap',
  tr: 'border-b border-[#E4E7EC] hover:bg-[#F8FAFC] transition-colors',
  td: 'py-3.5 px-4 font-medium text-[#17212F] align-middle',

  // Metric Cards
  metricCard: 'bg-white border border-[#E4E7EC] rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-[#D0D5DD] transition-all min-w-0',
  metricValue: 'text-2xl sm:text-3xl font-black text-[#17212F] tracking-tight mt-3 font-mono',
  metricLabel: 'text-xs font-bold uppercase tracking-wider text-[#667085]',
  metricMeta: 'text-[11px] text-[#667085] mt-1 font-medium',
};

export const ADMIN_THEME = {
  colors: {
    primary: '#086641',
    primaryHover: '#064E3B',
    primaryLight: '#E8F5E9',
    darkInk: '#101828',
    background: '#F6F8FA',
    surface: '#FFFFFF',
    textPrimary: '#17212F',
    textSecondary: '#667085',
    textMuted: '#98A2B3',
    border: '#E4E7EC',
    borderLight: '#F2F4F7',
    gold: '#D4AF65',
  },

  // Spread all style classes directly on ADMIN_THEME so both ADMIN_THEME.card and ADMIN_THEME.styles.card work!
  ...STYLES,
  styles: STYLES,

  // Semantic Status Badges
  statusBadges: {
    NEW: 'bg-blue-50 text-blue-700 border border-blue-200/80',
    CONTACTED: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    SCHEDULED: 'bg-purple-50 text-purple-700 border border-purple-200/80',
    ATTENDED: 'bg-teal-50 text-teal-700 border border-teal-200/80',
    CONVERTED: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    CANCELLED: 'bg-rose-50 text-rose-700 border border-rose-200/80',
    SPAM: 'bg-slate-100 text-slate-700 border border-slate-200/80',
    ACTIVE: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    INACTIVE: 'bg-slate-100 text-slate-600 border border-slate-200/80',
    PUBLISHED: 'bg-emerald-50 text-emerald-800 border border-emerald-300',
    DRAFT: 'bg-amber-50 text-amber-700 border border-amber-200/80',
    ARCHIVED: 'bg-slate-100 text-slate-600 border border-slate-200/80',
  },
};

export default ADMIN_THEME;
