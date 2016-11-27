<template>
  <div>
    Vote Confirmation
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'gameVoteConfirmation',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current
  })
}
</script>
