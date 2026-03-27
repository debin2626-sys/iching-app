"use client";

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/i18n/navigation";
import { PageLayout, Input, Button } from "@/components/ui";

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setError("邮箱或密码错误");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("登录失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("密码至少需要6个字符");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "注册失败");
        return;
      }
      // Auto login after register
      const loginRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (loginRes?.error) {
        setTab("login");
        setError("注册成功，请登录");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("注册失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout showNav={false}>
      <main className="min-h-screen flex flex-col items-center justify-center px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-20 left-[15%] text-amber-500/10 text-5xl animate-twinkle select-none hidden md:block">
          ☲
        </div>
        <div className="absolute bottom-20 right-[15%] text-amber-500/10 text-5xl animate-twinkle-slow select-none hidden md:block">
          ☵
        </div>

        {/* Back to home */}
        <Link
          href="/"
          className="absolute top-6 left-6 text-sm text-amber-400/50 hover:text-amber-400 transition-colors tracking-wider"
        >
          ← 返回首页
        </Link>

        {/* Logo */}
        <div className="mb-8 text-center">
          <h1 className="font-title text-3xl font-bold text-gold-glow tracking-wider">
            易 · YiChing
          </h1>
          <p className="text-gray-500 text-xs tracking-[0.3em] mt-2">
            {tab === "login" ? "欢迎回来，继续问道" : "注册账号，开启问道之旅"}
          </p>
        </div>

        {/* Card */}
        <div className="card-mystic rounded-2xl w-full max-w-md p-8">
          {/* Tab switcher */}
          <div className="flex mb-8 border-b border-white/5">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 pb-3 text-sm tracking-wider font-title transition-all duration-300 ${
                tab === "login"
                  ? "text-amber-400 border-b-2 border-amber-400/60"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              登录
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 pb-3 text-sm tracking-wider font-title transition-all duration-300 ${
                tab === "register"
                  ? "text-amber-400 border-b-2 border-amber-400/60"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              注册
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 text-center text-sm text-red-400/80 bg-red-400/5 border border-red-400/10 rounded-lg py-2.5">
              {error}
            </div>
          )}

          {/* Login form */}
          {tab === "login" && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <Input
                type="email"
                label="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <Input
                type="password"
                label="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                className="mt-2 w-full font-title tracking-wider"
              >
                {loading ? "登录中..." : "登录"}
              </Button>
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-5">
              <Input
                type="text"
                label="称呼"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如何称呼您"
              />
              <Input
                type="email"
                label="邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <Input
                type="password"
                label="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6个字符"
                required
                minLength={6}
              />
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                className="mt-2 w-full font-title tracking-wider"
              >
                {loading ? "注册中..." : "注册"}
              </Button>
            </form>
          )}
        </div>

        {/* Bottom decoration */}
        <div className="mt-10 flex items-center gap-3 animate-pulse-glow">
          <span className="text-amber-600/40 text-xs tracking-[0.5em]">
            ䷀ ䷁ ䷂
          </span>
        </div>
      </main>
    </PageLayout>
  );
}
