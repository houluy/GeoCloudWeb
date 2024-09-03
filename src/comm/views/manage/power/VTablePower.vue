<template>
  <div ref="power" class="power">
    <el-form :inline="true"  style="height: 50px;padding: 25px 25px;"  class="demo-form-inline" ref="form" :model="powerForm" label-width="80px" label-position="left" @submit.native.prevent>
      <el-form-item label="权限名称">
        <el-input @keyup.enter.native="powerSearch" size="mini" clearable v-model="powerForm.powerName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="powerSearch">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button
          type="warning"
          size="mini"
          icon="el-icon-plus"
          v-if="hasPerm('/permission/save')"
          style="float: left;margin-bottom: .1rem;margin-right: .1rem;margin-top: .1rem;"
          @click="handleAdd">新增权限</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      size="small"
      class="pwerTable"
      border
      style="width: 100%;max-height: calc(100% - 140px);height:100%">
      <el-table-column
        prop="name"
        label="权限名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="describe"
        label="权限描述"
        align="center">
      </el-table-column>
      <el-table-column
        prop="subSysId"
        label="系统标识"
        align="center"
        :formatter="sysIdConverter">
      </el-table-column>
      <el-table-column
        prop="rank"
        label="权限类型" width="150"
        align="center">
      </el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template slot-scope="scope">
        <span v-if="hasPerm('/permission/updateById')" @click="handleEdit(scope.row)" style="cursor: pointer;display: inline-block;">
          <img src="@/assets/images/manage/edit.png" title="修改" alt="">
        </span>
          <span v-if="hasPerm('/permission/removeById')" @click="handleDelete(scope.row)" style="cursor: pointer;display: inline-block;">
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
      title="权限信息"
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :before-close="handleClose">
      <div style="height: 9rem;">
        <el-scrollbar style="height: 100%;">
          <el-row style="padding: 0 .2rem;">
            <el-col :span="12">
              <el-form :label-position="labelPosition" label-width="1.6rem" :model="formInline" class="demo-form-inline">
                <el-form-item label="权限名称">
                  <el-input v-model="formInline.name" placeholder=""></el-input>
                  <div style="float: right; position: relative;">
                    <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
                  </div>
                </el-form-item>
                <el-form-item label="系统标识">
                  <el-select v-model="formInline.subSysId" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in subSysIds"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div style="float: right; position: relative;">
                    <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
                  </div>
                </el-form-item>
                <el-form-item label="权限类型">
                  <el-select v-model="formInline.rank" placeholder="请选择" style="width: 100%">
                    <el-option
                      v-for="item in ranks"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                  <div style="float: right; position: relative;">
                    <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
                  </div>
                </el-form-item>
                <el-form-item label="选中图标">
                  <el-input v-model="formInline.pitchIcon" placeholder=""></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span="12">
              <el-form :label-position="labelPosition" label-width="1.7rem" :model="formInline" class="demo-form-inline">
                <el-form-item label="权限描述">
                  <el-input v-model="formInline.describe" placeholder=""></el-input>
                  <div style="float: right; position: relative;">
                    <span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
                  </div>
                </el-form-item>
                <el-form-item label="类型">
                  <el-cascader
                    expandTrigger="click"
                    :options="fucManageOptions"
                    v-model="selectedOptions"
                    :props="{ checkStrictly: true }"
                    style="width: 100%"
                    @change="handleChange">
                  </el-cascader>
                  <!--<div style="float: right; position: relative;">-->
                    <!--<span style="position: absolute;top: 0;color: red;font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>-->
                  <!--</div>-->
                </el-form-item>
                <el-form-item label="功能排序">
                  <el-input v-model="formInline.orderFlag" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="未选中图标">
                  <el-input v-model="formInline.noPitchIcon" placeholder=""></el-input>
                </el-form-item>
              </el-form>
            </el-col>
            <el-col :span='24'>
              <el-form :label-position="labelPosition" label-width="1.7rem" class="demo-form-inline" :model="dynamicValidateForm" ref="dynamicValidateForm">
                <el-form-item
                  v-for="(domain, index) in dynamicValidateForm.domains"
                  :label="'接口地址' + (index + 1)"
                  :key="domain.key">
                  <el-input v-model="domain.permissionId" style="display: none;"></el-input>
                  <el-input v-model="domain.urlKey" style="width: 24%;"></el-input>
                  <el-input v-model="domain.urlValue" style="width: 51%;margin-left: .2rem;"></el-input>
                  <el-button @click.prevent="removeDomain(domain)" style="width: 20%;margin-left: .2rem;">删除</el-button>
                </el-form-item>
              </el-form>
              <div style="width: 100%;text-align: center;">
                <el-button  type="warning" size="mini" icon="el-icon-plus" @click="addDomain">添加接口地址</el-button>
              </div>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="permissionUpdate('dynamicValidateForm')"
          v-if="flag === true">修 改</el-button>
        <el-button
          type="primary"
          @click="permissionSave"
          v-if="flag === false">新 增</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import $ from 'jquery'
import http from '@comm/service/interface.js'

export default {
  name: 'powerManage',
  data () {
    return {
      powerForm: {
        powerName: ''
      },
      dynamicValidateForm: {
        domains: [
          {
            permissionId: '',
            urlKey: '',
            urlValue: ''
          }
        ]
      },
      fucManageOptions: [],
      selectedOptions: [],
      ranks: [],
      subSysIds: [],
      idArr: [],
      labelPosition: 'right',
      dialogVisible: false,
      data2: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      total: null,
      currentPage: 1,
      pageSize: 10,
      lastVlaue: 10,
      arrdata: '',
      id: '',
      checkedKeyNodes: [],
      formInline: {
        name: '',
        describe: '',
        rank: '',
        subSysId: '',
        orderFlag: '',
        pitchIcon: '',
        noPitchIcon: ''
      },
      flag: true,
      lastVlaueX: ''
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
      this.initTable()
    }
  },
  methods: {
    powerSearch () {
      this.initTable()
    },
    handleChange (value) {
      this.lastVlaue = value[value.length - 1]
    },
    removeDomain (item) {
      var index = this.dynamicValidateForm.domains.indexOf(item)
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1)
      }
    },
    addDomain () {
      this.dynamicValidateForm.domains.push({
        permissionId: this.id,
        urlKey: '',
        urlValue: ''
      })
    },
    isNumber(val){
     let regPos = /^\d+(\.\d+)?$/; //非负浮点数
     // let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
      if(regPos.test(val)){
        return false;
      }else{
        return true;
      }
    },
     permissionSave () {
      if (this.formInline.name === '' || this.formInline.subSysId === '' || this.formInline.rank === '' || this.formInline.describe === '' || this.formInline.describe === undefined) {
        this.$message.error('请输入必填项！')
        return false
      }
      if (this.isNumber(this.formInline.orderFlag)) {
        this.$message.error('排序只能是整数！')
        return false
      }
      http.permissionSave({iconPath: JSON.stringify([this.formInline.pitchIcon, this.formInline.noPitchIcon]), name: this.formInline.name, describe: this.formInline.describe, subSysId: this.formInline.subSysId, rank: this.formInline.rank, orderFlag: this.formInline.orderFlag, parentId: this.lastVlaue, rightApis: this.dynamicValidateForm.domains}).then(res => {
        if (res.data === 'true') {
          this.$message({
            message: ' 新增成功！',
            type: 'success'
          })
          this.initTable()
          this.initTree()
          this.dialogVisible = false
        } else {
          this.$message.error('新增失败！')
        }
      })
    },
    handleAdd () {
      this.flag = false
      this.formInline.name = ''
      this.formInline.describe = ''
      this.formInline.rank = ''
      this.formInline.orderFlag = ''
      this.formInline.pitchIcon = ''
      this.formInline.noPitchIcon = ''
      this.formInline.subSysId = ''
      this.selectedOptions = []

      var obj = {
        domains: [
          {
            permissionId: '',
            urlKey: '',
            urlValue: ''
          }
        ]
      }
      this.dynamicValidateForm = obj
      this.dialogVisible = true
    },
    getCheckedKeys (data, checked) {
      this.arrdata = ''
      this.currentPage = 1
      for (var i = 0; i < checked.checkedNodes.length; i++) {
        this.arrdata += checked.checkedNodes[i].id + ','
      }
      this.arrdata = this.arrdata.substring(0, this.arrdata.lastIndexOf(','))
      this.initTable()
    },
    permissionUpdate (formName) {
      if (this.formInline.name === '' || this.formInline.subSysId === '' || this.formInline.rank === '' || this.formInline.describe === '' || this.formInline.describe === undefined) {
        this.$message.error('请输入必填项！')
        return false
      }
      if (this.isNumber(this.formInline.orderFlag)) {
        this.$message.error('排序只能是整数！')
        return false
      }
      http.permissionUpdate({id: this.id, iconPath: JSON.stringify([this.formInline.pitchIcon, this.formInline.noPitchIcon]), name: this.formInline.name, describe: this.formInline.describe, subSysId: this.formInline.subSysId, rank: this.formInline.rank, orderFlag: this.formInline.orderFlag, parentId: this.lastVlaue, rightApis: this.dynamicValidateForm.domains}).then(res => {
        if (res.data === 'true') {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.dialogVisible = false
          this.initTable()
          this.initTree()
        } else {
          this.$message.error('修改失败！')
        }
      })
    },
    permissionGetById (id) {
      http.permissionGetById({id}).then(res => {
        var arr = []
        for (var i = 0; i < res.data.rightApis.length; i++) {
          // var id = res.data.id
          var permissionId = res.data.id
          var urlKey = res.data.rightApis[i].urlKey
          var urlValue = res.data.rightApis[i].urlValue
          var obj = {
            // id,
            permissionId,
            urlKey,
            urlValue
          }
          arr.push(obj)
        }
        this.selectedOptions = res.data.pids
        this.dynamicValidateForm.domains = arr
      })
    },
    handleEdit (row) {
      this.flag = true
      this.id = row.id
      this.parentId = row.parentId
      // this.formInline.userId = row.id
      this.formInline.name = row.name
      this.formInline.describe = row.describe
      this.formInline.orderFlag = row.orderFlag
      this.formInline.rank = row.rank
      this.formInline.subSysId = row.subSysId
      this.formInline.pitchIcon = row.iconPath !== undefined ? JSON.parse(row.iconPath)[0] : ''
      this.formInline.noPitchIcon = row.iconPath !== undefined ? JSON.parse(row.iconPath)[1] : ''
      this.permissionGetById(this.id)
      this.dialogVisible = true
    },
    handleDelete (row) {
      this.id = row.id
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        http.permissionRemove({id: this.id}).then(res => {
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
      // let groupIds = this.getNodeTreeID
      http.permissionPage({currentPage: this.currentPage, pageSize: this.pageSize, pids: this.getNodeTreeID, name: this.powerForm.powerName}).then(res => {
        this.tableData = res.data.list
        this.total = parseInt(res.data.total)
      })
    },
    initTree () {
      http.permissionTree({pid: 0}).then(res => {
        this.deletepId(res.data)
        this.data2 = res.data
        this.$emit('poweData2', this.data2)
        // this.transmitData()
        this.fucManageOptions = res.data
        this.data2.forEach(m => {
          this.idArr.push(m.id)
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
    initHieght () {
      let h1 = $(document).height() - 61
      let h2 = h1 / 50 + 'rem'
      $('#treeHeight').css('height', h2)
    },
    initSysIds () {
      http.getMenuToCS().then(res => {
        console.log(res,'090999998876')
        for (var i = 0; i < res.data[0].children.length; i++) {
          this.subSysIds[i] = res.data[0].children[i]
        }
      })
    },
    sysIdConverter (val) {
      for (var i = 0; i < this.subSysIds.length; i++) {
        if (val.subSysId === this.subSysIds[i].value) {
          return this.subSysIds[i].label
        }
      }
    },
    rankConverter (val) {
      for (var i = 0; i < this.ranks.length; i++) {
        if (val.rank === this.ranks[i].value) {
          return this.ranks[i].label
        }
      }
    },
    userInitEnums () {
      http.userInitEnums().then(res => {
        let obj = {}
        res.data.rightRanks.forEach(item => {
          obj = {}
          obj.value = item
          obj.label = item
          this.ranks.push(obj)
        })
      })
    },
    ...mapActions('manage', {
      setNodeId: 'setNodeId'
    })
  },
  mounted () {
    this.userInitEnums()
    this.initSysIds()
    this.initTable()
    this.initTree()
    this.setNodeId([])
    this.initHieght()
  }
}
</script>

<style scoped>
  .power{
    height:calc(100% - 20px);
    background: #fff;
    padding:10px;
    margin-right: 10px;
    border-radius:4px 3px 4px 4px;
    border:1px solid rgba(223,229,249,1);
  }

  .pagination{
    text-align: right;
    /*width: 59%;*/
    height: 30px;
    float: right;
    padding: 10px;
  }
  .userContent>>>.el-dialog__body{
    height: 6rem;
  }
  .userContent>>>.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .pwerTable img{
    cursor: pointer;
    vertical-align: bottom;
  }

  .pwerTable >>> .el-table--border th, .el-table--border td {
    border-right: 2px solid #ffffff;
  }
  .pwerTable >>> .el-table__body-wrapper {
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
