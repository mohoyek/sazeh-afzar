import { Factory, Truck, Settings2, MessageSquareText, type LucideIcon } from "lucide-react";
import { services } from "@/data/services";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

const icons: Record<string, LucideIcon> = {
  Factory,
  Truck,
  Settings2,
  MessageSquareText,
};

export default function Services() {
  return (
    <section id="services" className="py-20 lg:py-28 bg-white scroll-mt-20">
      <div className="container-site">
        <SectionHeading eyebrow="خدمات" title="خدمات ما" />

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = icons[service.icon];
            return (
              <Reveal key={service.id} delay={index * 0.08}>
                <div className="corner-marks h-full border border-black/5 bg-bg p-7 rounded-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-primary text-accent">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-primary">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-secondary">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
