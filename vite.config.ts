import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		sourcemap: true,
		rollupOptions: {
			output: { exports: "named" },
			plugins: [
				// needed for auto-generation of .d.ts files
				// https://github.com/vitejs/vite/issues/2049
				typescript(),
			],
		},
		outDir: "./dist",
		lib: {
			entry: "./debounce.ts",
			formats: ["cjs", "umd", "es"],
			name: "debounce",
		},
	},
});
