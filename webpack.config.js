const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const FilemanagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    entry: {
        site: './src/scss/site.scss',
        pdf: './src/scss/pdf.scss',
        nonblocking: './src/scripts/nonblocking.js'
    },
    output: {
        path: path.resolve(__dirname, '_site/assets'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/i,
                use: [MiniCssExtractPlugin.loader, {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                }, 'sass-loader']
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
          filename: '[name].css',
        }),
        new PurgecssPlugin({
          paths: glob.sync('./_site/*',  { nodir: true }),
          safelist: {
              standard: [ 'highlight-ref', 'sticky', 'position-absolute' ],
              greedy: [ /skill-ref/i ]
          }
        }),
        new FilemanagerPlugin({
            events: {
                onEnd: {
                    delete: [
                        './_site/assets/site.js',
                        './_site/assets/pdf.js'
                    ]
                }
            }
        })
    ]
};
