<template>
  <div>
    <h4>Game</h4>

    <div v-if="room.gameStatus.step === 'selection'">
      <player-selection />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PlayerSelection from './game/PlayerSelection.vue'

export default {
  name: 'roomGamePage',
  computed: mapState({
    room: state => state.room.current,
  }),
  components: {
    PlayerSelection
  }
}
</script>
