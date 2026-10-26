import { NextResponse } from 'next/server';

const NEST_BACKEND_URL = process.env.NEST_BACKEND_URL || 'http://localhost:4000/api/v1';

export async function POST(request) {
  try {
    const payload = await request.json();
    const { fullName, phone, courseSlug, branchSlug, notes, message, selectedTeacher, preferredTime } = payload;

    if (!fullName || !phone) {
      return NextResponse.json(
        { success: false, message: "Ism va familiya hamda telefon raqami talab qilinadi." },
        { status: 400 }
      );
    }

    const teacherNote = selectedTeacher
      ? `Ustoz: ${selectedTeacher.replace(/^Ustoz\s+/i, '').trim()} ustozni tanladi`
      : null;

    const notesCombined = [teacherNote, notes]
      .filter(Boolean)
      .filter((v, idx, arr) => arr.indexOf(v) === idx)
      .join(' | ');

    // Call NestJS Production Backend API
    const backendRes = await fetch(`${NEST_BACKEND_URL}/public/trial-registrations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-source': 'nextjs-web-client',
      },
      body: JSON.stringify({
        fullName,
        phone,
        courseSlug: courseSlug || 'professional-fonetika',
        branchSlug: branchSlug || 'archakocha',
        notes: notesCombined || undefined,
        message: message || teacherNote || undefined,
        preferredTime: preferredTime || undefined,
      }),
    });

    const data = await backendRes.json().catch(() => ({}));

    if (!backendRes.ok) {
      const errMsg = Array.isArray(data.message)
        ? data.message.join(', ')
        : (data.message || "Arizani qabul qilishda xatolik yuz berdi.");

      return NextResponse.json(
        {
          success: false,
          error: errMsg,
          message: errMsg,
          statusCode: backendRes.status,
          errorCode: data.errorCode,
          validationErrors: data.validationErrors || [],
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json({
      ok: true,
      success: true,
      referenceId: data.data?.referenceId,
      message: data.data?.message || "Arizangiz muvaffaqiyatli qabul qilindi.",
      lead: data.data,
    });
  } catch (err) {
    console.error('Error forwarding to NestJS API:', err);
    return NextResponse.json(
      {
        success: false,
        error: "Server bilan aloqa bog‘lanmadi. Iltimos, keyinroq urinib ko‘ring.",
        message: "Server bilan aloqa bog‘lanmadi. Iltimos, keyinroq urinib ko‘ring.",
      },
      { status: 500 }
    );
  }
}
