"use client";

import React, { useState } from "react";
import { BRAND_CONFIG } from "@/lib/config/brand";

const ENQUIRY_TYPES = [
  "Order assistance",
  "Shipping and delivery",
  "Returns and exchanges",
  "Product questions",
  "General enquiries",
] as const;

type EnquiryType = (typeof ENQUIRY_TYPES)[number];

interface FormState {
  name: string;
  email: string;
  enquiryType: EnquiryType;
  orderNumber: string;
  message: string;
  honeypot: string; // Anti-spam hidden field
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  general?: string;
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    enquiryType: "Order assistance",
    orderNumber: "",
    message: "",
    honeypot: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverFeedback, setServerFeedback] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = "Please enter your full name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.message.trim() || form.message.trim().length < 10) {
      newErrors.message = "Please write a message of at least 10 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerFeedback(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success || !data.delivered) {
        setServerFeedback(
          data.error ||
            `Unable to dispatch your message. Please email ${BRAND_CONFIG.contact.officialBusinessEmail} directly.`
        );
        setIsSubmitting(false);
        return;
      }

      setIsSubmitted(true);
      setServerFeedback(data.message);
    } catch {
      setServerFeedback(
        `Network connection error. Please verify your connection or email ${BRAND_CONFIG.contact.officialBusinessEmail} directly.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      enquiryType: "Order assistance",
      orderNumber: "",
      message: "",
      honeypot: "",
    });
    setErrors({});
    setIsSubmitted(false);
    setServerFeedback(null);
  };

  if (isSubmitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-white/20 bg-white/[0.03] p-8 sm:p-12 md:p-16 backdrop-blur-sm"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-brand-blue">
          Message Delivered
        </span>
        <h3 className="mt-4 font-editorial text-4xl leading-tight tracking-[-0.03em] text-white sm:text-5xl">
          Thank you for reaching out.
        </h3>
        <p className="mt-6 max-w-lg text-xs leading-6 text-white/70 sm:text-sm sm:leading-7">
          {serverFeedback ||
            `Your message has been delivered to our team at ${BRAND_CONFIG.contact.officialBusinessEmail}.`}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex min-h-11 items-center justify-center border border-white/30 px-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Honeypot field (hidden from real users, catches spam bots) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website-hp">Website</label>
        <input
          type="text"
          id="website-hp"
          name="website_hp"
          tabIndex={-1}
          autoComplete="off"
          value={form.honeypot}
          onChange={(e) => setForm({ ...form, honeypot: e.target.value })}
        />
      </div>

      {serverFeedback && (
        <div
          role="alert"
          className="border border-red-500/30 bg-red-500/10 p-4 text-xs leading-5 text-red-200"
        >
          {serverFeedback}
        </div>
      )}

      {/* Full Name & Email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-name"
            className="block text-[10px] uppercase tracking-[0.22em] text-white/60"
          >
            Full Name <span className="text-brand-blue">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            autoComplete="name"
            value={form.name}
            onChange={(e) => {
              setForm({ ...form, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: undefined });
            }}
            placeholder="e.g. Aryan Malhotra"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="mt-2 min-h-12 w-full border-b border-white/25 bg-transparent px-0 text-sm text-white placeholder-white/20 transition-colors focus:border-white focus:outline-none"
          />
          {errors.name && (
            <p id="name-error" className="mt-2 text-[11px] text-red-400" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="block text-[10px] uppercase tracking-[0.22em] text-white/60"
          >
            Email Address <span className="text-brand-blue">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="you@domain.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="mt-2 min-h-12 w-full border-b border-white/25 bg-transparent px-0 text-sm text-white placeholder-white/20 transition-colors focus:border-white focus:outline-none"
          />
          {errors.email && (
            <p id="email-error" className="mt-2 text-[11px] text-red-400" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Enquiry Category & Order Number */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="contact-type"
            className="block text-[10px] uppercase tracking-[0.22em] text-white/60"
          >
            Enquiry Topic <span className="text-brand-blue">*</span>
          </label>
          <div className="relative mt-2">
            <select
              id="contact-type"
              value={form.enquiryType}
              onChange={(e) => setForm({ ...form, enquiryType: e.target.value as EnquiryType })}
              className="min-h-12 w-full appearance-none border-b border-white/25 bg-black pr-8 text-sm text-white transition-colors focus:border-white focus:outline-none cursor-pointer"
            >
              {ENQUIRY_TYPES.map((type) => (
                <option key={type} value={type} className="bg-black text-white py-2">
                  {type}
                </option>
              ))}
            </select>
            <div
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40"
              aria-hidden="true"
            >
              ▼
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-order"
            className="block text-[10px] uppercase tracking-[0.22em] text-white/60"
          >
            Order Number <span className="text-white/30">(Optional)</span>
          </label>
          <input
            id="contact-order"
            type="text"
            value={form.orderNumber}
            onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
            placeholder="e.g. WST-10842"
            className="mt-2 min-h-12 w-full border-b border-white/25 bg-transparent px-0 text-sm text-white placeholder-white/20 transition-colors focus:border-white focus:outline-none"
          />
        </div>
      </div>

      {/* Message Textarea */}
      <div>
        <div className="flex items-center justify-between">
          <label
            htmlFor="contact-message"
            className="block text-[10px] uppercase tracking-[0.22em] text-white/60"
          >
            Your Message <span className="text-brand-blue">*</span>
          </label>
          <span className="text-[10px] text-white/35">
            {form.message.length} / 3000
          </span>
        </div>
        <textarea
          id="contact-message"
          required
          rows={5}
          maxLength={3000}
          value={form.message}
          onChange={(e) => {
            setForm({ ...form, message: e.target.value });
            if (errors.message) setErrors({ ...errors, message: undefined });
          }}
          placeholder="Please describe your inquiry with as much detail as possible..."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className="mt-2 w-full border-b border-white/25 bg-transparent px-0 py-2 text-sm text-white placeholder-white/20 transition-colors focus:border-white focus:outline-none resize-none leading-relaxed"
        />
        {errors.message && (
          <p id="message-error" className="mt-2 text-[11px] text-red-400" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-14 w-full items-center justify-center bg-white px-8 text-[10px] font-semibold uppercase tracking-[0.25em] text-black transition-colors duration-300 hover:bg-brand-blue hover:text-white disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white"
        >
          {isSubmitting ? "Transmitting Inquiry..." : "Transmit Message"}
        </button>
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.16em] text-white/40">
          For direct business enquiries: {BRAND_CONFIG.contact.officialBusinessEmail}
        </p>
      </div>
    </form>
  );
}
