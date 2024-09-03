<template>
  <div style="font-size: 14px !important;">
    <div class="content_span">
      <span class="spanL">订单编号 ： </span><span>{{this.basicOrderInfoD.ordername}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">申请人 ： </span><span>{{this.basicOrderInfoD.applyuser}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">订购账号 ： </span><span>{{this.basicOrderInfoD.loginUser}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">联系电话 ： </span><span>{{this.basicOrderInfoD.applyUserPhone}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">订购产品数量 ： </span><span>{{this.totalDataZ}}景</span>
    </div>
    <div class="content_span">
      <span class="spanL">项目名称 ： </span><span>{{this.basicOrderInfoD.productName}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">订购数据量 ： </span><span>{{this.basicOrderInfoD.dataSum}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">申请单位 ： </span><span>{{this.basicOrderInfoD.applyUserUnit}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">订单生成时间 ： </span><span>{{this.basicOrderInfoD.creattime}}</span>
    </div>
    <div class="content_span">
      <span class="spanL">用途领域 ： </span><span>{{this.basicOrderInfoD.applyUserUsed}}</span>
    </div>
    <div class="content_span" v-if="this.orderStatusIndex === 0">
      <span class="spanL">订单状态 ： </span><span style="color:#F19949;">待审核</span>
    </div>
    <div class="content_span" v-if="this.orderStatusIndex ===  1">
      <span class="spanL">订单状态 ： </span><span style="color:#1BBA70;">审核通过</span>
    </div>
    <div class="content_span" v-if="this.orderStatusIndex === 5">
      <span class="spanL">订单状态 ： </span><span style="color:#FF504F;">状态逾期</span>
    </div>
    <div class="content_span" v-if="this.orderStatusIndex === 6">
      <span class="spanL">订单状态 ： </span><span style="color:#4978F1;">数据准备完成</span>
    </div>
    <div class="content_span" v-if="this.orderStatusIndex !== 6">
      <span class="spanL">获取方式 ： </span><span>{{this.basicOrderInfoD.getMethod}}</span>
    </div>
    <div class="content_span" v-if="this.orderStatusIndex === 6">
      <span class="spanL">获取方式 ： </span><span v-if="!this.paramIndex">线下拷贝</span>
      <span style="cursor:pointer;" class="spanDown" @click="downLoadf" v-if="this.paramIndex">下载</span>
    </div>
    <div class="content_span" v-if="this.orderStatusIndex === 5">
      <span class="spanL">逾期原因： ： </span><span>  </span>
    </div>
    <div class="content_span" v-if="this.basicOrderInfoD.type === 2">
      <span class="spanL">提取要素 ： </span><span>{{this.basicOrderInfoD.extractingElements}}</span>
    </div>
    <div class="content_span" v-if="this.basicOrderInfoD.type === 2">
      <span class="spanL">截止时间 ： </span><span>{{this.basicOrderInfoD.endtime}}</span>
    </div>
    <div v-if="this.basicOrderInfoD.type !== 2" class="content_span">
    <span class="spanL">备注 ： </span><span>{{this.basicOrderInfoD.description}}</span>
    </div>
    <div v-if="this.basicOrderInfoD.type !== 2" class="content_span">
      <span class="spanL">审核人 ： </span><span>{{this.basicOrderInfoD.auditor}}</span>
    </div>
    <div v-if="this.basicOrderInfoD.type === 2" class="content_span">
      <span class="spanL">再加工说明 ： </span><span>{{this.basicOrderInfoD.processDescribe}}</span>
    </div>
    <div v-if="this.basicOrderInfoD.type === 2" class="content_span">
      <span class="spanL">产品级别 ： </span><span>{{this.labelD}}</span>
    </div>
    <el-dialog class="elDialog_Aduti" title="数据下载信息：" :close-on-click-modal="false"
               :close-on-press-escape="true" :visible.sync="dialogVisibledonw" width="600px">
      <span class="ftp_class">
        <div class="title_name">下载地址：</div><div class="conton_con">{{arrDataFtp[0]}}</div>
        <div class="title_name">主机：</div><div class="conton_con">{{arrDataFtp[1]}}</div>
        <div class="title_name">账号名称：</div><div class="conton_con">{{arrDataFtp[2]}}</div>
        <div class="title_name">提取码：</div><div class="conton_con">{{arrDataFtp[3]}}</div>
        <div class="title_name">端口号：</div><div class="conton_con">{{arrDataFtp[4]}}</div>
        <div class="notion_name">
          <span class="ftpDown">注：请复制“下载地址”到本地电脑的下载器中自行进行数据获取。若本地电脑未安装合适下载器，本站推荐免费下载器 <span @click="spanFTP" class="ftpDown_a">“FileZilla”</span> ，请自行下载使用。</span>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogVisibledonw = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import http from '@comm/service/interface.js'
export default {
  name: 'basicOrderInfo',
  data () {
    return {
      dialogVisibledonw: false,
      arrDataFtp: [],
      levelData: [
        {value: '2', label: '地质体解译'},
        {value: '6', label: '光学影像处理'},
        {value: '3', label: '矿产分布图件制作'},
        {value: '4', label: '雷达影像处理'},
        {value: '8', label: '遥感监测图件制作'},
        {value: '5', label: '要素转换系列专题图制作'},
        {value: '7', label: '指数专题图制作'},
        {value: '1331523347455787010', label: '地质体解译-线性构造解译'},
        {value: '1331523638578233346', label: '地质体解译-水土流失解译'},
        {value: '1331524469675376641', label: '野外调查验证'},
        {value: '1331527581005889538', label: '地质体解译-地质灾害识别解译'},
        {value: '1331522072639029249', label: '地质体解译-碳酸盐解译'},
        {value: '1331522811444707329', label: '地质体解译-地质体识别解译'}
      ],
      orderStatusIndex: 0,
      getMethodDown: {
        getMethod: '',
        applyuser: '',
        applyUserPhone: '',
        productName: '',
        applyUserUnit: '',
        applyUserUsed: '',
        description: '',
        auditor: ''
      },
      basicOrderInfoD: {},
      paramIndex: false,
      labelD: '',
      ordeStu: [],
      totalDataZ: ''
    }
  },
  mounted () {
    let orderDataID = sessionStorage.getItem('orderDataID')
    this.$nextTick(() => {
      this.basicOrderInfoD = JSON.parse(orderDataID)
      this.basicOrderInfoD.creattime = this.commonMethod.timestampToTime(this.basicOrderInfoD.creattime)
      if (this.basicOrderInfoD.endtime && this.basicOrderInfoD.endtime.indexOf('T') > -1) {
        this.basicOrderInfoD.endtime = this.commonMethod.timestampToTime(this.basicOrderInfoD.endtime)
      }
      this.getDataIndex(this.basicOrderInfoD.sstatus)
      this.getlistProcessData()
      this.paramIndex = this.getSizeData(this.basicOrderInfoD.dataSum)
    })
  },
  computed: {
    ...mapState('searchStore', {
      orderDetailId (state) {
        return state.orderDetailId
      },
      spanLabel (state) {
        this.getDataIndex(state.spanLabel)
        return state.spanLabel
      },
      totalDataLength (state) {
        this.totalDataZ = state.totalDataLength
        return state.totalDataLength
      }
    })
  },
  methods: {
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
    getSizeData (param) {
      if (this.basicOrderInfoD.getMethod === '线下拷贝') {
        return false
      }
      if (param) {
        let arryD = [param.slice(0, param.length - 2), param.slice(param.length - 2, param.length - 1)]
        if ((arryD[1] === 'G' && parseFloat(arryD[0]) > 5) || arryD[1] === 'T' || arryD[1] === 'P') {
          return false
        } else {
          return true
        }
      } else {
        return false
      }
    },
    spanFTP () {
      window.open('https://filezilla-project.org/download.php?type=client', '_blank')
    },
    getlabelD (val) {
      let _that = this
      _that.levelData.forEach((item, index) => {
        if (item.id === val) {
          _that.labelD = item.fProcessName
        }
      })
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
      // window.open(this.basicOrderInfoD.downlodPathFile, '_blank')
      let url = this.basicOrderInfoD.downlodPathFile
      if (url) {
        this.dialogVisibledonw = true
        let stringD = url.slice(0, url.indexOf('@'))
        let stringL = url.slice(url.indexOf('@') + 1, url.length)
        let arr = stringD.split(':')
        let arrL = stringL.split(':')
        this.arrDataFtp = [url,arrL[0], arr[1].slice(2,arr[1].length),  arr[2], arrL[1]]
      }
      this.commonPvzh.postDataPVuVcommonMe({
        fOrdername: this.basicOrderInfoD.ordername,
        fUserid: localStorage.getItem('userName'),
        fClientip: localStorage.getItem('returnCitySNIp'),
        fUseragent: localStorage.getItem('userAgent'),
        fDetailurl: window.location.href,
        fBehaviortype: 5
      })
    },
    downloadPDF (url, fileName) {
      axios({
        method: 'get',
        responseType: 'arraybuffer',
        url: url
      }).then(function (res) {
        // 调用下载方法，把后端传过来的流传给fileDownload方法
        this.fileDownload(res.data, fileName)
      }.bind(this)).catch(
        // this.$Message.error('网络请求出错')
      )
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
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    },
    downloadFile (fileurl, filename) {
      var a = document.createElement('a')
      a.download = filename
      a.style.display = 'none'
      // var blob = new Blob([fileurl], {type: 'aplication/zip'})
      // a.target = '_barck'
      // a.href = URL.createObjectURL(blob)
      a.href = fileurl
      document.body.appendChild(a)
      a.click() // 触发点击
      document.body.removeChild(a) // 然后移除
    }
  },
  watch: {
    getMethodDown: {
      handler (newval, oldval) {
        this.$emit('basicOrderInfoD', this.getMethodDown)
      },
      deep: true
    },
    spanLabel: {
      handler (newval, oldval) {
      },
      deep: true
    },
    totalDataLength (val) {
      this.totalDataZ = val
    }
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
    margin-top: 6px;
  }
  .content_spanT{
    width: 100%;
  }
  .ftp_class div{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
  .conton_con {
    width: 80%;
  }
  .title_name{
    width: 18%;
    margin-left: 2%;
  }
  .ftpDown{
    font-size: 14px;
    color: red;
    padding: 20px;
    display: inline-block;
  }
  .ftpDown_a{
    color: blue;
    cursor: pointer;
  }
</style>
