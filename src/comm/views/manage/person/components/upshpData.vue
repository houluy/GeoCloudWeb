<template>
<div>
  <el-upload action="/mj/agrsQueryModuleSpatial/agrsShp" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="1" :on-exceed="handleExceed" :file-list="fileList" accept=".zip">
    <el-button size="small" type="primary">点击上传</el-button>
    <div slot="tip" class="el-upload__tip">只支持单面的压缩包zip格式</div>
  </el-upload>
</div>
</template>

<script>
import {
  gisMap
} from '@comm/map/map_globel.js'
import {
  mapActions
} from 'vuex'
export default {
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    handleSuccess (response, file, fileList) {
      console.log(response, '66767')
      this.setWkt(response[0])
      if (file.status === 'success') {
        // this.$message({
        //   message: '上传成功！',
        //   type: 'success'
        // })
        this.$notify({

          message: '上传成功！',
          position: 'bottom-right',
          type: 'success',
          duration: 1500
        })
        gisMap.drawSoruceVectorLayer.getSource().clear()
        gisMap.featuresSourceVectorLayer.getSource().clear()
        gisMap.featuresSourceVectorLayerPageImage.getSource().clear()
        gisMap.featuresSourceVectorLayerAllImage.getSource().clear()
        // console.log(response)
        for (var i = 0; i < response.length; i++) {
          let feature = {
            'attributes': {},
            'style': {
              fillcolor: 'rgb(255, 255, 255, 0)',
              strokecolor: 'red',
              strokewidth: 2
            },
            'geometry': response[i]
          }
          // 添加面到地图
          gisMap.drawPolygon(feature)
          // gisMap.addPolygon(feature, 'featuresSourceAllImage')
        }
        // this.$store.dispatch('getWkt', response[0], false)
      } else {
        // this.$message.error('上传失败，请重新上传！')
        this.$notify.error({
          message: '上传失败，请重新上传！',
          position: 'bottom-right',
          duration: 0
        })
      }
    },
    handleRemove (file, fileList) {
      gisMap.drawSoruceVectorLayer.getSource().clear()
      gisMap.featuresSourceVectorLayer.getSource().clear()
      gisMap.featuresSourceVectorLayerPageImage.getSource().clear()
      gisMap.featuresSourceVectorLayerAllImage.getSource().clear()
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`)
      this.$notify({

        message: '当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件',
        position: 'bottom-right',
        type: 'warning',
        duration: 3500
      })
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除${file.name}?`)
    },
    ...mapActions('searchStore', {
      setWkt: 'setWkt'
    })
  }

}
</script>
<style scoped>
</style>
