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
              <el-checkbox @change="checkboxChange" :title="item.name" :label="item.name" v-for="(item) in checkData" :key="item.name"></el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content query_con_light">
          <!--<div class="query_con_light_icon">-->
            <!--<img src="../img/right_icon.png" alt="">-->
            <!--<img src="../img/left_icon.png" alt="">-->
          <!--</div>-->
          <div class="query_con_light_res">
            <div class="query_con_light_btu">
              <upDataM @toolsFeatureExecl="toolsFeatureExecl"></upDataM>
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
                        label="查询名称">
                        <template slot-scope="scope">
                          <el-input size="mini" v-model="scope.row.falisaname" placeholder="查询名称"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column
                        label="查询模式">
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.fsqltype" placeholder="请选择">
                            <el-option
                              v-for="item in optionsSql"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                            </el-option>
                          </el-select>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="name"
                        label="默认值">
                        <template slot-scope="scope">
                          <el-input :disabled="scope.row.fname !== '12'" size="mini" v-model="scope.row.fdefaultvalue" placeholder="默认值"></el-input>
                        </template>
                      </el-table-column>
                      <el-table-column
                        prop="address"
                        label="呈现模式">
                        <template slot-scope="scope">
                        <el-select v-model="scope.row.fquerytype" placeholder="请选择">
                          <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </template>
                      </el-table-column>
                      <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                          <img  :disabled="scope.$index===0"
                               @click="moveUp(scope.$index,scope.row)"
                                title="上移" class="imgOne" src="../img/px_top.png" alt="">
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
                <el-button @click="saveOrUpdateQueryFiledP" type="primary" >保存</el-button>
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
        tableName: '',
        tableCheckName: [],
        checkList: [],
        checkData: [],
        total: 100,
        pageSize: 10,
        currentPage: 1,
        pagerCount: 5,
        heightD: 0,
        tableData: [],
        options: [
          {
            label: '多选框',
            value: 'SingleEnumImp'
          },
          {
            label: '多选框(产品级别)',
            value: 'SingleEnumImplevel'
          },
          {
            label: '滑块',
            value: 'SingleIntConfig'
          },
          {
            label: '文本框',
            value: 'SingleTextConfig'
          },
          {
            label: '时间范围',
            value: 'RangeDateConfig'
          }
        ],
        optionsSql: [
          {
            label: 'in',
            value: 'in'
          },
          {
            label: 'like',
            value: 'like'
          },
          {
            label: '=',
            value: '='
          }
        ]
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
      this.getAllTableRowByNodeIdP(this.nodeDataIndex)
      this.getQueryFiledByNodeIdP(this.nodeDataIndex)
      this.getTableNameByNodeIdP(this.nodeDataIndex)
    },
    // 上传文件
    toolsFeatureExecl (val) {
      let fileap = val.response.data.split("orderfile/")[1]
      console.log(fileap, 'queryset')
      let param ={
        exePath: fileap,
        fnodeid: this.nodeDataIndex,
        tableName: this.tableName
      }
      this.impDisplayFiledForExcelP(param)
    },
    impDisplayFiledForExcelP (param) {
      http.impQueryFiledForExcel({
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
      console.log(this.nodeDataIndex, 'this.nodeDataIndex')
      if (!this.nodeDataIndex) {
        this.$message({
          message: '请选择节点！',
          type: 'warning'
        })
      } else {
        http.expQueryFiledForExcel({
          data: {fnodeid: this.nodeDataIndex}
        }).then(res => {
          window.open(res.data, '_black')
        })
      }
    },
    // 查询展示字段更新保存
    saveOrUpdateQueryFiledP () {
      if (this.tableData.length > 0) {
        this.tableData.forEach((item, index) => {
          item.forder = index + 1
        })
      } else {
        // this.$message({
        //   message: '暂无保存数据！',
        //   type: 'warning'
        // })
      }
      http.saveOrUpdateQueryFiled({data: {agrsQueryFiledList: this.tableData, fnodeid: this.nodeDataIndex,}}).then(res => {
        console.log('name', res)
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
    },
    // 通过nodeid获取table表名
    getTableNameByNodeIdP (param) {
      http.getTableNameByNodeId({data: {fnodeid: param}}).then(res => {
        this.tableName = res.data
      })
    },
    // 结果展示列表删除
    deleteDisplayFiledP () {},
    // 结果列表数据获取
    getQueryFiledByNodeIdP (param) {
      http.getQueryFiledByNodeId({data: {fnodeid: parseInt(param)}}).then(res => {
        console.log(res, 'opopopppopo')
        this.tableData = res.data
      })
    },
    //查询nodeId对应所有字段名称
    getAllTableRowByNodeIdP (param) {
      this.checkList = []
      http.getAllQueryTableRowByNodeId({data: {fnodeid: parseInt(param)}}).then(res => {
        let checkDataz = []
        if (res.data && res.data.length > 0){
          res.data.forEach(item => {
            for (let key in item) {
              if (item[key]) {
                this.checkList.push(key)
              }
              checkDataz.push({
                name: key,
                isChecked: item[key]
              })
            }
          })
        }
        this.checkData = checkDataz
        console.log( this.checkData, ' this.checkData')
        // this.$nextTick(() => {
        //
        // })
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
    // deleteD 结果展示列表删除
    deleteD (indexD, param) {
      this.tableData.splice(indexD, 1)
      this.checkList.forEach((item, index) => {
        if (param.fname.toLowerCase() === item.toLowerCase()) {
          this.checkList.splice(index, 1)
        }
      })
    },
    handleData (val) {
      let _this = this
      if (_this.checkboxD) {
        _this.tableData.push({
          fnodeid: _this.nodeDataIndex,
          fschemekey: _this.tableName,
          forder: '',
          falisaname: '',
          fquerytype: '',
          fsqltype: '',
          fdefaultvalue: '',
          fname: val[val.length - 1].toLowerCase(),
        })
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
      }
    },
    handleCurrentChange () {},
    handleSizeChange () {},
    ...mapActions('searchStore', {
      setNodeDataIndex: 'setNodeDataIndex'
    })
  },
  watch: {
    nodeDataIndex: {
      handler(newVal, oldValue) {
        if (newVal !== 0 && this.activeName === 'second' ){
          console.log(newVal, 'nodeDataIndex')
          // this.fnodeidData = parseInt(newVal)
          this.getAllTableRowByNodeIdP(newVal)
          this.getQueryFiledByNodeIdP(newVal)
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
    /*width: calc(100% - 50px);*/
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
