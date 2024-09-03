<template>
<div id="search">
  <cy-menu @headCallBack="headCall" />
  <cy-result v-if="this.showIcon"/>
  <dzyResult v-if="!this.showIcon"/>
</div>
</template>

<script>
import cyMenu from './components/newTreeZ.vue'
import cyResult from '@comm/views/search/components/cy-result.vue'
import dzyResult from './dzySearch/dzy-result.vue'
export default {
  name: 'search',
  components: {
    cyMenu,
    cyResult,
    dzyResult
  },
  data () {
    return  {
      showIcon: true
    }
  },
  methods: {
    headCall (val) {
      console.log(val, 'oooo0000')
      this.showIcon = val
    }
  }
}
</script>

<style></style>
