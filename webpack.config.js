const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require('fs')

const PAGES_DIR = path.resolve(__dirname, 'src/pages');
const PAGES_PATHS = fs.readdirSync(path.resolve(__dirname, 'src/pages'));
const entryPoints = PAGES_PATHS.reduce((accum, current) => {
  accum[current] = PAGES_DIR + '/' + current + '/' + current + '.js';
  return accum;
}, {});
const HTMLtemples = PAGES_PATHS.map(item => {
  return new HtmlWebpackPlugin({
    filename: item + '.html',
    template: PAGES_DIR + '/' + item + '/' + item + '.pug',
    chunks: [item],
    inject: 'body'
  })
});

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: entryPoints,
  output: {
    filename: './js/[name].[contenthash].js',
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
    .concat(HTMLtemples),
  module: {
    rules: [
      {
        test: /\.pug$/,
        use: [
          {
            loader: 'html-loader'
          },
          {
            loader: 'pug-html-loader',
            options: { pretty: true },
          }
        ]
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
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ],
  },
};