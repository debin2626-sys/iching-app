import { z } from "zod/v4";

// ─── Auth Schemas ───

export const registerSchema = z.object({
  email: z.email("请输入有效的邮箱地址"),
  password: z.string().min(8, "密码至少8个字符").max(128, "密码不能超过128个字符"),
  name: z.string().max(50, "名称不能超过50个字符").optional(),
});

// ─── Divination Schemas ───

export const createDivinationSchema = z.object({
  question: z.string().max(500, "问题不能超过500个字符").optional(),
  coinResults: z.array(z.array(z.number())).min(1, "缺少投掷结果"),
  hexagramId: z.number().int().min(1).max(64),
  changedHexagramId: z.number().int().min(1).max(64).optional().nullable(),
  changingLines: z.array(z.number().int().min(0).max(5)).optional(),
});

// ─── AI Interpret Schemas ───

const birthInfoSchema = z.object({
  year: z.number().int().min(1900).max(2100),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(0).max(31),
  hour: z.number().int().min(0).max(23),
});

export const aiInterpretSchema = z.object({
  hexagramNumber: z.number().int().min(1).max(64),
  changingLines: z.array(z.number().int().min(0).max(5)).optional(),
  question: z.string().min(1, "请输入问题").max(500, "问题不能超过500个字符"),
  locale: z.string().max(10).optional(),
  birthInfo: birthInfoSchema.optional().nullable(),
});

export const aiInterpretDepthSchema = z.object({
  hexagramNumber: z.number().int().min(1).max(64),
  changingLines: z.array(z.number().int().min(0).max(5)).optional(),
  question: z.string().min(1, "请输入问题").max(500, "问题不能超过500个字符"),
  depth: z.enum(["simple", "detailed", "deep"]).optional().default("detailed"),
  locale: z.string().max(10).optional(),
  birthInfo: birthInfoSchema.optional().nullable(),
  gender: z.string().max(10).optional(),
  scenarioId: z.string().max(30).optional(),
  subScenarioId: z.string().max(30).optional(),
});

// ─── Favorites Schemas ───

export const createFavoriteSchema = z.object({
  hexagramId: z.number().int().min(1, "缺少卦象ID"),
  notes: z.string().max(2000, "笔记不能超过2000个字符").optional().nullable(),
  tags: z.string().max(500, "标签不能超过500个字符").optional().nullable(),
});

export const updateFavoriteSchema = z.object({
  note: z.string().max(2000, "笔记不能超过2000个字符").optional(),
  tags: z.union([
    z.array(z.string().max(50)).max(20),
    z.string().max(500),
  ]).optional(),
});

// ─── User Schemas ───

export const updateProfileSchema = z.object({
  name: z.string().min(1, "名称不能为空").max(50, "名称不能超过50个字符"),
});

export const updatePreferencesSchema = z.object({
  language: z.enum(["zh", "en"]).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
  aiDepth: z.enum(["simple", "detailed", "deep"]).optional(),
  notifications: z.boolean().optional(),
});

// ─── Review Schemas ───

export const reviewDivinationSchema = z.object({
  reviewNote: z.string().max(500, "复盘笔记不能超过500个字符").optional(),
  accuracyScore: z.number().int().min(1).max(5),
});

export const fulfillDivinationSchema = z.object({
  fulfilled: z.boolean(),
});

// ─── Helper ───

/**
 * Validate request body against a zod schema.
 * Returns { success: true, data } or { success: false, error: string }.
 */
export function validateBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const messages = result.error.issues.map((i) => i.message).join("; ");
  return { success: false, error: messages };
}
