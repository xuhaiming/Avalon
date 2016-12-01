import Cookies from 'cookies-js'

export default {
  state: {
      name: Cookies.get('username')
  },
  actions: {
    user_setName({ commit, state }, name) {
      Cookies.set('username', name)
      state.name = name
    }
  }
}
