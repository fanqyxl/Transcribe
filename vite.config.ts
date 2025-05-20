import { defineConfig } from "vite";
import { dreamlandPlugin } from "vite-plugin-dreamland";
import legacy from "@vitejs/plugin-legacy";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
    plugins: [
        dreamlandPlugin(),
        legacy({
            targets: [
                "fully supports flexbox",
                "partially supports css-grid",
                "supports proxy",
                "not dead",
                "BlackBerry 10",
                "Firefox ESR",
            ],
        }),
        viteStaticCopy({
            targets: [
                {
                    src: "node_modules/@mercuryworkshop/epoxy-tls/minimal/epoxy.wasm",
                    dest: "epoxy",
                },
            ],
        }),
    ],
    base: "./",
    build: {
        sourcemap: true,
        cssMinify: "lightningcss",
        minify: "terser",
    },
    css: {
        devSourcemap: true,
    },
    server: {
        host: true,
        cors: false,
        port: 4090,
    },
});
