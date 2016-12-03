<template>
  <div class="round-status">
    <span v-for="(status, index) in getRoundStatus()">
      <span 
        class="circle z-depth-1 round-status_item darken-2"
        :class="{ red: status.fail, blue: status.success, grey: status.current, orange: isSpecialRound(index) }"
      >
        {{ getCurrentMission().goMissionCounts[index] }}
      </span>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import gameLogic from '../../../../rules/gameLogic'
import missionConfig from '../../../../rules/missions'

export default {
  name: 'gameRoundStatus',
  computed: mapState({
    room: state => state.room.current,
  }),
  methods: {
    getRoundStatus() {
      let roundStatus = [{}, {}, {}, {}, {}]
      const currentRound = this.room.gameStatus.round
      const missions = this.room.gameStatus.missions
      const playerCount = this.room.players.length

      for (let index = 0; index < currentRound -1; index++) {
        if (gameLogic.isMissionSucceed(missions[index].results, playerCount, index + 1)) {
          roundStatus[index].success = true
        } else {
          roundStatus[index].fail = true
        }
      }

      roundStatus[currentRound - 1].current = true

      return roundStatus
    },
    getCurrentMission() {
      return _.find(missionConfig, { totalCount: this.room.players.length })
    },
    isSpecialRound(index) {
      return this.getCurrentMission().evilsAllowed[index] === 1
    }
  }
}
</script>

<style>
.round-status {
  &_item {
    width: 2rem;
    height: 2rem;
    border: 1px solid #e0e0e0;
    display: inline-block;
    margin: 0.5rem;
    line-height: 2rem;

    &.red,
    &.blue,
    &.grey,
    &.orange {
      color: white;
    }
  }
}
</style>
