export default {
  state: {
      name: sessionStorage.getItem('username')
  },
  actions: {
    user_setName({ commit, state }, name) {
      sessionStorage.setItem('username', name);
      state.name = name
    }
  }
}
