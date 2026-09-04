// ابزارهای مشترک ارسال پیام به ربات (تلگرام/بله) — فقط سمت سرور
//
// متغیرهای محیطی (TELEGRAM_BOT_TOKEN و …) ابتدا از process.env خوانده می‌شوند؛
// اگر خالی بودند از bindings محیط کلادفلر (getCloudflareContext) خوانده می‌شوند،
// چون در Workers گاهی متغیرهای داشبورد فقط به‌صورت binding در دسترس‌اند.

const MAX_MESSAGE_LENGTH = 4000;

export interface TelegramConfig {
  token: string;
  chatId: string;
  apiBase: string;
}

export interface EnvPresence {
  token: boolean;
  chatId: boolean;
  apiBase: boolean;
}

export interface EnvDiagnostics {
  processEnv: EnvPresence;
  cloudflareEnv: EnvPresence;
}

// خواندن bindings محیط کلادفلر (متغیرها/سکرت‌های داشبورد)؛
// خارج از Workers صرفاً یک شیء خالی برمی‌گرداند.
async function cloudflareEnv(): Promise<Record<string, string | undefined>> {
  try {
    const mod = await import("@opennextjs/cloudflare");
    const ctx = await mod.getCloudflareContext({ async: true });
    return (ctx.env ?? {}) as Record<string, string | undefined>;
  } catch {
    return {};
  }
}

function has(value: string | undefined): boolean {
  return Boolean(value?.trim());
}

// وضعیت (بدون افشای مقدار) هر متغیر در هر دو منبع — برای دیباگ 503
export async function getTelegramDiagnostics(): Promise<EnvDiagnostics> {
  const cf = await cloudflareEnv();
  return {
    processEnv: {
      token: has(process.env.TELEGRAM_BOT_TOKEN),
      chatId: has(process.env.TELEGRAM_CHAT_ID),
      apiBase: has(process.env.TELEGRAM_API_BASE),
    },
    cloudflareEnv: {
      token: has(cf.TELEGRAM_BOT_TOKEN),
      chatId: has(cf.TELEGRAM_CHAT_ID),
      apiBase: has(cf.TELEGRAM_API_BASE),
    },
  };
}

export async function getTelegramConfig(): Promise<TelegramConfig | null> {
  const cf = await cloudflareEnv();
  const token =
    process.env.TELEGRAM_BOT_TOKEN?.trim() || cf.TELEGRAM_BOT_TOKEN?.trim();
  const chatId =
    process.env.TELEGRAM_CHAT_ID?.trim() || cf.TELEGRAM_CHAT_ID?.trim();
  const base = (
    process.env.TELEGRAM_API_BASE?.trim() ||
    cf.TELEGRAM_API_BASE?.trim() ||
    "https://api.telegram.org"
  ).replace(/\/+$/, "");
  if (!token || !chatId) return null;
  return { token, chatId, apiBase: base };
}

function chunkLines(text: string, max: number): string[] {
  const lines = text.split("\n");
  const chunks: string[] = [];
  let current = "";
  for (const line of lines) {
    if (current && current.length + line.length + 1 > max) {
      chunks.push(current);
      current = "";
    }
    current = current ? `${current}\n${line}` : line;
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [""];
}

export async function sendTelegramText(
  config: TelegramConfig,
  text: string
): Promise<void> {
  for (const chunk of chunkLines(text, MAX_MESSAGE_LENGTH)) {
    const response = await fetch(
      `${config.apiBase}/bot${config.token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId,
          text: chunk,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Telegram sendMessage ${response.status}: ${await response.text()}`
      );
    }
  }
}

export interface TelegramDocument {
  filename: string;
  data: Buffer;
  caption?: string;
}

export async function sendTelegramDocument(
  config: TelegramConfig,
  document: TelegramDocument
): Promise<void> {
  const form = new FormData();
  form.append("chat_id", config.chatId);
  form.append(
    "document",
    new Blob([new Uint8Array(document.data)]),
    document.filename
  );
  if (document.caption) form.append("caption", document.caption.slice(0, 1024));
  const response = await fetch(
    `${config.apiBase}/bot${config.token}/sendDocument`,
    { method: "POST", body: form }
  );
  if (!response.ok) {
    throw new Error(
      `Telegram sendDocument ${response.status}: ${await response.text()}`
    );
  }
}
