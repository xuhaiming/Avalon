const express = require('express')
const bodyParser = require('body-parser')
const webpack = require('webpack')
const webpackMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleWare = require("webpack-hot-middleware")
const config = require('./webpack.config')
const _ = require('lodash')
const shortid = require('shortid')
const missions = require('./rules/missions')
const gameLogic = require('./rules/gameLogic')

const app = express()
const compiler = webpack(config)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
  const existUser = _.find(appData.users, { username: req.body.username })

  if (existUser) {
    return res.status(400).send({ error: 'User existed.' })
  }

  appData.users.push({
    username: req.body.username,
    password: req.body.password
  })

  return res.send(req.body.username)
})

io.on('connection', socket => {
  socket.on('login', (data, callback) => {
    const user = _.find(appData.users, {
      username: data.username,
      password: data.password
    })

    if (user) {
      const inProgressRoom = _.find(appData.rooms, room => _.find(room.players, { name: data.username }))

      if (inProgressRoom) {
        socket.join(inProgressRoom.id)
      }

      return callback({ username: user.username })    
    }

    return callback({ error:'Incorrect username or password' })
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

    if (_.every(room.players, { status: 'ready'}) && room.players.length >= 5 && room.players.length <= 10) {
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
            votes: [],
            results: []
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

  socket.on('vote confirm', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    let user = room.players.find(player => player.name === data.username)
    const missionIndex = room.gameStatus.round - 1;
    let currentMission = room.gameStatus.missions[missionIndex]

    user.status = 'voteConfirmed'

    if (_.every(room.players, { status: 'voteConfirmed' })) {
      if (gameLogic.isVoteRejected(currentMission.votes, room.players.length)) {
        room.gameStatus.history.push(Object.assign({}, {
          round: room.gameStatus.round,
          selectedPlayerNames: currentMission.selectedPlayerNames,
          votes: currentMission.votes
        }))

        room.gameStatus.step = 'selection'
        currentMission.selectedPlayerNames = []
        currentMission.votes = []
        room.gameStatus.selectionConfirmed = false
        room.gameStatus.kingIndex = gameLogic.getNextKingIndex(room.gameStatus.kingIndex, room.players.length)

        room.players.forEach(player => player.status = 'selecting')
      } else {
        room.gameStatus.step = 'goMission'
      }
    }

    io.to(room.id).emit('room update', room)
  })

  socket.on('go mission', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    const missionIndex = room.gameStatus.round - 1;
    let currentMission = room.gameStatus.missions[missionIndex]

    currentMission.results.push({
      name: data.username,
      success: data.success
    })

    io.to(room.id).emit('room update', room)
  })

  socket.on('confirm mission result', data => {
    let room = appData.rooms.find(room => room.id === data.roomId)
    let user = room.players.find(player => player.name === data.username)
    const missionIndex = room.gameStatus.round - 1;
    let currentMission = room.gameStatus.missions[missionIndex]

    user.status = 'missionResultConfirmed'

    if (_.every(room.players, { status: 'missionResultConfirmed' })) {
      room.gameStatus.history.push(Object.assign({}, {
        round: room.gameStatus.round,
        selectedPlayerNames: currentMission.selectedPlayerNames,
        votes: currentMission.votes,
        results: currentMission.results
      }))

      room.gameStatus.round++
      room.gameStatus.step = 'selection'
      room.gameStatus.selectionConfirmed = false
      room.gameStatus.kingIndex = gameLogic.getNextKingIndex(room.gameStatus.kingIndex, room.players.length)

      room.players.forEach(player => player.status = 'selecting')

      room.gameStatus.missions.push({
        selectedPlayerNames: [],
        votes: [],
        results: []
      })
    }

    io.to(room.id).emit('room update', room)
  })
})

http.listen(2000, () => {
  console.log('Avalon app is running on port 2000!')
})
