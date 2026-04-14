"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { migrateAnonymousDivinations, hasAnonymousDivinations } from "@/lib/anonymous-session";

/**
 * /auth/migrate — Google OAuth 登录后的匿名记录迁移中转页
 * 自动迁移本地匿名占卜记录到服务器，然后跳转首页
 */
export default function MigratePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const migrated = useRef(false);

  useEffect(() => {
    if (status === "loading" || migrated.current) return;

    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }

    if (status === "authenticated" && session?.user?.id) {
      migrated.current = true;
      const run = async () => {
        if (hasAnonymousDivinations()) {
          try {
            await migrateAnonymousDivinations(session.user.id);
          } catch {
            // 迁移失败静默处理，不阻断用户
          }
        }
        router.replace("/");
      };
      run();
    }
  }, [status, session, router]);

  return (
    <main
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--theme-bg)" }}
    >
      <div className="text-center">
        <div className="text-4xl mb-4 animate-pulse-glow">☯</div>
        <p className="text-[var(--theme-text-muted)] tracking-wider text-sm">
          正在同步记录…
        </p>
      </div>
    </main>
  );
}
