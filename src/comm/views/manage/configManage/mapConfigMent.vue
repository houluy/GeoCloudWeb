<template>
  <div>
    <!-- <div class="configTopP">
      <img src="@/assets/img/configP.png" height="40" width="5"/>
      <span class="spanConfig">地图配置</span>
    </div> -->
    <div class="configFrame" >
      <span style="font-size: 18px;display:block;margin: 20px 0 20px 30px;">基础地图配置</span>
      <el-form :label-position="labelPosition" :inline="true" :model="formInline" class="demo-form-inline" style="margin: 20px 0 0 50px; width: 800px;" label-width="80px">
        <el-form-item label="矢量地图">
          <el-input v-model="formInline.vectorMap" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button disabled style="background-color: rgba(153, 153, 153, 1);">设为默认</el-button>
        </el-form-item>
        <el-form-item label="影像地图">
          <el-input v-model="formInline.imageMap" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" >设为默认</el-button>
        </el-form-item>
        <el-form-item label="三维地图">
          <el-input v-model="formInline.threeMap" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">设为默认</el-button>
        </el-form-item>
        <el-form-item label="服务Token">
        <el-input v-model="formInline.serviceToken" placeholder="" style="width: 600px;"></el-input>
      </el-form-item>
      </el-form>
    </div>
    <div class="configFrame" >
      <span style="font-size: 18px;display:block;margin: 20px 0 20px 30px;">地图蒙版</span>
      <el-form :label-position="labelPosition" :inline="true" :model="formInline" class="demo-form-inline" style="margin: 20px 0 0 50px; width: 800px;" label-width="80px">
        <el-form-item label="蒙版URL">
          <el-input v-model="formInline.maskURL" placeholder="" style="width: 600px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">设为默认</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="configFrame" >
      <span style="font-size: 18px;display:block;margin: 20px 0 20px 30px;">地图默认展示范围</span>
      <el-form :label-position="labelPosition" :inline="true" :model="formInline" class="demo-form-inline" style="margin: 20px 0 0 50px; width: 800px;" label-width="100px">
        <el-form-item label="行政区划">
          <el-form-item label="国家">
            <el-input v-model="formInline.key" placeholder="" style="width: 200px;">
            </el-input>
          </el-form-item>
          <el-form-item label="省/市/自治区">
            <el-input v-model="formInline.key" placeholder="" style="width: 200px;"></el-input>
          </el-form-item><br>
          <el-form-item label="地级市/区">
            <el-input v-model="formInline.key" placeholder="" style="width: 200px;"></el-input>
          </el-form-item>
          <el-form-item label="县级市/县/区">
            <el-input v-model="formInline.key" placeholder="" style="width: 200px;"></el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="经纬度">
          <el-form-item label="左上角">
            <el-input v-model="formInline.longTopLeft" placeholder="" style="width: 100px;">
            </el-input>
            <el-input v-model="formInline.latTopLeft" placeholder="" style="width: 100px;">
            </el-input>
          </el-form-item>
          <el-form-item label="右下角">
            <el-input v-model="formInline.longTopRight" placeholder="" style="width: 100px;">
            </el-input>
            <el-input v-model="formInline.latTopRight" placeholder="" style="width: 100px;">
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="shp导入">
          <el-form-item label="选择数据">
            <el-input v-model="formInline.key" placeholder="只需选择*.shp文件（经纬度，单要素）" style="width: 500px;">
            </el-input>
            <el-button type="primary" >添加</el-button>
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 50px; float: right">
      <el-button type="primary" @click="initMapConfig" >取消</el-button>
      <el-button type="primary" @click="saveMapConfig">保存</el-button>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface'
import {configManage} from '@comm/static/configManage.js'
import { mapActions } from 'vuex'
export default {
  name: 'mapConfigMent',
  data () {
    return {
      labelPosition: 'right',
      formInline: {
        vectorMap: '',
        imageMap: '',
        threeMap: '',
        serviceToken: '',
        maskURL: '',
        longTopLeft: '',
        latTopLeft: '',
        longTopRight: '',
        latTopRight: ''
      }
    }
  },
  methods: {
    initMapConfig () {
      let formData = configManage.getConfigSation()
      this.formInline = formData
    },
    saveMapConfig () {
      var infos = [
        {id: '', sysKey: 'vectorMap', sysValue: this.formInline.vectorMap},
        {id: '', sysKey: 'imageMap', sysValue: this.formInline.imageMap},
        {id: '', sysKey: 'threeMap', sysValue: this.formInline.threeMap},
        {id: '', sysKey: 'serviceToken', sysValue: this.formInline.serviceToken},
        {id: '', sysKey: 'maskURL', sysValue: this.formInline.maskURL},
        {id: '', sysKey: 'longTopLeft', sysValue: this.formInline.longTopLeft},
        {id: '', sysKey: 'latTopLeft', sysValue: this.formInline.latTopLeft},
        {id: '', sysKey: 'longTopRight', sysValue: this.formInline.longTopRight},
        {id: '', sysKey: 'latTopRight', sysValue: this.formInline.latTopRight}
      ]
      http.sysSaveSysInfo({
        infos
      }).then(res => {
        if (res.data === 'true') {
          // this.$message({
          //   type: 'success',
          //   message: '保存成功!'
          // })
          this.$notify({

            message: '保存成功！',
            position: 'bottom-right',
            type: 'success',
            duration: 1500
          })
          this.getConfigSation()
          // this.initTableSysConfig()
        } else {
          this.$notify.error({
            message: '保存失败！',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
      this.initMapConfig()
    },
    ...mapActions('configManage', {
      getConfigSation: 'getConfigSation'
    })
  },
  mounted () {
    this.initMapConfig()
  }
}
</script>

<style scoped>

</style>
