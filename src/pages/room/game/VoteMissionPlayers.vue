<template>
  <div class="vote-mission-players-page container flow-text">
    <div v-if="getCurrentUserVote()">
      <p>{{ labels.youHave }}{{ getCurrentUserVote().accept ? labels.accepted : labels.rejected }}{{ labels.theMission }}</p>
    </div>
    <div v-else>
      <button class="btn" @click="acceptPlayers">{{ labels.accept }}</button>
      <button class="btn" @click="rejectPlayers">{{ labels.reject }}</button>
    </div>

    <ul v-for="player in room.players" class="collection">
      <li class="collection-item text-align-left">
        <span>{{ player.name }}</span>
        <span v-if="getPlayerVoteInfo(player.name)" class="pull-right">{{ labels.voted }}</span>
        <span v-else class="pull-right">{{ labels.waitingForVote }}</span>
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
    room: state => state.room.current,
    labels: state => state.labels.current.votePlayers
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
