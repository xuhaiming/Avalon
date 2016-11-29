<template>
  <div>
    Game result: {{ room.result }}
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'roomGameResultPage',
  computed: mapState({
    room: state => state.room.current,
  })
}
</script>
