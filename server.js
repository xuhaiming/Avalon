const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleWare = require("webpack-hot-middleware")
const config = require('./webpack.config')
const _ = require('lodash')

const app = express()
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

let appData = {
    rooms: [],
    users: []
}

io.on('connection', socket => {
  socket.emit('user update', appData.users)

  socket.on('login', name => {
    socket.username = name
    appData.users.push({ name })
    io.sockets.emit('user update', appData.users)    
  })

  socket.on('disconnect', () => {
    _.remove(appData.users, user => user.name === socket.username)
    io.sockets.emit('user update', appData.users)
  })
})

http.listen(1000, () => {
  console.log('Example app listening on port 1000!')
})
