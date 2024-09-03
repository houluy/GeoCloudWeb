<template>
  <div>
    <!-- <div class="configTopP">
      <img src="@/assets/img/configP.png" height="40" width="5"/>
      <span class="spanConfig">系统配置</span>
    </div> -->
    <div class="configFrame" >
      <span style="font-size: 18px;display:block;margin: 20px 0 20px 30px;">基本参数</span>
      <el-form :label-position="labelPosition" :inline="true" :model="formInline" :label-width="labelWidth" class="demo-form-inline" style="margin: 20px 0 0 50px; width: 800px;">
        <el-form-item label="系统名称">
          <el-input v-model="formInline.sysName" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item label="系统logo">
          <el-input v-model="formInline.sysLog" placeholder="添加logo图片，大小...,格式..." style="width: 600px;"></el-input>
          <!--<el-upload style="float: right; margin-left: 5px"-->
            <!--class="upload-demo"-->
            <!--action=""-->
            <!--:http-request="uploadSuccess"-->
            <!--:show-file-list = "false"-->
            <!--:on-change="handleChange"-->
            <!--:file-list="fileList">-->
            <!--<el-button size="small" type="primary">选择文件</el-button>-->
          <!--</el-upload>-->
        </el-form-item>
      </el-form>
    </div>
    <div class="configFrame" >
      <span style="font-size: 18px;display:block;margin: 20px 0 20px 30px;">页脚参数</span>
      <el-form :label-width="labelWidth" :label-position="labelPosition" :inline="true" :model="formInline" class="demo-form-inline" style="margin: 20px 0 0 50px; width: 800px;">
        <el-form-item label="版权信息">
          <el-input v-model="formInline.copyrightInfor" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item label="备案信息">
          <el-input v-model="formInline.recordInfor" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item label="联系信息">
          <el-input v-model="formInline.contactAddress" placeholder="联系地址" style="width: 198px;"></el-input>
          <el-input v-model="formInline.contactTele" placeholder="联系电话" style="width: 198px;"></el-input>
          <el-input v-model="formInline.contactPost" placeholder="邮编" style="width: 198px;"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="configFrame" >
      <span style="font-size: 18px;display:block;margin: 20px 0 20px 30px;">运行参数</span>
      <el-form :label-width="labelWidth" :label-position="labelPosition" :inline="true" :model="formInline" class="demo-form-inline" style="margin: 20px 0 0 50px; width: 800px;">
        <el-form-item label="临时帐户有效期">
          <el-input v-model="formInline.accountValPer" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item label="在线用户数">
          <el-input v-model="formInline.onlineUsersNub" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item label="芯调频率">
          <el-input v-model="formInline.frequency" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 50px; float: right">
      <el-button type="primary" @click="initTableSysConfig">取消</el-button>
      <el-button type="primary" @click="saveSystemConfig">保存</el-button>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
// import { mapState, mapActions } from 'vuex'
import {configManage} from '@comm/static/configManage.js'
import { mapActions } from 'vuex'
export default {
  name: 'sysConfigMent',
  data () {
    return {
      fileList: [],
      fileDataName: '',
      total: 0,
      labelPosition: 'right',
      labelWidth: '2.4rem',
      dialogVisible: false,
      flag: '',
      pageSize: 10,
      currentPage: 1,
      tableData: [],
      formInline: {
        sysName: '',
        sysLog: '',
        copyrightInfor: '',
        recordInfor: '',
        contactAddress: '',
        contactTele: '',
        contactPost: '',
        accountValPer: '',
        onlineUsersNub: '',
        frequency: ''
      }
    }
  },
  methods: {
    initTableSysConfig () {
      // http.sysInfolist().then(res => {
      //   var data = res.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      //   this.tableData = data
      //   this.total = res.data.length
      // })
      let formData = configManage.getConfigSation()
      this.formInline = formData
    },
    // uploadSuccess (file, fileList) {
    //   let formData = new FormData()
    //   formData.append('file', file.file)
    //   this.filesList = formData
    //   this.fileDataName = file.file.name
    //   this.fileList = fileList
    // },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    getSysConfig () {
      http.sysInfolist({
        key: this.formInline.key,
        value: this.formInline.value
      }).then(res => {
        this.tableData = res.data
        this.total = res.data.length
      })
    },
    saveSystemConfig () {
      localStorage.setItem('frequency', this.formInline.frequency)
      var infos = [
        {id: '', sysKey: 'sysName', sysValue: this.formInline.sysName},
        {id: '', sysKey: 'sysLog', sysValue: this.formInline.sysLog},
        {id: '', sysKey: 'copyrightInfor', sysValue: this.formInline.copyrightInfor},
        {id: '', sysKey: 'recordInfor', sysValue: this.formInline.recordInfor},
        {id: '', sysKey: 'contactAddress', sysValue: this.formInline.contactAddress},
        {id: '', sysKey: 'contactTele', sysValue: this.formInline.contactTele},
        {id: '', sysKey: 'contactPost', sysValue: this.formInline.contactPost},
        {id: '', sysKey: 'accountValPer', sysValue: this.formInline.accountValPer},
        {id: '', sysKey: 'onlineUsersNub', sysValue: this.formInline.onlineUsersNub}
      ]
      http.sysSaveSysInfo({
        infos
      }).then(res => {
        if (res.data === 'true') {
          // this.$message({
          //   type: 'success',
          //   message: '保存成功!'
          // })
          this.$notify({

            message: '保存成功！',
            position: 'bottom-right',
            type: 'success',
            duration: 1500
          })
          this.getConfigSation()
          // this.initTableSysConfig()
        } else {
          // this.$message({
          //   type: 'info',
          //   message: '保存失败!'
          // })
          this.$notify.error({
            message: '保存失败',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
      this.initTableSysConfig()
    },
    handleDelete (index, row) {
      this.id = row.id
      this.$confirm('此操作将永久删除配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.removeSysById({id: this.id}).then(res => {
          if (res.data === 'true') {
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!'
            // })
            this.$notify({

              message: '删除成功！',
              position: 'bottom-right',
              type: 'success',
              duration: 1500
            })
            this.initTableSysConfig()
          }
        })
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // })
        this.$notify.info({

          message: '已取消删除',
          position: 'bottom-right',
          duration: 3500
        })
      })
    },
    sysConfigUpdate () {
      http.updateSysConfig({id: this.id, key: this.formInline.key, value: this.formInline.value}).then(res => {
        if (res.data === 'true') {
          // this.$message({
          //   message: ' 修改成功！',
          //   type: 'success'
          // })
          this.$notify({

            message: '修改成功！',
            position: 'bottom-right',
            type: 'success',
            duration: 1500
          })
          this.dialogVisible = false
          this.initTableSysConfig()
        } else {
          // this.$message.error('修改失败！')
          this.$notify.error({
            message: '修改失败！',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
    },
    handleClose (done) {
      done()
    },
    handleEdit (row) {
      this.id = row.id
      this.formInline.key = row.key
      this.formInline.value = row.value
      this.dialogVisible = true
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTableSysConfig()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initTableSysConfig()
    },
    ...mapActions('configManage', {
      getConfigSation: 'getConfigSation'
    })
  },
  mounted () {
    this.initTableSysConfig()
  },
  computed: {
    // ...mapState('configManage', {
    //   getNodeTreeID (state) {
    //     return state.formInline1
    //   }
    // })
  }
}
</script>

<style scoped>

</style>
