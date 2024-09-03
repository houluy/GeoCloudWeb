<template>
  <div class="">
    <el-page-header @back="goBack" :content="this.row.type + '详情' ">
    </el-page-header>
    <el-card class="box-card" style="margin: .2rem 0;">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="content">
        <el-form class="elForm" :label-position="labelPosition" label-width="120px" :model="formLabelAlign" :inline="true">
          <el-form-item label="申请人">
            <el-input v-model="formLabelAlign.name" disabled></el-input>
          </el-form-item>
          <el-form-item label="申请单位">
            <el-input v-model="formLabelAlign.company" disabled></el-input>
          </el-form-item>
          <el-form-item label="数据类别">
            <el-input v-model="formLabelAlign.dataType" disabled></el-input>
          </el-form-item>
          <!-- <el-form-item label="卫星">
            <el-input v-model="formLabelAlign.site"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="起始时间">
            <el-date-picker
              style="width: 100%;"
              v-model="formLabelAlign.startTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
        </el-form>
        <el-form class="elForm" :label-position="labelPosition" label-width="120px" :model="formLabelAlign" :inline="true">
          <el-form-item label="联系方式">
            <el-input v-model="formLabelAlign.phone" disabled></el-input>
          </el-form-item>
          <el-form-item label="使用用途">
            <el-input v-model="applyUserUsed" disabled></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="userCardId" disabled></el-input>
          </el-form-item>
        </el-form>
        <el-form class="elForm" :label-position="labelPosition" label-width="120px" :model="formLabelAlign" :inline="true">
          <el-form-item label="获取方式">
            <el-input v-model="getMethod" disabled></el-input>
          </el-form-item>
          <el-form-item label="附件">
            <el-button type="primary" @click="openUploadFilesDialog"><i class="el-icon-search"></i>&nbsp;查看附件</el-button>
          </el-form-item>
        </el-form>
        <el-form class="elForm" :label-position="labelPosition" label-width="120px" :model="formLabelAlign" :inline="true">
          <el-form-item label="分发省份" v-if="fromShow">
            <el-input v-model="formLabelAlign.province"></el-input>
          </el-form-item>
          <el-form-item label="提取路径" v-if="fromShow">
            <el-input v-model="formLabelAlign.path"></el-input>
          </el-form-item>
          <el-form-item label="产品级别" v-if="levelShow">
            <el-input v-model="levelType"></el-input>
          </el-form-item>
          <el-form-item label="分发市" v-if="fromShow" >
            <el-input v-model="formLabelAlign.city"></el-input>
          </el-form-item>
          <!-- <el-form-item label="传感器">
            <el-input v-model="formLabelAlign.sensor"></el-input>
          </el-form-item> -->
          <!-- <el-form-item label="结束时间">
            <el-date-picker
              style="width: 100%;"
              v-model="formLabelAlign.endTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item> -->
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" style="margin: .2rem 0;">
      <div slot="header" class="clearfix">
        <span>数据信息</span>
      </div>
      <div class="content">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            type="selection">
          </el-table-column>
          <!--<el-table-column-->
            <!--prop="dataid"-->
            <!--label="数据编号"-->
            <!--align="center"-->
            <!--show-overflow-tooltip></el-table-column>-->
          <!--<el-table-column-->
            <!--prop="satelite"-->
            <!--label="卫星"-->
            <!--show-overflow-tooltip-->
            <!--align="center"></el-table-column>-->
          <!--<el-table-column-->
            <!--prop="datasource"-->
            <!--label="数据来源"-->
            <!--show-overflow-tooltip-->
            <!--align="center"></el-table-column>-->
          <el-table-column
            prop="dataname"
            label="数据名称"
            show-overflow-tooltip
            align="center"></el-table-column>
          <el-table-column
            prop="receivetime"
            label="订购时间"
            show-overflow-tooltip
            align="center"></el-table-column>
          <!--<el-table-column-->
            <!--prop="datasize"-->
            <!--label="数据大小"-->
            <!--align="center"></el-table-column>-->
          <el-table-column label="操作" width="400" align="center">
            <template slot-scope="scope">
              <!--<el-button  size="mini" @click="conventionOrderDetail(scope.$index, scope.row)">详情</el-button>-->
              <span>{{scope.row.nodeStatus}}</span>
              <el-button
              v-show="scope.row.nodeShow === 1"
              @click="handleDownlocal(scope.$index, scope.row)">
              <a :href='href' download>{{downLoad[scope.row.nodeShow].label}}</a>
              <!--<a :href='href' download>可下载</a>-->
            </el-button>
              <el-button  disabled
              v-show="scope.row.nodeShow === 0">
              {{downLoad[scope.row.nodeShow].label}}
              <!--<a :href='href' download>可下载</a>-->
            </el-button>
              <!--<el-button v-show="scope.row.status === 3" size="mini" type="danger" @click="distributeAgain(scope.$index, scope.row)">失败数据重新分发</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="total, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog
      style="margin-top: -0.8rem;"
      width="60%"
      title="附件展示"
      :visible.sync="dialogFormVisible"
      id="uploadFilesDialog"
      :close-on-click-modal="false">
      <el-form :model="filesForm" ref="filesForm">
        <el-form-item label="身 份 证" :label-width="formLabelWidth" >
          <identityCard @identityCard="identityCard" class="uploadFilesItemClass" :identityCardSub="identityCardSub" />
        </el-form-item>
        <el-form-item label="介 绍 信" :label-width="formLabelWidth" >
          <introductionLetter @introductionLetter="introductionLetter" class="uploadFilesItemClass" :introductionLetterSub="introductionLetterSub" />
        </el-form-item>
        <el-form-item label="借 阅 证" :label-width="formLabelWidth" >
          <borrowCard @borrowCard="borrowCard" class="uploadFilesItemClass" :borrowCardSub="borrowCardSub" />
        </el-form-item>
        <el-form-item label="其他证件" :label-width="formLabelWidth" >
          <otherDoc @otherDoc="otherDoc" class="uploadFilesItemClass" :otherDocSub="otherDocSub" />
        </el-form-item>
        <el-form-item label="批复文件" :label-width="formLabelWidth">
          <approvalDoc @approvalDoc="approvalDoc" class="uploadFilesItemClass" :approvalDocSub="approvalDocSub" />
        </el-form-item>
      </el-form>
      <!--<div slot="footer" class="dialog-footer" align="center">-->
        <!--<el-button size="small" type="primary" @click="uploadFiles">确定</el-button>-->
        <!--<el-button size="small" @click="dialogFormVisible = false">取消</el-button>-->
      <!--</div>-->
    </el-dialog>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import approvalDoc from '@/hangYao/common/downloadOrderFile/approvalDoc'
import borrowCard from '@/hangYao/common/downloadOrderFile/borrowCard'
import identityCard from '@/hangYao/common/downloadOrderFile/identityCard'
import introductionLetter from '@/hangYao/common/downloadOrderFile/introductionLetter'
import otherDoc from '@/hangYao/common/downloadOrderFile/otherDoc'

export default {
  components: {
    approvalDoc,
    borrowCard,
    identityCard,
    introductionLetter,
    otherDoc
  },
  data () {
    return {
      identityCardList: [],
      introductionLetterList: [],
      borrowCardList: [],
      otherDocList: [],
      approvalDocList: [],
      formLabelWidth: '80px',
      dialogFormVisible: false,
      fromShow: false,
      levelShow: false,
      row: {},
      href: '',
      total: 0,
      currentPage: 1,
      pageSize: 10,
      applyUserUsed: '',
      userCardId: '',
      getMethod: '',
      labelPosition: 'right',
      formLabelAlign: {
        name: '',
        dataType: '',
        use: '',
        site: '',
        company: '',
        phone: '',
        sensor: '',
        startTime: '',
        endTime: ''
      },
      tableData: [],
      id: '',
      downLoad: [
        {
          value: 0,
          label: '处理中'
        },
        {
          value: 1,
          label: '可下载'
        },
        {
          value: 2,
          label: ''
        }
        // {
        //   value:3,
        //   label:'下载失败'
        // },

      ],
      Level: [
        {
          label: '一级',
          value: 1
        },
        {
          label: '二级',
          value: 2
        },
        {
          label: '三级',
          value: 3
        }
      ],
      levelType: 1
    }
  },
  methods: {
    identityCard (val) {
    },
    introductionLetter (val) {
    },
    borrowCard (val) {
    },
    otherDoc (val) {
    },
    approvalDoc (val) {
    },
    intFilesFormList () {
      this.identityCardList = []
      this.introductionLetterList = []
      this.borrowCardList = []
      this.otherDocList = []
      this.approvalDocList = []
    },
    openUploadFilesDialog () {
      this.dialogFormVisible = true
      this.initUploadFilesDialog()
    },
    initUploadFilesDialog () {
      this.intFilesFormList()
      http.orderAttachementGetByOrderId({orderId: this.id}).then(res => {
        if (res.data != null) {
          let obj = res.data
          for (let i = 0; i < obj.length; i++) {
            if (obj[i].type === '1') {
              this.identityCardList.push({name: obj[i].fDataName, url: obj[i].fDataPath})
            } else if (obj[i].type === '2') {
              this.introductionLetterList.push({name: obj[i].fDataName, url: obj[i].fDataPath})
            } else if (obj[i].type === '3') {
              this.borrowCardList.push({name: obj[i].fDataName, url: obj[i].fDataPath})
            } else if (obj[i].type === '4') {
              this.otherDocList.push({name: obj[i].fDataName, url: obj[i].fDataPath})
            } else if (obj[i].type === '5') {
              this.approvalDocList.push({name: obj[i].fDataName, url: obj[i].fDataPath})
            }
          }
        }
      })
    },
    goBack () {
      this.$router.push({name: 'orderManage'})
    },
    conventionOrderDetail (index, row) {
      this.$router.push({name: 'conventionDistributeDetail'})
    },
    distributeAgain (index, row) {
      console.log('功能待开发……')
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.initTable()
    },
    handleDownlocal (index, row) {
      // this.href = 'http://10.1.3.36:9003/orderdata/download?id=' + row.id
      this.href = '/mj/agrsQueryModuleSpatial/getAgrsDataFile?id=' + row.id
    },
    getUserData () {
      http.userGetById().then(res => {
        this.userID = res.data.id
        this.formLabelAlign.name = res.data.nickName
        this.formLabelAlign.company = res.data.name
        this.formLabelAlign.phone = res.data.phoneMobile
      })
    },
    initTableAndDetail () {
      http.getOrderDetail({id: this.id}).then(res => {
        if (res.data.type === 0) {
          res.data.type = '已有产品订单'
          this.levelShow = false
          this.fromShow = false
        } else if (res.data.type === 2) {
          res.data.type = '再加工订单'
          this.levelShow = true
          this.fromShow = false
        } else if (res.data.type === 1) {
          res.data.type = '常规需求订单'
          this.fromShow = false
          this.levelShow = false
        }
        this.formLabelAlign.dataType = res.data.type
      })
      http.orderdataList({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        data: {orderid: this.id}
      }).then(res => {
        let nodeStatus
        let nodeShow
        let a = JSON.parse(sessionStorage.getItem('orderDataID'))
        if (a.status === '审核通过') {
          nodeStatus = a.status
          nodeShow = 0
        } else if (a.status === '订单完成') {
          nodeStatus = a.status
          nodeShow = 1
        } else {
          nodeStatus = a.status
          nodeShow = 2
        }
        if (res.data.list.length !== 0) {
          res.data.list.forEach(item => {
            // item.receivetime = this.commonMethod.timestampToTime(item.receivetime)
            item.receivetime = new Date(item.receivetime).toLocaleString()
            item.datasize = this.commonMethod.dataSizeFormatter(item.datasize)
            item.nodeStatus = nodeStatus
            item.nodeShow = nodeShow
          })
        }
        this.tableData = res.data.list
        this.total = res.data.total
      })
    }
  },
  watch: {
    identityCardList () {
      this.identityCardSub = this.identityCardList
    },
    introductionLetterList () {
      this.introductionLetterSub = this.introductionLetterList
    },
    borrowCardList () {
      this.borrowCardSub = this.borrowCardList
    },
    otherDocList () {
      this.otherDocSub = this.otherDocList
    },
    approvalDocList () {
      this.approvalDocSub = this.approvalDocList
    }
  },
  activated () {
    this.row = JSON.parse(sessionStorage.getItem('orderDataID'))
    this.id = this.row.id
    if (this.row.level) {
      this.levelType = this.Level[this.row.level].label
    }
    if (this.row.applyUserUsed) {
      this.applyUserUsed = this.row.applyUserUsed
    }
    if (this.row.userCardId) {
      this.userCardId = this.row.userCardId
    }
    if (this.row.getMethod) {
      this.getMethod = this.row.getMethod
    }
    this.initTableAndDetail()
    this.getUserData()
    this.initUploadFilesDialog()
  }
}
</script>

<style lang="scss" scoped>
  .el-input, .el-select {
    width: 280px!important;
  }
  #uploadFilesDialog /deep/ .el-dialog__body{
    padding: 10px 20px!important;
  }
  #uploadFilesDialog /deep/ .el-dialog__footer{
    background-color: #F3F3F3!important;
  }
  #uploadFilesDialog /deep/ .el-form-item__label{
    border-left: .1rem solid #2E6CFC;
    margin-top: 5px;
    line-height: 14px;
  }
  #uploadFilesDialog /deep/ .el-upload--picture-card{
    width: 80px;
    height: 80px;
    line-height: 80px!important;
  }
  #uploadFilesDialog /deep/ .el-upload-list--picture-card .el-upload-list__item {
    width: 80px!important;
    height: 80px!important;
    margin-bottom: 0 !important;
  }
  .uploadFilesItemClass {
    width: 95%;
    min-height: 80px;
    padding: 10px;
    padding-bottom: 0px;
    background-color: #F9F9F9!important;
    border: 1px solid #E9E9E9;
  }
.pagination {
  text-align: right;
  width: 100%;
}
</style>
