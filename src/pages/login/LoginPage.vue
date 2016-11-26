<template>
  <div class="login-page row">
    <div class="row col s12">
      <div class="input-field col s12">
        <p class="flow-text">Your Name</p>
        <input v-model="name" id="user_name" type="text" @keyup.enter="login" class="font-20">
      </div>
    </div>
    <div class="row">
      <button @click="login" class="btn-large col s12 m6 offset-m3">Login</button>
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
