<template>
  <div class="kill-merlin-page container">
    <ul class="collection with-header flow-text text-align-left">
      <li class="collection-header text-big"><b>Kill Merlin</b></li>
      <li class="collection-item" v-for="player in getJusticePlayers()">
        {{ player.name }}
        <div class="pull-right" v-if="isAssassin(user.name)">
          <img v-if="isKilled(player.name)" class="z-depth-2 sword" src="sword.jpg">
          <button v-else class="btn" @click="killMerlin(player.name)">Kill</button>
        </div>
        <div class="pull-right" v-else>
          <img class="z-depth-2 sword" src="sword.jpg" v-if="isKilled(player.name)">
        </div>
      </li>
    </ul>
    <button v-if="isAssassin(user.name)" class="btn" @click="confirmKillMerlin()">Confirm</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import gameLogic from '../../../../rules/gameLogic'

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
        return gameLogic.isJusticePlayer(player)
      })
    },
    killMerlin(name) {
      this.io.socket.emit('kill merlin', {
        roomId: this.room.id,
        playerToKill: name
      })
    },
    confirmKillMerlin() {
      this.io.socket.emit('confirm kill merlin', {
        roomId: this.room.id
      })
    }
  }
}
</script>

<style>
.kill-merlin-page {
  & .sword {
    width: 1.2rem;
    border-radius: 0.5rem;
  }
}
</style>
