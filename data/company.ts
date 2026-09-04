// اطلاعات مرکزی شرکت — تمام کامپوننت‌ها اطلاعات تماس و هویتی را از این فایل می‌خوانند
// در صورت تغییر اطلاعات شرکت، فقط کافیست همین فایل به‌روزرسانی شود.

export const company = {
  name: "سازه افزار فتح",
  nameShort: "سازه افزار فتح",
  // آدرس وب‌سایت — در همه‌جای سئو (canonical، sitemap، robots، schema) از همین‌جا خوانده می‌شود
  url: "https://sazehafzar.com",
  foundedYear: 1397,
  foundedYearFa: "۱۳۹۷",
  tagline: "تولیدکننده تخصصی تیرهای بتنی برق",

  phone: {
    office: "06142249855",
    officeDisplay: "۰۶۱-۴۲۲۴۹۸۵۵",
    mobile: "09013365949",
    mobileDisplay: "۰۹۰۱-۳۳۶۵۹۴۹",
  },

  email: "info@sazehafzar.com",

  address: {
    headOffice: "تهران، جنت‌آباد جنوبی، بلوار قدس",
    factory: "اندیمشک، شهرک صنعتی شماره ۲",
  },

  workingHours: "شنبه تا چهارشنبه، ساعت ۸ الی ۱۷",

  whatsapp: {
    enabled: true,
    // شماره واتساپ باید بدون صفر ابتدایی و با کد کشور وارد شود (مثال: 989013365949)
    number: "989013365949",
  },

  social: {
    // در صورت وجود آدرس واقعی شبکه‌های اجتماعی، اینجا تکمیل شود
  },

  copyrightYear: 2026,
} as const;
