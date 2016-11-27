<template>
  <div class="register-page row">
    <div class="col s12 m6 offset-m3">
      <p class="flow-text text-align-left">Username</p>
      <input v-model="name" type="text" autofocus>
      <p class="flow-text text-align-left">Password</p>
      <input v-model="password" type="text">
      <p class="flow-text text-align-left">Confirm Password</p>
      <input v-model="password" type="text" @keyup.enter="register">
      
      <div class="row">
        <button @click="register" class="btn-large col s12">Login</button>
      </div>
      <p>Already have an account? Go <router-link to="login">Login</router-link></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'registerPage',
  computed: mapState([
    'io',
    'users'
  ]),
  methods: {
    register() {
      this.io.socket.emit('login', this.name)
      this.$store.dispatch('user_setName', this.name)
      this.$router.push('/rooms')
    }
  }
}
</script>

<style>
.register-page {
  & input[type=text] {
    font-size: 1.25rem;
  }
}
</style>
