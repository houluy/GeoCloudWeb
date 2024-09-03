<template>
  <div class="shopCarDirectAcquisition">
    <el-dialog
      title="关联任务号"
      :visible.sync="flag"
      modal
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table
        ref="singleTable"
        :data="tableData"
        width="800"
        height="340"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column  align="center">
          <template slot-scope="scope">
            <el-checkbox
                      @change.native="getTemplateRow(scope.row)" style="margin-left: 10px;">&nbsp;
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column
          prop="jobname"
          label="作业名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="taskid"
          label="任务编号"
          align="center"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="taskdate"
          label="任务日期"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="taskrequire"
          label="任务要求"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="ordername"
          label="关联订单"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          v-if="false"
          label="订单状态"
          align="center"
          :formatter="statusConverter">
          <template slot-scope="scope">
            <span
              :class="{colorindexO: scope.row.orderstatus === 2 || scope.row.orderstatus === 5, colorindexT: scope.row.orderstatus === 3, colorindexTh: true }">{{
                statusConverter(scope.row.orderstatus)
              }}</span>
          </template>
          <span></span>
        </el-table-column>
        <el-table-column
          v-if="false"
          prop="shapepath"
          label="工作区"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>
      <div class="resultPagination">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[30, 50, 100, 500,1000]"
          @current-change="handleCurrentChanges"
          @size-change="handleSizeChange"
          layout="total, prev, jumper, next, sizes"
          :total="total">
        </el-pagination>
      </div>
      <el-button type="primary" @click="changFlag">确 定</el-button>
      <!--
              <el-button type="primary" size="small" @click="determine" class="surebutton">确定</el-button>
      -->

    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import http from '@comm/service/interface.js'
import shopCar from '@comm/views/manage/person/components/shopCar'

export default {
  //name: 'shopCarDirectAcquisition',
  props: ['flagdata'],
  mounted() {
    this.findOrderTaskList()
    this.pageSize = this.changeFixedPageSizeZ(document.documentElement.clientHeight - 380, 49)
    // this.flag = this.flager
  },
  data() {
    return {
      tableData: [],
      flag: false,
      value1: '',
      jobname: '',
      taskid: '',
      taskdate: '',
      taskrequire: '',
      ordername: '',
      shapepath: '',
      orderStatus: '',
      value2: '',
      templateSelection: '',
      templateRadio: false,
      lineData: [],
      username: '',
      pageSize: 30,
      total: null,
      orderStatusIndex: 1,
      orderStatusGly: '',
      dialogFormVisible: false,
      currentPage: 1,
      currentRow: null,
    }
  },
  watch: {
    flagdata: {
      handler(val) {
        if (val.data && val.data === 1) {
          this.ordername = val.orderName
          this.postUpDateOrderName()
          this.$router.push({path: 'orderManage_pastAudit'})
        }
        this.flag = val.flager
        this.ordername = val.orderName
        //console.log(val.orderName)
        //this.findOrderTaskList()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getTemplateRow(row) {
      this.templateSelection = row;
    },
    postUpDateOrderName() {
      console.log(this.currentRow)
      let taskId = this.templateSelection.taskid
      let params = {
        data: {
          taskid: taskId,
          ordername: this.ordername,
          orderstatus: 1
        }
      }
      console.log('mj20210914001', params)
      http.updateTask(params).then(res => {
        console.log("insert", res)
        //windows.parent.findOrderList(event, 'dataTask/index')
        this.flag = false
      })
      this.flag = false
    },
    changFlag() {
      if (this.templateSelection.taskrequire.indexOf('Factory') !== -1) {
        let val = {
          type: 3,
          distmethod: 4
        }
        this.$parent.directcommit(val)
      }else {
        this.$parent.directcommit()
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleSelectionChange(val) {
      this.sels = val
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.findOrderTaskList()
    },
    handleCurrentChanges(val) {
      this.currentPage = val
      this.findOrderTaskList()
    },
    findOrderTaskList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        data: {
          taskid: '',
          ordername: '',
        }
      }
      http.selectTask(params).then((res) => {
        for(var i=0;i<res.data.list.length;i++){
        if (res.data.list.ordername === undefined) {
          this.tableData.push(res.data.list[i])
          this.total = res.data.total
          // console.log("1212", this.tableData)
        }
        }
      }).catch(function (error){
        console.log(this.tableData)
      })
    }
  }
}
</script>

<style scoped>
.demo-form-inline {
  text-align: center;
}
.resultPagination{
  text-align: right;
  float: right;
}
</style>
