<template>
  <div>
    <div>
      <h4>Go Mission</h4>
      <div v-for="missionPlayerName in getCurrentMission().selectedPlayerNames">
        <span>{{ missionPlayerName }}</span>
        <span>{{ !getMissionPlayerVote(missionPlayerName) ? 'waiting' : 'done' }}</span>
      </div>
      <div v-if="isSelectedPlayer() && !getMissionPlayerVote(user.name)">
        <button class="btn" @click="supportMission">Success</button>
        <button class="btn" @click="destroyMission">Destroy</button>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'gameGoMission',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current
  }),
  methods: {
    getCurrentMission() {
      const missionIndex = this.room.gameStatus.round - 1;

      return this.room.gameStatus.missions[missionIndex]
    },
    getMissionPlayerVote(name) {
      return _.find(this.getCurrentMission().results, { name })
    },
    isSelectedPlayer() {
      return _.find(this.getCurrentMission().selectedPlayerNames, name => name === this.user.name)
    },
    supportMission() {
      this.io.socket.emit('go mission', {
        roomId: this.room.id,
        username: this.user.name,
        success: true
      })
    },
    destroyMission() {
      this.io.socket.emit('go mission', {
        roomId: this.room.id,
        username: this.user.name,
        success: false
      })
    }
  }
}
</script>