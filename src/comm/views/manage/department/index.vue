<template>
  <left-main-layout :routerList="routerList" >
    <VTree :data2="treeData" slot="left" ></VTree>
    <VTableDep @departData2="departData2" slot="main"></VTableDep>
  </left-main-layout>
</template>

<script>
import VTree from '@comm/components/VTree'
import leftMainLayout from '@comm/components/leftMainLayout'
import VTableDep from './VTableDep'
export default {
  name: 'department',
  components: {
    leftMainLayout,
    VTableDep,
    VTree
  },
  data () {
    return {
      treeData: [],
      routerList: [
        {name: '系统管理', key: 'manage'},
        {name: '部门管理', key: 'manage/department'}
      ]
    }
  },
  methods: {
    departData2 (val) {
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

<style scoped>
  .el-main{
    background-color: #EFF2F9;
  }
</style>
