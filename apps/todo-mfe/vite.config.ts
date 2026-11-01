import { federation } from "@module-federation/vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { defineConfig } from "vite";

const port = 5174;

export default defineConfig({
  devtools: { apply: "serve" },
  plugins: [
    vue({
      template: {
        // <t-*> tags are custom elements from @repo/ui/register, not Vue components.
        compilerOptions: { isCustomElement: (tag) => tag.startsWith("t-") },
      },
    }),
    vueDevTools({ appendTo: /\/src\/mount\.ts$/ }),
    federation({
      name: "todo",
      filename: "remoteEntry.js",
      exposes: {
        "./mount": "./src/mount.ts",
      },
      // Nothing shared yet: this remote bundles its own Vue and React (see README).
      shared: {},
      dts: false,
    }),
  ],
  server: {
    port,
    strictPort: true,
    // Makes dev-server asset URLs absolute so they resolve when loaded by the shell.
    origin: `http://localhost:${port}`,
  },
  preview: { port, strictPort: true },
});
