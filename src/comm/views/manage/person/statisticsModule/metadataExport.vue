<template>
  <div>

    <div class="conton_con">
      <el-form :inline="true"
               class="demo-form-inline"
               style="margin: 0.2rem 0px;float: left;">
        <el-form-item label="统计时间范围" class="time_picke">
          <el-date-picker v-model="orderDate_0"
                          type="date"
                          style="width: 45%;"
                          placeholder="起始日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
          ></el-date-picker>
          <span> 至 </span>
          <el-date-picker v-model="orderDate_1"
                          type="date"
                          style="width: 45%;"
                          placeholder="结束日期"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div style="float: left; margin-top: 10px">
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="findOrderListByUser">查询
        </el-button>
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   v-show="this.activeName!=='second'"
                   @click="exportByUser"
                   v-loading.fullscreen.lock="fullscreenLoading">导出</el-button>
      </div>
    </div>
      <span>导出数据预览</span>
      <div class="tableDZ">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            prop="dataname"
            label="数据名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="producetime"
            label="产品时间"
            align="center"
            width="150"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="productid"
            label="产品号"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dataid"
            label="分表数据ID"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="productlevel"
            label="产品等级"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="satelliteid"
            label="卫星名称"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sensorid"
            label="传感器"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="cloudpercent"
            label="云量"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="sceneid"
            label="景号"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="scenepath"
            label="景PATH"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="scenerow"
            label="景ROW"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="receivetime"
            label="接收时间"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="importuser"
            label="入库人"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="importdate"
            label="入库时间"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="datasize"
            label="数据大小(MB)"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="datatypename"
            label="数据格式"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="location"
            label="分辨率"
            align="center"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="did"
            label="唯一ID"
            align="center"
            show-overflow-tooltip>
          </el-table-column>

        </el-table>
      </div>
  </div>
</template>

<script>
  import http from '@comm/service/interface.js'
  import leftData from './echartsShowD/leftData'
  import middleData from './echartsShowD/middleData'
  import rigthData from './echartsShowD/rigthData.vue'

  export default {
    name: 'ordercompStat',
    data() {
      return {
        fullscreenLoading: false,
        daochubuttonflag: true,
        orderDate_0: null,
        orderDate_1: null,
        activeName: 'first',
        activeName1:'third',
        echartsLeftData: {},
        echartsMiddleData: {},
        echartsRightData: {},
        tableData: []
      }
    },
    components: {
      leftData, middleData, rigthData
    },
    mounted() {
      if (this.$route.path.indexOf('metadataExport') > -1) {
        let date = new Date()
        let year1 = date.getFullYear()
        let firstMonth = year1 + '-' + '01' + '-' + '01'
        this.orderDate_0 = this.commonMethod.getDateTyPE(firstMonth)
        this.orderDate_1 = new Date(date.getTime())
        // console.log(this.orderDate_0, 'this.orderDate_0')
        // console.log(this.orderDate_1, 'this.orderDate_1')
        // this.getdataLeftEcharts([this.orderDate_0, this.orderDate_1])
      }
    },
    methods: {
      // 查询按钮
      findOrderListByUser() {
        http.getMetadata({startTime:this.orderDate_0,endTime:this.orderDate_1}).then(res=>{
          this.tableData = res.data
          // if (res.data.length > 0){
          //   console.log(res.data,"wwwwwwwwww")
          //   alert("有数据");
          // }
        })
      },
      //导出按钮
      exportByUser(){
        this.fullscreenLoading = true
        console.log(this.formatTime(this.orderDate_1, 'Y-M-D'),this.orderDate_1)
        http.metadataExport({
          startTime:this.orderDate_0,endTime:this.orderDate_1
        }).then(res=>{
          this.fullscreenLoading = false
          // loading.close();
          window.open(res.data, '_blank')
        })

      },
      exportdataLeftEcharts(){
        this.$refs.leftDataF.excelDown();
      },
      exportdataMiddleEcharts(){
        this.$refs.middleDataF.excelDown();
      },
      exportdataRightEcharts(){
        this.$refs.rightDataF.excelDown();
      },
      // 切换tab
      handleClick(val) {

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
