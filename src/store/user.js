export default {
  state: {
      name: undefined
  },
  actions: {
    user_setName({ commit, state }, name) {
      state.name = name
    }
  }
}
