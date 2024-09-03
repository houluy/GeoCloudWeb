<template>
  <div ref="orderContent" class="orderContent" style="">
    <div class="fromZ">
      <el-form :inline="true"
               class="demo-form-inline"
               style="    width: 86%; display: inline-block;">
        <el-form-item  class="time_form" label="订单编号">
          <el-autocomplete
            class="inline-input"
            v-model="orderNumber"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入编号"
            :trigger-on-focus="false"
            @focus = "handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item class="time_form" label="申请单位">
          <el-autocomplete
            class="inline-input"
            v-model="applicant"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入单位"
            :trigger-on-focus="false"
            @focus = "handleSlideInCom(1)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <!--<el-form-item  class="time_form" label="申请人">-->
          <!--<el-select v-model="queryOrderUser"-->
                     <!--clearable-->
                     <!--@change = "handleSelectStatu"-->
                     <!--placeholder="请选择">-->
            <!--<el-option v-for="item in optionsUser"-->
                       <!--:key="item.value"-->
                       <!--:label="item.label"-->
                       <!--:value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item class="time_form" label="订单类型">
        <el-select v-model="queryOrderType"
        clearable
        placeholder="请选择">
        <el-option v-for="item in optionsType"
        :key="item.value"
        :label="item.label"
        :value="item.value"></el-option>
        </el-select>
        </el-form-item>
        <!--<el-form-item  class="time_form" label="订单状态">-->
          <!--<el-select v-model="queryOrderStatus"-->
                     <!--clearable-->
                     <!--@change = "handleSelectStatu"-->
                     <!--placeholder="请选择">-->
            <!--<el-option v-for="item in options"-->
                       <!--:key="item.value"-->
                       <!--:label="item.label"-->
                       <!--:value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="订购时间" class="time_picke">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="OrderEndTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div style="display: inline-block; margin-top: 15px;">
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="findOrderListByUser">查询</el-button>
        <el-button style="margin: 0 0 0 .2rem; background-color: #ffffff; color:#3C6EF0;"
                   type="primary"
                   @click="emptyData">重 置</el-button>
      </div>
    </div>
    <div class="tableDZ">
      <!--<div class="orderButton">-->
      <!--<el-button style="margin-left: .1rem;"-->
      <!--size="mini"-->
      <!--@click="conventionOrder('ordinary')"-->
      <!--type="primary">常规需求订单创建</el-button>-->
      <!--&lt;!&ndash;<el-button size="mini"&ndash;&gt;-->
      <!--&lt;!&ndash;@click="conventionOrder('emergy')"&ndash;&gt;-->
      <!--&lt;!&ndash;type="primary"&ndash;&gt;-->
      <!--&lt;!&ndash;style="margin-left: .2rem;">应急订单创建</el-button>&ndash;&gt;-->
      <!--</div>-->
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="订单编号"
          align="center"
          width="140"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#3C6EF0;">{{scope.row.ordername}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyuser"
          label="申请人"
          show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column
          prop="applyUserUnit"
          label="申请单位"
          show-overflow-tooltip
          align="center"></el-table-column>
        <!--<el-table-column-->
          <!--prop="applyUserPhone"-->
          <!--label="联系方式"-->
          <!--show-overflow-tooltip-->
          <!--align="center"></el-table-column>-->
        <el-table-column
          label="订单类型"
          show-overflow-tooltip
          align="center">
          <template slot-scope="scope">
          <span>{{optionsType[scope.row.type].label}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="getMethod"
          label="获取方式"
          show-overflow-tooltip
          align="center">
          <!--<template slot-scope="scope">-->
          <!--<span>{{optionsType[scope.row.type].label}}</span>-->
          <!--</template>-->
        </el-table-column>
        <el-table-column
          prop="creattime"
          label="订购时间"
          show-overflow-tooltip
          align="center"></el-table-column>
        <!--<el-table-column-->
        <!--prop="creattime"-->
        <!--label="订单完成时间"-->
        <!--show-overflow-tooltip-->
        <!--align="center"></el-table-column>-->
        <el-table-column
          prop="dataSum"
          label="产品数据量"
          show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column
          label="优先级"
          align="center">
          <template slot-scope="scope">
            <el-input-number style="width: 100%;" size="small" v-model="scope.row.sorder" :min="0" :max="10"></el-input-number>
          <!--<span>{{scope.row.sstatus}}</span>-->
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="orderStatus"
          label="数据量"
          align="center"
          :formatter="statusConverter"></el-table-column> -->
        <!--<el-table-column-->
          <!--v-if="this.orderStatusIndex !== -1"-->
          <!--label="订单状态"-->
          <!--align="center"-->
          <!--:formatter="statusConverter">-->
          <!--<template slot-scope="scope">-->
            <!--<span :class="{colorindexO: scope.row.sstatus === 2 || scope.row.sstatus === 5, colorindexT: scope.row.sstatus === 3, colorindexTh: true }">{{scope.row.statusLabel}}</span>-->
          <!--</template>-->
          <!--<span></span>-->
        <!--</el-table-column>-->
        <el-table-column
          label="数据准备进度"
          v-if="this.orderStatusIndex === 1"
          align="center"
          :width="150"
          :formatter="statusConverter">
          <template slot-scope="scope">
            <el-progress v-if="scope.row.sstatus !== 0 && scope.row.sstatus !== 5 && scope.row.sstatus !== -1" :percentage=scope.row.dataPercent.percentStr :color="colorsZ"></el-progress>
            <span v-if="scope.row.sstatus === 0 || scope.row.sstatus === 5 || scope.row.sstatus === -1">-</span>
            <!--<span :class="{colorindexO: scope.row.status === 2 || scope.row.status === 5, colorindexT: scope.row.status === 3, colorindexTh: true }">{{scope.row.statusLabel}}</span>-->
          </template>
          <span></span>
        </el-table-column>
        <!--<el-table-column-->
        <!--v-if="this.orderStatusIndex === '' || this.orderStatusIndex === 3 || this.orderStatusIndex === 6"-->
        <!--label="数据状态"-->
        <!--align="center"-->
        <!--:formatter="statusConverter">-->
        <!--<template slot-scope="scope">-->
        <!--<span :class="{colorindexT: scope.row.status === 3, colorindexTh: true }">{{dataStatus[scope.row.status]}}</span>-->
        <!--<span v-if="scope.row.status === -1">-</span>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
        <!--prop="status"-->
        <!--label="订单状态"-->
        <!--align="center"></el-table-column>-->
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              @click="orderNodeData(scope.$index, scope.row)">流程</el-button> -->
            <img title="详情" style="margin-right: 5px; cursor: pointer;" @click="orderData(scope.row)" width="16px" height="16px" src="@/assets/img/showDetail.png" alt="">
            <img style="margin-right: 5px;cursor: pointer;" title="优先级"  @click="orderDataPrio(scope.row)" width="16px" height="16px" src="@/assets/img/p_order.png" alt="">
            <img title="流程" style="margin-right: 5px; cursor: pointer;" @click="orderNodeData(scope.$index, scope.row)" width="16px" height="16px" src="@/assets/img/dingdangl.png" alt="">
            <!--<img title="下载" style="cursor: pointer;" v-if=" scope.row.sstatus === 6 && scope.row.getMethod === '在线下载'" @click="downData(scope.row)"  width="16px" height="16px" src="@/assets/img/downData.png" alt="">-->
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationAnddeleteButton">
        <div class="deleteButton">
          <el-button style="margin-left: .1rem;"
                     size="mini"
                     @click="deleteAllData"
                     type="primary"><i style="margin-right: 8px;" class="el-icon-delete"></i>批量删除</el-button>
          <!--<el-button size="mini"-->
          <!--@click="meetOrder"-->
          <!--type="primary"-->
          <!--style="margin-left: .2rem;">批量审核</el-button>-->
          <!--<el-button size="mini"-->
          <!--type="primary"-->
          <!--style="margin-left: .2rem;">失败数据重新提取</el-button>-->
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
        <!--<div class="userShow"-->
        <!--v-show="this.userRight ==  'false'">-->
        <!--<el-checkbox></el-checkbox>-->
        <!--<span>已有信息导入:</span>-->
        <!--<el-input style="width:10rem"-->
        <!--v-model="msgInput"> </el-input>-->
        <!--<el-button type="primary"-->
        <!--style="margin-left: .2rem;">添加</el-button>-->
        <!--</div>-->
      </div>
    </div>
    <el-dialog class="elDialog_Aduti" :title="title" :visible.sync="dialogVisible" width="7rem">
      <span>
        <div>
          <!--<el-form ref="form" label-width="2rem" style="text-align: left">-->
          <!--<el-form-item>-->
              <el-input :rows="4"
                        :disabled="true"
                        type="textarea"
                        v-model="inputFeekBack"></el-input>
          <!--</el-form-item>-->
          <!--</el-form>-->
        </div>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   type="primary"
                   @click="dialogVisible = false">确 定</el-button>
        <!--<el-button size="small"-->
        <!--type="primary"-->
        <!--@click="editDialogVisible"-->
        <!--v-if="show === false">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'
import { mapActions, mapState } from 'vuex'
// import { getOrderListForPage, deleteOrderById, getOrderUser, getShopCountByUser,updateOrderStatusById } from '@/api/oderAndShop'
import http from '@comm/service/interface.js'
export default {
  data () {
    return {
      GroupNameList: [],
      OrderNameList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      OrderStartTime: [],
      OrderEndTime: [],
      queryOrderType: '',
      // 普通用户的权限
      userRight: '',
      orderStatusIndex: 1,
      orderStatusGly: '',
      // 导入的信息
      msgInput: '',
      SlideIn: '',
      tableData3: [],
      multipleSelection: [],
      // 控制弹框显示隐藏
      dialogVisible: false,
      orderNameData: [],
      examineValue: [
        {
          value: 1,
          label: '审核通过'
        },
        {
          value: 2,
          label: '审核未通过'
        }
      ],
      dataStatus: ['-', '-', '-', '待提取', '-', '-', '提取完成'],
      applicant: '',
      orderNumber: '',
      optionsType: [
        {
          value: 0,
          label: '已有产品订单'
        },
        {
          value: 1,
          label: '常规需求订单'
        },
        {
          label: '再加工订单',
          value: 2
        },
        {
          value: '',
          label: '全部类型'
        }
      ],
      optionsUser: [
        {
          value: 0,
          label: '崔艳芳'
        },
        {
          value: 1,
          label: 'zhanbb'
        },
        {
          value: 2,
          label: 'mj'
        }
      ],
      options: [
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
        // {
        //   value: 3,
        //   label: '处理中'
        // },
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
          label: '异常'
        },
        {
          value: '',
          label: '所有状态'
        }
      ],
      value: '',
      thishtml: null,
      inputFeekBack: '',
      orderId: '',
      ordername: '',
      orderName: '',
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
      orderstatusLabel: ['待审核', '审核通过', '审核未通过', '审核通过-待打包', '审核通过', '异常', '数据准备完成', '已完成'],
      OrderStatusInput: [],
      userProName: '',
      userName: '',
      restaurants: [],
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
    getByOrderName () {
      let userID = JSON.parse(localStorage.getItem('principalUserID'))
      let userRote = JSON.parse(userID.principal)
      this.OrderNameList = []
      http.getOrderNameListByOrderName({
        luser: userRote.userId
      }).then(res => {
        if (res.data.records.length > 0) {
          res.data.records.forEach(item => {
            this.OrderNameList.push({
              value: item.F_ORDERNAME
            })
          })
        }
      })
    },
    getComNameList () {
      http.getagrsGroupNameList().then(res => {
        this.GroupNameList = []
        if (res.data.records.length > 0) {
          res.data.records.forEach(item => {
            this.GroupNameList.push({
              value: item.F_NAME
            })
          })
        }
      })
    },
    handleSelectStatu (val) {
      this.orderStatusGly = val
    },
    querySearch (queryString, cb) {
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
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {},
    handleSlideInCom (val) {
      this.SlideIn = val
    },
    handleSlideInNub (val) {
      this.SlideIn = val
    },
    getUserR () {
      let userID = JSON.parse(localStorage.getItem('principalUserID'))
      let userRote = JSON.parse(userID.principal)
      if (userRote.roleIds.length > 0) {
        if (userRote.roleIds[0].indexOf('管理员') > -1) {
          this.userProName = '管理员'
          this.userName = null
        } else {
          this.userProName = ''
          this.userName = userRote.userId
        }
      } else {
        this.userProName = ''
        this.userName = userRote.userId
      }
    },
    getDataIndex (val) {
      this.emptyData() // 清空查询条件
      if (val === '待提交订单' || val === 'orderManage_staySubmit') {
        this.orderStatusIndex = -1
      } else if (val === '待审核订单' || val === 'orderManage_stayAudit') {
        this.orderStatusIndex = 0
      } else if (val === '订单优先级设置' || val === 'orderSetPriority') {
        this.orderStatusIndex = 1
      } else if (val === '审核未通过订单' || val === 'orderManage_onAudit') {
        this.orderStatusIndex = 2
      } else if (val === '已完成订单' || val === 'orderManage_completeAudit') {
        this.orderStatusIndex = 7
      } else if (val === '数据准备完成订单' || val === 'orderManage_dataReadyFinish') {
        this.orderStatusIndex = 6
      } else if (val === '状态异常订单' || val === 'orderManage_unusualAudit') {
        this.orderStatusIndex = 5
      } else if (val === '全部订单' || val === 'orderManage') {
        this.orderStatusIndex = ''
      }
    },
    conventionOrder (data) {
      this.$router.push({
        name: 'conventionOrderCreate',
        params: {
          type: data
        }
      })
    },
    usernameQuerySearch (queryString, cb) {
      var restaurants = this.optionUserName
      var results = queryString ? restaurants.filter((restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.orderNameData = []
      for (let i = 0; i < val.length; i++) {
        this.orderNameData.push(val[i].ordername)
      }
    },
    hasLetter: function (str) {
      for (var i in str) {
        var asc = str.charCodeAt(i)
        if ((asc >= 65 && asc <= 90) || (asc >= 97 && asc <= 122)) {
          return true
        }
      }
      return false
    },
    findOrderList () {
      let statusIndex = ''
      if (this.orderStatusIndex === '') {
        statusIndex = this.orderStatusGly
      } else {
        statusIndex = this.orderStatusIndex
      }
      http.getManOrderListForPage({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        data: {
          type: this.queryOrderType,
          ordercode: this.orderNumber,
          sstatus: statusIndex,
          userName: this.userName,
          groupName: this.applicant,
          // lessOrderStartTime: this.OrderStartTime === null ? null : this.OrderStartTime[0],
          // moreOrderStartTime: this.OrderStartTime === null ? null : this.OrderStartTime[1],
          lessCreattime: this.OrderEndTime === null ? null : this.OrderEndTime[0],
          moreCreattime: this.OrderEndTime === null ? null : this.OrderEndTime[1],
          lessCreattimeStr: this.OrderEndTime === null ? null : this.commonMethod.timestampToTimeD(this.OrderEndTime[0]),
          moreCreattimeStr: this.OrderEndTime === null ? null : this.commonMethod.timestampToTimeD(this.OrderEndTime[1])
        }
      }).then(res => {
        console.log(res, 'resaspcojd')
        res.data.list.forEach(item => {
          item.creattime = this.commonMethod.timestampToTime(item.creattime)
          if (!this.hasLetter(item.dataSum)) {
            item.dataSum = this.commonMethod.dataSizeFormatter(item.dataSum)
          }
          if (item.dataPercent) {
            item.dataPercent = JSON.parse(item.dataPercent)
          }
          if (item.sstatus === -1) {
            item.sstatus = -1
            item.statusLabel = '待提交'
          } else {
            item.statusLabel = this.orderstatusLabel[item.sstatus]
          }
        })
        this.tableData3 = res.data.list
        this.total = res.data.total
      }, (resq) => {
        this.tableData3 = []
        this.total = 0
      })
    },
    goToNextR (val) {
      if (val === 0) {
        this.setSpanLabel('待审核订单')
        this.$router.push({name: 'orderManage_stayAudit'})
      } else if (val === -1) {
        this.setSpanLabel('待提交订单')
        this.$router.push({name: 'orderManage_staySubmit'})
      } else if (val === 1) {
        this.setSpanLabel('审核通过订单')
        // this.$router.push({name: 'orderManage_pastAudit'})
      } else if (val === 2) {
        this.setSpanLabel('审核未通过订单')
        this.$router.push({name: 'orderManage_onAudit'})
      } else if (val === 5) {
        this.setSpanLabel('状态异常订单')
        this.$router.push({name: 'orderManage_unusualAudit'})
      } else if (val === 6) {
        this.setSpanLabel('数据准备完成订单')
        this.$router.push({name: 'orderManage_dataReadyFinish'})
      } else if (val === 7) {
        this.setSpanLabel('已完成订单')
        this.$router.push({name: 'orderManage_completeAudit'})
      }
    },
    orderNodeData (index, row) {
      this.show = false
      this.title = '订单流程信息'
      this.dialogVisible = true
      this.orderName = row.orderName
      this.inputFeekBack = row.forderlog
    },
    downData (val) {
      window.open(val.downlodPathFile, '_blank')
    },
    orderDataPrio (val) {
      this.$confirm('确认将订单优先级设为' + val.sorder + '？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.postAgrsUpdataOrderSOrder({
          data: {
            orderid: val.id,
            sorder: val.sorder
          }
        }).then(res => {
          console.log('postAgrsUpdataOrderSOrder', res)
          if (res.data === 'true') {
            this.findOrderList()
            this.$message({
              type: 'success',
              message: '优先级设置成功！'
            })
          } else {
            this.$message({
              type: 'waning',
              message: '优先级设置失败！'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消优先级设置'
        })
      })
    },
    orderData (row) {
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
    },
    handleEditTg (index, row) {
      this.$confirm('审核通过后，订单将进入数据准备状态，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.inputFeekBack = ''
        this.orderStatus = row.orderStatus
        this.orderId = row.id
        this.ordername = row.ordername
        this.audit(index)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    },
    handleEditBtg (index, row) {
      this.title = '请填写审批未通过原因：'
      this.inputFeekBack = ''
      this.orderStatus = row.orderStatus
      this.orderId = row.id
      this.ordername = row.ordername
      this.dialogVisible = true
    },
    deleteAllData () {
      if (this.orderNameData.length > 0) {
        this.handleDelete(2, this.orderNameData)
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.getUpdateOrderStatus({data: { orderNames: row, sstatus: -2 }}).then(res => {
          if (res.data) {
            this.$notify({
              message: '删除成功！',
              position: 'bottom-right',
              duration: 1500,
              type: 'success'
            })
            this.findOrderList()
          } else {
            this.$notify.error({
              message: '删除失败！',
              position: 'bottom-right',
              duration: 0
            })
          }
        })
      }).catch(() => {
        this.$notify.info({
          message: '已取消删除',
          position: 'bottom-right',
          duration: 1500
        })
      })
    },
    audit (val) {
      let loginName = localStorage.getItem('userId')
      http.auditOrder({
        data: {
          'cause': this.inputFeekBack,
          'orderid': this.orderId,
          'orderName': this.ordername,
          'status': val,
          'auditor': loginName
        }
      }).then(res => {
        if (res.data) {
          this.$notify({
            message: '审核成功！',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          this.findOrderList()
        } else {
          this.$notify.error({
            message: '审核失败！',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
      this.dialogVisible = false
    },
    editDialogVisible () {
      this.dialogVisible = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.findOrderList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.findOrderList()
    },
    statusConverter (val) {
      for (var i = 0; i < this.options.length; i++) {
        if (val.orderStatus === this.options[i].value) {
          return this.options[i].label
        }
      }
    },
    emptyData () {
      // this.queryOrderType = ''
      this.orderNumber = ''
      this.OrderEndTime = null
      this.OrderStartTime = null
      this.applicant = ''
    },
    findOrderListByUser () {
      this.findOrderList()
    },
    ...mapActions('searchStore', {
      setOrderDetailId: 'setOrderDetailId',
      setSpanLabel: 'setSpanLabel'
    })
  },
  mounted () {
    this.pageSize = this.changeFixedPageSizeZ(document.documentElement.clientHeight - 380, 49)
    this.$refs.orderContent.style.height = 'calc(100% - 46px)'
    this.userRight = sessionStorage.getItem('userRight')
    let pathArr = this.$route.path.split('/')
    this.getUserR()
    let pathIndex = pathArr[pathArr.length - 1]
    this.getDataIndex(pathIndex)
    if (this.$route.path.indexOf('orderSetPriority') > -1) {
      this.findOrderList()
      this.getByOrderName()
      this.getComNameList()
  }
  },
  computed: {
    ...mapState({
      token: function (state) {
        return state.user.token
      }
    }),
    ...mapState('searchStore', {
      spanLabel: function (state) {
        // this.getDataIndex(state.spanLabel)
        // this.findOrderList()
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
  .fromZ{
    background: #fff;
    padding-left: 10px;
    margin-bottom: 10px;
    padding-top: 17px;
    border: 1px solid #edeff1;
    /*height: 110px;*/
  }
  .active_form{
    padding-top: 16px;
  }
  .tableDZ{
    padding: 10px;
    background: #fff;
    border: 1px solid #edeff1;
    margin-bottom: 20px;
  }
  .oderContent {
    height: 100%;
  }
  .orderButton {
    text-align: left;
    width: 100%;
    margin-bottom: 0.2rem;
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
  .userShow {
    position: absolute;
    left: 1rem;
    /* width:30%; */
    margin-top: 0.2rem;
    top: 9.6rem;
  }
  .el-checkbox {
    margin-right: 10px;
  }
  .el-input--small .el-input__inner {
    height: 20px;
    line-height: 20px;
  }
  .tableDZ>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
  }
  .tableDZ>>>.el-table th{
    text-align: center !important;
  }
  .tableDZ>>>.el-table td{
    text-align: center !important;
  }
  .personCenter_right_t{
    height: 4vh;
    line-height: 2vh;
  }
  .personCenter_right_t img{
    height: 48%;
    width: 5px;
    margin-right: 7px;
    position: relative;
    top: -1px;
  }
  .personCenter_right_t span{
    display: inline-block;
    font-weight: bold;
  }
  .time_picke{
    /*width: 47%;*/
  }
  .time_picke>>>.el-range-editor--small{
    width: 26vw;
  }
  .time_form{
    /*width: 26%;*/
  }
  .time_form>>>.el-input--small{
    width: 12vw;
  }
  .time_picke>>>.el-form-item__content{
    /*width: 81%;*/
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
  .elDialog_Aduti>>>.el-dialog__body{
    padding: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__header{
    padding: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__headerbtn{
    top: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__title {
    font-size: 15px !important;
    font-weight: bold !important;
  }
  .elDialog_Aduti>>>.el-dialog__footer {
    padding: 10px !important;
    text-align: center !important;
  }
</style>
