<template>
  <left-main-layout :routerList="routerList">
    <VTree :data2="treeData" slot="left" ></VTree>
    <VTableUser @userData2="userData2" slot="main" ></VTableUser>
  </left-main-layout>
</template>

<script>
import leftMainLayout from '@comm/components/leftMainLayout'
import VTree from '@comm/components/VTree'
import VTableUser from './VTableUser'
export default {
  name: 'user',
  components: {
    leftMainLayout,
    VTableUser,
    VTree
  },
  data () {
    return {
      treeData: [],
      routerList: [
        {name: '系统管理', key: 'manage'},
        {name: '用户管理', key: 'manage/user'}
      ]
    }
  },
  methods: {
    userData2 (val) {
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
*{
  margin:0;
  padding: 0;
}
.el-main{
  background-color: #EFF2F9;
}
</style>
