<template>
  <div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      :key="timeKey"
      tooltip-effect="dark"
      style="width: 100%">
      <el-table-column
        prop="diskName"
        label="磁盘名称"
        align="center"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import http from '@comm/service/interface.js'
  export default {
    name: 'offLineDisk',
    data() {
      return {
        timeKey:'',
        tableData: []
      }
    },
    mounted() {
      this.getDiskList()
    },
    methods: {
      // 获取磁盘名称列表
      getDiskList() {
        http.offLineDiskList({}).then(res =>{
          this.tableData = res.data
        })
      }
    },
    watch:{
      tableData(){
        this.timeKey = new Date().getTime()
      }
    }
  }
</script>

<style scoped lang="scss">
  .conton_con {
    background: #fff;
    padding: 1vh 1vh 0 1vh;
    margin-bottom: 10px;
    border: 1px solid #edeff1;
    height: 9vh;
  }

  .echarts_con {
    padding: 10px;
    background: #fff;
    border: 1px solid #edeff1;
    /*margin-bottom: 20px;*/
  }

  .echarts_con > > > .el-tabs__content {
    background: #EDEEEE;
    /*height: 10vh;*/
    padding: 2vh;
  }

  .echarts_con > > > .el-tabs__header {
    margin: 0 !important;
    .el-tabs__item {
      font-weight: bold;
      color: #000 !important;
    }
  }

  .echarts_con > > > .el-tabs__nav-wrap::after {
    background: #fff !important;
  }

  .echarts_con > > > .el-tabs__nav-wrap {
    padding-left: 6vh !important;
  }
</style>
