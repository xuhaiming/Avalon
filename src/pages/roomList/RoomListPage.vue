<template>
  <div class="room-list-page container">
    <div class="row user-info">
      <div class="col s6">
        <p>{{ labels.user }}<b>{{user.name}}</b></p>
      </div>
      <div class="col s6">
        <button @click="createRoom" class="create-button btn-floating right hoverable">+</button>
      </div>
    </div>
    
    <div class="collection with-header">
      <h4 class="collection-header">{{ labels.allRooms }}</h4>
      <a class="collection-item" v-for="room in rooms.list" v-if="isNotInRoom(room)" @click="joinRoom(room)">
        {{ room.name }}{{ labels.roomName }}
        <span>{{ room.players.length }} {{ labels.players }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import axios from 'axios'

export default {
  name: 'roomListPage',
  computed: mapState({
    io: 'io',
    user: 'user',
    rooms: 'rooms',
    labels: state => state.labels.current.roomList
  }),
  created() {
    if (!this.user.name) {
      this.$router.push('/login')
    } 

    if (this.rooms.list.length === 0) {
      this.getRooms()
    }
  },
  methods: {
    navigateToRoom(room) {
      this.$store.dispatch('room_setCurrent', room)
      this.$router.push(`/rooms/${room.id}`)
    },
    createRoom() {
      this.io.socket.emit('create room', this.user.name, this.navigateToRoom)
    },
    joinRoom(room) {
      this.io.socket.emit('join room', {
        id: room.id,
        username: this.user.name
      }, this.navigateToRoom)
    },
    isNotInRoom(room) {
      return !_.find(room.players, player => player.name === this.user.name)
    },
    getRooms() {
      axios.get('/api/rooms')
        .then(response => {
          this.$store.dispatch('rooms_update', response.data)
        })
    }
  }
}
</script>

<style>
.room-list-page{
  & .create-button {
    font-size: 1.5rem;
  }

  & .user-info {
    & p {
      text-align: left;
    }
  }

  & .collection-header {
    font-size: 1.2rem;
  }

  & h4 {
    margin: 0 0;
  }

  & a {
    text-align: left;
    cursor: pointer;
    
    & span {
      float: right
    }
  }
}
</style>
