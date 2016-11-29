<template>
  <div class="kill-merlin-page container">
    <ul class="collection with-header flow-text text-align-left">
      <li class="collection-header text-big"><b>Kill Merlin</b></li>
      <li v-if="isAssassin(user.name)" class="collection-item" v-for="player in getJusticePlayers()">
        {{ player.name }}
        <button class="btn pull-right" @click="killMerlin(player.name)">Kill</button>
      </li>
      <li v-else class="collection-item" v-for="player in getJusticePlayers()">
        {{ player.name }}
        <button v-if="isKilled(player.name)" class="btn pull-right">oh no</button>
      </li>
    </ul>
    <button v-if="isAssassin(user.name)" class="btn" @click="confirmKillMerlin()">Confirm</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'gameKillMerlin',
  computed: mapState({
    room: state => state.room.current,
    io: 'io',
    user: 'user'
  }),
  methods: {
    isAssassin(name) {
      return _.find(this.room.players, { name: name, role: 'assassin' })
    },
    isKilled(name) {
      return this.room.gameStatus.playerNameToKill === name
    },
    getJusticePlayers() {
      return _.filter(this.room.players, player => {
        return _.indexOf(['justice', 'merlin', 'percivale'], player.role) > -1
      })
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
