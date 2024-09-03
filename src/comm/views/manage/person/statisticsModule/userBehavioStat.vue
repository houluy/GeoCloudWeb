<template>
  <div>
    <div class="echarts_con">
      <div :class="{echarts_con_z_one: index === 0}" class="echarts_con_z" v-for="(item, index) in todayD" :key="index">
        <div class="con_label">{{item.label}}</div>
        <div :class="{one_value1_active: index > 0}" class="one_value1">{{item.value1}}</div>
        <div class="two_value1">{{item.value2}}</div>
      </div>
    </div>
    <div class="conton_con">
      <el-form :inline="true"
               class="demo-form-inline"
               style="float: left;">
        <el-form-item label="统计时间范围" class="time_picke">
          <el-date-picker v-model="orderDate_0"
                          type="datetime"
                          style="width: 45%;"
                          default-time="00:00:00"
                          placeholder="起始日期">
          </el-date-picker>
          <span> 至 </span>
          <el-date-picker v-model="orderDate_1"
                          type="datetime"
                          style="width: 45%;"
                          default-time="23:59:59"
                          placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-form>
      <div style="float: left;">
        <el-button style="margin: 0 0 0 .2rem;"
                   type="primary"
                   @click="getDataInit">查询</el-button>
      </div>
      <div class="time_select">
        <span @click="clickSpanL(item.index)" :class="{BotLeftTopMS: true, BotLeftTopMSZ: item.index === '1', BotLeftTopMSY: item.index === '4', active: indexL=== item.index}" v-for="(item, index) in spanData" :key="index">{{item.label}}</span>
      </div>
    </div>
    <div class="content_con_echart">
      <div class="content_con_echart_top">
        <div>
          <div class="content_con_echart_titel">趋势图 </div>
          <div class="time_select_two">
            <span @click="clickSpanLTwo(item.index)" :class="{BotLeftTopMS: true, BotLeftTopMSZ: item.index === 0, BotLeftTopMSY: item.index === 2, active: indexLTwo=== item.index}" v-for="(item, index) in spanDataTwo" :key="index">{{item.label}}</span>
          </div>
          <div style="text-align: right">
            <span>对比：</span>
            <template>
              <el-radio-group @change="changeRadioD" v-model="radio">
                <el-radio :label="1">前一日</el-radio>
                <el-radio :label="2">上周同期</el-radio>
              </el-radio-group>
            </template>
          </div>
        </div>
        <div style="height: 47vh;" id="userAnalay"></div>
      </div>
    </div>
    <div class="content_con_echart_two">
      <div class="content_con_echart_table">
        <template>
          <el-table
            :data="tableData"
            stripe
            :height="heightInt"
            style="width: 100%">
            <el-table-column
              prop="time"
              label="时间">
            </el-table-column>
            <el-table-column
              prop="browsenum"
              label="浏览量">
            </el-table-column>
            <el-table-column
              prop="visitornum"
              label="访问次数">
            </el-table-column>
            <el-table-column
              label="平均访问时间(分)">
              <template slot-scope="scope">
                <span>{{scope.row.browsenum===0?0: parseInt(scope.row.timelength /60)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import AnalayEchartD from './userBehAnalayStat/AnalayEchartD.vue'
export default {
  name: 'userBehavioStat',
  data () {
    return {
      orderDate_0: '',
      orderDate_1: '',
      indexL: '3',
      indexLTwo: 0,
      radio: '1',
      activeName: 'first',
      datatypeD: '项目统计',
      options: [
        {
          value: '项目统计',
          label: '项目统计'
        }, {
          value: '总量统计',
          label: '总量统计'
        }
      ],
      spanData: [
        {
          label: '今天',
          index: '1'
        },
        {
          label: '昨天',
          index: '2'
        },
        {
          label: '最近7天',
          index: '3'
        },
        {
          label: '最近30天',
          index: '4'
        }
      ],
      spanDataTwo: [
        {
          label: '浏览量(PV)',
          index: 0
        },
        {
          label: '访客数(UV)',
          index: 1
        },
        {
          label: '平均访问时长',
          index: 2
        }
      ],
      spanDataType: [
        {
          label: '(次)',
          index: 0
        },
        {
          label: '(次)',
          index: 1
        },
        {
          label: '(分)',
          index: 2
        }
      ],
      todayD: [
        {
          label: '',
          value1: '今日',
          value2: '昨日'
        },
        {
          label: '浏览量(PV)',
          value1: '12',
          value2: '12'
        },
        {
          label: '访客数(UV)',
          value1: '111',
          value2: '1111'
        },
        {
          label: '平均访问时长',
          value1: '09:00',
          value2: '10:00'
        }
      ],
      heightInt: 0,
      tableData: [],
      echartsData: [[], [], [], [], '', ''],
      echartsData1: [[], [], [], [], '', ''],
      echartsData2: [[], [], [], [], '', ''],
      echartsData3: ['', '']
    }
  },
  components: {
    AnalayEchartD
  },
  created () {
    this.heightInt = document.documentElement.clientHeight * 0.51
  },
  mounted () {
    // 今天昨天初始化+前一天对比
    this.getTodayAndYCount()
    this.getDataInitDay('3')
  },
  methods: {
    getDataInit () { 
      this.radio = ''
      this.indexL = ''
      if (this.orderDate_0 !== '' && this.orderDate_1 !== '') {
        http.postUserBrowseList({
          statisType: '',
          statisStartTime: this.commonMZ.timestampToTimeD(this.orderDate_0),
          statisEndTime: this.commonMZ.timestampToTimeD(this.orderDate_1),
          compareType: ''
        }).then(res => {
          if (res.data.curList) {
            this.tableData = res.data.curList
            this.tableData.forEach(item =>{
              if(item.timelength + 1 > 86401){
                item.timelength = 86401 + ''
              }
            })
            this.getEchartsData(this.tableData)
          }
        })
      } else {
        this.$message({
          message: '请选择闭合时间段！',
          type: 'warning'
        })
      }
    },
    getDataInitDay (val) {
      this.radio = ''
      this.orderDate_0 = ''
      this.orderDate_1 = ''
      http.postUserBrowseList({
        statisType: val,
        statisStartTime: '',
        statisEndTime: '',
        compareType: ''
      }).then(res => {
        if (res.data.curList) {
          this.tableData = res.data.curList
            this.tableData.forEach(item =>{
              if(item.timelength + 1 > 86401){
                item.timelength = 86401 + ''
              }
            })
          this.getEchartsData(this.tableData)
        }
      })
    },
    getTodayAndYCount () {
      http.postUserBrowseCount().then(res => {
        if (res.data.curList) {
          this.todayD[1].value1 = res.data.curList[0].browsenum
          this.todayD[2].value1 = res.data.curList[0].visitornum
          this.todayD[3].value1 = this.commonMZ.timeStamp(res.data.curList[0].timelength)
          this.todayD[1].value2 = res.data.prvList[0].browsenum
          this.todayD[2].value2 = res.data.prvList[0].visitornum
          this.todayD[3].value2 = this.commonMZ.timeStamp(res.data.prvList[0].timelength)
        }
      })
    },
    initDataechart (val) {
      let myChart = this.$echarts.init(document.getElementById('userAnalay'))
      const option = {
        // title: {
        //   text: '堆叠区域图'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        // legend: {
        //   data: ['邮件营销', '联盟广告']
        // },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          top: '6%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: val.data1[3]
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: val.data1[5],
            nameLocation: 'start',
            nameTextStyle: {
              padding: [-20, 0, 0, -80]
            }
          }
        ],
        series: [
          {
            name: val.data1[4],
            type: 'line',
            // stack: '总量',
            // smooth: true,
            areaStyle: {
              normal: {
                color: '#FFFFFF' // 改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: '#4FA8F9' // 柱状颜色
              },
              lineStyle: {
                color: '#4FA8F9'
              }
            },
            data: val.data
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true)
      // 根据窗口的大小变动图表
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    initDataechartDb (val) {
      let myChart = this.$echarts.init(document.getElementById('userAnalay'))
      const option = {
        // title: {
        //   text: '堆叠区域图'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function (params) {
            console.log(params, 'params')
            let arrJson = ['00:00 - 00:59',
              '01:00 - 01:59',
              '02:00 - 02:59',
              '03:00 - 03:59',
              '04:00 - 04:59',
              '05:00 - 05:59',
              '06:00 - 06:59',
              '07:00 - 07:59',
              '08:00 - 08:59',
              '09:00 - 09:59',
              '10:00 - 10:59',
              '11:00 - 11:59',
              '12:00 - 12:59',
              '13:00 - 13:59',
              '14:00 - 14:59',
              '15:00 - 15:59',
              '16:00 - 16:59',
              '17:00 - 17:59',
              '18:00 - 18:59',
              '19:00 - 19:59',
              '20:00 - 20:59',
              '21:00 - 21:59',
              '22:00 - 22:59',
              '23:00 - 23:59'
            ]
            let htmlStr = '<div>'
            htmlStr += arrJson[parseInt(params[0].name)] + ': ' + '<br/>'// x轴的名称
            params.forEach(item => {
              htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + item.color + ';"></span>' + item.seriesName + ':' + item.value + '<br/>'
            })
            htmlStr += '</div>'
            return htmlStr
          }
        },
        // legend: {
        //   data: ['邮件营销', '联盟广告']
        // },
        // toolbox: {
        //     feature: {
        //         saveAsImage: {}
        //     }
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '13%',
          top: '6%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: val.data2[3]
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: val.data2[5],
            nameLocation: 'start',
            nameTextStyle: {
              padding: [-20, 0, 0, -80]
            }
          }
        ],
        series: [
          {
            name: val.data3[0],
            type: 'line',
            // stack: '总量',
            // smooth: true,
            areaStyle: {
              normal: {
                color: '#FFFFFF' // 改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: '#4FA8F9' // 柱状颜色
              },
              lineStyle: {
                color: '#4FA8F9'
              }
            },
            data: val.data
          },
          {
            name: val.data3[1],
            type: 'line',
            // stack: '总量',
            // smooth: true,
            areaStyle: {
              normal: {
                color: '#E5F2FE' // 改变区域颜色
              }
            },
            itemStyle: {
              normal: {
                color: '#B9DCFD' // 柱状颜色
              },
              lineStyle: {
                color: '#B9DCFD'
              }
            },
            data: val.data1
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true)
      // 根据窗口的大小变动图表
      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    clickSpanL (val) {
      this.indexL = val
      this.getDataInitDay(val)
    },
    clickSpanLTwo (val) {
      this.indexLTwo = val
      this.echartsData[4] = this.spanDataTwo[this.indexLTwo].label
      this.echartsData[5] = this.spanDataType[this.indexLTwo].label
      this.echartsData1[4] = this.spanDataTwo[this.indexLTwo].label
      this.echartsData1[5] = this.spanDataType[this.indexLTwo].label
      if (this.radio === '') {
        this.initDataechart({
          data: this.echartsData[this.indexLTwo],
          data1: this.echartsData
        })
      } else {
        console.log(this.echartsData1, 'this.echartsData1this.echartsData1')
        this.initDataechartDb({
          data: this.echartsData1[this.indexLTwo],
          data1: this.echartsData2[this.indexLTwo],
          data2: this.echartsData1,
          data3: this.echartsData3
        })
      }
    },
    changeRadioD () {
      this.orderDate_0 = ''
      this.orderDate_1 = ''
      this.postUserBrowseD(this.radio)
    },
    getTimeD (nowDayOfWeek) {
      var res = []
      var now = new Date()
      // var nowDayOfWeek = now.getDay() // 今天本周的第几天
      res[0] = this.timestampToTimeAll(now.getTime() - 3600 * 1000 * 24 * nowDayOfWeek, 1)
      res[1] = this.timestampToTimeAll(now.getTime(), 0)
      return res
    },
    timestampToTimeAll (timestamp, index) {
      if (timestamp) {
        var date = new Date(timestamp)
        // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-'
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
        var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
        if (index === 1) {
          return Y + M + D + ' ' + '00:00:00'
        } else {
          return Y + M + D + ' ' + h + m + s
        }
      } else {
        return '-'
      }
    },
    getEchartsData (param) {
      this.echartsData = [[], [], [], [], '', '']
      if (param.length > 0) {
        param.forEach(item => {
          this.echartsData[0].push(item.browsenum)
          this.echartsData[1].push(item.visitornum)
          // this.echartsData[2].push(parseInt(item.timelength / 60))
          this.echartsData[2].push(item.browsenum===0?0: parseInt(item.timelength / 60))
          this.echartsData[3].push(item.time)
        })
        this.echartsData[4] = this.spanDataTwo[this.indexLTwo].label
        this.echartsData[5] = this.spanDataType[this.indexLTwo].label
        this.initDataechart({
          data: this.echartsData[this.indexLTwo],
          data1: this.echartsData
        })
      }
    },
    getEchartsDataDb (param) {
      this.echartsData1 = [[], [], [], [], '', '']
      this.echartsData2 = [[], [], [], [], '', '']
      if (param.curList.length > 0) {
        param.curList.forEach((item, index) => {
          this.echartsData1[0].push(item.browsenum)
          this.echartsData1[1].push(item.visitornum)
          // this.echartsData1[2].push(parseInt(item.timelength / 60))
          this.echartsData1[2].push(item.browsenum===0?0: parseInt(item.timelength / 60 / item.browsenum))
          this.echartsData1[3].push(index)
        })
        this.echartsData1[4] = this.spanDataTwo[this.indexLTwo].label
        this.echartsData1[5] = this.spanDataType[this.indexLTwo].label
      }
      if (param.prvList.length > 0) {
        param.prvList.forEach((item, index) => {
          this.echartsData2[0].push(item.browsenum)
          this.echartsData2[1].push(item.visitornum)
          // this.echartsData2[2].push(parseInt(item.timelength / 60))
          this.echartsData1[2].push(item.browsenum===0?0: parseInt(item.timelength / 60 / item.browsenum))
          this.echartsData2[3].push(index)
        })
        this.echartsData2[4] = this.spanDataTwo[this.indexLTwo].label
        this.echartsData2[5] = this.spanDataType[this.indexLTwo].label
      }
    },
    postUserBrowseD (val) {
      http.postUserBrowseList({
        statisType: '',
        statisStartTime: '',
        statisEndTime: '',
        compareType: val
      }).then(res => {
        if (res.data.curList) {
          this.getEchartsDataDb(res.data)
          console.log(this.echartsData1, 'this.echartsData1')
          console.log(this.echartsData2, 'this.echartsData2')
          this.echartsData3 = [res.data.curTime, res.data.prvTime]
          this.initDataechartDb({
            data: this.echartsData1[this.indexLTwo],
            data1: this.echartsData2[this.indexLTwo],
            data2: this.echartsData1,
            data3: this.echartsData3
          })
        }
      })
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
    height: 5.4vh;
    margin-top: 2vh;
  }
  .echarts_con {
    height: 10vh;
    padding: 10px;
    line-height: 25px;
    background: #fff;
    border: 1px solid #edeff1;
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
  .BotLeftTopMS{
    line-height: 4vh;
    display: inline-block;
    /*width: 3.5vw;*/
    padding: 0 10px;
    font-size: 12px;
    /*color: #BABABA;*/
    border: solid 1px #BABABA;
    border-left: none;
    text-align: center;
    float: left;
    cursor: pointer;
    min-width: 50px;
  }
  .BotLeftTopMSY{
    border-radius: 0 5px 5px 0 !important;
  }
  .BotLeftTopMSZ{
    border-left: solid 1px #BABABA;
    border-radius: 5px 0 0 5px !important;
  }
  .active{
    border: solid 1px #4B93EE !important;
    background-color: #4B93EE !important;
    color: #fff !important;
  }
  .time_select{
    float: left;
    margin-left: 3%;
    margin-right: 1%;
    /*margin-top: 10px;*/
  }
  .time_select_two{
    /*float: left;*/
    margin-left: 3%;
    margin-right: 1%;
  }
  .content_con_echart{
    height: 51vh;
    padding: 10px;
    line-height: 25px;
    background: #fff;
    border: 1px solid #edeff1;
    width: 68%;
    float: left;
  }
  .content_con_echart_two{
    padding: 10px;
    line-height: 25px;
    background: #fff;
    border: 1px solid #edeff1;
    width: 27.5%;
    float: left;
    height: 51vh;
    margin-left: 1%;
  }
  .echarts_con_z{
    float: left;
    width: 20%;
    text-align: right;
  }
  .echarts_con_z_one{
    width: 10% !important;
  }
  .con_label{
    padding-right: 20px;
    height: 4vh;
  }
  .one_value1_active{
    color: #111314;
    font-size: 17px;
    font-weight: bolder;
  }
  .one_value1{
    padding-right: 20px;
    border-right: 1px solid #f0f0f0;
  }
  .two_value1{
    padding-right: 20px;
    border-right: 1px solid #f0f0f0;
  }
  .content_con_echart_titel{
    font-weight: 700;
    font-size: 14px;
    margin-left: 3%;
    margin-bottom: 10px;
  }
  .content_con_echart{
    height: 51vh;
  }
  .content_con_echart_top{
    height: 50vh;
    float: left;
    width: 100%;
  }
  .content_con_echart_table{
    /*padding: 10px;*/
    overflow: auto;
  }
  .content_con_echart_table>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
  }
  .content_con_echart_table>>>.el-table th{
    text-align: center !important;
  }
  .content_con_echart_table>>>.el-table td{
    text-align: center !important;
  }
  /*.content_con_echart_table{*/
  /*!*min-height: 87%;*!*/
  /*border: 1px solid #E2E7EF;*/
  /*background: #fff;*/
  /*}*/
</style>
