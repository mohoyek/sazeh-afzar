import { stats } from "@/data/stats";
import Reveal from "@/components/ui/Reveal";
import Counter from "./Counter";

export default function Stats() {
  return (
    <section className="relative bg-primary py-14" aria-label="آمار شرکت">
      <div className="container-site">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.id}
              delay={index * 0.08}
              className="flex flex-col items-center text-center px-2 border-e border-white/10 last:border-e-0"
            >
              <span className="text-3xl md:text-4xl font-black text-accent tabular-nums">
                <Counter value={stat.value} suffix={stat.suffix} />
              </span>
              <span className="mt-2 text-sm md:text-base font-medium text-white/70">
                {stat.label}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
