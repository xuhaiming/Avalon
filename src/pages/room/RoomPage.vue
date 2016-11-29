<template>
  <div id="room">
      <div v-if="room.status === 'created'">
        <initial-page />
      </div>

      <div v-if="room.status === 'roleConfirmation'">
        <role-confirmation-page />
      </div>

      <div v-if="room.status === 'started'">
        <game-page />
      </div>

      <div v-if="room.status === 'finished'">
        <game-result-page />
      </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import InitialPage from './InitialPage.vue'
import RoleConfirmationPage from './RoleConfirmationPage.vue'
import GamePage from './GamePage.vue'
import GameResultPage from './GameResultPage.vue'

export default {
  name: 'roomPage',
  components: {
    InitialPage,
    RoleConfirmationPage,
    GamePage,
    GameResultPage
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
