<template>
<div style="font-size: 14px !important;">
    <div class="content_span">
      <span class="spanL">订单编号 ： </span><span>{{this.basicOrderInfoD.ordername}}</span>
    </div>
    <div class="content_span">
      <!--<span class="spanL">申请人 ： </span><span>{{this.basicOrderInfoD.applyuser}}</span>-->
      <span class="spanL">申请人 ： </span><el-input style="width: 40%" size="mini" v-model="getMethodDown.applyuser"></el-input><span style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span><span v-show="getMethodDown.applyuser === ''" style="color: red;">申请人不能为空！</span>
    </div>
    <div class="content_span">
      <span class="spanL">订购账号 ： </span><span>{{this.basicOrderInfoD.loginUser}}</span>
    </div>
    <div class="content_span">
      <!--<span class="spanL">联系电话 ： </span><span>{{this.basicOrderInfoD.applyUserPhone}}</span>-->
      <span class="spanL">联系电话 ： </span><el-input @blur="changeblur" style="width: 40%" size="mini" v-model="getMethodDown.applyUserPhone"></el-input><span style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span><span v-text="applyUserPhoneS" style="color: red;"></span>
    </div>
    <div class="content_span">
      <!--<span class="spanL">订购产品数量 ： </span><span>{{this.basicOrderInfoD.dataSum}}</span>-->
      <span class="spanL">订购产品数量 ： </span><span>{{this.totalDataZ}}景</span>
    </div>
    <div class="content_span">
      <!--<span class="spanL">项目名称 ： </span><span>{{this.basicOrderInfoD.productName}}</span>-->
      <span class="spanL">项目名称 ： </span><el-input style="width: 40%" size="mini" v-model="getMethodDown.productName"></el-input><span style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span><span v-show="getMethodDown.productName === ''" style="color: red;">项目名称不能为空！</span>
    </div>
    <div class="content_span">
      <span class="spanL">订购数据量 ： </span><span>{{this.basicOrderInfoD.dataSum}}</span>
    </div>
    <div class="content_span">
      <!--<span class="spanL">申请单位 ： </span><el-input style="width: 40%" size="mini" v-model="getMethodDown.applyUserUnit"></el-input><span style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span><span v-show="getMethodDown.applyUserUnit === ''" style="color: red;">申请单位不能为空！</span>-->


      <!--先注释以下  解决线上excel查询分页问题-->
      <span class="spanL">申请单位 ： </span>
      <el-select  v-model="getMethodDown.applyUserUnit" style="width: 40%" size="mini"
                 filterable placeholder="搜索选择单位名称，若未搜索到点击新增">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.name"
          :value="item.name">
        </el-option>
      </el-select>
      <span style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
      <span v-show="getMethodDown.applyUserUnit === ''" style="color: red;">申请单位不能为空！</span>

    </div>
    <div class="content_span">
      <span class="spanL">订单生成时间 ： </span><span>{{this.basicOrderInfoD.creattime}}</span>
    </div>
    <div class="content_span">
      <!--<span class="spanL">用途领域 ： </span><span>{{this.basicOrderInfoD.applyUserUsed}}</span>-->
      <span class="spanL">用途领域 ： </span><el-select style="width: 40%;" v-model="getMethodDown.applyUserUsed" clearable size="mini"
                                                   placeholder="请选择">
      <el-option v-for="item in usageOptions"
                 class="commonPadding"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select><span style="color: red; font-size: 30px;margin-left: 7px; display: inline-block" > *</span><span v-show="getMethodDown.applyUserUsed === ''" style="color: red;">用途领域不能为空！</span>
    </div>
    <div class="content_span" v-if="orderStatusIndex === -1">
      <!--<span class="spanL">订单状态 ： </span><span>{{this.basicOrderInfoD.sstatus}}</span>-->
      <span class="spanL">订单状态 ： </span><span style="color:#F19949;">待提交</span>
    </div>
    <div class="content_span" v-if="orderStatusIndex === 2">
      <!--<span class="spanL">订单状态 ： </span><span>{{this.basicOrderInfoD.sstatus}}</span>-->
      <span class="spanL">订单状态 ： </span><span style="color:#FF504F;">审核未通过</span>
    </div>
    <div class="content_span">
      <!--<span class="spanL">在线下载 ： </span><span>{{this.basicOrderInfoD.distmethod}}</span>-->
      <span class="spanL">获取方式 ： </span><el-select style="width: 40%;" v-model="getMethodDown.getMethod"
                                                   size="mini"           placeholder="请选择">
      <el-option v-for="item in getMethodO"
                 class="commonPadding"
                 :key="item.value"
                 :label="item.label"
                 :value="item.value">
      </el-option>
    </el-select><span style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span><span v-show="getMethodDown.getMethod === ''" style="color: red;">获取方式不能为空！</span>
    </div>
  <div class="content_span" v-if="this.basicOrderInfoD.type === 2 ">
    <span class="spanL">产品级别 ： </span><span>{{this.labelD}}</span>
  </div>
  <div class="content_span" v-if="this.basicOrderInfoD.type === 2 ">
    <!--<span class="spanL">在线下载 ： </span><span>{{this.basicOrderInfoD.distmethod}}</span>-->
    <span class="spanL">提取要素 ： </span><el-select style="width: 40%;" v-model="getMethodDown.extractingElements"
                                                 size="mini"           placeholder="请选择">
    <el-option v-for="item in extractingElementsD"
               class="commonPadding"
               :key="item.value"
               :label="item.label"
               :value="item.value">
    </el-option>
  </el-select><span style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span><span v-show="getMethodDown.getMethod === ''" style="color: red;">获取方式不能为空！</span>
  </div>
    <div class="content_span" v-if="orderStatusIndex === -1">
      <span class="spanL">下载分发登记表 ： </span><span class="spanDown" @click="downLoadf" >下载</span>
    </div>
    <div class="content_span" v-if="orderStatusIndex === 2">
      <span class="spanL">未通过原因 ： </span><span>{{this.basicOrderInfoD.cause}}</span>
    </div>
    <div class="content_span" v-if="this.basicOrderInfoD.type === 0">
      <!--<span class="spanL">备注 ： </span><span>{{this.basicOrderInfoD.description}}</span>-->
      <span class="spanL">备注 ： </span><el-input style="width: 40%" size="mini" v-model="getMethodDown.description"></el-input>
    </div>
    <div class="content_span" v-if="this.basicOrderInfoD.type === 2">
      <span class="spanL">加工说明 ： </span><el-input style="width: 40%" size="mini" v-model="getMethodDown.processDescribe"></el-input>
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import http from "../service/interface";
export default {
  name: 'basicOrderInfo',
  data () {
    return {
      options: [],
      levelData: [
        {value: 'gbi', label: '地质体解译'},
        {value: 'oip', label: '光学影像处理'},
        {value: 'pomdm', label: '矿产分布图件制作'},
        {value: 'rip', label: '雷达影像处理'},
        {value: 'rsmmp', label: '遥感监测图件制作'},
        {value: 'fcstmp', label: '要素转换系列专题图制作'},
        {value: 'itm', label: '指数专题图制作'}
      ],
      orderStatusIndex: 0,
      getMethodDown: {
        getMethod: '',
        applyuser: '',
        applyUserPhone: '',
        productName: '',
        applyUserUnit: '',
        applyUserUsed: '',
        processDescribe: '',
        description: '',
        extractingElements: '',
        type: ''
      },
      basicOrderInfoD: {},
      extractingElementsD: window.taskDefExtractingElements,
      labelD: '',
      ordeStu: [],
      totalDataZ: '',
      getMethodO: [
        {
          label: '线下拷贝',
          value: '线下拷贝'
        }
      ],
      getMethodOptions: [
        {
          label: '在线下载',
          value: '在线下载'
        },
        {
          label: '线下拷贝',
          value: '线下拷贝'
        }
      ],
      getMethodD: [
        {
          label: '线下拷贝',
          value: '线下拷贝'
        }
      ],
      usageOptions: [
        {
          label: '地质矿产资源调查与评价',
          value: '地质矿产资源调查与评价'},
        {
          label: '矿产资源开发现状调查与监管',
          value: '矿产资源开发现状调查与监管'},
        {
          label: '地质灾害调查与监测',
          value: '地质灾害调查与监测'},
        {
          label: '灾害应急',
          value: '灾害应急'},
        {
          label: '生态地质调查与监测',
          value: '生态地质调查与监测'},
        {
          label: '境外地质',
          value: '境外地质'},
        {
          label: '土地利用',
          value: '土地利用'},
        {
          label: '测绘',
          value: '测绘'},
        {
          label: '科研',
          value: '科研'},
        {
          label: '其他',
          value: '其他'}
      ],
      applyUserPhoneS: '',
      applyUserPhoneD: true
    }
  },
  watch: {
    getMethodDown: {
      handler (newval, oldval) {
        this.changeblur()
        if (newval.extractingElements === '' || newval.applyuser === '' || newval.productName === '' || newval.applyUserUnit === '' || newval.applyUserUsed === '' || newval.getMethod === '' || newval.applyUserPhone === '' || !this.applyUserPhoneD) {
          this.$emit('basicOrderInfoD', 1)
        } else {
          this.$emit('basicOrderInfoD', newval)
        }
      },
      deep: true
    },
    spanLabel: {
      handler (newval, oldval) {
        console.log(newval, 'newvalnewvalnewval')
      },
      deep: true
    },
    // totalDataLength: {
    //   handler (newval, oldval) {
    //     console.log(newval, '00909080')
    //     this.totalDataZ = newval
    //   },
    //   deep: true
    // }
    totalDataLength (val) {
      this.totalDataZ = val
    }
  },
  mounted () {
    let orderDataz = sessionStorage.getItem('orderDataID')
    this.$nextTick(() => {
      this.basicOrderInfoD = JSON.parse(orderDataz)
      console.log(this.basicOrderInfoD, 'this.basicOrderInfoD')
      this.getMethodDown.getMethod = this.basicOrderInfoD.getMethod
      this.getMethodDown.applyuser = this.basicOrderInfoD.applyuser
      this.getMethodDown.applyUserPhone = this.basicOrderInfoD.applyUserPhone
      this.getMethodDown.productName = this.basicOrderInfoD.productName
      this.getMethodDown.applyUserUnit = this.basicOrderInfoD.applyUserUnit
      this.getMethodDown.applyUserUsed = this.basicOrderInfoD.applyUserUsed
      this.getMethodDown.description = this.basicOrderInfoD.description
      this.getMethodDown.processDescribe = this.basicOrderInfoD.processDescribe
      this.getMethodDown.type = this.basicOrderInfoD.type
      this.getMethodDown.extractingElements = this.basicOrderInfoD.extractingElements
      // if (this.basicOrderInfoD.creattime.indexOf('T') > -1) {
      // this.basicOrderInfoD.creattime = this.basicOrderInfoD.creattime.replace('T', ' ')
      this.basicOrderInfoD.creattime = this.commonMethod.timestampToTime(this.basicOrderInfoD.creattime)
      // }
      this.getDataIndex(this.basicOrderInfoD.sstatus)
      this.getSizeData(this.basicOrderInfoD.dataSum)
      this.getUnitList()
    })

  },
  methods: {
    // 单位下拉框列表的获取
    getUnitList(){
      http.getUnitList( {data:{
          status: 1
        }}).then(res =>{
        this.options = res.data
        console.log("获取下拉框列表：",this.options)
      })
    },
    // 产品级别的获取
    getlistProcessData () {
      let p1 = http.listProcess()
      // let p2 = http.listProcess()
      Promise.all([p1]).then((result) => {
        this.levelData = result[0].data
        console.log(this.levelData, 'this.levelData')
        if (this.basicOrderInfoD.type === 2) {
          this.getlabelD(this.basicOrderInfoD.assignment)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    getlabelD (val) {
      let _that = this
      _that.levelData.forEach((item, index) => {
        if (item.id === val) {
          _that.labelD = item.fProcessName
        }
      })
    },
    changeblur () {
      var regPass = new RegExp('^[0-9]{11}$')
      if (this.getMethodDown.applyUserPhone === '') {
        this.applyUserPhoneS = '电话号码不能为空！'
        this.applyUserPhoneD = false
      } else {
        if (regPass.test(this.getMethodDown.applyUserPhone)) {
          this.applyUserPhoneS = ''
          this.applyUserPhoneD = true
        } else {
          this.applyUserPhoneS = '请输入正确的电话号码！'
          this.applyUserPhoneD = false
        }
      }
    },
    getSizeData (param) {
      this.getMethodO = this.getMethodD
      if (this.basicOrderInfoD.type === 2) {
        this.getMethodO = this.getMethodD
        return false
      }
      if (param) {
        let arryD = [param.slice(0, param.length - 1), param.slice(param.length - 1, param.length)]
        if ((arryD[1] === 'G' && parseFloat(arryD[0]) > 5) || arryD[1] === 'T' || arryD[1] === 'P') {
          this.getMethodO = this.getMethodD
          return false
        } else {
          this.getMethodO = this.getMethodOptions
          return true
        }
      } else {
        this.getMethodO = this.getMethodOptions
        return false
      }
    },
    getDataIndex (val) {
      if (val === '待提交订单' || val === -1) {
        this.orderStatusIndex = -1
      } else if (val === '待审核订单' || val === 0) {
        this.orderStatusIndex = 0
      } else if (val === '审核通过订单' || val === 1) {
        this.orderStatusIndex = 1
      } else if (val === '审核未通过订单' || val === 2) {
        this.orderStatusIndex = 2
      } else if (val === '数据准备完成订单' || val === 6) {
        this.orderStatusIndex = 6
      } else if (val === '已完成订单' || val === 7) {
        this.orderStatusIndex = 7
      } else if (val === '逾期订单' || val === 5) {
        this.orderStatusIndex = 5
      }  else if (val === '已反馈订单' || val === 8) {
        this.orderStatusIndex = 8
      } else if (val === '全部订单' || val === 'orderManage') {
        this.orderStatusIndex = ''
      }
    },
    downLoadf () {
      this.downloadPDF(this.basicOrderInfoD.downlodPathFile, this.basicOrderInfoD.ordername + '.pdf')
    },
    downloadPDF (url, fileName) {
      axios({
        method: 'get',
        responseType: 'arraybuffer',
        url: url
      }).then(function (res) {
        if (res.data.byteLength > 0) {
          this.fileDownload(res.data, fileName)
        } else {
          this.$message({
            type: 'error',
            message: '暂无文件！'
          })
        }
        // 调用下载方法，把后端传过来的流传给fileDownload方法
      }.bind(this))
    },
    fileDownload (data, fileName) {
      let blob = new Blob([data], {
        // type类型后端返回来的数据中会有，根据自己实际进行修改
        type: 'application/vnd.ms-excel'
      })
      let filename = fileName
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        // 创建隐藏<a>标签进行下载
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        // if (typeof tempLink.download === 'undefined') {
        tempLink.setAttribute('target', '_blank')
        // }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    }
  },
  computed: {
    ...mapState('searchStore', {
      orderDetailId (state) {
        return state.orderDetailId
      },
      spanLabel (state) {
        return state.spanLabel
      },
      totalDataLength (state) {
        this.totalDataZ = state.totalDataLength
        return state.totalDataLength
      }
    })
  }
}
</script>

<style scoped>
  .lastOne{
    width:100% !important;
  }
  .content_span{
    font-size: 13px;
    float:left;
    width: 50%;
    border-bottom: 1px dotted #D9D9D9;
    line-height: 4.8vh;
    /*height: 4.8vh;*/
    display: flex;
  }
  .content_span>>>.el-input__inner{
    font-size: 13px !important;
    color: #303133 !important;
    font-family: 'Avenir', Helvetica, Arial, sans-serif !important;
  }
  .spanL{
    color:#999999;
    display: inline-block;
    margin-left: 30px;
    width: 18vh;
  }
  .spanDown{
    height: 23px;
    line-height: 24px;
    background: #4978f1;
    border-radius: 3px;
    display: inline-block;
    width: 54px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    margin-top: 6px;
  }
</style>
