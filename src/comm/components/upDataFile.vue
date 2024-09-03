<template>
    <div>
      <div @click="updataTaskSource(item.label)" class="content_UP" v-for="(item, index) in upDataD" :key="index" :class="{content_UPz_Z: index === 2 || index === 4, content_UP_b: index === 3}" >
        <div style="margin-bottom: 11px;margin-top: 3px;float:left;">{{item.label}}</div><span v-if="(orderDetliaU.getMethod==='在线下载' && index < 4) || (orderDetliaU.getMethod !== '在线下载' && index === 3) || (orderDetliaU.getMethod !== '在线下载' && index < 2)" style="color: red; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span><span v-if="(orderDetliaU.getMethod==='在线下载' && index === 4) || (orderDetliaU.getMethod !== '在线下载' && index > 0)" style="color: #fff; font-size: 30px; display: inline-block;margin-left: 7px;" > *</span>
        <approvalDoc @identityCard="identityCard" class="uploadFilesItemClass" :approvalDocData="item.file" />
      </div>
    </div>
</template>

<script>
import approvalDoc from './approvalDoc.vue'
import http from '@comm/service/interface.js'
export default {
  name: 'upDataFile',
  props: ['UpgetMethod'],
  // UpgetMethod: 'UpgetMethod在线取',
  data () {
    return {
      upDataD: [
        {
          id: '6',
          label: '任务来源说明文件',
          file: []
        },
        {
          id: '7',
          label: '签字后的分发登记表',
          file: []
        },
        {
          id: '2',
          label: '介绍信',
          file: []
        },
        {
          id: '1',
          label: '身份证',
          file: []
        },
        {
          id: '4',
          label: '其他附件',
          file: []
        }
      ],
      approvalDocData: [],
      orderDetliaU: '',
      indexUp: 0,
      uploadFileList: {
        taskDataCard: [],
        identityCard: [],
        introductionLetter: [],
        otherDoc: [],
        regisForm: []
      }
    }
  },
  components: {
    approvalDoc
  },
  methods: {
    getByOrderIdFileD (val) {
      http.getByOrderIdFile({orderId: val}).then(res => {
        if (res.data.length > 0) {
          let arrList = ['', 'identityCard', 'introductionLetter', '', 'otherDoc', '', 'taskDataCard', 'regisForm']
          res.data.forEach(item => {
            this.uploadFileList[arrList[parseInt(item.type)]].push({
              filePath: item.fDataPath,
              // fileName: item.fDataName,
              fileName: item.fDataName,
              fileType: item.type
              // othername: item.othername
            })
          })
        }
      })
    },
    identityCard (val) {
      this.indexUp = 1
      if (this.approvalDocData === '任务来源说明文件') {
        this.uploadFileList.taskDataCard = this.getUpDataList(val[1], '6')
      } else if (this.approvalDocData === '签字后的分发登记表') {
        this.uploadFileList.regisForm = this.getUpDataList(val[1], '7')
      } else if (this.approvalDocData === '介绍信') {
        this.uploadFileList.introductionLetter = this.getUpDataList(val[1], '2')
      } else if (this.approvalDocData === '身份证') {
        this.uploadFileList.identityCard = this.getUpDataList(val[1], '1')
      } else if (this.approvalDocData === '其他附件') {
        this.uploadFileList.otherDoc = this.getUpDataList(val[1], '4')
      }
    },
    updataTaskSource (val) {
      this.approvalDocData = val
    },
    getUpDataList (val, index) {
      let arrlist = []
      if (val.length > 0) {
        val.forEach(item => {
          let fN = ''
          if (item.url !== '') {
            let nameArr = item.url.split('/')
            fN = nameArr[nameArr.length - 1]
          }
          arrlist.push({
            filePath: item.url === '' ? item.fDataPath : item.url,
            fileName: item.fDataName ? item.fDataName : fN,
            fileType: index
          })
        })
      } else {
        arrlist = []
      }
      return arrlist
    }
  },
  watch: {
    uploadFileList: {
      handler (newval, oldval) {
        if (this.indexUp === 1) {
          this.$emit('upDataFileClick', newval)
          this.indexUp = 0
        }
      },
      deep: true
    },
    UpgetMethod: {
      handler (newval, oldval) {
        if (newval.length > 0) {
          newval.forEach(e => {
            this.upDataD.forEach(item => {
              if (e.type === item.id && e.fDataName) {
                e.name = e.fDataName.slice(19, e.fDataName.length)
                e.url = e.fDataPath
                item.file.push(e)
              }
            })
          })
        }
      },
      deep: true
    }
  },
  mounted () {
    let orderDataID = sessionStorage.getItem('orderDataID')
    this.$nextTick(() => {
      this.orderDetliaU = JSON.parse(orderDataID)
      // console.log(this.orderDetlia, 'this.orderDetlia')
      // this.getTabelData(this.orderDetlia.id)
      // this.getTabelDataAll(this.orderDetlia.id)
      this.getByOrderIdFileD(this.orderDetliaU.id)
      // this.orderReference = this.orderDetlia.ordername
      // this.basicOrderInfoD(this.orderDetlia) // 初始化属性值
      // this.getDataIndex(this.orderDetlia.status)
      // this.getUserR()
    })
  }
}
</script>

<style scoped>
  .content_UP{
    width: 17.8%;
    background: rgb(255, 255, 255);
    padding: 1%;
    padding-bottom: 0;
    border: 1px solid rgba(73, 120, 241, 0.19);
    float: left;
    height: 132px;
    overflow-y: auto;
  }
  .content_UPz_Z{
    border: 1px solid rgba(73, 120, 241, 0.19);
  }
  .content_UP_b{
    border-bottom: 1px solid rgba(73, 120, 241, 0.19);
  }
  .uploadFilesItemClass {
    height: 77%;
    padding: 10px;
    padding-bottom: 0px;
    padding-top: 0px;
    /*background-color: #F9F9F9 !important;*/
    /*border: 1px solid #E9E9E9;*/
    overflow: auto;
  }
</style>
