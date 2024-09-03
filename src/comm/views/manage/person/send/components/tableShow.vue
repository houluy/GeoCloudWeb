<template>
  <div class="contentD">
    <el-table
      :data="tableData1"
      ref="cyTable1"
      size="mini"
      row-key="id"
      :cell-style='cellStyle'
      :header-cell-style='rowClass'
      :expand-row-keys="expandKeys"
      @expand-change="expandChange1"
      style="width: 100%">
      <el-table-column type="expand">
      <el-table
        :data="tableData"
        ref="cyTable"
        size="mini"
        class="expandC"
        v-loading="loading"
        @selection-change="selectChange"
        @expand-change="expandChange"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="moreContain">
              <div class="moreLeft">
                <el-form label-position="left" inline>
                  <div class="flexDiv">
                    <el-form-item label="任务名称:">
                      <span>{{ scope.row.fTaskName }}</span>
                    </el-form-item>
                    <!--<el-form-item label="接收单位:">-->
                      <!--<span>{{ scope.row.fDistrictName }}</span>-->
                    <!--</el-form-item>-->
                  </div>
                  <div class="flexDiv">
                    <el-form-item label="数据推送周期:">
                      <span>{{ scope.row.fTimeQuantum }}</span>
                    </el-form-item>
                    <el-form-item label="数据范围:">
                      <span>{{ scope.row.fGeometryName }}</span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="数据推送时间:">
                      <span>{{ scope.row.fDataStartTime }}至{{ scope.row.fDataEndTime }}</span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="开始推送时间:">
                      <span>{{ scope.row.fExecuteTime }}</span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="推送数据类型:">
                      <div v-for="item in scope.row.taskSatDos" :key="item.id" class="starList">
                        <span>{{ item.fProductLevel }}、</span>
                        <span>{{ item.fSat }}、</span>
                        <span>{{ item.fSensor }}</span>
                        <span>{{ item.fCloundAmount }}</span>
                      </div>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="待接收FTP:">
                      <span>{{ scope.row.ftpPath }}</span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="任务书:">
                      <span style="cursor: pointer" @click="clickFileName(scope.row)">{{ scope.row.fileName }}</span>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
              <div class="moreRight">
                <el-table
                  :data="taskChildList"
                  size="mini"
                  border
                  :header-row-style="moreTableStyle"
                  :cell-style="moreTableStyle"
                >
                  <el-table-column label="子任务名称" prop="fSubTaskName"></el-table-column>
                  <el-table-column label="已推送/现有数据" prop="subTaskStatusDO1" width="80" align="center"></el-table-column>
                  <!--<el-table-column label="已推送景数/总景数" prop="subTaskStatusDO1" align="center"></el-table-column>-->
                  <el-table-column label="推送进度" width="120">
                    <template slot-scope="scope">
                      <el-progress :percentage="scope.row.myProcess.percent" :status="scope.row.myProcess.status"></el-progress>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column label="子任务状态" prop="fSubTaskStatus1"></el-table-column> -->
                  <el-table-column  prop="fSubTaskStatus1" :render-header="renderHeader"></el-table-column>
                  <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                      <el-button
                        size="mini"
                        @click="controlTask(scope.row, 8, 2)">
                        重新推送
                      </el-button>
                      <el-button
                        size="mini"
                        @click="lookDataModalBtn(scope.$index, scope.row)">
                        数据详情
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <page :total="totalSub" :pageSize="4" @currentChange="currentChangeChild"/>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column type="selection" min-width="30px"></el-table-column>
        <el-table-column label="序号" :show-overflow-tooltip="true" prop="index" min-width="35px"></el-table-column>
        <el-table-column label="任务名称" :show-overflow-tooltip="true" prop="fTaskName"></el-table-column>
        <el-table-column label="优先级" width="70"  :show-overflow-tooltip="true" prop="fOrder"></el-table-column>
        <el-table-column label="推送开始时间" :show-overflow-tooltip="true" prop="fDataStartTime"></el-table-column>
        <el-table-column label="推送结束时间" :show-overflow-tooltip="true" prop="fDataEndTime"></el-table-column>
        <el-table-column label="子任务数"   width="100" :show-overflow-tooltip="true" prop="subTaskCount" ></el-table-column>
        <el-table-column label="已推送/现有数据" :show-overflow-tooltip="true" prop="taskStatusDo1" ></el-table-column>
        <el-table-column label="推送进度" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-progress :percentage="scope.row.myProcess.percent" :status="scope.row.process.status ? scope.row.process.status : null "></el-progress>
          </template>
        </el-table-column>
        <el-table-column label="卫星类型" :show-overflow-tooltip="true" prop="fSatAll" min-width="50px"></el-table-column>
        <el-table-column label="任务状态" :show-overflow-tooltip="true" prop="fTaskStatus1" min-width="50px">
          <template slot-scope="props">
            {{ props.row.fTaskStatus1 }}
          </template>
        </el-table-column>
        <el-table-column label="任务创建时间" :show-overflow-tooltip="true" prop="fCreateTime" ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="operate">
              <!--<i class="el-icon-document" style="color:#6ac044;cursor:pointer" title="详情" @click="myEditTask(scope.row)"></i>-->
              <!--<i class="el-icon-video-pause" style="color:orange;cursor:pointer" title="暂停" @click="controlTask(scope.row, 4, 0)"></i>-->
              <!--<i class="el-icon-video-play" style="color:#3097f1;cursor:pointer" title="重启" @click="controlTask(scope.row, 6, 0)"></i>-->
              <i class="el-icon-edit" style="color:#3097f1;cursor:pointer" title="优先级" @click="modifyPriority(scope.row)"></i>
              <!--<i class="el-icon-switch-button" style="color:#3097f1;cursor:pointer" title="重发" @click="controlTask(scope.row, 8, 0)"></i>-->
              <!--<i class="el-icon-circle-close" style="color:#3097f1;cursor:pointer" title="终止" @click="controlTask(scope.row, 10, 0)"></i>-->
              <!--<i class="el-icon-folder-remove" style="color:#FF0000;cursor:pointer"  @click="delTask(scope.row, 12 , 0)" title="删除"></i>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <page :total="total" :pageSize="10" @currentChange="currentChangeTask"/>
    </el-table-column>
      <el-table-column label="序号" :show-overflow-tooltip="true" prop="index" min-width="30px" width="70"></el-table-column>
      <el-table-column
        label="用户名称"
        prop="fApplyuser">
      </el-table-column>
      <!-- <el-table-column
        label="单位名称"
        prop="fApplyuserunit">
      </el-table-column>
      <el-table-column
        label="联系方式"
        prop="fApplyuserphone">
      </el-table-column> -->
    </el-table>
    <page :total="total1" :pageSize="10" @currentChange="currentChangeTask1"/>
    <el-dialog
      title="任务优先级修改"
      :visible.sync="dialogVisible"
      width="20%">
      <el-form>
        <el-form-item label="优先级:">
          <el-input-number v-model="fOrder" controls-position="right" :min="1" :max="10"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="modifyPrio">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import http from '@comm/service/interface'
import page from '@comm/components/page'
import {mapActions} from 'vuex'
export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      fOrder: 1,
      UserId: '',
      dialogDataRow: {},
      row: {},
      rowID: '',
      currentPage: 1,
      currentPage1: 1,
      pageSize: 10,
      moreTableStyle: {background: '#f4f4f5'},
      tableData: [],
      tableData1: [
        // {fDistrictName: '江苏省环境监测中心', id: 1},
        // {fDistrictName: '陕西省环境监测中心', id: 2}
      ],
      taskChildList: [],
      expandKeys: [],
      total: 0,
      total1: 0,
      totalSub: 0,
      selectionArr: [],
      currentChildPage: 1,
      fSubTaskStatus: -1,
      fDistrictName1: '',
      userInfo: '',
      userRote: {}
    }
  },
  props: ['lookDataModal', 'editTask'],
  components: {page},
  watch: {},
  // created () {
  //   let _this = this
  //   _this.$nextTick(() => {
  //     _this.getTableData()
  //   })
  // },
  methods: {
    ...mapActions('searchStore', {
      setDataDitel: 'setDataDitel'
    }),
    // 任务列表翻页
    currentChangeTask (index) {
      this.currentPage = index
      this.getTableData(index)
    },
    // 单位列表分页
    currentChangeTask1 (index) {
      this.currentPage1 = index
      this.getTableData(index)
    },
    // 子任务列表翻页
    currentChangeChild (index) {
      this.currentChildPage = index
      this.getTaskChildList(index)
    },
    clickFileName (val) {
      if (val.filePath) {
        window.open(val.filePath, '_blank')
      }
    },
    // 任务列表勾选
    selectChange (selection) {
      this.selectionArr = selection
    },
    // 打开任务详情
    expandChange (row) {
      if (row.index === this.row.index) return
      this.$refs['cyTable'].toggleRowExpansion(this.row, false) // 设置只展开一行
      this.row = row
      this.getTaskChildList(1)
    },
    // 主任务列表
    expandChange1 (row) {
      let _this = this
      _this.fDistrictName1 = ''
      _this.fDistrictName1 = row.fDistrictName
      if (this.expandKeys.indexOf(row.id) >= 0) {
        // 收起当前行
        this.expandKeys.shift()
        return
      }
      if (row.id === this.rowID) return
      this.loading = true
      _this.rowID = ''
      _this.rowID = row.id
      let data = {}
      data = {
        fDataEndTime: '',
        fDataStartTime: '',
        fDistrictName: '',
        fTaskName: '',
        fTaskStatus: '',
        fDistrictCode: row.fDistrictCode,
        fUserId: row.fUserId
      }
      this.UserId = row.fUserId
      _this.getTableData(1, data)
    },
    // 定义子任务表头状态
    renderHeader (h, { column, $index }) {
      let _this = this
      window.changeStatue = (el) => {
        _this.fSubTaskStatus = el.value
        _this.$nextTick(() => _this.getTaskChildList(1))
      }
      return (
        <select size="1" onchange="changeStatue(this)">
          <option value="-1">全部</option>
          <option value="0">待推送</option>
          <option value="2">推送中</option>
          <option value="4">暂停</option>
          <option value="6">推送成功</option>
          <option value="8">推送失败</option>
        </select>
      )
    },
    // 子任务详情
    lookDataModalBtn (index, row) {
      let fSubTaskId = row.id
      let routeData = this.$router.resolve({
        path: '/manage/person/dataModal',
        query: {fSubTaskId, type: 'send'}
      })
      this.setDataDitel(1)
      this.$router.push(routeData.href)
    },
    // 获取任务列表
    getTableData (currentPage = 1, data = null, that) {
      data.fUserId = this.UserId
      let _this = this
      let obj = data ? {currentPage, pageSize: 10, data} : {currentPage, pageSize: 10}
      http.listTask(obj).then(res => {
        _this.total = res.data.total
        res.data.list.map((item, i) => {
          // item.fCreateTime = _this.formatTime(item.fCreateTime, 'Y-M-D h:m:s')
          // item.fDataStartTime = _this.formatTime(item.fDataStartTime, 'Y-M-D h:m:s')
          // item.fExecuteTime = _this.formatTime(item.fExecuteTime, 'Y-M-D h:m:s')
          // item.fDataEndTime = _this.formatTime(item.fDataEndTime, 'Y-M-D h:m:s')
          if (item.fCreateTime) {
            item.fCreateTime = item.fCreateTime.replace('T', ' ').slice(0, 19)
          } else {
            item.fCreateTime = '-'
          }
          if (item.fDataStartTime) {
            item.fDataStartTime = item.fDataStartTime.replace('T', ' ').slice(0, 10) + ' 00:00:00'
          } else {
            item.fDataStartTime = '-'
          }
          if (item.fExecuteTime) {
            item.fExecuteTime = item.fExecuteTime.replace('T', ' ').slice(0, 10) + ' 00:00:00'
          } else {
            item.fExecuteTime = '-'
          }
          if (item.fDataEndTime) {
            item.fDataEndTime = item.fDataEndTime.replace('T', ' ').slice(0, 10) + ' 00:00:00'
          } else {
            item.fDataEndTime = '-'
          }
          item.index = (_this.currentPage - 1) * _this.pageSize + i + 1
          item.subTaskCount = item.subTaskCount
          let {fTaskStatus, status} = _this.judgeStatus(item.fTaskStatus)
          item.fTaskStatus1 = fTaskStatus
          item.myProcess = {
            percent: item.process,
            status
          }
          item.taskStatusDo1 = item.taskStatusDo.fDataSuccess + '/' + item.taskStatusDo.fDataAll
          let fSatAll = item.taskSatDos.map(item => item.fSat)
          item.fSatAll = fSatAll.join(',')
        })
        _this.loading = false
        _this.expandKeys.shift()
        _this.expandKeys.push(_this.rowID)
        console.log(res.data.list, 'res.data.listCLL')
        this.tableData = res.data.list
        this.row = {}
      }).catch(err => {
        this.$message(err)
        _this.loading = false
      })
    },
    getTableData1 (currentPage = 1, data = null) {
      let _this = this
      if (!(this.userRote.roleIds[0].indexOf('管理员') > -1)) {
        if (data) {
          data.fUserId = this.userInfo.id
        } else {
          data = {
            fUserId: this.userInfo.id
          }
        }
      } else {
        if (data) {
          data.fUserId = ''
        } else {
          data = {
            fUserId: ''
          }
        }
      }
      let obj = data ? {currentPage, pageSize: 10, data} : {currentPage, pageSize: 10}
      http.listDepartment(obj).then(res => {
        _this.total1 = res.data.total
        res.data.list.map((item, i) => {
          item.index = (_this.currentPage - 1) * _this.pageSize + i + 1
        })
        this.tableData1 = res.data.list
        this.row = {}
      }).catch(err => {
        this.$message(err)
      })
    },
    // 获取子任务列表
    getTaskChildList (currentPage) {
      let obj = {
        currentPage,
        pageSize: 4,
        data: {
          fTaskId: this.row.id,
          fSubTaskStatus: this.fSubTaskStatus
        }
      }
      http.listByTaskId(obj).then(res => {
        console.log(res, 'wquie0ti3-0---')
        this.totalSub = res.data.total
        res.data.list.map(item => {
          let {fTaskStatus, status} = this.judgeStatus(item.fSubTaskStatus)
          item.fSubTaskStatus1 = fTaskStatus
          item.myProcess = {
            percent: item.process,
            status
          }
          item.subTaskStatusDO1 = item.subTaskStatusDO.fDataSuccess + '/' + item.subTaskStatusDO.fDataAll
        })
        this.taskChildList = res.data.list
        this.loading = false
      }).catch(err => {
        this.$message(err)
        this.loading = false
      })
    },
    // 编辑任务
    myEditTask (row) {
      this.$emit('editTask', row)
    },
    // 任务控制
    controlTask (list, operationCode, taskLevel) {
      this.loading = true
      list = list.constructor === Array ? list : [list]
      let recordInfos = []
      let sendFlag = true
      list.map(item => {
        let {id, fTaskStatus, fSubTaskStatus} = item
        fTaskStatus = fTaskStatus !== undefined ? fTaskStatus : fSubTaskStatus
        if (this.judgeOperationCode(fTaskStatus, operationCode)) {
          this.$message('此任务不能进行当前操作')
          sendFlag = false
          this.loading = false
        }
        let obj = {id, statusCode: fTaskStatus}
        recordInfos.push(obj)
      })
      if (sendFlag) {
        if (taskLevel === 2) {
          http.taskOperation({operationCode, taskLevel, recordInfos}).then(res => {
            this.$message({type: 'success', message: '操作成功'})
            this.getTaskChildList(this.currentChildPage)
          }).catch(err => {
            this.$message(err, '777')
          })
        } else {
          http.taskOperation({operationCode, taskLevel, recordInfos}).then(res => {
            this.$message({type: 'success', message: '操作成功'})
            let data = {}
            data = {
              fDataEndTime: '',
              fDataStartTime: '',
              fDistrictName: '',
              fTaskName: '',
              fTaskStatus: '',
              fDistrictCode: list[0].fDistrictCode,
              fUserId: list[0].fUserId
            }
            this.getTableData(1, data)
          }).catch(err => {
            this.$message(err)
          })
        }
      }
    },
    // 修改优先级
    modifyPriority (val) {
      this.dialogVisible = true
      this.dialogDataRow = val
      this.fOrder = val.fOrder
    },
    modifyPrio () {
      http.resetOrder({
        id: this.dialogDataRow.id,
        fOrder: this.fOrder
      }).then(res => {
        if (res.data) {
          this.$message({type: 'success', message: '操作成功'})
          let data = {}
          data = {
            fDataEndTime: '',
            fDataStartTime: '',
            fDistrictName: '',
            fTaskName: '',
            fTaskStatus: '',
            fDistrictCode: '',
            fUserId: this.dialogDataRow.fUserId
          }
          this.getTableData(1, data)
        } else {
          this.$message({type: 'error', message: '操作失败'})
        }
      })
      this.dialogVisible = false
    },
    // 删除一条任务
    // 删除一条任务
    delTask (list, operationCode, taskLevel) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.controlTask(list, operationCode, taskLevel)
      }).catch(() => {})
    },
    // 添加任务后更新任务列表
    updateTableData (data) {
      if (data && data.fDistrictName !== '' & (data.fTaskName === '' & data.fTaskStatus === '' & (data.fDataStartTime === '' || data.fDataStartTime === null) & (data.fDataEndTime === '' || data.fDataEndTime === null))) {
        this.getTableData1(1, data)
        this.getTableData(1, data)
      } else if (!data || (data.fDistrictName === '' & (data.fTaskName === '' & data.fTaskStatus === '' & (data.fDataStartTime === '' || data.fDataStartTime === null) & (data.fDataEndTime === '' || data.fDataEndTime === null)))) {
        this.getTableData1(1, data)
      } else {
        // if (data.fDistrictName === '') {
        //   data.fDistrictName = this.fDistrictName1
        //   this.getTableData(1, data)
        // } else {
        //   this.getTableData(1, data)
        // }
        data.fDistrictName = this.fDistrictName1
        this.getTableData(1, data)
      }
    },
    updateTableData1 (data) {
      this.getTableData1(1)
    },
    cellStyle ({row, column, rowIndex, columnIndex}) {
      return 'font-size:.25rem;font-weight: 600;color:#333333;height: 50px;line-height:50px;font-family:Arial-Black,Arial;'
    },
    rowClass ({row, rowIndex}) {
      return 'font-size:.3rem;font-weight: 600;color:#374156;background:#F5F5F5;height:45px;font-family:Arial-Black,Arial;'
    },
    // 判断任务是否可以进行当前操作
    judgeOperationCode (oldStatus, newStatus) {
      if (newStatus === 4 && oldStatus === 2) {
        return false
      } else if (newStatus === 6 && oldStatus === 4) {
        return false
      } else if (newStatus === 8 && (oldStatus === 2 || oldStatus === 8)) {
        return false
      } else if (oldStatus === 0 && newStatus === 12) {
        return false
      } else if ((oldStatus === 0 || oldStatus === 2 || oldStatus === 4 || oldStatus === 6 || oldStatus === 8 || oldStatus === 12) && newStatus === 10) {
        return false
      }
      return true
    },
    handlerClick (row) {
    },
    // 判断任务状态
    judgeStatus (fTaskStatus) {
      switch (fTaskStatus) {
        case 0:
          fTaskStatus = {
            fTaskStatus: '待推送',
            status: null
          }
          break
        case 2:
          fTaskStatus = {
            fTaskStatus: '推送中',
            status: null
          }
          break
        case 4:
          fTaskStatus = {
            fTaskStatus: '暂停',
            status: 'warning'
          }
          break
        case 6:
          fTaskStatus = {
            fTaskStatus: '推送成功',
            status: 'success'
          }
          break
        case 8:
          fTaskStatus = {
            fTaskStatus: '推送失败',
            status: 'exception'
          }
          break
        case 10:
          fTaskStatus = {
            fTaskStatus: '取消',
            status: null
          }
          break
        case 12:
          fTaskStatus = {
            fTaskStatus: '删除',
            statusPicc: null
          }
      }
      return fTaskStatus
    },
    getUserInfo () {
      http.userGetById().then(res => {
        this.userInfo = res.data
        console.log(this.userInfo, 'this.userInfo')
        let userID = JSON.parse(localStorage.getItem('principalUserID'))
        this.userRote = JSON.parse(userID.principal)
        this.getTableData1()
      })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style scoped lang="scss">
 .operate i {
   margin-left: 5px;
 }
 .el-form-item{
   margin-bottom: 0;
 }
 .moreLeft{
   float:left;
   width:40%;
 }
 .starList{
   height: 25px;
 }
 .starList span{
   margin-left: 5px;
 }
 .moreRight{
   width: 60%;
   float: left;
   background:#f4f4f5;
 }
 .moreContain{
   background:#f4f4f5;
   overflow: hidden;
   padding:10px;
   color:#3097f1;
 }
 .flexDiv{
   display: flex;
 }
 .el-form--inline .el-form-item{
   flex:1;
   overflow:hidden;
   text-overflow:ellipsis;
   white-space: nowrap;
 }
 .contentD>>>.el-table__expanded-cell{
   padding: 20px 20px !important;
 }
</style>
