import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { company } from "@/data/company";

export const alt = `${company.name} | تولیدکننده تخصصی تیرهای بتنی برق`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  // ساتوری (satori) با فونت متغیر (variable) مشکل دارد؛ از وزن‌های ثابت استفاده می‌شود.
  const [black, semibold, medium] = await Promise.all([
    readFile(join(process.cwd(), "app/fonts/Vazirmatn-Black.ttf")),
    readFile(join(process.cwd(), "app/fonts/Vazirmatn-SemiBold.ttf")),
    readFile(join(process.cwd(), "app/fonts/Vazirmatn-Medium.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 90px",
          background:
            "radial-gradient(circle at 85% 15%, rgba(229,166,35,0.22), transparent 42%), #17212b",
          color: "#ffffff",
          direction: "rtl",
          textAlign: "right",
          fontFamily: "Vazirmatn",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 26,
            fontSize: 30,
            color: "#e5a623",
            fontWeight: 600,
          }}
        >
          <div style={{ width: 40, height: 4, background: "#e5a623" }} />
          زیرساخت شبکه‌های برق کشور
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 84,
            lineHeight: 1.25,
            fontWeight: 900,
          }}
        >
          تولیدکننده تخصصی
          <br />
          تیرهای بتنی برق
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 34,
            fontSize: 34,
            color: "rgba(255,255,255,0.82)",
            fontWeight: 500,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: 999,
              background: "#e5a623",
              color: "#17212b",
              fontSize: 26,
            }}
          >
            {company.nameShort.charAt(0)}
          </div>
          {company.name} — {company.address.factory}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Vazirmatn", data: black, style: "normal", weight: 900 },
        { name: "Vazirmatn", data: semibold, style: "normal", weight: 600 },
        { name: "Vazirmatn", data: medium, style: "normal", weight: 500 },
      ],
    }
  );
}