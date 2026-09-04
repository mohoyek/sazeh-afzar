"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2, Paperclip, Plus, X } from "lucide-react";

const DEGREES = ["زیر دیپلم", "دیپلم", "فوق دیپلم", "کاردانی", "کارشناسی", "کارشناسی ارشد", "دکتری"];
const INSURANCE_OPTIONS = ["ندارم", "کمتر از ۱ سال", "۱ سال", "۲ سال", "۳ سال", "۴ سال", "۵ سال", "۶ سال و بیشتر"];

const MONTHS: [string, string][] = [
  ["1", "فروردین"], ["2", "اردیبهشت"], ["3", "خرداد"], ["4", "تیر"],
  ["5", "مرداد"], ["6", "شهریور"], ["7", "مهر"], ["8", "آبان"],
  ["9", "آذر"], ["10", "دی"], ["11", "بهمن"], ["12", "اسفند"],
];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 76 }, (_, i) => String(1405 - i));
const FA_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const toFa = (value: string) => value.replace(/[0-9]/g, (d) => FA_DIGITS[Number(d)]);

interface ScalarValues {
  firstName: string;
  lastName: string;
  fatherName: string;
  insuranceYears: string;
  nationalId: string;
  degree: string;
  major: string;
  institution: string;
  gpa: string;
  mobile: string;
  landline: string;
  email: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
}

type WorkRow = Record<"c1" | "c2" | "c3" | "c4" | "c5" | "c6", string>;
type RefereeRow = Record<"c1" | "c2" | "c3" | "c4", string>;

const emptyWorkRow = (): WorkRow => ({ c1: "", c2: "", c3: "", c4: "", c5: "", c6: "" });
const emptyRefereeRow = (): RefereeRow => ({ c1: "", c2: "", c3: "", c4: "" });

const WORK_COLUMNS: [keyof WorkRow, string][] = [
  ["c1", "نام موسسه"], ["c2", "سمت"], ["c3", "تلفن"],
  ["c4", "تاریخ شروع"], ["c5", "تاریخ خاتمه"], ["c6", "علت ترک کار"],
];
const REFEREE_COLUMNS: [keyof RefereeRow, string][] = [
  ["c1", "نام و نام خانوادگی"], ["c2", "شغل"],
  ["c3", "نسبت و مدت آشنایی"], ["c4", "شماره تماس"],
];

const initialScalar: ScalarValues = {
  firstName: "", lastName: "", fatherName: "", insuranceYears: "ندارم",
  nationalId: "", degree: "کارشناسی", major: "", institution: "", gpa: "",
  mobile: "", landline: "", email: "", birthDay: "", birthMonth: "", birthYear: "",
};

type ScalarKey = keyof ScalarValues;
type FormErrors = Partial<Record<ScalarKey | "birth" | "resume", string>>;

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_EXTENSIONS = ["pdf", "doc", "docx", "rtf", "txt"];
const MAX_ROWS = 20;
function validate(v: ScalarValues, resume: File | null): FormErrors {
  const errors: FormErrors = {};
  if (!v.firstName.trim()) errors.firstName = "نام را وارد کنید.";
  if (!v.lastName.trim()) errors.lastName = "نام خانوادگی را وارد کنید.";
  if (!v.birthDay || !v.birthMonth || !v.birthYear) {
    errors.birth = "تاریخ تولد را کامل انتخاب کنید.";
  } else if (!/^[0-9]{4}$/.test(v.birthYear) || Number(v.birthYear) < 1300 || Number(v.birthYear) > 1405) {
    errors.birth = "سال تولد معتبر نیست.";
  }
  if (!v.degree) errors.degree = "مقطع تحصیلی را انتخاب کنید.";
  const degreeDetailsHidden = v.degree === "زیر دیپلم";
  if (!degreeDetailsHidden && !v.major.trim()) errors.major = "رشته تحصیلی را وارد کنید.";
  if (!degreeDetailsHidden && !v.institution.trim()) errors.institution = "موسسه آموزشی را وارد کنید.";
  if (!degreeDetailsHidden && !v.gpa.trim()) errors.gpa = "معدل را وارد کنید.";
  if (!v.mobile.trim() || !/^[0-9+\-\s()]{8,16}$/.test(v.mobile.trim())) {
    errors.mobile = "شماره موبایل معتبر وارد کنید.";
  }
  if (v.landline.trim() && !/^[0-9+\-\s()]{8,16}$/.test(v.landline.trim())) {
    errors.landline = "شماره ثابت معتبر وارد کنید.";
  }
  if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) {
    errors.email = "ایمیل معتبر وارد کنید.";
  }
  if (resume) {
    const ext = resume.name.slice(resume.name.lastIndexOf(".") + 1).toLowerCase();
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      errors.resume = "فرمت فایل رزومه باید PDF یا Word باشد.";
    } else if (resume.size > MAX_FILE_SIZE) {
      errors.resume = "حجم فایل رزومه نباید بیشتر از ۵ مگابایت باشد.";
    }
  }
  return errors;
}

function serializeRows(rows: Record<string, string>[]): Record<string, string>[] {
  return rows
    .map((row) =>
      Object.fromEntries(
        Object.entries(row).map(([k, val]) => [k, val.trim()])
      )
    )
    .filter((row) => Object.values(row).some((val) => val !== ""));
}

async function submitApplication(
  scalar: ScalarValues,
  workRows: Record<string, string>[],
  refereeRows: Record<string, string>[],
  resume: File | null
): Promise<{ ok: boolean; message?: string }> {
  const fd = new FormData();
  (Object.entries(scalar) as [string, string][]).forEach(([key, val]) =>
    fd.set(key, val.trim())
  );
  fd.set("workHistory", JSON.stringify(serializeRows(workRows)));
  fd.set("referees", JSON.stringify(serializeRows(refereeRows)));
  if (resume) fd.set("resume", resume);
  let response: Response;
  try {
    response = await fetch("/api/employment", { method: "POST", body: fd });
  } catch {
    return { ok: false, message: "ارتباط با سرور برقرار نشد؛ لطفاً دوباره تلاش کنید." };
  }
  const data = (await response.json().catch(() => null)) as
    | { ok?: boolean; message?: string }
    | null;
  if (!response.ok || !data?.ok) {
    return {
      ok: false,
      message: data?.message ?? "ارسال ناموفق بود؛ لطفاً دوباره تلاش کنید.",
    };
  }
  return { ok: true };
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", "٫")} مگابایت`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} کیلوبایت`;
}
import type { ReactNode } from "react";

const inputCls = (hasError?: string) =>
  `w-full rounded-sm border bg-white px-3 py-2 text-sm text-primary outline-none transition-colors focus:border-accent disabled:opacity-60 ${
    hasError ? "border-red-400" : "border-black/15"
  }`;

function RequiredStar() {
  return <span className="text-red-500">*</span>;
}

function SectionBox({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="overflow-hidden rounded-sm border border-black/10">
      <h4 className="bg-primary px-4 py-2.5 text-sm font-bold text-white">{title}</h4>
      <div className="bg-white p-4 sm:p-5">{children}</div>
    </section>
  );
}

interface FieldWrapProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}

function FieldWrap({ label, htmlFor, required, error, className = "", children }: FieldWrapProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-xs font-medium text-primary">
        {label} {required && <RequiredStar />}
      </label>
      {children}
      {error && (
        <span id={`${htmlFor}-error`} className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

export default function EmploymentModal() {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<ScalarValues>(initialScalar);
  const [workRows, setWorkRows] = useState<WorkRow[]>([emptyWorkRow()]);
  const [refereeRows, setRefereeRows] = useState<RefereeRow[]>([emptyRefereeRow()]);
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const close = () => {
    setOpen(false);
    setServerError(null);
    if (status !== "success") setStatus("idle");
  };

  useEffect(() => {
    if (open) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      const frame = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => {
        cancelAnimationFrame(frame);
        document.body.style.overflow = "";
        lastFocusedRef.current?.focus();
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setServerError(null);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);
  const clearError = (field: keyof FormErrors) =>
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));

  const handleScalar =
    (field: ScalarKey) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      clearError(field);
    };

  const handleWorkRow =
    (rowIndex: number, column: keyof WorkRow) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setWorkRows((prev) =>
        prev.map((row, i) =>
          i === rowIndex ? { ...row, [column]: e.target.value } : row
        )
      );
    };

  const handleRefereeRow =
    (rowIndex: number, column: keyof RefereeRow) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      setRefereeRows((prev) =>
        prev.map((row, i) =>
          i === rowIndex ? { ...row, [column]: e.target.value } : row
        )
      );
    };

  const addWorkRow = () =>
    setWorkRows((prev) =>
      prev.length < MAX_ROWS ? [...prev, emptyWorkRow()] : prev
    );
  const removeWorkRow = (rowIndex: number) =>
    setWorkRows((prev) => prev.filter((_, i) => i !== rowIndex));
  const addRefereeRow = () =>
    setRefereeRows((prev) =>
      prev.length < MAX_ROWS ? [...prev, emptyRefereeRow()] : prev
    );
  const removeRefereeRow = (rowIndex: number) =>
    setRefereeRows((prev) => prev.filter((_, i) => i !== rowIndex));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setResume(e.target.files?.[0] ?? null);
    clearError("resume");
  };

  const removeFile = () => {
    setResume(null);
    clearError("resume");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values, resume);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setServerError(null);
    setStatus("submitting");
    const result = await submitApplication(
      values,
      workRows,
      refereeRows,
      resume
    );
    if (result.ok) {
      setStatus("success");
      setValues(initialScalar);
      setWorkRows([emptyWorkRow()]);
      setRefereeRows([emptyRefereeRow()]);
      setResume(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      setStatus("idle");
      setServerError(result.message ?? "ارسال ناموفق بود؛ لطفاً دوباره تلاش کنید.");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setServerError(null);
    setErrors({});
  };
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="bg-transparent border-0 p-0 text-sm text-white/55 hover:text-accent transition-colors cursor-pointer font-normal"
      >
        فرصت‌های شغلی
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-0 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="employment-modal-title"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-primary/70 backdrop-blur-sm"
              onClick={close}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full sm:max-w-3xl max-h-[94vh] overflow-y-auto bg-bg rounded-t-sm sm:rounded-sm"
            >
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 bg-white px-6 py-4 sm:px-8 border-b border-black/5">
                <div>
                  <p className="text-xs font-bold text-accent">استخدام</p>
                  <h3
                    id="employment-modal-title"
                    className="mt-0.5 text-xl sm:text-2xl font-bold text-primary"
                  >
                    سامانه متقاضیان استخدام
                  </h3>
                  <p className="mt-0.5 text-sm text-concrete">
                    سازه افزار فتح — فرم تکمیل درخواست همکاری
                  </p>
                </div>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={close}
                  aria-label="بستن پنجره"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-concrete transition-colors hover:bg-black/5 hover:text-primary"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {status === "success" ? (
                <div
                  role="status"
                  className="flex flex-col items-center justify-center text-center gap-4 p-8 sm:p-12 min-h-[380px] bg-white"
                >
                  <CheckCircle2 className="text-accent" size={48} aria-hidden="true" />
                  <h4 className="text-lg font-bold text-primary">
                    درخواست شما ثبت شد
                  </h4>
                  <p className="text-sm leading-7 text-secondary max-w-sm">
                    اطلاعات شما دریافت شد؛ کارشناسان ما پس از بررسی با شما تماس
                    می‌گیرند.
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent/90"
                    >
                      ثبت درخواست جدید
                    </button>
                    <button
                      type="button"
                      onClick={close}
                      className="rounded-sm border border-black/10 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:border-primary"
                    >
                      بستن
                    </button>
                  </div>
                </div>
              ) : (
                <form
                  noValidate
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 p-4 sm:p-6"
                >
                  {serverError && (
                    <div
                      role="alert"
                      className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                    >
                      {serverError}
                    </div>
                  )}

                  <SectionBox title="مشخصات فردی">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FieldWrap label="نام" htmlFor="emp-firstName" required error={errors.firstName}>
                        <input
                          id="emp-firstName"
                          type="text"
                          autoComplete="given-name"
                          value={values.firstName}
                          onChange={handleScalar("firstName")}
                          aria-invalid={Boolean(errors.firstName)}
                          className={inputCls(errors.firstName)}
                        />
                      </FieldWrap>
                      <FieldWrap label="نام خانوادگی" htmlFor="emp-lastName" required error={errors.lastName}>
                        <input
                          id="emp-lastName"
                          type="text"
                          autoComplete="family-name"
                          value={values.lastName}
                          onChange={handleScalar("lastName")}
                          aria-invalid={Boolean(errors.lastName)}
                          className={inputCls(errors.lastName)}
                        />
                      </FieldWrap>
                      <FieldWrap label="نام پدر" htmlFor="emp-fatherName">
                        <input
                          id="emp-fatherName"
                          type="text"
                          value={values.fatherName}
                          onChange={handleScalar("fatherName")}
                          className={inputCls()}
                        />
                      </FieldWrap>

                      <FieldWrap label="تعداد سال سابقه بیمه" htmlFor="emp-insurance">
                        <select
                          id="emp-insurance"
                          value={values.insuranceYears}
                          onChange={handleScalar("insuranceYears")}
                          className={inputCls()}
                        >
                          {INSURANCE_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </FieldWrap>
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <label htmlFor="emp-birthDay" className="text-xs font-medium text-primary">
                          تاریخ تولد <RequiredStar />
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <select
                            id="emp-birthDay"
                            value={values.birthDay}
                            onChange={handleScalar("birthDay")}
                            aria-label="روز تولد"
                            className={inputCls(errors.birth)}
                          >
                            <option value="" disabled>روز</option>
                            {DAYS.map((d) => (
                              <option key={d} value={d}>{toFa(d)}</option>
                            ))}
                          </select>
                          <select
                            value={values.birthMonth}
                            onChange={handleScalar("birthMonth")}
                            aria-label="ماه تولد"
                            className={inputCls(errors.birth)}
                          >
                            <option value="" disabled>ماه</option>
                            {MONTHS.map(([v, name]) => (
                              <option key={v} value={v}>{name}</option>
                            ))}
                          </select>
                          <select
                            value={values.birthYear}
                            onChange={handleScalar("birthYear")}
                            aria-label="سال تولد"
                            className={inputCls(errors.birth)}
                          >
                            <option value="" disabled>سال</option>
                            {YEARS.map((y) => (
                              <option key={y} value={y}>{toFa(y)}</option>
                            ))}
                          </select>
                        </div>
                        {errors.birth && (
                          <span className="text-xs text-red-500">{errors.birth}</span>
                        )}
                      </div>
                      <FieldWrap label="کد ملی" htmlFor="emp-nationalId">
                        <input
                          id="emp-nationalId"
                          type="text"
                          dir="ltr"
                          inputMode="numeric"
                          value={values.nationalId}
                          onChange={handleScalar("nationalId")}
                          placeholder="مثلاً 0012345678"
                          className={`${inputCls()} text-left`}
                        />
                      </FieldWrap>
                    </div>

                    <div className="mt-4">
                      <FieldWrap label="مقطع تحصیلی" htmlFor="emp-degree" required error={errors.degree}>
                        <select
                          id="emp-degree"
                          value={values.degree}
                          onChange={handleScalar("degree")}
                          aria-invalid={Boolean(errors.degree)}
                          className={inputCls(errors.degree)}
                        >
                          {DEGREES.map((d) => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                      </FieldWrap>
                    </div>
                  </SectionBox>

                  {values.degree !== "زیر دیپلم" && (
                  <SectionBox title={`مقطع تحصیلی (${values.degree})`}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FieldWrap label="رشته تحصیلی" htmlFor="emp-major" required error={errors.major}>
                        <input
                          id="emp-major"
                          type="text"
                          value={values.major}
                          onChange={handleScalar("major")}
                          placeholder="مثلاً مهندسی عمران"
                          className={inputCls(errors.major)}
                        />
                      </FieldWrap>
                      <FieldWrap label="موسسه آموزشی" htmlFor="emp-institution" required error={errors.institution}>
                        <input
                          id="emp-institution"
                          type="text"
                          value={values.institution}
                          onChange={handleScalar("institution")}
                          placeholder="نام دانشگاه یا موسسه"
                          className={inputCls(errors.institution)}
                        />
                      </FieldWrap>
                      <FieldWrap label="معدل" htmlFor="emp-gpa" required error={errors.gpa}>
                        <input
                          id="emp-gpa"
                          type="text"
                          inputMode="decimal"
                          value={values.gpa}
                          onChange={handleScalar("gpa")}
                          placeholder="مثلاً ۱۷٫۵"
                          className={inputCls(errors.gpa)}
                        />
                      </FieldWrap>
                    </div>
                  </SectionBox>
                  )}

                  <SectionBox title="اطلاعات تماس">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FieldWrap label="موبایل" htmlFor="emp-mobile" required error={errors.mobile}>
                        <input
                          id="emp-mobile"
                          type="tel"
                          dir="ltr"
                          autoComplete="tel"
                          value={values.mobile}
                          onChange={handleScalar("mobile")}
                          placeholder="مثلاً 09123456789"
                          className={`${inputCls(errors.mobile)} text-left`}
                        />
                      </FieldWrap>
                      <FieldWrap label="شماره ثابت" htmlFor="emp-landline" error={errors.landline}>
                        <input
                          id="emp-landline"
                          type="tel"
                          dir="ltr"
                          autoComplete="tel-national"
                          value={values.landline}
                          onChange={handleScalar("landline")}
                          placeholder="مثلاً 06142249855"
                          className={`${inputCls(errors.landline)} text-left`}
                        />
                      </FieldWrap>
                      <FieldWrap label="ایمیل" htmlFor="emp-email" error={errors.email}>
                        <input
                          id="emp-email"
                          type="email"
                          dir="ltr"
                          autoComplete="email"
                          value={values.email}
                          onChange={handleScalar("email")}
                          placeholder="you@example.com"
                          className={`${inputCls(errors.email)} text-left`}
                        />
                      </FieldWrap>
                    </div>
                  </SectionBox>

                  <SectionBox title="سوابق کار">
                    {workRows.map((row, i) => (
                      <div key={i} className="mb-3 rounded-sm border border-black/10 bg-bg/70 p-3 last:mb-0">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-concrete">
                            ردیف {toFa(String(i + 1))}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeWorkRow(i)}
                            aria-label={`حذف ردیف ${i + 1}`}
                            className="flex h-6 w-6 items-center justify-center rounded-sm text-concrete transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={14} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                          {WORK_COLUMNS.map(([column, label]) => (
                            <input
                              key={column}
                              type="text"
                              aria-label={`${label} — ردیف ${i + 1}`}
                              value={row[column]}
                              onChange={handleWorkRow(i, column)}
                              placeholder={label}
                              className={inputCls()}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    {workRows.length < MAX_ROWS && (
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={addWorkRow}
                          aria-label="افزودن ردیف سابقه کار"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-sm transition-colors hover:bg-green-700"
                        >
                          <Plus size={18} aria-hidden="true" />
                        </button>
                        <p className="text-xs text-rose-500">
                          جهت افزودن ردیف، دکمه + را کلیک کنید
                        </p>
                      </div>
                    )}
                  </SectionBox>
                  <SectionBox title="معرفین">
                    <p className="mb-3 text-xs leading-6 text-secondary">
                      اگرچه ملاک استخدام بر اساس قابلیت‌ها، توانایی‌ها و مهارت‌های
                      متقاضی است، توصیه می‌شود معرف معتبر و مورد وثوق ارائه دهید.
                    </p>
                    {refereeRows.map((row, i) => (
                      <div key={i} className="mb-3 rounded-sm border border-black/10 bg-bg/70 p-3 last:mb-0">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-bold text-concrete">
                            معرف {toFa(String(i + 1))}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeRefereeRow(i)}
                            aria-label={`حذف معرف ${i + 1}`}
                            className="flex h-6 w-6 items-center justify-center rounded-sm text-concrete transition-colors hover:bg-red-50 hover:text-red-500"
                          >
                            <X size={14} aria-hidden="true" />
                          </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {REFEREE_COLUMNS.map(([column, label]) => (
                            <input
                              key={column}
                              type="text"
                              aria-label={`${label} — معرف ${i + 1}`}
                              value={row[column]}
                              onChange={handleRefereeRow(i, column)}
                              placeholder={label}
                              className={inputCls()}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    {refereeRows.length < MAX_ROWS && (
                      <div className="mt-3 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={addRefereeRow}
                          aria-label="افزودن معرف"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-sm transition-colors hover:bg-green-700"
                        >
                          <Plus size={18} aria-hidden="true" />
                        </button>
                        <p className="text-xs text-green-700">
                          جهت افزودن ردیف، دکمه + را کلیک کنید
                        </p>
                      </div>
                    )}
                  </SectionBox>
                  <SectionBox title="پیوست رزومه (اختیاری)">
                    <input
                      ref={fileInputRef}
                      id="emp-resume"
                      type="file"
                      accept=".pdf,.doc,.docx,.rtf,.txt"
                      onChange={handleFileChange}
                      className="sr-only"
                      aria-describedby={errors.resume ? "emp-resume-error" : undefined}
                    />
                    {resume ? (
                      <div className="flex items-center justify-between gap-3 rounded-sm border border-black/10 bg-white px-4 py-3">
                        <span className="flex min-w-0 items-center gap-3">
                          <FileText className="shrink-0 text-accent" size={18} aria-hidden="true" />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-primary" dir="ltr">
                              {resume.name}
                            </span>
                            <span className="block text-xs text-concrete">
                              {formatFileSize(resume.size)}
                            </span>
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="shrink-0 rounded-sm text-xs font-semibold text-red-500 transition-colors hover:text-red-600"
                        >
                          حذف فایل
                        </button>
                      </div>
                    ) : (
                      <label
                        htmlFor="emp-resume"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-sm border border-dashed border-black/20 px-4 py-4 text-sm text-concrete transition-colors hover:border-accent hover:text-primary"
                      >
                        <Paperclip size={16} aria-hidden="true" />
                        انتخاب فایل رزومه (PDF یا Word، حداکثر ۵ مگابایت)
                      </label>
                    )}
                    {errors.resume && (
                      <span id="emp-resume-error" className="mt-1.5 block text-xs text-red-500">
                        {errors.resume}
                      </span>
                    )}
                  </SectionBox>

                  <div className="flex flex-col items-start gap-2 text-left">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className="inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-8 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent/90 disabled:opacity-70"
                    >
                      {status === "submitting" && (
                        <Loader2 className="animate-spin" size={16} aria-hidden="true" />
                      )}
                      ثبت اطلاعات
                    </button>
                    <p className="text-xs leading-6 text-concrete">
                      اطلاعات ارسالی شما تنها برای بررسی درخواست همکاری استفاده
                      می‌شود و نزد ما محرمانه باقی می‌ماند.
                    </p>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
