import { defineConfig } from "vite";

export default defineConfig({
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
	base: "/static/",
	root: "./src/frontend"
});
