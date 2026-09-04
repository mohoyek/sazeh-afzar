"use client";

import { useState, type FormEvent } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/colors/yellow.css";

interface FormValues {
  requester: string;
  contactChannel: string;
  quantity: string;
  poleHeight: string;
  projectLocation: string;
  deliveryDate: string;
  urgentDelivery: boolean;
}

const initialValues: FormValues = {
  requester: "",
  contactChannel: "",
  quantity: "",
  poleHeight: "",
  projectLocation: "",
  deliveryDate: "",
  urgentDelivery: false,
};

const CONTACT_CHANNELS = [
  { value: "bale", label: "بله" },
  { value: "rubika", label: "روبیکا" },
  { value: "eitaa", label: "ایتا" },
  { value: "whatsapp", label: "واتس‌آپ" },
  { value: "telegram", label: "تلگرام" },
  { value: "sms", label: "SMS" },
] as const;

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.requester.trim()) {
    errors.requester = "نام شخص یا شرکت را وارد کنید.";
  }

  if (!values.contactChannel) {
    errors.contactChannel = "راه ارتباطی را انتخاب کنید.";
  }

  if (!values.quantity.trim()) {
    errors.quantity = "تعداد مورد نیاز را وارد کنید.";
  } else if (!/^\d+$/.test(values.quantity.trim()) || Number(values.quantity) < 1) {
    errors.quantity = "تعداد معتبر وارد کنید.";
  }

  if (!values.poleHeight.trim()) {
    errors.poleHeight = "ارتفاع مورد نظر را وارد کنید.";
  } else if (!/^\d+(\.\d+)?$/.test(values.poleHeight.trim())) {
    errors.poleHeight = "ارتفاع معتبر وارد کنید.";
  }

  if (!values.projectLocation.trim()) {
    errors.projectLocation = "استان و شهر پروژه را وارد کنید.";
  }

  if (!values.urgentDelivery && !values.deliveryDate) {
    errors.deliveryDate =
      "تاریخ تحویل را انتخاب کنید یا «تحویل فوری» را تیک بزنید.";
  }

  return errors;
}

// ساختار آماده برای اتصال به API واقعی در آینده:
// این تابع فقط جای‌گذاری می‌شود و باید با فراخوانی API واقعی جایگزین شود.
async function submitContactForm(values: FormValues): Promise<{ ok: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  // TODO: جایگزینی با fetch("/api/contact", { method: "POST", body: JSON.stringify(values) })
  console.log("Contact form submission (placeholder):", values);
  return { ok: true };
}

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const clearError = (field: keyof FormValues) =>
    setErrors((prev) =>
      prev[field] ? { ...prev, [field]: undefined } : prev
    );

  const handleChange =
    (field: keyof FormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
      clearError(field);
    };

  const handleUrgentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, urgentDelivery: e.target.checked }));
    clearError("deliveryDate");
  };

  // تاریخ به‌صورت ISO میلادی ذخیره می‌شود (مطابق انتظار API) ولی در تقویم شمسی نمایش داده می‌شود.
  const handleDateChange = (value: string) => {
    setValues((prev) => ({ ...prev, deliveryDate: value }));
    clearError("deliveryDate");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    const result = await submitContactForm(values);
    if (result.ok) {
      setStatus("success");
      setValues(initialValues);
    } else {
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center text-center gap-4 h-full min-h-[320px] bg-white border border-black/5 rounded-sm p-8"
      >
        <CheckCircle2 className="text-accent" size={40} aria-hidden="true" />
        <h3 className="text-lg font-bold text-primary">
          درخواست شما ثبت شد
        </h3>
        <p className="text-sm text-secondary max-w-xs">
          کارشناسان ما در اسرع وقت با شما در ارتباط خواهند بود.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 text-sm font-semibold text-accent hover:underline"
        >
          ارسال درخواست جدید
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 bg-white border border-black/5 rounded-sm p-6 sm:p-8"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="نام شخص / شرکت"
          name="requester"
          value={values.requester}
          onChange={handleChange("requester")}
          error={errors.requester}
          autoComplete="name"
        />
        <SelectField
          label="راه ارتباطی"
          name="contactChannel"
          value={values.contactChannel}
          onChange={handleChange("contactChannel")}
          error={errors.contactChannel}
          options={CONTACT_CHANNELS}
          placeholder="راه ارتباطی را انتخاب کنید"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="تعداد مورد نیاز"
          name="quantity"
          type="number"
          inputMode="numeric"
          value={values.quantity}
          onChange={handleChange("quantity")}
          error={errors.quantity}
          placeholder="مثلاً ۵۰"
        />
        <Field
          label="ارتفاع مد نظر (متر)"
          name="poleHeight"
          type="number"
          inputMode="decimal"
          value={values.poleHeight}
          onChange={handleChange("poleHeight")}
          error={errors.poleHeight}
          placeholder="مثلاً ۱۲"
        />
      </div>

      <Field
        label="استان و شهر پروژه"
        name="projectLocation"
        value={values.projectLocation}
        onChange={handleChange("projectLocation")}
        error={errors.projectLocation}
        placeholder="مثلاً خوزستان، اندیمشک"
      />

      <div className="grid sm:grid-cols-2 gap-5 items-end">
        <JalaliDateField
          label="تاریخ تحویل"
          value={values.deliveryDate}
          onChange={handleDateChange}
          error={errors.deliveryDate}
          disabled={values.urgentDelivery}
        />
        <label
          htmlFor="urgentDelivery"
          className={`flex items-center gap-3 rounded-sm border px-4 py-3 cursor-pointer transition-colors ${
            values.urgentDelivery
              ? "border-accent bg-accent/5"
              : "border-black/10 bg-white"
          }`}
        >
          <input
            id="urgentDelivery"
            type="checkbox"
            checked={values.urgentDelivery}
            onChange={handleUrgentChange}
            className="h-5 w-5 accent-[#e5a623]"
          />
          <span className="text-sm font-medium text-primary">
            تحویل فوری
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-accent px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-accent/90 disabled:opacity-70"
      >
        {status === "submitting" && (
          <Loader2 className="animate-spin" size={16} aria-hidden="true" />
        )}
        ارسال درخواست
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  name: keyof FormValues;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: "text" | "number" | "date";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  disabled?: boolean;
}

function Field({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  disabled,
}: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-primary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-sm border bg-white px-4 py-3 text-sm text-primary outline-none transition-colors focus:border-accent disabled:opacity-60 ${
          error ? "border-red-400" : "border-black/10"
        }`}
      />
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

interface JalaliDateFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

function JalaliDateField({
  label,
  value,
  onChange,
  error,
  disabled,
}: JalaliDateFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="deliveryDate" className="text-sm font-medium text-primary">
        {label}
      </label>
      <DatePicker
        id="deliveryDate"
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        disabled={disabled}
        format="YYYY/MM/DD"
        value={value ? new DateObject(value).convert(persian) : undefined}
        onChange={(date) =>
          onChange(date ? date.toDate().toISOString().slice(0, 10) : "")
        }
        inputClass={`w-full rounded-sm border bg-white px-4 py-3 text-sm text-primary outline-none transition-colors focus:border-accent disabled:opacity-60 ${
          error ? "border-red-400" : "border-black/10"
        }`}
      />
      {error && (
        <span id="deliveryDate-error" className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: keyof FormValues;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  error,
}: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium text-primary">
        {label}
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`w-full rounded-sm border bg-white px-4 py-3 text-sm text-primary outline-none transition-colors focus:border-accent ${
          error ? "border-red-400" : "border-black/10"
        }`}
      >
        <option value="" disabled>
          {placeholder ?? "انتخاب کنید"}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${name}-error`} className="text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}