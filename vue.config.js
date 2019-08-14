// 上传指定服务器
const HttpPushWebpackPlugin = require('http-push-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const InlineSourcePlugin = require('html-webpack-inline-source-plugin')
const webpack = requrie('webpack')
const packageInfo = require('./package.json')
const path = require('path')


const IS_PROD = process.env.NODE_ENV === 'production'


module.exports = {
  configureWebpack: config => {
    // alias
    config.resolve.alias = {
      '@': path.resolve('src')
    }
  },
  assetsDir: 'public',
  css: {
    sourceMap: true
  }
}