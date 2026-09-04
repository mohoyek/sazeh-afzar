import { ShieldCheck, History, Factory, Clock, Wrench, Headset, type LucideIcon } from "lucide-react";
import { whyUsFeatures } from "@/data/quality";
import { company } from "@/data/company";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons: Record<string, LucideIcon> = {
  ShieldCheck,
  History,
  Factory,
  Clock,
  Wrench,
  Headset,
};

export default function WhyUs() {
  return (
    <section className="py-20 lg:py-28 bg-bg">
      <div className="container-site">
        <SectionHeading eyebrow="چرا ما" title={`چرا ${company.name}؟`} />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyUsFeatures.map((feature, index) => {
            const Icon = icons[feature.icon];
            return (
              <Reveal key={feature.id} delay={index * 0.06}>
                <div className="flex items-start gap-4 bg-white border border-black/5 p-6 rounded-sm h-full">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-primary text-accent">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-primary">
                      {feature.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-secondary">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
