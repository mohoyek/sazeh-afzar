export interface QualityFeature {
  id: string;
  icon: "FlaskConical" | "GaugeCircle" | "Ruler" | "BadgeCheck";
  title: string;
}

export const qualityFeatures: QualityFeature[] = [
  { id: "materials", icon: "FlaskConical", title: "کنترل مواد اولیه" },
  { id: "process", icon: "GaugeCircle", title: "کنترل فرآیند تولید" },
  { id: "specs", icon: "Ruler", title: "بررسی مشخصات محصول" },
  { id: "final", icon: "BadgeCheck", title: "کنترل نهایی قبل از تحویل" },
];

export interface WhyUsFeature {
  id: string;
  icon: "ShieldCheck" | "History" | "Factory" | "Clock" | "Wrench" | "Headset";
  title: string;
  description: string;
}

export const whyUsFeatures: WhyUsFeature[] = [
  {
    id: "quality",
    icon: "ShieldCheck",
    title: "کیفیت تولید",
    description: "کنترل مستمر فرآیند تولید",
  },
  {
    id: "experience",
    icon: "History",
    title: "تجربه",
    description: "تجربه در تولید و تأمین پروژه",
  },
  {
    id: "capacity",
    icon: "Factory",
    title: "ظرفیت تولید",
    description: "امکان تأمین سفارش‌های پروژه‌ای",
  },
  {
    id: "delivery",
    icon: "Clock",
    title: "تحویل به‌موقع",
    description: "برنامه‌ریزی تولید و ارسال",
  },
  {
    id: "custom",
    icon: "Wrench",
    title: "تولید سفارشی",
    description: "امکان بررسی نیازهای خاص پروژه",
  },
  {
    id: "support",
    icon: "Headset",
    title: "پشتیبانی",
    description: "پاسخگویی به مشتریان و پیمانکاران",
  },
];
