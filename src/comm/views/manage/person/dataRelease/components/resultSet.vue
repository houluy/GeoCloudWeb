<template>
  <div class="query_con">
    <el-row>
      <el-col :span="4">
        <div class="grid-content query_con_purple">
          <div class="echarts_bot_top">
            <img src="../img/iconspan.jpg" height="14" width="4"/>
            <span>字段名称</span>
          </div>
          <div class="query_con_check">
            <el-checkbox-group v-model="checkList" @change="checkListChange">
              <el-checkbox @change="checkboxChange" v-model="item.name" :title="item.name" :label="item.name" v-for="(item, index) in checkData" :key="index">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content query_con_light">
          <div class="query_con_light_res">
            <div class="query_con_light_btu">
              <upDataM @toolsFeatureExecl="toolsFeatureExecl"></upDataM>
              <!--<el-button @click="importRuData" type="primary" >导入模板</el-button>-->
              <el-button @click="exprotRuData" type="primary" >导出模板</el-button>
            </div>
            <div class="query_con_light_table">
              <div class="table_con">
                <div class="table_con_data">
                  <template>
                    <el-table
                      :height="heightD"
                      :data="tableData"
                      stripe
                      style="width: 100%">
                      <el-table-column
                        prop="fname"
                        label="绑定字段">
                      </el-table-column>
                      <el-table-column
                        prop="falisaname"
                        width="280"
                        label="展示名称">
                        <template slot-scope="scope">
                          <el-input size="mini" v-model="scope.row.falisaname" placeholder="请输入内容"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                          <img :disabled="scope.$index===0"
                               @click="moveUp(scope.$index,scope.row)" title="上移" class="imgOne" src="../img/px_top.png" alt="">
                          <img :disabled="scope.$index===(tableData.length-1)"
                               @click="moveDown(scope.$index,scope.row)"  title="下移" class="imgTwo" src="../img/px_down.png" alt="">
                          <img @click="deleteD(scope.$index, scope.row)" title="删除" class="imgTwo" src="../img/delete.png" alt="">
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </div>
              </div>
              <div class="pagination_con">
                <!--<el-pagination-->
                  <!--@size-change="handleSizeChange"-->
                  <!--@current-change="handleCurrentChange"-->
                  <!--:current-page="currentPage"-->
                  <!--:pager-count="pagerCount"-->
                  <!--:page-sizes="[10, 20, 30, 40]"-->
                  <!--:page-size="pageSize"-->
                  <!--background-->
                  <!--layout="prev, pager, next, sizes, jumper"-->
                  <!--:total="total">-->
                <!--</el-pagination>-->
                <el-button @click="saveOrUpdateDisplayFiledP" type="primary" >保存</el-button>
                <el-button type="primary" plain>取消</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import http from '@comm/service/interface.js'
  import upDataM from '@comm/components/upDataM.vue'
  import { mapActions, mapState } from 'vuex'
  export default {
    name: "querySet",
    props: ['activeName'],
    components: {
      upDataM
    },
    computed: {
      ...mapState('searchStore', {
        nodeDataIndex (state) {
          return state.nodeDataIndex
        }
      })
    },
    data () {
      return {
        checkboxD: false,
        fnodeidData: 0,
        checkList: [],
        tableCheckName: [],
        checkData: [],
        total: 100,
        pageSize: 10,
        currentPage: 1,
        pagerCount: 5,
        heightD: 0,
        tableData: [],
        options: [],
        tableName: ''
      }
    },
    created () {
      let d = document.documentElement.clientHeight
      this.heightD = d * 0.98 -311
    },
    mounted () {},
    methods:{
      // 初始化数据
      initD () {
        this.getAllTableRowByNodeIdP(this.fnodeidData.toString())
        this.getDisplayFiledByNodeIdP(this.fnodeidData.toString())
        this.getTableNameByNodeIdP(this.fnodeidData.toString())
      },
      // 上传文件
      toolsFeatureExecl (val) {
        console.log(val.name, 'resultset')
        let param ={
          exePath: val.name,
          fnodeid: this.fnodeidData,
          tableName: this.tableName
        }
        this.impDisplayFiledForExcelP(param)
      },
      impDisplayFiledForExcelP (param) {
        http.impDisplayFiledForExcel({
          data: param
        }).then(res => {
          console.log('impDisplayFiledForExcelP', res)
          if (res.data) {
            this.$message({
              message: '成功！',
              type: 'success'
            })
            this.initD()
          } else {
            this.$message({
              message: '失败！',
              type: 'error'
            })
          }
        })
      },
      // 导出结果列表配置模板
      exprotRuData () {
        if (this.fnodeidData === 0) {
          this.$message({
            message: '请选择节点！',
            type: 'warning'
          })
        } else {
          http.expDisplayFiledForExcel({
            data: {fnodeid: this.fnodeidData}
          }).then(res => {
            window.open(res.data, '_black')
          })
        }
      },
      // 导出结果列表配置模板
      importRuData () {
        if (this.fnodeidData === 0) {
          this.$message({
            message: '请选择节点！',
            type: 'warning'
          })
        } else {
          http.expDisplayFiledForExcel({
            data: {fnodeid: this.fnodeidData}
          }).then(res => {
            console.log('name', res)
            if (res.data === 'true') {
              this.$message({
                message: '成功！',
                type: 'success'
              })
            } else {
              this.$message({
                message: '失败！',
                type: 'error'
              })
            }
          })
        }
      },
      // 通过nodeid获取table表名
      getTableNameByNodeIdP (param) {
        http.getTableNameByNodeId({data: {fnodeid: param}}).then(res => {
          this.tableName = res.data
        })
      },
      // 结果列表数据获取
      getDisplayFiledByNodeIdP (param) {
        http.getDisplayFiledByNodeId({data: {fnodeid: parseInt(param)}}).then(res => {
          console.log(res.data, '09090900')
          this.tableData = res.data
        })
      },
      //查询nodeId对应所有字段名称
      getAllTableRowByNodeIdP (param) {
        this.checkList = []
        http.getAllTableRowByNodeId({data: {fnodeid: parseInt(param)}}).then(res => {
          this.checkData = []
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              for (let key in item) {
                if (item[key]) {
                  this.checkList.push(key)
                }
                this.checkData.push({
                  name: key,
                  isChecked: item[key]
                })
              }
            })
          }
        })
      },
      // 结果展示列表删除
      deleteDisplayFiledP (param) {
        http.deleteDisplayFiled({data: {
            fnodeid: param.fnodeid,
            fname: param.fname
          }}).then(res => {
          console.log('name', res)
          if (res.data === 'true') {
            this.$message({
              message: '成功！',
              type: 'success'
            })
          } else {
            this.$message({
              message: '失败！',
              type: 'error'
            })
          }
        })
      },
      // 勾选左侧字段
      checkListChange () {
        console.log(this.checkList, 'jijijiji')
        this.tableCheckName = []
        this.checkList.forEach(item => {
          this.tableCheckName.push(item.toLowerCase())
        })
        this.handleData(this.checkList)
      },
      // 勾选左侧字段
      checkboxChange (val) {
        console.log(val, 'jijijiji')
        this.checkboxD = val
      },
      // 结果展示字段更新保存
      saveOrUpdateDisplayFiledP () {
        if (this.tableData.length > 0) {
          this.tableData.forEach((item, index) => {
            item.fdisplayorder = index + 1
          })
          http.saveOrUpdateDisplayFiled({data: {agrsDisplayFiledList: this.tableData}}).then(res => {
            if (res.data) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
            } else {
              this.$message({
                message: '保存失败！',
                type: 'error'
              })
            }
          })
        } else {
          this.$message({
            message: '暂无需要保存的数据！',
            type: 'warning'
          })
        }
        // http.saveOrUpdateQueryFiled({data: {agrsQueryFiledList: this.tableData, fnodeid: this.nodeDataIndex,}}).then(res => {
        //   console.log('name', res)
        //   if (res.data) {
        //     this.$message({
        //       message: '保存成功！',
        //       type: 'success'
        //     })
        //   } else {
        //     this.$message({
        //       message: '保存失败！',
        //       type: 'error'
        //     })
        //   }
        // })
      },
      // deleteD 结果展示列表删除
      deleteD (indexD, param) {
        // this.$confirm('此操作将永久删除该结果展示, 是否继续?', '提示', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then( () => {
        //   console.log(param, 'param')
        this.tableData.splice(indexD, 1)
        this.checkList.forEach((item, index) => {
          if (param.fname.toLowerCase() === item.toLowerCase()) {
            this.checkList.splice(index, 1)
          }
        })
        // }).catch()
      },
      //向上移动
      moveUp(index,row) {
        let that = this;
        if (index > 0) {
          let upDate = that.tableData[index - 1];
          that.tableData.splice(index - 1, 1);
          that.tableData.splice(index,0, upDate);
        } else {
          this.$message({
            message: '已经是第一条，不可上移',
            type: 'warning'
          })
        }
      },
      //向下移动
      moveDown(index,row){
        let that = this;
        if ((index + 1) === that.tableData.length){
          this.$message({
            message: '已经是最后一条，不可下移',
            type: 'warning'
          })
        } else {
          let downDate = that.tableData[index + 1];
          that.tableData.splice(index + 1, 1);
          that.tableData.splice(index,0, downDate);
          console.log(that.tableData, 'that.tableData')
        }
      },
      handleCurrentChange () {},
      handleSizeChange () {},
      // 字段和table联动
      handleData (val) {
        let _this = this
        if (_this.checkboxD) {
          _this.tableData.push({fnodeid: _this.nodeDataIndex, fschemekey: _this.tableName, fdisplayorder: '', falisaname: '', fname: val[val.length - 1].toLowerCase(),})
        } else {
          if (_this.tableData.length > 0) {
            _this.tableData.forEach((item, index) => {
              if (_this.tableCheckName.indexOf(item.fname) === -1) {
                console.log(item.fname, index, 'item')
                _this.tableData.splice(index, 1);
              }
            })
          }
        }
        // if (val.length > 0) {
        //   val.forEach(item => {
        //     console.log(item, 'item')
        //     if (this.tableData.length > 0) {
        //       this.tableData.forEach(e => {})
        //     }
        //   })
        // }
        // if (val===1) {
        //   // let len = this.addModalData.taskSatDos.length + 1
        //   this.tableDataDire.push({fSensor: '', fSensorstr: '', fResolution: ''})
        // } else{
        //   // this.tableDataDire.map((item, i) => {
        //   //   item.index = i + 1
        //   //   return item
        //   // })
        //   console.log(this.tableDataDire, 'this.tableDataDire')
        //   this.tableDataDire = this.tableDataDire.splice(0, this.tableDataDire.length - 1)
        //   console.log(this.tableDataDire, 'this')
        // }
      },
    },
    watch: {
      nodeDataIndex: {
        handler(newVal, oldVal) {
          console.log(newVal, 'whighiehrg')
          if (newVal !== 0 && this.activeName === 'third'){
            console.log(newVal, 'nodeDataIndex123124124')
            this.fnodeidData = parseInt(newVal)
            this.getAllTableRowByNodeIdP(newVal)
            this.getDisplayFiledByNodeIdP(newVal)
            this.getTableNameByNodeIdP(newVal)
          }
        },
        immediate:true,
        deep: true
      }
    }
  }
</script>

<style scoped>
  .query_con{
    /*height: calc(98vh - 237px);*/
  }
  .query_con_purple{
    height: calc(98vh - 237px);
    background: #FAFBFC;
  }
  .echarts_bot_top{
    padding: 2vh 2vh;
  }
  .echarts_bot_top span{
    /*font-family: PingFangSC-Medium, PingFang SC;*/
    font-weight: bold;
    color: #333333;
  }
  .echarts_bot_top img{
    top: -1px;
    position: relative;
  }
  .query_con_check{
    height: calc(94vh - 260px);
    overflow: auto;
  }
  .query_con_check>>>.el-checkbox {
    color: #000000 !important;
    margin: 10px !important;
    line-height: 10px;
    width: calc(100% - 20px);
  }
  .query_con_check>>>.el-checkbox__input {
    float: right;
    top: 3px;
  }
  .query_con_check>>>.el-checkbox__label {
    width: 82%;
    font-size: .3rem !important;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }

  .query_con_light{
    height: calc(98vh - 237px);
  }
  .query_con_light_res{
    float: left;
    padding-left: 20px;
    width: calc(100% - 20px);
    height: calc(98vh - 237px);
  }
  .query_con_light_btu{
    height: auto;
    text-align: right;
    margin-bottom: 10px;
  }
  .query_con_light_icon{
    float: left;
    padding-top: calc(40vh - 100px);
  }
  .query_con_light_icon img{
    display: block;
    margin: 15px;
    width: 20px;
    cursor: pointer;
  }
  .pagination_con{
    margin-top: 5px;
    text-align: center;
  }
  .pagination_con >>> .el-pagination {
    float: left;
    width: 80%;
  }
  .table_con_data >>> .el-table th {
    background: #DDE5FC !important;
    font-weight: bold !important;
    color: #333333 !important;
    text-align: center !important;
    padding: 5px !important;
  }
  .table_con_data >>> .el-table .cell {
    text-align: center !important;
  }
  .table_con_data >>> img {
    cursor: pointer;
    width: 16px;
    margin-right: 5px;
  }
</style>
