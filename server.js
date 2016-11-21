const express = require('express')
const app = express()
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleWare = require("webpack-hot-middleware")
const config = require('./webpack.config')
const compiler = webpack(config)


app.use(webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    stats: { colors: true }
}));

app.use(webpackHotMiddleWare(compiler))

app.get('/', function (req, res) {
  res.sendfile('index.html')
})

app.listen(1000, function () {
  console.log('Example app listening on port 1000!')
})
