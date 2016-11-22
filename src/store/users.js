export default {
  state: {
    list: []
  },
  actions: {
    users_update({ commit, state }, users) {
      state.list = users
    }
  }
}
