import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { company } from "@/data/company";
import "./globals.css";

const vazirmatn = localFont({
  src: "./fonts/Vazirmatn-Variable.ttf",
  variable: "--font-vazirmatn",
  display: "swap",
  weight: "100 900",
});

const siteTitle = `${company.name} | تولیدکننده تیرهای بتنی برق`;
const siteDescription =
  "تولید و تأمین انواع تیرهای بتنی مورد استفاده در شبکه‌های برق، پروژه‌های عمرانی و شبکه‌های توزیع نیروی برق. کارخانه در شهرک صنعتی اندیمشک، خوزستان.";

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: siteTitle,
    template: `%s | ${company.name}`,
  },
  description: siteDescription,
  applicationName: company.name,
  creator: company.name,
  category: "تولید تجهیزات شبکه برق",
  keywords: [
    "تیر بتنی برق",
    "تیر بتنی",
    "تولید تیر بتنی",
    "کارخانه تیر بتنی",
    "شبکه توزیع برق",
    "تیر فشار متوسط",
    "اندیمشک",
    "سازه افزار فتح",
  ],
  authors: [{ name: company.name, url: company.url }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: company.url,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: company.url,
    siteName: company.name,
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  icons: {
    icon: "/icon.svg",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17212b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa-IR" dir="rtl" className={vazirmatn.variable}>
      <body className="antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-sm"
        >
          رفتن به محتوای اصلی
        </a>
        {children}
      </body>
    </html>
  );
}