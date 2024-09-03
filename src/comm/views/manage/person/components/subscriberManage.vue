<template>
  <div class="tableDZ">
    <div class="table_button">
      <el-form :inline="true" style="padding: 0 25px;" ref="form" :model="userForm" label-position="left">
        <el-form-item label="登录名">
          <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="small" clearable v-model="userForm.userLogin"></el-input>
        </el-form-item>
        <!-- <el-form-item label="用户单位">
          <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="small" clearable v-model="userForm.userNick"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="userSearch">查询</el-button>
          <el-button @click="newAddPro" type="primary" size="mini"><i class="el-icon-plus"></i>&nbsp;&nbsp;新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        label="登录名"
        prop="loginname"
        align="center"
        show-overflow-tooltip></el-table-column>
      <!-- <el-table-column
        prop="name"
        label="姓名"
        show-overflow-tooltip
        align="center"></el-table-column>
      <el-table-column
        prop="groupname"
        label="单位"
        show-overflow-tooltip
        align="center"></el-table-column> -->
      <el-table-column
        prop="ftpurl"
        label="FTP"
        show-overflow-tooltip
        align="center"></el-table-column>
      <el-table-column
        prop="ftpuser"
        label="FTP用户"
        show-overflow-tooltip
        align="center"></el-table-column>
      <el-table-column
        prop="creatatime"
        label="订购时间"
        show-overflow-tooltip
        align="center"></el-table-column>
      <el-table-column
        label="操作"
        align="center">
        <template slot-scope="scope">
          <img  style="margin-right: 5px; cursor: pointer;" @click="handleEdit(scope.row)" width="16px" height="16px" src="@/assets/img/ApprovedD.png" alt="">
          <img width="16px" height="16px" src="@/assets/img/deleicon.png" alt="" @click="removeData(scope.$index, scope.row)" >
        </template>
      </el-table-column>
    </el-table>
    <div class="paginationAnddeleteButton">
      <el-pagination class="pagination"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="currentPage"
                     :page-size="pageSize"
                     :page-sizes="[10, 20, 30, 40]"
                     background
                     layout="total, prev, pager, next, sizes, jumper"
                     :total="total">
      </el-pagination>
    </div>
    <el-dialog
      class="elDialog_Aduti"
      :title="title"
      :visible.sync="dialogVisible"
      width="10rem">
        <div>
          <el-form :model="formLabelAlign" ref="ruleFormData" label-width="2rem" style="text-align: left" :rules="Rules">
            <el-form-item v-if="!showBJ" label="登录名" prop="PronameData">
              <el-input v-model="formLabelAlign.PronameData"></el-input><img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item v-if="showBJ" label="登录名" prop="PronameData">
              <el-input :disabled="true" v-model="formLabelAlign.PronameData"></el-input><img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item>
              <el-radio-group @change="changeRadioD" v-model="radio" :disabled ="showBJ">
                <el-radio :label=1>FTP</el-radio>
                <el-radio :label=2>内网路径</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="labelD" prop="ftp">
              <el-input v-model="formLabelAlign.ftp"></el-input><img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item label="端口" prop="fFtpport" v-if="indexVal === 1">
              <el-input v-model="formLabelAlign.fFtpport"></el-input><img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item label="用户" prop="ftpPro" v-if="indexVal === 1">
              <el-input v-model="formLabelAlign.ftpPro"></el-input><img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item label="密码" prop="ftpProwss" v-if="indexVal === 1">
              <el-input v-model="formLabelAlign.ftpProwss"></el-input><img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <!-- <el-form-item label="传输路径" prop="fFtpwork" v-if="indexVal === 1">
              <el-input v-model="formLabelAlign.fFtpwork"></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="mini"
                   type="primary"
                   @click="checkFtp()">校 验</el-button>
        <el-button size="mini"
                   type="primary"
                   v-if="!showBJ"
                   @click="addSave('ruleFormData')">确 定</el-button>
        <el-button size="mini"
                   type="primary"
                   v-if="showBJ"
                   @click="addSaveEdit('ruleFormData')">确 定</el-button>
        <el-button size="mini"
                   @click="dialogVisible = false">取 消</el-button>
        <!--<el-button size="small"-->
        <!--type="primary"-->
        <!--@click="editDialogVisible"-->
        <!--v-if="show === false">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
export default {
  name: 'subscriberManage',
  data () {
    var validateChangename = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('登录名不能为空！'))
      } else {
        callback()
      }
    }
    var validateChangftp = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('路径不能为空！'))
      } else {
        callback()
      }
    }
    var validateChangeftpPro = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('ftp用户不能为空！'))
      } else {
        callback()
      }
    }
    var validateChangeftpProwss = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('ftp密码不能为空！'))
      } else {
        callback()
      }
    }
    return {
      userForm: {
        userNick: '',
        userLogin: ''
      },
      tableData: [],
      radio: 1,
      indexVal: 1,
      labelD: 'FTP',
      labelRadio: ['FTP', '内网路径', '网络路径'],
      dialogVisible: false,
      rowData: {},
      showBJ: false,
      currentPage: 1,
      pageSize: 10,
      title: '',
      total: 0,
      proName: [],
      departmentData: [],
      formLabelAlign: {
        PronameData: '',
        ftpProwss: '',
        ftpPro: '',
        ftp: '',
        phonemobile: '',
        groupname: '', // 单位名
        loginname: '',
        fFtpwork: '',
        fFtpport: ''
      },
      Rules: {
        PronameData: [
          { validator: validateChangename, trigger: 'blur' }
        ],
        ftpProwss: [
          { validator: validateChangeftpProwss, trigger: 'blur' }
        ],
        ftpPro: [
          { validator: validateChangeftpPro, trigger: 'blur' }
        ],
        ftp: [
          { validator: validateChangftp, trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // this.initTable()
    this.getOrderList()
  },
  methods: {
    checkFtp () {
      http.checkFtp({data: {
        ftpurl: this.formLabelAlign.ftp,
        ftpuser: this.formLabelAlign.ftpPro,
        ftppassword: this.formLabelAlign.ftpProwss,
        fType: this.indexVal,
        fFtpwork: this.formLabelAlign.fFtpwork,
        fFtpport: this.formLabelAlign.fFtpport
      }}).then(res => {
        if (res.data === 'true') {
          this.$message({
            type: 'success',
            message: '检查成功!'
          })
        } else {
          this.$message({
            type: 'error',
            message: '检查失败!'
          })
        }
      })
    },
    changeRadioD (val) {
      this.indexVal = val
      this.labelD = this.labelRadio[val - 1]
      this.formLabelAlign.ftp = ''
      this.formLabelAlign.ftpPro = ''
      this.formLabelAlign.ftpProwss = ''
      this.formLabelAlign.fFtpwork = ''
      this.formLabelAlign.fFtpport = ''
    },
    // 订购用户数据获取
    getOrderList () {
      http.getagrsList({data: {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        loginname: this.userForm.userLogin,
        groupname: this.userForm.userNick,
        name: this.userForm.userLogin
      }}).then(res => {
        if (res.data && res.data.list.length > 0) {
          console.log(res)
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.tableData = []
          this.total = 0
          this.$message.warning('暂无数据！')
        }
      })
    },
    // 订购用户编辑
    handleEdit (row) {
      console.log(row, 'skefpw')
      this.indexVal = parseInt(row.fType)
      this.radio = parseInt(row.fType)
      this.formLabelAlign.PronameData = row.loginname
      this.formLabelAlign.ftpProwss = row.ftppassword
      this.formLabelAlign.ftpPro = row.ftpuser
      this.formLabelAlign.ftp = row.ftpurl
      this.formLabelAlign.fFtpport = row.fFtpport
      this.formLabelAlign.fFtpwork = row.fFtpwork
      this.dialogVisible = true
      this.title = '订购用户编辑'
      this.showBJ = true
      this.rowData = row
    },
    // 登录名选择
    selectChange (val) {
      if (val) {
        this.proName.forEach(item => {
          if (item.id === val) {
            this.formLabelAlign.loginname = item.loginName
            this.formLabelAlign.name = item.name
          }
        })
        http.userGetById({val}).then(res => {
          if (res.data) {
            console.log(res)
            console.log(this.departmentData)
            this.formLabelAlign.phonemobile = res.data.phoneMobile
            this.departmentData.forEach(item => {
              if (item.id === res.data.groupIds[0]) {
                this.formLabelAlign.groupid = res.data.groupIds[0]
                this.formLabelAlign.groupname = item.name
              }
            })
          }
        })
      }
    },
    // 弹框确认
    addSave (formName) {
      console.log(this.formLabelAlign, 'formLabelAlign')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.formLabelAlign, 'this.formLabelAlign')
          http.saveAgrsFtp({data: {
            userid: this.formLabelAlign.PronameData,
            ftpurl: this.formLabelAlign.ftp,
            ftpuser: this.formLabelAlign.ftpPro,
            // loginname: this.formLabelAlign.loginname,
            // name: this.formLabelAlign.name,
            name: this.formLabelAlign.PronameData,
            loginname: this.formLabelAlign.PronameData,
            // groupname: this.formLabelAlign.groupname,
            phonemobile: this.formLabelAlign.phonemobile,
            ftppassword: this.formLabelAlign.ftpProwss,
            // groupid: this.formLabelAlign.groupid,
            fType: this.indexVal,
            fFtpwork: this.formLabelAlign.fFtpwork,
            fFtpport: this.formLabelAlign.fFtpport
          }}).then(res => {
            console.log(res)
            if (res.data === 'true') {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.getOrderList()
            } else if (res.data === 'false') {
              this.$message({
                type: 'warning',
                message: '添加失败!'
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.data
              })
            }
          })
        } else {
          this.$message.error('必填项错误, 请重新填写!')
          return false
        }
      })
    },
    // 编辑用户
    addSaveEdit (formName) {
      console.log(this.formLabelAlign, 'formLabelAlign')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // creatatime: "2020-07-29T11:28:06.813"
          // groupid: 1107831486174699500
          // groupname: "卫星中心"
          // id: "1288315337317330945"
          // loginname: "hthtadmin"
          // name: "管理员"
          // phonemobile: "15112344321"
          // userid: 1083604745504993400
          http.agrsUpdateSave({data: {
            creatatime: this.rowData.creatatime,
            // groupid: this.rowData.groupid,
            // groupname: this.rowData.groupname,
            // loginname: this.rowData.loginname,
            id: this.rowData.id,
            loginname: this.rowData.loginname,
            // phonemobile: this.rowData.phonemobile,
            userid: this.rowData.userid,
            ftpurl: this.formLabelAlign.ftp,
            ftpuser: this.formLabelAlign.ftpPro,
            ftppassword: this.formLabelAlign.ftpProwss,
            fFtpwork: this.formLabelAlign.fFtpwork,
            fFtpport: this.formLabelAlign.fFtpport
          }}).then(res => {
            console.log(res)
            if (res.data === 'true') {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.getOrderList()
            } else if (res.data === 'false') {
              this.$message({
                type: 'warning',
                message: '修改失败!'
              })
            } else {
              this.$message({
                type: 'warning',
                message: res.data
              })
            }
          })
        } else {
          this.$message.error('必填项错误, 请重新填写!')
          return false
        }
      })
    },
    // 用户查询
    userSearch () {
      this.getOrderList()
    },
    // 初始化用户信息
    initTable () {
      http.departmentTable({currentPage: 1,
        pageSize: 99,
        describe: '',
        groupIds: '',
        name: ''}).then(res => {
        this.departmentData = res.data.list
      })
      let arrName = []
      // this.currentPage = 1
      // {currentPage: this.currentPage, pageSize: this.pageSize, groupIds: this.getNodeTreeID, loginName: this.userForm.userLogin, nickName: this.userForm.userNick}
      http.userTable().then(res => {
        console.log(res, 'prg[')
        res.data.list.forEach(item => {
          arrName.push({
            id: item.id,
            name: item.name,
            loginName: item.loginName
          })
        })
        this.proName = arrName
      })
    },
    // 新增订购用户
    newAddPro () {
      this.formLabelAlign = {
        PronameData: '',
        ftpProwss: '',
        ftpPro: '',
        ftp: ''
      }
      this.title = '新增订阅用户'
      this.dialogVisible = true
      this.showBJ = false
    },
    // 翻页
    handleSizeChange (val) {
      this.pageSize = val
      this.getOrderList()
    },
    // 翻页
    handleCurrentChange (val) {
      this.currentPage = val
      this.getOrderList()
    },
    // 删除订购用户
    removeData (index, row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.deleteFtpByIds({id: [row.id]}).then(res => {
          if (res.data) {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getOrderList()
          } else {
            this.$message({
              type: 'warning',
              message: '删除失败!'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
  .tableDZ{
    padding: 10px;
    background: #fff;
    border: 1px solid #edeff1;
    margin-bottom: 20px;
  }
  .table_button{
    /*position: absolute;*/
    /*right: 28px;*/
    /*top: 9px;*/
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
  .paginationAnddeleteButton {
    margin-top: 0.2rem;
    height: 30px;
  }
  .pagination {
    text-align: right;
    width: 59%;
    float: right;
  }
  .elDialog_Aduti>>>.el-dialog__body{
    padding: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__header{
    padding: 10px !important;
    border-bottom: 1px solid #eaeaea;
    margin-bottom: 20px;
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
  .elDialog_Aduti>>>.el-select {
    width: 84%;
  }
  .elDialog_Aduti>>>.el-input--small {
    width: 84%;
  }
  .select_name>>>.el-input--small {
    width: 100% !important;
  }
</style>
