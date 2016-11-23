<template>
  <div id="room">
      <h2>{{ room.name }}</h2>
      <h4>Players</h4>
      <div v-for="player in room.players">
        <span>{{ player.name }}: </span>
        <span>{{ getPlayerStatus(player.status) }}</span>
      </div>
      <button @click="ready">ready</button>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: "roomPage",
  created() {
    if (!this.user.name) {
      this.$router.push('/login')
    }
  },
  computed: mapState({
    io: 'io',
    user: 'user',
    name: 'name',
    room: state => state.room.current
  }),
  methods: {
    getPlayerStatus(status) {
      const statusMapping = {
        joined: 'not ready',
        ready: 'ready',
        offline: 'offline'
      }

      return statusMapping[status]
    },
    ready() {
      this.io.socket.emit('user ready', {
        roomId: this.room.id,
        username: this.user.name
      })
    }
  }
}
</script>
