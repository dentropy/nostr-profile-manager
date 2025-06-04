import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
// import commonjs from 'vite-plugin-commonjs';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import bip39 from 'bip39'
// import bip39 from "bip39";
export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    // commonjs(),
    nodePolyfills({
          // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
          include: ['path'],
          // To exclude specific polyfills, add them to this list. Note: if include is provided, this has no effect
          exclude: [
            'http', // Excludes the polyfill for `http` and `node:http`.
          ],
          // Whether to polyfill specific globals.
          globals: {
            Buffer: true, // can also be 'build', 'dev', or false
            global: true,
            process: true,
            bip39: true,
          },
          // Override the default polyfills for specific modules.
          overrides: {
            // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
            fs: 'memfs',
          },
          // Whether to polyfill `node:` protocol imports.
          protocolImports: true,
        }),
  ],
  resolve: {
      alias: {
        // Map Node.js built-ins to browser-compatible modules
        bip39: 'bip39',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Ensure global is mapped to globalThis for browser compatibility
        define: {
          global: 'globalThis',
        },
      },
    },
});
