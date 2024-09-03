<template>
  <div>
    <imgCarousel></imgCarousel>
    <div class="topcon">
      <span class="spanIcon"></span><span>您现在的位置是：<span class="spanColor"> > 用户指南</span></span>
    </div>
    <div class="conMidlle">
      <div class="conMidlleOne">
        <span class="spantitle">资料下载</span>
        <div class="imgDIV">
          <el-form ref="rules" label-width="80px" class="demo-ruleForm" width="100%">
            <el-form-item label="文件名称" class="time_form">
              <el-input  v-model="filename"></el-input>
            </el-form-item>
            <el-form-item class="time_form">
              <el-button type="primary" @click="searchForm">查询</el-button>
              <el-button @click="resData">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="spanDIV">
          <el-table ref="recordTable"
                    stripe
                    :data="shopTableData"
                    tooltip-effect="dark"
                    :row-key="getRowKeys"
                    style="width: 100%"
                    @select="selectOne"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" :reserve-selection='true' prop="id"></el-table-column>
            <el-table-column prop="F_TITLE" label="资料名称" show-overflow-tooltip >
              <template slot-scope="scope">
                <a style="cursor: pointer" @click="opendown(scope.row.hrefData, scope.row.F_TITLE)">{{scope.row.F_TITLE}}</a>
              </template>
            </el-table-column>
            <el-table-column prop="F_SIZE" label="文件大小" show-overflow-tooltip></el-table-column>
            <el-table-column label="下载">
              <template slot-scope="scope">
                <a :href = scope.row.hrefData :download = "scope.row.F_TITLE+ '.pdf'"><i class="el-icon-download" style="font-size: 15px; color: blue;cursor:pointer;"></i></a>
                <!--<i @click="getDataId(scope.row)" class="el-icon-download" style="font-size: 15px; color: blue;cursor:pointer;"></i>-->
                <!--<img width="16px" height="16px" src="@/assets/img/deleicon.png" alt="" @click="handleDelete(1, scope.row)" >-->
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 10px; height: 30px;">
            <div class="resultPagination">
              <el-pagination
                :current-page="CurrentPage"
                :page-size="PageSize"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 30, 40]"
                layout="total, prev, pager, next, sizes, jumper"
                :total="total">
              </el-pagination>
            </div>
            <!--<div class="resultButton">-->
              <!--<el-checkbox @change="allCheckEvent" v-model="checkedDataAll">全选[反选]</el-checkbox>-->
              <!--<el-button @click="exportData" size="mini" type="primary"><i style="margin-right: 8px;" class="el-icon-download"></i>批量下载</el-button>-->
            <!--</div>-->
          </div>
        </div>
      </div>
    </div>
    <footcom></footcom>
    <el-dialog
      :title="this.titleDialog_titleZ"
      :visible.sync="dialogVisibleDetailZ"
      class="dialog_contentz"
      :append-to-body = 'true'
      width="57%">
      <div class="eldialog_conz">
        <el-image
          v-if="showType"
          style="width: 100%; height:100%;"
          :src="showUrlZ"
          title="点击查看大图"
          :z-index = 'numbIndex'
          :preview-src-list="satelliteImgArr">
          <div slot="error" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
        <!--<img width="100%" height="100%"  :src="showUrlZ" alt="" v-if="showType">-->
        <iframe :src="showUrlZ"  width="100%" height="100%" v-if="!showType"></iframe>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import footcom from '@comm/components/footCom.vue'
import imgCarousel from '@comm/components/imgCarousel.vue'
import axios from 'axios'
export default {
  name: 'index',
  data () {
    return {
      index: '',
      filename: '',
      checkedDataAll: false,
      CurrentPage: 1,
      PageSize: 10,
      total: 1,
      checkDataId: '',
      checkList: [],
      dialogVisibleDetailZ: false,
      satelliteImgArr: [],
      showUrlZ: '',
      titleDialog_titleZ: '',
      showType: false,
      shopTableData: [
        {
          F_TITLE: '地质云遥感数据订购流程说明',
          F_SIZE: '6.6M',
          hrefData: '../static/dzyGuide.pdf'
        },
        {
          F_TITLE: '国产资源卫星知多少',
          F_SIZE: '5.8M',
          hrefData: '../static/gczywx.pdf'
        }

      ]
    }
  },
  components: {
    footcom,
    imgCarousel
  },
  methods: {
    resData () {
      this.filename = ''
    },
    opendown (val, title) {
      this.dialogVisibleDetailZ = true
      this.showUrlZ = val
      this.titleDialog_titleZ = '附件预览—' + title + '.pdf'
      if (val.indexOf('jpg') > -1) {
        this.showType = true
      } else {
        this.showType = false
      }
    },
    searchForm () {
      // http.getZLtabelD({
      //   fTitle: this.filename,
      //   currentPage: this.CurrentPage,
      //   pageSize: this.PageSize
      // }).then(res => {
      //   if (res.data && res.data.records.length > 0) {
      //     this.shopTableData = res.data.records
      //     this.total = res.data.total
      //   } else {
      //     this.$message({
      //       message: '暂无数据！',
      //       type: 'warning'
      //     })
      //     this.shopTableData = []
      //     this.total = 0
      //   }
      //   console.log(res, '00000')
      // })
    },
    handleSelectionChange (val) {
      console.log(val, 'u239592345')
      if (val.length === this.shopTableData.length) {
        this.checkedDataAll = true
      } else {
        this.checkedDataAll = false
      }
      this.checkList = val
      this.checkDataId = []
      if (val.length > 0) {
        val.forEach(e => {
          this.checkDataId.push(e.id)
        })
      }
      this.exportData()
    },
    handleSizeChange (val) {
      this.PageSize = val
      this.searchForm()
    },
    handleCurrentChange (val) {
      this.CurrentPage = val
      this.searchForm()
    },
    getDataId (val) {
      // this.checkDataId = [val.id]
      // this.exportData()
      // ================
      // let name = val.F_OUTURL.split('/')
      // this.downloadPDF(val.F_OUTURL, name[name.length - 1])
      // ========================
      // window.location.href = val.hrefData
    },
    downloadPDF (url, fileName) {
      axios({
        method: 'get',
        responseType: 'arraybuffer',
        url: url
      }).then(function (res) {
        // 调用下载方法，把后端传过来的流传给fileDownload方法
        this.fileDownload(res.data, fileName)
        console.log(res.data, fileName)
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
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    },
    exportData () {
      http.getExportData({
        id: this.checkDataId
      }).then(res => {
        console.log(res, '234235341')
      })
    },
    getRowKeys (row) {
      return row.id
    },
    selectOne () {
      if (this.checkedDataAll) {
        this.checkedDataAll = false
      }
    },
    allCheckEvent () {
      this.$nextTick(() => {
        let that = this
        if (that.checkedDataAll) {
          that.shopTableData.forEach(row => {
            that.$refs.recordTable.toggleRowSelection(row, true)
          })
        } else {
          that.$refs.recordTable.clearSelection()
        }
      })
    }
  },
  mounted () {
    // this.searzchForm()
  },
  watch: {
    shopTableData: {
      handler (value) {
        this.$nextTick(() => {
          if (this.checkedDataAll) {
            let that = this
            let len = that.checkList.length
            value.forEach(row => {
              for (let i = 0; i < len; i++) {
                if (row.id === that.checkList[i].id) {
                  that.$refs.recordTable.toggleRowSelection(row, false)
                  break
                } else {
                  that.$refs.recordTable.toggleRowSelection(row, true)
                }
              }
            })
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style scoped>
  .topcon{
    /*width: 100%;*/
    padding: 0 15%;
    line-height: 40px;
    background-color: #E9EDF8;
  }
  .time_form{
    width: 33%;
    float: left;
  }
  .conMidlle{
    width: 70%;
    min-height: 40vh;
    background-color: #F8F8F8;
    padding: 1% 15% 2% 15%;
  }
  .conMidlleOne{
    width: 100%;
    background: #fff;
    padding-bottom: 2%;
  }
  .resultPagination{
    float: right;
    margin-top: 10px;
  }
  .resultButton{
    float: left;
    margin-top: 10px;
  }
  .spanIcon{
    width: 10px;
    height: 10px;
    background: blue;
    display: inline-block;
    /* position: relative; */
    /* top: 0; */
    border-radius: 50%;
    margin-right: 10px;
  }
  .spanColor{
    color: #0540d5;
  }
  .spantitle{
    display: inline-block;
    width: 98%;
    text-align: left;
    font-size: 18px;
    line-height: 50px;
    margin: 0 1%;
    border-bottom: 1px solid #DCDCDC;
  }
  .eldialog_conz{
    height: 60vh;
  }
  .imgDIV{
    width: 98%;
    margin: 1% 1%;
    padding-top: 1%;
    height: 45px;
    background-color: #F1F4F9;
  }
  .spanDIV{
    width: 98%;
    margin: 1% 1%;
  }
  .spanList{
    display: inline-block;
    width: 43%;
    margin-left: 7%;
    line-height: 7vh;
  }
  .resultButton>>>.el-checkbox{
    margin: 0 10px !important;
  }
  .resultButton>>>.el-checkbox__label {
    font-size: 13px !important;
    font-weight: bold;
  }
  .spanDIV>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
  }
  .spanDIV>>>.el-table th{
    text-align: center !important;
  }
  .spanDIV>>>.el-table td{
    text-align: center !important;
  }
</style>
