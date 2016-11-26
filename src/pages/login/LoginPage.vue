<template>
  <div class="login-page row">
    <div class="col s12 m6 offset-m3">
      <p class="flow-text">Your Name</p>
      <input v-model="name" id="user_name" type="text" @keyup.enter="login" autofocus>
      <div class="row">
        <button @click="login" class="btn-large col s12">Login</button>
      </div>
    </div>
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
      this.$router.push('/rooms')
    }
  }
}
</script>

<style>
.login-page {
  & input[type=text] {
    font-size: 1.25rem;
  }
}
</style>
