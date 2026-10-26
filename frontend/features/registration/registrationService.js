import { validateUzbekPhone } from './validation';

/**
 * Service to handle lead registration submission with validation,
 * Telegram bot fallback, and backend API integration.
 */
export async function submitRegistration({
  regForm,
  courses = [],
  branches = [],
  telegramBotConfig = { botToken: '', chatId: '' },
  sourceUrl = 'https://ustozakademiyasi.uz/'
}) {
  const nextErrors = {};

  if (!regForm.fullName || regForm.fullName.trim().length < 3) {
    nextErrors.fullName = "Iltimos, ism va familiyangizni to'liq kiriting (kamida 3 ta harf).";
  }

  const phoneCheck = validateUzbekPhone(regForm.phone);
  if (!phoneCheck.valid) {
    nextErrors.phone = phoneCheck.error;
  }

  if (!regForm.courseSlug) {
    nextErrors.courseSlug = "Iltimos, o'quv kursini tanlang.";
  }

  if (!regForm.branchSlug) {
    nextErrors.branchSlug = 'Iltimos, o‘zingizga qulay filialni tanlang.';
  }

  if (Object.keys(nextErrors).length > 0) {
    return {
      success: false,
      errors: nextErrors,
      status: 'validation_error'
    };
  }

  const dedupeKey = `${phoneCheck.e164}-${regForm.courseSlug}-${regForm.branchSlug}`;
  const selectedCourseObj = courses.find((c) => c.slug === regForm.courseSlug);
  const selectedBranchObj = branches.find((b) => b.slug === regForm.branchSlug);

  const teacherCleanName = regForm.selectedTeacher
    ? regForm.selectedTeacher.replace(/^Ustoz\s+/i, '').trim()
    : null;
  const teacherNote = teacherCleanName
    ? `Ustoz: ${teacherCleanName} ustozni tanladi`
    : null;

  const notesList = [
    teacherNote,
    (regForm.notes || '').trim()
  ]
    .filter(Boolean)
    .filter((val, idx, arr) => arr.indexOf(val) === idx);
  const finalNotes = notesList.join(' | ');

  const payload = {
    fullName: regForm.fullName.trim(),
    phone: phoneCheck.e164,
    phoneFormatted: regForm.phone,
    courseSlug: regForm.courseSlug,
    courseTitle: selectedCourseObj ? selectedCourseObj.title : regForm.courseSlug,
    branchSlug: regForm.branchSlug,
    branchName: selectedBranchObj ? selectedBranchObj.name : regForm.branchSlug,
    selectedTeacher: regForm.selectedTeacher || undefined,
    notes: finalNotes,
    message: teacherNote || undefined,
    submittedAt: new Date().toISOString(),
    sourceUrl
  };

  try {
    // 1. If admin configured a live Telegram Bot Webhook
    if (telegramBotConfig.botToken?.trim() && telegramBotConfig.chatId?.trim()) {
      const tgText = [
        `🟢 *YANGI SINOV DARSI ARIZASI — USTOZ AKADEMIYASI*`,
        `👤 *F.I.Sh:* ${payload.fullName}`,
        `📞 *Telefon:* ${payload.phone}`,
        `📚 *Kurs:* ${payload.courseTitle}`,
        `📍 *Filial:* ${payload.branchName}`,
        teacherNote ? `👨‍🏫 *Tanlangan ustoz:* ${teacherNote}` : '',
        payload.notes ? `💬 *Izoh:* ${payload.notes}` : '',
        `🕒 *Vaqt:* ${new Date().toLocaleString('uz-UZ')}`
      ]
        .filter(Boolean)
        .join('\n');

      const tgRes = await fetch(
        `https://api.telegram.org/bot${telegramBotConfig.botToken.trim()}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramBotConfig.chatId.trim(),
            text: tgText,
            parse_mode: 'Markdown'
          })
        }
      );

      if (tgRes.ok) {
        const refId = 'UA-' + Math.floor(100000 + Math.random() * 900000);
        return {
          success: true,
          dedupeKey,
          confirmedLead: { ...payload, referenceId: refId }
        };
      }
    }

    // 2. Direct production integration with Backend API
    const apiRes = await fetch('/api/trial-registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await apiRes.json().catch(() => ({}));

    if (apiRes.status === 201 || (apiRes.ok && data.success)) {
      return {
        success: true,
        dedupeKey,
        confirmedLead: {
          ...payload,
          referenceId:
            data.referenceId ||
            data.lead?.referenceId ||
            'UA-' + Math.floor(100000 + Math.random() * 900000)
        }
      };
    }

    // Handle 409 Conflict: Duplicate Registration
    if (apiRes.status === 409) {
      return {
        success: false,
        status: 'duplicate',
        errors: {
          duplicate:
            data.message ||
            "Ushbu telefon raqami orqali ushbu kurs uchun yaqinda ariza yuborilgan. Tez orada ma'muriyatimiz siz bilan bog'lanadi."
        }
      };
    }

    // Handle 400 Bad Request: Validation Errors
    if (apiRes.status === 400) {
      const fieldErrors = {};
      if (Array.isArray(data.validationErrors) && data.validationErrors.length > 0) {
        data.validationErrors.forEach((vErr) => {
          if (vErr.field === 'phone') fieldErrors.phone = vErr.message;
          if (vErr.field === 'fullName') fieldErrors.fullName = vErr.message;
          if (vErr.field === 'courseSlug') fieldErrors.courseSlug = vErr.message;
          if (vErr.field === 'branchSlug') fieldErrors.branchSlug = vErr.message;
        });
      }
      return {
        success: false,
        status: 'validation_error',
        errors: {
          ...fieldErrors,
          general:
            data.message ||
            "Kiritilgan ma'lumotlarda xatolik aniqlandi. Iltimos, tekshirib qayta kiriting."
        }
      };
    }

    // Other backend or connection error
    return {
      success: false,
      status: 'server_error',
      errors: {
        general:
          data.message ||
          "Arizani qabul qilishda xatolik yuz berdi. Iltimos, keyinroq qayta urinib ko'ring yoki qo'ng'iroq qiling: +998 55 518 44 00"
      }
    };
  } catch (err) {
    console.error('Registration submission error:', err);
    return {
      success: false,
      status: 'network_error',
      errors: {
        general:
          "Server bilan aloqa bog‘lanmadi. Iltimos, internetingizni tekshirib qayta urinib ko‘ring."
      }
    };
  }
}
