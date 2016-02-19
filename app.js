'use strict'
const koa = require('koa')
const compress = require('koa-compress')
const logger = require('koa-logger')
const staticCache = require('koa-static-cache')
const _ = require('koa-route')
const router = require('koa-router')()
const json = require('koa-json')
const session = require('koa-generic-session')
const bodyparser = require('koa-bodyparser')
const gzip = require('koa-gzip')
const path = require('path')
const Jade = require('koa-jade')
const request = require('co-request')
const favicon = require('koa-favicon')

const cdn = require('./config').cdn

const app = module.exports = koa()

app.use(gzip())

var hash = ''
if (process.env.NODE_ENV == 'production') {
  // 生产用 ↓ ↓ ↓
  hash = require('./public/app/stats.json').hash
  // 生产用 ↑ ↑ ↑
} else {
  // 开发用 ↓ ↓ ↓
  const webpack = require('webpack')
  const webpackDevMiddleware = require('koa-webpack-dev-middleware')
  const webpackHotMiddleware = require('koa-webpack-hot-middleware')
  const webpackConfig = require('./webpack.config.development')
  const compiler = webpack(webpackConfig)
  compiler.plugin("done", function(stats) {
    console.log(`编译完成 hash:${stats.hash}`)
  })
  app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath, stats: { colors: true } }))
  app.use(webpackHotMiddleware(compiler, { log: console.log }))
  // 开发用 ↑ ↑ ↑
}

function *sendMain () {
  this.render('main', {
    cdn,
    hash,
    env: process.env.NODE_ENV
  })
}
router.get('/*', sendMain)

app.use(_.get('/login', sendMain))
app.use(router.routes())
// Compress
app.use(compress())

if (!module.parent) {
  const port = process.env.PORT || 3000
  app.listen(port)
  console.log(`listening on port ${port}`)
}
