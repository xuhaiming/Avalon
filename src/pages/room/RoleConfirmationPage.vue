<template>
  <div class="role-confirmation-page container">
    <div class="row">
      <p class="col s12 text-float">
        You are <b>{{ currentUser.role }}</b>
      </p>
    </div>

    <div class="row" v-if="getPlayersCanSee().length != 0">
      <ul class="collection with-header col s12">
        <li class="collection-header"><b>You can see {{ getRolesCanSee() }}</b></li>
        <li class="collection-item" v-for="personCanSee in getPlayersCanSee()">
          {{ personCanSee.name }}
        </li>
      </ul>
    </div>

    <div class="row">
      <ul class="collection with-header col s12">
        <li class="collection-header"><b>Please confirm the info for you</b></li>
        <li class="collection-item" v-for="player in room.players">
          {{ player.name }}:
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
import _ from 'lodash'
import roles from '../../../rules/roles'
import InitialPage from './InitialPage.vue'

export default {
  name: "roomRoleConfirmationPage",
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    currentUser: state => _.find(state.room.current.players, { name: state.user.name })
  }),
  methods: {
    getPlayerStatus(status) {
      const statusMapping = {
        joined: 'not ready',
        ready: 'ready',
        offline: 'offline',
        roleConfirmed: 'confirmed'
      }

      return statusMapping[status]
    },
    getRolesCanSee() {
      const rolesCanSee = roles[this.currentUser.role].canSee
      
      return rolesCanSee;
    },
    getPlayersCanSee() {
      const players = this.room.players
      const rolesCanSee = this.getRolesCanSee();
      const playersCanSee = _.filter(players, player => _.includes(rolesCanSee, player.role))

      return playersCanSee
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
