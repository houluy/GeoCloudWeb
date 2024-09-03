<template>
  <left-main-layout :routerList="routerList">
    <VTree :data2="treeData" slot="left"></VTree>
    <VTablePower @poweData2="poweData2" slot="main"></VTablePower>
  </left-main-layout>
</template>

<script>
import VTree from '@comm/components/VTree'
import VTablePower from './VTablePower'
import leftMainLayout from '@comm/components/leftMainLayout'

export default {
  name: 'power',
  components: {
    leftMainLayout,
    VTablePower,
    VTree
  },
  data () {
    return {
      treeData: [],
      routerList: [
        {name: '系统管理', key: 'manage'},
        {name: '功能管理', key: 'manage/power'}
      ]
    }
  },
  methods: {
    poweData2 (val) {
      this.treeData = val
    }
  },
  watch: {
    treeData (val) {
      this.treeData = val
    }
  }
}

</script>

<style>
  .el-main{
    background-color: #EFF2F9;
  }
</style>
