export default {
  state: {
    list: []
  },
  actions: {
    rooms_update({ commit, state }, rooms) {
      state.list = rooms
    }
  }
}
