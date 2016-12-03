<template>
  <div class="game-page">
    <round-status />
    
    <div v-if="game.tab === 'history'">
      <history />
    </div>

    <div class="container" v-if="game.tab === 'role'">
      <role-info />
    </div>

    <div v-if="game.tab === 'game'">
      <div v-if="room.gameStatus.step === 'selection'">
        <player-selection />
      </div>

      <div v-if="room.gameStatus.step === 'voted'">
        <vote-confirmation />
      </div>

      <div v-if="room.gameStatus.step === 'goMission'">
        <go-mission />
      </div>

      <div v-if="room.gameStatus.step === 'killMerlin'">
        <kill-merlin />
      </div>
    </div>

    <div class="function-bar">
      <img class="function-bar_item z-depth-4 circle" src="vote.jpg" @click="switchTab('game')">
      <img class="function-bar_item z-depth-4 circle" src="role.jpg" @click="switchTab('role')">
      <img class="function-bar_item z-depth-4 circle" src="history.jpg" @click="switchTab('history')">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RoundStatus from './game/RoundStatus.vue'
import PlayerSelection from './game/PlayerSelection.vue'
import VoteConfirmation from './game/VoteConfirmation.vue'
import GoMission from './game/GoMission.vue'
import KillMerlin from './game/KillMerlin.vue'
import History from './game/History.vue'
import RoleInfo from './game/RoleInfo.vue'

export default {
  name: 'roomGamePage',
  computed: mapState({
    room: state => state.room.current,
    game: 'game'
  }),
  methods: {
    switchTab(tab) {
      this.$store.dispatch('game_setTab', tab)
    }
  },
  components: {
    RoundStatus,
    PlayerSelection,
    VoteConfirmation,
    GoMission,
    KillMerlin,
    History,
    RoleInfo
  }
}
</script>

<style>
.game-page {
  & .function-bar {
    margin: 1rem 0;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;

    &_item {
      cursor: pointer;
      width: 3rem;
      height: 3rem;
      margin: 0 0.5rem;
    }
  }
}
</style>