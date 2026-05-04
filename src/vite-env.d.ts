/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FORMSPREE_ID: string;
  readonly VITE_CALENDLY_URL?: string;
  readonly VITE_CALENDLY_CONSULT_URL?: string;
  readonly VITE_CALENDLY_TRAINING_URL?: string;
  readonly VITE_CALENDLY_CONSULT_VIRTUAL?: string;
  readonly VITE_CALENDLY_CONSULT_INPERSON?: string;
  readonly VITE_CALENDLY_TRAINING_VIRTUAL?: string;
  readonly VITE_CALENDLY_TRAINING_INPERSON?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
