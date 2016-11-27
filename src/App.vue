<template>
  <div id="app" class="container">
    <h1>{{title}}</h1>
    <transition name="fade">
      <router-view></router-view>
    </transition>
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

.pull-right {
  float: right;
}

.text-align-left {
  text-align: left;
}

.error{
  font-size: 0.75rem;
  color: #ef5350;
}

.fade-enter-active {
  transition: opacity .5s
}

.fade-enter {
  opacity: 0
}

</style>