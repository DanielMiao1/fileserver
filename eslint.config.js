import globals from "globals";
import pluginJs from "@eslint/js";

export default [
	{
		files: ["src/frontend/**/*.js"],
		languageOptions: {
			globals: {
				...globals.browser,
				hljs: "readonly"
			}
		}
	},
	{
		files: ["src/backend/**/*.js"],
		languageOptions: {
			globals: globals.node
		}
	},
	pluginJs.configs.recommended,
];
