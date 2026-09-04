"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

function toPersianDigits(value: number): string {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return value
    .toLocaleString("en-US")
    .replace(/[0-9]/g, (digit) => persianDigits[Number(digit)]);
}

interface CounterProps {
  value: number;
  suffix: string;
  duration?: number;
}

export default function Counter({ value, suffix, duration = 1600 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    if (prefersReducedMotion) {
      const frame = requestAnimationFrame(() => setDisplayValue(value));
      return () => cancelAnimationFrame(frame);
    }

    let start: number | null = null;
    let frame: number;

    const step = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * value));
      if (progress < 1) {
        frame = requestAnimationFrame(step);
      }
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value, duration, prefersReducedMotion]);

  return (
    <span ref={ref} aria-label={`${toPersianDigits(value)}${suffix}`}>
      {toPersianDigits(displayValue)}
      {suffix}
    </span>
  );
}
