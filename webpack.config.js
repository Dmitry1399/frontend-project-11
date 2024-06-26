// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from 'node:path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { fileURLToPath } from 'url';
import autoprefixer from 'autoprefixer';

const isProduction = process.env.NODE_ENV === 'production';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const config = {
  entry: path.resolve(dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  devServer: {
    open: true,
    host: 'localhost',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(dirname, 'index.html'),
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: [
          {
            // Adds CSS to the DOM by injecting a `<style>` tag
            loader: 'style-loader',
          },
          {
            // Interprets `@import` and `url()` like `import/require()` and will resolve them
            loader: 'css-loader',
          },
          {
            // Loader for webpack to process CSS with PostCSS
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  autoprefixer,
                ],
              },
            },
          },
          {
            // Loads a SASS/SCSS file and compiles it to CSS
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
};

export default () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
