<template>
  <div id="room">
      <h2>{{ room.name }}</h2>
      <div v-if="room.status === 'created'">
        <h4>Players</h4>
        <div v-for="player in room.players">
          <span>{{ player.name }}: </span>
          <span>{{ getPlayerStatus(player.status) }}</span>
        </div>
        <button @click="ready">ready</button>
      </div>

      <div v-if="room.status === 'started'">
        <h4>You are {{ currentUser.role }}</h4>
        <h5>You can see</h5>
        <p></p>
      </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import roles from '../../../rules/roles'

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
    room: state => state.room.current,
    currentUser: state => _.find(state.room.current.players, { name: state.user.name })
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
