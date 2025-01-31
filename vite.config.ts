import { defineConfig } from "vite";

export default defineConfig({
	base: "/static/",
	build: {
		emptyOutDir: true,
		outDir: "../../build/frontend",
		rollupOptions: {
			output: {
				manualChunks: {
					hljs: ["highlight.js"]
				}
			}
		},
		sourcemap: process.env["NODE_ENV"] !== "production"
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern"
			}
		}
	},
	root: "./src/frontend"
});
