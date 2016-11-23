import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import modules from './store'
import LoginPage from './pages/login/LoginPage.vue'
import RoomListPage from './pages/roomList/RoomListPage.vue'
import RoomPage from './pages/room/RoomPage.vue'
import io from 'socket.io-client'

Vue.use(VueRouter)
Vue.use(Vuex)

const routes = [
  { path: '/', component: LoginPage },
  { path: '/rooms', component: RoomListPage },
  { path: '/rooms/:id', component: RoomPage },  
  { path: '/*', redirect: '/' }
]

const router = new VueRouter({
  routes
})

const store = new Vuex.Store(modules)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
