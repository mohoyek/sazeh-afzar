import Image from "next/image";
import { Phone, Smartphone, Mail, MapPin } from "lucide-react";
import { company } from "@/data/company";
import { navLinks } from "@/data/navigation";
import EmploymentModal from "@/components/Employment/EmploymentModal";

export default function Footer() {
  return (
    <footer className="bg-primary pt-16 pb-8">
      <div className="container-site">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logos/logo-mark.svg"
                alt=""
                width={28}
                height={28}
                style={{ color: "#FFFFFF" }}
              />
              <span className="text-base font-bold text-white">
                {company.name}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-white/55 max-w-xs">
              تولیدکننده انواع تیرهای بتنی مورد استفاده در شبکه‌های برق
            </p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">لینک‌های سریع</h3>
            <ul className="mt-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-white/55 hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <EmploymentModal />
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">تماس</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-white/55">
              <li className="flex items-center gap-2">
                <Phone size={15} className="text-accent shrink-0" aria-hidden="true" />
                <a href={`tel:${company.phone.office}`} dir="ltr">
                  {company.phone.officeDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone size={15} className="text-accent shrink-0" aria-hidden="true" />
                <a href={`tel:${company.phone.mobile}`} dir="ltr">
                  {company.phone.mobileDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={15} className="text-accent shrink-0" aria-hidden="true" />
                <a href={`mailto:${company.email}`} dir="ltr">
                  {company.email}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white">آدرس</h3>
            <ul className="mt-4 flex flex-col gap-4 text-sm text-white/55">
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <span>دفتر مرکزی: {company.address.headOffice}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={15} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <span>کارخانه: {company.address.factory}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            © {company.copyrightYear} تمامی حقوق این وب‌سایت متعلق به{" "}
            {company.name} است.
          </p>
        </div>
      </div>
    </footer>
  );
}
