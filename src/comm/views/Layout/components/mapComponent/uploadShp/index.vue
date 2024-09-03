<template>
  <div>
    <el-upload action="/mj/agrsQueryModuleSpatial/agrsShp" :on-success="handleSuccess" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="fileList" accept=".zip">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只支持压缩包zip格式</div>
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
import http from '@comm/service/interface.js'
export default {
  data () {
    return {
      fileList: [],
      yxData: []
    }
  },
  methods: {
    handleSuccess (response, file, fileList) {
      
      this.yxData.type = '切换'
      this.yxData.tableShowYx = 'none'
      this.setAllYxData({yxData: this.yxData})
      gisMap.clearAllFeatures()
      // console.log(fileList, '66767')
      // this.fileList = []
      if (fileList && fileList.length > 1) {
        this.fileList = [fileList[1]]
      }
      console.log(response, 'response')
      let n = 0
      if (response[0]) {
        n = (response[0].split('POLYGON')).length
      }
      if (n > 2 || response.length === 0) {
        this.$message({
          message: '请使用单面矢量数据或者合并后的多面矢量数据执行数据查询！',
          type: 'warning'
        })
        this.fileList = []
      } else {
        // this.setQueryStatus(1)
        // http.getWKTToSQL({wkt: response[0]}).then(res => {
        //   this.setWkt(res.data)
        // })
        // this.setActiveName('condition')
        // this.$message({
        //   message: '上传成功！',
        //   type: 'success'
        // })
        if(response[0] === '当前shp拐点数据大于2W个,请处理拐点数'){
          this.$message({
            message: '上传成功，但'+response[0],
            duration: 10000,
            type: 'error'
          })
          return
        }else{
          this.$message({
            message: '上传成功！',
            type: 'success'
          })
          this.setQueryStatus(1)
          http.getWKTToSQL({wkt: response[0]}).then(res => {
            this.setWkt(res.data)
          })
          this.setActiveName('condition')
        }
      }
      if (file.status === 'success') {
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
          gisMap.flyTo(gisMap.transformFeatureFromWkt(response[i]))
          // gisMap.addPolygon(feature, 'featuresSourceAllImage')
        }
        // this.$store.dispatch('getWkt', response[0], false)
      } else {
        // this.$message.error('上传失败，请重新上传！')
        // this.$notify.error({
        //   message: '上传失败，请重新上传！',
        //   position: 'bottom-right',
        //   duration: 0
        // })
        this.$message({
          message: '上传失败，请重新上传！',
          type: 'error'
        })
      }
    },
    handleRemove (file, fileList) {
      gisMap.drawSoruceVectorLayer.getSource().clear()
      gisMap.featuresSourceVectorLayer.getSource().clear()
      gisMap.featuresSourceVectorLayerPageImage.getSource().clear()
      gisMap.featuresSourceVectorLayerAllImage.getSource().clear()
    },
    handlePreview (file, fileList) {
      // this.fileList = []
      // console.log(file, fileList, '000000')
    },
    handleExceed (files, fileList) {
      // this.fileList = []
      // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`)
      // this.$notify({
      //   message: '当前限制选择 1 个文件，请删除现有文件在上传！',
      //   position: 'bottom-right',
      //   type: 'warning',
      //   duration: 3500
      // })
      // this.$message({
      //   message: '当前限制选择 1 个文件，请删除现有文件在上传！',
      //   type: 'warning'
      // })
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除${file.name}?`)
    },
    ...mapActions('searchStore', {
      setWkt: 'setWkt',
      setQueryStatus: 'setQueryStatus',
      setActiveName: 'setActiveName'
    }),
    ...mapActions('news',{
        setAllYxData: 'setAllYxData'
      })
  }

}
</script>
<style scoped>
</style>
