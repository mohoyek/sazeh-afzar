import { company } from "@/data/company";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${company.url}/#organization`,
    name: company.name,
    description:
      "تولیدکننده تخصصی تیرهای بتنی برق؛ تأمین انواع تیرهای بتنی برای شبکه‌های توزیع نیروی برق و پروژه‌های عمرانی.",
    url: company.url,
    logo: `${company.url}/images/logos/logo-mark.svg`,
    image: `${company.url}/images/logos/logo-mark.svg`,
    email: company.email,
    foundingDate: "2018",
    telephone: `+98${company.phone.mobile.slice(1)}`,
    areaServed: "IR",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+98${company.phone.mobile.slice(1)}`,
        contactType: "sales",
        areaServed: "IR",
        availableLanguage: "fa",
      },
      {
        "@type": "ContactPoint",
        telephone: `+98${company.phone.office.slice(1)}`,
        contactType: "customer service",
        areaServed: "IR",
        availableLanguage: "fa",
      },
    ],
    address: [
      {
        "@type": "PostalAddress",
        name: "دفتر مرکزی",
        streetAddress: company.address.headOffice,
        addressLocality: "تهران",
        addressCountry: "IR",
      },
      {
        "@type": "PostalAddress",
        name: "کارخانه",
        streetAddress: company.address.factory,
        addressLocality: "اندیمشک",
        addressRegion: "خوزستان",
        addressCountry: "IR",
      },
    ],
    // موقعیت دقیق کارخانه (شهرک صنعتی شماره ۲ اندیمشک)
    location: {
      "@type": "Place",
      name: "کارخانه سازه افزار فتح",
      address: {
        "@type": "PostalAddress",
        streetAddress: company.address.factory,
        addressLocality: "اندیمشک",
        addressRegion: "خوزستان",
        addressCountry: "IR",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 32.424151,
        longitude: 48.310498,
      },
      hasMap: "https://www.openstreetmap.org/?mlat=32.424151&mlon=48.310498#map=16/32.424151/48.310498",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}