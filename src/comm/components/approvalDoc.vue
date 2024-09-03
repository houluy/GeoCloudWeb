<template>
  <div>
    <!--:on-remove="handleRemove"-->
    <el-upload
      multiple
      action="/mj/agrsOrderAttachement/uploadForJC"
      ref="upload"
      class="avatar-uploader"
      :accept ="datatype"
      :on-preview="handlePreview"
      :on-success='handleAvatarSuccess'
      :before-upload="beforeAvatarUpload"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <div slot="file" slot-scope="{file}">
        <!--<a class="el-upload-list__item-name" @click="showdialg(file.url)" :href="file.url" target="_blank" download>-->
        <a style="cursor: pointer" class="el-upload-list__item-name" @click="showdialg(file.url, file.name)">
          <i class="el-icon-document"></i>{{file.name}}
        </a>
        <label class="el-upload-list__item-status-label"><i class="el-icon-upload-success el-icon-circle-check"></i></label>
        <i class="el-icon-close" @click="beforeRemove(file, fileList)"></i>
      </div>
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-dialog
      :title="this.titleDialog_title"
      :visible.sync="dialogVisibleDetail"
      class="dialog_content"
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
        <!--<img width="100%" height="100%"  :src="showUrl" alt="" v-if="showType">-->
        <iframe :src="showUrlZ"  width="100%" height="100%"  v-if="!showType"></iframe>
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
        disabled: false,
        showType: false,
        list: [],
        showUrl: '',
        numbIndex: 4000,
        satelliteImgArr: [],
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
        console.log(val, '444')
        this.dialogVisibleDetail = true
        this.showUrlZ = val
        // this.showUrlZ = 'https://i.loli.net/2021/04/08/ibq2IEAst3GgHaN.png'
        this.satelliteImgArr = [val]
        console.log(this.satelliteImgArr)
        // this.satelliteImgArr = ['https://i.loli.net/2021/04/08/ibq2IEAst3GgHaN.png']
        this.titleDialog_title = '附件预览—' + title
        if (val.indexOf('jpg') > -1) {
          this.showType = true
        } else {
          this.showType = false
        }
      },
      handleAvatarSuccess (response, file, fileList) {
        console.log(response, 'response')
        console.log(file, 'file')
        console.log(fileList, 'fileList')
        let fileArry = []
        // this.indexloading = 2
        this.closeFullScreen(this.openFullScreen())
        if (file.response.data === 'false') {
          this.$message.error(file.name + '上传失败！')
        } else {
          this.$message.success(file.name + '上传成功！')
        }
        if (fileList.length > 0) {
          fileList.forEach(item => {
            if (!item.fDataPath) {
              if (item.response.data !== 'false') {
                item.url = item.response.data
                fileArry.push(item)
              }
            } else {
              fileArry.push(item)
            }
          })
        }
        this.fileList = fileArry
        console.log(file, 'file')
        console.log(fileList, 'fileList')
        this.$emit('identityCard', [file, fileList])
        // let url = SM4Util.decryptData_ECB(response.data).slice(1, SM4Util.decryptData_ECB(response.data).length - 1)
        // let name = url.substring(url.lastIndexOf('/') + 1)
        // this.list.push({filePath: url, fileName: name, fileType: '5'})
      },
      beforeAvatarUpload (file) {
        let isJPG = false
        let arr = ['image/jpeg', 'application/pdf']
        if (arr.indexOf(file.type) > -1) {
          isJPG = true
          // this.indexloading = 1
          // this.openFullScreen()
        } else {
          isJPG = false
        }
        if (!isJPG) {
          this.$message.error('上传文件只能是 JPG 或者pdf 格式!')
        }
        if (this.fileList.length > 0) {
          let repeatLength = 0
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].name === file.name) {
              repeatLength++
            }
          }
          if (repeatLength >= 1) {
            this.$message.error('文件重名')
            isJPG = false
          }
        }
        if (isJPG) {
          // 掩面
          this.openFullScreen()
        }
        return isJPG
      },
      beforeUpload (file) {
        // this.uploadData.confirmIds = []
        // if (this.shareForm.confirmId != null && this.shareForm.confirmId != '') {
        //   this.uploadData.confirmIds.push(this.shareForm.confirmId)
        // }
        if (this.fileList.length > 0) {
          let repeatLength = 0
          for (let i = 0; i < this.fileList.length; i++) {
            if (this.fileList[i].name === file.name) {
              repeatLength++
            }
          }
          if (repeatLength >= 1) {
            this.$message.error('文件重名')
            // this.fileRepeat = true
            return false
          }
        }
      },
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
</style>
