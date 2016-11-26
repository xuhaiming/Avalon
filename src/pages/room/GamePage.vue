<template>
  <div>
    <h4>Player Selection</h4>

    <div v-if="room.gameStatus.step === 'selection'">
      <div v-if="king.name === this.user.name">
        Select players
      </div>

      <div v-else>
        {{ king.name }} is selecting...
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "roomGamePage",
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    king: state => state.room.current.players[state.room.current.gameStatus.kingIndex]
  }),
  methods: {
    
  }
}
</script>
