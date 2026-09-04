// ابزارهای مشترک ارسال پیام به ربات تلگرام (فقط سمت سرور)

function apiBase(): string {
  const base =
    process.env.TELEGRAM_API_BASE?.trim() || "https://api.telegram.org";
  return base.endsWith("/") ? base.slice(0, -1) : base;

}

const MAX_MESSAGE_LENGTH = 4000;

export interface TelegramConfig {
  token: string;
  chatId: string;
}

export function getTelegramConfig(): TelegramConfig | null {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  return token && chatId ? { token, chatId } : null;
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
      `${apiBase()}/bot${config.token}/sendMessage`,
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
  form.append("document", new Blob([new Uint8Array(document.data)]), document.filename);
  if (document.caption) form.append("caption", document.caption.slice(0, 1024));
  const response = await fetch(
    `${apiBase()}/bot${config.token}/sendDocument`,
    { method: "POST", body: form }
  );
  if (!response.ok) {
    throw new Error(
      `Telegram sendDocument ${response.status}: ${await response.text()}`
    );
  }
}
