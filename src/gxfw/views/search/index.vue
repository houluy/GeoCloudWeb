<template>
<div id="search">
  <cy-menu @headCallBack="headCall" />
  <cy-result v-if="this.showIcon"/>
</div>
</template>

<script>
import cyMenu from './components/newTreeZ.vue'
import cyResult from '@comm/views/search/components/cy-result.vue'
export default {
  name: 'search',
  components: {
    cyMenu,
    cyResult
  },
  data () {
    return  {
      showIcon: true
    }
  },
  methods: {
    headCall (val) {
      this.showIcon = val
    }
    // changeDiv (val) {
    //    val === 1 ? this.showIcon = true : this.showIcon = false
    // }
  }
}
</script>

<style>
  /*.iconz{*/
    /*position: absolute;*/
    /*z-index: 99;*/
    /*left: 16vw;*/
  /*}*/
  /*.iconz span{*/
    /*display: block;*/
    /*height: 10vh;*/
    /*width: 30px;*/
    /*background: blue;*/
    /*border-radius: 0 16px 21px 0px;*/
  /*}*/
</style>
