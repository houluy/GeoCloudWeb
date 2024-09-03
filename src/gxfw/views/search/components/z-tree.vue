<template>
  <div class="cy-menu" ref="cy-menu">
    <img class="img"  height="100" :title="this.menuShow ? '收缩': '展开'" :src="this.menuShow ? require('@/assets/images/search/arrowz21.png'): require('@/assets/images/search/arrowz22.png')" @click="handleMenu">
    <div style="width: calc(100% - 16px); padding: 8px 8px; height: calc(100% - 20px);  text-align: center;">
      <el-scrollbar  style="height: calc(100%);">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
          <el-collapse-item v-for="(item, index) in  menuTreeDataT"  :name="item.id" :key="item.id">
            <template slot="title" >
              <img style=" margin-left: 10px;" :src="item.imgUrLl" alt="" width="21px">
              <div class="groupC" @click.stop="stopDefault">
                <el-checkbox-group @change="handleChangeBox(index)"  v-model="checkList_top">
                  <el-checkbox :label="item" >{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
            <div>
              <el-checkbox-group @change="handleChangeGroup" v-model="checkList">
                <el-checkbox v-for="(e, index) in item.children" :title="e.label" :label = 'e.id' :key="index">{{e.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <el-collapse-item  v-for="(item) in  dataTableDZY"  :name="item.id" :key="item.id">
            <template slot="title">
              <img style=" margin-left: 10px;" :src="item.imgUrLl" alt="" width="21px">
              <span class="titleSpan">{{item.label}}</span>
            </template>
            <div>
              <div :class="{activelist: activeC === e.id, childrenList: true}" @click="childrenListChange(e)" v-for="(e, index) in item.children" :title="e.label" :label = 'e.id' :key="index"><img src="@/assets/img/images/文件夹.png" style="vertical-align: sub; margin-right: 5px" alt="">{{e.label}}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
    <!--图例-->
    <div v-if="this.tlList.length > 0 && this.tlShow" ref="showTL" id="showTL" class="icontl">
      <p style="line-height:25px;text-align:center;margin-top:4px;color: #333;font-size: 16px;margin-bottom: 5px;">图例</p>
      <div v-for="(item, index) in this.tlList" :key="index">
        <img :src="item.imgUrl" style="height:15px; float: left;" alt="" title="图例" />
        <span style="color:black; float: left">&nbsp;&nbsp;{{item.label}}</span><br />
      </div>
    </div>
  </div>
</template>
<script>
import navList from '@comm/components/navList.vue'
import styles from '@/assets/css/global.scss'
import http from '@comm/service/interface.js'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'cy-menu',
  props: ['menuTreeData'],
  data () {
    return {
      highlight: false,
      showtl: true,
      styles,
      type: 'searchData',
      filterText: '',
      treeKey: '',
      count: 0,
      activeNames: '10001',
      activeNames_acticve: '10001',
      menuTreeDataT: [],
      imgListD: [
        require('@/assets/img/tree_test.png'),
        require('@/assets/img/gxzzcp.png'),
        require('@/assets/img/ldzzcp.png'),
        require('@/assets/img/zthyy.png')
      ],
      nodeRest: '',
      checkNodeName: [],
      checkList: ['100016'],
      checkList_top: [],
      dataTableD: [],
      dataTableDZY: [],
      menuTreeInitD: [],
      clientHeight: '',
      activeC: ''
    }
  },
  components: {navList},
  watch: {
    filterText (val) {
      this.selectList = []
      this.currentSelectIndex = 0
      this.count = 0
      this.$refs.tree.filter(val)
      if (this.selectList.length > 0) {
        this.count = this.selectList.length
        // 默认选中第一个
        this.moveToCurrentNode(this.selectList[0])
      }
    },
    menuShow () {
      this.$refs['cy-menu'].style.left = this.menuShow ? '0px' : '-16vw'
    },
    menuTreeData () {
      this.filterText = ''
    },
    nodeIndexData (val) {
      if (val) {
        this.setCatalogNodeId(this.nodeRest)
        this.setCatalogNodeIdZ(this.nodeRest)
        this.setNodeIndexData(false)
      }
    }
  },
  mounted () {
    this.getTree()
    this.clientHeight = `${document.documentElement.clientHeight}`// 获取浏览器可视区域高度
    window.onresize = () => {
      return (() => {
        this.clientHeight = `${document.documentElement.clientHeight}`
        this.setclientHeight(this.clientHeight)
      })()
    }
  },
  methods: {
    getTree () {
      http.getAgrsCatalogTree().then(res => {
        this.dataTableD = []
        let dzyData = []
        if (res.data.length > 0) {
          this.menuTreeInitD = res.data
          this.setTreeChecked(res.data)
          res.data.forEach(item => {
            this.dataTableDZY.push(item)
            if (window.nodeName.indexOf(item.label) > -1) {
              this.dataTableD.push(item)
            } else if (window.nodeNameSingle.indexOf(item.label) > -1 ){
              dzyData.push(item)
            }
          })
          this.handleChangeGroup()
          this.menuTreeDataT = this.dataTableD
          this.dataTableDZY = dzyData
        }
      })
    },
    setTreeChecked (val) {
      if (val.length > 0) {
        val.forEach((item, index) => {
          if (item.id === '10001') {
            item.imgUrLl = this.imgListD[2]
          } else {
            item.imgUrLl = this.imgListD[2]
          }
        })
      }
    },
    getFirstOneD (val) {
      if (this.menuTreeInitD.length > 0) {
        this.menuTreeInitD.forEach(item => {
          if (val === item.id) {
            if (item.children.length > 0) {
              this.setCatalogNodeId(item.children[0].id)
              this.setCatalogNodeIdZ(item.children[0].id)
              this.activeC = item.children[0].id
            }
          }
        })
      }
    },
    handleChange (val) {
      this.checkList_top = []
      if (val) {
        this.setNewTimeD(1)
        this.setSearchIndex(1)
        this.setTlShow(false)
        this.getFirstOneD(val)
        if (val === '10001' || val === '10002' || val === '10003') {
          this.$emit('headCallBack', true)
          // 工具栏图例隐藏
          this.setToolListShow(false)
          this.checkList = ['100016']
          // region 卫星第一个选中checkout框
          // setTimeout(() => {
          //   this.checkList = ['100016']
          // },500)
          // endregion
        } else {
          this.$emit('headCallBack', false)
          // 工具栏图例显示
          this.setToolListShow(true)
          if ((val === '10013') || (val === '10014')) {
            this.setTableShow(false)
          } else {
            this.setTableShow(true)
          }
        }
        if (val !== this.activeNames_acticve) {
          this.checkList = []
          this.activeNames_acticve = val
        }
      }
    },
    stopDefault (e) {
      e.stopPropagation()
    },
    handleChangeBox (val) {
      this.checkList = []
      // this.activeNames = val
      if (this.checkList_top.length > 0) {
        this.checkList_top[0].children.forEach(item => {
          this.checkList.push(item.id)
        })
        this.handleChangeGroup()
      } else {
        this.checkList = []
        this.handleChangeGroup()
      }
    },
    childrenListChange (val) {
      this.setActiveName('condition')
      this.$emit('headCallBack', true)
      this.setNewTimeD(1)
      this.setSearchIndex(1)
      this.setTlShow(false)
      this.activeC = val.id
      this.setCatalogNodeId(val.id)
    },
    handleChangeGroup () {
      let _that = this
      _that.checkNodeName = []
      _that.setActiveName('condition')
      let nodeId = ''
      if (_that.checkList.length > 0) {
        _that.checkList.forEach(item => {
          nodeId += item + ','
          _that.dataTableD.forEach(iteme => {
            iteme.children.forEach(e => {
              if (e.id === item) {
                _that.checkNodeName.push(e.name)
              }
            })
          })
        })
      }
      if (nodeId) {
        nodeId = nodeId.slice(0, nodeId.length - 1)
        this.nodeRest = nodeId
      }
      this.setCatalogNodeId(nodeId)
      this.setCatalogNodeIdZ(nodeId)
      this.setNewTimeD(1)
      this.setSearchIndex(1)
    },
    handleMenu () {
      this.menuShow = !this.menuShow
      this.setMenuShow(this.menuShow)
    },
    ...mapActions('searchStore', {
      setCatalogNodeId: 'setCatalogNodeId',
      setCatalogNodeIdZ: 'setCatalogNodeIdZ',
      setActiveName: 'setActiveName',
      setNewTimeD: 'setNewTimeD',
      setSearchIndex: 'setSearchIndex',
      setMenuShow: 'setMenuShow',
      setTableShow: 'setTableShow',
      setNodeIndexData: 'setNodeIndexData',
      setToolListShow: 'setToolListShow',
      setTlShow: 'setTlShow',
      setclientHeight: 'setclientHeight'
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
    }),
    ...mapState('searchStore', {
      nodeIndexData (state) {
        return state.nodeIndexData
      },
      tlList (state) {
        return state.tlList
      },
      tlShow (state) {
        return state.tlShow
      }
    })
  }
}
</script>

<style scoped lang="scss">
  @import '@/assets/css/global.scss';
  .cy-menu{
    /*width: 4.7rem;*/
    width: 16vw;
    position: absolute;
    left: 0px;
    top: $cymenuTop;
    z-index: 1;
    transition: left .8s;
    height: auto;
    padding: 0px;
    bottom: 0px;
    background-color:#fff;
    /*box-shadow: 0 0 3px #888;*/
    box-shadow:2px 0px 20px 0px rgba(0,0,0,0.1);
    opacity: 0.95;
  }
  .img{
    position:absolute;
    left: 15.9vw;
    /*left: 4.6rem;*/
    height: 60px;
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
  .cy-menu>>>.el-collapse-item__header.is-active {
    border-radius: 5px 5px 0px 0 !important;
  }
  .cy-menu>>>.el-collapse-item__header {
    background: #3D6EF1 !important;
    height: 35px !important;
    line-height: 35px !important;
    color: #FFF !important;
    border-radius: 5px 5px 5px 5px;
  }
  .cy-menu>>>.el-collapse-item__content .el-checkbox{
    width: 59%;
    padding: 10px;
  }
  .cy-menu>>>.el-collapse-item__header .el-checkbox{
    width: 84.1%;
    display: block;
    color: #FFF !important;
  }
  .cy-menu>>>.el-collapse-item__header .el-checkbox__label{
    font-size: 16px !important;
    float: left;
  }
  .cy-menu>>>.el-collapse-item__header .el-checkbox__input{
    font-size: 16px !important;
    float: right;
  }
  .cy-menu>>>.el-collapse-item__content .el-checkbox__label{
    font-size: 13px !important;
    float: left;
    width: 63%;
    overflow: hidden;
    text-overflow: ellipsis; /*以省略号...显示*/
    white-space: nowrap; /*强制不换行*/
  }
  .cy-menu>>>.el-collapse-item__content .el-checkbox__input{
    font-size: 14px !important;
    float: right;
  }
  .cy-menu>>>.el-checkbox-group .el-checkbox__label{
    font-size: 14px !important;
    float: left;
    text-align: left !important;
  }
  .cy-menu>>>.el-checkbox-group .el-checkbox__input{
    font-size: 13px !important;
    float: right;
    z-index: 1000;
  }
  .cy-menu>>>.el-checkbox-group{
    width: 97%;
    z-index: 100;
  }
  .cy-menu>>>.el-checkbox{
    margin-right: 0px !important;
  }
  .groupC{
    width: 100%;
    height: 35px;
    padding-top: 22px;
  }
  .groupC>>>.el-checkbox__input.is-checked+.el-checkbox__label{
    color: #fff!important;
  }
  .cy-menu>>>.el-collapse-item__content {
    padding-bottom: 3px !important;
    margin-bottom: 20px;
    border: 1px solid #ECE6E6;
    border-radius: 0 0 5px 5px;
    overflow: hidden;
    width: 99%;
  }
  .cy-menu>>>.el-collapse-item__wrap{
    border-bottom: none;
  }
  .cy-menu>>>.el-scrollbar__wrap{
    /*margin-right: -7px !important;*/
  }
  .cy-menu>>>.el-checkbox__label{
   line-height: 16px !important;
  }
  .cy-menu>>>.el-scrollbar__bar.is-vertical{
    right: -9px;
  }
  .titleSpan{
    padding-left: 10px;
    font-size: 14px !important;
    float: left;
    text-align: left !important;
  }
  .childrenList{
    height: 40px !important;
    line-height: 40px !important;
    /*background-color: #EFF3FD !important;*/
    font-size: 14px;
    cursor: pointer;
    padding-left: 30px !important;
    text-align: left;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
  .activelist {
    color: rgb(135, 171, 255);
  }
  #showTL{
    position: absolute;
    background-color: rgb(255, 255, 255);
    opacity: 0.7;
    width: max-content;
    line-height: 16px;
    margin-left: 2px;
    /*padding-bottom: 10px;*/
    border-radius: 5px;
    padding: 0 15px 10px;
    text-align: left;
    left: 16vw;
    bottom: 4px;
  }
</style>
