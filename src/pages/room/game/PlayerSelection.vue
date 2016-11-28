<template>
  <div class="player-selection-page">
    <div v-if="isKing(this.user.name)">
      <div v-if="room.gameStatus.selectionConfirmed">
        <h5>You selected:</h5>
        <div v-for="selectedPlayerName in getSelectedPlayerNames()">{{ selectedPlayerName }}</div>
        <button class="btn" @click="changePlayers">Change</button>
        <vote-mission-players />
      </div>
      <div v-else>
        <p class="flow-text">Select {{ this.goMissionCount }} players for mission:</p>
        <table v-if="!room.gameStatus.selectionConfirmed" class="centered striped">
          <thead>
            <tr>
                <th data-field="position">Position</th>
                <th data-field="player_name">Player</th>
                <th data-field="action">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, index) in room.players" :class="{ 'king-highlight' : isKing(player.name) }">
              <td>{{ index + 1 }}</td>
              <td>{{ player.name }}</td>
              <td>
                <input type="checkbox" :id="`player_${player.name}`" :value="player.name" v-model="selectedPlayers">
                <label :for="`player_${player.name}`"></label>
              </td>
            </tr>
          </tbody>
        </table>
        <br>
        <button v-if="this.selectedPlayers.length === this.goMissionCount" class="btn" @click="confirmPlayers">Confirm</button>
      </div>
    </div>

    <div v-else>
      <div v-if="room.gameStatus.selectionConfirmed">
        <div>{{ king.name }} has confirmed mission players:</div>
        <div v-for="selectedPlayerName in getSelectedPlayerNames()">{{ selectedPlayerName }}</div>
        <vote-mission-players />
      </div>

      <div v-else>
        <ul class="collection with-header flow-text ">
          <li class="collection-header">
            <b>{{ king.name }}</b> is selecting mission players...
          </li>
          <li class="collection-item" v-for="selectedPlayerName in getSelectedPlayerNames()">
            {{ selectedPlayerName }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import missionsConfig from '../../../../rules/missions'
import VoteMissionPlayers from './VoteMissionPlayers.vue'

export default {
  name: 'gamePlayerSelection',
  data() {
    return {
      selectedPlayers: []
    }
  },
  components: {
    VoteMissionPlayers
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
    },
    isKing(name) {
      return this.king.name === name
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

<style>
.player-selection-page {
  & input[type="checkbox"]:checked + label:before {
    width: 15px;
    heigth: 25px;
  }

  & input[type="checkbox"] + label:before {
    width: 25px;
    height: 25px;
  }

  & td {
    font-size: 1.25rem
  }

  & .king-highlight {
    color: #e65100
  }
}
</style>