/**
 * 匿名会话管理工具
 * 用于管理匿名用户的临时会话和本地存储
 */

const ANONYMOUS_SESSION_KEY = 'iching_anonymous_session';
const ANONYMOUS_DIVINATIONS_KEY = 'iching_anonymous_divinations';

export interface AnonymousSession {
  sessionId: string;
  createdAt: string;
  lastActivityAt: string;
}

export interface AnonymousDivination {
  id: string;
  question: string | null;
  coinResults: number[];
  hexagramId: number;
  changedHexagramId: number | null;
  changingLines: number[];
  aiInterpretation: string | null;
  createdAt: string;
  hexagram: {
    number: number;
    nameZh: string;
    nameEn: string;
    symbol: string;
  };
  changedHexagram?: {
    number: number;
    nameZh: string;
    nameEn: string;
    symbol: string;
  } | null;
}

/**
 * 获取或创建匿名会话ID
 */
export function getOrCreateAnonymousSession(): string {
  if (typeof window === 'undefined') {
    return 'server-session';
  }

  const stored = localStorage.getItem(ANONYMOUS_SESSION_KEY);
  if (stored) {
    try {
      const session: AnonymousSession = JSON.parse(stored);
      // 更新最后活动时间
      const updatedSession: AnonymousSession = {
        ...session,
        lastActivityAt: new Date().toISOString(),
      };
      localStorage.setItem(ANONYMOUS_SESSION_KEY, JSON.stringify(updatedSession));
      return session.sessionId;
    } catch {
      // 如果解析失败，创建新会话
    }
  }

  // 创建新会话
  const sessionId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newSession: AnonymousSession = {
    sessionId,
    createdAt: new Date().toISOString(),
    lastActivityAt: new Date().toISOString(),
  };
  
  localStorage.setItem(ANONYMOUS_SESSION_KEY, JSON.stringify(newSession));
  return sessionId;
}

/**
 * 获取匿名会话信息
 */
export function getAnonymousSession(): AnonymousSession | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(ANONYMOUS_SESSION_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

/**
 * 清除匿名会话
 */
export function clearAnonymousSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ANONYMOUS_SESSION_KEY);
  localStorage.removeItem(ANONYMOUS_DIVINATIONS_KEY);
}

/**
 * 保存匿名占卜记录到本地存储和数据库
 */
export async function saveAnonymousDivination(divination: AnonymousDivination): Promise<void> {
  if (typeof window === 'undefined') return;
  
  // 保存到本地存储
  const stored = localStorage.getItem(ANONYMOUS_DIVINATIONS_KEY);
  const divinations: AnonymousDivination[] = stored ? JSON.parse(stored) : [];
  
  // 添加到数组开头（最新记录在前）
  divinations.unshift(divination);
  
  // 限制最多保存50条记录
  const limitedDivinations = divinations.slice(0, 50);
  
  localStorage.setItem(ANONYMOUS_DIVINATIONS_KEY, JSON.stringify(limitedDivinations));
  
  // 同时保存到数据库（带匿名会话ID）
  try {
    const sessionId = getOrCreateAnonymousSession();
    await fetch('/api/divination/anonymous', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...divination,
        anonymousSessionId: sessionId,
      }),
    });
  } catch (error) {
    console.error('保存匿名记录到数据库失败:', error);
    // 静默失败，不影响用户体验
  }
}

/**
 * 获取所有匿名占卜记录
 */
export function getAnonymousDivinations(): AnonymousDivination[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(ANONYMOUS_DIVINATIONS_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

/**
 * 迁移匿名记录到用户账户
 * 这个函数应该在用户注册/登录后调用
 */
export async function migrateAnonymousDivinations(userId: string): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const divinations = getAnonymousDivinations();
  if (divinations.length === 0) return true;
  
  try {
    // 批量迁移记录到服务器
    const response = await fetch('/api/divination/migrate-anonymous', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        divinations,
      }),
    });
    
    if (response.ok) {
      // 迁移成功后清除本地存储
      clearAnonymousSession();
      return true;
    }
    return false;
  } catch (error) {
    console.error('迁移匿名记录失败:', error);
    return false;
  }
}

/**
 * 检查是否有匿名记录需要迁移
 */
export function hasAnonymousDivinations(): boolean {
  if (typeof window === 'undefined') return false;
  return getAnonymousDivinations().length > 0;
}