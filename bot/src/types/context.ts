import { Context, SessionFlavor } from 'grammy';
import { ConversationFlavor, Conversation } from '@grammyjs/conversations';
import { HydrateFlavor } from '@grammyjs/hydrate';

export interface RegistrationDraft {
  courseSlug?: string;
  courseTitle?: string;
  branchSlug?: string;
  branchName?: string;
  fullName?: string;
  phone?: string;
  phoneFormatted?: string;
  preferredTime?: string;
  notes?: string;
  attributionSource?: string;
  step?: 'course' | 'branch' | 'name' | 'phone' | 'time' | 'confirm' | 'done';
  idempotencyKey?: string;
  startedAt?: number;
}

export type BotLanguage = 'uz' | 'ru' | 'en';

export interface SessionData {
  language: BotLanguage;
  hasSelectedLanguage?: boolean;
  registrationDraft?: RegistrationDraft;
  adminState?: {
    currentPage?: number;
    selectedLeadId?: string;
  };
}

export type MyContext = HydrateFlavor<Context> &
  SessionFlavor<SessionData> &
  ConversationFlavor<Context>;

export type MyConversation = Conversation<MyContext, MyContext>;
