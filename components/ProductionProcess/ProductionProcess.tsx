import {
  PackageSearch,
  GitCommitVertical,
  Layers,
  Waves,
  ThermometerSun,
  ClipboardCheck,
  type LucideIcon,
} from "lucide-react";
import { processSteps } from "@/data/process";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons: Record<string, LucideIcon> = {
  PackageSearch,
  GitCommitVertical,
  Layers,
  Waves,
  ThermometerSun,
  ClipboardCheck,
};

export default function ProductionProcess() {
  return (
    <section className="py-20 lg:py-28 bg-primary overflow-hidden">
      <div className="container-site">
        <SectionHeading
          eyebrow="فرآیند تولید"
          title="از مواد اولیه تا محصول نهایی"
          dark
        />

        {/* دسکتاپ: Timeline افقی */}
        <div className="mt-16 hidden lg:block">
          <div className="relative">
            <div
              className="absolute top-6 right-0 left-0 h-px bg-white/15"
              aria-hidden="true"
            />
            <div className="grid grid-cols-6 gap-4">
              {processSteps.map((step, index) => {
                const Icon = icons[step.icon];
                return (
                  <Reveal key={step.id} delay={index * 0.08} className="relative flex flex-col items-center text-center">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-primary border border-accent text-accent">
                      <Icon size={20} aria-hidden="true" />
                    </span>
                    <span className="mt-4 text-xs font-bold text-accent tracking-wide">
                      {step.number}
                    </span>
                    <h3 className="mt-2 text-sm font-bold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-white/55">
                      {step.description}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>

        {/* موبایل/تبلت: Timeline عمودی */}
        <div className="mt-12 lg:hidden">
          <div className="relative flex flex-col gap-8 border-r border-white/15 pr-6">
            {processSteps.map((step, index) => {
              const Icon = icons[step.icon];
              return (
                <Reveal key={step.id} delay={index * 0.05} className="relative">
                  <span className="absolute -right-[31px] top-0 flex h-9 w-9 items-center justify-center rounded-full bg-primary border border-accent text-accent">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold text-accent tracking-wide">
                    {step.number}
                  </span>
                  <h3 className="mt-1 text-base font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-7 text-white/55">
                    {step.description}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
