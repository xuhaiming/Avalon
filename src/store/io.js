export default {
  state: {
      socket: undefined
  },
  actions: {
    io_setSocket({ commit, state }, socket) {
      state.socket = socket
    }
  }
}
