/** Set NEXT_PUBLIC_SITE_URL in Vercel to the real domain; the fallback is only a guess. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://salmanulfariz.vercel.app").replace(/\/$/, "");
