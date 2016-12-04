<template>
  <div class="role-confirmation-page">
    <role-info />

    <div v-if="!isCurrentUserConfirmed()" class="row">
      <button @click="conformRole" class="col s12 m6 offset-m3 btn">{{ labels.confirm }}</button>    
    </div>

    <div v-else class="row">
      <ul class="collection with-header col s12 text-align-left">
        <li class="collection-header"><b>{{ labels.waitingForOthers }}</b></li>
        <li class="collection-item" v-for="player in room.players">
          {{ player.name }}
          <span class="pull-right">{{ getPlayerStatus(player.status) }}</span>  
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex'
import RoleInfo from './game/RoleInfo.vue'
import _ from 'lodash'

export default {
  name: 'roomRoleConfirmationPage',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    labels: state => state.labels.current.roleConfirmation
  }),
  components: {
    RoleInfo
  },
  methods: {
    getPlayerStatus(status) {
      const statusMapping = {
        ready: this.labels.notConfirmed,
        roleConfirmed: this.labels.confirmed
      }

      return statusMapping[status]
    },
    conformRole() {
      this.io.socket.emit('confirm role', {
        roomId: this.room.id,
        username: this.user.name
      })
    },
    isCurrentUserConfirmed() {
      return _.find(this.room.players, { name: this.user.name, status: 'roleConfirmed' })
    }
  }
}
</script>
