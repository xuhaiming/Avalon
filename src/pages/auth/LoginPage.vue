<template>
  <div class="login-page row">
    <div class="col s12 m6 offset-m3">
      <p v-if="showError" class="error">{{ labels.incorrectPassword }}</p>
      <p class="flow-text text-align-left">{{ labels.username }}</p>
      <input v-model="username" type="text" autofocus>
      <p class="flow-text text-align-left">{{ labels.password }}</p>
      <input v-model="password" type="password" @keyup.enter="login">
      
      <div class="row">
        <div class="col s12">
          <button @click="login" class="btn-large full-width">{{ labels.login }}</button>
        </div>
      </div>
      <p>{{ labels.noAccount }}<router-link to="register">{{ labels.register }}</router-link></p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import _ from 'lodash'

export default {
  name: 'loginPage',
  data() {
    return {
      showError: false
    }
  },
  computed: mapState({
    io: 'io',
    labels: state => state.labels.current.account
  }),
  methods: {
    navigateAfterLogin() {
      axios.get('/api/rooms')
        .then(response => {
          const rooms = response.data
          this.$store.dispatch('rooms_update', rooms)

          const inProgressRoom = _.find(rooms, room => _.find(room.players, { name: this.username }))

          if (inProgressRoom) {
            this.$store.dispatch('room_setCurrent', inProgressRoom)
            this.$router.push(`/rooms/${inProgressRoom.id}`)
          } else {
            this.$router.push(`/rooms`)
          }
        })
    },
    login() {
      if (this.username && this.password) {
        this.io.socket.emit('login', {
          username: this.username,
          password: this.password
        }, response => {
          if (response.username) {
            this.$store.dispatch('user_setName', response.username)
            this.navigateAfterLogin()
          } else {
            this.showError = true
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
