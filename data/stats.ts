// آمار شرکت — اعداد نمونه هستند و باید پیش از انتشار نهایی با اطلاعات واقعی جایگزین شوند.

export interface Stat {
  id: string;
  value: number;
  suffix: string;
  label: string;
}

export const stats: Stat[] = [
  {
    id: "experience",
    value: 15,
    suffix: "+",
    label: "سال تجربه",
  },
  {
    id: "production",
    value: 50000,
    suffix: "+",
    label: "تیر تولیدشده",
  },
  {
    id: "projects",
    value: 100,
    suffix: "+",
    label: "پروژه",
  },
  {
    id: "support",
    value: 24,
    suffix: "/۷",
    label: "پاسخگویی",
  },
];
