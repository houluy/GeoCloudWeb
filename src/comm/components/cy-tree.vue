<template>
  <div class="cy-menu" ref="cy-menu">
    <img class="img"  height="100" :title="this.menuShow ? '收缩': '展开'" :src="this.menuShow ? require('@/assets/images/search/arrow21.png'): require('@/assets/images/search/arrow22.png')" @click="handleMenu">
    <div style="height:.9rem; padding-left: 20px; font-weight:400; color:rgba(51,51,51,1); line-height: .9rem;    border-bottom: 2px solid #E8E8E8;">
      <img  height="14" width="18"  style="padding-right: 5px"  :src="require('@/assets/images/search/search_title_icon.png')"  >
      数据导航</div>
    <div style="width: calc(100% - 23px); padding: 8px 12px;   height: calc(100% - 60px);  text-align: center;">
      <el-input style="width: 90%;"  class="search_input"
        placeholder="输入关键字"
                v-model="filterText">
        <i slot="suffix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <div style="height: 16px;text-align: center;padding: 4px 33px;">
        <div v-if="count>0">
          <span style="display: inline-block;color: #606266;float: left;font-size: 12px;padding: 2px;">查询到:{{count}}个</span>
          <img title="清空选中以及条件"  style="cursor: pointer;float: left;padding-left: 5px;" height="16" :src="require('@/assets/images/clearAll.png')" @click="clearSelectNode">
          <img title="查看上一个" style="cursor: pointer;float: right;padding-left: 5px;"  height="16" :src="require('@/assets/images/down.png')" @click="nextSelectNode">
          <img title="查看下一个"  style="cursor: pointer;float: right;" height="16" :src="require('@/assets/images/up.png')" @click="preSelectNode">
        </div>
      </div>
      <el-scrollbar style="height: calc(100% - 50px);">
        <el-tree
          :data="menuTreeData"
          show-checkbox
          node-key="id"
          :key="treeKey"
          @check="handleTreeChange"
          :filter-node-method="filterNode"
          ref="tree"
          auto-expand-parent
          style="height: 100%;"
          current-node-key
          highlight-current>
        </el-tree>
      </el-scrollbar>
    </div>

  </div>
</template>
<!---->
<script>
import navList from '@comm/components/navList.vue'
import styles from '@/assets/css/global.scss'
// import http from '@comm/service/interface.js'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'cy-menu',
  props: ['menuTreeData', 'clientHeight'],
  data () {
    return {
      highlight: false,
      styles,
      type: 'searchData',
      filterText: '',
      treeKey: '',
      count: 0
    }
  },
  components: {navList},
  watch: {
    filterText(val) {
      this.selectList = []
      this.currentSelectIndex = 0;
      this.count = 0;
      this.$refs.tree.filter(val);
      if(this.selectList.length>0){
        this.count = this.selectList.length;
        // 默认选中第一个
        this.moveToCurrentNode(this.selectList[0])
      }

    },
    menuShow () {
      this.$refs['cy-menu'].style.left = this.menuShow ? '5px' : '-5.7rem'
    },
    treeHeight () {
      // this.$refs['cy-menu'].style.height = (this.treeHeight - 115) / 50 + 'rem'
    },
    menuTreeData (){
      this.filterText = '';
    }
  },
  mounted () {
  },
  methods: {
    nextSelectNode () {
      ++this.currentSelectIndex;
      if(this.currentSelectIndex>this.selectList.length-1){
        --this.currentSelectIndex;
        return;
      }
      this.moveToCurrentNode(this.selectList[this.currentSelectIndex])
    },
    preSelectNode () {
      --this.currentSelectIndex;
      if(this.currentSelectIndex < 0){
        ++this.currentSelectIndex
        return;
      }
      this.moveToCurrentNode(this.selectList[this.currentSelectIndex])
    },
    clearSelectNode () {
      this.filterText = ''
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false
      }
      this.$refs.tree.setCurrentKey(null)
    },
    moveToCurrentNode (nodeId) {
      // this.$refs.tree.setCurrentKey('10140')
      this.$refs.tree.setCurrentKey(nodeId)
      let c = this.$refs.tree.store.nodesMap[nodeId]
      this.expandNode(c)
      let self = this
      setTimeout(function () {
        self.$el.querySelector('.el-tree-node.is-current.is-focusable').scrollIntoView({
          behavior: 'smooth', // 平滑过渡
          block: 'center' // 上边框与视窗顶部平齐。默认值
        })
      }, 400)
    },
    expandNode: function (node) {
      if (node.parent) {
        node.parent.expanded = true
        this.expandNode(node.parent)
      }
    },
    filterNode (value, data) {
      if (!value) return true
      if (data.label.indexOf(value) > -1) {
        this.selectList.push(data.id)
      }
      return true
    },
    menuClick (index) {
      let arr = index.split('/')
      let id = arr[0]
      let parentId = arr[1]
      if (parentId === '0') return
      if (parentId === '10007') return
      this.setCatalogNodeId(id)
      this.setActiveName('condition')
    },
    handleMenu () {
      this.menuShow = !this.menuShow
      this.setMenuShow(this.menuShow)
    },
    handleTreeChange (key, node) {
      this.arr = []
      this.str = ''
      this.arr = node.checkedKeys
      for (let i = 0, len = this.arr.length; i < len; i++) {
        this.str += this.arr[i] + ','
      }
      this.str = this.str.slice(0, this.str.length - 1)
      this.setCatalogNodeId(this.str)
      this.setActiveName('condition')
    },
    ...mapActions('searchStore', {
      setCatalogNodeId: 'setCatalogNodeId',
      setActiveName: 'setActiveName',
      setMenuShow: 'setMenuShow'
    })
  },
  computed: {
    menuShow: {
      get: function () {
        return this.$store.state.searchStore.menuShow
      },
      set: function (newValue) {
        this.$store.state.searchStore.menuShow = newValue
      }
    },
    ...mapState('configManage', {
      treeHeight (state) {
        return state.commonHeight
      }
    })
    // clientHeight1: function () {
    //   this.$refs['cy-menu'].style.height = (this.clientHeight - 90) / 50 + 'rem'
    // }
  }
}
</script>

<style scoped>
.cy-menu{
  width: 5.7rem;
  position: absolute;
  left: 0px;
  top: 0px;
  z-index: 2;
  transition: left .8s;
  height: auto;
  padding: 0px;
  bottom: 0px;
  background-color:rgba(249,250,251,1);
  /*box-shadow: 0 0 3px #888;*/
  box-shadow:2px 0px 20px 0px rgba(0,0,0,0.1);
  opacity: 0.95;
}

.img{
  position:absolute;
  left: 5.7rem;
  color: rgba(0, 116, 214, .9);
  cursor: pointer;
  top:calc(50% - 40px);
}
.el-tree{
  opacity: .8;
  /*color: #fff;*/
  /*background-color: #2B2F35;*/
  color: #606266;
  font-weight:500;
  background-color: rgba(249,250,251,1);
}
.cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-checked>.el-tree-node__content {
  background-color: rgba(0,153,250,0.1);
  color:rgb(64, 158, 255);
}
.cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-current>.el-tree-node__content {
  /*background-color: rgb(13, 13, 13);*/
  background-color: rgba(0,153,250,0.1);
  color: #0099FA;
  font-weight: bold;
}
.cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-focusable>.el-tree-node__content {
  /*background-color: rgb(13, 13, 13);*/
}
.cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-focusable>.el-tree-node__content:hover {
  /*background-color: rgb(13, 13, 13);*/
  background-color: rgba(0,153,250,0.1);
}
.cy-menu .el-tree--highlight-current /deep/ .el-tree-node:focus>.el-tree-node__content {
  /*background-color: rgb(13, 13, 13);*/
  background-color: rgba(0,153,250,0.1);
}
.search_input >>> .el-input__inner {
  height: 32px;
  line-height: 32px;
  border-radius: 30px!important;
  background-color: rgba(234,234,234,0.5)!important;
  color: #999999!important;
}
</style>
