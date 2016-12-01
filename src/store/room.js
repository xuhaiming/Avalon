export default {
  state: {
    current: {
      name: ''
    }
  },
  actions: {
    room_setCurrent({ commit, state }, room) {
      state.current = room
    }
  }
}
