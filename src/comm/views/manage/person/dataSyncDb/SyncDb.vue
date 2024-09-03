<template>
  <div ref="orderContent" class="orderContent" style="">
      <div style="display: inline-block;float: right;margin-bottom: 10px" >
        <el-button style="margin: 16px 0 0 .2rem;"
                   type="primary"
                   @click="addSyncTask()">新增数据源
        </el-button>
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
          prop="syncDbId"
          label="数据源标识"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="connStr"
          label="数据源用途"
          align="center"
          width="150"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="driver"
          label="数据库类型"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="IP地址"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="instance"
          label="数据库名"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="port"
          label="端口"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="userName"
          label="用户名"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="passWord"
          label="密码"
          align="center"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="操作" align="center" width="350">
          <template slot-scope="scope">
            <img class="img" src="./img/编辑.png" @click="editorSyncDb(scope.row)" height="28" width="28"/>
            <el-popconfirm
              cancel-button-text='取消'
              confirm-button-text='确认'
              @confirm="deleteSync(scope.row)"
              @cancel="cancelDelete"
              icon="el-icon-circle-close"
              icon-color="red"
              title="确认要删除这条数据吗？"
            >
              <img class="img" src="./img/删除.png" slot="reference"  height="28" width="28"/>
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
    <el-dialog class="elDialog_Aduti" :title="dialogTitle" style="width: 90%" :visible.sync="addDataVisible">
      <el-form :inline="true" :model="syncDb">
        <el-form-item label="数据源标识" :label-width="formLabelWidth">
          <el-input :disabled="true" placeholder="Id为自增" v-model="syncDb.syncDbId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据源用途" :label-width="formLabelWidth">
          <el-input v-model="syncDb.connStr" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型" :label-width="formLabelWidth">
          <el-input v-model="syncDb.driver" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="IP地址" :label-width="formLabelWidth">
          <el-input v-model="syncDb.ip" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数据库名" :label-width="formLabelWidth">
          <el-input v-model="syncDb.instance" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth">
          <el-input v-model="syncDb.port" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="syncDb.userName" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="syncDb.passWord" placeholder="请输入" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer">
          <el-button type="primary" @click="testConn">测试连接</el-button>
          <el-button type="primary" @click="transition">保 存</el-button>
          <el-button @click="addDataVisible = false">取 消</el-button>
      </span>
      <el-dialog width="30%" height title="" icon="el-icon-error" :visible.sync="connOkVisible" append-to-body>
        <div>
          <div style="text-align: center;">
            <img src="./img/成功.png" height="80" width="80"/>
          </div>
          <div style="text-align: center; margin-top: 20px">
            <span style="font-size: 20px">连接成功</span>
          </div>
          <div style="text-align: center; margin-top: 20px">
            <span>数据源测试连接成功</span>
          </div>
          <div style="text-align: center; margin-top: 20px">
            <el-button @click="connOkVisible=false">确定</el-button>
          </div>
        </div>
      </el-dialog>
      <el-dialog width="30%" height title="" icon="el-icon-error" :visible.sync="connNoVisible" append-to-body>
        <div>
          <div style="text-align: center;">
            <img src="./img/失败.png" height="80" width="80"/>
          </div>
          <div style="text-align: center; margin-top: 20px">
            <span style="font-size: 20px">连接失败</span>
          </div>
          <div style="text-align: center; margin-top: 20px">
            <span>数据源测试连接失败</span>
          </div>
          <div style="text-align: center; margin-top: 20px">
            <el-button @click="connNoVisible=false">确定</el-button>
          </div>
        </div>
      </el-dialog>

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
        dialogTitle: '',
        syncDb: {
          syncDbId: '',
          connStr: '',
          driver: '',
          ip: '',
          instance: '',
          port: '',
          userName: '',
          passWord: '',
        },
        syncDbId: '',
        connStr: '',
        driver: '',
        ip: '',
        instance: '',
        port: '',
        userName: '',
        passWord: '',

        // 控制弹框显示隐藏
        addDataVisible: false,
        connOkVisible: false,
        connNoVisible: false,
        addTaskVisible: false,

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

        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
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
        pageSize: 5,
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
        ]
      }
    },

    methods: {
      startSearch(row) {
        this.shape = row.shapepath
        this.dialogVisible = true
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
        http.getSyncDataList(params).then((res) => {
          // res.data.list.forEach(item => {
          //   item['targetDb'] = '10.0.110.5'
          // })
          this.tableData3 = res.data.list
          this.total = res.data.total
        });
      },

      transition(){
        if(this.dialogTitle === '新增数据源'){
          this.addSyncData()
        }else if(this.dialogTitle === '编辑数据源'){
          this.updateSyncDb()
        }
      },

      // 新增数据源
      addSyncData(){
        let addSyncDb = {
          data: {
            syncDbId: this.syncDb.syncDbId,
            connStr: this.syncDb.connStr,
            driver: this.syncDb.driver,
            ip: this.syncDb.ip,
            instance: this.syncDb.instance,
            port: this.syncDb.port,
            userName: this.syncDb.userName,
            passWord: this.syncDb.passWord,
          }
        }
        http.addSyncDb(addSyncDb).then((res) => {
          if(res.data === 1) {
            this.$message({
              message: '添加数据源成功！',
              type: 'success'
            })
            this.syncDb={};
            this.addDataVisible = false
            this.findOrderList()
          } else{
            this.$message.error('添加失败！');
            this.syncDb={};
            this.addDataVisible = false
            this.findOrderList()
          }
        });
      },
      // 编辑数据源
      updateSyncDb(){
        let updateSyncDb = {
          data: {
            syncDbId: this.syncDb.syncDbId,
            connStr: this.syncDb.connStr,
            driver: this.syncDb.driver,
            ip: this.syncDb.ip,
            instance: this.syncDb.instance,
            port: this.syncDb.port,
            userName: this.syncDb.userName,
            passWord: this.syncDb.passWord,
          }
        }
        http.updateSyncDb(updateSyncDb).then((res) => {
          if(res.data === 1) {
            this.$message({
              message: '修改数据源成功！',
              type: 'success'
            })
            this.addDataVisible = false
            this.findOrderList()
          } else{
            this.$message.error('修改失败！');
            this.addDataVisible = false
            this.findOrderList()
          }
        });
      },
      // 编辑数据源弹窗
      editorSyncDb(val){
        this.syncDb = val
        this.dialogTitle = '编辑数据源'
        this.addDataVisible = true
      },
      // 删除数据源
      deleteSync(row){
        let delId = {
          data:{
            syncDbId: row.syncDbId
          }
        }
        http.delSyncDb(delId).then((res) => {
          if(res.data === 1) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.addDataVisible = false
            this.findOrderList()
          } else if(res.data === 0){
            this.$message.error('删除失败！');
            this.addDataVisible = false
            this.findOrderList()
          }
        })
      },
      // 取消删除
      cancelDelete(){
        this.$message({
          message: '已取消删除！',
          type: 'warning'
        })
      },

      // 测试连接
      testConn(){
        let testConn = {
          data :{
            ip: this.syncDb.ip,
            instance: this.syncDb.instance,
            port: this.syncDb.port,
            userName: this.syncDb.userName,
            passWord: this.syncDb.passWord,
          }
        }
        http.testConn(testConn).then((res) =>{
          console.log(res, '0000')
          if(res.status === 200){
            this.connOkVisible = true
          }else if(res.status === 400){
            this.connNoVisible = true
          }
        })
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
        this.syncDb={};
        this.dialogTitle = '新增数据源'
        this.addDataVisible = true
      },
      editorSyncTask() {
        this.editorSyncTaskVisible = true
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
  .img {
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .fromZ {
    background: #fff;
    padding-left: 10px;
    margin-bottom: 10px;
    padding-top: 17px;
    border: 1px solid #edeff1;
    /*height: 110px;*/
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
