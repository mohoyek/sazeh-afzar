export interface Project {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
}

export const projects: Project[] = [
  {
    id: "grid-development",
    name: "پروژه توسعه شبکه برق",
    location: "[نام استان/شهرستان]",
    description: "تأمین و اجرای تیرهای بتنی برای توسعه شبکه توزیع منطقه‌ای.",
    image: "/images/projects/grid-development.svg",
  },
  {
    id: "pole-supply",
    name: "پروژه تأمین تیرهای بتنی",
    location: "[نام استان/شهرستان]",
    description: "تأمین حجم بالای تیر بتنی مطابق زمان‌بندی پروژه پیمانکار.",
    image: "/images/projects/pole-supply.svg",
  },
  {
    id: "distribution-network",
    name: "پروژه شبکه توزیع",
    location: "[نام استان/شهرستان]",
    description: "تولید و تحویل محصول متناسب با مشخصات فنی شبکه توزیع.",
    image: "/images/projects/distribution-network.svg",
  },
  {
    id: "civil-project",
    name: "پروژه عمرانی",
    location: "[نام استان/شهرستان]",
    description: "همکاری در تأمین تیرهای بتنی برای یک پروژه عمرانی زیرساختی.",
    image: "/images/projects/civil-project.svg",
  },
];
