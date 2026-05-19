/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE?: string;
  /** Optional override for wibestats spreadsheet ID (default is built in). */
  readonly VITE_GOOGLE_SHEET_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
