/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_GOOGLE_CLIENT_ID: string
  readonly REACT_APP_API_URL: string
  readonly REACT_APP_WS_URL: string
  readonly REACT_APP_SKIP_AUTH: string
  readonly REACT_APP_VERSION: string
  readonly REACT_APP_ENABLE_ANALYTICS: string
  readonly REACT_APP_ENABLE_ERROR_TRACKING: string
  readonly REACT_APP_DEBUG_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
