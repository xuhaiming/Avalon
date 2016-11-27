<template>
  <div class="login-page row">
    <div class="col s12 m6 offset-m3">
      <p v-if="loginError" class="error">{{ errorMessage }}</p>
      <p class="flow-text text-align-left">Username</p>
      <input v-model="username" type="text" autofocus>
      <p class="flow-text text-align-left">Password</p>
      <input v-model="password" type="password" @keyup.enter="login">
      
      <div class="row">
        <button @click="login" class="btn-large col s12">Login</button>
      </div>
      <p>Don't have an account? Go <router-link to="register">Register</router-link></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'loginPage',
  data() {
    return {
      loginError: false,
      errorMessage: ''
    }
  },
  computed: mapState([
    'io'
  ]),
  methods: {
    login() {
      if(this.username && this.password) {
        axios.post('/api/login', {
          username: this.username,
          password: this.password
        })
        .then(response => {
          if(response.data.status === 'ok') {
            this.$store.dispatch('user_setName', response.data.username)
            this.$router.push('/rooms')
          } else {
            this.loginError = true
            this.errorMessage = response.data.message
          }
        })
      }
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
