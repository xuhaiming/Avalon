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

const http = require('http').Server(app)
const io = require('socket.io')(http)

app.get('/', (req, res) => {
  res.sendfile('index.html')
})

io.on('connection', socket => {
  console.log('a user connected');
  socket.on('chat message', msg => {
    console.log('message: ' + msg);
  });
});

http.listen(1000, () => {
  console.log('Example app listening on port 1000!')
})
