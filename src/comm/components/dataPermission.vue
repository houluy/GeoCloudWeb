<template>
  <div class="spacialScale">
    <span class="spanClass">空间范围</span>
    <div class="dataTimeRight">
      <div class="radioDiv">
        <el-radio-group style="width: 100%;" @change="radioChange" v-model="radio">
          <el-radio :label="1">行政区划</el-radio>
          <el-radio :label="2">经纬度</el-radio>
          <el-radio :label="3">shp导入</el-radio>
          <el-radio :label="4">无空间范围</el-radio>
        </el-radio-group>
      </div>
      <div class="">
        <el-form style="width: 49%;float: left;"
                 label-position="left"
                 :model="formInline"
                 label-width="110px"
                 class="demo-form-inline">
          <el-cascader v-if="selectDisabled" :props="{ checkStrictly: true }" :show-all-levels="false" :options="country" @change="handleCasderClick" v-model="cascaderCode" clearable></el-cascader>
          <el-form-item v-if="inputDisabled" label="左上角">
            <el-input size="mini" clearable v-model="formInline.leftLong"
                      placeholder="经度"></el-input>
            <el-input size="mini" clearable v-model="formInline.leftLat"
                      placeholder="纬度"></el-input>
          </el-form-item>
        </el-form>
        <el-form style="width: 49%;float: left;"
                 label-position="right"
                 label-width="100px"
                 :model="formInline">
          <el-form-item v-if="inputDisabled" label="右下角">
            <el-input size="mini" clearable v-model="formInline.rightLong"
                      placeholder="经度"></el-input>
            <el-input size="mini" clearable v-model="formInline.rightLat"
                      placeholder="纬度"></el-input>
          </el-form-item>
          <el-form-item v-if="inputDisabled">
            <el-button @click="handleZoom" type="primary" size="mini">定 位</el-button>
          </el-form-item>
        </el-form>
        <div class="" style="margin-top: .2rem;" v-if="buttonDisabled">
          <el-upload action="/mj/upload/Shp"
            :on-success="handleSuccess"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            accept=".zip">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只支持单面的压缩包zip格式</div>
          </el-upload>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface'
import GISMap from '@comm/map/GISMap.js'
const gisMap = new GISMap('dataPermissionMap')
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      cascaderCode: null,
      cascaderValue: [],
      fileList: [],
      radio: null,
      country: [],
      province: null,
      city: null,
      county: null,
      codeFlag: false,
      wktFlag: false,
      buttonDisabled: false,
      inputDisabled: false,
      selectDisabled: false,
      formInline: {
        country: '',
        province: '',
        city: '',
        county: '',
        leftLong: '',
        leftLat: '',
        rightLong: '',
        rightLat: ''
      }
    }
  },
  computed: {
    ...mapState('searchStore', {
      nodeId (state) {
        return state.nodeId
      },
      geometryType (state) {
        return state.geometryType
      },
      wkt (state) {
        return state.wkt
      },
      code (state) {
        return state.code
      }
    }),
    ...mapState('manage', {
      dataPermissionCode (state) {
        return state.dataPermissionCode
      },
      dataPermissionWkt (state) {
        if (state.dataPermissionWkt === '' && state.dataPermissionCode === '') {
          this.radio = 4
          this.buttonDisabled = false
          this.inputDisabled = false
          this.selectDisabled = false
          this.flagNum = 4
        } else if (state.dataPermissionWkt !== '' && state.dataPermissionCode === '') {
          if (state.dataPermissionWkt.indexOf('Polygon') > -1) {
            this.radio = 2
            this.buttonDisabled = false
            this.inputDisabled = true
            this.selectDisabled = false
            this.flagNum = 2
          }
          if (state.dataPermissionWkt.indexOf('MULTIPOLYGON') > -1) {
            this.radio = 3
            this.buttonDisabled = true
            this.inputDisabled = false
            this.selectDisabled = false
            this.flagNum = 3
          }
        } else if (state.dataPermissionWkt === '' && state.dataPermissionCode !== '') {
          this.radio = 1
          this.buttonDisabled = false
          this.inputDisabled = false
          this.selectDisabled = true
          this.flagNum = 1
        }
        // this.radioChange(this.radio)
        return state.dataPermissionWkt
      },
      wktAndCode (state) {
        return state.dataPermissionWkt
      }
    })
  },
  methods: {
    handleCasderClick (val) {
      this.setGeometryType(1)
      this.zoomtoCode(val[val.length - 1])
    },
    countryChange (val) {
      if (val) {
        this.setGeometryType(1)
        this.setCode(val)
        this.setWkt('')
        this.zoomtoCode(val)
        this.formInline.province = ''
        this.formInline.city = ''
        this.formInline.county = ''
        this.province = []
        this.city = []
        this.county = []
        // this.zoomto(val)
        http.getAreaCode({showWkt: false, code: val, qType: 0, showType: 0, showSub: true, showAllSub: false}).then(res => {
          this.province = res.data[0].child
        })
      }
    },
    provinceChange (val) {
      if (val) {
        this.setGeometryType(1)
        this.setCode(val)
        this.setWkt('')
        this.formInline.city = ''
        this.formInline.county = ''
        this.city = []
        this.county = []
        this.zoomtoCode(val)
        http.getAreaCode({showWkt: false, code: val, qType: 0, showType: 0, showSub: true, showAllSub: false}).then(res => {
          this.city = res.data[0].child
        })
      }
    },
    cityChange (val) {
      if (val) {
        this.setGeometryType(1)
        this.setCode(val)
        this.setWkt('')
        this.formInline.county = ''
        this.county = []
        this.zoomtoCode(val)
        http.getAreaCode({showWkt: false, code: val, qType: 0, showType: 0, showSub: true, showAllSub: false}).then(res => {
          this.county = res.data[0].child
        })
      }
    },
    countyChange (val) {
      if (val) {
        this.setGeometryType(1)
        this.setCode(val)
        this.setWkt('')
        this.zoomtoCode(val)
      }
    },
    getAreaCode () {
      this.setCode('000000')
      http.getAreaCode({showWkt: false, code: this.code, qType: 0, showType: 0, showSub: true, showAllSub: true}).then(res => {
        this.valueLabel(res.data)
        this.country = JSON.parse(JSON.stringify(res.data).replace(/child/g, 'children'))
      })
    },
    valueLabel (val) {
      let _this = this
      val.map(item => {
        if (item.child !== undefined && item.child.length > 0) {
          item.value = item.code
          item.label = item.name
          _this.valueLabel(item.child)
        } else {
          item.value = item.code
          item.label = item.name
        }
      })
    },
    zoomtoCode (code) {
      this.$emit('zoomtoCode', code)
    },
    radioChange (val) {
      this.radio = val
      if (val === 1) {
        this.buttonDisabled = false
        this.inputDisabled = false
        this.selectDisabled = true
        this.flagNum = 1
      } else if (val === 2) {
        this.buttonDisabled = false
        this.inputDisabled = true
        this.selectDisabled = false
        this.flagNum = 2
      } else if (val === 3) {
        this.buttonDisabled = true
        this.inputDisabled = false
        this.selectDisabled = false
        this.flagNum = 3
      } else if (val === 4) {
        this.buttonDisabled = false
        this.inputDisabled = false
        this.selectDisabled = false
        this.flagNum = 4
        this.$emit('handleClear', this.flagNum)
      }
    },
    // 多边形定位
    handleZoom () {
      // gisMap.clearAll()
      if (!this.formInline.leftLong) {
        this.$message.error('请填写左上角经度')
        return
      } else {
        if (parseFloat(this.formInline.leftLong) < -180 || parseFloat(this.formInline.leftLong) > 180) {
          this.$message.error('左上角经度请在-180°~+180°之间')
          return
        }
      }
      if (!this.formInline.leftLat) {
        this.$message.error('请填写左上角纬度')
        return
      } else {
        if (parseFloat(this.formInline.leftLat) < -90 || parseFloat(this.formInline.leftLat) > 90) {
          this.$message.error('左上角纬度在-90°~+90°之间')
          return
        }
      }
      if (!this.formInline.rightLong) {
        this.$message.error('请填写右下角经度')
        return
      } else {
        if (parseFloat(this.formInline.rightLong) < -180 || parseFloat(this.formInline.rightLong) > 180) {
          this.$message.error('右下角经度请在-180°~+180°之间')
          return
        }
      }
      if (!this.formInline.rightLat) {
        this.$message.error('请填写右下角纬度')
        return
      } else {
        if (parseFloat(this.formInline.rightLat) < -90 || parseFloat(this.formInline.rightLat) > 90) {
          this.$message.error('右下角纬度在-90°~+90°之间')
          return
        }
      }
      let wkt = `Polygon((${this.formInline.leftLong} ${this.formInline.leftLat}, ${this.formInline.rightLong} ${this.formInline.leftLat}, ${this.formInline.rightLong}  ${this.formInline.rightLat}, ${this.formInline.leftLong} ${this.formInline.rightLat}, ${this.formInline.leftLong} ${this.formInline.leftLat}))`
      this.$emit('handleZoomTo', wkt)
    },
    handleSuccess (response, file, fileList) {
      if (file.status === 'success') {
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
        this.$emit('handleSuccess', response)
      } else {
        this.$message.error('上传失败，请重新上传！')
      }
    },
    handleRemove (file, fileList) {
      this.$emit('handleRemove')
    },
    handlePreview (file) {
      console.log(file)
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length} 个文件`)
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除${file.name}?`, '删除', {
        closeOnClickModal: false
      })
    },
    getContentMapRight () {
      this.$emit('handleHeight')
    },
    ...mapActions('searchStore', {
      setCatalogNodeId: 'setCatalogNodeId',
      setGeometryType: 'setGeometryType',
      setWkt: 'setWkt',
      setCode: 'setCode'
    })
  },
  mounted () {
    this.getAreaCode()
  },
  watch: {
    dataPermissionCode () {
      this.cascaderCode = this.dataPermissionCode
    },
    dataPermissionWkt () {
      if (this.dataPermissionWkt.indexOf('Polygon') > -1) {
        let startIndex = this.dataPermissionWkt.indexOf('Polygon((')
        let endIndex = this.dataPermissionWkt.indexOf('))')
        let str = this.dataPermissionWkt.substring(startIndex + 9, endIndex)
        let strArr = str.split(',')
        let strSub = strArr[0]
        let strSub2 = strArr[2].substring(strArr[2].indexOf(' ') + 1, strArr[2].length)
        this.formInline.leftLong = strSub.split(' ')[0]
        this.formInline.leftLat = strSub.split(' ')[1]
        this.formInline.rightLong = strSub2.split(' ')[0]
        this.formInline.rightLat = strSub2.split(' ')[2]
      }
    }
    // '$route' () {
    //   this.$refs.app.innerHTML = ''
    //   this.$refs.conditionSpan.innerHTML = ''
    //   this.getContentMapRight()
    // }
  }
}
</script>

<style scoped>
.spacialScale>>>.el-form-item{
  margin-bottom: .04rem;
}
.spanClass {
 width: 10%;
 float: left;
 text-align: center;
}
.dataTimeRight {
 width: 89%;
 display: inline-block;
 margin-bottom: 0.2rem;
 margin-left: 0.1rem;
}
.el-radio {
  width: 20%;
}
.cont{
  display: flex;
  align-items: center;
  padding: .3rem 0;
  border-bottom:1px solid #eee;
  font-size:.2rem;
}
.conditionSpan{
  flex: 1;
}
.content{
  flex: 6;
}
.describe>>>.el-form-item__content{
  width: 83%;
}
.upload-demo{
  float: left;
  overflow: hidden;
  margin-left: .2rem;
}
.emergyShow>>>.el-upload-dragger{
  height: .7rem;
  line-height: .7rem;
}
</style>
