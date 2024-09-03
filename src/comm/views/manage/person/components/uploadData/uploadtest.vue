<template>
  <div>
    <!--:on-remove="handleRemove"-->
    <el-upload
      multiple
      action="/pushXg/secmep/file/upload"
      ref="upload"
      class="avatar-uploader"
      :show-file-list = 'showListd'
      :accept ="datatype"
      :on-preview="handlePreview"
      :on-success='handleAvatarSuccess'
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <!--<div slot="file" slot-scope="{file}">-->
        <!--<a style="cursor: pointer" class="el-upload-list__item-name" @click="showdialg(file.url, file.name)">-->
          <!--<i class="el-icon-document"></i>{{file.name}}-->
        <!--</a>-->
      <!--<label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>-->
      <!--<i class="el-icon-close" @click="beforeRemove(file, fileList)"></i>-->
      <!--</div>-->
      <el-button :class="{activeOne: labelD === '上传成功', activeTwo: labelD === '上传失败'}" size="small" type="primary">{{labelD}}</el-button>
    </el-upload>
    <el-dialog
      :title="this.titleDialog_title"
      :visible.sync="dialogVisibleDetail"
      class="dialog_content"
      :append-to-body = 'true'
      width="57%">
    <div class="eldialog_conz">
      <img width="100%" height="100%"  :src="showUrl" alt="" v-if="showType">
      <iframe :src="showUrl"  width="100%" height="100%"  v-if="!showType"></iframe>
    </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { SM4Util } from '@comm/service/sm4encry'
export default {
  props: [
    'approvalDocSub', 'approvalDocData'
  ],
  data () {
    return {
      showListd: false,
      disabled: false,
      showType: false,
      list: [],
      labelD: '点击上传',
      showUrl: '',
      titleDialog_title: '123',
      fileList: [],
      datatype: '.jpg,.pdf',
      // fileList: [{
      //   name: 'food.jpeg',
      //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      // }, {
      //   name: 'food2.jpeg',
      //   url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
      // }],
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false,
      dialogVisibleDetail: false,
      indexloading: 0
    }
  },
  methods: {
    handlePreview (file) {
      // File { uid: 1590388217197, name: "123.png", lastModified: 1590203320111, webkitRelativePath: "", size: 51636, type: "image/png" }
      // console.log(file)
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`)
      // this.$message.warning(`只能上传一个文件`)
      // this.$notify.info({
      //   message: '只能上传六个文件',
      //   position: 'bottom-right',
      //   duration: 2500
      // })
    },
    beforeRemove (file, fileList) {
      console.log(fileList, 'fileList')
      // return this.$confirm(`确定移除${file.name}?`)
      return this.$confirm(`确定移除 ${file.name}？`, '提示', {
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        let fileData = []
        fileList.forEach(item => {
          if (item.name !== file.name) {
            fileData.push(item)
          }
        })
        this.fileList = fileData
        this.$message.success('移除成功')
        this.$emit('identityCard', [file, this.fileList])
      })
    },
    ...mapActions('searchStore', {
      setWkt: 'setWkt'
    }),
    showdialg (val, title) {
      this.dialogVisibleDetail = true
      this.showUrl = val
      this.titleDialog_title = '附件预览—' + title
      if (val.indexOf('jpg') > -1) {
        this.showType = true
      } else {
        this.showType = false
      }
    },
    handleAvatarSuccess (response, file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
      this.closeFullScreen(this.openFullScreen())
      if (file.response.data === 'false') {
        this.$message.error(file.name + '上传失败！')
        this.labelD = '上传失败'
      } else {
        this.$message.success(file.name + '上传成功！')
        this.labelD = '上传成功'
      }
      this.$emit('uploadtestData', this.fileList[0].response.data)
    },
    beforeAvatarUpload (file) {
      let isJPG = false
      let arr = ['image/jpeg', 'application/pdf', 'image/png', 'image/gif']
      if (arr.indexOf(file.type) > -1) {
        isJPG = true
      } else {
        isJPG = false
      }
      if (!isJPG) {
        this.$message.error('上传文件只能是图片或者pdf格式!')
      }
      if (isJPG) {
        // 掩面
        this.openFullScreen()
      }
      return isJPG
    },
    beforeUpload (file) {},
    openFullScreen () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    },
    closeFullScreen (loading) {
      loading.close()
    }
  },
  watch: {
    // indexloading: {
    //   handler (newval, oldval) {
    //     let loading = ''
    //     if (newval === 1) {
    //       loading = this.$loading({
    //         lock: true,
    //         text: 'Loading',
    //         spinner: 'el-icon-loading',
    //         background: 'rgba(0, 0, 0, 0.7)'
    //       })
    //       console.log(newval, '1')
    //     } else if (newval === 2) {
    //       loading.close()
    //       this.indexloading = 0
    //       console.log(newval, '2')
    //     }
    //   },
    //   deep: true
    // },
    list () {
      this.$emit('approvalDoc', this.list)
    },
    approvalDocSub () {
      if (this.approvalDocSub === true) {
        this.$refs.upload.clearFiles()
        this.list = []
      }
    },
    approvalDocData: {
      handler (newval, oldval) {
        this.fileList = newval
        console.log(this.fileList, '1231254')
      },
      deep: true
    }
  }
}
</script>
<style scoped lang="scss">
  .avatar-uploader{
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background-size: 100% 100%;
    .el-button--small{
      padding: 6px 15px !important;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 12px;
    color: #3671FC;
    width: 20%;
    height: 20%;
  }
  .avatar {
    width: 70px;
    height: 70px;
    display: block;
  }
  .el-upload--picture-card {
    line-height: 80px!important;
  }
  .eldialog_conz{
    height: 60vh;
  }
  .dialog_contentz {
    .el-dialog__header {
      padding: 10px;
      margin-left: 1%;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog__title {
      line-height: 24px;
      font-size: 17px;
      color: #303133;
      font-weight: bold;
    }
  }
  .dialog_content>>>.el-dialog__body {
    padding: 0 20px 20px 20px;
    background-color: #fff;
  }
  .dialog_content>>>.el-dialog__title {
    line-height: 24px;
    font-size: 17px;
    color: #303133;
    font-weight: bold;
  }
  .activeOne{
    background: #1BBA70;
  }
  .activeTwo{
    background: red;
  }
</style>
