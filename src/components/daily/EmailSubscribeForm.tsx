"use client";

import { useState, useRef, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

interface EmailSubscribeFormProps {
  /** Button label */
  cta?: string;
  /** Compact single-row layout */
  inline?: boolean;
  school?: "yijing" | "daoist" | "all";
}

export default function EmailSubscribeForm({
  cta,
  inline = true,
  school,
}: EmailSubscribeFormProps) {
  const t = useTranslations("Daily");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  if (status === "success") {
    return (
      <p
        className="text-sm text-center py-3"
        style={{ color: "var(--color-gold)" }}
      >
        {t("subscribeSuccess")}
      </p>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg(t("subscribeInvalidEmail"));
      return;
    }
    if (!turnstileToken) {
      setErrorMsg("请完成人机验证");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/daily/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          school: school ?? "all",
          turnstileToken,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t("subscribeFailed"));
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : t("subscribeFailed"));
      // Reset turnstile on error so user can retry
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={inline ? "flex flex-col gap-2" : "space-y-3"}
    >
      <div className={inline ? "flex gap-2 items-start" : ""}>
        <div className="flex-1">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errorMsg || undefined}
            size="md"
            disabled={status === "loading"}
            aria-label={t("subscribeEmailLabel")}
          />
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="sm"
          loading={status === "loading"}
          className="shrink-0"
        >
          {cta ?? t("subscribeCta")}
        </Button>
      </div>
      {TURNSTILE_SITE_KEY && (
        <Turnstile
          ref={turnstileRef}
          siteKey={TURNSTILE_SITE_KEY}
          onSuccess={setTurnstileToken}
          options={{ theme: "dark", size: "compact" }}
        />
      )}
    </form>
  );
}
