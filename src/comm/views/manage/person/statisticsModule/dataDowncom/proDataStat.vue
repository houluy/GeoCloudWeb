<template>
    <div class="content_con">
      <div class="content_echart">
        <div style="height: 100%; background-color: #F3F3F3" id="proDataStatId"></div>
      </div>
      <div class="content_tabel">
        <div  class="content_tabel_total">
          <div class="content_tabel_total_con" v-for="(item, index) in totalData" :key = index>
            <span class="content_tabel_total_one">{{item.value}}</span><br>
            <!--<span v-if="item.type === 'GB'" class="content_tabel_total_one">{{item.value}}</span><br>-->
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
                prop="time"
                label="日期">
              </el-table-column>
              <el-table-column
                prop="datadownSize"
                label="下载量(GB)">
              </el-table-column>
              <el-table-column
                prop="datadownNum"
                label="下载景数(景)">
              </el-table-column>
            </el-table>
          </template>
        </div>
        <el-button @click="export2Excel" size="small" type="primary" icon="el-icon-download">导出</el-button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'proDataStat',
  props: ['echartsProData'],
  data () {
    return {
      heightInt: 0,
      totalData: [
        {
          value: '123124',
          type: 'GB',
          label: '数据下载总量'
        }, {
          value: '1231',
          type: '个',
          label: '数据下载总景数'
        }
      ],
      tableData: [{
        date: '2016-05-02',
        name: '12',
        address: '3'
      }, {
        date: '2016-05-04',
        name: '1',
        address: '2'
      }, {
        date: '2016-05-01',
        name: '31',
        address: '3'
      }, {
        date: '2016-05-03',
        name: '23323',
        address: '12'
      }]
    }
  },
  created () {
    this.heightInt = document.documentElement.clientHeight * 0.44
  },
  mounted () {},
  methods: {
    initDataechart (data) {
      let myChart = this.$echarts.init(document.getElementById('proDataStatId'))

      var timeData = data[2]
      timeData = timeData.map(function (str) {
        return str.replace('2009/', '')
      })
      const option = {
        title: {
          text: '数据下载情况统计',
          // subtext: '数据来自西安兰特水电测控技术有限公司',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            animation: false
          }
        },
        legend: {
          data: ['数据下载景数','数据下载量'],
          left: 10
        },
        toolbox: {
          feature: {
            // dataZoom: {
            //   yAxisIndex: 'none'
            // },
            restore: {},
            saveAsImage: {}
          }
        },
        axisPointer: {
          link: {xAxisIndex: 'all'}
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [0, 1]
          },
          {
            type: 'inside',
            realtime: true,
            start: 30,
            end: 70,
            xAxisIndex: [0, 1]
          }
        ],
        grid: [{
          left: 50,
          right: 50,
          height: '30%'
        }, {
          left: 50,
          right: 50,
          top: '53%',
          height: '32%'
        }],
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            data: timeData
          },
          {
            gridIndex: 1,
            type: 'category',
            boundaryGap: false,
            axisLine: {onZero: true},
            data: timeData,
            position: 'top'
          }
        ],
        yAxis: [
          {
            name: '数据下载量(GB)',
            type: 'value'
            // max: 500
          },
          {
            gridIndex: 1,
            name: '数据下载景数(个)',
            type: 'value',
            inverse: true
          }
        ],
        series: [
          {
            name: '数据下载量',
            type: 'line',
            symbolSize: 8,
            hoverAnimation: false,
            itemStyle: {
              normal: {
                color: '#3AA3DB' // 柱状颜色
              }
            },
            data: data[0]
          },
          {
            name: '数据下载景数',
            type: 'line',
            xAxisIndex: 1,
            yAxisIndex: 1,
            symbolSize: 8,
            itemStyle: {
              normal: {
                color: '#FED963' // 柱状颜色
              }
            },
            hoverAnimation: false,
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
          const tHeader = ['日期', '下载量(GB)', '下载景数(个)']// 生成Excel表格的头部标题栏
          const filterVal = ['time', 'datadownSize', 'datadownNum']// 生成Excel表格的内容栏（根据自己的数据内容属性填写）
          const list = this.tableData// 需要导出Excel的数据
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, '数据下载情况统计')// 这里可以定义你的Excel表的默认名称
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
    echartsProData: {
      handler (newval) {
        if (newval.length !== 0) {
          this.initDataechart(newval)
          this.totalData[0].value = this.commonMZ.dataSizeFormatterZ(newval[3], ['GB', 'T', 'P'])
          this.totalData[1].value = newval[4] + '个'
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
    border-top: 1px solid #e4e5e6;
    border-bottom: 1px solid #e4e5e6;
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
