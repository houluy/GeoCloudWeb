<template>
  <div>
    <VDetail></VDetail>
  </div>
</template>

<script>
import VDetail from './VDetail.vue'
export default {
  name: 'person',
  components: {
    VDetail
  },
  methods: {
    handleRouter () {
      // this.$router.push({path: '/manage/person/personDetail'})
    }
  },
  activated () {
    this.handleRouter()
  }
}
</script>

<style>
</style>
