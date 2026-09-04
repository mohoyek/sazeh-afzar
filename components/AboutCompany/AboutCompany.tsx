import Image from "next/image";
import { company } from "@/data/company";
import Reveal from "@/components/ui/Reveal";

export default function AboutCompany() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-primary scroll-mt-20 overflow-hidden">
      <div className="container-site grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <span className="mb-6 inline-flex items-center gap-3 text-sm font-medium text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            درباره شرکت
          </span>
          <h2 className="text-3xl md:text-4xl font-bold leading-snug text-white">
            ما فقط تولیدکننده نیستیم؛ بخشی از زنجیره زیرساخت انرژی هستیم.
          </h2>
          <p className="mt-6 text-base leading-8 text-white/65">
            {company.name} با هدف حضور مؤثر در صنعت تولید تجهیزات مورد
            استفاده در شبکه‌های برق، فعالیت خود را بر پایه کیفیت، تعهد و
            پاسخگویی بنا کرده است.
          </p>
          <p className="mt-4 text-base leading-8 text-white/65">
            تمرکز ما بر تولید محصول قابل اعتماد، تحویل به‌موقع و ایجاد
            همکاری بلندمدت با مشتریان و پیمانکاران است.
          </p>
        </Reveal>

        <Reveal delay={0.1} id="about-company" className="relative corner-marks scroll-mt-24">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-white/10">
            <Image
              src="/images/about/about-company.svg"
              alt="تیم تولید سازه افزار فتح"
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
