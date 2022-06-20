const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require('fs')

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const filename = (ext) => isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`;

const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PAGES_PATHS = fs.readdirSync(path.resolve(__dirname, 'src/pages'));
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

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: entryPoints,
  output: {
    filename: `./js/${filename('js')}`,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    clean: true,
  },

  devServer: {
    port: 4200
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].[contenthash].css'
    }),
  ]
      .concat(HTML_templates),
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
        use: ['style-loader', 'css-loader'],
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
        test: /\.(png|jpe?g)$/i,
        type: 'asset/resource',
        exclude: /favicons/,
        generator: {
          filename: './assets/images/[contenthash][ext]'
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico|webmanifest|xml)$/i,
        type: 'asset/resource',
        exclude: /images/,
        generator: {
          filename: './assets/favicons/[contenthash][ext]'
        },
      },
    ],
  },
};
