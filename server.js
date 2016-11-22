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

app.get('/api/rooms', (req, res) => {
  res.send(appData.rooms)
})

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

  socket.on('create room', username => {
    appData.rooms.push({
      host: username,
      name: `${username}'s game`,
      players: [{
        name: username
      }],
      status: 'created'
    })
    io.sockets.emit('rooms update', appData.rooms)
  })

  socket.on('join room', data => {
    appData.rooms.find(room => room.host === data.host).players.push({
      name: data.username
    })
    io.sockets.emit('rooms update', appData.rooms)
  })
})

http.listen(2000, () => {
  console.log('Avalon app is running on port 2000!')
})
