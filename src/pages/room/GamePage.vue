<template>
  <div>
    <round-status />
    <button class="btn" @click="toggleShowHistory">History</button>
    <div v-if="showHistory">
      <history />
    </div>

    <div v-else>
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

export default {
  name: 'roomGamePage',
  data() {
    return {
      showHistory: false
    }
  },
  computed: mapState({
    room: state => state.room.current,
  }),
  methods: {
    toggleShowHistory() {
      this.showHistory = !this.showHistory
    }
  },
  components: {
    RoundStatus,
    PlayerSelection,
    VoteConfirmation,
    GoMission,
    KillMerlin,
    History
  }
}
</script>
