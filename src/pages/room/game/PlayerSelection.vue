<template>
  <div>
    <div v-if="king.name === this.user.name">
      <div v-if="!room.gameStatus.selectionConfirmed">
        <h5>Select {{ this.goMissionCount }} players for mission:</h5>
        <div v-if="!room.gameStatus.selectionConfirmed" v-for="player in room.players">
            <input type="checkbox" :id="`player_${player.name}`" :value="player.name" v-model="selectedPlayers">
            <label :for="`player_${player.name}`">{{ player.name }}</label>
        </div>
        <button v-if="this.selectedPlayers.length === this.goMissionCount" class="btn" @click="confirmPlayers">Confirm</button>
      </div>
      <div v-else>
        <h5>You selected:</h5>
        <div v-for="selectedPlayerName in getSelectedPlayerNames()">{{ selectedPlayerName }}</div>
        <button class="btn" @click="changePlayers">Change</button>
      </div>
    </div>

    <div v-else>
      <div v-if="room.gameStatus.selectionConfirmed">{{ king.name }} has confirmed mission players:</div>
      <div v-else>{{ king.name }} is selecting mission players...</div>
      <div v-for="selectedPlayerName in getSelectedPlayerNames()">{{ selectedPlayerName }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import missionsConfig from '../../../../rules/missions'

export default {
  name: 'gamePlayerSelection',
  data() {
    return {
      selectedPlayers: []
    }
  },
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    king: state => state.room.current.players[state.room.current.gameStatus.kingIndex],
    goMissionCount: state => {
        const playerCount = state.room.current.players.length
        const currentRules = _.find(missionsConfig, { totalCount: playerCount })

        return currentRules.goMissionCounts[state.room.current.gameStatus.round - 1]
    }
  }),
  methods: {
    getSelectedPlayerNames() {
      const missionIndex = this.room.gameStatus.round - 1;
      const currentMission = this.room.gameStatus.missions[missionIndex]

      return currentMission.selectedPlayerNames
    },
    confirmPlayers() {
      this.io.socket.emit('update selection confirmation', {
        roomId: this.room.id,
        selectionConfirmed: true
      })
    },
    changePlayers() {
      this.io.socket.emit('update selection confirmation', {
        roomId: this.room.id,
        selectionConfirmed: false
      })
    }
  },
  watch: {
    selectedPlayers(value, oldValue) {
      if (this.selectedPlayers.length > this.goMissionCount) {
        this.selectedPlayers = oldValue
      } else {
        this.io.socket.emit('select mission players', {
          roomId: this.room.id,
          selectedPlayerNames: this.selectedPlayers
        })
      }
    }
  }
}
</script>
