import { InlineKeyboard } from 'grammy';
import { MyConversation, MyContext, RegistrationDraft } from '../types/context';
import { apiClient, ApiError } from '../services/api-client.service';
import { validateAndNormalizeUzbekPhone } from '../services/phone-validator';
import {
  getRegistrationCourseKeyboard,
  getRegistrationBranchKeyboard,
  getPhoneRequestKeyboard,
  getPreferredTimeKeyboard,
  getRegistrationConfirmKeyboard,
  getCancelKeyboard,
} from '../keyboards/registration.keyboard';
import { getMainMenuReplyKeyboard } from '../keyboards/main-menu.keyboard';
import { BOT_STRINGS } from '../config/constants';
import { Course, Branch } from '../types/api.types';
import { escapeHtml } from '../utils/formatters';

const MAIN_MENU_BUTTON_VALUES = [
  BOT_STRINGS.MENU_COURSES,
  BOT_STRINGS.MENU_REGISTER,
  BOT_STRINGS.MENU_BRANCHES,
  BOT_STRINGS.MENU_TEACHERS,
  BOT_STRINGS.MENU_FAQ,
  BOT_STRINGS.MENU_CONTACT,
  BOT_STRINGS.MENU_LEARNING,
  '📚 Курсы',
  '📚 Courses',
  '📝 Запись на пробный урок',
  '📝 Sign up for trial',
  '📍 Филиалы',
  '📍 Branches',
  '👨‍🏫 Преподаватели',
  '👨‍🏫 Teachers',
  '❓ Вопросы и ответы',
  '❓ FAQ',
  '📞 Контакты',
  '📞 Contact',
  '📖 Изучение арабского',
  '📖 Learn Arabic',
  '🌐 Tilni tanlash',
  '🌐 Сменить язык',
  '🌐 Change language',
];

function isCancelOrMenuCommand(text?: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return (
    trimmed === BOT_STRINGS.BTN_CANCEL ||
    trimmed === '❌ Отмена' ||
    trimmed === '❌ Cancel' ||
    trimmed === '/cancel' ||
    trimmed === '/start' ||
    trimmed.startsWith('/lang') ||
    MAIN_MENU_BUTTON_VALUES.includes(trimmed as any)
  );
}

export async function registrationConversation(
  conversation: MyConversation,
  ctx: MyContext,
) {
  const userId = ctx.from?.id;
  const username = ctx.from?.username;

  // Initialize draft from existing session if resuming or preselected
  const session = await conversation.external((c) => c.session);
  const draft: RegistrationDraft = {
    ...(session.registrationDraft || {}),
    attributionSource: session.registrationDraft?.attributionSource || 'TELEGRAM_BOT',
    idempotencyKey: session.registrationDraft?.idempotencyKey || `tg_${userId}_${Date.now()}`,
    startedAt: session.registrationDraft?.startedAt || Date.now(),
  };

  // 1. Fetch available courses and branches from API
  let courses: Course[] = [];
  let branches: Branch[] = [];

  try {
    const [fetchedCourses, fetchedBranches] = await conversation.external(async () => {
      return Promise.all([
        apiClient.getCourses({ limit: 50 }),
        apiClient.getBranches(),
      ]);
    });
    courses = fetchedCourses;
    branches = fetchedBranches;
  } catch (err: any) {
    console.error('[Registration Conversation Error]', err);
    await ctx.reply(
      "❌ Kurslar ma’lumotlarini yuklashda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko‘ring.",
      { reply_markup: getMainMenuReplyKeyboard(), parse_mode: 'HTML' },
    );
    return;
  }

  if (courses.length === 0 || branches.length === 0) {
    await ctx.reply(
      "⚠️ Ayni paytda faol kurslar yoki filiallar mavjud emas. Tez orada yangilanadi.",
      { reply_markup: getMainMenuReplyKeyboard(), parse_mode: 'HTML' },
    );
    return;
  }

  // 2. Greeting & Brief Explanation with cancel keyboard
  await ctx.reply(
    `📝 <b>Sinov Darsiga Yozilish</b>\n\n` +
      `Ustoz Akademiyasida arab tili darslarimiz bilan tanishish uchun quyidagi bosqichlarni bajaring.\n\n` +
      BOT_STRINGS.PRIVACY_NOTICE,
    { reply_markup: getCancelKeyboard(), parse_mode: 'HTML' },
  );

  let editingStep: string | null = null;

  while (true) {
    // -------------------------------------------------------------
    // STEP A: Select Course (if not selected)
    // -------------------------------------------------------------
    if (!draft.courseSlug || editingStep === 'course') {
      await ctx.reply("📚 <b>1-qadam:</b> O‘zingizga qiziq bo‘lgan o‘quv kursini tanlang:", {
        reply_markup: getRegistrationCourseKeyboard(courses),
        parse_mode: 'HTML',
      });

      let picked = false;
      while (!picked) {
        const updateCtx = await conversation.wait();

        // Inline button clicks
        if (updateCtx.callbackQuery) {
          const data = updateCtx.callbackQuery.data || '';
          if (data === 'reg_action:cancel') {
            await updateCtx.answerCallbackQuery();
            await updateCtx.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          const match = data.match(/^reg_sel_course:(.+)$/);
          if (match) {
            draft.courseSlug = match[1];
            const selected = courses.find((c) => c.slug === draft.courseSlug || c.id === draft.courseSlug);
            draft.courseTitle = selected?.title || draft.courseSlug;
            await updateCtx.answerCallbackQuery({ text: `Tanlandi: ${draft.courseTitle}` });
            picked = true;
            break;
          }

          await updateCtx.answerCallbackQuery();
          continue;
        }

        // Text or menu input
        if (updateCtx.message?.text) {
          const text = updateCtx.message.text.trim();
          if (isCancelOrMenuCommand(text)) {
            await updateCtx.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          await updateCtx.reply(
            "👆 Iltimos, yuqoridagi kurslardan birini bosing yoki «❌ Bekor qilish» tugmasidan foydalaning:",
            { reply_markup: getCancelKeyboard(), parse_mode: 'HTML' },
          );
          continue;
        }
      }

      if (editingStep === 'course') {
        editingStep = null;
        continue;
      }
    }

    // -------------------------------------------------------------
    // STEP B: Select Branch (valid for the chosen course)
    // -------------------------------------------------------------
    if (!draft.branchSlug || editingStep === 'branch') {
      let availableBranches = branches;
      try {
        const fullCourse = await conversation.external(() =>
          apiClient.getCourseBySlug(draft.courseSlug!),
        );
        if (fullCourse.branchCourses && fullCourse.branchCourses.length > 0) {
          const validBranchIds = new Set(fullCourse.branchCourses.map((bc) => bc.branch.id));
          const filtered = branches.filter((b) => validBranchIds.has(b.id));
          if (filtered.length > 0) {
            availableBranches = filtered;
          }
        }
      } catch {
        // Fall back to all active branches
      }

      await ctx.reply(
        `📍 <b>2-qadam:</b> «${escapeHtml(draft.courseTitle || '')}» kursi uchun o‘zingizga qulay filialni tanlang:`,
        { reply_markup: getRegistrationBranchKeyboard(availableBranches), parse_mode: 'HTML' },
      );

      let pickedBranch = false;
      while (!pickedBranch) {
        const branchUpdate = await conversation.wait();

        if (branchUpdate.callbackQuery) {
          const data = branchUpdate.callbackQuery.data || '';
          if (data === 'reg_action:cancel') {
            await branchUpdate.answerCallbackQuery();
            await branchUpdate.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          if (data === 'reg_action:change_course') {
            await branchUpdate.answerCallbackQuery();
            draft.courseSlug = undefined;
            draft.courseTitle = undefined;
            break;
          }

          const match = data.match(/^reg_sel_branch:(.+)$/);
          if (match) {
            draft.branchSlug = match[1];
            const selected = branches.find((b) => b.slug === draft.branchSlug || b.id === draft.branchSlug);
            draft.branchName = selected ? `${selected.name} (${selected.area})` : draft.branchSlug;
            await branchUpdate.answerCallbackQuery({ text: `Tanlandi: ${draft.branchName}` });
            pickedBranch = true;
            break;
          }

          await branchUpdate.answerCallbackQuery();
          continue;
        }

        if (branchUpdate.message?.text) {
          const text = branchUpdate.message.text.trim();
          if (isCancelOrMenuCommand(text)) {
            await branchUpdate.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          await branchUpdate.reply(
            "👆 Iltimos, filialni yuqoridagi tugmalardan birini bosib tanlang yoki «❌ Bekor qilish» tugmasidan foydalaning:",
            { reply_markup: getCancelKeyboard(), parse_mode: 'HTML' },
          );
          continue;
        }
      }

      if (!draft.courseSlug) {
        continue;
      }

      if (editingStep === 'branch') {
        editingStep = null;
        continue;
      }
    }

    // -------------------------------------------------------------
    // STEP C: Student's Full Name
    // -------------------------------------------------------------
    if (!draft.fullName || editingStep === 'name') {
      await ctx.reply(
        `👤 <b>3-qadam:</b> O‘quvchining (yoki ota-onaning) ism va familiyasini kiriting:\n\n` +
          `<i>(Masalan: Abdulloh Karimov)</i>`,
        { reply_markup: getCancelKeyboard(), parse_mode: 'HTML' },
      );

      while (true) {
        const updateCtx = await conversation.wait();

        if (updateCtx.callbackQuery) {
          if (updateCtx.callbackQuery.data === 'reg_action:cancel') {
            await updateCtx.answerCallbackQuery();
            await updateCtx.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }
          await updateCtx.answerCallbackQuery();
          continue;
        }

        if (updateCtx.message?.text) {
          const text = updateCtx.message.text.trim();

          if (isCancelOrMenuCommand(text)) {
            await updateCtx.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          if (text.length < 3) {
            await updateCtx.reply(
              "⚠️ Ism juda qisqa. Iltimos, to‘liq ism va familiyangizni kiriting (kamida 3 ta harf):",
              { reply_markup: getCancelKeyboard(), parse_mode: 'HTML' },
            );
            continue;
          }

          draft.fullName = text;
          break;
        }
      }

      if (editingStep === 'name') {
        editingStep = null;
        continue;
      }
    }

    // -------------------------------------------------------------
    // STEP D: Contact Phone Number
    // -------------------------------------------------------------
    if (!draft.phone || editingStep === 'phone') {
      await ctx.reply(
        `📱 <b>4-qadam:</b> Siz bilan bog‘lanishimiz uchun telefon raqamingizni yuboring.\n\n` +
          `Pastdagi «📱 Telefon raqamimni yuborish» tugmasini bosing yoki raqamingizni yozing (masalan, 90 123 45 67):`,
        { reply_markup: getPhoneRequestKeyboard(), parse_mode: 'HTML' },
      );

      while (true) {
        const updateCtx = await conversation.wait();

        if (updateCtx.callbackQuery) {
          if (updateCtx.callbackQuery.data === 'reg_action:cancel') {
            await updateCtx.answerCallbackQuery();
            await updateCtx.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }
          await updateCtx.answerCallbackQuery();
          continue;
        }

        if (updateCtx.message?.contact || updateCtx.message?.text) {
          const text = updateCtx.message.text?.trim();

          if (text && isCancelOrMenuCommand(text)) {
            await updateCtx.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          let rawPhone = '';
          if (updateCtx.message.contact) {
            rawPhone = updateCtx.message.contact.phone_number;
          } else if (text) {
            rawPhone = text;
          }

          const validation = validateAndNormalizeUzbekPhone(rawPhone);
          if (!validation.isValid) {
            await updateCtx.reply(
              `⚠️ ${validation.errorMessage}\n\nIltimos, O‘zbekiston telefon raqamini to‘g‘ri formatda kiriting:`,
              { reply_markup: getPhoneRequestKeyboard(), parse_mode: 'HTML' },
            );
            continue;
          }

          draft.phone = validation.e164;
          draft.phoneFormatted = validation.formatted;
          break;
        }
      }

      if (editingStep === 'phone') {
        editingStep = null;
        continue;
      }
    }

    // -------------------------------------------------------------
    // STEP E: Preferred Time (Schedule Preference)
    // -------------------------------------------------------------
    if (!draft.preferredTime || editingStep === 'time') {
      await ctx.reply(
        `🕒 <b>5-qadam:</b> Sizga darslar uchun qaysi vaqt qulayroq?`,
        { reply_markup: getPreferredTimeKeyboard(), parse_mode: 'HTML' },
      );

      let pickedTime = false;
      while (!pickedTime) {
        const timeUpdate = await conversation.wait();

        if (timeUpdate.callbackQuery) {
          const data = timeUpdate.callbackQuery.data || '';
          if (data === 'reg_action:cancel') {
            await timeUpdate.answerCallbackQuery();
            await timeUpdate.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          if (data === 'reg_action:back') {
            await timeUpdate.answerCallbackQuery();
            draft.phone = undefined;
            draft.phoneFormatted = undefined;
            break;
          }

          const match = data.match(/^reg_time:(.+)$/);
          if (match) {
            draft.preferredTime = match[1];
            await timeUpdate.answerCallbackQuery();
            pickedTime = true;
            break;
          }

          await timeUpdate.answerCallbackQuery();
          continue;
        }

        if (timeUpdate.message?.text) {
          const text = timeUpdate.message.text.trim();
          if (isCancelOrMenuCommand(text)) {
            await timeUpdate.reply("❌ Ro‘yxatdan o‘tish bekor qilindi.", {
              reply_markup: getMainMenuReplyKeyboard(),
              parse_mode: 'HTML',
            });
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });
            return;
          }

          await timeUpdate.reply(
            "👆 Iltimos, o‘zingizga mos dars vaqtini yuqoridagi tugmalardan birini tanlang:",
            { reply_markup: getCancelKeyboard(), parse_mode: 'HTML' },
          );
          continue;
        }
      }

      if (!draft.phone) {
        continue;
      }

      if (editingStep === 'time') {
        editingStep = null;
        continue;
      }
    }

    // -------------------------------------------------------------
    // STEP F: Review & Explicit Confirmation
    // -------------------------------------------------------------
    const maskedPhone = draft.phone ? validateAndNormalizeUzbekPhone(draft.phone).masked : '';

    const summaryText =
      `📋 <b>Arizangizni tekshiring</b>\n\n` +
      `👤 <b>Ism:</b> ${escapeHtml(draft.fullName || '')}\n` +
      `📚 <b>Kurs:</b> ${escapeHtml(draft.courseTitle || '')}\n` +
      `📍 <b>Filial:</b> ${escapeHtml(draft.branchName || '')}\n` +
      `📞 <b>Telefon:</b> <code>${escapeHtml(draft.phoneFormatted || maskedPhone)}</code>\n` +
      `🕒 <b>Qulay vaqt:</b> ${escapeHtml(draft.preferredTime || 'Operator bilan kelishiladi')}\n\n` +
      `Ma’lumotlar to‘g‘ri bo‘lsa, «✅ Arizani yuborish» tugmasini bosing:`;

    await ctx.reply(summaryText, {
      reply_markup: getRegistrationConfirmKeyboard(),
      parse_mode: 'HTML',
    });

    let confirmedOrEdited = false;
    while (!confirmedOrEdited) {
      const confirmUpdate = await conversation.wait();

      if (confirmUpdate.callbackQuery) {
        const data = confirmUpdate.callbackQuery.data || '';
        if (data === 'reg_action:cancel') {
          await confirmUpdate.answerCallbackQuery();
          await confirmUpdate.reply("↩️ Ro‘yxatdan o‘tish bekor qilindi.", {
            reply_markup: getMainMenuReplyKeyboard(),
            parse_mode: 'HTML',
          });
          await conversation.external((c) => {
            c.session.registrationDraft = undefined;
          });
          return;
        }

        const editMatch = data.match(/^reg_edit:(.+)$/);
        if (editMatch) {
          await confirmUpdate.answerCallbackQuery();
          editingStep = editMatch[1];
          confirmedOrEdited = true;
          break;
        }

        if (data === 'reg_confirm:submit') {
          await confirmUpdate.answerCallbackQuery({ text: "Ariza yuborilmoqda..." });

          // -------------------------------------------------------------
          // STEP G: Submission to NestJS API
          // -------------------------------------------------------------
          try {
            const payload = {
              fullName: draft.fullName!,
              phone: draft.phone!,
              courseSlug: draft.courseSlug!,
              branchSlug: draft.branchSlug!,
              preferredTime: draft.preferredTime,
              notes: `Telegram orqali ariza (User: @${username || userId})`,
              idempotencyKey: draft.idempotencyKey,
              source: draft.attributionSource || 'TELEGRAM_BOT',
              telegramUserId: userId ? String(userId) : undefined,
              telegramUsername: username || undefined,
              inquiryType: 'TRIAL_LESSON',
            };

            const result = await conversation.external(() =>
              apiClient.createTrialRegistration(payload),
            );

            // Clear session draft upon confirmed success
            await conversation.external((c) => {
              c.session.registrationDraft = undefined;
            });

            // -------------------------------------------------------------
            // STEP H: Success Confirmation
            // -------------------------------------------------------------
            const successMessage =
              `✅ <b>Arizangiz muvaffaqiyatli yuborildi!</b>\n\n` +
              `Ustoz Akademiyasi jamoasi murojaatingizni ko‘rib chiqadi va tez orada siz bilan bog‘lanadi.\n\n` +
              `🆔 <b>Ariza raqami:</b> <code>${escapeHtml(result.referenceId)}</code>\n` +
              `👤 <b>O‘quvchi:</b> ${escapeHtml(result.fullName)}\n` +
              `📚 <b>Kurs:</b> ${escapeHtml(result.courseTitle)}\n` +
              `📍 <b>Filial:</b> ${escapeHtml(result.branchName)}\n` +
              `📞 <b>Telefon:</b> <code>${escapeHtml(result.phoneFormatted)}</code>\n\n` +
              `<i>Ustoz Akademiyasini tanlaganingiz uchun tashakkur!</i>`;

            const successKeyboard = new InlineKeyboard()
              .text('📍 Filiallarimiz', 'nav:branches')
              .row()
              .text('🏠 Bosh menyu', 'nav:main');

            await confirmUpdate.reply(successMessage, {
              reply_markup: successKeyboard,
              parse_mode: 'HTML',
            });

            // Also restore main menu reply keyboard
            await confirmUpdate.reply(
              "Bosh menyuga qaytish uchun quyidagi bo‘limlardan birini tanlashingiz mumkin 👇",
              {
                reply_markup: getMainMenuReplyKeyboard(),
                parse_mode: 'HTML',
              },
            );

            return;
          } catch (err: any) {
            if (err instanceof ApiError) {
              if (err.statusCode === 409) {
                await confirmUpdate.reply(
                  `ℹ️ <b>Eslatma:</b> Ushbu telefon raqami orqali yaqinda sinov darsiga ariza yuborilgan.\n\n` +
                    `Xavotir olmang, arizangiz bazamizda mavjud. Tez orada ma’muriyatimiz siz bilan bog‘lanadi!`,
                  { reply_markup: getMainMenuReplyKeyboard(), parse_mode: 'HTML' },
                );
                await conversation.external((c) => {
                  c.session.registrationDraft = undefined;
                });
                return;
              }

              await confirmUpdate.reply(
                `⚠️ <b>Arizani yuborishda xatolik:</b>\n${escapeHtml(err.message)}\n\n` +
                  `Ma’lumotlaringiz saqlanib qolindi. Qaytadan tasdiqlashingiz yoki ma’lumotlarni o‘zgartirishingiz mumkin.`,
                { reply_markup: getRegistrationConfirmKeyboard(), parse_mode: 'HTML' },
              );
              confirmedOrEdited = true;
              break;
            } else {
              await confirmUpdate.reply(
                `⚠️ Server bilan aloqada xatolik yuz berdi. Iltimos, internet aloqasini tekshirib, qayta urinib ko‘ring.`,
                { reply_markup: getRegistrationConfirmKeyboard(), parse_mode: 'HTML' },
              );
              confirmedOrEdited = true;
              break;
            }
          }
        }

        await confirmUpdate.answerCallbackQuery();
        continue;
      }

      if (confirmUpdate.message?.text) {
        const text = confirmUpdate.message.text.trim();
        if (isCancelOrMenuCommand(text)) {
          await confirmUpdate.reply("↩️ Ro‘yxatdan o‘tish bekor qilindi.", {
            reply_markup: getMainMenuReplyKeyboard(),
            parse_mode: 'HTML',
          });
          await conversation.external((c) => {
            c.session.registrationDraft = undefined;
          });
          return;
        }

        await confirmUpdate.reply(
          "👆 Iltimos, arizani yuborish uchun «✅ Arizani yuborish» tugmasini bosing yoki ma’lumotlarni tahrirlang:",
          { reply_markup: getRegistrationConfirmKeyboard(), parse_mode: 'HTML' },
        );
        continue;
      }
    }
  }
}
