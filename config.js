// see https://cli.vuejs.org/zh/config/#outputdir
// see http://vuejs-templates.github.io/webpack for documentation.

var path = require('path')

module.exports = {
  build: {
    env: process.env.production,
    publicPath: '/mobile-game-web/views/v1/',
    // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录
    outputDir: '',
    title: '移动端游戏',
    favicon: path.resolve(__dirname, '../public/favicon.ico')
  },
  dev: {
    env: process.env.development,
    port: 8083,
    publicPath: '/',
    title: '移动端游戏',
    favicon: path.resolve(__dirname, '../public/favicon.ico')
  }
}