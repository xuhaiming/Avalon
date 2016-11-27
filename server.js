const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleWare = require("webpack-hot-middleware")
const config = require('./webpack.config')
const _ = require('lodash')
const shortid = require('shortid')
const missions = require('./rules/missions')

const app = express()
const compiler = webpack(config)

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

app.post('/api/register', (req, res) => {
  const newUser = {
    username: req.body.username,
    password: req.body.password
  }
  
  appData.users.push(newUser)

  res.send(newUser.username)
})

app.post('/api/login', (req, res) => {
  const user = _.find(appData.users, {
    username: req.body.username,
    password: req.body.password
  })

  if(user) {
    res.send({
      status: 'ok',
      username: user.username
    })    
  } else {
    res.send({
      status: 'error',
      message:'username or password is not correct' 
    });
  }
})

io.on('connection', socket => {
  socket.emit('user update', appData.users)

  // socket.on('disconnect', () => {
  //   _.remove(appData.users, user => user.name === socket.username)
  //   io.sockets.emit('user update', appData.users)
  // })

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

    if (_.every(room.players, { status: 'ready'}) && room.players.length >= 5) {
      const roles = _.find(missions, { totalCount: room.players.length }).roles
      const shuffledRoles = _.shuffle(roles)

      shuffledRoles.forEach((role, index) => {
        room.players[index].role = role
      })

      room.status = 'roleConfirmation'
    }
    
    io.to(room.id).emit('room update', room)
  })

  socket.on('confirm role', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    let user = room.players.find(player => player.name === data.username)

    user.status = 'roleConfirmed'

    if (_.every(room.players, { status: 'roleConfirmed' })) {
      room.players = _.shuffle(room.players)
      room.status = 'started'
      room.gameStatus = {
        round: 1,
        step: 'selection',
        kingIndex: 0,
        selectionConfirmed: false,
        missions: [
          {
            selectedPlayerNames: [],
            votes: []
          }
        ],
        history: []
      }
    }

    io.to(room.id).emit('room update', room)
  })

  socket.on('select mission players', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    const missionIndex = room.gameStatus.round - 1;
    let currentMission = room.gameStatus.missions[missionIndex]

    currentMission.selectedPlayerNames = data.selectedPlayerNames

    io.to(room.id).emit('room update', room)
  })

  socket.on('update selection confirmation', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    const missionIndex = room.gameStatus.round - 1;
    let currentMission = room.gameStatus.missions[missionIndex]

    room.gameStatus.selectionConfirmed = data.selectionConfirmed
    currentMission.votes = []

    io.to(room.id).emit('room update', room)
  })

  socket.on('vote', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    const missionIndex = room.gameStatus.round - 1;
    let currentMission = room.gameStatus.missions[missionIndex]

    currentMission.votes.push({
      name: data.username,
      accept: data.accept
    })

    if (currentMission.votes.length === room.players.length) {
      room.gameStatus.step = 'voted'
    }

    io.to(room.id).emit('room update', room)
  })
})

http.listen(2000, () => {
  console.log('Avalon app is running on port 2000!')
})
