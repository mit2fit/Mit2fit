declare global {
  interface Window {
    Calendly?: {
      initPopupWidget: (options: { url: string }) => void;
      closePopupWidget?: () => void;
    };
  }
}

const CALENDLY_WIDGET_SCRIPT = 'https://assets.calendly.com/assets/external/widget.js';
const DEFAULT_CALENDLY_URL = 'https://calendly.com/mit2health';
const DEFAULT_INITIAL_CONSULT_URL = 'https://calendly.com/mit2health/30min';
const DEFAULT_GROUP_CONSULT_URL = 'https://calendly.com/mit2health/group-consult-request';
const DEFAULT_STANDARD_SESSION_URL = 'https://calendly.com/mit2health/standard-session';
const DEFAULT_STANDARD_AUDIT_PAYMENT_URL =
  'https://calendly.com/mit2health/payments/af21bacd-84f3-44fb-9b46-10d7aecb2745';
const DEFAULT_PERFORMANCE_BUILD_PACKAGE_URL =
  'https://calendly.com/mit2health/packages/246bf2ec-a421-432e-b516-b49039b4c218';
const DEFAULT_ELITE_PROTOCOL_PACKAGE_URL =
  'https://calendly.com/mit2health/packages/0985ffb1-2cb0-452c-9385-add879f03266';

let scriptLoadPromise: Promise<void> | null = null;

function trimEnv(value: unknown): string | undefined {
  if (value == null || typeof value !== 'string') return undefined;
  const t = value.trim();
  return t.length > 0 ? t : undefined;
}

function env(name: keyof ImportMetaEnv): string | undefined {
  return trimEnv(import.meta.env[name]);
}

/** Single fallback when specific event URLs are not set. */
export function getCalendlyFallbackUrl(): string | undefined {
  return env('VITE_CALENDLY_URL') ?? DEFAULT_CALENDLY_URL;
}

export function getConsultCalendlyUrl(isVirtual: boolean): string | undefined {
  const fallback = env('VITE_CALENDLY_CONSULT_URL') ?? DEFAULT_INITIAL_CONSULT_URL;
  if (isVirtual) {
    return env('VITE_CALENDLY_CONSULT_VIRTUAL') ?? fallback;
  }
  return env('VITE_CALENDLY_CONSULT_INPERSON') ?? fallback;
}

export function getTrainingCalendlyUrl(isVirtual: boolean): string | undefined {
  const fallback = env('VITE_CALENDLY_TRAINING_URL') ?? DEFAULT_STANDARD_SESSION_URL;
  if (isVirtual) {
    return env('VITE_CALENDLY_TRAINING_VIRTUAL') ?? fallback;
  }
  return env('VITE_CALENDLY_TRAINING_INPERSON') ?? fallback;
}

export function getStandardSessionCalendlyUrl(isVirtual: boolean): string | undefined {
  const fallback =
    env('VITE_CALENDLY_STANDARD_SESSION_URL') ?? getTrainingCalendlyUrl(isVirtual);
  if (isVirtual) {
    return env('VITE_CALENDLY_STANDARD_SESSION_VIRTUAL') ?? fallback;
  }
  return env('VITE_CALENDLY_STANDARD_SESSION_INPERSON') ?? fallback;
}

export function getStandardAuditPaymentCalendlyUrl(): string | undefined {
  return env('VITE_CALENDLY_STANDARD_AUDIT_PAYMENT_URL') ?? DEFAULT_STANDARD_AUDIT_PAYMENT_URL;
}

export function getGroupConsultCalendlyUrl(): string | undefined {
  return env('VITE_CALENDLY_GROUP_CONSULT_URL') ?? DEFAULT_GROUP_CONSULT_URL;
}

export function getPerformanceBuildPackageCalendlyUrl(): string | undefined {
  return (
    env('VITE_CALENDLY_PERFORMANCE_BUILD_PACKAGE_URL') ??
    DEFAULT_PERFORMANCE_BUILD_PACKAGE_URL
  );
}

export function getEliteProtocolPackageCalendlyUrl(): string | undefined {
  return env('VITE_CALENDLY_ELITE_PROTOCOL_PACKAGE_URL') ?? DEFAULT_ELITE_PROTOCOL_PACKAGE_URL;
}

export function appendCalendlyParams(
  baseUrl: string,
  params: Record<string, string | undefined>
): string {
  try {
    const u = new URL(baseUrl);
    for (const [k, v] of Object.entries(params)) {
      if (v) u.searchParams.set(k, v);
    }
    return u.toString();
  } catch {
    return baseUrl;
  }
}

export function loadCalendlyScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${CALENDLY_WIDGET_SCRIPT}"]`
    );
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Calendly script failed')), {
        once: true,
      });
      return;
    }
    const script = document.createElement('script');
    script.src = CALENDLY_WIDGET_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Calendly script failed to load'));
    document.head.appendChild(script);
  });

  return scriptLoadPromise;
}

export async function openCalendlyPopup(
  baseUrl: string,
  tracking?: { utm_content?: string }
): Promise<void> {
  const url = tracking?.utm_content
    ? appendCalendlyParams(baseUrl, { utm_content: tracking.utm_content })
    : baseUrl;
  try {
    await loadCalendlyScript();
    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url });
      return;
    }
  } catch {
    // Fall through to a direct link open below.
  }

  window.open(url, '_blank', 'noopener,noreferrer');
}
