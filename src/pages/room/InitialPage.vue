<template>
  <div class="initial-game-page">
    <div class="row">
      <ul class="collection with-header col s12">
        <li class="collection-header"><b>{{ labels.players }}</b></li>
        <li class="collection-item" v-for="player in room.players">
          {{ player.name }}
          <span class="pull-right">{{ getPlayerStatus(player.status) }}</span>  
        </li>
      </ul>
    </div>
    <div v-if="!isCurrentUserReady()" class="row">
      <button @click="ready" class="col s12 m6 offset-m3 btn">{{ labels.ready }}</button>    
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'roomInitialPage',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    labels: state => state.labels.current.lobby
  }),
  methods: {
    getPlayerStatus(status) {
      const statusMapping = {
        joined: this.labels.notReady,
        ready: this.labels.isReady
      }

      return statusMapping[status]
    },
    ready() {
      this.io.socket.emit('user ready', {
        roomId: this.room.id,
        username: this.user.name
      })
    },
    isCurrentUserReady() {
      return _.find(this.room.players, { status: 'ready', name: this.user.name })
    }
  }
}
</script>

<style>
.initial-game-page {
  & li {
    text-align: left;
  }
}
</style>
