<template>
  <div class="language-swither-page">
    <button v-if="labels.language === 'zh'" class="right btn-floating hoverable" @click="switchLanguage('en')">EN</button>
    <button v-else class="right btn-floating hoverable" @click="switchLanguage('zh')">中文</button>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'languageSwitcher',
  computed: mapState([
    'labels'
  ]),
  methods: {
    switchLanguage(language) {
      this.$store.dispatch('labels_changeLanguage', language)
    }
  }
}
</script>
<style>
  .language-swither-page {
    position: relative;

    & button {
      position: absolute;
      right: 0;
    }
  }
</style>