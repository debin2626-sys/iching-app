/**
 * Normalize email addresses.
 * - Gmail/Googlemail: strip dots from local part, strip +tag aliases
 * - Other domains: lowercase only
 */
export function normalizeEmail(email: string): string {
  const lower = email.trim().toLowerCase();
  const [local, domain] = lower.split('@');
  if (!local || !domain) return lower;

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    // Strip +tag alias first, then remove dots
    const base = local.split('+')[0].replace(/\./g, '');
    return `${base}@gmail.com`;
  }

  return lower;
}
