/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ID: string;
<<<<<<< HEAD
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_CALENDLY_CONSULT_URL?: string;
  readonly VITE_CALENDLY_TRAINING_URL?: string;
  readonly VITE_CALENDLY_CONSULT_VIRTUAL?: string;
  readonly VITE_CALENDLY_CONSULT_INPERSON?: string;
  readonly VITE_CALENDLY_TRAINING_VIRTUAL?: string;
  readonly VITE_CALENDLY_TRAINING_INPERSON?: string;
=======
  readonly VITE_CALENDLY_URL: string;
  readonly VITE_CALENDLY_CONSULT_URL: string;
  readonly VITE_CALENDLY_PRICING_URL: string;
>>>>>>> 2f8a7a5 (Prioritize Calendly booking with Formspree fallback and intake redirect flow)
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
