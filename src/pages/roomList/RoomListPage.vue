<template>
  <div class="room-list-page container">
    <div class="row">
      <div class="col s6">
        <p>User: <b>{{user.name}}</b></p>
      </div>
      <div class="col s6">
        <button @click="createRoom" class="btn">Create Room</button>
      </div>
    </div>
    
    <div class="collection with-header">
      <h4 class="collection-header">All Rooms</h4>
      <a class="collection-item" v-for="room in rooms.list" v-if="isNotInRoom(room)" @click="joinRoom(room)">
        {{ room.name }}
        <span>{{room.players.length}} {{ room.players.length > 1 ? 'persons' : 'person' }} in total</span>
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
  computed: mapState([
    'io',
    'user',
    'rooms'
  ]),
  created() {
    if (!this.user.name) {
      this.$router.push('/login')
    } else {
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
  & h4 {
    margin: 0 0;
  }

  & a {
    text-align: left;
    
    & span {
      float: right
    }
  }
}
</style>
