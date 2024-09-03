<template>
  <div class="taskMonitoring">
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="taskName"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="executingState"
        label="当前执行状态">
      </el-table-column>
      <el-table-column
        prop="synchronizationTime"
        label="最近同步时间">
      </el-table-column>
      <el-table-column
        prop="dataSize"
        label="最近一次同步数据量">
      </el-table-column>
      <el-table-column
        prop="errorTime"
        label="最近一次同步出错时间">
      </el-table-column>
      <el-table-column
        prop="addSize"
        label="累计同步数据量">
      </el-table-column>
      <el-table-column
        prop="errorDataSize"
        label="累计错误数据量">
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
export default {
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    handleCurrentChange (val) {
      console.log(val)
    },
    initTable () {
      http.taskMonitoring({}).then(res => {
        console.log(res)
      })
    }
  },
  mounted () {
    this.initTable()
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';
.taskMonitoring{
  padding: .5rem;
  .pagination{
    width: 100%;
    text-align: right;
    margin-top: .2rem;
  }
}
</style>
