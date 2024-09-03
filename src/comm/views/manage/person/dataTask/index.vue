<template>
  <div ref="orderContent" class="orderContent" style="">
    <div class="fromZ">
      <el-form :inline="true"
               class="demo-form-inline"
               style="    width: 86%; display: inline-block;">


        <el-form-item class="time_form" label="任务编号">
          <el-autocomplete
            class="inline-input"
            v-model="taskid"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入编号"
            :trigger-on-focus="false"
            @focus="handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item class="time_form" label="订单编号">
          <el-autocomplete
            class="inline-input"
            v-model="ordername"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入订购帐号"
            :trigger-on-focus="false"
            @focus="handleSlideInCom(1)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>


      </el-form>
      <div style="display: inline-block; margin-top: 15px;">
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="findOrderList">查询
        </el-button>
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="emptyData">重置
        </el-button>
      </div>
    </div>
    <div class="tableDZ">
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
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
        <el-table-column label="操作" align="center" width="350">
          <template slot-scope="scope">
            <el-button type="view" size="mini" @click="startSearch(scope.row)">开始查询</el-button>
            <el-dialog
              title="提示"
              :visible.sync="dialogVisible"
              width="30%">
              <span>使用这个空间范围上传shp查询,并填写其他条件查询下单，即可</span>
              <span>{{ shape }}</span>
              <!--              <a href="captchaImg"/>-->
              <el-button type="view" size="mini" @click="downloadshape()">下载</el-button>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <el-button type="view" size="mini" @click="relateOrder(scope.row)">关联订单
            </el-button>
            <el-button type="view" size="mini" @click="orderDataID(scope.row)"
                       v-if="(scope.row.ordername !== undefined)">查看订单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationAnddeleteButton">
        <div class="deleteButton">
          <el-button style="margin-left: .1rem;"
                     size="mini"
                     @click="deleteAllData"
                     type="primary"><i style="margin-right: 8px;" class="el-icon-delete"></i>取消关联
          </el-button>
        </div>
        <el-pagination class="pagination"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       background
                       layout="total, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog class="elDialog_Aduti" :title="title" :visible.sync="dialogVisible" width="7rem">
      <span>
        <div>
              <el-input :rows="4"
                        :disabled="true"
                        type="textarea"
                        v-model="inputFeekBack"></el-input>
        </div>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <associatedOrder :flagdata="flag"></associatedOrder><!--:findid="taskid"-->
    <associatedOrder :is="flag"></associatedOrder><!--:findid="taskid"-->
    <shopCarDirectAcquisition :findid="taskid"></shopCarDirectAcquisition>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import http from '@comm/service/interface.js'
import associatedOrder from '@comm/views/manage/person/dataTask/associatedOrder'
import axios from 'axios'

axios.defaults.timeout = 60000
export default {
  components: {
    associatedOrder
  },
  data() {
    return {
      shape: '',
      list: '',
      flag: [],
      visibleLine: '',
      GroupNameList: [],
      OrderNameList: [],
      OrderStartTime: [],
      OrderEndTime: [],
      queryOrderType: '',
      // 普通用户的权限
      userRight: '',
      orderStatusIndex: 1,
      orderStatusGly: '',
      options: [
        {
          value: '-1',
          label: '待提交'
        },
        {
          value: '0',
          label: '待审核'
        },
        {
          value: '1',
          label: '审核通过'
        },
        {
          value: '2',
          label: '审核未通过'
        },
        {
          value: '6',
          label: '数据准备完成'
        },
        {
          value: '7',
          label: '已完成'
        },
        {
          value: '5',
          label: '逾期'
        },
        {
          value: '',
          label: '所有状态'
        }
      ],
      orderstatusLabel: ['待审核', '审核通过', '审核未通过', '审核通过-待打包', '审核通过', '逾期', '数据准备完成', '已完成', '已反馈'],
      // 导入的信息
      msgInput: '',
      dataStatusIndex: '',
      SlideIn: '',
      tableData3: [],
      multipleSelection: [],
      // 控制弹框显示隐藏
      dialogVisible: false,
      orderNameData: [],
      applicant: '',
      orderNumber: '',
      taskid: '',
      value: '',
      thishtml: null,
      inputFeekBack: '',
      orderId: '',
      ordername: '',
      orderName: '',
      shapepath: '',
      orderStatus: '',
      orderStatusInfo: '',
      total: null,
      currentPage: 1,
      pageSize: 10,
      show: true,
      title: '',
      usernamevalue: '',
      optionUserName: [],
      orderDate_1: null,
      orderDate_0: null,
      queryOrderStatus: '所有状态',
      queryOrderUser: '',
      date1: '',
      aHref: '',
      spanLabelZ: '',
      OrderStatusInput: [],
      userProName: '',
      userName: '',
      restaurants: [],
      jobname: '',
      taskdate: '',
      taskrequire: '',
      associateorder: '',
      orderstatus: '',
      sstatus: '',
      associatedOrderVisible: false,
      passReset: false,
      passWordApproveFlag: false,
      colorsZ: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    }
  },

  methods: {
    startSearch(row) {
      this.shape = row.shapepath
      this.$router.push({name: 'search',params: { shapepath: row.shapepath }})
      //this.dialogVisible = true
    },
    downloadshape() {
      let _this = this
      let objList = []
      _this.tableData3.forEach(item => {
        if (item.isSelect) {
          objList.push(item)
        }
      })
      if (objList.length === 0) {
        http.getUploadFileZip({
          data: {
            list: objList,
            taskid: _this.taskid
          }
        }).then(res => {
          let content = res
          // 组装a标签
          let elink = document.createElement('a')
          //  获取时间戳
          let timestamp = new Date().getTime()
          // 设置下载文件名
          elink.download = timestamp + '.zip'
          elink.style.display = 'none'
          let blob = new Blob([content], {
            type: 'application/x-download'
          })
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          document.body.removeChild(elink)
        })
      }
    },
    relateOrder(row) {
      console.log("mj20210914", row)
      this.flag = [true, row.taskid]
    },
    showShapePath() {
      //let res= await
      http.uploadFile.get('url', {
        responseType: 'blob'
      })
      this.captchaImg = window.URL.createObjectURL(res.data)
    },
    orderDataID(row) {
      http.getManOrderListForPage({
        currentPage: 1,
        pageSize: this.pageSize,
        data: {
          ordercode: row.ordername
        }
      }).then(res => {
        console.log(res)
        let row = res.data.list[0]
        this.setOrderDetailId(row.id)
        let objStr = JSON.stringify(row)
        sessionStorage.setItem('orderDataID', [objStr])
        if (this.token !== undefined && this.token !== 'undefined' && this.token !== '') {
          this.$router.push({
            name: 'orderManage_details'
          })
        } else if (this.userRight === 'false') {
          this.$router.push({
            name: 'orderManage_details'
          })
        }
      })
    },
    handleSelectStatu(val) {
      this.orderStatusGly = val
    },
    querySearch(queryString, cb) {
      var restaurants = []
      if (this.SlideIn === 0) {
        restaurants = this.OrderNameList
      } else {
        restaurants = this.GroupNameList
      }
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect(item) {
    },
    handleSlideInNub(val) {
      this.SlideIn = val
    },
    handleSlideInCom(val) {
      this.SlideIn = val
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.sels = val
      this.orderNameData = []
      for (let i = 0; i < val.length; i++) {
        this.orderNameData.push(val[i].ordername)
      }
    },
    deleteAllData() {
      const val = this.sels
      if (val) {
        val.forEach((va, index) => {
          let taskId = val[index].taskid
          let ordername = ''
          let orderStatus = ''
          let params = {
            data: {
              taskid: taskId,
              ordername: ordername,
              orderstatus: orderStatus
            }
          }
          console.log('mj20210914001', params)
          http.updateTask(params).then(res => {
            console.log("insert", res)
            this.findOrderList()
          })
        })
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    findOrderList() {
      let params = {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        data: {
          taskid: this.taskid,
          ordername: this.ordername,
        }
      }
      http.getOrderTask(params).then((res) => {
        console.log("1212ssssss", res)
        this.tableData3 = res.data.list
        this.total = res.data.total
        console.log("1212", this.tableData3)
      });
    },
    orderNodeData(index, row) {
      this.show = false
      this.title = '订单流程信息'
      this.dialogVisible = true
      this.orderName = row.orderName
      this.inputFeekBack = row.forderlog
    },

    editDialogVisible() {
      this.dialogVisible = false
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.findOrderList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.findOrderList()
    },
    statusConverter(val) {
      for (var i = 0; i < this.options.length; i++) {
        if (val === this.options[i].value) {
          return this.options[i].label
        }
      }
    },
    emptyData() {
      this.ordername = ''
      this.taskid = ''
      this.findOrderList()
    },
    findOrderListByUser() {
      this.findOrderList()
    },
    ...mapActions('searchStore', {
      setOrderDetailId: 'setOrderDetailId',
      setOrderTaskId: 'setOrderTaskId',
      //setOrderNameDetail: 'setOrderNameDetail',
      setOrderName: 'setOrderName'
    })
  },

  mounted() {
    this.findOrderList()
    var that = this
    window['findOrderList'] =(event,name) => {
      that.findOrderList(event,name)
    }
    this.pageSize = this.changeFixedPageSizeZ(document.documentElement.clientHeight - 380, 49)
    this.$refs.orderContent.style.height = 'calc(100% - 46px)'
    this.userRight = sessionStorage.getItem('userRight')
  },
  computed: {
    ...mapState({
      token: function (state) {
        return state.user.token
      }
    }),
    ...mapState('searchStore', {
      spanLabel: function (state) {
        return state.spanLabel
      }
    })
  },
  watch: {
    // $route: {
    //   handler (newval, oldval) {
    //     this.initTable()
    //   },
    //   deep: true
    // }
    // spanLabel: {
    // handler (newval, oldval) {
    //   this.spanLabelData = newval
    //   if (newval === '待提交订单') {
    //     this.orderStatusIndex = -1
    //   } else if (newval === '待审核订单') {
    //     this.orderStatusIndex = 0
    //   }
    //   // if (newval !== '') {
    //   this.findOrderList()
    //   // }
    // },
    // deep: true
    // }
  }
}
</script>

<style scoped>
.fromZ {
  background: #fff;
  padding-left: 10px;
  margin-bottom: 10px;
  padding-top: 17px;
  border: 1px solid #edeff1;
  /*height: 110px;*/
}

.tableDZ {
  padding: 10px;
  background: #fff;
  border: 1px solid #edeff1;
  margin-bottom: 20px;
}

.paginationAnddeleteButton {
  margin-top: 0.2rem;
  height: 30px;
}

.deleteButton {
  text-align: left;
  margin-bottom: 0.2rem;
  float: left;
  width: 35%;
}

.pagination {
  text-align: right;
  width: 59%;
  float: right;
}

.el-input--small .el-input__inner {
  height: 20px;
  line-height: 20px;
}

.tableDZ >>> .el-table th {
  /*padding: 0!important;*/
  color: #353535 !important;
  background-color: #EBF0FA !important;
}

.tableDZ >>> .el-table th {
  text-align: center !important;
}

.tableDZ >>> .el-table td {
  text-align: center !important;
}

.personCenter_right_t img {
  height: 48%;
  width: 5px;
  margin-right: 7px;
  position: relative;
  top: -1px;
}

.personCenter_right_t span {
  display: inline-block;
  font-weight: bold;
}

.time_picke >>> .el-range-editor--small {
  width: 26vw;
}

.time_form {
  /*width: 26%;*/
}

.time_form >>> .el-input--small {
  width: 12vw;
}

.time_picke >>> .el-form-item__content {
  /*width: 81%;*/
}

.colorindexTh {
  color: #3C6EF0;
}

.colorindexO {
  color: #FF504F;
}

.colorindexT {
  color: #1BBA70;
}

.elDialog_Aduti >>> .el-dialog__body {
  padding: 10px !important;
}

.elDialog_Aduti >>> .el-dialog__header {
  padding: 10px !important;
}

.elDialog_Aduti >>> .el-dialog__headerbtn {
  top: 10px !important;
}

.elDialog_Aduti >>> .el-dialog__title {
  font-size: 15px !important;
  font-weight: bold !important;
}

.elDialog_Aduti >>> .el-dialog__footer {
  padding: 10px !important;
  text-align: center !important;
}
</style>
