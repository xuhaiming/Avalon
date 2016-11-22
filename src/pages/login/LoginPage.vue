<template>
  <div class="login-page">
    <p>Your name</p>
    <input v-model="name" type="text" />
    <button @click="login">Login</button>

    <h3>Online players</h3>
    <ul>
      <li v-for="user in users.list">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'loginPage',
  computed: mapState([
    'io',
    'users'
  ]),
  methods: {
    login() {
      this.io.socket.emit('login', this.name)
      this.$store.dispatch('user_setName', this.name)
      this.$router.push('rooms')
    }
  }
}
</script>
