<template>
  <div id="app" class="container">
    <h1>{{title}}</h1>
    <router-view></router-view>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { mapState } from 'vuex'

const socket = io()

export default {
  name: 'app',
  data () {
    return {
      title: 'Avalon'
    }
  },
  computed: mapState([
    'io'
  ]),
  created() {
    this.$store.dispatch('io_setSocket', socket)
    this.initializeSocket()
  },
  methods: {
    initializeSocket() {
      this.io.socket.on('user update', users => {
        this.$store.dispatch('users_update', users)
      })

      this.io.socket.on('rooms update', rooms => {
        this.$store.dispatch('rooms_update', rooms)
      })

      this.io.socket.on('room update', room => {
        this.$store.dispatch('room_setCurrent', room)
      })
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

a {
  color: #42b983;
}
</style>
