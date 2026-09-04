import { NextResponse } from "next/server";
import {
  getTelegramConfig,
  getTelegramDiagnostics,
  sendTelegramText,
  sendTelegramDocument,
} from "../../../lib/telegram";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 مگابایت
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "rtf", "txt"];
const MAX_ROWS = 20;

const DEGREES = [
  "زیر دیپلم",
  "دیپلم",
  "فوق دیپلم",
  "کاردانی",
  "کارشناسی",
  "کارشناسی ارشد",
  "دکتری",
];

const MONTH_NAMES = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

// گیرنده‌ی پیش‌فرض؛ در .env.local با RESEND_TO قابل تغییر است
const DEFAULT_TO = "yeknazar.rayno@gmail.com";

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (ch) =>
      (
        {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        } as Record<string, string>
      )[ch]
  );
}

function fileExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : "";
}

function cleanText(value: FormDataEntryValue | null): string {
  return String(value ?? "").trim();
}

function isPhone(value: string): boolean {
  return /^[0-9+\-\s()]{8,16}$/.test(value);
}

function parseRows(raw: FormDataEntryValue | null, limit: number): unknown[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((row) => row && typeof row === "object")
      .slice(0, limit);
  } catch {
    return [];
  }
}
export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "درخواست نامعتبر است." },
      { status: 400 }
    );
  }

  const firstName = cleanText(formData.get("firstName"));
  const lastName = cleanText(formData.get("lastName"));
  const fatherName = cleanText(formData.get("fatherName"));
  const insuranceYears = cleanText(formData.get("insuranceYears"));
  const birthDay = cleanText(formData.get("birthDay"));
  const birthMonth = cleanText(formData.get("birthMonth"));
  const birthYear = cleanText(formData.get("birthYear"));
  const nationalId = cleanText(formData.get("nationalId"));
  const degree = cleanText(formData.get("degree"));
  const major = cleanText(formData.get("major"));
  const institution = cleanText(formData.get("institution"));
  const gpa = cleanText(formData.get("gpa"));
  const mobile = cleanText(formData.get("mobile"));
  const landline = cleanText(formData.get("landline"));
  const email = cleanText(formData.get("email"));
  const workHistory = parseRows(formData.get("workHistory"), MAX_ROWS);
  const referees = parseRows(formData.get("referees"), MAX_ROWS);

  // اعتبارسنجی سمت سرور
  if (!firstName || !lastName) {
    return NextResponse.json(
      { ok: false, message: "نام و نام خانوادگی را وارد کنید." },
      { status: 400 }
    );
  }
  const bDay = Number(birthDay);
  const bMonth = Number(birthMonth);
  const bYear = Number(birthYear);
  if (
    !Number.isInteger(bDay) ||
    bDay < 1 ||
    bDay > 31 ||
    !Number.isInteger(bMonth) ||
    bMonth < 1 ||
    bMonth > 12 ||
    !/^[0-9]{4}$/.test(birthYear) ||
    bYear < 1300 ||
    bYear > 1405
  ) {
    return NextResponse.json(
      { ok: false, message: "تاریخ تولد را کامل و معتبر وارد کنید." },
      { status: 400 }
    );
  }
  if (!DEGREES.includes(degree)) {
    return NextResponse.json(
      { ok: false, message: "مقطع تحصیلی معتبر انتخاب کنید." },
      { status: 400 }
    );
  }
  if (degree !== "زیر دیپلم" && (!major || !institution || !gpa)) {
    return NextResponse.json(
      { ok: false, message: "اطلاعات مقطع تحصیلی را کامل وارد کنید." },
      { status: 400 }
    );
  }
  if (!mobile || !isPhone(mobile) || (landline && !isPhone(landline))) {
    return NextResponse.json(
      { ok: false, message: "شماره موبایل و شماره ثابت معتبر وارد کنید." },
      { status: 400 }
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, message: "ایمیل معتبر وارد کنید." },
      { status: 400 }
    );
  }
  // فایل رزومه — اختیاری
  const rawFile = formData.get("resume");
  let attachment: { filename: string; content: string } | null = null;

  if (rawFile && rawFile instanceof File && rawFile.size > 0) {
    if (!ALLOWED_EXTENSIONS.includes(fileExtension(rawFile.name))) {
      return NextResponse.json(
        { ok: false, message: "فرمت فایل رزومه باید PDF یا Word باشد." },
        { status: 400 }
      );
    }
    if (rawFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { ok: false, message: "حجم فایل رزومه نباید بیشتر از ۵ مگابایت باشد." },
        { status: 400 }
      );
    }
    const bytes = new Uint8Array(await rawFile.arrayBuffer());
    let binary = "";
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    attachment = { filename: rawFile.name, content: btoa(binary) };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const config = await getTelegramConfig();

  const canEmail = Boolean(apiKey && from);
  const canTelegram = Boolean(config);

  if (!canEmail && !canTelegram) {
    const diagnostics = await getTelegramDiagnostics();
    console.warn(
      "[api/employment] هیچ کانال ارسالی (ایمیل یا ربات) پیکربندی نشده است:",
      diagnostics
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          "ارسال درخواست در حال حاضر در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.",
        diagnostics,
      },
      { status: 503 }
    );
  }

  const submittedAt = new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  const birthMonthName = MONTH_NAMES[bMonth - 1] ?? birthMonth;
  const to = process.env.RESEND_TO?.trim() || DEFAULT_TO;
  // ساخت بدنه HTML ایمیل
  const esc = escapeHtml;
  const kvRow = (label: string, value: string, ltr = false) =>
    `<tr>
      <td style="padding:7px 12px;background:#f5f6f7;width:170px;font-weight:bold;border:1px solid #e5e7eb;">${label}</td>
      <td style="padding:7px 12px;border:1px solid #e5e7eb;"${ltr ? " dir=\"ltr\"" : ""}>${value || "—"}</td>
    </tr>`;
  const sectionTitle = (title: string) =>
    `<tr><td colspan="2" style="padding:10px 12px;background:#17212b;color:#e5a623;font-weight:bold;border:1px solid #17212b;">${title}</td></tr>`;

  const tableHtml = (
    rows: unknown[],
    headers: string[]
  ): string => {
    if (!rows.length) return "";
    const head = headers
      .map((h) => `<th style="padding:7px 10px;background:#eef0f2;border:1px solid #e5e7eb;font-size:12px;">${h}</th>`)
      .join("");
    const body = rows
      .map((row) => {
        const r = row as Record<string, unknown>;
        const cells = headers
          .map(() => "")
          .map((_, idx) => {
            const keys = ["c1", "c2", "c3", "c4", "c5", "c6"];
            return `<td style="padding:7px 10px;border:1px solid #e5e7eb;font-size:13px;">${esc(String(r[keys[idx]] ?? ""))}</td>`;
          })
          .join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");
    return `<table style="width:100%;border-collapse:collapse;margin:4px 0 10px;">${head}${body}</table>`;
  };

  const workTable = tableHtml(workHistory, [
    "نام موسسه",
    "سمت",
    "تلفن",
    "تاریخ شروع",
    "تاریخ خاتمه",
    "علت ترک کار",
  ]);
  const refereeTable = tableHtml(referees, [
    "نام و نام خانوادگی",
    "شغل",
    "نسبت و مدت آشنایی",
    "شماره تماس",
  ]);
  const fullName = `${firstName} ${lastName}`;
  const birthDate = `${birthDay} ${birthMonthName} ${birthYear}`;
  const hasResume = Boolean(attachment);

  const html = `
  <div dir="rtl" style="font-family:Tahoma,'Segoe UI',sans-serif;color:#17212b;max-width:680px;margin:0 auto;">
    <div style="background:#17212b;color:#e5a623;font-weight:bold;font-size:16px;padding:14px 20px;border-radius:6px 6px 0 0;">
      درخواست همکاری جدید — سازه افزار فتح
    </div>
    <div style="border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 6px 6px;font-size:14px;">
      <table style="width:100%;border-collapse:collapse;">
        ${sectionTitle("مشخصات فردی")}
        ${kvRow("نام", esc(firstName))}
        ${kvRow("نام خانوادگی", esc(lastName))}
        ${kvRow("نام پدر", esc(fatherName))}
        ${kvRow("سابقه بیمه", esc(insuranceYears))}
        ${kvRow("تاریخ تولد", birthDate)}
        ${kvRow("کد ملی", esc(nationalId), true)}
        ${sectionTitle(degree === "زیر دیپلم" ? "اطلاعات تماس" : "مقطع تحصیلی و اطلاعات تماس")}
        ${kvRow("مقطع تحصیلی", esc(degree))}
        ${degree !== "زیر دیپلم" ? kvRow("رشته تحصیلی", esc(major)) : ""}
        ${degree !== "زیر دیپلم" ? kvRow("موسسه آموزشی", esc(institution)) : ""}
        ${degree !== "زیر دیپلم" ? kvRow("معدل", esc(gpa)) : ""}
        ${kvRow("موبایل", esc(mobile), true)}
        ${kvRow("شماره ثابت", esc(landline), true)}
        ${kvRow("ایمیل", esc(email))}
      </table>
      ${workHistory.length ? `<div style="font-weight:bold;color:#17212b;margin:14px 0 4px;">سوابق کار</div>${workTable}` : ""}
      ${referees.length ? `<div style="font-weight:bold;color:#17212b;margin:14px 0 4px;">معرفین</div>${refereeTable}` : ""}
      ${hasResume ? `<div style="margin-top:14px;">فایل رزومه «${esc(attachment!.filename)}» به این ایمیل پیوست شده است.</div>` : ""}
      <div style="margin-top:16px;padding-top:12px;border-top:1px dashed #d5d9de;color:#8a9095;font-size:12px;">
        ثبت‌شده در ${esc(submittedAt)} — سازه افزار فتح
      </div>
    </div>
  </div>`;

  const failedChannels: string[] = [];

  // ۱) ارسال از طریق ربات تلگرام
  if (canTelegram) {
    try {
      const tgLines: string[] = [];
      tgLines.push("<b>درخواست همکاری جدید — سازه افزار فتح</b>");
      tgLines.push("━━━━━━━━━━━━━━━━━");
      tgLines.push("<b>مشخصات فردی</b>");
      tgLines.push(`نام و نام خانوادگی: ${esc(fullName)}`);
      tgLines.push(`نام پدر: ${esc(fatherName) || "—"}`);
      tgLines.push(`سابقه بیمه: ${esc(insuranceYears) || "ندارم"}`);
      tgLines.push(`تاریخ تولد: ${birthDate}`);
      tgLines.push(`کد ملی: ${esc(nationalId) || "—"}`);
      tgLines.push("━━━━━━━━━━━━━━━━━");
      tgLines.push("<b>مقطع تحصیلی</b>");
      tgLines.push(`مقطع: ${esc(degree)}`);
      if (degree !== "زیر دیپلم") {
        tgLines.push(`رشته: ${esc(major)}`);
        tgLines.push(`موسسه: ${esc(institution)}`);
        tgLines.push(`معدل: ${esc(gpa)}`);
      }
      tgLines.push("━━━━━━━━━━━━━━━━━");
      tgLines.push("<b>اطلاعات تماس</b>");
      tgLines.push(`موبایل: ${esc(mobile)}`);
      tgLines.push(`شماره ثابت: ${esc(landline) || "—"}`);
      tgLines.push(`ایمیل: ${esc(email) || "—"}`);
      if (workHistory.length) {
        tgLines.push("━━━━━━━━━━━━━━━━━");
        tgLines.push("<b>سوابق کار</b>");
        for (const row of workHistory) {
          const r = row as Record<string, unknown>;
          tgLines.push(
            `▪ ${esc(String(r.c1 ?? "—"))} | ${esc(String(r.c2 ?? "—"))} | ${esc(String(r.c3 ?? "—"))} | شروع: ${esc(String(r.c4 ?? "—"))} | خاتمه: ${esc(String(r.c5 ?? "—"))} | علت ترک: ${esc(String(r.c6 ?? "—"))}`
          );
        }
      }
      if (referees.length) {
        tgLines.push("━━━━━━━━━━━━━━━━━");
        tgLines.push("<b>معرفین</b>");
        for (const row of referees) {
          const r = row as Record<string, unknown>;
          tgLines.push(
            `▪ ${esc(String(r.c1 ?? "—"))} | ${esc(String(r.c2 ?? "—"))} | ${esc(String(r.c3 ?? "—"))} | ${esc(String(r.c4 ?? "—"))}`
          );
        }
      }
      tgLines.push("━━━━━━━━━━━━━━━━━");
      tgLines.push(`⏱ ثبت‌شده در ${esc(submittedAt)}`);

      await sendTelegramText(
        config!,
        tgLines.join("\n")
      );
      if (attachment) {
        await sendTelegramDocument(
          config!,
          {
            filename: attachment.filename,
            data: Buffer.from(attachment.content, "base64"),
            caption: `رزومه — ${fullName}`,
          }
        );
      }
    } catch (error) {
      console.error("[api/employment] خطا در ارسال تلگرام:", error);
      failedChannels.push("تلگرام");
    }
  }

  // ۲) ارسال از طریق ایمیل (Resend) — در صورت پیکربندی
  if (canEmail) {
    try {
      const resendResponse = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `درخواست همکاری جدید — ${fullName}`,
          html,
          ...(attachment ? { attachments: [attachment] } : {}),
        }),
      });
      if (!resendResponse.ok) {
        const detail = await resendResponse.text().catch(() => "");
        console.error(
          `[api/employment] خطای Resend (${resendResponse.status}):`,
          detail
        );
        throw new Error(`Resend ${resendResponse.status}`);
      }
    } catch (error) {
      console.error("[api/employment] خطا در اتصال به Resend:", error);
      failedChannels.push("ایمیل");
    }
  }

  const attemptedChannels = (canTelegram ? 1 : 0) + (canEmail ? 1 : 0);
  if (failedChannels.length === attemptedChannels) {
    return NextResponse.json(
      {
        ok: false,
        message: "ارسال درخواست با خطا مواجه شد؛ لطفاً دوباره تلاش کنید.",
      },
      { status: 502 }
    );
  }
  if (failedChannels.length > 0) {
    console.error(
      `[api/employment] برخی کانال‌ها ناموفق بودند: ${failedChannels.join("، ")}`
    );
  }
  return NextResponse.json({ ok: true });
}
