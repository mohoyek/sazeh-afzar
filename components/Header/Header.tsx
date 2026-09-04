"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/data/navigation";
import { company } from "@/data/company";
import { LinkButton } from "@/components/ui/Button";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur shadow-[0_1px_0_0_rgba(23,33,43,0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex h-20 items-center justify-between py-4">
        <a
          href="#home"
          className="flex items-center gap-2 shrink-0"
          aria-label={`${company.name} — بازگشت به ابتدای صفحه`}
        >
          <Image
            src="/images/logos/logo-mark.svg"
            alt=""
            width={32}
            height={32}
            className={scrolled ? "text-primary" : "text-white"}
            style={{ color: scrolled ? "#17212B" : "#FFFFFF" }}
          />
          <span
            className={`text-lg font-bold whitespace-nowrap transition-colors ${
              scrolled ? "text-primary" : "text-white"
            }`}
          >
            {company.name}
          </span>
        </a>

        <nav
          className="hidden lg:flex items-center gap-8"
          aria-label="ناوبری اصلی"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                scrolled ? "text-primary" : "text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <LinkButton href="#contact" variant="primary">
            درخواست استعلام قیمت
          </LinkButton>
        </div>

        <button
          type="button"
          className={`lg:hidden p-2 -mr-2 ${scrolled ? "text-primary" : "text-white"}`}
          aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* منوی موبایل */}
      <div
        className={`lg:hidden fixed inset-0 top-0 bg-primary text-white transition-transform duration-300 ease-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="container-site flex h-20 items-center justify-between py-4">
          <span className="text-lg font-bold">{company.name}</span>
          <button
            type="button"
            className="p-2 -mr-2"
            aria-label="بستن منو"
            onClick={() => setMenuOpen(false)}
          >
            <X size={26} />
          </button>
        </div>
        <nav
          className="container-site flex flex-col gap-1 py-6"
          aria-label="ناوبری موبایل"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="py-4 text-lg font-medium border-b border-white/10"
            >
              {link.label}
            </a>
          ))}
          <LinkButton
            href="#contact"
            variant="primary"
            onClick={handleLinkClick}
            className="mt-6 w-full"
          >
            درخواست استعلام قیمت
          </LinkButton>
        </nav>
      </div>
    </header>
  );
}
