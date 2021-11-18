type Recordable<T = any> = Record<string, T>;

interface ImportMetaEnv extends ViteEnv {
  __: unknown;
}

declare interface ViteEnv {
  VITE_PORT: number;
  VITE_TITLE: string;
  VITE_VERSION: string;
  VITE_USE_MOCK: boolean;
  VITE_USE_PWA: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_PROXY: [string, string][];
  VITE_GLOB_APP_TITLE: string;
  VITE_GLOB_APP_SHORT_NAME: string;
  VITE_USE_CDN: boolean;
  VITE_DROP_CONSOLE: boolean;
  VITE_BUILD_COMPRESS: "gzip" | "brotli" | "none";
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_LEGACY: boolean;
  VITE_USE_IMAGEMIN: boolean;
  VITE_GENERATE_UI: string;
}

declare interface ServerConfigs {
  Version?: string;
  Title?: string;
  FixedHeader?: boolean;
  HiddenSideBar?: boolean;
  KeepAlive?: boolean;
  Locale?: string;
  Layout?: string;
  Theme?: string;
  Grey?: boolean;
  Weak?: boolean;
  HideTabs?: boolean;
  MapConfigure?: {
    amapKey?: string;
    baiduKey?: string;
    options: {
      resizeEnable?: boolean;
      center?: number[];
      zoom?: number;
    };
  };
}
