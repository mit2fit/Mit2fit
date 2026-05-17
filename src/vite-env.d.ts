/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ID: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_CALENDLY_CONSULT_URL?: string;
  readonly VITE_CALENDLY_TRAINING_URL?: string;
  readonly VITE_CALENDLY_GROUP_CONSULT_URL?: string;
  readonly VITE_CALENDLY_STANDARD_SESSION_URL?: string;
  readonly VITE_CALENDLY_STANDARD_AUDIT_PAYMENT_URL?: string;
  readonly VITE_CALENDLY_STANDARD_SESSION_VIRTUAL?: string;
  readonly VITE_CALENDLY_STANDARD_SESSION_INPERSON?: string;
  readonly VITE_CALENDLY_PERFORMANCE_BUILD_PACKAGE_URL?: string;
  readonly VITE_CALENDLY_ELITE_PROTOCOL_PACKAGE_URL?: string;
  readonly VITE_CALENDLY_CONSULT_VIRTUAL?: string;
  readonly VITE_CALENDLY_CONSULT_INPERSON?: string;
  readonly VITE_CALENDLY_TRAINING_VIRTUAL?: string;
  readonly VITE_CALENDLY_TRAINING_INPERSON?: string;
  readonly VITE_CALENDLY_PRICING_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
