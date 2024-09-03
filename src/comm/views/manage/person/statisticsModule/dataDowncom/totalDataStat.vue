<template>
  <div class="content_con">
    <div class="content_echart">
      <div style="height: 100%; background-color: #F3F3F3" id="proDataStatId"></div>
    </div>
    <div class="content_tabel">
      <div  class="content_tabel_total">
        <div class="content_tabel_total_con" v-for="(item, index) in totalData" :key = index>
          <span class="content_tabel_total_one">{{item.value}}</span><br>
          <span class="content_tabel_total_two">{{item.label}}</span>
        </div>
      </div>
      <div class="content_tabel_con">
        <template>
          <el-table
            :data="tableData"
            stripe
            :height="heightInt"
            show-summary
            style="width: 100%">
            <el-table-column
              prop="applyUserUsed"
              label="用途">
            </el-table-column>
            <el-table-column
              prop="datadownSize"
              sortable
              label="下载量(GB)">
            </el-table-column>
            <el-table-column
              prop="datadownNum"
              sortable
              label="下载景数(景)">
            </el-table-column>
            <!--<el-table-column-->
              <!--prop="address"-->
              <!--label="总计">-->
            <!--</el-table-column>-->
          </el-table>
        </template>
      </div>
      <el-button @click="export2Excel" size="small" type="primary" icon="el-icon-download">导出</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'totalDataStat',
  props: ['echartsTotalData'],
  data () {
    return {
      dataDwon: [],
      heightInt: 0,
      totalData: [
        {
          value: '0',
          type: 'GB',
          label: '数据下载总量'
        }, {
          value: '0',
          type: '景',
          label: '数据下载总景数'
        }
      ],
      tableData: [{
        date: '项目1',
        name: '12',
        address: '3'
      }, {
        date: '项目2',
        name: '1',
        address: '2'
      }, {
        date: '项目3',
        name: '31',
        address: '3'
      }, {
        date: '项目4',
        name: '23323',
        address: '12'
      }]
    }
  },
  created () {
    this.heightInt = document.documentElement.clientHeight * 0.44
  },
  mounted () {
    // this.initDataechart()
  },
  methods: {
    initDataechart (data) {
      let myChart = this.$echarts.init(document.getElementById('proDataStatId'))
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            // dataView: {show: true, readOnly: false},
            // magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['数据下载景数', '数据下载量']
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 35,
            end: 85
          },
          {
            type: 'inside',
            realtime: true,
            start: 35,
            end: 85
          }
        ],
        xAxis: [
          {
            type: 'category',
            data: data[2],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数据下载景数',
            min: 0,
            // max: 250,
            // interval: 50,
            axisLabel: {
              formatter: '{value} GB'
            }
          },
          {
            type: 'value',
            name: '数据下载量',
            min: 0,
            // max: 25,
            // interval: 5,
            axisLabel: {
              formatter: '{value} 个'
            }
          }
        ],
        series: [
          {
            name: '数据下载量',
            type: 'bar',
            itemStyle: {
              normal: {
                color: '#37A2DA' // 柱状颜色
              }
            },
            barWidth: 25,
            data: data[0]
          },
          {
            name: '数据下载景数',
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FDDB6C' // 柱状颜色
              }
            },
            yAxisIndex: 1,
            data: data[1]
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
    // 导出所有未未匹配清单
    export2Excel () {
      if (this.tableData.length > 0) {
        require.ensure([], () => {
          const { export_json_to_excel } = require('@comm/static/vendor/Export2Excel')
          const tHeader = ['用途', '下载量(GB)', '下载景数(景)']// 生成Excel表格的头部标题栏
          const filterVal = ['applyUserUsed', 'datadownSize', 'datadownNum']// 生成Excel表格的内容栏（根据自己的数据内容属性填写）
          const list = this.tableData// 需要导出Excel的数据
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '用途数据量统计')// 这里可以定义你的Excel表的默认名称
        })
      } else {
        this.$message({
          message: '暂无数据！',
          type: 'warning'
        })
      }
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  watch: {
    echartsTotalData: {
      handler (newval) {
        console.log(newval, 'echartsTotalData')
        if (newval[0].length !== 0) {
          this.initDataechart(newval)
          this.totalData[0].value = this.commonMZ.dataSizeFormatterZ(newval[3], ['GB', 'T', 'P'])
          this.totalData[1].value = newval[4] + '景'
          this.tableData = newval[5]
        } else {
          this.totalData[0].value = 0
          this.totalData[1].value = 0
          this.tableData = []
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .content_con{
    height: 63vh;
    width: 84vw;
  }
  .content_echart{
    width: 57vw;
    height: 63vh;
    /*display: inline-block;*/
    float: left;
  }
  .content_tabel{
    width: 26vw;
    height: 63vh;
    /*background-color: cadetblue;*/
    float: left;
  }
  .content_tabel_total{
    float: left;
    width: 100%;
  }
  .content_tabel_total_con{
    width: 45%;
    float: left;
    height: 7vh;
    line-height: 3vh;
    background: #4978F1;
    color: #fff;
    margin-left: 5%;
    text-align: center;
    padding-top: 4%;
    border-radius: 10px;
    box-shadow: 1px 1px 4px 1px #D4D4D4;
  }
  .content_tabel_total_one{
    font-size: 30px;
  }
  .content_tabel_con{
    width: 95%;
    margin-left: 5%;
    margin-top: 5%;
    height: 44vh;
    /*overflow: auto;*/
    float: left;
  }
  .content_tabel>>> .el-button--small{
    padding: 6px 5px!important;
    margin: 10px;
    float: right;
  }
  .content_tabel>>>.el-table th{
    text-align: center !important;
  }
  .content_tabel>>>.el-table td{
    text-align: center !important;
  }
  .content_tabel_con>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
  }
  .content_tabel_con>>>.el-table th{
    text-align: center !important;
    border-top: 1px solid #e4e5e6;
    border-bottom: 1px solid #e4e5e6;
  }
  .content_tabel_con>>>.el-table td{
    text-align: center !important;
  }
  .content_tabel_con{
    /*min-height: 87%;*/
    /*border: 1px solid #E2E7EF;*/
    /*border-bottom: 0 solid #E2E7EF;*/
    background: #fff;
  }
</style>
