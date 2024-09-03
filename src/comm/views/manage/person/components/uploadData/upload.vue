<template>
  <el-upload
    class="upload-demo"
    action="/mj/agrsOrderAttachement/uploadForJC"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-success='handleAvatarSuccess'
    :before-remove="beforeRemove"
    :on-exceed="handleExceed"
    :limit ='1'
    :disabled = 'disabledD'
    :file-list="fileList">
    <el-button :class="{disabledDC: disabledD}" size="mini" type="primary">点击上传</el-button>
  </el-upload>
</template>
<script>
  export default {
    props: ['disabledD'],
    data() {
      return {
        fileList: []
      }
    },
    methods: {
      handleAvatarSuccess (response, file, fileList) {
        this.$emit('uploadData', response.data)
      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePreview(file) {
        console.log(file)
      },
      handleExceed (files, fileList) {
        this.$message.warning(`只能上传一个文件`)
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`)
      }
    }
  }
</script>
<style>
  .disabledDC{
    background-color: #afafaf !important;
  }
</style>
