<template>
  <div>
    <h4>Kill Merlin</h4>
    <div v-for="player in getJusticePlayers()">
      <span>{{ player.name }}</span>
      <button class="btn" @click="killMerlin(player.name)">Kill</button>
    </div>
    <button class="btn" @click="confirmKillMerlin()">Confirm</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'gameKillMerlin',
  computed: mapState({
    room: state => state.room.current,
    io: 'io'
  }),
  methods: {
    getJusticePlayers() {
      return _.filter(this.room.players)
    },
    killMerlin(name) {
      this.io.socket.emit('kill merlin', {
        roomId: this.room.id,
        playerToKill: name
      })
    },
    confirmKillMerlin() {
      this.io.socket.emit('go mission', {
        roomId: this.room.id
      })
    }
  }
}
</script>
