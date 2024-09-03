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
      </div>
    </div>
    <div class="echarts_con" style="width: 100%">
      <el-button style="margin: 0 0 0 .2rem;"
                 type="primary"
                 size="mini"
                 @click="excelDataSumDown"
                 class="table_data"
                 icon="el-icon-download">导出
      </el-button>
      <div id="echarts_receive15">

      </div>
      <div v-if="checked" class="table_data1">
        <el-table
          :data="tableData"
          stripe
          :height="heightInt"
          show-summary
          style="width: 100%">
          <el-table-column
            prop="month"
            label="月份">
          </el-table-column>
          <el-table-column
              prop="OrderNum"
              label="数据量（TB）">
          </el-table-column>
          <el-table-column
              prop="OrderSceneNum"
              label="景数">
            </el-table-column>
          <el-table-column
            prop="wxname"
            label="卫星名称">
          </el-table-column>
          <el-table-column
            prop="allSum"
            label="合计">
          </el-table-column>
        </el-table>
      </div>
      <el-button style="margin: 0 0 0 .2rem;"
                 type="primary"
                 size="mini"
                 @click="excelDown"
                 class="table_data"
                 icon="el-icon-download">导出
      </el-button>
      <div id="echarts_receive13">

      </div>
    </div>
  </div>
</template>

<script>
  import http from '@comm/service/interface.js'
  import XLSX from 'xlsx'
  import * as echarts from 'echarts'

  export default {
    name: "dataReceiveStat",
    data() {
      return {
        orderDate_0: null,
        orderDate_1: null,
        dataList: [],
        dataList1: [],
        checked:false,
        tableData: [],
        tableData1: []
      }
    },
    mounted () {
      if (this.$route.path.indexOf('dataReceiveStat') > -1) {
        let date = new Date()
        let year1 = date.getFullYear()
        let firstMonth = year1 + '-' + '01' + '-' + '01'
        this.orderDate_0 = this.commonMethod.getDateTyPE(firstMonth)
        this.orderDate_1 = new Date(date.getTime())
        console.log(this.orderDate_0, 'this.orderDate_0')
        console.log(this.orderDate_1, 'this.orderDate_1')
        this.getdataLeftEcharts([this.orderDate_0, this.orderDate_1])
        this.getdataRightEcharts([this.orderDate_0, this.orderDate_1])
      }
    },
    watch: {
    },
    methods: {
      excelDown() {
        if (this.tableData.length !== 0) {
          this.dataEexcle = [
            [
              ['月份', 'gf1', 'gf2','gf1bcd','gf5', 'gf6','gf7','zy1E', 'zy301','zy302','zy303','cb04a','zy1f','zy02c','总计'],

            ],
            [
              // 设置A1-C1的单元格合并
              {s: {r: 0, c: 0}, e: {r: 0, c: 0}}
            ],
            '景数统计'
          ]
          this.tableData.forEach(item => {
            this.dataEexcle[0].push([
              item.月份, item.GF1,item.GF2,item.GF1BCD,item.GF5,item.GF6,item.GF7,item.ZY1E,item.ZY301,item.ZY302,item.ZY303,item.CB04A,item.ZY1F,item.ZY02C,
              parseFloat(item.GF1+item.GF2+item.GF1BCD+item.GF5+item.GF6+item.GF7+item.ZY1E+item.ZY301+item.ZY302+item.ZY303+item.CB04A,item.ZY1F,item.ZY02C)
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
      excelDataSumDown() {
        if (this.tableData1.length !== 0) {
          this.dataEexcle = [
            [
              ['月份', 'gf1', 'gf2','gf1bcd','gf5', 'gf6','gf7','zy1E', 'zy301','zy302','zy303','cb04a','zy1f','zy02c','总计'],

            ],
            [
              // 设置A1-C1的单元格合并
              {s: {r: 0, c: 0}, e: {r: 0, c: 0}}
            ],
            '数据量统计'
          ]
          this.tableData1.forEach(item => {
            this.dataEexcle[0].push([
              item.月份, item.GF1,item.GF2,item.GF1BCD,item.GF5,item.GF6,item.GF7,item.ZY1E,item.ZY301,item.ZY302,item.ZY303,item.CB04A,item.ZY1F,item.ZY02C,
              parseFloat(item.GF1)+parseFloat(item.GF2)+parseFloat(item.GF1BCD)+parseFloat(item.GF5)+parseFloat(item.GF6)+parseFloat(item.GF7)+parseFloat(item.ZY1E)+parseFloat(item.ZY301)+parseFloat(item.ZY302)+parseFloat(item.ZY303)+parseFloat(item.CB04A)+parseFloat(item.ZY1F)+parseFloat(item.ZY02C)
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
      export2Excel() {
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
      },
      findOrderListByUser() {

        this.getdataRightEcharts([this.orderDate_0, this.orderDate_1])

      },
      getdataLeftEcharts(timeParam) {
        http.GetOrderDataReceive({
          data: {
            lessCreattime: timeParam.length === 0 ? null : timeParam[0],
            moreCreattime: timeParam.length === 0 ? null : timeParam[1],
            lessCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[0]),
            moreCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[1])
          }
        }).then(res => {
          if (res.data) {
            let gf1 = []
            let gf2 = []
            let gf1bcd = []
            let gf5 = []
            let gf6 = []
            let gf7 = []
            let zy1E = []
            let zy301 = []
            let zy302 = []
            let zy303 = []
            let cb04a = []
            let zy1f = []
            let zy02c = []
            let monthArr = []
            let monthArryLb = []
            if (res.data.length !== 0) {
              res.data.forEach((item, index) => {
                gf1.push(item.GF1)
                gf2.push(item.GF2)
                gf1bcd.push(item.GF1BCD)
                gf5.push(item.GF5)
                gf6.push(item.GF6)
                gf7.push(item.GF7)
                zy1E.push(item.ZY1E)
                zy301.push(item.ZY301)
                zy302.push(item.ZY302)
                zy303.push(item.ZY303)
                cb04a.push(item.CB04A)
                zy1f.push(item.ZY1F)
                zy02c.push(item.ZY02C)
                monthArr.push(item.月份)
                monthArryLb.push({
                  name: item.month,
                  id: index
                })
              })
            }
            this.dataList = monthArryLb
            this.tableData = res.data
            //console.log(document.documentElement.clientWidth * 0.90, 'this.paddingInt')
            //this.initDataechart('echarts_receive15', [data3, monthArr,wxname], '数据接收量统计')
            this.initDataechart('echarts_receive13', [gf1, gf2,gf1bcd,gf5, gf6,gf7,zy1E, zy301,zy302,zy303,cb04a,zy1f,zy02c,monthArr], '数据接收景数统计')

           // this.echartsLeftData = res.data
          } else {
            this.tableData = {}
          }
        })
      },
      getdataRightEcharts(timeParam) {
        http.GetOrderDataSumReceive({
          data: {
            lessCreattime: timeParam.length === 0 ? null : timeParam[0],
            moreCreattime: timeParam.length === 0 ? null : timeParam[1],
            lessCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[0]),
            moreCreattimeStr: timeParam.length === 0 ? null : this.commonMethod.timestampToTimeD(timeParam[1])
          }
        }).then(res => {
          if (res.data) {
            let gf1 = []
            let gf2 = []
            let gf1bcd = []
            let gf5 = []
            let gf6 = []
            let gf7 = []
            let zy1E = []
            let zy301 = []
            let zy302 = []
            let zy303 = []
            let cb04a = []
            let zy1f = []
            let zy02c = []
            let monthArr = []
            let monthArryLb = []
            if (res.data.length !== 0) {
              res.data.forEach((item, index) => {
                gf1.push(item.GF1)
                gf2.push(item.GF2)
                gf1bcd.push(item.GF1BCD)
                gf5.push(item.GF5)
                gf6.push(item.GF6)
                gf7.push(item.GF7)
                zy1E.push(item.ZY1E)
                zy301.push(item.ZY301)
                zy302.push(item.ZY302)
                zy303.push(item.ZY303)
                cb04a.push(item.CB04A)
                zy1f.push(item.ZY1F)
                zy02c.push(item.ZY02C)
                monthArr.push(item.月份)
                monthArryLb.push({
                  name: item.month,
                  id: index
                })
              })
            }
            this.dataList1 = monthArryLb
            this.tableData1 = res.data
            //console.log(document.documentElement.clientWidth * 0.90, 'this.paddingInt')
            //this.initDataechart('echarts_receive15', [data3, monthArr,wxname], '数据接收量统计')
            this.initDataechart('echarts_receive15', [gf1, gf2,gf1bcd,gf5, gf6,gf7,zy1E, zy301,zy302,zy303,cb04a,zy1f,zy02c,monthArr], '数据接收量统计')

            // this.echartsLeftData = res.data
          } else {
            this.tableData1 = {}
          }
        })
        this.getdataLeftEcharts([this.orderDate_0, this.orderDate_1])
      },
      initDataechart(val, data, name) {
        let myChart = this.$echarts.init(document.getElementById(val))
        const option = {
          title: {
            text: name
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params) {
              let htmlStr = '<div>'
              htmlStr += params[0].name + ': ' + '<br/>'// x轴的名称
              params.forEach(item => {
                var valueD = item.value > 0 ? item.value : -item.value
                if (name.indexOf('数据接收量统计') > -1) {
                  valueD = valueD + '(TB)'
                }else {
                  valueD = valueD + '(景)'
                }
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + item.color + ';"></span>' + item.seriesName + ':' + valueD + '<br/>'
              })
              htmlStr += '</div>'
              return htmlStr
            }
          },
          legend: {
            data:['gf1', 'gf2','gf1bcd','gf5', 'gf6','gf7','zy1E', 'zy301','zy302','zy303','cb04a','zy1f','zy02c']

          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data[13]
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: 'GF1',
              type: 'line',
              data: data[0]
            },
            {
              name: 'GF2',
              type: 'line',
              data: data[1]
            },
            {
              name: 'GF1BCD',
              type: 'line',
              data: data[2]
            },
            {
              name: 'GF5',
              type: 'line',
              data: data[3]
            },
            {
              name: 'GF6',
              type: 'line',
              data: data[4]
            },
            {
              name: 'GF7',
              type: 'line',
              data: data[5]
            },
            {
              name: 'ZY1E',
              type: 'line',
              data: data[6]
            },
            {
              name: 'ZY301',
              type: 'line',
              data: data[7]
            },
            {
              name: 'ZY302',
              type: 'line',
              data: data[8]
            },
            {
              name: 'ZY303',
              type: 'line',
              data: data[9]
            },
            {
              name: 'CB04A',
              type: 'line',
              data: data[10]
            },
            {
              name: 'ZY1F',
              type: 'line',
              data: data[11]
            },
            {
              name: 'ZY02C',
              type: 'line',
              data: data[12]
            }
          ]
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option, true)
        // 根据窗口的大小变动图表
        window.addEventListener('resize', function () {
          myChart.resize()
        })
      }
    }
  }
</script>

<style scoped>
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
  #echarts_receive15, #echarts_receive13{
    height: 40vh;
    width: 97.5%;
  }
  .table_data{
    float: right;
    padding: 10px;
  }
</style>
