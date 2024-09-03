<template>
  <div>
    <!-- <div class="configTopP">
      <img src="@/assets/img/configP.png" height="40" width="5"/>
      <span class="spanConfig">站点配置</span>
    </div> -->
    <div class="configFrameDash" @click="dialogVisible = true" style="cursor: pointer;">
      <p style="font-size:20px;">
        <span style="font-size:24px;">+ </span>
        <span>添加站点</span>
      </p>
    </div>
    <div class="configFrame">
      <el-row style="height: 100%;">
        <el-col>
          <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column prop="id" label="id" align="center"></el-table-column>
            <el-table-column prop="sysKey" label="属性名称" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column prop="sysValue" label="属性值" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="操作"  align="center">
              <template slot-scope="scope">
                <el-button size="mini" @click="siteUpData(scope.$index, scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-pagination-->
            <!--class="pagination"-->
            <!--@size-change="handleSizeChange"-->
            <!--@current-change="handleCurrentChange"-->
            <!--:current-page="currentPage"-->
            <!--:page-sizes="[10, 20, 30, 40]"-->
            <!--:page-size="pageSize"-->
            <!--background-->
            <!--layout="total, sizes, prev, pager, next, jumper"-->
            <!--:total="total"-->
            <!--style="padding: .2rem 1rem;"-->
          <!--&gt;</el-pagination>-->
        </el-col>
      </el-row>
      <div style="margin: .2rem;float: right">
        <el-button type="danger">批量删除</el-button>
      </div>
    </div>
    <el-dialog
      title="站点信息"
      :visible.sync="dialogVisible"
      width="35%">
      <el-form :label-position="this.labelPosition" :inline="true" :model="formInline" class="demo-form-inline" label-width="80px">
        <el-form-item label="id">
          <el-input v-model="formInline.id" placeholder="" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="属性名称">
          <el-input v-model="formInline.sysKey" placeholder="" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="属性值">
          <el-input v-model="formInline.sysValue" placeholder="" style="width:300px"></el-input>
        </el-form-item>
        <!--<el-form-item label="用户名">-->
        <!--<el-input v-model="formInline.value" placeholder="" style="width:300px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="密码">-->
        <!--<el-input v-model="formInline.value" placeholder="" style="width:300px"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="站点路劲">-->
        <!--<el-input v-model="formInline.value" placeholder="" style="width:300px"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
       <el-button @click="dialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="sysConfigUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '@comm/service/interface'
export default {
  name: 'siteConfigMent',
  data () {
    return {
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      formInline: {
        id: '',
        sysKey: '',
        sysValue: ''
      },
      labelPosition: 'left',
      str: ''
    }
  },
  methods: {
    initTableSiteConfig () {
      http.sysInfolist().then(res => {
        // var data = res.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        this.tableData = res.data
        // this.total = res.data.length
      })
    },
    selectId (selection, row) {
      console.log(row)
      console.log(selection)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.multipleSelection.forEach(item => {
        this.str += item.id + ','
      })
      this.str = this.str.slice(0, this.str.length - 1)
    },
    handleDelete (index, row) {
      let id = row.id
      this.$confirm('此操作将永久删除配置, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.removeSysById({id: id}).then(res => {
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
            this.initTableSiteConfig()
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
    siteUpData (index, row) {
      this.dialogVisible = true
      this.formInline.id = row.id
      this.formInline.sysKey = row.sysKey
      this.formInline.sysValue = row.sysValue
    },
    sysConfigUpdate () {
      this.dialogVisible = false
      http.updateSysConfig({id: this.formInline.id, key: this.formInline.key, value: this.formInline.value}).then(res => {
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
          this.initTableSiteConfig()
        } else {
          // this.$message.error('修改失败！')
          this.$notify.error({
            message: '修改失败',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
    }
  },
  mounted () {
    this.initTableSiteConfig()
  }
}
</script>

<style scoped>

</style>
