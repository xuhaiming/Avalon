<template>
  <div class="language-swither-page">
    <a v-if="labels.language === 'zh'" href="#" class="right" @click="switchLanguage('en')">EN</a>
    <a v-else class="right" href="#" @click="switchLanguage('zh')">中文</a>
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
    top: 0.3rem;

    & button {
      position: absolute;
      right: 0;
    }
  }
</style>