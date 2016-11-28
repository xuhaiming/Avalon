<template>
  <div class="register-page row">
    <div class="col s12 m6 offset-m3">
      <p class="flow-text text-align-left">Username</p>
      <input v-model="username" type="text" autofocus>
      <p class="flow-text text-align-left">Password</p>
      <input v-model="password" type="password">
      <p class="flow-text text-align-left">
        Confirm Password 
        <span v-if="passwordNotMatch" class="error">Doesn't match your password</span>
        </p>
      <input 
        v-model="passwordToConfirm"
        type="password" 
        @keyup="checkPassword" 
        @keyup.enter="register">
      
      <div v-if="showError" class="row error">
        <div>This user has already been registered.</div>
      </div>

      <div class="row">
        <button @click="register" class="btn-large col s12">REGISTER</button>
      </div>
      <p>Already have an account? Go <router-link to="login">Login</router-link></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'

export default {
  name: 'registerPage',
  data() {
    return {
      passwordNotMatch: false,
      showError: false
    }
  },
  computed: mapState([
    'io'
  ]),
  methods: {
    register() {
      if(this.username && this.password && !this.passwordNotMatch) {
        axios.post('/api/register', {
          username: this.username,
          password: this.password
        })
        .then(response => {
          this.$store.dispatch('user_setName', response.data)
          this.$router.push('/rooms')
        })
        .catch(error => {
          this.showError = true
        })
      }
    },
    checkPassword() {
      this.passwordNotMatch = this.password != this.passwordToConfirm;
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
