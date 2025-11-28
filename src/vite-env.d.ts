/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // có thể khai báo thêm biến env khác nếu cần
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
