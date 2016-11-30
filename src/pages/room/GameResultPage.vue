<template>
  <div class="game-result-page">
    <div>Game result</div>
    <div v-if="room.result === 'evilsWin'">Evils Win!</div>
    <div v-if="room.result === 'justiceWin'">Evils killed wrong Merlin, Justice Win!</div>
    <div v-if="room.result === 'evilsKillSuccess'">Evils killed correct Merlin, Evils Win!</div>
    <div>
      <div class="player-container" v-for="player in room.players">
        <span><img class="z-depth-3 circle responsive-img role-image" :src="`role-${player.role}.jpg`"></span>
        <span class="player-name">{{ player.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'roomGameResultPage',
  computed: mapState({
    room: state => state.room.current,
  })
}
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
