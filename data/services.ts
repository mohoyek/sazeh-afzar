export interface Service {
  id: string;
  icon: "Factory" | "Truck" | "Settings2" | "MessageSquareText";
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    id: "production",
    icon: "Factory",
    title: "تولید تیرهای بتنی",
    description: "تولید انواع تیرهای بتنی متناسب با مشخصات فنی پروژه.",
  },
  {
    id: "supply",
    icon: "Truck",
    title: "تأمین پروژه",
    description: "تأمین محصولات مورد نیاز پروژه‌های برق و عمرانی.",
  },
  {
    id: "custom",
    icon: "Settings2",
    title: "تولید سفارشی",
    description: "بررسی و تولید محصول بر اساس نیاز و مشخصات فنی پروژه.",
  },
  {
    id: "consulting",
    icon: "MessageSquareText",
    title: "مشاوره فنی",
    description: "ارائه مشاوره در انتخاب محصول مناسب برای پروژه.",
  },
];
