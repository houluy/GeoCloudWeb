<template>
  <div class="associatedOrder">
    <el-dialog
      title="关联订单号"
      :visible.sync="flag"
      width="30%"
      modal
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="订单号">
          <el-input v-model="formInline.ordername" placeholder="请输入订单号关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        ref="singleTable"
        :data="tableData"
        width="600"
        height="340"
        highlight-current-row
        @current-change="handleCurrentChange">
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column
          prop="ordername"
          label="订单编号"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="dataSum"
          label="订购数据量"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          v-if="false"
          label="订单状态"
          align="center"
          :formatter="statusConverter">
          <template slot-scope="scope">
            <span :class="{colorindexO: scope.row.sstatus === 2 || scope.row.sstatus === 5, colorindexT: scope.row.sstatus === 3, colorindexTh: true }">{{scope.row.statusLabel}}</span>
          </template>
          <span></span>
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

export default {
  name: 'associatedOrder',
  props: ['flagdata'],
  data() {
    return {
      tableData: [],
      flag: false,
      value1: '',
      taskid: '',
      value2: '',
      lineData: [],
      username: '',
      pageSize: 30,
      total: null,
      orderStatusIndex: 1,
      orderStatusGly: '',
      orderStatus: '',
      dialogFormVisible: false,
      currentPage: 1,
      currentRow: null,
      orderstatusLabel: ['待审核', '审核通过', '审核未通过', '审核通过-待打包', '审核通过', '逾期', '数据准备完成', '已完成', '已反馈'],
      formInline: {
        ordername: ''
      },
      options: [
        {
          value: -1,
          label: '待提交'
        },
        {
          value: 0,
          label: '待审核'
        },
        {
          value: 1,
          label: '审核通过'
        },
        {
          value: 2,
          label: '审核未通过'
        },
        {
          value: 6,
          label: '数据准备完成'
        },
        {
          value: 7,
          label: '已完成'
        },
        {
          value: 5,
          label: '逾期'
        },
        {
          value: '',
          label: '所有状态'
        }
      ],
      sstatus:'',
      ordername: ''
    }
  },
  methods: {
    /* determine() {
       this.updateTask();
       console.log('determine')
     },*/
    onSubmit() {
      this.findOrderNameList()
    },
    changFlag() {
      let taskId = this.flagdata[1]
      let ordername = this.currentRow.ordername
      let orderS = this.currentRow.sstatus
      let params = {
        data: {
          taskid: taskId,
          ordername: ordername,
          orderstatus: orderS
        }
      }
      console.log('mj20210914001', params)
      http.updateTask(params).then(res => {
        console.log("insert", res)
        this.$parent.findOrderList()
        this.flag = false
      })
    },
    statusConverter(val) {
      for (var i = 0; i < this.options.length; i++) {
        if (val.sstatus === this.options[i].value) {
          return this.options[i].label
        }
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.findOrderNameList()
    },
    handleCurrentChanges(val) {
      this.currentPage = val
      this.findOrderNameList()
    },
    findOrderNameList() {
      let statusIndex = ''
      if (this.orderStatusIndex === '') {
        statusIndex = this.orderStatusGly
      } else {
        statusIndex = this.orderStatusIndex
      }
      http.getassociatedOrder({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        data: {
          ordername: this.formInline.ordername,
          dataSum: this.dataSum,
          sstatus: statusIndex
        }
      }).then(res => {
        res.data.list.forEach(item => {
          if (item.sstatus === -1) {
          item.sstatus = -1
          item.statusLabel = '待提交'
        } else {
          item.statusLabel = this.orderstatusLabel[item.sstatus]
        }
        })
        console.log("123ssssss", res)
        this.tableData = res.data.list
        this.total = res.data.total
      }, (resq) => {
        this.tableData = []
        this.total = 0
      })

    }
  },
  watch: {
    flagdata: {
      handler(val) {
        this.flag = val[0]
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    // this.pageSize = this.changeFixedPageSizeZ(document.documentElement.clientHeight - 380, 49)
    this.findOrderNameList()
    this.flag = this.orderTaskFlag;
  },
  computed: {
    ...mapActions('searchStore', {
      orderTaskId(state) {
        return state.orderTaskId
      },
      orderTaskFlag(state) {
        return state.orderTaskFlag
      }
    })
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
.colorindexTh{
  color: #3C6EF0;
}
.colorindexO{
  color: #FF504F;
}
.colorindexT{
  color: #1BBA70;
}
.surebutton {
  position: absolute;
  right: 5px;
  bottom: 5px;
}

.paginationAnddeleteButton {
  margin-top: 0.2rem;
  height: 30px;
}

.pagination {
  text-align: right;
  width: 59%;
  float: right;
}
</style>
