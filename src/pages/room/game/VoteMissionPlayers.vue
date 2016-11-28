<template>
  <div class="vote-mission-players-page container flow-text">
    <div v-if="getCurrentUserVote()">
      <p>You have {{ getCurrentUserVote().accept ? 'accepted' : 'rejected' }}</p>
    </div>
    <div v-else>
      <button class="btn" @click="acceptPlayers">Accept</button>
      <button class="btn" @click="rejectPlayers">Reject</button>
    </div>

    <ul v-for="player in room.players" class="collection">
      <li class="collection-item text-align-left">
        <span>{{ player.name }}</span>
        <span v-if="getPlayerVoteInfo(player.name)" class="pull-right">Voted</span>
        <span v-else class="pull-right">Waiting for vote</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  name: 'gameVotePlayers',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current
  }),
  methods: {
    getCurrentMissionVotes() {
      const missionIndex = this.room.gameStatus.round - 1;

      return this.room.gameStatus.missions[missionIndex].votes
    },
    getPlayerVoteInfo(name) {
      return _.find(this.getCurrentMissionVotes(), { name })
    },
    getCurrentUserVote() {
      return _.find(this.getCurrentMissionVotes(), { name: this.user.name })
    },
    acceptPlayers() {
      this.io.socket.emit('vote', {
        roomId: this.room.id,
        username: this.user.name,
        accept: true
      })
    },
    rejectPlayers() {
      this.io.socket.emit('vote', {
        roomId: this.room.id,
        username: this.user.name,
        accept: false
      })
    }
  }
}
</script>
