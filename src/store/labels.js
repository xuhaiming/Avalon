import labels from '../labels'

export default {
  state: {
    current: sessionStorage.getItem('language') ? labels[sessionStorage.getItem('language')] : labels.en,
    language: sessionStorage.getItem('language') || 'en'
  },
  actions: {
    labels_changeLanguage({ commit, state }, language) {
      state.current = labels[language]
      state.language = language
      sessionStorage.setItem('language', language)
    }
  }
}
