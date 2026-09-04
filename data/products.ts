export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
  specPreview: string[];
  specs: ProductSpec[];
}

export const products: Product[] = [
  {
    id: "electric-pole",
    name: "تیر بتنی برق",
    image: "/images/products/electric-pole.svg",
    shortDescription:
      "تیر بتنی استاندارد مورد استفاده در شبکه‌های توزیع نیروی برق، طراحی‌شده برای دوام و پایداری بلندمدت.",
    specPreview: ["طول قابل تولید متغیر", "مقاومت مکانیکی مناسب شبکه توزیع"],
    specs: [
      { label: "طول", value: "متناسب با نیاز پروژه" },
      { label: "وزن", value: "بر اساس طول و مقطع محاسبه می‌شود" },
      { label: "نوع مقطع", value: "دایره‌ای / چندضلعی" },
      { label: "مقاومت", value: "مطابق استاندارد شبکه توزیع" },
      { label: "نوع بتن", value: "بتن ویبره‌ای با مقاومت بالا" },
      { label: "کاربرد", value: "خطوط توزیع نیروی برق" },
      { label: "استاندارد", value: "مطابق استانداردهای صنعت برق" },
    ],
  },
  {
    id: "medium-voltage-pole",
    name: "تیر بتنی فشار متوسط",
    image: "/images/products/medium-voltage-pole.svg",
    shortDescription:
      "طراحی‌شده برای خطوط فشار متوسط با تحمل بار مکانیکی و شرایط محیطی متنوع.",
    specPreview: ["مناسب خطوط فشار متوسط", "قابلیت تحمل بار بالا"],
    specs: [
      { label: "طول", value: "متناسب با نیاز پروژه" },
      { label: "وزن", value: "بر اساس طول و مقطع محاسبه می‌شود" },
      { label: "نوع مقطع", value: "دایره‌ای / چندضلعی" },
      { label: "مقاومت", value: "مطابق استاندارد فشار متوسط" },
      { label: "نوع بتن", value: "بتن ویبره‌ای با مقاومت بالا" },
      { label: "کاربرد", value: "خطوط انتقال فشار متوسط" },
      { label: "استاندارد", value: "مطابق استانداردهای صنعت برق" },
    ],
  },
  {
    id: "low-voltage-pole",
    name: "تیر بتنی فشار ضعیف",
    image: "/images/products/low-voltage-pole.svg",
    shortDescription:
      "گزینه اقتصادی و مطمئن برای شبکه‌های فشار ضعیف و پروژه‌های شهری و روستایی.",
    specPreview: ["مناسب شبکه فشار ضعیف", "اقتصادی و مقاوم"],
    specs: [
      { label: "طول", value: "متناسب با نیاز پروژه" },
      { label: "وزن", value: "بر اساس طول و مقطع محاسبه می‌شود" },
      { label: "نوع مقطع", value: "دایره‌ای / چندضلعی" },
      { label: "مقاومت", value: "مطابق استاندارد فشار ضعیف" },
      { label: "نوع بتن", value: "بتن ویبره‌ای استاندارد" },
      { label: "کاربرد", value: "شبکه‌های فشار ضعیف شهری و روستایی" },
      { label: "استاندارد", value: "مطابق استانداردهای صنعت برق" },
    ],
  },
  {
    id: "custom-pole",
    name: "تیرهای بتنی سفارشی",
    image: "/images/products/custom-pole.svg",
    shortDescription:
      "تولید متناسب با مشخصات فنی خاص پروژه، از طول تا نوع مقطع و مقاومت مورد نیاز.",
    specPreview: ["طراحی مطابق نیاز پروژه", "امکان تولید در ابعاد خاص"],
    specs: [
      { label: "طول", value: "بر اساس نیاز و توافق پروژه" },
      { label: "وزن", value: "متناسب با مشخصات درخواستی" },
      { label: "نوع مقطع", value: "بر اساس طراحی پروژه" },
      { label: "مقاومت", value: "متناسب با کاربرد مورد نظر" },
      { label: "نوع بتن", value: "بر اساس نیاز فنی پروژه" },
      { label: "کاربرد", value: "پروژه‌های خاص عمرانی و برق" },
      { label: "استاندارد", value: "بر اساس توافق و مشخصات فنی پروژه" },
    ],
  },
];
