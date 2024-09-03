<template>
  <div>
    <div style="width: 67%; float:left;">
      <div>
        <div class="echarts_bot">
          <div class="echarts_bot_top">
            <img src="../img/iconspan.jpg" height="14" width="4"/>
            <span>服务单位分布统计（按服务数据量）</span>
            <el-checkbox @change="checkedBox" style="float: right; margin-right: 5%" v-model="checked">表格</el-checkbox>
            <!--<el-radio style="float: right; margin-right: 5%" v-model="radio" label="1">表格</el-radio>-->
          </div>
          <div v-show="!checked" id="echarts_left12"></div>
          <div v-if="checked" class="table_data">
            <el-table
              :data="tableData"
              stripe
              :height="heightInt"
              show-summary
              style="width: 100%">
              <el-table-column
                prop="unit"
                label="单位">
              </el-table-column>
              <el-table-column label="离线订单">
                <el-table-column
                  prop="offlineOrderNum"
                  label="订单数">
                </el-table-column>
                <el-table-column
                  prop="offlineOrderSize"
                  label="数据量（GB）">
                </el-table-column>
              </el-table-column>
              <el-table-column label="在线订单">
                <el-table-column
                  prop="onlineOrderNum"
                  label="订单数">
                </el-table-column>
                <el-table-column
                  prop="onlineOrderSize"
                  label="数据量（GB）">
                </el-table-column>
              </el-table-column>
              <el-table-column label="合计">
                <el-table-column
                  prop="allNum"
                  label="订单数">
                </el-table-column>
                <el-table-column
                  prop="allSize"
                  label="数据量（GB）">
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <!--<span v-show="!checked">数据景数（景）</span>-->
          <el-button @click="donwDataR" size="mini" type="primary" icon="el-icon-download">导出</el-button>
        </div>
      </div>
    </div>
    <div style="width: 33%; float:left;">
      <div>
        <div class="echarts_bot_left">
          <div class="echarts_bot_top" style="margin-top: 3%;">
            <img src="../img/iconspan.jpg" height="14" width="4"/>
            <span>单位服务量排名</span>
            <el-checkbox @change="checkedBoxTwo" style="float: right; margin-right: 5%" v-model="checkedTwo">表格</el-checkbox>
          </div>
          <div class="list_data" v-if="!checkedTwo">
            <div :class="{list_con_one: index === 0, list_con_two: index === 1, list_con_there: index === 2, }"  :title="item.name" class="list_con" v-for="(item, index) in dataList" :key="index">
              <img :class="listImg + index" :src="dataListImg[index]" alt="" v-if="index < 3" width="56" height="27">
              <span :class="{list_con_span_one: index < 3 }" class="list_con_span"></span>
              <span>{{item.name}}</span>
            </div>
          </div>
          <div v-if="checkedTwo" class="table_data">
            <el-table
              :data="tableData"
              stripe
              :height="heightInt"
              show-summary
              style="width: 100%">
              <el-table-column
                prop="unit"
                label="单位">
              </el-table-column>
              <el-table-column label="合计">
                <el-table-column
                  prop="allNum"
                  label="订单数">
                </el-table-column>
                <el-table-column
                  prop="allSize"
                  label="数据量（GB）">
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
          <el-button @click="donwDataRT" size="mini" type="primary" icon="el-icon-download">导出</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  name: 'rigthData',
  props: ['echartsRightData','flag'],
  data () {
    return {
      checked: false,
      checkedTwo: false,
      listImg: 'listImg',
      paddingInt: 0,
      dataEexcle: [],
      checkedD: false,
      dataListImg: [
        require('../img/icon1.png'),
        require('../img/icon2.png'),
        require('../img/icon3.png')
      ],
      dataList: [],
      tableData: [],
      heightInt: 0
    }
  },
  created () {
    this.heightInt = document.documentElement.clientHeight * 0.40
    this.paddingInt = document.documentElement.clientWidth * 0.90
  },
  mounted () {
    let self = this
    window.onresize = function () {
      self.heightInt = document.documentElement.clientHeight * 0.40
      self.paddingInt = document.documentElement.clientWidth * 0.90
    }
  },
  methods: {
    checkedBox () {
      // console.log(this.checked, 'checked')
      this.checked = this.checked

      // let self = this
      // window.onresize = function () {
      //   self.heightInt = document.documentElement.clientHeight * 0.40
      // }
    },
    checkedBoxTwo () {
      this.checkedTwo = this.checkedTwo
      // let self = this
      // window.onresize = function () {
      //   self.heightInt = document.documentElement.clientHeight * 0.40
      // }
    },
    initDataechart (val, data, paddingInt) {
      let myChart = this.$echarts.init(document.getElementById(val))
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function (params) {
            let htmlStr = '<div>'
            htmlStr += params[0].name + ': ' + '<br/>'// x轴的名称
            params.forEach(item => {
              var valueD = item.value > 0 ? item.value : -item.value
              if (item.seriesName.indexOf('订单数据量') > -1) {
                valueD = valueD + '(GB)'
              } else {
                valueD = valueD + '(个)'
              }
              htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + item.color + ';"></span>' + item.seriesName + ':' + valueD + '<br/>'
            })
            htmlStr += '</div>'
            return htmlStr
          }
        },
        legend: {
          data: ['在线订单数据量', '离线订单数据量', '离线订单数', '在线订单数'],
          x: '20%',
          y: '4%'
          // left:
        },
        dataZoom: [
          {
            show: true,
            realtime: true,
            start: 25,
            end: 45
          },
          {
            type: 'inside',
            realtime: true,
            start: 25,
            end: 45
          }
        ],
        grid: {
          top: '15%'
        },
        // axisLabel: {
        //   show: true,
        //   interval: 0,
        //   rotate: 40,
        //   textStyle: {
        //     color: '#333'
        //   }
        // },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              show: false
            },
            textStyle: {
              color: '#4b4b4b' // 轴文字颜色修改
            },
            axisLine: { // 轴线颜色修改
              interval: 0,
              lineStyle: {
                color: '#a5a5a5'
              }
            },
            data: data[4]
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '数据量(GB)',
            axisLabel: {
              formatter: function (v) {
                return v > 0 ? v : -v
              }
            },
            axisTick: {
              show: false
            },
            textStyle: {
              color: '#a5a5a5' // 轴文字颜色修改
            },
            axisLine: { // 轴线颜色修改
              show: false
              // lineStyle: {
              //   color: '#00A0E9'
              // }
            },
            splitLine: {
              lineStyle: {
                color: '#a5a5a5'
              }
              // show: false // 去掉网格线
            },
            nameTextStyle: {
              padding: [0, 0, 0, -60] // 四个数字分别为上右下左与原位置距离
            }
          },
          {
            // inverse: true,
            name: '数据景数(个)',
            type: 'value',
            nameLocation: 'start',
            axisLine: { // 轴线颜色修改
              show: false
            },
            nameTextStyle: {
              padding: [0, 0, 0, -document.documentElement.clientWidth * 0.90] // 四个数字分别为上右下左与原位置距离
            }
          }
        ],
        series: [
          {
            name: '离线订单数',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#F86B5C' // 柱状颜色
              }
            },
            // emphasis: emphasisStyle,
            barWidth: 25,
            data: data[0]
          },
          {
            name: '在线订单数',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#3CA0E9' // 柱状颜色
              }
            },
            // emphasis: emphasisStyle,
            barWidth: 25,
            data: data[1]
          },
          {
            name: '离线订单数据量',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#F2B103' // 柱状颜色
              }
            },
            // emphasis: emphasisStyle,
            barWidth: 25,
            data: data[2]
          },
          {
            name: '在线订单数据量',
            type: 'bar',
            stack: '总量',
            itemStyle: {
              normal: {
                color: '#38CAC0' // 柱状颜色
              }
            },
            // emphasis: emphasisStyle,
            barWidth: 25,
            data: data[3]
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true)
      // 根据窗口的大小变动图表
      window.addEventListener('resize', function () {
        myChart.setOption(option, true)
        myChart.resize()
        console.log(-document.documentElement.clientWidth * 0.90, '-document.documentElement.clientWidth * 0.90')
      })
    },
    donwDataR () {
      if (this.tableData.length !== 0) {
        this.dataEexcle = [
          [
            ['单位', '离线订单', '', '在线订单', '', '合计', ''],
            ['', '订单数', '数据量（GB）', '订单数', '数据量（GB）', '订单数', '数据量（GB）']
          ],
          [
            // 设置A1-C1的单元格合并
            {s: {r: 0, c: 1}, e: {r: 0, c: 2}},
            {s: {r: 0, c: 3}, e: {r: 0, c: 4}},
            {s: {r: 0, c: 5}, e: {r: 0, c: 6}},
            {s: {r: 0, c: 0}, e: {r: 1, c: 0}}
          ],
          '服务单位分布统计（按服务数据量）'
        ]
        this.tableData.forEach(item => {
          this.dataEexcle[0].push([
            item.unit, item.offlineOrderNum, item.offlineOrderSize, item.onlineOrderNum, item.onlineOrderSize, item.allNum, item.allSize
          ])
        })
        this.export2Excel()
      } else {
        this.$message({
          messageg: '暂无数据',
          type: 'warning'
        })
      }
    },
    donwDataRT () {
      if (this.tableData.length !== 0) {
        this.dataEexcle = [
          [
            ['单位', '合计', ''],
            ['', '订单数', '数据量（GB）']
          ],
          [
            // 设置A1-C1的单元格合并
            {s: {r: 0, c: 1}, e: {r: 0, c: 2}},
            {s: {r: 0, c: 0}, e: {r: 1, c: 0}}
          ],
          '单位服务量排名（数据量）'
        ]
        this.tableData.forEach(item => {
          this.dataEexcle[0].push([
            item.unit, item.allNum, item.allSize
          ])
        })
        this.export2Excel()
      } else {
        this.$message({
          messageg: '暂无数据',
          type: 'warning'
        })
      }
    },
    export2Excel () {
      var sheet = XLSX.utils.aoa_to_sheet(this.dataEexcle[0])
      sheet['!merges'] = this.dataEexcle[1]

      const filename = this.dataEexcle[2] + '.xlsx'
      // Excel第一个sheet的名称
      const wsname = 'Sheet1'
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet(this.dataEexcle[0])
      ws['!merges'] = sheet['!merges']
      XLSX.utils.book_append_sheet(wb, ws, wsname) // 将数据添加到工作薄
      XLSX.writeFile(wb, filename) // 导出Excel
      // require.ensure([], () => {
      //   const { export_json_to_excel_zh } = require('@/static/vendor/Export2Excel')
      //   const multiHeader = this.downData[3]// 生成Excel表格的头部标题栏
      //   const tHeader = this.downData[0]// 生成Excel表格的头部标题栏
      //   const filterVal = this.downData[1]// 生成Excel表格的内容栏（根据自己的数据内容属性填写）
      //   const list = this.downData[2]// 需要导出Excel的数据
      //   const data = this.formatJson(filterVal, list)
      //   // if (this.downData[3].length !== 0) {
      //   //   this.downData[3].forEach(item => {
      //   //     data.unshift(item)
      //   //   })
      //   // }
      //   const merges = [
      //     'A1:B1'
      //   ]
      //   const name = [
      //     '未匹配清单'
      //   ]
      //   export_json_to_excel_zh(tHeader, data, '未匹配清单')// 这里可以定义你的Excel表的默认名称
      // })
    }
  },
  watch: {
    echartsRightData: {
      handler (newval) {
        let data1 = []
        let data2 = []
        let data3 = []
        let data4 = []
        let unitArry = []
        let unitArryLb = []
        if (newval.length !== 0) {
          newval.forEach((item, index) => {
            data1.push(-parseInt(item.offlineOrderNum))
            data2.push(-parseInt(item.onlineOrderNum))
            data3.push(item.offlineOrderSize)
            data4.push(item.onlineOrderSize)
            unitArry.push(item.unit)
            unitArryLb.push({
              name: item.unit,
              id: index
            })
          })
        }
        this.dataList = unitArryLb
        this.tableData = newval
        console.log(document.documentElement.clientWidth * 0.90, 'this.paddingInt')
        this.initDataechart('echarts_left12', [data1, data2, data3, data4, unitArry], document.documentElement.clientWidth * 0.90)
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
  .con_gl{
    float: left;
    width: 36%;
    padding-top: 3%;
    text-align: center;
    padding-left: 12%;
    height: 8vh;
    background-color: #fff;
  }
  .table_data>>> .el-table td.gutter {
    display: table-cell !important
  }
  .activeLeft{
    margin-right: 1.5%;
  }
  .span_one{
    width: 100%;
    float: left;
    margin-bottom: 4px;
    color: #333333;
  }
  .span_two{
    width: 100%;
    float: left;
    color: #000;
    font-size: 30px;
  }
  .echarts_bot{
    /*height: 41vh;*/
    width: 98%;
    float: left;
    /*margin-top: 2vh;*/
    background-color: rgb(255, 255, 255);
  }
  .echarts_bot_left{
    /*height: 41vh;*/
    width: 100%;
    float: left;
    /*margin-top: 2vh;*/
    background-color: rgb(255, 255, 255);
  }
  .echarts_bot_left>>> .el-button--mini{
    padding: 6px 5px!important;
    margin: 10px;
    float: right;
  }
  .echarts_bot>>> .el-button--mini{
    padding: 6px 5px!important;
    margin: 10px;
    float: right;
  }
  .echarts_bot_top>>> .el-checkbox__inner{
    border-radius: 10px !important;
  }
  /*.echarts_bot>>> .el-checkbox__inner{*/
    /*border-radius: 10px !important;*/
  /*}*/
  .echarts_bot_top{
    margin-left: 5%;
    margin-top: 2%;
  }
  .echarts_bot_top img{
    top: -1px;
    position: relative;
  }
  #echarts_left12{
    height: 43vh;
    width: 53vw;
  }
  .table_data{
    /*overflow-y: auto;*/
    height: 40vh;
    padding: 10px;
  }
  .table_data>>>.el-table--border{
    /*overflow-y: auto;*/
    border-top: 1px solid #e4e5e6;
  }
  .table_data>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
    border-bottom: 1px solid #e4e5e6;
    border-right: 1px solid #e4e5e6;
  }
  .table_data>>>.el-table th.gutter{
    display: table-cell !important;
  }
  .table_data>>>.el-table th{
    text-align: center !important;
  }
  .table_data>>>.el-table td{
    text-align: center !important;
  }
  .list_con{
    background: rgba(216,216,216,0);
    border: 1px solid #d7d7d7;
    width: 88%;
    height: 4vh;
    line-height: 4vh;
    margin-left: 6%;
    margin-bottom: 1vh;
    font-size: 13px;
    overflow: hidden;/*超出部分隐藏*/
    white-space: nowrap;/*不换行*/
    text-overflow: ellipsis;/*超出部分文字以...显示*/
  }
  .list_con_span{
    display: inline-block;
    width: 6px;
    border-radius: 3px;
    margin: 0 20px;
    height: 6px;
    background-color: #3CA0E9;
  }
  .list_data{
    padding-top: 12px;
    position: relative;
    height: 41vh;
    width: 100%;
    overflow-y: auto;
  }
  .list_con_there {
    border: 1px solid #9CBFEF !important;
    /*background-color: #fff;*/
    /*background-image: url("../img/icon1.png");*/
  }
  .list_con_two {
    border: 1px solid #ABDBC0 !important;
    /*background-color: #fff;*/
    /*background-image: url("../img/icon1.png");*/
  }
  .list_con_one {
    border: 1px solid #F9C582 !important;
    /*background-color: #fff;*/
    /*background-image: url("../img/icon1.png");*/
  }
  .list_con_span_one{
    background-color: #fff !important;
  }
  .listImg0 {
    position: absolute;
    top: 1vh;
    left: 17px;
  }
  .listImg1 {
    position: absolute;
    top: 6.5vh;
    left: 17px;
  }
  .listImg2 {
    position: absolute;
    top: 11.5vh;
    left: 17px;
  }
</style>
