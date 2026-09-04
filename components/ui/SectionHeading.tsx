import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "right" | "center";
  dark?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "right",
  dark = false,
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center items-center mx-auto" : "text-right items-start";

  return (
    <Reveal className={`flex flex-col gap-4 max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <span
          className={`flex items-center gap-3 text-sm font-medium tracking-wide ${
            dark ? "text-accent" : "text-accent"
          }`}
        >
          <span className="h-px w-8 bg-accent" aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-3xl md:text-4xl font-bold leading-snug ${
          dark ? "text-white" : "text-primary"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg leading-relaxed ${
            dark ? "text-white/70" : "text-secondary"
          }`}
        >
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
