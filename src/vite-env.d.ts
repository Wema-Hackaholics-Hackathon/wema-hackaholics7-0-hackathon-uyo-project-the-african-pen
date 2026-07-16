/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_ALAT_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
