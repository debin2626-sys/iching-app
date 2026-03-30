"use client";


import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, Link } from "@/i18n/navigation";
import { PageLayout, Input } from "@/components/ui";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 2.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

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
        <div className="mb-10 text-center">
          <div className="text-5xl mb-3 animate-pulse-glow">☯</div>
          <h1 className="font-title text-3xl sm:text-4xl font-bold text-gold-glow tracking-wider">
            易 · YiChing
          </h1>
          <p className="text-gray-500 text-sm tracking-[0.3em] mt-3">
            {tab === "login" ? "欢迎回来，继续问道" : "注册账号，开启问道之旅"}
          </p>
        </div>

        {/* Card */}
        <div className="card-mystic rounded-2xl w-full max-w-md p-8 sm:p-10">
          {/* Google Login Button - Primary */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 h-12 bg-white hover:bg-gray-50 text-gray-700 font-medium text-base rounded-xl border border-gray-200 transition-all duration-200 shadow-sm hover:shadow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {googleLoading ? (
              <div className="w-[18px] h-[18px] border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? "跳转中..." : "使用 Google 登录"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500 tracking-wider">或</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Tab switcher */}
          <div className="flex mb-8 border-b border-white/5">
            <button
              onClick={() => { setTab("login"); setError(""); }}
              className={`flex-1 pb-3 text-base tracking-wider font-title transition-all duration-300 ${
                tab === "login"
                  ? "text-gold border-b-2 border-gold/60"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              邮箱登录
            </button>
            <button
              onClick={() => { setTab("register"); setError(""); }}
              className={`flex-1 pb-3 text-base tracking-wider font-title transition-all duration-300 ${
                tab === "register"
                  ? "text-gold border-b-2 border-gold/60"
                  : "text-gray-500 hover:text-gray-400"
              }`}
            >
              邮箱注册
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
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              <Input
                type="email"
                label="邮箱"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <Input
                type="password"
                label="密码"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full font-title tracking-wider h-12 rounded-lg bg-[#8b2500] text-[#f5f0e8] border border-[#c9a96e]/40 transition-all duration-300 hover:bg-[#a63000] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 0 20px rgba(139,37,0,0.3), 0 0 10px rgba(201,169,110,0.1)' }}
              >
                {loading ? "登录中..." : "登录"}
              </button>
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
            <form onSubmit={handleRegister} className="flex flex-col gap-6">
              <Input
                type="text"
                label="称呼"
                size="lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="如何称呼您"
              />
              <Input
                type="email"
                label="邮箱"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
              <Input
                type="password"
                label="密码"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="至少6个字符"
                required
                minLength={6}
              />
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full font-title tracking-wider h-12 rounded-lg bg-[#8b2500] text-[#f5f0e8] border border-[#c9a96e]/40 transition-all duration-300 hover:bg-[#a63000] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 0 20px rgba(139,37,0,0.3), 0 0 10px rgba(201,169,110,0.1)' }}
              >
                {loading ? "注册中..." : "注册"}
              </button>
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
