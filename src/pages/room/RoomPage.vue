<template>
  <div id="room">
      <h2>{{ room.current.name }}</h2>
      <h4>Players</h4>
      <div v-for="player in room.current.players">
        <span>{{ player.name }}: </span>
        <span>{{ player.status === 'joined' ? 'not ready' : 'ready' }}</span>
      </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: "roomPage",
  created() {
    if (!this.user.name) {
      this.$router.push('/login')
    }
  },
  computed: mapState([
    'io',
    'user',
    'room'
  ])
}
</script>
