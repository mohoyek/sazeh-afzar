import { Building2, Factory, Phone, Smartphone, Mail, Clock } from "lucide-react";
import { company } from "@/data/company";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "./ContactForm";

const infoItems = [
  {
    icon: Building2,
    label: "دفتر مرکزی",
    value: company.address.headOffice,
    ltr: false,
  },
  {
    icon: Factory,
    label: "کارخانه",
    value: company.address.factory,
    ltr: false,
  },
  {
    icon: Phone,
    label: "تلفن",
    value: company.phone.officeDisplay,
    href: `tel:${company.phone.office}`,
    ltr: true,
  },
  {
    icon: Smartphone,
    label: "موبایل",
    value: company.phone.mobileDisplay,
    href: `tel:${company.phone.mobile}`,
    ltr: true,
  },
  {
    icon: Mail,
    label: "ایمیل",
    value: company.email,
    href: `mailto:${company.email}`,
    ltr: true,
  },
  {
    icon: Clock,
    label: "ساعات کاری",
    value: company.workingHours,
    ltr: false,
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-20 lg:py-28 bg-bg scroll-mt-20">
      <div className="container-site">
        <SectionHeading eyebrow="تماس" title="با ما در ارتباط باشید" />

        <div className="mt-12 grid lg:grid-cols-2 gap-10 lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="order-1 lg:order-2">
            <ul className="flex flex-col gap-5">
              {infoItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary text-accent">
                      <Icon size={19} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs text-concrete">
                        {item.label}
                      </span>
                      <span
                        className="block mt-0.5 text-sm font-medium text-primary text-right"
                        dir={item.ltr ? "ltr" : undefined}
                      >
                        {item.value}
                      </span>
                    </span>
                  </>
                );

                return (
                  <li
                    key={item.label}
                    className="flex items-start gap-4 bg-white border border-black/5 rounded-sm p-5"
                  >
                    {item.href ? (
                      <a href={item.href} className="flex items-start gap-4 w-full">
                        {content}
                      </a>
                    ) : (
                      content
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
