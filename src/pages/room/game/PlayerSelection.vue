<template>
  <div class="player-selection-page container">
    <table class="centered striped">
      <thead>
        <tr>
          <th data-field="position">Position</th>
          <th data-field="player_name">Player</th>
          <th data-field="action" v-if="isKing(user.name) && !room.gameStatus.selectionConfirmed">Action</th>
          <th data-field="status" v-else>Go Mission</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in room.players" :class="{ 'voted-highlight' : getPlayerVoteInfo(player.name) }">
          <td v-if="isKing(player.name)">
            <img class="king z-depth-3 responsive-img" src="king.jpg">
          </td>
          <td v-else>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td v-if="isKing(user.name) && !room.gameStatus.selectionConfirmed">
            <input type="checkbox" :id="`player_${player.name}`" :value="player.name" v-model="selectedPlayers">
            <label :for="`player_${player.name}`"></label>
          </td>
          <td v-else>
            <span v-if="isPlayerSelected(player.name)">
              <img class="mission-player z-depth-3 circle responsive-img" src="mission-player.jpg">
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <br>
    <button 
      v-if="this.selectedPlayers.length === this.goMissionCount && !room.gameStatus.selectionConfirmed && isKing(user.name)" 
      class="btn" 
      @click="confirmPlayers">
        Confirm
    </button>
    <div v-if="room.gameStatus.selectionConfirmed">
      <button v-if="isKing(user.name)" class="btn" @click="changePlayers">Change</button>
      <button v-if="!getPlayerVoteInfo(user.name)" class="btn" @click="acceptPlayers">
        <img class="mission-player z-depth-3 circle responsive-img" src="approve.jpg">
      </button>
      <button v-if="!getPlayerVoteInfo(user.name)" class="btn" @click="rejectPlayers">
        <img class="mission-player z-depth-3 circle responsive-img" src="reject.jpg">
      </button>
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
    isPlayerSelected(name) {
      const selectedPlayerNames = this.getSelectedPlayerNames();

      return _.indexOf(selectedPlayerNames, name) > -1;
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
    acceptPlayers() {
      this.io.socket.emit('vote', {
        roomId: this.room.id,
        username: this.user.name,
        accept: true
      })
    },
    rejectPlayers() {
      this.io.socket.emit('vote', {
        roomId: this.room.id,
        username: this.user.name,
        accept: false
      })
    },
    getCurrentMissionVotes() {
      const missionIndex = this.room.gameStatus.round - 1;

      return this.room.gameStatus.missions[missionIndex].votes
    },
    getPlayerVoteInfo(name) {
      return _.find(this.getCurrentMissionVotes(), { name })
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

  & .voted-highlight {
    color: #26a69a
  }

  & .mission-player {
    width: 2rem;
  }

  & .king {
    width: 2rem;
    border-radius: 0.3rem;
  }
}
</style>