<template>
  <div>
    
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'gameRoundStatus',
  computed: mapState({
    room: state => state.room.current,
  })
}
</script>
