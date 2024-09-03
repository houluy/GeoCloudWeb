<template>
  <div>
    <!--<el-upload action="/mj/upload/Shp"-->
    <!--:on-success="handleSuccess"-->
    <!--:on-preview="handlePreview"-->
    <!--:on-remove="handleRemove"-->
    <!--:before-remove="beforeRemove"-->
    <!--multiple :limit="1"-->
    <!--:on-exceed="handleExceed"-->
    <!--:file-list="fileList"-->
    <!--accept=".zip">-->
      <!--<el-button size="small" type="primary">点击上传</el-button>-->
      <!--<div slot="tip" class="el-upload__tip">只支持单面的压缩包zip格式</div>-->
    <!--</el-upload>-->
    <el-upload
      action="mj/agrsOrderAttachement/uploadForExl"
      class="upload-demo"
      :show-file-list = 'showList'
      multiple
      :on-change= 'handlechange'
      :before-upload="beforeAvatarUpload"
      :on-success="handlePictureCardPreview"
      :on-exceed="handleExceed"
      :on-remove="handleRemove">
      <el-button size="small" type="primary">文件</el-button>
    </el-upload>
    <!--:limit="1"-->
    <!--<el-dialog :visible.sync="dialogVisible">-->
      <!--<img width="100%" :src="dialogImageUrl" alt="">-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
// import GISMap from '@/map/GISMap'
import { mapActions } from 'vuex'
// var gisMap = new GISMap()
// import { SM4Util } from '@comm/service/sm4encry'
export default {
  data () {
    return {
      showList: false,
      fileList: [],
      imageUrl: '',
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  // props: {
  //   imgData: String
  // },
  props: ['imgData', 'fileD'],
  methods: {
    handlechange (file, fileList) {
      // if (fileList.length > 1) {
      //   fileList.splice(0, 1)
      // }
    },
    handleSuccess (response, file, fileList) {
      console.log(fileList, 'fileList12345')
      if (file.status === 'success') {
        this.$notify.info({
          message: '上传成功',
          position: 'top-right',
          duration: 2000,
          type: 'success'
        })
        // this.$emit('toolsFeature', [response.data, file])
        // this.$store.dispatch('getWkt', response[0], false)
      } else {
        // this.$message.error('上传失败，请重新上传！')
        this.$notify.error({
          message: '上传失败，请重新上传!',
          position: 'top-right',
          duration: 1000
        })
      }
    },
    // handleRemove (file, fileList) {
    //   gisMap.drawSoruceVectorLayer.getSource().clear()
    //   gisMap.featuresSourceVectorLayer.getSource().clear()
    //   gisMap.featuresSourceVectorLayerPageImage.getSource().clear()
    //   gisMap.featuresSourceVectorLayerAllImage.getSource().clear()
    // },
    handlePreview (file) {
      // console.log(file)
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`)
      // this.$message.warning(`只能上传一个文件`)
      this.$notify.info({
        message: '只能上传一个文件',
        position: 'bottom-right',
        duration: 2500
      })
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除${file.name}?`)
    },
    ...mapActions('searchStore', {
      setWkt: 'setWkt'
    }),
    handleRemove (file, fileList) {
      // console.log(file, fileList)
    },
    handlePictureCardPreview (response, file, fileList) {
      if (file.status === 'success') {
        // this.$message({
        //   message: '上传成功！',
        //   type: 'success'
        // })
        this.$notify({

          message: '上传成功',
          position: 'bottom-right',
          duration: 2000,
          type: 'success'
        })
        if (fileList.length > 0) {
          for (let i = 0; i < fileList.length; i++) {
            fileList[i].index = i + 1
          }
        }
        this.$emit('toolsFeatureExecl', [response.data, file, fileList])
        // this.$emit('toolsFeature', response)
        // this.$store.dispatch('getWkt', response[0], false)
      } else {
        // this.$message.error('上传失败，请重新上传！')
        this.$notify.error({
          message: '上传失败，请重新上传!',
          position: 'bottom-right',
          duration: 2000
        })
      }
      // response.data = SM4Util.decryptData_ECB(response.data).slice(1, SM4Util.decryptData_ECB(response.data).length - 1)
      // console.log(response.data)
      // this.dialogImageUrl = response.data
      // this.$emit('toolsFeature', this.dialogImageUrl)
      // this.dialogVisible = true;
    },
    beforeAvatarUpload (file) {
      this.fileList = []
      // const isJPG = file.type === 'image/jpeg'
      const isname = file.name
      // if (/.*[\u4e00-\u9fa5]+.*$/.test(isname)) {
      //   this.$notify.error({
      //     message: '不能包含汉字',
      //     position: 'bottom-right',
      //     duration: 0
      //   })
      // }
      // const isLt2M = file.size / 1024 / 1024 < 2
      if (!(file.type === 'xls' || file.type !== 'xlas')) {
        this.$message.error('上传文件格式错误!')
      }
      // if (!isLt2M) {
      //   // this.$message.error('上传头像图片大小不能超过 2MB!')
      //   this.$notify.error({
      //
      //     message: '上传头像图片大小不能超过2MB！',
      //     position: 'bottom-right'
      //   })
      // }
      return isname
    }
  },
  watch: {
    imgData (val) {
      // console.log(val)
      // console.log(12312)
    },
    fileD (val) {
      console.log(val, 8888)
    }
    // imgData: {
    //   handler (newdata, olddata) {
    //     console.log(newdata)
    //     console.log(olddata)
    //     console.log(124125)
    //     this.dialogImageUrl = newdata
    //     this.dialogVisible = true
    //   }
    // },
    // deep: true // 对象内部属性的监听，关键。
  }
}
</script>
<style scoped>
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
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
