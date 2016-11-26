<template>
  <div>
    <h4>Player Selection</h4>

    <div v-if="room.gameStatus.step === 'selection'">
      <div v-if="king.name === this.user.name">
        <h5>Select players for mission:</h5>
        <div v-for="player in room.players">
          <input type="checkbox" :id="`player_${player.name}`" :value="player.name" v-model="selectedPlayers">
          <label :for="`player_${player.name}`">{{ player.name }}</label>
        </div>
      </div>

      <div v-else>
        {{ king.name }} is selecting...
        <div v-for="selectedPlayerName in getSelectedPlayerNames()">{{ selectedPlayerName }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: "roomGamePage",
  data() {
    return {
      selectedPlayers: []
    }
  },
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    king: state => state.room.current.players[state.room.current.gameStatus.kingIndex]
  }),
  methods: {
    getSelectedPlayerNames() {
      const missionIndex = this.room.gameStatus.round - 1;
      const currentMission = this.room.gameStatus.missions[missionIndex]

      return currentMission.selectedPlayerNames
    }
  },
  watch: {
    selectedPlayers() {
      this.io.socket.emit('select mission players', {
        roomId: this.room.id,
        username: this.user.name,
        selectedPlayerNames: this.selectedPlayers
      })
    }
  }
}
</script>
