'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const multiConfig = require('./multi.conf')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: multiConfig.process.assetsSubDirectory,
    assetsPublicPath: multiConfig.process.assetsPublicPath,
    proxyTable: {
      '/mj': {
        // 目标 API 地址
        // target: 'http://10.82.8.57:6092/',
        target: 'http://127.0.0.1:6092',
        // target: 'http://10.82.8.64:9092/',
        // 如果要代理 websockets
        // ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/mj': '/'
        }
      },
      '/systemAA': {
        // 目标 API 地址
        // target: 'http://10.82.8.57:9909/',
        target: 'http://127.0.0.1:9909',
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/systemAA': '/'
        }
      },
      '/system': {
        // 目标 API 地址
        target: 'http://10.82.8.57:6092/',
        // target: 'http://127.0.0.1:6092',
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/system': '/'
        }
      },
      '/arcgisServer': {
        // 目标 API 地址
        target: ' http://10.1.3.71:8084',
        //target: 'http://10.82.8.57:8084/',
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/arcgisServer': '/'
        }
      },
      '/mhd': {
        // 目标 API 地址
        target: 'http://10.82.8.57:9081/',
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/mhd': '/'
        }
      },
      '/newsPath': {
        // 目标 API 地址
        target: 'http://10.1.100.158:9527/',
        //target: 'http://10.82.8.57:9527/',
        // 如果要代理 websockets
        ws: true,
        // 将主机标头的原点更改为目标URL
        changeOrigin: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/newsPath': '/'
        }
      },
      '/material': {
        // 目标 API 地址
        target: 'http://10.82.8.16:8085/',
        //target: 'http://10.82.8.57:8085/',
        // 如果要代理 websockets
        ws: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/material': '/'
        }
      },
      '/pushXg': {
        // 目标 API 地址
        target: 'http://10.1.3.59:8030/',
        //tartget: 'http://localhost:8030',
        // 如果要代理 websockets
        ws: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/pushXg': '/'
        }
      },
      '/JWRG': {
        // 目标 API 地址
        target: 'http://10.1.3.71:8088/',
        // 如果要代理 websockets
        ws: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/JWRG': '/'
        }
      },
      '/metadataExportZip': {
        // 目标 API 地址
        target: 'Z\\shareJGF\\metadataExport\\',
        // 如果要代理 websockets
        ws: true,
        pathRewrite: {
          // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
          '^/metadataExportZip': '/'
        }
      },
    },

    // Various Dev Server settings
    host: multiConfig.process.host, // can be overwritten by process.env.HOST
    port: multiConfig.process.port, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpa                                                                                                                                                                                                                                                                                                                                                                                                                                                 ck.js.org/configuration/dev-server/#devserver-watchoptions-
    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: multiConfig.process.index,

    // Paths
    assetsRoot: multiConfig.process.assetsRoot,
    assetsSubDirectory: multiConfig.process.assetsSubDirectory,
    assetsPublicPath: multiConfig.process.assetsPublicPath,

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,

    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
