<template>
  <div id="room">
      <p>User: <b>{{ this.user.name }}</b> - <b>{{ room. name }}</b></p>
      <div v-if="room.status === 'created'">
        <initial-page />
      </div>

      <div v-if="room.status === 'roleConfirmation'">
        <role-confirmation-page />
      </div>

      <div v-if="room.status === 'started'">
        <game-page />
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import InitialPage from './InitialPage.vue'
import RoleConfirmationPage from './RoleConfirmationPage.vue'
import GamePage from './GamePage.vue'

export default {
  name: "roomPage",
  components: {
    InitialPage,
    RoleConfirmationPage,
    GamePage
  },
  created() {
    if (!this.user.name) {
      this.$router.push('/login')
    }
  },
  computed: mapState({
    user: 'user',
    room: state => state.room.current
  })
}
</script>
