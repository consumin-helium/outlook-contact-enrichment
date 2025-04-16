const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      taskpane: "./src/taskpane/taskpane.ts",
      commands: "./src/commands/commands.ts",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".html", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: "babel-loader"
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader"
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]"
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["taskpane"]
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp("https://localhost:3000", "g"), "https://production-url");
              }
            },
          },
        ],
      }),
    ],
    devServer: {
      static: {
        directory: path.join(__dirname, "dist"),
        publicPath: "/",
      },
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await devCerts.getHttpsServerOptions(),
      },
      port: 3000,
      historyApiFallback: true,
      compress: true,
      hot: true,
      host: "localhost",
    }
  };

  return config;
};