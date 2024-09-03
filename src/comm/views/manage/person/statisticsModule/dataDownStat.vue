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
        <el-form-item label="统计类型" class="time_picke">
          <el-select @change="handleClick" v-model="datatypeD" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="float: left; margin-top: 10px">
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="findOrderListByUser">查询</el-button>
      </div>
    </div>
    <div class="echarts_con">
      <proDataStat :echartsProData ='echartsProData' v-if="datatypeD === '总量统计'"></proDataStat>
      <totalDataStat :echartsTotalData ='echartsTotalData' v-if="datatypeD !== '总量统计'"></totalDataStat>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import proDataStat from './dataDowncom/proDataStat.vue'
import totalDataStat from './dataDowncom/totalDataStat.vue'
export default {
  name: 'dataDownStat',
  data () {
    return {
      echartsProData: [],
      echartsTotalData: [],
      orderDate_0: '',
      orderDate_1: '',
      activeName: 'first',
      datatypeD: '总量统计',
      options: [{
        value: '总量统计',
        label: '总量统计'
      }, {
        value: '用途统计',
        label: '用途统计'
      }]
    }
  },
  components: {
    proDataStat, totalDataStat
  },
  mounted () {
    this.initTime()
    if (this.$route.path.indexOf('dataDownStat') > -1) {
      this.getProDataEcharts([this.orderDate_0, this.orderDate_1])
    }
  },
  methods: {
    initTime () {
      const end = new Date()
      const start = new Date()
      end.setTime(start.getTime() - start.getHours() * 3600 * 1000 - start.getMinutes() * 60 * 1000 - start.getSeconds() * 1000)
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 - start.getHours() * 360 * 10000 - start.getMinutes() * 60 * 1000 - start.getSeconds() * 1000)
      this.orderDate_0 = start
      this.orderDate_1 = end
    },
    findOrderListByUser () {
      if (this.datatypeD === '总量统计') {
        this.getProDataEcharts([this.orderDate_0, this.orderDate_1])
      } else {
        this.getTotalDataEcharts([this.orderDate_0, this.orderDate_1])
      }
    },
    getProDataEcharts (timeParam) {
      http.getOrderNumByDay({data: {
        lessCreattime: timeParam.length === 0 ? null : timeParam[0],
        moreCreattime: timeParam.length === 0 ? null : timeParam[1],
        lessCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[0]),
        moreCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[1])
      }}).then(res => {
        let allSize = 0
        let allNum = 0
        let timeArry = []
        let sizeArry = []
        let numArry = []
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            item.datadownSize = ((parseFloat(item.datadownSize) / 1024 / 1204)).toFixed(2)
            allSize += Number(item.datadownSize)
            allNum += parseInt(item.datadownNum)
            sizeArry.push(item.datadownSize)
            numArry.push(item.datadownNum)
            timeArry.push(item.time)
          })
          this.echartsProData = [sizeArry, numArry, timeArry, allSize.toFixed(2), allNum, res.data]
        } else {
          this.echartsProData = []
        }
      })
    },
    getTotalDataEcharts (timeParam) {
      http.getOrderNumByApplyUserUsed({data: {
        lessCreattime: timeParam.length === 0 ? null : timeParam[0],
        moreCreattime: timeParam.length === 0 ? null : timeParam[1],
        lessCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[0]),
        moreCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[1])
      }}).then(res => {
        let allSize = 0
        let allNum = 0
        let timeArry = []
        let sizeArry = []
        let numArry = []
        if (res.data && res.data.length > 0) {
          res.data.forEach(item => {
            item.datadownSize = ((parseFloat(item.datadownSize) / 1024 / 1204)).toFixed(2)
            allSize += Number(item.datadownSize)
            allNum += parseInt(item.datadownNum)
            sizeArry.push(item.datadownSize)
            numArry.push(item.datadownNum)
            timeArry.push(item.applyUserUsed)
          })
          this.echartsTotalData = [sizeArry, numArry, timeArry, allSize.toFixed(2), allNum, res.data]
        } else {
          this.echartsTotalData = []
        }
      })
    },
    handleClick () {
      if (this.datatypeD === '总量统计') {
        this.getProDataEcharts([this.orderDate_0, this.orderDate_1])
      } else {
        this.getTotalDataEcharts([this.orderDate_0, this.orderDate_1])
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .conton_con{
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
  .echarts_con >>>.el-tabs__content{
    background: #EDEEEE;
    /*height: 10vh;*/
    padding: 2vh;
  }
  .echarts_con >>>.el-tabs__header{
    margin: 0 !important;
  }
  .echarts_con >>>.el-tabs__nav-wrap::after{
    background: #fff !important;
  }
  .echarts_con >>>.el-tabs__nav-wrap{
    padding-left: 6vh !important;
  }
</style>
