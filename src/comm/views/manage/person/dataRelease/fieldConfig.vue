<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="tree_con">
            <el-tree
              :data="treeData"
              node-key="id"
              ref="treeD"
              highlight-current
              @node-click="nodeClick"
              default-expand-all>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="查询条件设置" name="second">
              <querySet :activeName="activeName"></querySet>
            </el-tab-pane>
            <el-tab-pane label="结果列表设置" name="third">
              <resultSet :activeName="activeName"></resultSet>
            </el-tab-pane>
            <el-tab-pane label="详情列表设置" name="four">
              <detailSet :activeName="activeName"></detailSet>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import querySet from './components/querySet'
  import resultSet from './components/resultSet'
  import detailSet from './components/detailSet'
  import { mapActions } from 'vuex'
  import http from '@comm/service/interface.js'
  export default {
    name: "directoryConfig",
    components: {
      querySet,
      resultSet,
      detailSet
    },
    data () {
      return{
        nodeindex: '100016',
        nodeindexS: '100016',
        activeName: 'second',
        total: 0,
        pageSize: 10,
        currentPage: 1,
        heightD: 0,
        dialogVisible: false,
        form: {
          name: '',
          radio: '',
          optionsDvalue: '',
          textareaD: ''
        },
        tableData: [],
        treeData:[],
        nodeD: '100016',
      }
    },
    created () {
      let d = document.documentElement.clientHeight
      this.heightD = (d * 0.98 -150) * 0.78 -  0.04 * d - 60
    },
    mounted () {
      this.getMLAgrsCatalogTreeData()
    },
    methods: {
      // tree节点被点击
      nodeClick (node) {
        if (node.parentId !== '0') {
          this.nodeD = node.id
          this.setNodeDataIndex(node.id)
        } else {
          this.setNodeDataIndex(0)
        }
      },
      // 目录树数据的查询方法
      getMLAgrsCatalogTreeData () {
        http.getMLAgrsCatalogTree().then(res => {
          if (res.data && res.data.length > 0) {
            this.treeData = res.data
          }
          // 初始化默认选中100016节点
          this.$nextTick(() => {
            this.$refs.treeD.setCurrentKey('100016') // CheckedArr 一个选中的数组element Ui的东西，关键是看nextTick的用法
          })
        })
      },
      handleClick () {
        this.setNodeDataIndex(0)
        this.setNodeDataIndex(this.nodeD)
      },
      handleCurrentChange () {},
      handleSizeChange () {},
      ...mapActions('searchStore', {
        setNodeDataIndex: 'setNodeDataIndex'
      })
    }
  }
</script>

<style scoped>
  el-col{
    border: 1px solid #edeff1;
  }
  .bg-purple{
    height: calc(98vh - 148px);
    border: 1px solid #edeff1;
    margin-right: 10px;
    box-shadow: 1px 2px 7px 2px #edeff1;
    background: #fff;
  }
  .bg-purple-light{
    border: 1px solid #edeff1;
    box-shadow: 1px 2px 7px 2px #edeff1;
    background: #fff;
  }
  /*.bg-purple-light>>>.el-tabs--top .el-tabs__item.is-top:last-child {*/
    /*padding-left: 20px !important;*/
    /*font-weight: bold;*/
  /*}*/
  /*.bg-purple-light>>>.el-tabs--top .el-tabs__item.is-top:nth-child(2) {*/
    /*padding-left: 40px !important;*/
    /*font-weight: bold;*/
  /*}*/
  .bg-purple-light>>>.el-tabs__item {
    padding-left: 40px !important;
    font-weight: bold;
  }
  .bg-purple-light>>>.el-tabs__header {
    margin: 7px 0 15px !important;
  }
  .bg-purple-light>>>.el-tabs__content {
    padding: 5px 16px 20px 16px;
    height: calc(98vh - 237px)!important;
  }
  .tree_con{
    height: calc(99% - 4vh);
    margin-top: 4vh;
  }
  .tree_span{
    text-align: center;
    color: red;
  }
  .bg-purple-light{
    height: calc(98vh - 150px);
  }
  .con_top{
    width: 100%;
    height: calc(22% - 1vh);
    margin-bottom: 1vh;
    background: #fff;
    border: 1px solid #edeff1;
    box-shadow: 1px 2px 7px 2px #edeff1;
  }
  .con_content{
    width: 100%;
    height: 78%;
    background: #fff;
    border: 1px solid #edeff1;
    box-shadow: 1px 2px 7px 2px #edeff1;
  }
  .echarts_bot_top{
    margin-left: 1%;
    margin-top: 2vh;
  }
  .echarts_bot_top img{
    top: -1px;
    position: relative;
  }
  .con_top_condition{
    height: calc(90% - 15px - 6vh);
    padding: 2.5vh 1%;
  }
  .dire_search{
    text-align: right;
  }
  .dire_search_span{
    border-radius: 4px;
    height: 30px;
    display: inline-block;
    width: 85px;
    text-align: center;
    line-height: 30px;
    /*font-family: PingFangSC-Regular, PingFang SC;*/
    font-weight: 400;
    font-size: .25rem;
    cursor: pointer;
  }
  .dire_search_one{
    background: #3C6EF0;
    color: #fff;
    margin-right: 10px;
  }
  .dire_search_two{
    background: #fff;
    border: 1px solid #3C6EF0;
    color: #3C6EF0;
    margin-right: 40px;
  }
  .dire_search_there{
    background: #FFAE1D;
    color: #fff;
  }
  .table_con_data{
    padding: 1vh;
  }
  .table_con_data >>> .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #FCFDFF !important;
  }
  .table_con_data >>> .el-table th {
    background: #F1F4F9 !important;
    text-align: center !important;
    /*font-family: PingFangSC-Medium, PingFang SC;*/
    font-weight: bold !important;
    color: #333333 !important;
  }
  .dir_table_con >>> .el-table th {
    background: #DDE5FC !important;
    text-align: center !important;
    /*font-family: PingFangSC-Medium, PingFang SC;*/
    font-weight: bold !important;
    color: #333333 !important;
    padding: 3px !important;
  }
  .table_con_data >>> .el-table .cell {
    text-align: center;
  }
  .dir_table_con >>> .el-table .cell {
    text-align: center;
  }
  .dir_table_con >>>.el-table--small td{
    padding: 3px 0 !important;
  }
  .table_con_data >>> img {
    cursor: pointer;
    width: 16px;
  }
  .table_con_data >>> .imgOne {
    margin-right: 16px;
  }
  .table_con_data >>> .imgTwo {

  }
  .pagination_con{
    text-align: right;
    margin-right: 20px;
  }
  .dialog_con >>>.el-dialog__header {
    padding: 13px 20px 10px !important;
    color: #333333;
    font-weight: bold;
    border-bottom: 1px solid #EAEAEA;
  }
  .dialog_con >>>.el-dialog__headerbtn {
    top: 10px !important;
    font-size: 20px !important;
  }
  .dialog_con >>>.el-dialog__body {
    padding: 20px 20px 20px 30px !important;
    border-bottom: 1px solid #EAEAEA;
  }
  .spanlable{
    position: absolute;
    color: red;
    font-size: 30px;
    display: inline-block;
    /*margin-left: 7px;*/
  }
  .dir_table{
    height: 22vh;
    background: rgba(60, 110, 240, 0.05);
    padding: 14px 14px 4px 14px;
    margin-bottom: 10px;
  }
  .dir_table_top{
    position: relative;
    width: 100%;
    vertical-align: middle;
    float: left;
    margin-bottom: 10px;
    font-size: 14px;
    color: #606266;
  }
  .dir_table_con{
    height: 80%;
    width: 95%;
    overflow: auto;
  }
  .dir_table_delete{
    position: absolute;
    right: 0;
    top: 55px;
    width: 16px;
    cursor: pointer;
  }
  .dir_table_add{
    position: absolute;
    right: 0;
    top: 30px;
    width: 16px;
    cursor: pointer;
  }
  .dialog_con>>>.el-dialog{
    margin-top: 5vh !important;
  }
  .tree_con{
    height: calc(97% - 6vh);
    margin-bottom: 2vh;
    margin-top: 4vh;
    overflow: auto;
  }
  .el-tree {
    display: inline-block;
    min-width: 100%;
  }
  .tree_con>>>.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #DDE5FC !important;
  }
</style>
