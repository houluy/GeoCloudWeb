<template>
  <div class="userManage">
    <el-form :inline="true" style="height: 50px;padding: 25px 25px;" ref="form" :model="userForm" label-width="80px" label-position="left">
      <el-form-item label="用户账号">
        <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="mini" clearable v-model="userForm.userLogin"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称">
        <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="mini" clearable v-model="userForm.userNick"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="userSearch">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button
          type="warning"
          size="mini"
          icon="el-icon-plus"
          v-if="hasPerm('/user/save')"
          style="float: left;margin-bottom: .1rem;margin-right: .1rem;margin-top: .1rem;"
          @click="handleAdd" v-show="hidden">新增用户</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      border
      tooltip-effect="dark"
      class="userTable"
      style="width: 100%;max-height: calc(100% - 140px);height:100%"
    >
      <el-table-column
        prop="loginName"
        label="账号"
        show-overflow-tooltip
        align="center">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="昵称"
        show-overflow-tooltip
        align="center">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        show-overflow-tooltip
        align="center">
      </el-table-column>
      <el-table-column
        prop="phoneMobile"
        label="电话"
        show-overflow-tooltip
        align="center">
      </el-table-column>
      <el-table-column
        prop="isAudited"
        label="免审用户"
        show-overflow-tooltip
        :formatter="auditedConverter"
        align="center">
      </el-table-column>
      <el-table-column
        prop="period"
        label="到期时间" width="190"
        show-overflow-tooltip
        align="center">
      </el-table-column>
      <el-table-column width="290"  label="操作" align="center">
        <template slot-scope="scope">
              <span v-if="hasPerm('/user/updateById')" @click="handleEdit(scope.row)" style="cursor: pointer;display: inline-block;">
                <img src="@/assets/images/manage/edit.png" title="修改" alt="">
              </span>
          <span v-if="hasPerm('/user/updateTypeById')" @click="handleApproval(scope.row)" style="cursor: pointer;display: inline-block;" v-show="hidden">
                <img src="@/assets/images/manage/punish.png" title="有效期设置" alt="">
              </span>
          <span v-if="hasPerm('/user/updateUserRights')" @click="handlePermission(scope.row)" style="cursor: pointer;display: inline-block;">
                <img src="@/assets/images/manage/power.png" title="权限" alt="">
              </span>
          <span v-if="hasPerm('/user/resetPassword')" @click="handlePassReset(scope.row)" style="cursor: pointer;display: inline-block;" v-show="hidden">
                <img src="@/assets/images/manage/lock.png" title="密码重置" alt="">
              </span>
          <span v-if="hasPerm('/user/removeById')" @click="handleDelete(scope.row)" style="cursor: pointer;display: inline-block;" v-show="hidden">
                <img src="@/assets/images/manage/del.png" title="逻辑删除" alt="">
              </span>
          <span v-if="hasPerm('/user/remove')" @click="handlePhysicsDelete(scope.row)" style="cursor: pointer;display: inline-block;" v-show="hidden">
                <img src="@/assets/images/manage/del.png" title="物理删除" alt="">
              </span>
          <!-- <el-button
            size="mini"
            v-if="hasPerm('/user/updateById')"
            @click="handleEdit(scope.row)">编辑</el-button>
          <el-button
            size="mini"
            v-if="hasPerm('/user/updateTypeById')"
            @click="handleApproval(scope.row)">审批</el-button>
          <el-button
            size="mini"
            v-if="hasPerm('/user/updateUserRights')"
            @click="handlePermission(scope.row)">权限</el-button>
          <el-button
            size="mini"
            v-if="hasPerm('/user/resetPassword')"
            @click="handlePassReset(scope.row)">密码重置</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="hasPerm('/user/removeById')"
            @click="handleDelete(scope.row)">逻辑删除</el-button>
          <el-button
            size="mini"
            type="danger"
            v-if="hasPerm('/user/remove')"
            @click="handlePhysicsDelete(scope.row)">物理删除</el-button> -->
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
      :total="total">
    </el-pagination>
    <el-dialog
      title="用户信息"
      :visible.sync="dialogVisible"
      width="44%"
      class="elformClass"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-row>
        <el-col :span="12">
          <el-form ref="userRules" :rules="rules" :label-position="labelPosition" label-width="1.1rem" :model="formInline"  >
            <el-form-item style="margin-bottom: .6rem" label="账号" prop="loginName">
              <el-input :disabled="disabelD" v-model="formInline.loginName" placeholder=""></el-input>
              <div style="float: right; position: relative;">
                <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: .6rem" label="昵称">
              <el-input v-model="formInline.name" placeholder=""></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: .6rem" label="邮箱" prop="email">
              <el-input v-model="formInline.email" placeholder=""></el-input>
              <div style="float: right; position: relative;">
                <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: .6rem" label="电话" prop="phoneMobile">
              <el-input v-model="formInline.phoneMobile" placeholder=""></el-input>
              <div style="float: right; position: relative;">
                <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
              </div>
            </el-form-item>
            <el-form-item style="margin-bottom: .6rem" label="" prop="isAudited">
              <input type="checkbox" v-model="formInline.isAudited" placeholder=""/>免审用户
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :rules="rules" :label-position="labelPosition" label-width="1rem" :model="formInline">
            <el-form-item style="margin-bottom: .6rem" label="姓名">
              <el-input v-model="formInline.user" placeholder=""></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: .6rem" label="地址">
              <el-input v-model="formInline.address" placeholder=""></el-input>
            </el-form-item>
            <el-form-item style="margin-bottom: .6rem" label="角色">
              <el-select
                style="width: 100%"
                v-model="userValue[0]"
                clearable
                @visible-change="handleSelectChange"
                placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: .6rem" label="部门">
              <el-cascader
                style="width: 100%"
                expand-trigger="click"
                change-on-select
                :options="cascadeOptions"
                v-model="selectedOptions"
                @change="handleselectedOptions">
              </el-cascader>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('userRules')">取 消</el-button>
          <el-button
            type="primary"
            @click="userUpdate('userRules')"
            v-if="flag === true">修 改</el-button>
          <el-button
            type="primary"
            @click="userSave('userRules')"
            v-if="flag === false">新 增</el-button>
        </span>
    </el-dialog>
    <el-dialog
      title="用户有限期设置"
      :visible.sync="dialogApprovalVisible"
      width="40%"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-row>
        <el-col :span="24">
          <el-form :label-position="labelPosition" label-width="1rem" >
            <el-form-item label="期限">
              <el-select
                style="width: 100%"
                v-model="approvalValue"
                @change="handleApprovalSelectChange"
                collapse-tags
                placeholder="请选择">
                <el-option
                  v-for="item in approvalOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-show="deadlineFlag" label="期限">
              <el-select
                style="width: 100%"
                v-model="deadline"
                collapse-tags
                placeholder="请选择">
                <el-option
                  v-for="item in deadlineOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
            <el-button @click="approveCancel">取 消</el-button>
            <el-button
              type="primary"
              @click="approve">审 批</el-button>
          </span>
    </el-dialog>
    <div class="">
      <passDialog :passWordApproveFlag="passWordApproveFlag" @passDialogData="passDialogData(arguments)" :passDialogVisible="passDialogVisible" :passReset="passReset" />
    </div>
    <permissionDialog
      ref="permissionDialog"
      :menuData="menuData"
      :activeName="activeName"
      :spatialWktValue="spatialWktValue"
      :spatialCodeValue="spatialCodeValue"
      @handlePermissionClose="handlePermissionClose"
      @updateRolePermission="updateUserRights"
    />
  </div>
</template>

<script>
  import http from '@comm/service/interface.js'
  import { mapState, mapActions } from 'vuex'
  import passDialog from '@comm/components/passDialog.vue'
  import permissionDialog from '@comm/components/permissionDialog'
  import { initGroupTree, handleUserGroup } from '@comm/utils/hasPermission'
  export default {
    components: {
      passDialog,
      permissionDialog
    },
    data () {
      var validateLoginName = (rule, value, callback) => {
        var regPass = new RegExp(`${this.getRegularData.REGEX_USERNAME}`)
        if (value === '') {
          callback(new Error('请输入用户ID'))
        } else {
          if (regPass.test(value)) {
            callback()
          } else {
            callback(new Error('包含大写字母、小写字母和数字, 长度最少为5位,不能超过19位'))
          }
        }
      }
      var validateName = (rule, value, callback) => {
        // var regPass = new RegExp(`${this.getRegularData.REGEX_USERNAME}`)
        if (value === '') {
          callback(new Error('请输入用户昵称'))
        } else {
          callback()
        }
      }
      var validateEmail = (rule, value, callback) => {
        var regPass = new RegExp(`${this.getRegularData.REGEX_EMAIL}`)
        if (value === '') {
          callback(new Error('请输入新邮箱'))
        } else {
          if (regPass.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的邮箱地址'))
          }
        }
      }
      var validatePhoneMobile = (rule, value, callback) => {
        var regPass = new RegExp(`${this.getRegularData.REGEX_MOBILE}`)
        if (value === '') {
          callback(new Error('请输入电话号码'))
        } else {
          if (regPass.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正确的电话号码'))
          }
        }
      }
      return {
        activeName: 'first',
        spatialWktValue: '',
        spatialCodeValue: '',
        userForm: {
          userLogin: '',
          userNick: ''
        },
        getRegularData: null,
        disabledTree: [],
        passReset: null,
        passWordResetFlag: false,
        passWordApproveFlag: false,
        passDialogVisible: false,
        flag: true,
        options: [],
        cascadeOptions: [],
        selectedOptions: [],
        userValue: [],
        labelPosition: 'right',
        dialogVisible: false,
        dialogVisible2: false,
        data4: [],
        total: null,
        currentPage: 1,
        pageSize: 10,
        tableData: [],
        id: '',
        disabelD: false,
        userNameData: [],
        formInline: {
          loginName: '',
          name: '',
          email: '',
          isAudited: '',
          user: '',
          address: '',
          phoneMobile: ''
        },
        rules: {
          loginName: [
            { validator: validateLoginName, trigger: 'blur' },
            { min: 4, message: '长度最少为4位,不能超过19位', trigger: 'blur' }
          ],
          name: [
            { validator: validateName, trigger: 'blur' }
          ],
          email: [
            { validator: validateEmail, trigger: 'blur' },
            { min: 8, message: '请输入正确的邮箱地址', trigger: 'blur' }
          ],
          phoneMobile: [
            { validator: validatePhoneMobile, trigger: 'blur' },
            { min: 8, message: '请输入正确的电话号码', trigger: 'blur' }
          ]
        },
        arrdata: '',
        lastVlaue: [],
        deadlineFlag: false,
        dialogApprovalVisible: false,
        deadline: '',
        approvalValue: '',
        dateTime: new Date(),
        approvalType: '',
        approvalPeriod: '',
        approvalOptions: [
          {value: '4', label: '临时用户'},
          {value: '0', label: '永久用户'}
        ],
        deadlineOptions: [
          {value: '3', label: '3天'},
          {value: '7', label: '7天'},
          {value: '30', label: '30天'},
          {value: '180', label: '180天'}
        ],
        str: null,
        menuData: [],
        // 物理删除
        dataid: []
      }
    },
    computed: {
      ...mapState('manage', {
        getNodeTreeID (state) {
          return state.nodeTreeID
        }
      })
    },
    watch: {
      getNodeTreeID (val) {
        if (val) {
          this.initTable()
        }
      },
      passReset (val) {
        this.passReset = val
      },
      passWordResetFlag (val) {
        if (val) {
          http.resetPassword({id: this.id}).then(res => {
            if (res.data === 'true') {
              this.$message({
                type: 'success',
                message: '重置密码成功!'
              })
              this.passWordResetFlag = false
              // this.passReset = false
            }
          })
        }
      }
    },
    methods: {
      // 查询
      userSearch () {
        this.initTable()
      },
      // 修改部门权限
      updateGroupRights (obj) {
        let {checkedKeys, halfCheckedKeys} = obj
        let arr = checkedKeys
        this.disabledTree.map(item => {
          arr = arr.filter(each => each !== item)
        })
        http.updateGroupRights({id: this.id, checkedKeys: arr, halfCheckedKeys}).then(res => {
          if (res.data === 'true') {
            this.$refs['permissionDialog'].openFlag = false
          }
        })
      },
      auditedConverter (val) {
        if (val.isAudited === 0 ) {
          return "是"
        }
        if (val.isAudited === 1) {
          return "否"
        }
        return "否"

      },
      // 判断新增账号是否存在。进行回调判断
      getDataByName (callback) {
        http.getUserByName({name: this.formInline.loginName}).then(res => {
          callback(res.data)
        })
      },
      handleselectedOptions (value) {
        // 此处为hover就会选中 每次hover都会改变value  每次都清空lastValue  只取最后一次的最后一个
        this.lastVlaue = []
        this.lastVlaue.push(value[value.length - 1])
      },
      userSave (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getDataByName((param) =>{
              if (param.length > 0) {
                this.$message({
                  showClose: true,
                  message: '账号存在，请修改！',
                  type: 'warning'
                })
              } else {
                var isAudited=''
                if (this.formInline.isAudited)
                  isAudited=0
                else
                  isAudited=1
                http.userSave({loginName: this.formInline.loginName, nickName: this.formInline.name, name: this.formInline.user, email: this.formInline.email, address: this.formInline.address, phoneMobile: this.formInline.phoneMobile,isAudited:isAudited, groupIds: this.lastVlaue, roleIds: this.userValue, loginCount: 0, pwdHistory: '',type: '正式用户'}).then(res => {
                  console.log(res, '909090909')
                  if (res.data === 'true') {
                    this.$message({
                      message: ' 新增成功！',
                      type: 'success'
                    })
                    this.initTable()
                    // this.initTree()
                    this.dialogVisible = false
                  } else {
                    this.$message.error('新增失败！')
                  }
                })
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: '必填项格式错误，请检查!',
              type: 'error'
            })
            return false
          }
        })
      },
      handleAdd () {
        this.flag = false
        this.disabelD = false
        this.formInline.loginName = ''
        this.formInline.name = ''
        this.formInline.user = ''
        this.formInline.email = ''
        this.formInline.address = ''
        this.formInline.phoneMobile = ''
        this.formInline.isAudited = ''
        this.userValue = []
        this.selectedOptions = []

        http.userPermission().then(res => {
          var value = ''
          var label = ''
          var arr = []
          for (var i = 0; i < res.data.length; i++) {
            value = res.data[i].id
            label = res.data[i].describe
            var obj = {
              value,
              label
            }
            arr.push(obj)
          }
          this.options = arr
        })
        this.dialogVisible = true
      },
      handleSelectChange (val) {
        if (val === true) {
          http.userPermission().then(res => {
            var value = ''
            var label = ''
            var arr = []
            for (var i = 0; i < res.data.length; i++) {
              value = res.data[i].id
              label = res.data[i].name
              var obj = {
                value,
                label
              }
              arr.push(obj)
            }
            this.options = arr
          })
        }
      },
      handleId () {
        handleUserGroup(this.id, (res) => {
          this.userValue = res.data.roleIds
          this.selectedOptions = res.data.groupIds
        })
      },
      handleUser (row) {
        this.id = row.id
        this.formInline.loginName = row.loginName

        this.dialogVisible2 = true
      },
      handleEdit (row) {
        this.flag = true
        this.disabelD = true
        this.id = row.id
        this.formInline.loginName = row.loginName
        this.formInline.name = row.nickName
        this.formInline.user = row.name
        this.formInline.email = row.email
        this.formInline.address = row.address
        this.formInline.phoneMobile = row.phoneMobile
        if (row.isAudited===1)
          this.formInline.isAudited = 0
        else
          this.formInline.isAudited = 1

        http.userPermission().then(res => {
          var value = ''
          var label = ''
          var arr = []
          for (var i = 0; i < res.data.length; i++) {
            value = res.data[i].id
            label = res.data[i].name
            var obj = {
              value,
              label
            }
            arr.push(obj)
          }
          this.options = arr
          this.handleId()
        })
        this.dialogVisible = true
      },
      userUpdate (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var roleID = this.userValue
            var isAudited=''
            if (this.formInline.isAudited)
              isAudited=0
            else
              isAudited=1
            http.userUpdate({id: this.id, loginName: this.formInline.loginName, nickName: this.formInline.name, name: this.formInline.user, email: this.formInline.email, address: this.formInline.address, phoneMobile: this.formInline.phoneMobile,isAudited:isAudited, roleIds: roleID, groupIds: this.lastVlaue}).then(res => {
              if (res.data === 'true') {
                this.$message({
                  message: '更新成功！',
                  type: 'success'
                })
                var isSS=0
                if (this.formInline.isAudited){
                  isSS=0
                }
                else{
                  isSS=1
                }
                if (localStorage.getItem('userId')===this.formInline.loginName) {
                  // alert("VTableUser"+isSS)
                  // localStorage.setItem('isAudited',isSS)
                }
                this.initTable()
                this.dialogVisible = false
              } else {
                this.$message.error('更新失败！')
              }
            })
          } else {
            this.$message({
              showClose: true,
              message: '必填项格式错误，请检查!',
              type: 'error'
            })
            return false
          }
        })
      },
      handleApproval (row) {
        this.passDialogVisible = true
        this.approvalValue = ''
        this.deadline = ''
        this.deadlineFlag = false
        this.id = row.id
        this.passWordApproveFlag = true
        this.passReset = false
      },
      passDialogData (val) {
        this.dialogApprovalVisible = val[0]
        this.passDialogVisible = val[1]
        this.passWordResetFlag = val[2]
      },
      handlePassReset (row) {
        this.passDialogVisible = true
        this.passReset = true
        this.passWordApproveFlag = false
        this.id = row.id
      },
      handleApprovalSelectChange (val) {
        this.approvalType = val
        if (this.approvalType === '4') {
          this.deadlineFlag = true
        } else {
          this.deadlineFlag = false
        }
      },
      approveCancel () {
        this.dialogApprovalVisible = false
        this.passWordApproveFlag = false
      },
      approve () {
        if (this.deadline) {
          this.dateTime = this.dateTime.setDate(this.dateTime.getDate() + parseInt(this.deadline)) + 8 * 60 * 60 * 1000
          this.dateTime = new Date(this.dateTime)
          this.str = JSON.stringify(this.dateTime).substr(1, JSON.stringify(this.dateTime).length - 2)
        } else {
          this.dateTime = ''
        }
        http.getApproval({id: this.id, type: this.approvalType, period: this.str}).then(res => {
          if (res.data === 'true') {
            this.$message({
              type: 'success',
              message: '审批成功!'
            })
          }
          this.dialogApprovalVisible = false
          this.passWordApproveFlag = false
          this.initTable()
        })
      },
      handleDelete (row) {
        this.id = row.id
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          http.userRemove({id: this.id}).then(res => {
            if (res.data === 'true') {
              this.$message({
                type: 'success',
                message: '逻辑删除成功!'
              })
              this.initTable()
              // this.initTree()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      handlePhysicsDelete (row) {
        // this.dataid = []
        // this.dataid.push(parseInt(row.id))
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false
        }).then(() => {
          http.userPhysicsRemove({ids: row.id}).then(res => {
            if (res.data === 'true') {
              this.$message({
                type: 'success',
                message: '物理删除成功!'
              })
              this.initTable()
              // this.initTree()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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
      getCheckedKeys (dataCheck) {
        let {userChecked} = dataCheck
        this.arrdata = ''
        for (var i = 0; i < userChecked.checkedNodes.length; i++) {
          this.arrdata += userChecked.checkedNodes[i].id + ','
        }
        this.arrdata = this.arrdata.substring(0, this.arrdata.lastIndexOf(','))
        this.initTable()
      },
      handlePermissionClose () {
        this.spatialWktValue = ''
        this.spatialCodeValue = ''
        this.setDataPermissionCode(this.spatialCodeValue)
        this.setDataPermissionWkt(this.spatialWktValue)
      },
      // 修改用户权限
      updateUserRights (obj) {
        let {checkedKeys, halfCheckedKeys, dataCheckedKeys, dataHalfCheckedKeys, dataPermissionCodeVal, dataPermissionWKTVal} = obj
        let arr = checkedKeys
        let halfCheckedKeysArr = halfCheckedKeys
        let dataArr = dataCheckedKeys
        let dataHalfArr = dataHalfCheckedKeys
        this.disabledTree.map(item => {
          arr = arr.filter(each => each !== item)
        })
        this.disabledTree.map(item => {
          halfCheckedKeysArr = halfCheckedKeysArr.filter(each => each !== item)
        })
        arr = arr.concat(halfCheckedKeysArr)
        dataArr = dataArr.concat(dataHalfArr)
        http.updateUserRights({id: this.id, rights: arr}).then(res => {
          let valFlag = res.data
          if (res.data === 'true') {
            // this.$refs['permissionDialog'].openFlag = false
            this.$message({
              message: '用户功能权限更新成功！',
              type: 'success'
            })
          } else {
            this.$message({
              message: '用户功能权限更新失败！',
              type: 'error'
            })
          }
          http.userDataPermissionSave({dataPermissionIds: dataArr, userId: this.id, spatialCode: dataPermissionCodeVal, spatialWkt: dataPermissionWKTVal}).then(res => {
            if (res.data === 'true') {
              // this.$refs['permissionDialog'].openFlag = false
              this.$message({
                message: '用户数据权限更新成功！',
                type: 'success'
              })
              if (valFlag === 'true') {
                this.$refs['permissionDialog'].openFlag = false
              } else {
                this.$refs['permissionDialog'].openFlag = true
              }
            } else {
              this.$message({
                message: '用户数据权限更新失败！',
                type: 'error'
              })
              this.$refs['permissionDialog'].openFlag = true
            }
          })
        })
      },
      // 修改用户数据权限
      // updateUserDataRights (obj) {
      //   let {checkedKeys, halfCheckedKeys, dataPermissionVal} = obj
      //   let arr = checkedKeys
      //   let val = dataPermissionVal
      //   console.log(arr)
      //   console.log(val)
      // },
      // 部门权限管理
      handlePermission (row) {
        this.id = row.id
        this.initTreeOwn()
        this.initMenuTreeData()
      },
      initMenuTreeData () {
        http.getCatalogTreeForPermission().then(res => {
          this.menuData = res.data
          http.userDataPermissionGetArea({userId: this.id}).then(res => {
            if (res.data !== null) {
              if (res.data.geom !== undefined && res.data.geom !== '') {
                this.spatialWktValue = res.data.geom
                this.setDataPermissionWkt(this.spatialWktValue)
              } else {
                this.setDataPermissionWkt('')
              }
              if (res.data.discode !== undefined) {
                this.spatialCodeValue = res.data.discode
                this.setDataPermissionCode(this.spatialCodeValue)
              } else {
                this.setDataPermissionCode('')
              }
            }
            http.userDataPermissionList({userId: this.id}).then(res => {
              let arr = []
              let {groupPermissions, rolePermissions, userPermissions} = res.data
              userPermissions.map(item => {
                arr.push(item.nodeid)
              })
              groupPermissions.map(item => {
                arr.push(item.nodeid)
              })
              rolePermissions.map(item => {
                arr.push(item.nodeid)
              })
              let disabledData = groupPermissions.filter(item => item.id !== this.id)
              let disabledData2 = rolePermissions.filter(item => item.id !== this.id)
              this.$refs['permissionDialog'].openFlag = true
              this.getShowCheckbox(this.menuData, disabledData, false)
              this.getShowCheckbox(this.menuData, disabledData2, false)
              this.$nextTick(() => this.$refs['permissionDialog'].setDataCheckedKeyNodes(this.menuData, arr))
              // let allCheck = res.data.map(item => item.rightid)
              // let disabledData = res.data.filter(item => item.groupid !== this.id)
              // this.getShowCheckbox(treeData, disabledData)
            })
          })
        })
      },
      initTreeOwn () {
        http.permissionTree({pid: 0}).then(res => {
          let treeData = res.data
          http.userListRights({id: this.id}).then(res => {
            let {groupRights, roleRights, userRights} = res.data
            let allCheck = []
            userRights.map(item => {
              allCheck.push(item.rightId)
            })
            groupRights.map(item => {
              allCheck.push(item.rightid)
            })
            roleRights.map(item => {
              allCheck.push(item.rightId)
            })
            let disabledData = groupRights.filter(item => item.groupid !== this.id)
            let disabledData2 = roleRights.filter(item => item.roleId !== this.id)
            this.$refs['permissionDialog'].openFlag = true
            this.getShowCheckbox(treeData, disabledData, true)
            this.getShowCheckbox(treeData, disabledData2, true)
            this.$nextTick(() => this.$refs['permissionDialog'].setCheckedKeyNodes(treeData, allCheck))
          })
        })
      },
      // 继承部门上级权限，添加disabled属性
      getShowCheckbox (data, arr, flag) {
        for (let i = 0; i < arr.length; i++) {
          this.addDisalbed(data, arr[i], flag)
        }
      },
      addDisalbed (data, obj, flag) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].children) {
            this.addDisalbed(data[i].children, obj, flag)
          }
          if (flag) {
            if (data[i].id === obj.rightid || data[i].id === obj.rightId) {
              data[i].disabled = true
              this.disabledTree.push(data[i].id)
            }
          } else {
            if (data[i].id === obj.nodeid.toString()) {
              data[i].disabled = true
              this.disabledTree.push(data[i].id)
            }
          }
        }
      },
      initTree () {
        initGroupTree(0, (res) => {
          this.deletepId(res.data)
          this.data4 = res.data
          this.$emit('userData2', this.data4)
          this.cascadeOptions = res.data
        })
        // http.groupTree({pid: 0}).then(res => {
        //   this.deletepId(res.data)
        //   this.data4 = res.data
        //   this.$emit('userData2', this.data4)
        //   this.cascadeOptions = res.data
        // })
      },
      initTable () {
        // this.currentPage = 1
        http.userTable({currentPage: this.currentPage, pageSize: this.pageSize, groupIds: this.getNodeTreeID, loginName: this.userForm.userLogin, nickName: this.userForm.userNick}).then(res => {

          res.data.list.forEach(item => {
            if (item.period) {
              if (item.period.indexOf('9999-12-31') !== -1) {
                item.period = '永久'
              } else if (item.period.indexOf('0001-01-01') !== -1) {
                item.period = '永久'
              } else {
                item.period = item.period.replace('T', ' ')
              }
            }
          })
          this.tableData = res.data.list
          this.total = res.data.total
        })
      },
      resetForm (formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
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
      ...mapActions('manage', {
        setNodeId: 'setNodeId',
        setDataPermissionCode: 'setDataPermissionCode',
        setDataPermissionWkt: 'setDataPermissionWkt'
      })
    },
    mounted () {
      this.getRegularData = JSON.parse(localStorage.getItem('regularRules'))
      // this.$refs.userControl.style.height = (document.documentElement.clientHeight - 145) / 50 + 'rem'
      this.initTree()
      this.initTable()
      this.setNodeId([])
    }
  }
</script>
<style scoped>
  .userManage{
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
  .elformClass>>>.el-form-item{
    margin-bottom: .6rem;
    margin-right: 20px;
  }
  .userTable img{
    cursor: pointer;
    vertical-align: bottom;
  }
  .userTable >>> .el-table--border th, .el-table--border td {
    border-right: 2px solid #ffffff;
  }
  .userTable >>> .el-table__body-wrapper {
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
</style>
