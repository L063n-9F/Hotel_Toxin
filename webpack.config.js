const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fs = require('fs')

const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PAGES_PATHS = fs.readdirSync(PAGES_DIR);

const entryPoints = PAGES_PATHS.reduce((accum, current) => {
  accum[current] = PAGES_DIR + '/' + current + '/' + 'index.js';
  return accum;
}, {});

const HTML_templates = PAGES_PATHS.map(item => {
  return new HtmlWebpackPlugin({
    filename: item + '.html',
    template: PAGES_DIR + '/' + item + '/' + item + '.pug',
    chunks: [item],
    inject: 'body'
  })
});

module.exports = (env) => {
  const isDev = Boolean(env.development);
  const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;
  const baseConfig = {
    context: path.resolve(__dirname, 'src'),
    entry: entryPoints,
    performance: {
      maxAssetSize: 5000000,
    },
    output: {
      filename: `./js/${filename('js')}`,
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: `./css/${filename('css')}`
      }),
      ...HTML_templates,
      new CopyPlugin({
        patterns: [
          { from: "./assets/favicons", to: "assets/favicons" },
        ]}),
    ],

    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: 'pug-loader',
          options: {
            pretty: true,
          },
        },
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.styl$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
            },
            {
              loader: "stylus-loader",
            }
          ]
        },
        {
          test: /\.(woff|ttf|svg)$/i,
          type: 'asset/resource',
          exclude: /img/,
          generator: {
            filename: './assets/fonts/[name][ext]'
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
          exclude: /fonts/,
          generator: {
            filename: './assets/img/[name].[contenthash][ext]'
          },
        },
      ],
    },
  };
  const devConfig = {
    mode: 'development',
    devtool: 'source-map',
    devServer: {
      port: 4200,
      open: '/index.html',
    },
    ...baseConfig,
  };
  const prodConfig = {
    mode: 'production',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    ...baseConfig,
  };
  return (isDev) ? devConfig : prodConfig;
};
