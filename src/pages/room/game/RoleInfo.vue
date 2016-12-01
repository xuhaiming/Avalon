<template>
  <div class="role-info container">
    <div class="row">
      <p class="col s12 text-float text-big">
        You are <b>{{ currentUser.role }}</b>
      </p>
      <img class="z-depth-4 circle responsive-img" :src="`role-${currentUser.role}.jpg`">
    </div>

    <div class="row" v-if="getPlayersCanSee().length != 0">
      <ul class="collection with-header col s12">
        <li class="collection-header"><b>You can see {{ getRolesCanSee() }}</b></li>
        <li class="collection-item" v-for="personCanSee in getPlayersCanSee()">
          {{ personCanSee.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import roles from '../../../../rules/roles'

export default {
  name: 'gameRoleInfo',
  computed: mapState({
    room: state => state.room.current,
    currentUser: state => _.find(state.room.current.players, { name: state.user.name })
  }),
  methods: {
    getRolesCanSee() {
      const playersCanSee = this.getPlayersCanSee();
      const rolesCanSee = _.map(playersCanSee, 'role').join(", ");

      return rolesCanSee;
    },
    getPlayersCanSee() {
      const players = this.room.players
      const rolesCanSee = roles[this.currentUser.role].canSee
      const playersCanSee = _.filter(players, player => _.includes(rolesCanSee, player.role))

      return playersCanSee
    }
  }
}
</script>

