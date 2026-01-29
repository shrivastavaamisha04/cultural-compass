/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_GEMINI_API_KEY: string
    readonly API_KEY: string  // For Vercel deployment
    readonly MODE: string
    readonly PROD: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
