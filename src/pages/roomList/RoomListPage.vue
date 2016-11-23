<template>
  <div class="room-list-page">
    <p>Your name: {{user.name}}</p>
    <button @click="createRoom">Create Room</button>
    <p>Rooms</p>
    <div v-for="room in rooms.list">
      <h3>{{ room.name }}</h3>
      <button v-if="isNotInRoom(room)" @click="joinRoom(room)">Join</button>
      <p v-for="player in room.players">{{ player.name }}</p>
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
    createRoom() {
      this.io.socket.emit('create room', this.user.name, room => {
        this.$store.dispatch('room_setCurrent', room)
        this.$router.push(`/rooms/${room.id}`)
      })
    },
    joinRoom(room) {
      this.io.socket.emit('join room', {
        id: room.id,
        username: this.user.name
      })
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
