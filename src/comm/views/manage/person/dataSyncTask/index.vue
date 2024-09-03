<template>
  <div ref="orderContent" class="orderContent" style="">
    <div class="fromZ">

      <el-form :inline="true"
               class="demo-form-inline"
               style="width: 86%; display: inline-block;">
        <el-form-item  class="time_form" label="待同步数据类型">
          <el-autocomplete
            class="inline-input"
            v-model="form.tableNameAlias"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入同步数据类型"
            :trigger-on-focus="false"
            @focus = "handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item  class="time_form" label="数据库IP">
          <el-autocomplete
            class="inline-input"
            v-model="form.ip"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入数据库IP"
            :trigger-on-focus="false"
            @focus = "handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item  class="time_form" label="源表名">
          <el-autocomplete
            class="inline-input"
            v-model="form.sourceTableName"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入源表名"
            :trigger-on-focus="false"
            @focus = "handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item  class="time_form" label="目标表名">
          <el-autocomplete
            class="inline-input"
            v-model="form.targetTableName"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入目标表名"
            :trigger-on-focus="false"
            @focus = "handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>

      </el-form>
      <div style="display: inline-block; margin-top: 15px;">
        <el-button style="margin: 16px 0 0 .2rem;" type="primary" @click="search">查询</el-button>
        <el-button style="margin: 16px 0 0 .2rem;" type="primary" @click="addSyncTask">新增同步任务</el-button>
      </div>

    </div>
    <div class="tableDZ">
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          prop="dbId"
          label="数据库id"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="syncId"
          label="同步任务id"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="tableNameAlias"
          label="数据别名"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="数据源库"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="sourceTableName"
          label="数据源表"
          align="center"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="targetDb"
          label="目标库"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="targetTableName"
          label="目标表"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="pageSizee"
          label="每批条数"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="importDate"
          label="同步时间"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="isSyncText"
          label="状态"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" align="center" width="350" >
          <template slot-scope="scope" >
            <!--<img class="img" src="./img/暂停.png"  @click="startSearch(scope.row)" height="28" width="28"/>-->
            <img class="img" src="./img/编辑.png" @click="editorSyncTask(scope.row)" height="28" width="28"/>
            <el-popconfirm
              cancel-button-text='取消'
              confirm-button-text='确认'
              @confirm="deleteSyncTask(scope.row)"
              icon="el-icon-circle-close"
              icon-color="red"
              title="确认要删除这条数据吗？"
            >
              <img class="img" src="./img/删除.png" slot="reference"  height="28" width="28"/>
              <span>asddssd</span>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>

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

    <el-dialog class="elDialog_Aduti" title="编辑同步任务"  :visible.sync="addSyncTaskVisible">
      <div style="display: inline-block; justify-content: space-around;">
        <div style="display: inline-block;">

          <div class="syncTitle1"><span>请填写数据库IP</span></div>
          <el-select v-model="value" placeholder="请选择" @change="selectChangeD" >
            <el-option
              v-for="item in ipOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="syncTitle1">请填写待同步数据类型</div>
          <el-input style="width: 20%;" v-model="tableNameAlias"></el-input>
          <div class="syncTitle1">数据源表</div>
          <el-input style="width: 20%;" v-model="sourceTableName"></el-input>
          <div class="syncTitle1">目标数据表</div>
          <el-input style="width: 20%;" v-model="targetTableName"></el-input>
          <div class="syncTitle1">同步状态</div>
          <el-select v-model="isSync" placeholder="请选择">
            <el-option
              v-for="item in syncTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <div class="syncTitle1">主键ID</div>
          <el-input style="width: 20%;" v-model="pkColumn"></el-input>
          <div class="syncTitle1">主键起始值</div>
          <el-input style="width: 20%;" v-model="dataId"></el-input>
          <div  class="syncTitle1">每次同步记录数据</div>
          <el-input style="width: 20%;" v-model="pageSizee"></el-input>
          <div  class="syncTitle1">是dataId还是入库时间</div>
          <el-input style="width: 20%;" v-model="dataIdImportDate"></el-input>
          <div  class="syncTitle1">继续入库时间</div>
          <!--<el-input style="width: 20%;" v-model="importDate"></el-input>-->
          <el-date-picker
            v-model="importDate"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd hh:mm:ss"
          >
          </el-date-picker>
          <div  class="syncTitle1">所有列</div>
          <el-input type="textarea"  v-model="allColumn" style="width: 98vh;height: 30px" size="30"></el-input>
        </div>

      </div>
      <span slot="footer">
          <el-button type="primary" @click="saveConfig">保 存</el-button>
          <el-button @click="addSyncTaskVisible = false">取 消</el-button>
      </span>
    </el-dialog>


  </div>



</template>

<script>
import {mapActions, mapState} from 'vuex'
import http from '@comm/service/interface.js'
import axios from 'axios'

axios.defaults.timeout = 60000
export default {
  components: {
    // popups
  },
  data() {
    return {
      //查询条件
      form:{
        tableNameAlias:"",
        ip:"",
        sourceTableName: "",
        targetTableName: ""
      },

      //查询结果列

      allColumn: "",
      dataId: "",
      dataIdImportDate: "",
      importDate: "",
      ip: "",
      isSync: "",
      pageSizee: "",
      pkColumn: "",
      sourceTableName: "",
      targetDb: "",
      targetTableName: "",
      tableNameAlias:"",
      syncId:"",
      dbId:"",
      editIp:"",
      ipOptions:[],
      // 控制弹框显示隐藏
      addDataVisible: false,
      innerVisible: false,
      addSyncTaskVisible: false,
      editorSyncTaskVisible: false,

      labelPosition: 'top',

      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      syncTypeOptions: [{
        value: '0',
        label: '未开启',
      },{
        value: '1',
        label: '只同步内网',
      },{
        value: '2',
        label: '内外网都同步',
      }],
      pkId: [{
        value: 'F_DID',
        label: 'F_DID',
      },{
        value: 'F_DATAID',
        label: 'F_DATAID',
      },{
        value: 'OBJECTID',
        label: 'OBJECTID',
      }],
      // form: {
      //   name: '',
      //   region: '',
      //   date1: '',
      //   date2: '',
      //   delivery: false,
      //   type: [],
      //   resource: '',
      //   desc: ''
      // },
      formLabelWidth: '120px',

      shape: '',
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
      // 导入的信息
      msgInput: '',
      dataStatusIndex: '',
      SlideIn: '',
      tableData3: [],
      multipleSelection: [],

      orderNameData: [],
      applicant: '',
      orderNumber: '',
      value: '',
      inputFeekBack: '',
      orderId: '',
      orderName: '',
      orderStatus: '',
      orderStatusInfo: '',
      total: null,
      currentPage: 1,
      pageSize: 13,
      show: true,
      title: '',
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
      popupsVisible: false,
      passReset: false,
      passWordApproveFlag: false,
      colorsZ: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ],
      sourceIP:[],
      sourceTableNameOptions:[],
      targetTableNameOptions:[]
    }
  },

  methods: {
    // 删除同步任务
    deleteSyncTask(row){
      let delId = {
        data:{
          syncId: row.syncId
        }
      }
      http.delSyncTask(delId).then((res) => {
        if(res.data === 1) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          })
          this.addSyncTaskVisible = false
          this.findOrderList()
        } else if(res.data === 0){
          this.$message.error('删除失败！');
          this.addSyncTaskVisible = false
          this.findOrderList()
        }
      })
    },
    selectChangeD(row){
      let r = row.split("|")
      this.editIp = r[0]
      this.editDbId = r[1]
    },
    tableRowClassName({row, rowIndex}) {
      if (row.isSync === '0') {
        return '';
      } else if (row.isSync === '1') {
        return 'warning-row';
      }else if (row.isSync === '2') {
        return 'success-row';
      }
      return '';
    },
    search(){
      this.findOrderList()
    },
    startSearch(row) {
      this.shape = row.shapepath
      this.dialogVisible = true
    },
    relateOrder(row) {
      // this.flag = [true, row.taskid]
    },
    showShapePath() {
      //let res= await
      http.uploadFile.get('url', {
        responseType: 'blob'
      })
      this.captchaImg = window.URL.createObjectURL(res.data)
    },
    selectSourceIP(){
      http.selectSourceIP({}).then(res =>{
        this.sourceIP = res.data
      })
    },
    selectSourceTableNameOptions(){
      http.selectsSourceTableNameOptions({}).then(res =>{
        this.sourceTableNameOptions = res.data
      })
    },
    selectTargetTableNameOptions(){
      http.selectTargetTableNameOptions({}).then(res =>{
        this.targetTableNameOptions = res.data
      })
    },
    orderDataID(row) {
      http.getManOrderListForPage({
        currentPage: 1,
        pageSize: this.pageSize,
        data: {
          ordercode: row.ip
        }
      }).then(res => {
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
          // let taskId = val[dataSync].taskid
          let ordername = ''
          let orderStatus = ''
          let params = {
            data: {
              // taskid: taskId,
              ordername: ordername,
              orderstatus: orderStatus
            }
          }
          http.updateTask(params).then(res => {
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
          // taskid: this.taskid,
          tableNameAlias: this.form.tableNameAlias,
          ip: this.form.ip,
          sourceTableName: this.form.sourceTableName,
          targetTableName: this.form.targetTableName,
        }
      }
      http.getSyncList(params).then((res) => {
        res.data.list.forEach(item => {
          if(item.isSync === '0'){
            item.isSyncText = "未开启"
          }else if(item.isSync === '1'){
            item.isSyncText = "只同步内网"
          }else if(item.isSync === '2'){
            item.isSyncText = "内外网都同步"
          }
          item.targetDb = '10.0.110.5'
        })
        this.tableData3 = res.data.list
        console.log("this.tableData3", this.tableData3)
        this.total = res.data.total

      });
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
    addSyncTask() {
      this.syncId = ""
      this.ip=""
      this.sourceTableName = ""
      this.targetTableName = ""
      this.allColumn = ""
      this.dataId=""
      this.dataIdImportDate=""
      this.importDate=""
      this.isSync=""
      this.pageSizee=""
      this.pkColumn=""
      this.targetDb=""
      this.tableNameAlias=""
      this.dbId =""
      this.getIpOptions()
      this.addSyncTaskVisible = true
    },
    editorSyncTask(row) {
      this.syncId = row.syncId
      this.ip=row.ip
      if(row.ip===undefined){
        this.getIpOptions()
      }
      this.sourceTableName = row.sourceTableName
      this.targetTableName = row.targetTableName
      this.allColumn = row.allColumn
      this.dataId=row.dataId
      this.dataIdImportDate=row.dataIdImportDate
      this.importDate=row.importDate
      this.isSync=row.isSync
      this.pageSizee=row.pageSizee
      this.pkColumn=row.pkColumn
      this.targetDb=row.targetDb
      this.tableNameAlias=row.tableNameAlias
      this.dbId = row.dbId
      this.addSyncTaskVisible = true
    },

    getIpOptions(){
      let that = this
      let params = {
        currentPage: 1,
        pageSize: 100,
        data: {
          taskid: "",
          ordername: "",
        }
      }
      http.getSyncDataList(params).then((res) => {
        res.data.list.forEach(item => {
          let o ={
            value: item.ip+"|"+item.syncDbId
          }
          that.ipOptions.push(o)
        })
      });
    },
    saveConfig(){
      let params = {
        data: {
          tableNameAlias: this.tableNameAlias,
          ip: this.editIp,
          sourceTableName: this.sourceTableName,
          targetTableName: this.targetTableName,
          importDate: this.importDate,
          isSync: this.isSync,
          pageSizee: this.pageSizee,
          pkColumn: this.pkColumn,
          allColumn: this.allColumn,
          dataId: this.dataId,
          dataIdImportDate: this.dataIdImportDate,
          syncId:this.syncId,
          dbId: this.editDbId
        }
      }
      console.log(params,'mj202111231')
      http.updateSyncTask(params).then(res=>{
        if(res.data >0){
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.addSyncTaskVisible = false
          this.findOrderList()
        }
      })
    },
    findOrderListByUser() {
      this.findOrderList()
    },
    ...mapActions('searchStore', {
      setOrderDetailId: 'setOrderDetailId',
      setOrderName: 'setOrderName'
    })
  },

  mounted() {
    this.findOrderList()
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

  }
}
</script>

<style scoped>
  .el-table >>> .warning-row {
    background: oldlace;
  }

  .el-table >>> .success-row {
    background: #f0f9eb;
  }
.img {
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
.fromZ {
  background: #fff;
  padding-left: 12px;
  margin-bottom: 10px;
  padding-top: 0px;
  border: 1px solid #edeff1;
  height: 100px;
}
.addDataDiv1 {
  display: flex;
  flex-direction: column-reverse;
  border-top: 1px solid red;
}
.addDataDiv2 {
  width: 50%;
  height: 100%;
}
.addDataDiv3 {

  float: right;
}
.syncTitle {
  position: relative;
  left: 5%;
  padding: 10px;
  font-weight: bold;
}
.syncTitle1 {
  color: #999999;
  font-size: 10px;
  margin: 10px  10px  8px  0px;
}
.select1 {
  width: 120%;
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
  /*padding: 10px !important;*/
}

.elDialog_Aduti >>> .el-dialog__header {
  border-bottom : 1px solid #DCDCDC;
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
  border-top: 1px solid #DCDCDC;
  padding: 10px !important;
}
</style>
