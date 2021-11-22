import { resolve } from "path";
import { ConfigEnv, UserConfigExport, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { warpperEnv } from "./build/utils";
import { createProxy } from "./build/proxy";
import { viteMockServe } from "vite-plugin-mock";
import svgLoader from "vite-svg-loader";
import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [vue()]
// })

const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};
const alias: Record<string, string> = {
  "/@": pathResolve("src"),
  "@build": pathResolve("build")
};
const root: string = process.cwd();

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  console.log("*******", warpperEnv(loadEnv(mode, root)));
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY } = warpperEnv(
    loadEnv(mode, root)
  );
  const prodMock = true;
  return {
    base: process.env.NODE_ENV === "production" ? "/" : VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      // 是否开启 https
      https: false,
      /**
       * 端口号
       * @default 3000
       */
      port: VITE_PORT,
      host: "0.0.0.0",
      // 本地跨域代理
      proxy: createProxy(VITE_PROXY)
    },
    plugins: [
      vue(),
      vueJsx(),
      svgLoader(),
      ElementPlus({}),
      viteMockServe({
        mockPath: "mock",
        localEnabled: command === "serve",
        prodEnabled: command !== "serve" && prodMock,
        injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
        logger: true
      })
    ],
    optimizeDeps: {
      include: [
        "element-plus/lib/locale/lang/zh-cn",
        "element-plus/lib/locale/lang/en"
      ],
      exclude: ["@zougt/vite-plugin-theme-preprocessor/dist/browser-utils"]
    },
    build: {
      // @ts-ignore
      sourcemap: false,
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      minify: "terser",
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true
        }
      }
    }
  };
};
