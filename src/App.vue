<template>
  <div id="app" class="container">
    <language-switcher />
    <h1>{{ labels.title }}</h1>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import io from 'socket.io-client'
import { mapState } from 'vuex'
import LanguageSwitcher from './LanguageSwitcher.vue'

const socket = io()

export default {
  name: 'app',
  computed: mapState({
    io: 'io',
    labels: state => state.labels.current.home
  }),
  components: {
    LanguageSwitcher
  },
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
@import './styles/materialize.css';
@import './styles/swiper.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

body {
  padding-bottom: 5.5rem;
}

h1, h2 {
  font-weight: normal;
  font-size: 2rem;
  margin: 1.5rem 0;
}

a {
  color: #42b983;
}

.full-width {
  width: 100%;
}

.pull-right {
  float: right;
}

.text-align-left {
  text-align: left;
}

.text-big {
  font-size: 1.25rem;
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
