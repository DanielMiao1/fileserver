
const { resolve } = require("path");


module.exports = {
  entry: {
    main: './apps/api/src/main.ts',
  },
  externalsType: "commonjs",
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
      }
    ]
  },
  output: {
    path: resolve(process.cwd(), "dist/api")
  },
  resolve: {
    extensions: [".js", ".ts", ".json"]
  },
  target: "node"
};
