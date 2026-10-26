export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
  message?: string;
}

export interface CourseOutcome {
  id?: string;
  text: string;
  sortOrder?: number;
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description?: string;
  categoryId?: string;
  category?: CourseCategory;
  targetAudience?: string;
  level: string;
  durationMonths?: number;
  priceAmount?: number | string;
  currency?: string;
  priceStatus?: string;
  ageMinimum?: number;
  ageMaximum?: number;
  entryRequirements?: string;
  methodology?: string;
  featured?: boolean;
  outcomes?: CourseOutcome[];
  branchCourses?: Array<{
    branch: Branch;
  }>;
}

export interface Branch {
  id: string;
  name: string;
  officialLabel?: string;
  slug: string;
  district?: string | null;
  area: string;
  address?: string | null;
  addressNote?: string | null;
  landmark?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  phone?: string | null;
  workingHours?: string;
  description?: string | null;
  coursesAvailable?: string[];
  branchCourses?: Array<{
    course: {
      id: string;
      title: string;
      slug: string;
      level?: string;
    };
  }>;
}

export interface Teacher {
  id: string;
  fullName: string;
  slug: string;
  department: string;
  badge?: string | null;
  qualification: string;
  focus: string;
  biography?: string | null;
  photo?: string | null;
  yearsOfExperience?: number;
  languages?: string[];
  displayOrder?: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
}

export interface ArticleItem {
  id?: string;
  arabicText: string;
  translit: string;
  translation: string;
  sortOrder?: number;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string | null;
  topic: string;
  readTime?: string;
  items?: ArticleItem[];
}

export interface SiteSettings {
  contact_info?: {
    phoneDisplay?: string;
    phoneE164?: string;
    supportEmail?: string;
    workingHours?: string;
    mainAddress?: string;
  };
  social_links?: {
    telegram?: string;
    telegramUrl?: string;
    telegramHandle?: string;
    instagram?: string;
    instagramUrl?: string;
    instagramHandle?: string;
    youtube?: string;
    facebook?: string;
  };
}

export interface CreateRegistrationPayload {
  fullName: string;
  phone: string;
  courseSlug: string;
  branchSlug: string;
  notes?: string;
  message?: string;
  preferredTime?: string;
  idempotencyKey?: string;
  source?: string;
  telegramUserId?: string;
  telegramUsername?: string;
  inquiryType?: string;
}

export interface RegistrationResult {
  referenceId: string;
  fullName: string;
  phoneFormatted: string;
  courseTitle: string;
  branchName: string;
  status: string;
  submittedAt?: string;
  message?: string;
}

export interface LeadAdminItem {
  id: string;
  referenceId: string;
  fullName: string;
  phone: string;
  phoneFormatted: string;
  courseId: string;
  branchId: string;
  status: string;
  source: string;
  notes?: string;
  createdAt: string;
  course?: { id: string; title: string; slug: string };
  branch?: { id: string; name: string; slug: string; area: string };
  assignedManager?: { id: string; fullName: string; email: string };
}
