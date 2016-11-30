<template>
  <div class="history-page container">
    History
  </div>
</template>

<script>
import { mapState } from 'vuex'
import _ from 'lodash'
import gameLogic from '../../../../rules/gameLogic'

export default {
  name: 'gameHistory',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current,
    history: state => state.room.current.gameStatus.history
  }),
  methods: {
    
  }
}
</script>

<style>
.history-page {

}
</style>
