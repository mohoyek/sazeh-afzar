"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[85vh] lg:min-h-[90vh] items-center overflow-hidden bg-primary"
    >
      <Image
        src="/images/hero/hero-factory.svg"
        alt="خط تولید تیرهای بتنی برق در کارخانه"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary via-primary/85 to-primary/55"
        aria-hidden="true"
      />
      <div className="absolute inset-0 technical-grid opacity-40" aria-hidden="true" />

      <div className="container-site relative z-10 pt-28 pb-16 lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <span className="mb-6 inline-flex items-center gap-3 text-sm font-medium text-accent">
            <span className="h-px w-8 bg-accent" aria-hidden="true" />
            زیرساخت شبکه‌های برق کشور
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] text-white">
            تولیدکننده تخصصی
            <br />
            تیرهای بتنی برق
          </h1>

          <p className="mt-6 text-lg lg:text-xl font-medium text-white/90">
            کیفیت پایدار، تولید استاندارد و تأمین مطمئن برای زیرساخت شبکه‌های
            برق
          </p>

          <p className="mt-4 max-w-xl text-base leading-8 text-white/65">
            با تکیه بر تجربه، دانش فنی و فرآیندهای کنترل کیفیت، انواع تیرهای
            بتنی مورد استفاده در شبکه‌های توزیع نیروی برق را تولید و عرضه
            می‌کنیم.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <LinkButton href="#products" variant="primary">
              مشاهده محصولات
              <ChevronLeft size={18} aria-hidden="true" />
            </LinkButton>
            <LinkButton href="#contact" variant="outline-light">
              درخواست استعلام قیمت
              <ArrowLeft size={18} aria-hidden="true" />
            </LinkButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
