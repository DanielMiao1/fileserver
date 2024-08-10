import { defineConfig } from "vite";

export default defineConfig({
	build: {
		emptyOutDir: true,
		sourcemap: process.env["NODE_ENV"] !== "production",
		outDir: "../../build/frontend"
		// minify:
	},
	base: "/static/",
	root: "./src/frontend"
});	
