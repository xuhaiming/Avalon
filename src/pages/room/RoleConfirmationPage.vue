<template>
  <div class="role-confirmation-page container">
    <role-info />

    <div class="row">
      <ul class="collection with-header col s12 text-align-left">
        <li class="collection-header"><b>Please confirm the info for you</b></li>
        <li class="collection-item" v-for="player in room.players">
          {{ player.name }}
          <span class="pull-right">{{ getPlayerStatus(player.status) }}</span>  
        </li>
      </ul>
    </div>

    <div class="row">
      <button @click="conformRole" class="col s12 m6 offset-m3 btn">Confirm</button>    
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RoleInfo from './game/RoleInfo.vue'

export default {
  name: 'roomRoleConfirmationPage',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current
  }),
  components: {
    RoleInfo
  },
  methods: {
    getPlayerStatus(status) {
      const statusMapping = {
        joined: 'not ready',
        ready: 'wariting for confirm',
        offline: 'offline',
        roleConfirmed: 'confirmed'
      }

      return statusMapping[status]
    },
    conformRole() {
      this.io.socket.emit('confirm role', {
        roomId: this.room.id,
        username: this.user.name
      })
    }
  }
}
</script>
