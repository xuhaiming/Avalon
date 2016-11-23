const express = require('express')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleWare = require("webpack-hot-middleware")
const config = require('./webpack.config')
const _ = require('lodash')
const shortid = require('shortid')

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

  socket.on('create room', (username, callback) => {
    const newRoom = {
      id: shortid.generate(),
      host: username,
      name: `${username}'s game`,
      players: [{
        name: username,
        status: 'joined'
      }],
      status: 'created'
    }

    appData.rooms.push(newRoom)
    callback(newRoom)

    io.sockets.emit('rooms update', appData.rooms)

    socket.join(newRoom.id)
  })

  socket.on('join room', (data, callback) => {
    let joinedRoom = appData.rooms.find(room => room.id === data.id)

    joinedRoom.players.push({
      name: data.username,
      status: 'joined'
    })
    callback(joinedRoom)

    io.sockets.emit('rooms update', appData.rooms)

    socket.join(joinedRoom.id)
    io.to(joinedRoom.id).emit('room update', joinedRoom)
  })

  socket.on('user ready', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    let user = room.players.find(player => player.name === data.username)

    user.status = 'ready'
    
    io.to(room.id).emit('room update', room)
  })
})

http.listen(2000, () => {
  console.log('Avalon app is running on port 2000!')
})
