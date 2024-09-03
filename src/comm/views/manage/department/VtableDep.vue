<template>
  <div ref="department" class="department" >
    <el-form :inline="true" class="demo-form-inline" style="height: 50px;padding: 25px 25px;"
             ref="form" :model="departmentForm" label-width="80px" label-position="left" @submit.native.prevent>
      <el-form-item label="部门名称">
        <el-input @keyup.enter.native="departmentSearch" size="mini" placeholder="输入内容" clearable v-model="departmentForm.departmentName"></el-input>
      </el-form-item>
      <el-form-item label="部门描述">
        <el-input @keyup.enter.native="departmentSearch" size="mini" placeholder="输入内容" clearable v-model="departmentForm.departmentDescribe"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="departmentSearch">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button
          type="warning"
          size="mini"
          icon="el-icon-plus"
          style="float: left;margin-bottom: .1rem;margin-right: .1rem;margin-top: .1rem;"
          v-if="hasPerm('/group/save')"
          @click="handleAdd">新增部门</el-button>
      </el-form-item>
    </el-form>
    <el-table
      border
      :data="tableData"
      tooltip-effect="dark"
      class="departmentTable"
      style="width: 100%;max-height: calc(100% - 140px);height:100%"
    >
      <!--:cell-style="tableCellStyle"-->
      <!-- stripe   :header-cell-style="tableHeaderCellStyle"-->
      <el-table-column
        prop="name"
        label="部门名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="describe"
        label="部门描述"
        align="center">
      </el-table-column>
      <el-table-column
        prop="districtCode"
        label="识别码" width="150"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
            <span v-if="hasPerm('/group/updateById')" @click="handleEdit(scope.row)" style="cursor: pointer;display: inline-block;">
              <img src="@/assets/images/manage/edit.png" title="修改" alt="">
            </span>
          <span v-if="hasPerm('/group/updateGroupRights')" @click="handlePermission(scope.row)" style="cursor: pointer;display: inline-block;">
              <img src="@/assets/images/manage/power.png" title="权限" alt="">
            </span>
          <span v-if="hasPerm('/group/removeById')" @click="handleDelete(scope.row)" style="cursor: pointer;display: inline-block;">
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
      :total="total">
    </el-pagination>
    <el-dialog
      title="部门信息"
      :visible.sync="dialogVisible"
      width="41%"
      class=""
      :close-on-click-modal="false"
      :before-close="handleClose">
      <el-row>
        <el-col :span="12">
          <el-form :rules="rules" :label-position="labelPosition" label-width="1.6rem" :model="formInline" class="demo-form-inline">
            <el-form-item label="部门名称" prop="name">
              <el-input v-model="formInline.name" placeholder=""></el-input>
              <div style="float: right; position: relative;">
                <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
              </div>
            </el-form-item>
            <el-form-item label="父级部门">
              <el-cascader
                style="width: 100%"
                expand-trigger="hover"
                change-on-select
                :options="options"
                v-model="selectedOptions"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :label-position="labelPosition" label-width="1.6rem" :model="formInline" class="demo-form-inline">
            <el-form-item label="部门描述">
              <el-input v-model="formInline.describe" placeholder=""></el-input>
            </el-form-item>
            <el-form-item
              label="识别码"
              :rules="[
                  { type: 'number', message: '必须为数字值', trigger: 'blur'} ]" >
              <el-input type="number" v-model.number="formInline.districtCode" placeholder=""></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="departUpdate"
            v-if="flag === true">修 改</el-button>
          <el-button
            type="primary"
            @click="departmentSave"
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
      @updateRolePermission="updateGroupRights"
    />
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import permissionDialog from '@comm/components/permissionDialog'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'mainContent',
  components: {permissionDialog},
  data () {
    var validateName = (rule, value, callback) => {
      // var regPass = new RegExp(`${this.getRegularData.REGEX_USERNAME}`)
      if (value === '') {
        callback(new Error('请输入部门名称'))
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
      departmentForm: {
        departmentName: '',
        departmentDescribe: ''
      },
      data4: [],
      total: null,
      currentPage: 1,
      pageSize: 10,
      tableData: [],
      arrdata: '',
      disabledTree: [],
      labelPosition: 'right',
      dialogVisible: false,
      flag: true,
      id: '',
      formInline: {
        id: '',
        name: '',
        describe: '',
        createTime: '',
        age: '',
        districtCode: ''
      },
      pid: '',
      options: [],
      selectedOptions: [],
      lastVlaue: '',
      menuData: [],
      activeName: 'first',
      spatialWktValue: [],
      spatialCodeValue: ''
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
    getNodeTreeID () {
      if (this.getNodeTreeID.length === 0) {
        this.arrdata = ''
      } else {
        this.arrdata = this.getNodeTreeID
      }
      this.initTable()
    }
  },
  methods: {
    departmentSearch () {
      this.initTable()
    },
    transmitData () {
      // console.log(this.data2)
      this.$emit('department', this.data2)
    },
    handleChange (value) {
      this.lastVlaue = value[value.length - 1]
    },
    getCheckedKeys (dataCheck) {
      let {checked} = dataCheck
      this.arrdata = ''
      for (var i = 0; i < checked.checkedNodes.length; i++) {
        this.arrdata += checked.checkedNodes[i].id + ','
      }
      this.arrdata = this.arrdata.substring(0, this.arrdata.lastIndexOf(','))
      this.initTable()
    },
    departUpdate () {
      if (this.formInline.name === '') {
        this.$message.error('请输入部门名称！')
        return false
      }
      http.departmentUpdate({pid: this.lastVlaue, id: this.formInline.id, name: this.formInline.name, describe: this.formInline.describe, parentId: this.lastVlaue, districtCode: this.formInline.districtCode}).then(res => {
        if (res.data === 'true') {
          this.$message({
            message: ' 更新成功！',
            type: 'success'
          })
          this.initTable()
        } else {
          this.$message.error('更新失败！')
        }
      })
      this.dialogVisible = false
    },
    handleDelete (row) {
      this.id = row.id
      this.$confirm('此操作将永久删除该部门, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        http.departmentRemove({id: this.id}).then(res => {
          if (res.data === 'true') {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.initTable()
            this.initTree()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleEdit (row) {
      this.flag = true
      this.id = row.id
      this.pid = row.pid
      this.formInline.id = row.id
      this.formInline.name = row.name
      this.formInline.describe = row.describe
      this.formInline.createTime = row.createTime

      http.groupGetById({id: this.id}).then(res => {
        if (res.data.districtCode !== '') {
          this.formInline.districtCode = Number(res.data.districtCode)
        }
        this.selectedOptions = res.data.groupIds
      })
      this.dialogVisible = true
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
    handleAdd () {
      this.flag = false
      this.formInline.id = ''
      this.formInline.name = ''
      this.formInline.describe = ''
      this.formInline.createTime = ''
      this.selectedOptions = []
      this.formInline.districtCode = ''
      this.dialogVisible = true
    },
    initTree () {
      http.groupTree({pid: 0}).then(res => {
        this.deletepId(res.data)
        this.data4 = res.data
        console.log(res, '1234456')
        this.$emit('departData2', this.data4)
        this.options = res.data
      })
    },
    handlePermissionClose () {
      this.spatialWktValue = ''
      this.spatialCodeValue = ''
      this.setDataPermissionCode(this.spatialCodeValue)
      this.setDataPermissionWkt(this.spatialWktValue)
    },
    // 修改部门权限
    updateGroupRights (obj) {
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
      http.updateGroupRights({id: this.id, rights: arr}).then(res => {
        let valFlag = res.data
        if (res.data === 'true') {
          // this.$refs['permissionDialog'].openFlag = false
          this.$message({
            message: '功能权限更新成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: '功能权限更新失败！',
            type: 'error'
          })
        }
        http.groupDataPermissionSave({dataPermissionIds: dataArr, groupId: this.id, spatialCode: dataPermissionCodeVal, spatialWkt: dataPermissionWKTVal}).then(res => {
          if (res.data === 'true') {
            // this.$refs['permissionDialog'].openFlag = false
            this.$message({
              message: '部门数据权限更新成功！',
              type: 'success'
            })
            if (valFlag === 'true') {
              this.$refs['permissionDialog'].openFlag = false
            } else {
              this.$refs['permissionDialog'].openFlag = true
            }
          } else {
            this.$message({
              message: '部门数据权限更新失败！',
              type: 'error'
            })
            this.$refs['permissionDialog'].openFlag = true
          }
        })
      })
    },
    // 修改部门数据权限
    // updateUserDataRights (obj) {
    //   let {checkedKeys, halfCheckedKeys, dataPermissionCodeVal, dataPermissionWKTVal} = obj
    //   console.log(dataPermissionCodeVal)
    //   console.log(dataPermissionWKTVal)
    //
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
        console.log(res.data,12121212)
        http.groupDataPermissionGetArea({groupId: this.id}).then(res => {
          console.log(res.data,12121213332)
          if (res.data !== null) {
            if (res.data.geom !== undefined && res.data.geom !== '') {
              this.spatialWktValue = res.data.geom
              this.setDataPermissionWkt(this.spatialWktValue)
            } else {
              this.spatialWktValue = ''
              this.setDataPermissionWkt(this.spatialWktValue)
            }
            if (res.data.discode !== undefined) {
              this.spatialCodeValue = res.data.discode
              this.setDataPermissionCode(this.spatialCodeValue)
            } else {
              this.spatialCodeValue = ''
              this.setDataPermissionCode(this.spatialCodeValue)
            }
          }
          http.groupDataPermissionList({groupId: this.id}).then(res => {
            let arr = []
            let {parent, own} = res.data
            parent.map(item => {
              arr.push(item.nodeid)
            })
            own.map(item => {
              arr.push(item.nodeid)
            })
            let disabledData = parent.filter(item => item.id !== this.id)
            this.$refs['permissionDialog'].openFlag = true
            this.getShowCheckbox(this.menuData, disabledData, false)
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
        http.listRights({groupId: this.id}).then(res => {
          let allCheck = res.data.map(item => item.RIGHTID)
          let disabledData = res.data.filter(item => item.groupid !== this.id)
          this.$refs['permissionDialog'].openFlag = true
          this.getShowCheckbox(treeData, disabledData, true)
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
    initTable () {
      console.log({currentPage: this.currentPage, pageSize: this.pageSize, groupIds: this.arrdata, name: this.departmentForm.departmentName, describe: this.departmentForm.departmentDescribe})
      http.departmentTable({currentPage: this.currentPage, pageSize: this.pageSize, groupIds: this.arrdata, name: this.departmentForm.departmentName, describe: this.departmentForm.departmentDescribe}).then(res => {
        this.tableData = res.data.list
        // this.tableData = res.data.records
        this.total = parseInt(res.data.total)
      })
    },
    departmentSave () {
      if (this.formInline.name === '') {
        this.$message.error('请输入部门名称！')
        return false
      }
      http.departmentSave({pid: this.lastVlaue, name: this.formInline.name, describe: this.formInline.describe, parentId: this.lastVlaue, districtCode: this.formInline.districtCode}).then(res => {
        if (res.data === 'true') {
          this.$message({
            message: ' 新增成功！',
            type: 'success'
          })
          this.initTree()
          this.initTable()
          this.dialogVisible = false
        } else {
          this.$message.error('新增失败！')
        }
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
    ...mapActions('manage', {
      setNodeId: 'setNodeId',
      setDataPermissionCode: 'setDataPermissionCode',
      setDataPermissionWkt: 'setDataPermissionWkt'
    })
  },
  mounted () {
    this.initTree()
    this.initTable()
    this.setNodeId([])
  }
}
</script>

<style scoped>
  .department{
    height:calc(100% - 20px);
    background: #fff;
    padding:10px;
    margin-right: 10px;
    border-radius:4px 3px 4px 4px;
    border:1px solid rgba(223,229,249,1);
  }
  .pagination {
    text-align: right;
    width: 59%;
    height: 30px;
    float: right;
    padding: 10px;
  }

  .departmentTable >>> .el-table--border th, .el-table--border td {
    border-right: 2px solid #ffffff;
  }
  .departmentTable >>> .el-table__body-wrapper {
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
