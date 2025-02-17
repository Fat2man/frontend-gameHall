const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const name = '专业在线聊天室' // page title
module.exports = {
  publicPath: './',
  lintOnSave: false,
  transpileDependencies: [],
  devServer: {
    open: true,
    port: 8080,
    disableHostCheck: true,
    host: '0.0.0.0',
    hot: true,
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  }
}   