export interface ProcessStep {
  id: string;
  number: string;
  icon: "PackageSearch" | "GitCommitVertical" | "Layers" | "Waves" | "ThermometerSun" | "ClipboardCheck";
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    id: "materials",
    number: "۰۱",
    icon: "PackageSearch",
    title: "آماده‌سازی مواد اولیه",
    description: "انتخاب و بررسی مواد اولیه استاندارد پیش از ورود به خط تولید.",
  },
  {
    id: "rebar",
    number: "۰۲",
    icon: "GitCommitVertical",
    title: "آماده‌سازی آرماتور",
    description: "برش و شکل‌دهی آرماتور مطابق مشخصات فنی هر محصول.",
  },
  {
    id: "mold",
    number: "۰۳",
    icon: "Layers",
    title: "آماده‌سازی قالب",
    description: "استقرار آرماتوربندی در قالب استاندارد متناسب با نوع تیر.",
  },
  {
    id: "casting",
    number: "۰۴",
    icon: "Waves",
    title: "بتن‌ریزی",
    description: "بتن‌ریزی و ویبره با کنترل دقیق نسبت‌های اختلاط.",
  },
  {
    id: "curing",
    number: "۰۵",
    icon: "ThermometerSun",
    title: "عمل‌آوری",
    description: "عمل‌آوری بتن در شرایط کنترل‌شده برای رسیدن به مقاومت نهایی.",
  },
  {
    id: "delivery",
    number: "۰۶",
    icon: "ClipboardCheck",
    title: "کنترل نهایی و تحویل",
    description: "بازرسی نهایی محصول و آماده‌سازی برای بارگیری و تحویل.",
  },
];
