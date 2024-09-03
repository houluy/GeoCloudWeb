<template>
  <div>
    <div style="width: 100%">
      <div v-show="!checked" id="echarts_left15"></div>
      <div v-show="!checked" id="echarts_left13"></div>
      <div v-show="!checked" id="echarts_left14"></div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx'
  import * as echarts from 'echarts'

  export default {
    name: "middleData",
    props: ['echartsMiddleData', 'flag'],
    data() {
      return {
        checked: false,
        downData: [],
        dataEexcle: [],
        tableData: [],
        middleDataTop: [
          {
            name: '订单总数',
            value: '0',
            icon: require('../img/icon.png')
          },
          {
            name: '离线订单数',
            value: '0',
            icon: require('../img/icon.png')
          },
          {
            name: '在线订单数',
            value: '0',
            icon: require('../img/icon.png')
          },
          {
            name: '月份',
            value: '0',
            icon: require('../img/icon.png')
          }
        ],
        middleDataTop1: [
          {
            name: '订单总数据量',
            value: '0',
            icon: require('../img/icon.png'),
            type: 'TB'
          },
          {
            name: '离线订单数据量',
            value: '0',
            icon: require('../img/icon.png'),
            type: 'TB'
          },
          {
            name: '在线订单数据量',
            value: '0',
            icon: require('../img/icon.png'),
            type: 'TB'
          },
          {
            name: '月份',
            value: '0',
            icon: require('../img/icon.png')
          },
        ],
        middleDataTop2: [
          {
            name: '订单总景数',
            value: '0',
            icon: require('../img/icon.png'),
            type: '景'
          },
          {
            name: '离线订单景数',
            value: '0',
            icon: require('../img/icon.png'),
            type: '景'
          },
          {
            name: '在线订单景数',
            value: '0',
            icon: require('../img/icon.png'),
            type: '景'
          },
          {
            name: '月份',
            value: '0',
            icon: require('../img/icon.png')
          },
        ]
      }
    },
    mounted() {
    },
    watch: {
      echartsMiddleData: {
        handler(newval) {
          let data1 = []
          let data2 = []
          let data3 = []
          let data4 = []
          let data5 = []
          let data6 = []
          let data7 = []
          let data8 = []
          let data9 = []
          let monthArr = []
          let monthArryLb = []
          if (newval.length !== 0) {
            newval.forEach((item, index) => {
              data1.push(parseInt(item.OrderNum))
              data2.push(parseInt(item.onlineOrderNum))
              data3.push(parseInt(item.offlineOrderNum))
              data4.push(parseFloat(item.OrderSize))
              data5.push(parseFloat(item.onlineOrderSize))
              data6.push(parseFloat(item.offlineOrderSize))
              data7.push(parseInt(item.OrderSceneNum))
              data8.push(parseInt(item.onlineOrderSceneNum))
              data9.push(parseInt(item.offlineOrderSceneNum))
              monthArr.push(item.month)
              monthArryLb.push({
                name: item.month,
                id: index
              })
            })
          }
          this.dataList = monthArryLb
          this.tableData = newval
          //console.log(document.documentElement.clientWidth * 0.90, 'this.paddingInt')
          this.initDataechart('echarts_left15', [data1, data2, data3, monthArr],['订单总量','在线订单数','离线订单数'],'服务订单数统计')
          this.initDataechart('echarts_left13', [data4, data5, data6, monthArr],['订单总数据量','在线订单数据量','离线订单数据量'],'服务数据量统计')
          this.initDataechart('echarts_left14', [data7, data8, data9, monthArr],['订单总景数','在线订单景数','离线订单景数'],'服务景数统计')
        },
        deep: true
      }
    },
    methods: {
      excelDown () {
        if (this.tableData.length !== 0) {
          this.dataEexcle = [
            [
              ['月份', '在线','', '','离线', '','','合计','',''],
              ['', '订单数', '景数', '数据量（TB）', '订单数', '景数', '数据量（TB）', '订单数', '景数', '数据量（TB）']
            ],
            [
              // 设置A1-C1的单元格合并
              {s: {r: 0, c: 1}, e: {r: 0, c: 3}},
              {s: {r: 0, c: 4}, e: {r: 0, c: 6}},
              {s: {r: 0, c: 7}, e: {r: 0, c: 9}},
              {s: {r: 0, c: 0}, e: {r: 1, c: 0}}
            ],
            '月度统计'
          ]
          this.tableData.forEach(item => {
            this.dataEexcle[0].push([
              item.month, item.onlineOrderNum, item.onlineOrderSceneNum, item.onlineOrderSize, item.offlineOrderNum,
              item.offlineOrderSceneNum, item.offlineOrderSize, item.OrderNum,item.OrderSceneNum,item.OrderSize
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
      },
      initDataechart(val, data,dataname, name) {
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
                if (name.indexOf('服务数据量统计') > -1) {
                  valueD = valueD + '(TB)'
                } else if (name.indexOf('服务景数统计') > -1) {
                  valueD = valueD + '(景)'
                }else {
                  valueD = valueD + '(个)'
                }
                htmlStr += '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' + item.color + ';"></span>' + item.seriesName + ':' + valueD + '<br/>'
              })
              htmlStr += '</div>'
              return htmlStr
            },
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['总量', '在线', '离线']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: data[3]
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: dataname[0],
              type: 'line',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: data[0]
            },
            {
              name: dataname[1],
              type: 'line',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: data[1]
            },
            {
              name: dataname[2],
              type: 'line',
              areaStyle: {},
              emphasis: {
                focus: 'series'
              },
              data: data[2]
            },
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
  #echarts_left15, #echarts_left13,#echarts_left14{
    height: 40vh;
    width: 97.5%;
  }
</style>
