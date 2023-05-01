<template>
  <div class="player-selection-page">
    <table class="centered striped">
      <thead>
        <tr>
          <th data-field="position">{{ labels.position }}</th>
          <th data-field="player_name">{{ labels.player }}</th>
          <th data-field="selection">{{ labels.selection }}</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(player, index) in room.players"
          :class="{ 'voted-highlight': getPlayerVoteInfo(player.name) }"
        >
          <td v-if="isKing(player.name)">
            <img class="king z-depth-3 responsive-img" src="king.jpg" />
          </td>
          <td v-else>{{ index + 1 }}</td>
          <td>{{ player.name }}</td>
          <td v-if="isKing(user.name) && !room.gameStatus.selectionConfirmed">
            <input
              type="checkbox"
              :id="`player_${player.name}`"
              :value="player.name"
              v-model="selectedPlayers"
            />
            <label :for="`player_${player.name}`"></label>
          </td>
          <td v-else>
            <span v-if="isPlayerSelected(player.name)">
              <img
                class="mission-player z-depth-3 circle responsive-img"
                src="mission-player.jpg"
              />
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <button
      v-if="
        this.selectedPlayers.length === this.goMissionCount &&
        !room.gameStatus.selectionConfirmed &&
        isKing(user.name)
      "
      class="btn"
      @click="confirmPlayers"
    >
      {{ labels.confirm }}
    </button>
    <div v-if="room.gameStatus.selectionConfirmed">
      <div>
        <button v-if="isKing(user.name)" class="btn" @click="changePlayers">
          {{ labels.change }}
        </button>
      </div>
      <div class="vote-container">
        <button
          v-if="!getPlayerVoteInfo(user.name)"
          class="btn vote-button"
          @click="acceptPlayers"
        >
          <img
            class="mission-player z-depth-3 circle responsive-img"
            src="approve.jpg"
          />
          <p class="text-small">{{ labels.approve }}</p>
        </button>
        <button
          v-if="!getPlayerVoteInfo(user.name)"
          class="btn vote-button"
          @click="rejectPlayers"
        >
          <img
            class="mission-player z-depth-3 circle responsive-img"
            src="reject.jpg"
          />
          <p class="text-small">{{ labels.reject }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import missionsConfig from "../../../../rules/missions";
import VoteMissionPlayers from "./VoteMissionPlayers.vue";

export default {
  name: "gamePlayerSelection",
  data() {
    return {
      selectedPlayers: [],
    };
  },
  components: {
    VoteMissionPlayers,
  },
  computed: mapState({
    io: "io",
    user: "user",
    room: (state) => state.room.current,
    king: (state) =>
      state.room.current.players[state.room.current.gameStatus.kingIndex],
    goMissionCount: (state) => {
      const playerCount = state.room.current.players.length;
      const currentRules = _.find(missionsConfig, { totalCount: playerCount });

      return currentRules.goMissionCounts[
        state.room.current.gameStatus.round - 1
      ];
    },
    labels: (state) => state.labels.current.playerSelection,
  }),
  methods: {
    getSelectedPlayerNames() {
      const missionIndex = this.room.gameStatus.round - 1;
      const currentMission = this.room.gameStatus.missions[missionIndex];

      return currentMission.selectedPlayerNames;
    },
    isPlayerSelected(name) {
      const selectedPlayerNames = this.getSelectedPlayerNames();

      return _.indexOf(selectedPlayerNames, name) > -1;
    },
    confirmPlayers() {
      this.io.socket.emit("update selection confirmation", {
        roomId: this.room.id,
        selectionConfirmed: true,
      });
    },
    changePlayers() {
      this.io.socket.emit("update selection confirmation", {
        roomId: this.room.id,
        selectionConfirmed: false,
      });
    },
    acceptPlayers() {
      this.io.socket.emit("vote", {
        roomId: this.room.id,
        username: this.user.name,
        accept: true,
      });
    },
    rejectPlayers() {
      this.io.socket.emit("vote", {
        roomId: this.room.id,
        username: this.user.name,
        accept: false,
      });
    },
    getCurrentMissionVotes() {
      const missionIndex = this.room.gameStatus.round - 1;

      return this.room.gameStatus.missions[missionIndex].votes;
    },
    getPlayerVoteInfo(name) {
      return _.find(this.getCurrentMissionVotes(), { name });
    },
    isKing(name) {
      return this.king.name === name;
    },
  },
  watch: {
    selectedPlayers(value, oldValue) {
      if (value.length > this.goMissionCount) {
        this.$nextTick(() => {
          this.selectedPlayers = oldValue;
          this.$forceUpdate();
        });

        return;
      }
      this.io.socket.emit("select mission players", {
        roomId: this.room.id,
        selectedPlayerNames: this.selectedPlayers,
      });
    },
  },
};
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
    font-size: 1.25rem;
  }

  & .voted-highlight {
    color: #26a69a;
  }

  & .mission-player {
    width: 2rem;
  }

  & .king {
    width: 2rem;
    border-radius: 0.3rem;
  }

  & .vote-button {
    padding: 0.8rem 0.5rem;
    padding-bottom: 0;
    margin: 1rem;
    background-color: transparent;
    width: auto;
    height: auto;
    border-radius: 1rem;

    &:hover,
    &:active {
      background-color: transparent;
    }

    & img {
      width: 5rem;
      height: 5rem;
    }

    & p {
      color: black;
      font-size: 0.8rem;
      font-weight: 500;
      margin-top: -1rem;
      margin-bottom: 0;
    }
  }
}
</style>
