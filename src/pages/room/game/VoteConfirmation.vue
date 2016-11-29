<template>
  <div>
    <div>
      <h4>Mission players:</h4>
      <div v-for="missionPlayer in getCurrentMission().selectedPlayerNames">{{ missionPlayer }}</div>
    </div>
    <h4>Vote result: <b>{{ isVoteRejected() ? 'Rejected' : 'passed' }}</b></h4>
    <div>
      <h5>Players voted accept: </h5>
      <div v-for="vote in getAcceptedVotes()">{{ vote.name }}</div>
      <h5>Players voted reject: </h5>
      <div v-for="vote in getRejectedVotes()">{{ vote.name }}</div>
    </div>
    <h4 v-if="isVoteRejected()">Change <b>{{ room.players[getNextKingIndex()].name }}</b> to select mission players</h4>
    <h4 v-else>Go mission!</h4>
    <h5 v-if="confirmed()">Waiting for others to confirm...</h5>
    <button v-else class="btn" @click="confirmVoteResult">OK</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import gameLogic from '../../../../rules/gameLogic'

export default {
  name: 'gameVoteConfirmation',
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
    getAcceptedVotes() {
      return _.filter(this.getCurrentMission().votes, { accept: true })
    },
    getRejectedVotes() {
      return _.filter(this.getCurrentMission().votes, { accept: false })
    },
    isVoteRejected() {
      return gameLogic.isVoteRejected(this.getCurrentMission().votes, this.room.players.length) 
    },
    getNextKingIndex() {
      return gameLogic.getNextKingIndex(this.room.gameStatus.kingIndex, this.room.players.length)
    },
    confirmed() {
      return _.find(this.room.players, { name: this.user.name }).status === 'voteConfirmed'
    },
    confirmVoteResult() {
      this.io.socket.emit('vote confirm', {
        roomId: this.room.id,
        username: this.user.name
      })
    }
  }
}
</script>
