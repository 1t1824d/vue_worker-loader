<template>
  <div class="home">
    <component :is='"HoneViewPage"'></component>
  </div>
</template>

<script>
// @ is an alias to /src
import HoneViewPage from '@/pages/HoneViewPage/index.vue'

export default {
  name: 'HomeView',
  components: {
    HoneViewPage
  },
  methods: {
  }
}
</script>
<style lang="scss">
.home {
  width: 100%;
  height: 100%;
}
</style>

