<template>
  <div class="history-page container">
    <h4>History</h4>
    <div class="history-container swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="historyItem in history">
          <div class="round"><b>Round: {{ historyItem.round }}</b></div>

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
                <td>
                  {{ player.name }}
                  <span v-if="room.players[historyItem.king].name === player.name">
                    <img class="king z-depth-3 responsive-img" src="king.jpg">
                  </span>    
                </td>
                <td>
                  <span v-if="isPlayerSelected(player.name, historyItem)">
                    <img class="mission-player z-depth-3 circle responsive-img" src="mission-player.jpg">
                  </span>
                </td>
                <td>
                  <span v-if="isPlayerAccepted(player.name, historyItem)">
                    <img class="mission-player z-depth-3 circle responsive-img" src="approve.jpg">
                  </span>
                  <span v-else>
                    <img class="mission-player z-depth-3 circle responsive-img" src="reject.jpg">
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="swiper-pagination"></div>

    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import gameLogic from '../../../../rules/gameLogic'
import Swiper from 'swiper'

export default {
  name: 'gameHistory',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    history: state => state.room.current.gameStatus.history
  }),
  mounted() {
    new Swiper ('.swiper-container', {
      pagination: '.swiper-pagination'
    })
  },
  methods: {
    isPlayerSelected(name, mission) {
      return _.indexOf(mission.selectedPlayerNames, name) > -1;
    },
    isPlayerAccepted(name, mission) {
      return _.find(mission.votes, { name: name, accept: true })
    }
  }
}
</script>

<style>
.history-page {
  & .round {
    margin-top: 2rem;
  }

  & .mission-player {
    width: 2rem;
  }

  & .king {
    width: 2rem;
    border-radius: 0.3rem;
    vertical-align: middle;
    margin-left: 1rem;
  }

  & .swiper-container {
    height: auto;
  }

  & .swiper-pagination-bullet-active {
    background-color: #26a69a;
  }
}
</style>
