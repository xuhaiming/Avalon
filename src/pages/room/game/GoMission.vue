<template>
  <div class="go-mission-page">
    <div v-if="allMissionPlayersVoted()">
      <p class="flow-text text-big">
        <h5><b>{{ isMissionSucceed() ? 'Success!' : 'Failed!'}}</b></h5>
        <div>
          <img v-if="isMissionSucceed()" class="z-depth-1 responsive-img" src="mission-success.jpg">
          <img v-else class="z-depth-1 responsive-img" src="mission-fail.jpg">
        </div>
      </p>
      <div class="row">
        <div class="col s6">
          <img class="mission-player small z-depth-3 circle responsive-img" src="mission-support.jpg">
          <span class="mission-result-text">X <b>{{ getMissionResultCount(true) }}</b></span>
        </div>
        <div class="col s6">
          <img class="mission-player small z-depth-3 circle responsive-img" src="mission-destroy.jpg">
          <span class="mission-result-text">X <b>{{ getMissionResultCount(false) }}</b></span>
        </div>
      </div>
      <p class="flow-text text-big" v-if="hasConfirmedMissionResult()">
        <span>Waiting for </span> 
        <span>{{ getUnconfirmedPlayerNames() }}</span>
        <span> to confirm...</span>
      </p>
      <button v-else class="btn" @click="confirmMissionResult">OK</button>
    </div>

    <div v-else>
      <ul class="collection with-header flow-text text-align-left">
        <li class="collection-header text-big"><b>Go Mission</b></li>
        <li class="collection-item" v-for="missionPlayerName in getCurrentMission().selectedPlayerNames">
          <span>{{ missionPlayerName }}</span>
          <span class="pull-right">{{ !getMissionPlayerVote(missionPlayerName) ? 'waiting' : 'done' }}</span>  
        </li>
      </ul>
      <div v-if="isSelectedPlayer() && !getMissionPlayerVote(user.name)">
        <button class="btn mission-button" @click="goMission(true)">
          <img class="mission-player z-depth-3 circle responsive-img" src="mission-support.jpg">
        </button>
        <button class="btn mission-button" @click="goMission(false)">
          <img class="mission-player z-depth-3 circle responsive-img" src="mission-destroy.jpg">
        </button>
      </div>
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
    },
    getUnconfirmedPlayerNames() {
      const unconfirmedPlayers = _.filter(this.room.players, player => player.status !== 'missionResultConfirmed')

      return _.map(unconfirmedPlayers, 'name').join(', ')
    }
  }
}
</script>

<style>
.go-mission-page {
  & .mission-button {
    padding: 0.8rem 0.5rem;
    padding-bottom: 0;
    margin: 1rem;
    background-color: transparent;
    width: auto;
    height: auto;
    border-radius: 1rem;

    &:hover, &:active {
      background-color: transparent;
    }

    & img {
      width: 5rem;
      height: 5rem;
    }
  }

  & .mission-player.small {
    width: 4rem;
    height: 4rem;
    vertical-align: middle;
  }

  & .mission-result-text {
    font-size: 1.5rem;
    vertical-align: middle;
  }
}
</style>