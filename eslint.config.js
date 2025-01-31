import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config(
	eslint.configs.all,
	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,
	{
		files: ["src/backend/**/*.ts"],
		languageOptions: {
			globals: globals.node,
			parserOptions: {
				project: "src/backend/tsconfig.json"
			}
		}
	},
	{
		files: ["src/frontend/**/*.ts"],
		languageOptions: {
			globals: globals.browser,
			parserOptions: {
				project: "src/frontend/tsconfig.json"
			}
		}
	},
	{
		plugins: {
			"@stylistic": stylistic
		},
		rules: {
			"@stylistic/array-bracket-newline": ["error", "consistent"],
			"@stylistic/array-bracket-spacing": ["error"],
			"@stylistic/array-element-newline": ["error", "consistent"],
			"@stylistic/arrow-parens": ["error", "as-needed"],
			"@stylistic/arrow-spacing": ["error"],
			"@stylistic/block-spacing": ["error"],
			"@stylistic/brace-style": ["error"],
			"@stylistic/comma-dangle": ["error"],
			"@stylistic/comma-spacing": ["error"],
			"@stylistic/comma-style": ["error"],
			"@stylistic/computed-property-spacing": ["error"],
			"@stylistic/dot-location": ["error", "property"],
			"@stylistic/eol-last": ["error"],
			"@stylistic/function-call-argument-newline": ["error", "consistent"],
			"@stylistic/function-call-spacing": ["error"],
			"@stylistic/function-paren-newline": ["error"],
			"@stylistic/generator-star-spacing": ["error", "after"],
			"@stylistic/implicit-arrow-linebreak": ["error"],
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/indent-binary-ops": ["error", "tab"],
			"@stylistic/key-spacing": ["error"],
			"@stylistic/keyword-spacing": ["error"],
			"@stylistic/linebreak-style": ["error"],
			"@stylistic/lines-around-comment": ["error"],
			"@stylistic/lines-between-class-members": ["error"],
			"@stylistic/max-len": ["error", {
				code: 80,
				tabWidth: 1,
			}],
			"@stylistic/max-statements-per-line": ["error"],
			"@stylistic/member-delimiter-style": ["error"],
			"@stylistic/multiline-ternary": ["error", "always-multiline"],
			"@stylistic/new-parens": ["error"],
			"@stylistic/newline-per-chained-call": ["error", {
				ignoreChainWithDepth: 3,
			}],
			"@stylistic/no-confusing-arrow": ["error", {
				allowParens: true,
			}],
			"@stylistic/no-extra-parens": ["error", "all", {
				enforceForArrowConditionals: false,
				nestedBinaryExpressions: false,
			}],
			"@stylistic/no-extra-semi": ["error"],
			"@stylistic/no-floating-decimal": ["error"],
			"@stylistic/no-mixed-operators": ["error"],
			"@stylistic/no-mixed-spaces-and-tabs": ["error"],
			"@stylistic/no-multi-spaces": ["error"],
			"@stylistic/no-multiple-empty-lines": ["error"],
			"@stylistic/no-tabs": ["error", {
				allowIndentationTabs: true,
			}],
			"@stylistic/no-trailing-spaces": ["error"],
			"@stylistic/no-whitespace-before-property": ["error"],
			"@stylistic/nonblock-statement-body-position": ["error"],
			"@stylistic/object-curly-newline": ["error"],
			"@stylistic/object-curly-spacing": ["error", "always"],
			"@stylistic/operator-linebreak": ["error"],
			"@stylistic/padded-blocks": ["error", "never"],
			"@stylistic/quote-props": ["error", "as-needed"],
			"@stylistic/quotes": ["error"],
			"@stylistic/rest-spread-spacing": ["error"],
			"@stylistic/semi": ["error"],
			"@stylistic/semi-spacing": ["error"],
			"@stylistic/semi-style": ["error"],
			"@stylistic/space-before-blocks": ["error"],
			"@stylistic/space-before-function-paren": ["error", {
				anonymous: "always",
				named: "never",
				asyncArrow: "always",
			}],
			"@stylistic/space-in-parens": ["error"],
			"@stylistic/space-infix-ops": ["error"],
			"@stylistic/space-unary-ops": ["error"],
			"@stylistic/spaced-comment": ["error"],
			"@stylistic/switch-colon-spacing": ["error"],
			"@stylistic/template-curly-spacing": ["error"],
			"@stylistic/template-tag-spacing": ["error"],
			"@stylistic/type-annotation-spacing": ["error"],
			"@stylistic/type-generic-spacing": ["error"],
			"@stylistic/type-named-tuple-spacing": ["error"],
			"@stylistic/wrap-iife": ["error"],
			"@stylistic/wrap-regex": ["error"],
			"@stylistic/yield-star-spacing": ["error"],
			"@typescript-eslint/restrict-template-expressions": ["error", {
				allowNumber: true,
				allowBoolean: true,
			}],
			"@typescript-eslint/no-unnecessary-condition": ["error", {
				allowConstantLoopConditions: true
			}],
			"camelcase": "off",
			"complexity": ["error", {
				max: 100
			}],
			"default-case": "off",
			"func-style": "off",
			"id-length": ["error", {
				exceptions: ["x", "y", "z", "_"]
			}],
			"init-declarations": "off",
			"max-lines": ["error", {
				max: 400
			}],
			"max-lines-per-function": ["error", {
				max: 350
			}],
			"max-params": "off",
			"max-statements": ["error", {
				max: 150
			}],
			"no-await-in-loop": "off",
			"no-console": "off",
			"no-magic-numbers": "off",
			"no-plusplus": ["error", {
				allowForLoopAfterthoughts: true
			}],
			"no-ternary": "off",
			"no-unnecessary-condition": "off",
			"no-warning-comments": "off",
			"one-var": "off",
			"prefer-destructuring": "off",
			"sort-imports": ["error", {
				allowSeparatedGroups: true
			}]
		}
	}
);
