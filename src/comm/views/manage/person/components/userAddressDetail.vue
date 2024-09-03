<template>
  <left-main-layout :routerList="routerList" :mainOnly="true">
    <div class="userAddressMain"  slot="main">
      <el-form :inline="true" class="demo-form-inline" style="height: 50px;padding: 25px 25px;"
               ref="form" :model="userAddressForm" label-width="80px" label-position="left" @submit.native.prevent>
        <el-form-item label="帐号">
          <el-input @keyup.enter.native="powerSearch" size="mini" clearable v-model="userAddressForm.loginName"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
            <el-input @keyup.enter.native="powerSearch" size="mini" clearable v-model="userAddressForm.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="powerSearch">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            style="float: left;margin-bottom: .1rem;margin-right: .1rem;margin-top: .1rem;"
            @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
      <el-table
        border
        :data="tableData"
        class="roleTable"
        tooltip-effect="dark"
        style="width: 100%;max-height: calc(100% - 140px);height:100%"
      >
        <el-table-column
            prop="id"
              label="id"
                v-if="false"
                align="center">
        </el-table-column>
        <el-table-column
          prop="loginName"
          label="帐号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
          align="center">
        </el-table-column>
        <el-table-column
            prop="status"
            label="状态" width="150"
            align="center"
            :formatter="statusConverter" >
        </el-table-column>
        <el-table-column
          prop="url"
          label="地址" width="150"
          align="center"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
                <span  @click="handleEdit(scope.row)" style="cursor: pointer;display: inline-block;">
                  <img src="@/assets/images/manage/edit.png" title="修改" alt="">
                </span>
                <span  v-if="scope.row.status==0" @click="handlePower(scope.row)" style="cursor: pointer;display: inline-block;">
                  <img src="@/assets/images/manage/power.png" title="启用" alt="">
                </span>
                 <span v-if="scope.row.status==1" @click="handleLock(scope.row)" style="cursor: pointer;display: inline-block;">
                   <img src="@/assets/images/manage/lock.png" title="停用" alt="">
                 </span>
                  <span  @click="handleDelete(scope.row)" style="cursor: pointer;display: inline-block;">
                     <img src="@/assets/images/manage/del.png" title="删除" alt="">
                  </span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        background
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
      <el-dialog
        title="用户地址信息"
        :visible.sync="dialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <el-row>
          <el-col :span="24">
            <el-form :label-position="labelPosition" label-width="1.4rem" :model="formInline" class="demo-form-inline">
              <el-form-item label="帐户" prop="loginName">
                    <el-input disabled="edit"   style="width:340px;margin-right: 20px;" v-model="formInline.loginName" placeholder=""></el-input>
                    <el-button size="mini" type="primary" icon="el-icon-search" @click="userCheck">选择</el-button>
              </el-form-item>

              <el-form-item label="姓名" prop="name">
                <el-input disabled="edit" style="width:340px;margin-right: 20px;" v-model="formInline.name" placeholder=""></el-input>

              </el-form-item>
              <el-form-item label="地址">
                  <el-input style="width:340px;margin-right: 20px" v-model="formInline.url" placeholder=""></el-input>
                  <el-button size="mini" type="primary" icon="el-icon-search" @click="addressCheck">验证</el-button>
              </el-form-item>

            </el-form>
          </el-col>

        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="userAddressUpdate"
            v-if="flag === true">修 改</el-button>
          <el-button
            type="primary"
            @click="userAddressSave"
            v-if="flag === false">新 增</el-button>
        </span>
      </el-dialog>


       <el-dialog
              title="用户信息"
              :visible.sync="userDialogVisible"
              width="40%"
              highth="60%"
              :close-on-click-modal="false"
              :before-close="handleClose">
               <el-form :inline="true" class="demo-form-inline" style="padding: 10px 10px;" ref="form" :model="userForm" label-width="80px" label-position="left">
                   <el-form-item label="账号">
                     <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="mini" clearable v-model="userForm.loginName"></el-input>
                   </el-form-item>
                   <el-form-item label="姓名">
                     <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="mini" clearable v-model="userForm.name"></el-input>
                   </el-form-item>
                   <el-form-item>
                     <el-button size="mini" type="primary" icon="el-icon-search" @click="userSearch">查询</el-button>
                   </el-form-item>
                 </el-form>
                 <el-table
                   :data="userTableData"
                   class="userTable"
                   style="width: 100%;max-height: calc(100% - 170px);height:100%"
                  >
                   <el-table-column label="选择" align="center" width="65">
                   <template slot-scope="scope">
                   <el-radio :label="scope.$index" v-model="radio"
                   @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
                   </template>
                   </el-table-column>
                   <el-table-column
                     prop="loginName"
                     label="账号"
                     show-overflow-tooltip
                     align="center">
                   </el-table-column>
                   <el-table-column
                     prop="name"
                     label="姓名"
                     show-overflow-tooltip
                     align="center">
                   </el-table-column>
                 </el-table>
                 <el-pagination
                   class="pagination"
                   @size-change="userHandleSizeChange"
                   @current-change="userHandleCurrentChange"
                   :current-page="userCurrentPage"
                   :page-sizes="[10, 20, 30, 40]"
                   :page-size="userPageSize"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="userTotal"
                 >
                 </el-pagination>
              <span slot="footer" class="dialog-footer">
                <el-button @click="userDialogVisible = false">取 消</el-button>
                <el-button
                  type="primary"
                  @click="userCheckOk"
                  v-if="flag === false">确 认</el-button>
              </span>
            </el-dialog>

    </div>
  </left-main-layout>

</template>
<script>
import { mapActions } from 'vuex'
import http from '@comm/service/interface.js'
import permissionDialog from '@comm/components/permissionDialog'
import leftMainLayout from '@comm/components/leftMainLayout'
export default {
  name: 'mainContent',
  components: {leftMainLayout, permissionDialog},
  data () {
    var validateName = (rule, value, callback) => {
      // var regPass = new RegExp(`${this.getRegularData.REGEX_USERNAME}`)
      if (value === '') {
        callback(new Error('请输入角色名称'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        name: [
          { validator: validateName, trigger: 'blur' }
        ]
      },
      templateSelection: {},
      radio: '',
      activeName: 'first',
      spatialWktValue: [],
      singleSelection: [],
      spatialCodeValue: '',
      userAddressForm: {
        loginName: '',
        name: '',
        url:''
      },
      userForm: {
         loginName: '',
         name: ''
      },
      flag: true,
      options: [
        {
          value: 0,
          label: '授权'
        }, {
          value: 1,
          label: '未授权'
        }
      ],
      createRoleValue: '',
      labelPosition: 'right',
      dialogVisible: false,
      userDialogVisible: false,
      tableData: [],
      total: null,
      currentPage: 1,
      pageSize: 10,
      userTableData: [],
      userTotal: null,
      userCurrentPage: 1,
      userPageSize: 10,
      id: '',
      formInline: {
        name: '',
        loginName: '',
        url: ''
      },
      tempKey: null,
      clientHeight: '',
      menuData: [],
      routerList: [
        {name: '个人中心', key: 'manage'},
        {name: '推送用户管理', key: 'manage/person'}
      ]
    }
  },
  methods: {
    userSearch () {
          this.userInitTable()
        },
        userInitTable () {
          http.userPage({
            currentPage: this.userCurrentPage,
            pageSize: this.userPageSize,
            loginName: this.userForm.loginName,
            name: this.userForm.name
          }).then(res => {
            this.userTableData = res.data.list.slice(0, 10)
            this.userTotal = res.data.total
          })
        },
        userHandleSizeChange (val) {
          this.userPageSize = val
          this.userInitTable()
        },
        userHandleCurrentChange (val) {
          this.userCurrentPage = val
          this.userInitTable()
        },
        handleSelectionChange (row, column, event) {
          singleSelection = row
          //singleSelection
         // this.$emit('selectUserData', row)
          //this.$emit('closeUserSelectDialog')
        }
        ,
        getCurrentRow(row){
        //templateSelection = row
        this.templateSelection = row

        },
    powerSearch () {
      this.initTable()
    },
    statusConverter (val) {

      if (val.status === 0) {
         return "禁用"
      }
      if (val.status === 1) {
         return "启用"
      }
      if (val.status === 3) {
         return "删除"
      }

    },
    addressCheck () {
        http.addressCheck({url: this.formInline.url}).then(res => {

                      if (res.data === 'true') {
                        this.$message({
                          message: ' 验证成功！',
                          type: 'success'
                        })

                      } else {
                        this.$message.error('验证失败！')
                      }
                    })
    },
   userCheck () {

       this.templateSelection =''
       this.radio=''
       this.userDialogVisible = true

   },
   userCheckOk () {
     if (this.templateSelection=='')
     {
        alert("请选择选中用户")
        return
     }
     this.formInline.loginName=this.templateSelection.loginName
     this.formInline.name=this.templateSelection.name
     this.userDialogVisible = false
     this.radio=''
   },
   userAddressSave () {

      if (this.formInline.loginName === '') {
        this.$message.error('请输入帐户！')
        return false
      }
      if (this.formInline.name === '') {
              this.$message.error('请输入姓名！')
              return false
            }
        if (this.formInline.url === '') {
              this.$message.error('请输入地址！')
              return false
        }

        http.listByLoginName({loginName: this.formInline.loginName}).then(res => {

            if (res.data.length > 0) {
               this.$message.error('帐户已存在，请修改！')
               return false
             }

          })

          http.saveUserAddress({url: this.formInline.url,name: this.formInline.name, loginName: this.formInline.loginName}).then(res => {

            if (res.data === 'true') {
              this.$message({
                message: ' 新增成功！',
                type: 'success'
              })
              this.initTable()
              this.dialogVisible = false
            } else {
              this.$message.error('新增失败！')
            }
          })


    },
    handleAdd () {
      this.flag = false
      this.formInline.loginName = ''
      this.formInline.name = ''
      this.formInline.url = ''
      this.dialogVisible = true
    },

    userAddressUpdate () {

      if (localStorage.getItem('dataNameEdit') === this.formInline.loginName) {
        http.updateUserAddress({id: this.id, name: this.formInline.name, loginName: this.formInline.loginName, url: this.formInline.url}).then(res => {
          if (res.data === 'true') {
            this.$message({
              message: ' 修改成功！',
              type: 'success'
            })
            this.dialogVisible = false
            this.initTable()
          } else {
            this.$message.error('修改失败！')
          }
        })
      } else {
        this.$message.error('帐户不能修改！')
         return false
      }
    },
    handleEdit (row) {
      this.flag = true
      this.id = row.id
      // this.formInline.userId = row.id
      localStorage.setItem('dataNameEdit', row.loginName)
      //this.formInline.name = row.name+'_'+row.loginName
      this.formInline.name = row.name
      this.formInline.loginName = row.loginName
      this.formInline.url = row.url
      this.dialogVisible = true
    },
    handleDelete (row) {
      this.id = row.id
      this.$confirm('此操作将永久删除该用户地址, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        http.removeUserAddress({id: this.id}).then(res => {
          if (res.data === 'true') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.initTable()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlePower (row) {
          this.id = row.id
          this.$confirm('此操作启用该用户地址, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }).then(() => {
            http.powerUserAddress({id: this.id}).then(res => {
              if (res.data === 'true') {
                this.$message({
                  type: 'success',
                  message: '启用成功!'
                })
                this.initTable()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消启用'
            })
          })
    },
    handleLock (row) {
          this.id = row.id
          this.$confirm('此操作禁用该用户地址, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal: false
          }).then(() => {
            http.lockUserAddress({id: this.id}).then(res => {
              if (res.data === 'true') {
                this.$message({
                  type: 'success',
                  message: '禁用成功!'
                })
                this.initTable()
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消禁用'
            })
          })
    },
    handleClose (done) {
      done()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initTable()
    },
    initTable () {
      http.userAddressPage({currentPage: this.currentPage, pageSize: this.pageSize, loginName: this.userAddressForm.loginName,name:this.userAddressForm.name}).then(res => {
        this.tableData = res.data.list
        this.total = parseInt(res.data.total)
      })
    },

    // 遍历删除数据中的pid
    deletepId (arr) {
      for (var i = 0; i < arr.length; i++) {
        delete arr[i].parentId
        if (arr[i].children !== undefined) {
          this.deletepId(arr[i].children)
        }
      }
    },
    ...mapActions('searchStore', {
      setCatalogNodeId: 'setCatalogNodeId'
    }),
    ...mapActions('manage', {
      setDataPermissionCode: 'setDataPermissionCode',
      setDataPermissionWkt: 'setDataPermissionWkt'
    })
  },
  mounted () {
    let that = this
    that.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function () {
      that.clientHeight = `${document.documentElement.clientHeight}`
    }
    this.initTable()
    this.userInitTable()

    //http.userDataPermissionData({loginName:''}).then(res => {
     //     let arrName = []
     //     if (res.data.length>0){
      //        for (var i=0;i<res.data.length;i++) {
      //          arrName.push({
      //              id: res.data[i].id,
      //              name: res.data[i].name+'_'+res.data[i].loginName,
      //             loginName: res.data[i].loginName
      //              })
      //           }
      //      }
      //    this.proName = arrName
      //    console.log(this.proName, 'this.proName')
      //  })
  },
  watch: {
    clientHeight () {

    }
  }
}
</script>

<style scoped>
  .userAddressMain {
    height:calc(100% - 20px);
    background: #fff;
    padding:10px;
    margin-right: 10px;
    border-radius:4px 3px 4px 4px;
    border:1px solid rgba(223,229,249,1);
  }
  .pagination{
    text-align: right;
    width: 59%;
    height: 30px;
    float: right;
    padding: 10px;
  }
  .roleTable img{
    cursor: pointer;
    vertical-align: bottom;
  }
  .roleTable >>> .el-table--border th, .el-table--border td {
    border-right: 2px solid #ffffff;
  }
  .roleTable >>> .el-table__body-wrapper {
    overflow-y: auto;
    height: calc(100% - 57.5px)
  }
  /deep/ .el-table th>.cell{
    background: #FAFBFF !important;
    padding: 10px 10px !important;
    color: #555656;
    font-weight:bold;
  }

  /deep/ .el-table--small th {
    padding: 0px 0px;
  }
  .demo-form-inline>>>.el-form-item {
    margin-right: 20px;
  }
</style>
