"use client";

import { MessageCircle, Phone } from "lucide-react";
import { company } from "@/data/company";

export default function FloatingContact() {
  return (
    <div className="lg:hidden fixed bottom-5 left-5 z-40 flex flex-col gap-3">
      {company.whatsapp.enabled && (
        <a
          href={`https://wa.me/${company.whatsapp.number}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="ارتباط از طریق واتساپ"
          className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
        >
          <MessageCircle size={24} aria-hidden="true" />
        </a>
      )}
      <a
        href={`tel:${company.phone.mobile}`}
        aria-label="تماس تلفنی"
        className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-primary shadow-lg shadow-black/20"
      >
        <Phone size={22} aria-hidden="true" />
      </a>
    </div>
  );
}
