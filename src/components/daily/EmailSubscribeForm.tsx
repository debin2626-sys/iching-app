"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface EmailSubscribeFormProps {
  /** Button label */
  cta?: string;
  /** Compact single-row layout */
  inline?: boolean;
}

export default function EmailSubscribeForm({
  cta = "免费订阅",
  inline = true,
}: EmailSubscribeFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (status === "success") {
    return (
      <p
        className="text-sm text-center py-3"
        style={{ color: "var(--color-gold)" }}
      >
        ✅ 查看邮箱，点击验证链接即可完成订阅
      </p>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("请输入有效的邮箱地址");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/daily/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, school: "yijing" }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "订阅失败，请稍后重试");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "订阅失败，请稍后重试");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={inline ? "flex gap-2 items-start" : "space-y-3"}
    >
      <div className={inline ? "flex-1" : ""}>
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errorMsg || undefined}
          size="md"
          disabled={status === "loading"}
          aria-label="邮箱地址"
        />
      </div>
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        loading={status === "loading"}
        className="shrink-0"
      >
        {cta}
      </Button>
    </form>
  );
}
