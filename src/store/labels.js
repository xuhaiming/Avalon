import labels from '../labels'

export default {
  state: {
    current: labels.zh,
    language: 'zh'
  },
  actions: {
    labels_changeLanguage({ commit, state }, language) {
      state.current = labels[language]
      state.language = language
    }
  }
}
