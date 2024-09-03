<template>
  <left-main-layout class="logContent" :routerList="routerList" >
    <div slot="left" style="height: 100%;
    width: 100%;
    display: inline-block;
    background-color: rgb(255, 255, 255);
    border-radius: 4px 3px 4px 4px;
    border: 1px solid rgba(223,229,249,1);" >
      <el-menu
        ref="logElMenu"
        default-active="3"
        class="el-menu-vertical-demo logElMenu"
        @select="handleSelect"
        text-color="#868A90"
        active-text-color="#0099FA"
        style="border: none;"
      >
        <el-menu-item style="padding: 0px;" index="f_logorigin" v-if="hasPerm('/log/logSourcesStatics')">
          <span :class="{spanColor: statisticType === 'f_logorigin', spanIcon: true} "></span>
          <i class="el-icon-location"></i>
          <span slot="title">来源统计</span>
        </el-menu-item>
        <el-menu-item style="padding: 0px;" index="l.f_type" v-if="hasPerm('/log/logTypeStatics')">
          <span :class="{spanColor: statisticType === 'l.f_type', spanIcon: true} "></span>
          <i class="el-icon-menu"></i>
          <span slot="title">类型统计</span>
        </el-menu-item>
        <el-menu-item style="padding: 0px;" index="f_userid" disabled v-if="hasPerm('/log/logUserStatics')">
          <i class="el-icon-setting"></i>
          <span slot="title">用户统计</span>
        </el-menu-item>
        <el-submenu style="padding: 0px;" index="4" v-if="hasPerm('/log/logTimeStatics')">
          <template slot="title">
            <i style="padding-left: 25%;" class="el-icon-time"></i>
            <span slot="title">时间统计</span>
          </template>
          <el-menu-item style="padding: 0px;" index="to_char(f_createtime, 'yyyy-MM-dd')" v-if="hasPerm('/log/logTimeDayStatics')">按天分析</el-menu-item>
          <!-- <el-menu-item index="to_char(next_day(f_createtime+15/24 - 7,2),'YYYY-MM-DD')">按周分析</el-menu-item> -->
          <el-menu-item style="padding: 0px;" index="to_char(f_createtime,'yyyy-MM')" v-if="hasPerm('/log/logTimeMonthStatics')">按月分析</el-menu-item>
          <!-- <el-menu-item index="to_char(f_createtime,'q')">按季分析</el-menu-item> -->
          <el-menu-item style="padding: 0px;" index="to_char(f_createtime,'yyyy')" v-if="hasPerm('/log/logTimeYearStatics')">按年分析</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div slot="main" class="logMain">
      <el-scrollbar style="height: calc(100% - 10px);">
        <el-row>
          <el-col :span="21">
            <el-row style="padding-top: .1rem;padding-left: .2rem;">
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="日志来源">
                  <el-select v-model="bean.logOrigins" multiple placeholder="请选择">
                    <el-option
                      v-for="item in logOrigins"
                      :key="item.key"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="日志名称">
                  <el-input v-model="bean.name" placeholder="日志名"></el-input>
                </el-form-item>
                <el-form-item label="时间">
                  <el-date-picker
                    v-model="timeRange"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
              </el-form>
              <el-form :inline="true" class="demo-form-inline">
                <el-form-item label="日志类型">
                  <el-select collapse-tags v-model="bean.logTypes" multiple placeholder="请选择">
                    <el-option
                      v-for="item in logTypes"
                      :key="item.key"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="操作用户">
                  <el-input v-model="bean.loginName" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button id="searchButton" style="margin: 0 0 0 .1rem;" type="primary" @click="initTable()" v-show="shrinkFlag.flag">查询</el-button>
                  <el-button id="statisticButton" style="margin: 0 0 0 .1rem;" type="primary" @click="statistic()" v-show="!shrinkFlag.flag">统计</el-button>
                </el-form-item>
              </el-form>
            </el-row>
            <el-row>
              <div id="chartContent" :style="{height: (this.clientHeight - 252) / 50 + 'rem', width:'100%', display:'block'}" v-show="!shrinkFlag.flag">
                <div id="myChart" :style="{height:'95%', width:'100%'}"></div>
              </div>
              <div class="demo-block-control" style="left: 0px;line-height: 28px;background-color: #E4F3FF;color: #1B6CB8;" id="shrinkButton" @click="shrink()">
                <i :class="shrinkFlag.css"></i>
                <span>{{shrinkFlag.text}}</span>
              </div>
            </el-row>
            <el-row>
              <div id="detailsContent" :style="{height: (this.clientHeight - 200) / 50 + 'rem',width:'100%',display:'none'}" v-show="shrinkFlag.flag">
                <el-col :span="24">
                  <el-table
                    :data="tableData"
                    border
                    style="width: 100%;height: 100%;">
                    <el-table-column
                      prop="name"
                      label="日志名"
                      show-overflow-tooltip
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="type"
                      label="日志类型"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="loginName"
                      label="操作用户"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="ip"
                      label="IP地址"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="url"
                      label="操作路径"
                      show-overflow-tooltip
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="logOrigin"
                      label="日志来源"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      show-overflow-tooltip
                      label="发生时间"
                      align="center">
                    </el-table-column>
                    <el-table-column
                      prop="status"
                      label="执行结果"
                      align="center">
                    </el-table-column>
                  </el-table>
                  <el-pagination
                    class="pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageSize"
                    background
                    layout="total, prev, pager, next, jumper"
                    :total="total" style="padding: .2rem 1rem;">
                  </el-pagination>
                </el-col>
              </div>
            </el-row>
          </el-col>
        </el-row>
      </el-scrollbar>
    </div>
  </left-main-layout>
</template>

<script>
import leftMainLayout from '@comm/components/leftMainLayout'
import http from '@comm/service/interface.js'
export default {
  name: 'logContent',
  components: {
    leftMainLayout
  },
  data () {
    return {
      routerList: [
        {name: '系统管理', key: 'manage'},
        {name: '日志管理', key: 'manage/log'}
      ],
      timeRange: [],
      myChart: null,
      bean: {
        name: '',
        logOrigins: [],
        logTypes: [],
        loginName: ''
      },
      shrinkFlag: {
        flag: false,
        text: '详情',
        css: 'el-icon-caret-bottom'
      },
      tableData: [],
      flag: false,
      total: null,
      currentPage: 1,
      pageSize: 10,
      logType: [],
      createTime: '',
      isCollapse: true,
      logTypes: [],
      logOrigins: [],
      statisticType: '',
      chartLegend: [],
      chartXAxis: [],
      chartYAxis: [],
      startTime: '',
      endTime: '',
      clientHeight: '',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  methods: {
    // 默认时间
    defaultTime () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.timeRange = [start, end]
    },
    initTable () {
      let _this = this
      if (_this.timeRange === null) {
        _this.timeRange = []
      }
      // queryEndTime: this.timeRange[0], queryStartTime: this.timeRange[1]}
      http.logTable({currentPage: _this.currentPage, pageSize: _this.pageSize, data: _this.bean, queryStartTime: _this.timeRange[0], queryEndTime: _this.timeRange[1]}).then(res => {
        for (var i = 0; i < res.data.list.length; i++) {
          if (res.data.list[i].status === 1) {
            res.data.list[i].status = '成功'
          } else {
            res.data.list[i].status = '失败'
          }
          if (res.data.list[i].loginName === undefined) {
            res.data.list[i].loginName = '游客'
          }
          res.data.list[i].createTime = _this.formatTime(res.data.list[i].createTime, 'Y-M-D h:m:s')
        }
        _this.tableData = res.data.list
        _this.total = res.data.total
      })
    },
    statistic () {
      if (this.timeRange === null) {
        this.timeRange = []
      }
      this.initTable()
      http.statistic({data: this.bean, groupFields: this.statisticType, queryStartTime: this.timeRange[0], queryEndTime: this.timeRange[1]}).then(res => {
        // 清空数组中的数据
        this.chartXAxis = []
        this.chartYAxis = []
        if (res.data.length === 0) {
          this.chartXAxis = [0]
          this.chartYAxis = [0]
          // this.drawLine()
          this.$message({
            message: '暂无数据',
            type: 'warning'
          })
          return
        }
        if (this.statisticType === 'f_logorigin' || this.statisticType === 'l.f_type') {
          this.$nextTick(() => {
            res.data.forEach((i, k, l) => {
              // 添加x轴数据
              if (this.chartXAxis.indexOf(i['KEY']) < 0) {
                this.chartXAxis[this.chartXAxis.length] = i['KEY']
              }
              this.chartYAxis[this.chartYAxis.length] = i['VALUE']
            })
            this.chartYAxis
            this.drawBar()
          })
        } else {
          this.$nextTick(() => {
            res.data.forEach((i, k, l) => {
              // 添加x轴数据
              if (this.chartXAxis.indexOf(i['KEY']) < 0) {
                this.chartXAxis[this.chartXAxis.length] = i['KEY']
              }
              this.chartYAxis[this.chartYAxis.length] = i['VALUE']
            })
            this.drawLine()
          })
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initTable()
    },
    initLogTypes () {
      http.initLogTypes().then(res => {
        this.logTypes = res.data[0]
        this.logOrigins = res.data[1]
      })
    },
    shrink () {
      let {flag} = this.shrinkFlag
      this.shrinkFlag.flag = !flag
      this.shrinkFlag.text = !flag ? '统计' : '详情'
      this.shrinkFlag.css = flag ? 'el-icon-caret-bottom' : 'el-icon-caret-top'
    },
    handleSelect (key, keyPath) {
      this.statisticType = key
      this.statistic()
    },
    drawLine () {
      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      this.myChart.clear()
      this.myChart.setOption({
        title: {
          text: '日志分析图'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: '#333',
              fontSize: 14
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10,
          data: this.chartXAxis
        },
        yAxis: {
          // axisLine: {
          //   show: false
          // },
          // axisTick: {
          //   show: false
          // },
          // axisLabel: {
          //   textStyle: {
          //       color: '#999'
          //   }
          // },
          type: 'value'
        },
        series: [{
          data: this.chartYAxis,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#068EFF',
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: '#00D201',
                  fontSize: 14
                }
              }
            }
          },
          areaStyle: {}
        }]
      })
    },
    drawBar () {
      this.myChart = this.$echarts.init(document.getElementById('myChart'))
      this.myChart.clear()
      var dataShadow = []
      var yMax = 1200
      for (var i = 0; i < this.chartYAxis.length; i++) {
        dataShadow.push(yMax)
      }
      this.myChart.setOption({
        title: {
          text: '日志分析图'
        },
        grid: {
          left: '3%',
          right: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          axisLabel: {
            textStyle: {
              color: '#333',
              fontSize: 14
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          z: 10,
          data: this.chartXAxis
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: '#999'
            }
          },
          type: 'value'
        },
        series: [
          { // For shadow
            type: 'bar',
            itemStyle: {
              normal: {color: 'rgba(0,0,0,0.05)'}
            },
            barGap: '-100%',
            barCategoryGap: '40%',
            data: dataShadow,
            barWidth: '10%',
            animation: false
          },
          {
            data: this.chartYAxis,
            stack: '总量',
            barWidth: '10%',
            itemStyle: {
              normal: {
                color: '#068EFF',
                label: {
                  show: true, // 开启显示
                  position: 'top', // 在上方显示
                  textStyle: { // 数值样式
                    color: '#00D201',
                    fontSize: 14
                  }
                }
              }
            },
            type: 'bar'
          }]
      })
    }
  },
  mounted () {
    let that = this
    that.clientHeight = `${document.documentElement.clientHeight}`
    window.onresize = function () {
      that.clientHeight = `${document.documentElement.clientHeight}`
      that.myChart.resize()
    }
    // this.$refs.logContent.style.height = (document.documentElement.clientHeight - 105) / 50 + 'rem'
    that.defaultTime()
    that.initLogTypes()
    that.initTable()
    that.handleSelect('l.f_type')
  },
  watch: {
    clientHeight () {
      // this.$refs.logElMenu.$el.style.height = (document.documentElement.clientHeight - 105) / 50 + 'rem'
    }
  }
}
</script>

<style scoped>
  .demo-block-control{
    border-top: 1px solid #ffffff;
    height: 28px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #e2ecec;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    text-align: center;
    margin-top: -1px;
    color: teal;
    cursor: pointer;
    position: relative;
  }
  .spanColor{
    background:rgba(247,180,34,1);
  }
  .spanIcon{
    width: 4px;
    height: 100%;
    display: inline-block;
    border-radius:2px;
  }
  .logContent{
    height: 100%;
  }
  .logMain{
    height:calc(100% - 20px);
    background: #fff;
    padding:10px;
    margin-right: 10px;
    border-radius:4px 3px 4px 4px;
    border:1px solid rgba(223,229,249,1);
  }
  .pagination{
    float: right;
    margin-top: .4rem;
  }
  .logContent>>>.el-form-item__label{
    padding: 0 .18rem 0 0;
  }
  .logContent>>>.el-date-editor.el-input{
    width: 4.06rem;
  }
  .logContent>>>.el-scrollbar__wrap{
    overflow-x:hidden;
  }
  .el-menu-item{
    min-width: auto;
  }
  .el-switch__core{
    width: 64px;
  }
  .logElMenu>>>img{
    width: .48rem;
    height: .48rem;
  }
  .logElMenu>>>.el-menu-item i{
    margin-left: 25%;
  }
  .logElMenu>>>.el-menu-item.is-disabled i{
    margin-left: 25%;
  }
  .logElMenu>>>.el-submenu .el-menu-item{
    padding-left: 35%!important;
  }
  .logElMenu>>> .el-menu-item:hover{
    background:linear-gradient(90deg,rgba(0,152,249,0.1) 0%,rgba(0,133,217,0) 100%) !important;
  }
  .logElMenu>>> .el-menu-item .is-active{
    background:linear-gradient(90deg,rgba(0,152,249,0.1) 0%,rgba(0,133,217,0) 100%) !important;
  }
  .el-table{
    border: 1px solid #fff;
  }
  .el-table>>>th, .el-table>>>td{
    border: 1px solid #fff !important;
  }
</style>
