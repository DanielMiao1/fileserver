const { resolve } = require("path");
const { rspack } = require("@rspack/core");

module.exports = {
  entry: {
    main: "./apps/web/src/main.ts",
  },
  experiments: {
    css: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: {
          loader: "builtin:swc-loader",
          options: {
            jsc: {
              parser: {
                decorators: true,
                syntax: "typescript"
              }
            },
            sourcemap: true
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "sass-loader",
            options: {
              api: "modern-compiler",
              implementation: require.resolve("sass-embedded")
            }
          }
        ],
        type: "css/auto"
      }
    ]
  },
  output: {
    path: resolve(process.cwd(), "dist/web")
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./apps/web/src/index.html"
    })
  ],
  resolve: {
    extensions: [".js", ".ts", ".json"]
  }
};
