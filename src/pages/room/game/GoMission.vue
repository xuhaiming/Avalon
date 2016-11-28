<template>
  <div>
    <div>
      <h4>Go Mission</h4>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'gameGoMission',
  computed: mapState({
    io: 'io',
    user: 'user',
    room: state => state.room.current
  }),
  methods: {
    
  }
}
</script>
