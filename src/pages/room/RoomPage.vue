<template>
  <div id="room">
      {{ room.current.name }}
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: "roomPage",
  created() {
    if (!this.user.name) {
      this.$router.push('/login')
    }
  },
  computed: mapState([
    'io',
    'user',
    'room'
  ])
}
</script>
