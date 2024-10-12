<template>
  <div>
    <div style="width: 49%; float: left; margin-right: 2%">
      <div>
        <div
          :class="{ activeLeft: index === 0 }"
          class="con_gl"
          v-for="(item, index) in leftDataTop"
          :key="index"
        >
          <img
            style="position: relative; top: -5px; float: left"
            :src="item.icon"
            alt=""
          />
          <div style="float: left; width: 73%">
            <span class="span_one">{{ item.name }}</span>
            <span class="span_two">{{ item.value }}</span>
          </div>
        </div>
        <div class="echarts_bot">
          <div class="echarts_bot_top">
            <img src="../img/iconspan.jpg" height="14" width="4" />
            <span>订单总数统计</span>
          </div>
          <div id="echarts_left"></div>
          <!--//<el-button size="mini" type="primary" icon="el-icon-download" @click="excelDown">导出</el-button>-->
        </div>
      </div>
    </div>
    <div style="width: 49%; float: left">
      <div>
        <div
          :class="{ activeLeft: index === 0 }"
          class="con_gl1"
          v-for="(item, index) in leftDataTop1"
          :key="index"
        >
          <img
            style="position: relative; top: -2.5px; float: left; width: 24px"
            :src="item.icon"
            alt=""
          />
          <div style="float: left; width: 73%">
            <span class="span_one1">{{ item.name }}</span>
            <span class="span_two1"
              >{{ item.value }}
              <span v-if="item.type !== undefined" class="span_two_type">{{
                item.type
              }}</span></span
            >
          </div>
        </div>
        <div class="echarts_bot1">
          <div class="echarts_bot_top1">
            <img src="../img/iconspan.jpg" height="14" width="4" />
            <span>订单总数据量统计</span>
          </div>
          <div id="echarts_left2"></div>
          <!--  <el-button @click="excelDownT" size="mini" type="primary" icon="el-icon-download">导出</el-button>-->
        </div>
      </div>
    </div>
    <div style="width: 49%; float: left; margin-top: 6px">
      <div>
        <div
          :class="{ activeLeft: index === 0 }"
          class="con_gl1"
          v-for="(item, index) in leftDataTop2"
          :key="index"
        >
          <img
            style="position: relative; top: -2.5px; float: left; width: 24px"
            :src="item.icon"
            alt=""
          />
          <div style="float: left; width: 73%">
            <span class="span_one1">{{ item.name }}</span>
            <span class="span_two1"
              >{{ item.value }}
              <span v-if="item.type !== undefined" class="span_two_type">{{
                item.type
              }}</span></span
            >
          </div>
        </div>
        <div class="echarts_bot1">
          <div class="echarts_bot_top1">
            <img src="../img/iconspan.jpg" height="14" width="4" />
            <span>订单景数统计</span>
          </div>
          <div id="echarts_left3"></div>
          <!--<el-button @click="excelDownJ" size="mini" type="primary" icon="el-icon-download">导出</el-button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import XLSX from "xlsx";
// import http from '@comm/service/interface.js'
export default {
  name: "leftData",
  props: ["echartsLeftData"],
  data() {
    return {
      downData: [],
      leftDataTop: [
        {
          name: "离线订单数",
          value: "0",
          icon: require("../img/icon.png"),
        },
        {
          name: "在线订单数",
          value: "0",
          icon: require("../img/icon.png"),
        },
      ],
      leftDataTop1: [
        {
          name: "离线订单数据量",
          value: "0",
          icon: require("../img/icon.png"),
          type: "TB",
        },
        {
          name: "在线订单数据量",
          value: "0",
          icon: require("../img/icon.png"),
          type: "TB",
        },
      ],
      leftDataTop2: [
        {
          name: "离线订单景数",
          value: "0",
          icon: require("../img/icon.png"),
          type: "景",
        },
        {
          name: "在线订单景数",
          value: "0",
          icon: require("../img/icon.png"),
          type: "景",
        },
      ],
    };
  },
  mounted() {},
  methods: {
    initDataechart(val, data) {
      let myChart = this.$echarts.init(document.getElementById(val));
      const option = {
        title: {
          zlevel: 0,
          text: data[0],
          subtext: [data[1]],
          subtextStyle: {
            color: "#13227a",
            fontWeight: "bold",
            fontSize: 26,
          },
          textStyle: {
            color: "#040718",
            fontWeight: "100",
            fontSize: 14,
          },
          x: "center", // 文字位置
          y: "center", // 文字位置
        },
        tooltip: {
          trigger: "item",
          // formatter: '{b}: <br/>{c} ({d}%)'
          formatter: function (params) {
            if (params.name.indexOf("数据量") > -1) {
              params.name = params.name + "(TB)";
            } else {
              params.name = params.name + "(景)";
            }
            let htmlStr = "<div>";
            // htmlStr += params.name + ': ' + '<br/>'// x轴的名称
            htmlStr +=
              '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
              params.color +
              ';"></span>' +
              params.name +
              ":" +
              params.data.value +
              "(" +
              params.percent +
              "%) " +
              "<br/>";
            htmlStr += "</div>";
            return htmlStr;
          },
        },
        color: ["#3CA0E9", "#F97364"],
        // color: ['#3CA0E9', '#F97364', '#F0BE28', '#69D6A3' ],
        legend: {
          x: "left", // 'center' | 'left' | {number},
          y: "91%", // 'ce
          orient: "horizontal",
          width: "100%",
          itemGap: 50,
          left: "30%",
          data: data[3],
        },
        series: [
          {
            name: "订单数",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            // emphasis: {
            //     label: {
            //         show: true,
            //         fontSize: '30',
            //         fontWeight: 'bold'
            //     }
            // },
            labelLine: {
              show: false,
            },
            data: data[2],
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true);
      // 根据窗口的大小变动图表
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    initDataechart2(val, data) {
      let myChart = this.$echarts.init(document.getElementById(val));
      const option = {
        title: {
          zlevel: 0,
          text: data[0],
          subtext: [data[1]],
          subtextStyle: {
            color: "#13227a",
            fontWeight: "bold",
            fontSize: 13,
          },
          textStyle: {
            color: "#040718",
            fontWeight: "100",
            fontSize: 7,
          },
          x: "center", // 文字位置
          y: "center", // 文字位置
        },
        tooltip: {
          trigger: "item",
          // formatter: '{b}: <br/>{c} ({d}%)'
          formatter: function (params) {
            if (params.name.indexOf("数据量") > -1) {
              params.name = params.name + "(TB)";
            } else {
              params.name = params.name + "(景)";
            }
            let htmlStr = "<div>";
            // htmlStr += params.name + ': ' + '<br/>'// x轴的名称
            htmlStr +=
              '<span style="margin-right:2.5px;display:inline-block;width:5px;height:5px;border-radius:5px;background-color:' +
              params.color +
              ';"></span>' +
              params.name +
              ":" +
              params.data.value +
              "(" +
              params.percent +
              "%) " +
              "<br/>";
            htmlStr += "</div>";
            return htmlStr;
          },
        },
        color: ["#3CA0E9", "#F97364"],
        // color: ['#3CA0E9', '#F97364', '#F0BE28', '#69D6A3' ],
        legend: {
          x: "right", // 'center' | 'left' | {number},
          y: "center", // 'ce
          orient: "vertical",
          width: "100%",
          textStyle: {
            fontSize: 9,
          },
          itemGap: 26,
          //right: -100,
          data: data[3],
        },
        series: [
          {
            name: "订单数",
            type: "pie",
            radius: ["45%", "75%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            // emphasis: {
            //     label: {
            //         show: true,
            //         fontSize: '30',
            //         fontWeight: 'bold'
            //     }
            // },
            labelLine: {
              show: false,
            },
            data: data[2],
          },
        ],
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option, true);
      // 根据窗口的大小变动图表
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    excelDown() {
      if (
        this.leftDataTop[0].value !== "0" &&
        this.leftDataTop[1].value !== "0" &&
        this.leftDataTop1[0].value !== "0" &&
        this.leftDataTop1[1].value !== "0" &&
        this.leftDataTop2[0].value !== "0" &&
        this.leftDataTop2[1].value !== "0"
      ) {
        this.downData = [
          [
            [
              "在线订单数",
              "离线订单数",
              "订单总数",
              "在线订单数据量",
              "离线订单数据量",
              "订单总数据量",
              "在线订单景数",
              "离线订单景数",
              "订单总景数",
            ],
            [
              this.leftDataTop[1].value,
              this.leftDataTop[0].value,
              parseInt(this.leftDataTop[1].value) +
                parseInt(this.leftDataTop[0].value),
              this.leftDataTop1[1].value,
              this.leftDataTop1[0].value,
              parseFloat(this.leftDataTop1[1].value) +
                parseFloat(this.leftDataTop1[0].value),
              this.leftDataTop2[1].value,
              this.leftDataTop2[0].value,
              parseInt(this.leftDataTop2[1].value) +
                parseInt(this.leftDataTop2[0].value),
            ],
          ],
          [
            // 设置A1-C1的单元格合并
            { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } },
          ],
          "订单总量数",
        ];
        this.export2Excel();
      } else {
        this.$message({
          messageg: "暂无数据",
          type: "warning",
        });
      }
    },
    // 导出所有未未匹配清单
    export2Excel() {
      var sheet = XLSX.utils.aoa_to_sheet(this.downData[0]);
      sheet["!merges"] = this.downData[1];

      const filename = this.downData[2] + ".xlsx";
      // Excel第一个sheet的名称
      const wsname = "Sheet1";
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(this.downData[0]);
      ws["!merges"] = sheet["!merges"];
      XLSX.utils.book_append_sheet(wb, ws, wsname); // 将数据添加到工作薄
      XLSX.writeFile(wb, filename); // 导出Excel
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
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
  },
  watch: {
    echartsLeftData: {
      handler(newval) {
        if (newval !== {}) {
          this.leftDataTop[0].value = newval.offlineOrderNum;
          this.leftDataTop[1].value = newval.onlineOrderNum;
          /*   let offsizeType = this.commonMZ.dataSizeFormatter(newval.offlineOrderSize)
          let onsizeType = this.commonMZ.dataSizeFormatter(newval.onlineOrderSize)
          this.leftDataTop1[0].value = offsizeType.slice(0, offsizeType.length - 1)
          this.leftDataTop1[1].value = onsizeType.slice(0, onsizeType.length - 1)
          this.leftDataTop1[0].type = offsizeType.slice(offsizeType.length - 1, offsizeType.length) + 'B'
          this.leftDataTop1[1].type = onsizeType.slice(onsizeType.length - 1, onsizeType.length) + 'B'*/
          this.leftDataTop1[0].value = newval.offlineOrderSize;
          this.leftDataTop1[1].value = newval.onlineOrderSize;
          this.leftDataTop2[0].value = newval.offlineOrderSceneNum;
          this.leftDataTop2[1].value = newval.onlineOrderSceneNum;
          let allNum =
            parseInt(newval.onlineOrderNum) + parseInt(newval.offlineOrderNum);
          let allSceneNum =
            parseInt(newval.offlineOrderSceneNum) +
            parseInt(newval.onlineOrderSceneNum);
          //let allsize = this.commonMZ.dataSizeFormatter(parseFloat(newval.onlineOrderSize) + parseFloat(newval.offlineOrderSize))
          let allsize = newval.OrderSize;
          this.initDataechart2("echarts_left2", [
            "订单总数据量",
            allsize + "TB",
            [
              { value: this.leftDataTop1[0].value, name: "离线订单数据量" },
              { value: this.leftDataTop1[1].value, name: "在线订单数据量" },
            ],
            ["在线订单数据量", "离线订单数据量"],
          ]);
          this.initDataechart2("echarts_left3", [
            "景数总量",
            allSceneNum + "景",
            [
              { value: this.leftDataTop2[0].value, name: "离线订单景数" },
              { value: this.leftDataTop2[1].value, name: "在线订单景数" },
            ],
            ["在线订单景数", "离线订单景数"],
          ]);
          this.initDataechart("echarts_left", [
            "订单总数",
            allNum + "个",
            [
              { value: this.leftDataTop[0].value, name: "离线订单数" },
              { value: this.leftDataTop[1].value, name: "在线订单数" },
            ],
            ["在线订单数", "离线订单数"],
          ]);
        }
      },
      deep: true,
    },
  },
};
</script>

<style scoped lang="scss">
.con_gl {
  float: left;
  width: 40.2%;
  padding-top: 3%;
  text-align: center;
  padding-left: 9%;
  height: 8vh;
  background-color: #fff;
}
.con_gl1 {
  float: left;
  width: 40.2%;
  padding-top: 3%;
  text-align: center;
  padding-left: 9%;
  height: 4vh;
  background-color: #fff;
}
.activeLeft {
  margin-right: 1.5%;
}
.span_one {
  width: 100%;
  float: left;
  margin-bottom: 4px;
  color: #333333;
}
.span_two {
  width: 100%;
  float: left;
  color: #000;
  /*font-size: 30px;*/
  font-size: 18px;
}
.span_one1 {
  width: 100%;
  float: left;
  margin-bottom: 2px;
  color: #333333;
  font-size: 9px;
}
.span_two1 {
  width: 100%;
  float: left;
  color: #000;
  /*font-size: 30px;*/
  font-size: 9px;
}
.echarts_bot {
  /*height: 41vh;*/
  width: 100%;
  float: left;
  margin-top: 2vh;
  background-color: rgb(255, 255, 255);
}
.echarts_bot >>> .el-button--mini {
  padding: 6px 5px !important;
  margin: 10px;
  float: right;
}
.echarts_bot_top {
  margin-left: 5%;
  margin-top: 2%;
}
.echarts_bot_top img {
  top: -1px;
  position: relative;
}
.echarts_bot1 {
  /*height: 41vh;*/
  width: 100%;
  float: left;
  height: 220px;
  margin-top: 1vh;
  background-color: rgb(255, 255, 255);
}
.echarts_bot1 >>> .el-button--mini {
  padding: 6px 5px !important;
  margin: 10px;
  float: right;
}
.echarts_bot_top1 {
  margin-left: 5%;
  margin-top: 2%;
}
.echarts_bot_top1 img {
  top: -1px;
  position: relative;
}
.echarts_bot_top1 span {
  font-size: 7px;
}
#echarts_left {
  height: 40vh;
  width: 97.5%;
}
#echarts_left2,
#echarts_left3 {
  height: 22vh;
  width: 97.5%;
}
.span_two_type {
  font-size: 7px;
}
</style>
