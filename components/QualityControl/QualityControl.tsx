import { FlaskConical, GaugeCircle, Ruler, BadgeCheck, type LucideIcon } from "lucide-react";
import { qualityFeatures } from "@/data/quality";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons: Record<string, LucideIcon> = {
  FlaskConical,
  GaugeCircle,
  Ruler,
  BadgeCheck,
};

export default function QualityControl() {
  return (
    <section className="py-20 lg:py-28 bg-bg">
      <div className="container-site">
        <SectionHeading
          eyebrow="کنترل کیفیت"
          title="کیفیت، از اولین مرحله تولید آغاز می‌شود"
          subtitle="کیفیت محصول نتیجه یک فرآیند مستمر است. در مراحل مختلف تولید، کنترل‌های لازم انجام می‌شود تا محصول نهایی مطابق مشخصات فنی تعیین‌شده آماده تحویل شود."
        />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {qualityFeatures.map((feature, index) => {
            const Icon = icons[feature.icon];
            return (
              <Reveal key={feature.id} delay={index * 0.08}>
                <div className="flex flex-col items-start gap-4 bg-white border border-black/5 p-6 rounded-sm h-full">
                  <span className="flex h-11 w-11 items-center justify-center rounded-sm border border-accent/30 text-accent">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <h3 className="text-sm font-bold text-primary leading-6">
                    {feature.title}
                  </h3>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
