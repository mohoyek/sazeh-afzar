import { NextResponse } from "next/server";
import { getTelegramConfig, sendTelegramText } from "../../../lib/telegram";

export const runtime = "nodejs";

// برچسب‌های راه ارتباطی (مطابق گزینه‌های فرم)
const CHANNEL_LABELS: Record<string, string> = {
  bale: "بله",
  rubika: "روبیکا",
  eitaa: "ایتا",
  whatsapp: "واتس‌آپ",
  telegram: "تلگرام",
  sms: "SMS",
};

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

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

// تاریخ میلادی (ISO) → نمایش شمسی
function toJalali(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "long",
      calendar: "persian",
    }).format(date);
  } catch {
    return iso;
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "درخواست نامعتبر است." },
      { status: 400 }
    );
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const requester = clean(data.requester);
  const contactChannel = clean(data.contactChannel);
  const quantity = clean(data.quantity);
  const poleHeight = clean(data.poleHeight);
  const projectLocation = clean(data.projectLocation);
  const deliveryDate = clean(data.deliveryDate);
  const urgentDelivery = data.urgentDelivery === true;

  if (!requester) {
    return NextResponse.json(
      { ok: false, message: "نام شخص یا شرکت را وارد کنید." },
      { status: 400 }
    );
  }
  if (!(contactChannel in CHANNEL_LABELS)) {
    return NextResponse.json(
      { ok: false, message: "راه ارتباطی را انتخاب کنید." },
      { status: 400 }
    );
  }
  if (!/^\d+$/.test(quantity) || Number(quantity) < 1) {
    return NextResponse.json(
      { ok: false, message: "تعداد معتبر وارد کنید." },
      { status: 400 }
    );
  }
  if (!/^\d+(\.\d+)?$/.test(poleHeight)) {
    return NextResponse.json(
      { ok: false, message: "ارتفاع معتبر وارد کنید." },
      { status: 400 }
    );
  }
  if (!projectLocation) {
    return NextResponse.json(
      { ok: false, message: "استان و شهر پروژه را وارد کنید." },
      { status: 400 }
    );
  }
  if (!urgentDelivery && !deliveryDate) {
    return NextResponse.json(
      {
        ok: false,
        message: "تاریخ تحویل را انتخاب کنید یا «تحویل فوری» را تیک بزنید.",
      },
      { status: 400 }
    );
  }

  const config = getTelegramConfig();
  if (!config) {
    console.warn(
      "[api/contact] TELEGRAM_BOT_TOKEN یا TELEGRAM_CHAT_ID تنظیم نشده است."
    );
    return NextResponse.json(
      {
        ok: false,
        message:
          "ارسال درخواست در حال حاضر در دسترس نیست؛ لطفاً بعداً دوباره تلاش کنید.",
      },
      { status: 503 }
    );
  }

  const esc = escapeHtml;
  const submittedAt = new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  const deliveryLabel = urgentDelivery
    ? "تحویل فوری"
    : toJalali(deliveryDate) || "—";

  const lines = [
    "<b>درخواست استعلام قیمت جدید — سازه افزار فتح</b>",
    "━━━━━━━━━━━━━━━━━",
    `نام شخص / شرکت: ${esc(requester)}`,
    `راه ارتباطی: ${esc(CHANNEL_LABELS[contactChannel] ?? contactChannel)}`,
    `تعداد مورد نیاز: ${esc(quantity)}`,
    `ارتفاع مد نظر: ${esc(poleHeight)} متر`,
    `استان و شهر پروژه: ${esc(projectLocation)}`,
    `تاریخ تحویل: ${esc(deliveryLabel)}`,
    "━━━━━━━━━━━━━━━━━",
    `⏱ ثبت‌شده در ${esc(submittedAt)}`,
  ];

  try {
    await sendTelegramText(config, lines.join("\n"));
  } catch (error) {
    console.error("[api/contact] خطا در ارسال تلگرام:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "ارسال درخواست با خطا مواجه شد؛ لطفاً دوباره تلاش کنید.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
