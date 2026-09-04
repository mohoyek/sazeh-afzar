import Image from "next/image";
import { Phone } from "lucide-react";
import { company } from "@/data/company";
import Reveal from "@/components/ui/Reveal";
import { LinkButton } from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="relative py-24 lg:py-32 bg-primary overflow-hidden">
      <Image
        src="/images/hero/cta-background.svg"
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-primary/80" aria-hidden="true" />

      <div className="container-site relative z-10">
        <Reveal className="max-w-2xl mx-auto text-center flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-snug text-white">
            پروژه بعدی شما از همین‌جا شروع می‌شود
          </h2>
          <p className="mt-5 text-base md:text-lg leading-8 text-white/70">
            برای دریافت اطلاعات فنی، کاتالوگ محصولات یا استعلام قیمت با
            کارشناسان ما در ارتباط باشید.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <LinkButton href="#contact" variant="primary">
              درخواست استعلام قیمت
            </LinkButton>
            <LinkButton
              href={`tel:${company.phone.mobile}`}
              variant="outline-light"
            >
              <Phone size={18} aria-hidden="true" />
              تماس با کارشناسان
            </LinkButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
