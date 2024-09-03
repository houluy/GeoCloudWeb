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
          ></el-date-picker>
          <span> 至 </span>
          <el-date-picker v-model="orderDate_1"
                          type="date"
                          style="width: 45%;"
                          placeholder="结束日期"
                          format="yyyy-MM-dd"
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
                   @click="exportByUser">导出</el-button>
      </div>
    </div>
    <div class="echarts_con">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="概况" name="first">
          <leftData ref="leftDataF" :echartsLeftData='echartsLeftData'></leftData>
        </el-tab-pane>
        <el-tab-pane label="月度统计" name="third">
          <middleData ref="middleDataF" :echartsMiddleData='echartsMiddleData'></middleData>
        </el-tab-pane>
        <el-tab-pane label="服务单位" name="second">
          <rigthData ref="rigthDataF" :echartsRightData="echartsRightData"></rigthData>
        </el-tab-pane>
      </el-tabs>
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
        daochubuttonflag: true,
        orderDate_0: null,
        orderDate_1: null,
        activeName: 'first',
        activeName1:'third',
        echartsLeftData: {},
        echartsMiddleData: {},
        echartsRightData: {}
      }
    },
    components: {
      leftData, middleData, rigthData
    },
    mounted() {
      if (this.$route.path.indexOf('ordercompStat') > -1) {
        let date = new Date()
        let year1 = date.getFullYear()
        let firstMonth = year1 + '-' + '01' + '-' + '01'
        this.orderDate_0 = this.commonMethod.getDateTyPE(firstMonth)
        this.orderDate_1 = new Date(date.getTime())
        console.log(this.orderDate_0, 'this.orderDate_0')
        console.log(this.orderDate_1, 'this.orderDate_1')
        this.getdataLeftEcharts([this.orderDate_0, this.orderDate_1])
      }
    },
    methods: {
      // 查询按钮
      findOrderListByUser() {
        if (this.activeName === 'first') {
          this.getdataLeftEcharts([this.orderDate_0, this.orderDate_1])
        }else if (this.activeName1 === 'third') {
          this.getdataMiddleEcharts([this.orderDate_0, this.orderDate_1])
        }
        else{
          this.getdataRightEcharts([this.orderDate_0, this.orderDate_1])
        }
      },
      //导出按钮
      exportByUser(){
        if (this.activeName === 'first') {
          this.exportdataLeftEcharts()
        }else if (this.activeName1 === 'third') {
          this.exportdataMiddleEcharts()
        }
        else{
          this.exportdataRightEcharts()
        }
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
      // 总量tab
      getdataLeftEcharts(timeParam) {
        http.getOrderNumByOLNew({
          data: {
            lessCreattime: timeParam.length === 0 ? null : timeParam[0],
            moreCreattime: timeParam.length === 0 ? null : timeParam[1],
            lessCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[0]),
            moreCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[1])
          }
        }).then(res => {
          if (res.data) {
            this.echartsLeftData = res.data
          } else {
            this.echartsLeftData = {}
          }
        })
      },
      // 月度统计
      getdataMiddleEcharts(timeParam) {
        http.agrsGetOrderNumByMonth({
          data: {
            lessCreattime: timeParam.length === 0 ? null : timeParam[0],
            moreCreattime: timeParam.length === 0 ? null : timeParam[1],
            lessCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[0]),
            moreCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[1])
          }
        }).then(res => {
          if (res.data) {
            this.echartsMiddleData = res.data
          } else {
            this.echartsMiddleData = {}
          }
        })
      },
      // 服务单位tab
      getdataRightEcharts(timeParam) {
        http.getOrderNumByUnit({
          data: {
            lessCreattime: timeParam.length === 0 ? null : timeParam[0],
            moreCreattime: timeParam.length === 0 ? null : timeParam[1],
            lessCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[0]),
            moreCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[1])
          }
        }).then(res => {
          let arry = []
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              if (item.onlineOrderNum !== '0' || item.offlineOrderNum !== '0') {
                item.allNum = parseInt(item.offlineOrderNum) + parseInt(item.onlineOrderNum)
                item.allSize = ((parseFloat(item.offlineOrderSize) + parseFloat(item.onlineOrderSize)) / 1024 / 1024).toFixed(2)
                item.offlineOrderSize = ((parseFloat(item.offlineOrderSize) / 1024 / 1024)).toFixed(2)
                item.onlineOrderSize = ((parseFloat(item.onlineOrderSize) / 1024 / 1024)).toFixed(2)
                arry.push(item)
              }
            })
            this.echartsRightData = arry
          } else {
            this.echartsRightData = []
          }
        })
      },
      // 切换tab
      handleClick(val) {
        if (val.name === 'first') {
          this.getdataLeftEcharts([this.orderDate_0, this.orderDate_1])
        } else if (val.name === 'third') {
          this.getdataMiddleEcharts([this.orderDate_0, this.orderDate_1])
        } else if(val.name === 'second'){
          this.getdataRightEcharts([this.orderDate_0, this.orderDate_1])
        }
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
