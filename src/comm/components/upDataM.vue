<template>
  <el-upload
    class="upload-demo"
    action="/mj/agrsOrderAttachement/upload"
    :show-file-list = 'showList'
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :before-upload="beforeAvatarUpload"
    :on-success="handlePictureCardPreview"
    multiple
    :on-exceed="handleExceed">
    <el-button size="small" type="primary">导入模板</el-button>
    <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
  </el-upload>
</template>
<script>
  export default {
    data() {
      return {
        showList: false,
        fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}]
      };
    },
    methods: {
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handlePictureCardPreview (response, file, fileList) {
        this.closeFullScreen(this.openFullScreen())
        if (file.status === 'success') {
          this.$message({
            message: '上传成功！',
            type: 'success'
          })
          this.$emit('toolsFeatureExecl', file)
        } else {
          this.$message({
            message: '上传失败！',
            type: 'error'
          })
        }
      },
      beforeAvatarUpload (file) {
        this.openFullScreen()
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
    }
  }
</script>

<style scoped>
.upload-demo{
  float: right;
  margin-left: 15px;
}
</style>
