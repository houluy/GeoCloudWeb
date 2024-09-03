<template>
  <div ref="dataTaskcl" class="dataTaskcl" style="">
    <div :class="{active_form: this.dataStatusIndex === ''}" class="fromZ active_form">
      <el-form :inline="true"
               class="demo-form-inline"
               style="    width: 86%; display: inline-block;">
        <el-form-item class="time_form" label="订单编号">
          <el-autocomplete
            class="inline-input"
            v-model="dataNumber"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入编号"
            :trigger-on-focus="false"
            @focus="handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item class="time_form" label="申请单位">
          <el-autocomplete
            class="inline-input"
            v-model="applicant"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入单位"
            :trigger-on-focus="false"
            @focus="handleSlideInCom(1)"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item class="time_form" label="申请人">
          <el-input v-model="usernamevalue" placeholder="请输入申请人"></el-input>
        </el-form-item>
        <el-form-item class="time_form" label="订购账号">
          <el-input @change="getUsernameNum" v-model="usernameNum" placeholder="请输入订购账号"></el-input>
        </el-form-item>
        <el-form-item label="订购时间" class="time_picke">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="OrderEndTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div style="display: inline-block; margin-top: 15px;">
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="findOrderListByUser">查询
        </el-button>
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="emptyData">重 置
        </el-button>
      </div>
    </div>
    <div class="tableDZ">
      <el-table
        ref="dataTaskTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          prop="tasknum"
          label="任务编号"
          align="center"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#3C6EF0;">{{ scope.row.ordername }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="homeworkname"
          label="作业名称"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="taskdate"
          label="任务日期"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="taskrequire"
          label="任务要求"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="associateorders"
          label="关联订单"
          align="center"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          v-if="this.orderStatusIndex !== -1"
          label="订单状态"
          align="center"
          :formatter="statusConverter">
          <template slot-scope="scope">
            <span
              :class="{colorindexO: scope.row.sstatus === 2 || scope.row.sstatus === 5, colorindexT: scope.row.sstatus === 3, colorindexTh: true }">{{
                scope.row.statusLabel
              }}</span>
          </template>
          <span></span>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <span v-if="hasPerm('/group/updateById')" @click="handleEdit(scope.row)"
                  style="cursor: pointer;display: inline-block;">
              <img src="@/assets/images/manage/edit.png" title="修改" alt="">
            </span>
            <span v-if="hasPerm('/group/updateGroupRights')" @click="handlePermission(scope.row)"
                  style="cursor: pointer;display: inline-block;">
              <img src="@/assets/images/manage/power.png" title="权限" alt="">
            </span>
            <span v-if="hasPerm('/group/removeById')" @click="handleDelete(scope.row)"
                  style="cursor: pointer;display: inline-block;">
              <img src="@/assets/images/manage/del.png" title="删除" alt="">
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationAnddeleteButton">
        <div class="deleteButton">
          <el-button style="margin-left: .1rem;"
                     size="mini"
                     @click="deleteAllData"
                     type="primary"><i style="margin-right: 8px;" class="el-icon-delete"></i>批量删除
          </el-button>
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
      </div>
    </div>
    <el-dialog class="elDialog_Aduti" :title="title" :visible.sync="dialogVisible" width="7rem">
      <span>
        <div>
              <el-input :rows="4"
                        :disabled="true"
                        type="textarea"
                        v-model="inputFeekBack"></el-input>
        </div>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   type="primary"
                   @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import http from '@comm/service/interface.js'

export default {
  data() {
    return {
      GroupNameList: [],
      OrderNameList: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      OrderStartTime: [],
      OrderEndTime: [],
      name: "dataTask"
    }
  }
}
</script>

<style scoped>
.fromZ {
  background: #fff;
  padding-left: 10px;
  margin-bottom: 10px;
  padding-top: 17px;
  border: 1px solid #edeff1;
}

.active_form {
  padding-top: 16px;
}

.tableDZ {
  padding: 10px;
  background: #fff;
  border: 1px solid #edeff1;
  margin-bottom: 20px;
}

.dataTaskcl {
  height: 100%;
}

.orderButton {
  text-align: left;
  width: 100%;
  margin-bottom: 0.2rem;
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

.userShow {
  position: absolute;
  left: 1rem;
  /* width:30%; */
  margin-top: 0.2rem;
  top: 9.6rem;
}

.el-checkbox {
  margin-right: 10px;
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

.personCenter_right_t {
  height: 4vh;
  line-height: 2vh;
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

.time_picke {
  /*width: 47%;*/
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
  padding: 10px !important;
  text-align: center !important;
}

</style>
