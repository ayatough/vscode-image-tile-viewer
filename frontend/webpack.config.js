const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // エントリポイントのファイル
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/, // ファイルが.vueで終われば...
        loader: "vue-loader", // vue-loaderを使う
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["vue-style-loader", "css-loader"], // css-loader -> vue-style-loaderの順で通していく
      },
    ],
  },
  resolve: {
    // import './foo.vue' の代わりに import './foo' と書けるようになる(拡張子省略)
    extensions: [".js", ".vue"],
    alias: {
      // vue-template-compilerに読ませてコンパイルするために必要
      vue$: "vue/dist/vue.esm.js",
    },
  },
  plugins: [
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "public",
          // to: path.resolve(__dirname, "dist"),
        }
      ]
    }),
  ],
  devServer: {
    // webpackの扱わないファイル(HTMLや画像など)が入っているディレクトリ
    static: {
      directory: path.resolve(__dirname, "public"),
    },
  },
};
