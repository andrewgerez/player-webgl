/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLAYER_API: string
  readonly VITE_PARTNER_ID: string
  readonly VITE_UI_CONF_ID: string
  readonly VITE_CONTENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
