<template>
  <div>
    <div>
      <h4>Go Mission</h4>
      <div v-for="missionPlayerName in getCurrentMission().selectedPlayerNames">
        <span>{{ missionPlayerName }}</span>
        <span>{{ !getMissionPlayerVote(missionPlayerName) ? 'waiting' : 'done' }}</span>
      </div>
      <div v-if="isSelectedPlayer() && !getMissionPlayerVote(user.name)">
        <button class="btn" @click="goMission(true)">Success</button>
        <button class="btn" @click="goMission(false)">Destroy</button>
      </div>
      <div v-if="allMissionPlayersVoted()">
        <h4>Result: <b>{{ isMissionSucceed() ? 'success' : 'failed'}}</b></h4>
        <div>Success: {{ getMissionResultCount(true) }}</div>
        <div>Fail: {{ getMissionResultCount(false) }}</div>

        <h5 v-if="hasConfirmedMissionResult()">Waiting for other players to confirm...</h5>
        <button v-else class="btn" @click="confirmMissionResult">OK</button>
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import gameLogic from '../../../../rules/gameLogic'

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
    allMissionPlayersVoted() {
      return this.getCurrentMission().results.length === this.getCurrentMission().selectedPlayerNames.length
    },
    getMissionResultCount(success) {
      return _.filter(this.getCurrentMission().results, { success }).length
    },
    isMissionSucceed() {
      return gameLogic.isMissionSucceed(this.getCurrentMission().results, this.room.players.length, this.room.gameStatus.round)
    },
    goMission(success) {
      this.io.socket.emit('go mission', {
        roomId: this.room.id,
        username: this.user.name,
        success
      })
    },
    confirmMissionResult() {
      this.io.socket.emit('confirm mission result', {
        roomId: this.room.id,
        username: this.user.name
      })
    },
    hasConfirmedMissionResult() {
      return _.find(this.room.players, { name: this.user.name }).status === 'missionResultConfirmed'
    }
  }
}
</script>
