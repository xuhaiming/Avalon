<template>
  <div class="room-list-page">
    <p>Your name: {{user.name}}</p>
    <button>Create Room</button>
    <p>Rooms</p>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'roomListPage',
  computed: mapState([
    'user'
  ]),
  created() {
    if (!this.user.name) {
      this.$router.push('login')
    }
  }
}
</script>
