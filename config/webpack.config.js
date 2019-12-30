const {
  join
} = require('path');
const glob = require('glob');
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default;
const PurifyCSSPlugin = require('purifycss-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackMerge = require('webpack-merge');
var setIterm2Badge = require('set-iterm2-badge');
const argv = require("yargs-parser")(process.argv.slice(2));
const _mode = argv.mode || "development";
const _isdev = _mode === 'development';
const _mergeConfig = require(`./webpack.${_mode}.config.js`);
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
setIterm2Badge(_mode);
const webpackConfig = {
  entry: {
    main: [join(__dirname, '../src/main.js')]
  },
  module: {
    rules: [{
      test: /\.css$/i,
      use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true,
            hmr: _isdev,
            publicPath: "../"
            // reloadAll: true,
          },
        },
        // "style-loader",
        "css-loader",
      ],
    }, {
      test: /\.(jpg|png|jpeg)$/,
      loader: 'url-loader',
      options: {
        limit: 8192,
        name: 'img/[name].[hash:5].[ext]'
      }
    }]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new WebpackDeepScopeAnalysisPlugin(),
    new MiniCssExtractPlugin({
      filename: _isdev ? 'style/[name].css' : 'style/[name].[hash:5].css',
      chunkFilename: _isdev ? 'style/[id].css' : 'style/[id].[hash:5].css',
      ignoreOrder: false, // Enabl e to remove warnings about conflicting order
    }),
    new PurifyCSSPlugin({ //CSS tree shaking
      paths: glob.sync(join(__dirname, '../src/*.html')),
    }),
    new HtmlWebpackPlugin({
      minify: {
        removeComments: true, //移除html注释
        collapseWhitespace: true, //删除空格符和换行符
        minifyCSS: true //压缩内联css
      },
      filename: 'index.html',
      template: join(__dirname, '../src/index.html')
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: "initial",
          name: "common",
          minChunks: 1,
          maxInitialRequests: 5,
          minSize: 0
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  devServer: {
    contentBase: join(__dirname, '../dist'),
    port: 80,
    host: '0.0.0.0',
    hot: true,
    compress: true,
    // before(app) {
    //   app.get("/api/test", (req, res) => {
    //     res.json({
    //       code: 200,
    //       data: 'test'
    //     })
    //   })
    // }
  },
}
module.exports = webpackMerge(webpackConfig, _mergeConfig)