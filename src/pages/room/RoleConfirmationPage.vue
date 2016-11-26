<template>
  <div>
    <h4>You are {{ currentUser.role }}</h4>
    <h5>You can see</h5>
    <p v-for="personCanSee in getPlayersCanSee()">{{ personCanSee.name }}</p>
    <button @click="conformRole">Confirm</button>
    <div v-for="player in room.players">
      <span>{{ player.name }}: </span>
      <span>{{ getPlayerStatus(player.status) }}</span>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import roles from '../../../rules/roles'
import InitialPage from './InitialPage.vue'

export default {
  name: "roomRoleConfirmationPage",
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
        offline: 'offline',
        roleConfirmed: 'confirmed'
      }

      return statusMapping[status]
    },
    getPlayersCanSee() {
      const players = this.room.players
      const rolesCanSee = roles[this.currentUser.role].canSee
      const playersCanSee = _.filter(players, player => _.includes(rolesCanSee, player.role))

      return playersCanSee
    },
    conformRole() {
      this.io.socket.emit('confirm role', {
        roomId: this.room.id,
        username: this.user.name
      })
    }
  }
}
</script>
