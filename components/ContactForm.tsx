"use client";

import { useState, FormEvent } from "react";
import { trackEvent } from "./FacebookPixel";

interface ContactFormProps {
  headline?: string;
  subheadline?: string;
  ctaText?: string;
  source?: string; // tracking source
}

export default function ContactForm({
  headline = "Dołącz do MasterZone",
  subheadline = "Podaj swoje dane, a za chwilę przekierujemy Cię do społeczności",
  ctaText = "Dołącz teraz",
  source = "contact_form"
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    rodoConsent: false
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate RODO consent
    if (!formData.rodoConsent) {
      setStatus("error");
      setErrorMessage("Musisz zaakceptować zgodę na przetwarzanie danych osobowych.");
      return;
    }

    setStatus("loading");

    try {
      // Track event
      trackEvent("Lead", {
        source: source,
        firstName: formData.firstName,
        email: formData.email
      });

      // Call API endpoint to add to MailerLite
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          email: formData.email,
          source: source,
          // Get UTM params from URL
          utm: {
            source: new URLSearchParams(window.location.search).get("utm_source"),
            medium: new URLSearchParams(window.location.search).get("utm_medium"),
            campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
          }
        }),
      });

      if (!response.ok) {
        throw new Error("Błąd podczas zapisywania danych");
      }

      setStatus("success");

      // Redirect to Skool after 1.5 seconds
      setTimeout(() => {
        // Append UTM params to Skool URL
        const params = new URLSearchParams(window.location.search);
        const skoolUrl = params.toString()
          ? `https://www.skool.com/masterzone?${params.toString()}`
          : "https://www.skool.com/masterzone";

        window.location.href = skoolUrl;
      }, 1500);

    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Wystąpił błąd. Spróbuj ponownie.");
    }
  };

  return (
    <section id="contact-form" className="section-padding bg-gradient-to-br from-navy via-blue-700 to-blue-900 text-white">
      <div className="container-custom max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {headline}
          </h2>
          <p className="text-xl text-blue-100">
            {subheadline}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
          {/* First Name */}
          <div className="mb-6">
            <label htmlFor="firstName" className="block text-sm font-semibold mb-2">
              Imię *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-blue-200 focus:outline-none focus:border-lightblue focus:bg-white/30 transition-all"
              placeholder="Wpisz swoje imię"
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* Email */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-white/20 border-2 border-white/30 text-white placeholder-blue-200 focus:outline-none focus:border-lightblue focus:bg-white/30 transition-all"
              placeholder="twoj@email.com"
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* RODO Consent Checkbox */}
          <div className="mb-8">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.rodoConsent}
                onChange={(e) => setFormData({ ...formData, rodoConsent: e.target.checked })}
                className="mt-1 w-5 h-5 rounded border-2 border-white/30 bg-white/20 text-lightblue focus:ring-2 focus:ring-lightblue focus:ring-offset-0 cursor-pointer"
                disabled={status === "loading" || status === "success"}
              />
              <span className="text-sm text-blue-100 leading-relaxed group-hover:text-white transition-colors">
                Wyrażam zgodę na przetwarzanie danych w celu dostępu do MasterZone i otrzymywania materiałów edukacyjnych zgodnie z{" "}
                <a
                  href="https://radekpustelnik.pl/polityka-prywatnosci/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-lightblue transition-colors"
                >
                  polityką prywatności
                </a>
                . *
              </span>
            </label>
          </div>

          {/* Error Message */}
          {status === "error" && (
            <div className="mb-6 p-4 bg-red-500/20 border-2 border-red-400 rounded-lg">
              <p className="text-red-200 text-sm">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Success Message */}
          {status === "success" && (
            <div className="mb-6 p-4 bg-green-500/20 border-2 border-green-400 rounded-lg">
              <p className="text-green-200 text-sm">
                ✅ Świetnie! Za chwilę przekierujemy Cię do MasterZone...
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className={`w-full py-4 px-8 rounded-lg font-bold text-lg transition-all duration-300 ${
              status === "loading" || status === "success"
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-lightblue hover:bg-blue-400 text-navy shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            }`}
          >
            {status === "loading" ? "Zapisuję..." : status === "success" ? "Przekierowuję..." : ctaText}
          </button>
        </form>
      </div>
    </section>
  );
}
