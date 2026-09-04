import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { company } from "@/data/company";
import Reveal from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";

export default function AboutIntro() {
  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container-site grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal className="order-2 lg:order-1">
          <span className="mb-6 inline-flex items-center gap-3 text-sm font-medium text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            درباره ما
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug text-primary">
            تولید برای زیرساختی که باید سال‌ها ماندگار باشد
          </h2>
          <p className="mt-6 text-base leading-8 text-secondary">
            {company.name} با تمرکز بر تولید تیرهای بتنی مورد استفاده در
            شبکه‌های برق، فعالیت خود را با هدف ارائه محصولاتی با کیفیت، دوام
            و قابلیت اطمینان بالا آغاز کرده است.
          </p>
          <p className="mt-4 text-base leading-8 text-secondary">
            ما تلاش می‌کنیم با بهره‌گیری از تجهیزات مناسب، مواد اولیه
            استاندارد و کنترل مستمر فرآیند تولید، محصولی متناسب با نیاز
            پروژه‌های عمرانی و شبکه‌های توزیع نیروی برق ارائه کنیم.
          </p>
          <LinkButton href="#about-company" variant="outline" className="mt-8">
            آشنایی بیشتر با شرکت
            <ChevronLeft size={18} aria-hidden="true" />
          </LinkButton>
        </Reveal>

        <Reveal delay={0.1} className="order-1 lg:order-2 relative corner-marks">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-black/5">
            <Image
              src="/images/about/about-factory.svg"
              alt="نمایی از کارخانه تولید تیرهای بتنی"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
