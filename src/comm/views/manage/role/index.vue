<template>
  <left-main-layout :routerList="routerList" :mainOnly="true">
    <div class="roleMain"  slot="main">
      <el-form :inline="true" class="demo-form-inline" style="height: 50px;padding: 25px 25px;"
               ref="form" :model="roleForm" label-width="80px" label-position="left" @submit.native.prevent>
        <el-form-item label="角色名称">
          <el-input @keyup.enter.native="powerSearch" size="mini" clearable v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" icon="el-icon-search" @click="powerSearch">查询</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-plus"
            v-if="hasPerm('/role/save')"
            style="float: left;margin-bottom: .1rem;margin-right: .1rem;margin-top: .1rem;"
            @click="handleAdd">新增角色</el-button>
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
          prop="name"
          label="角色名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="describe"
          label="角色描述"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态" width="150"
          align="center"
          :formatter="statusConverter" >
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
                <span v-if="hasPerm('/role/updateById')" @click="handleEdit(scope.row)" style="cursor: pointer;display: inline-block;">
                  <img src="@/assets/images/manage/edit.png" title="修改" alt="">
                </span>
            <span v-if="hasPerm('/role/updateRolePermission')" @click="handlePermission(scope.row)" style="cursor: pointer;display: inline-block;">
                  <img src="@/assets/images/manage/power.png" title="权限" alt="">
                </span>
            <span v-if="hasPerm('/role/removeById')" @click="handleDelete(scope.row)" style="cursor: pointer;display: inline-block;">
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
        title="角色信息"
        :visible.sync="dialogVisible"
        width="40%"
        :close-on-click-modal="false"
        :before-close="handleClose">
        <el-row>
          <el-col :span="12">
            <el-form :rules="rules" :label-position="labelPosition" label-width="1.4rem" :model="formInline" class="demo-form-inline">
              <el-form-item label="角色名称" prop="name">
                <el-input style="margin-right: 20px" v-model="formInline.name" placeholder=""></el-input>
                <div style="float: right; position: relative;">
                  <span style="position: absolute;top: -27px;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
                </div>
              </el-form-item>
              <el-form-item label="状态" v-if="flag === true">
                <el-select v-model="formInline.status" placeholder="请选择" style="width: 100%">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="12">
            <el-form :label-position="labelPosition" label-width="1.4rem" :model="formInline" class="demo-form-inline">
              <el-form-item label="角色描述">
                <el-input v-model="formInline.describe" placeholder=""></el-input>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="roleUpdate"
            v-if="flag === true">修 改</el-button>
          <el-button
            type="primary"
            @click="roleSave"
            v-if="flag === false">新 增</el-button>
        </span>
      </el-dialog>
      <permissionDialog
        ref="permissionDialog"
        :menuData="menuData"
        :activeName="activeName"
        :spatialWktValue="spatialWktValue"
        :spatialCodeValue="spatialCodeValue"
        @handlePermissionClose="handlePermissionClose"
        @updateRolePermission="updateRolePermission"
      />
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
      activeName: 'first',
      spatialWktValue: [],
      spatialCodeValue: '',
      roleForm: {
        roleName: ''
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
      tableData: [],
      total: null,
      currentPage: 1,
      pageSize: 10,
      id: '',
      formInline: {
        name: '',
        describe: '',
        status: ''
      },
      tempKey: null,
      clientHeight: '',
      menuData: [],
      routerList: [
        {name: '系统管理', key: 'manage'},
        {name: '角色管理', key: 'manage/role'}
      ]
    }
  },
  methods: {
    powerSearch () {
      this.initTable()
    },
    roleSave () {
      if (this.formInline.name === '') {
        this.$message.error('请输入角色名称！')
        return false
      }
      http.listByName({name: this.formInline.name}).then(res => {
        if (res.data.length > 0) {
          this.$message.error('角色名称已存在，请修改！')
          return false
        } else {
          http.saveRole({name: this.formInline.name, describe: this.formInline.describe}).then(res => {
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
        }
      })
    },
    handleAdd () {
      this.flag = false
      this.formInline.name = ''
      this.formInline.describe = ''
      this.dialogVisible = true
    },
    handlePermissionClose () {
      this.spatialWktValue = ''
      this.spatialCodeValue = ''
      this.setDataPermissionCode(this.spatialCodeValue)
      this.setDataPermissionWkt(this.spatialWktValue)
    },
    updateRolePermission (obj) {
      let {checkedKeys, halfCheckedKeys, dataCheckedKeys, dataHalfCheckedKeys, dataPermissionCodeVal, dataPermissionWKTVal} = obj
      let arr = checkedKeys
      let halfCheckedKeysArr = halfCheckedKeys
      let dataArr = dataCheckedKeys
      let dataHalfArr = dataHalfCheckedKeys
      arr = arr.concat(halfCheckedKeysArr)
      dataArr = dataArr.concat(dataHalfArr)
      http.updateRolePermission({id: this.id, rights: arr}).then(res => {
        let valFlag = res.data
        if (res.data === 'true') {
          this.$message({
            message: '角色功能更新成功！',
            type: 'success'
          })
          // this.$refs['permissionDialog'].openFlag = false
        } else {
          this.$message.error('角色功能更新失败！')
        }
        http.roleDataPermissionSave({dataPermissionIds: dataArr, roleId: this.id, spatialCode: dataPermissionCodeVal, spatialWkt: dataPermissionWKTVal}).then(res => {
          if (res.data === 'true') {
            // this.$refs['permissionDialog'].openFlag = false
            this.$message({
              message: '角色数据权限更新成功！',
              type: 'success'
            })
            if (valFlag === 'true') {
              this.$refs['permissionDialog'].openFlag = false
            } else {
              this.$refs['permissionDialog'].openFlag = true
            }
          } else {
            this.$message({
              message: '角色数据权限更新失败！',
              type: 'error'
            })
            this.$refs['permissionDialog'].openFlag = true
          }
        })
      })
    },
    handlePermission (row) {
      this.id = row.id
      this.setCatalogNodeId('')
      this.initTree()
      this.initMenuTreeData()
    },
    initMenuTreeData () {
      http.getCatalogTreeForPermission().then(res => {
        this.menuData = res.data
        http.roleDataPermissionList({roleId: this.id}).then(res => {
          let arr = []
          if (res.data.length > 0) {
            if (res.data[0].geom !== undefined && res.data[0].geom !== '') {
              this.spatialWktValue = res.data[0].geom
              this.setDataPermissionWkt(this.spatialWktValue)
            } else if (res.data[0].geom === '') {
              this.spatialWktValue = ''
              this.setDataPermissionWkt(this.spatialWktValue)
            }
            if (res.data[0].discode !== undefined && res.data[0].discode !== '') {
              this.spatialCodeValue = res.data[0].discode
              this.setDataPermissionCode(this.spatialCodeValue)
            } else if (res.data[0].discode === '') {
              this.spatialCodeValue = ''
              this.setDataPermissionCode(this.spatialCodeValue)
            }
            res.data.forEach(item => {
              if (item.dataPermissionId !== undefined) {
                arr.push(item.dataPermissionId)
              }
            })
            this.$refs['permissionDialog'].openFlag = true
          }
          this.$nextTick(() => this.$refs['permissionDialog'].setDataCheckedKeyNodes(this.menuData, arr))
          // let allCheck = res.data.map(item => item.rightid)
          // let disabledData = res.data.filter(item => item.groupid !== this.id)
          // this.getShowCheckbox(treeData, disabledData)
        })
      })
    },
    roleUpdate () {
      if (localStorage.getItem('dataNameEdit') === this.formInline.name) {
        http.updateRole({id: this.id, name: this.formInline.name, describe: this.formInline.describe, status: this.formInline.status}).then(res => {
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
        http.listByName({name: this.formInline.name}).then(res => {
          if (res.data.length > 0) {
            this.$message.error('角色名称已存在，请修改！')
            return false
          } else {
            http.updateRole({
              id: this.id,
              name: this.formInline.name,
              describe: this.formInline.describe,
              status: this.formInline.status
            }).then(res => {
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
          }
        })
      }
    },
    handleEdit (row) {
      this.flag = true
      this.id = row.id
      // this.formInline.userId = row.id
      localStorage.setItem('dataNameEdit', row.name)
      this.formInline.name = row.name
      this.formInline.describe = row.describe
      this.formInline.status = row.status
      this.dialogVisible = true
    },
    handleDelete (row) {
      this.id = row.id
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        http.removeRole({id: this.id}).then(res => {
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
      http.rolePage({currentPage: this.currentPage, pageSize: this.pageSize, name: this.roleForm.roleName}).then(res => {
        this.tableData = res.data.list
        // this.tableData = res.data.records
        this.total = parseInt(res.data.total)
      })
    },
    initTree () {
      http.permissionTree({pid: 0}).then(res => {
        let treeData = res.data
        http.listPermission({roleId: this.id}).then(res => {
          this.$refs['permissionDialog'].openFlag = true
          this.$nextTick(() => this.$refs['permissionDialog'].setCheckedKeyNodes(treeData, res.data))
        })
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
    statusConverter (val) {
      for (var i = 0; i < this.options.length; i++) {
        if (val.status === this.options[i].value) {
          return this.options[i].label
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
  },
  watch: {
    clientHeight () {
      // this.$refs.roleContent.style.height = (this.clientHeight - 115) / 50 + 'rem'
    }
  }
}
</script>

<style scoped>
  .roleMain {
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
