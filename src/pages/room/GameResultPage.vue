<template>
  <div class="game-result-page">
    <h5>{{ labels.title }}</h5>
    <div v-if="room.result === 'evilsWin'">{{ labels.evilsWin }}</div>
    <div v-if="room.result === 'justiceWin'">{{ labels.wrongKill }}</div>
    <div v-if="room.result === 'evilsKillSuccess'">
      {{ labels.correctKill }}
    </div>
    <div>
      <div class="player-container" v-for="player in room.players">
        <span
          ><img
            class="z-depth-3 circle responsive-img role-image"
            :src="`role-${player.role}.jpg`"
        /></span>
        <span class="player-name">{{ player.name }}</span>
      </div>
    </div>
    <br />
    <button class="btn" @click="backToList">
      {{ labels.backToList }}
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "roomGameResultPage",
  computed: mapState({
    room: (state) => state.room.current,
    labels: (state) => state.labels.current.gameResult,
  }),
  methods: {
    backToList() {
      this.$router.push(`/rooms`);
    },
  },
};
</script>

<style>
.game-result-page {
  & .role-image {
    width: 3rem;
    vertical-align: middle;
  }

  & .player-name {
    font-size: 1.5rem;
    vertical-align: middle;
    margin-left: 1rem;
  }

  & .player-container {
    margin-top: 1rem;
  }
}
</style>
