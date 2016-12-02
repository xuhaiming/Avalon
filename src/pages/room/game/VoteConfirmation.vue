<template>
  <div class="vote-confirmation-page container">
    <table class="centered striped">
      <thead>
        <tr>
          <th data-field="player_name">Player</th>
          <th data-field="isGoMission">Go Mission</th>
          <th data-field="finalVote">Final Vote</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in room.players">
          <td :class="{ 'teal-text': confirmed(player.name)}">
            {{ player.name }}
            <span v-if="isKing(player.name)">
              <img class="king z-depth-3 responsive-img" src="king.jpg">
            </span>    
          </td>
          <td>
            <span v-if="isPlayerSelected(player.name)">
              <img class="mission-player z-depth-3 circle responsive-img" src="mission-player.jpg">
            </span>
          </td>
          <td>
            <span v-if="isPlayerAccepted(player.name)">
              <img class="mission-player z-depth-3 circle responsive-img" src="approve.jpg">
            </span>
            <span v-else>
              <img class="mission-player z-depth-3 circle responsive-img" src="reject.jpg">
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <p class="flow-text text-big">Vote result: <b>{{ isVoteRejected() ? 'Rejected' : 'passed' }}</b></p>
    <button v-if="!confirmed(user.name)" class="btn" @click="confirmVoteResult">OK</button>

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
    room: state => state.room.current,
    king: state => state.room.current.players[state.room.current.gameStatus.kingIndex]
  }),
  methods: {
    isKing(name) {
      return this.king.name === name
    },
    getSelectedPlayerNames() {
      const missionIndex = this.room.gameStatus.round - 1;
      const currentMission = this.room.gameStatus.missions[missionIndex]

      return currentMission.selectedPlayerNames
    },
    isPlayerSelected(name) {
      const selectedPlayerNames = this.getSelectedPlayerNames();

      return _.indexOf(selectedPlayerNames, name) > -1;
    },
    getCurrentMission() {
      const missionIndex = this.room.gameStatus.round - 1;

      return this.room.gameStatus.missions[missionIndex]
    },
    isPlayerAccepted(name) {
      return _.find(this.getCurrentMission().votes, { name: name, accept: true })
    },
    isVoteRejected() {
      return gameLogic.isVoteRejected(this.getCurrentMission().votes, this.room.players.length) 
    },
    getNextKingIndex() {
      return gameLogic.getNextKingIndex(this.room.gameStatus.kingIndex, this.room.players.length)
    },
    confirmed(name) {
      return _.find(this.room.players, { name }).status === 'voteConfirmed'
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

<style>
.vote-confirmation-page {
  & .mission-player {
    width: 2rem;
  }

  & .king {
    width: 2rem;
    border-radius: 0.3rem;
    vertical-align: middle;
    margin-left: 1rem;
  }
}
</style>