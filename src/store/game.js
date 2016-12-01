export default {
  state: {
    tab: 'game'
  },
  actions: {
    game_setTab({ commit, state }, tab) {
      state.tab = tab
    }
  }
}
