<template>
  <div>
    <h4>Game</h4>

    <div v-if="room.gameStatus.step === 'selection'">
      <player-selection />
    </div>

    <div v-if="room.gameStatus.step === 'voted'">
      <vote-confirmation />
    </div>

    <div v-if="room.gameStatus.step === 'goMission'">
      <go-mission />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlayerSelection from './game/PlayerSelection.vue'
import VoteConfirmation from './game/VoteConfirmation.vue'
import GoMission from './game/GoMission.vue'

export default {
  name: 'roomGamePage',
  computed: mapState({
    room: state => state.room.current,
  }),
  components: {
    PlayerSelection,
    VoteConfirmation,
    GoMission
  }
}
</script>
