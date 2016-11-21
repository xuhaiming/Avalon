<template>
  <div id="app">
    <router-view></router-view>
    <h1>{{ title }}</h1>
    <p>Your name</p>
    <input v-model="name" type="text" />
    <button @click="joinRoom">Login</button>
  </div>
</template>

<script>
import io from 'socket.io-client'
const socket = io()

export default {
  name: 'app',
  data () {
    return {
      title: 'Avalon'
    }
  },
  methods: {
    joinRoom() {
      socket.emit('join room', {
        name: this.name
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
