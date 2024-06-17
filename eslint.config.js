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
	pluginJs.configs.all,
	{
		rules: {
			"camelcase": "off",
			"default-case": "off",
			"func-style": "off",
			"id-length": ["error", {
				exceptions: ["x", "y", "z", "_"]
			}],
			"init-declarations": "off",
			"max-lines": ["error", {
				max: 400
			}],
			"max-params": "off",
			"max-statements": ["error", {
				max: 20
			}],
			"no-await-in-loop": "off",
			"no-console": "off",
			"no-magic-numbers": "off",
			"no-plusplus": ["error", {
				allowForLoopAfterthoughts: true
			}],
			"no-ternary": "off",
			"no-warning-comments": "off",
			"one-var": "off",
			"prefer-destructuring": "off",
			"sort-imports": ["error", {
				allowSeparatedGroups: true
			}]
		}
	}
];
