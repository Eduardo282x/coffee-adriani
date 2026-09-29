/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BASE_URL_API: string
    readonly VITE_PAYMENT_TOLERANCE_USD?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
