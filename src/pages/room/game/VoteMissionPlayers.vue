<template>
  <div>
    <div v-if="getCurrentUserVote()">
      <div>You have {{ getCurrentUserVote().accept ? 'accepted' : 'rejected' }}</div>
    </div>
    <div v-else>
      <button class="btn" @click="acceptPlayers">Accept</button>
      <button class="btn" @click="rejectPlayers">Reject</button>
    </div>

    <div v-for="player in room.players">
      <span>{{ player.name }}</span>
      <span v-if="getPlayerVoteInfo(player.name)">Voted</span>
      <span v-else>Waiting for vote</span>
    </div>
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
