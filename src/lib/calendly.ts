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
  const fallback = env('VITE_CALENDLY_CONSULT_URL') ?? getCalendlyFallbackUrl();
  if (isVirtual) {
    return env('VITE_CALENDLY_CONSULT_VIRTUAL') ?? fallback;
  }
  return env('VITE_CALENDLY_CONSULT_INPERSON') ?? fallback;
}

export function getTrainingCalendlyUrl(isVirtual: boolean): string | undefined {
  const fallback = env('VITE_CALENDLY_TRAINING_URL') ?? getCalendlyFallbackUrl();
  if (isVirtual) {
    return env('VITE_CALENDLY_TRAINING_VIRTUAL') ?? fallback;
  }
  return env('VITE_CALENDLY_TRAINING_INPERSON') ?? fallback;
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
  await loadCalendlyScript();
  window.Calendly?.initPopupWidget({ url });
}
