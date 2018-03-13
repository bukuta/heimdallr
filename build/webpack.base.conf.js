var fs = require('fs');
var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

//let p = resolve('src/mould/src');
//let rp = fs.realpathSync(p);
//console.log(p,rp);

module.exports = {
  entry: {
    app: './src/admin/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue': 'vue/dist/vue.js',
      '@': resolve('src'),
      '$app': resolve('src/admin'),
      '$mock': resolve('test/mock'),
      '$pages': resolve('src/admin/views/pages'),
      '$models': resolve('src/admin/models'),
      '$config': resolve('src/admin/config'),
      '$styles': resolve('src/admin/styles'),
      '$utils': resolve('src/admin/utils'),
      '$services': resolve('src/admin/services'),
      '$mould': resolve('src/mm2/src'),
      '$mouldtest': resolve('src/mm2/test'),
      '$example': resolve('src/mm2/test/example'),
      //'$mould': fs.realpathSync(resolve('src/mould/src')),
      //'$mouldtest': fs.realpathSync(resolve('src/mould/test')),
      '$src/casual': resolve('src/mould/src'),
    }
  },
  module: {
    rules: [
      //{
      //test: /\.(js|vue)$/,
      //loader: 'eslint-loader',
      //enforce: 'pre',
      //include: [resolve('src'), resolve('test')],
      //exclude: [
      //resolve(__dirname, 'src/lib')
      //],
      //options: {
      //failOnError: true,
      //formatter: require('eslint-friendly-formatter')
      //}
      //},
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: vueLoaderConfig
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('src/mould'),resolve('test')],
        exclude:/node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.css-$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:8]'
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  require('postcss-nested')(),
                  require('autoprefixer')({
                    browsers: ['last 2 versions', 'ie 9', 'Firefox > 20']
                  }),
                  require('csswring')()
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
