<template>
  <el-dialog
    title="修改权限"
    style="top: -60px;"
    :visible.sync="openFlag"
    v-if="openFlag"
    width="58%"
    :close-on-click-modal="false"
    @close="closeDialog"
  >
    <el-tabs v-model="this.activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane name="first" label="功能权限">
        <div style="width: 100%;height: 7rem;">
          <el-scrollbar style="height: 100%;">
            <el-tree
              class="treeMenu"
              ref="tree"
              :data="treeData"
              :show-checkbox="true"
              node-key="id"
              :check-strictly="checkStrictly"
              :default-checked-keys="checkedKeyNodes"
              :expand-on-click-node="false">
            </el-tree>
          </el-scrollbar>
        </div>
      </el-tab-pane>
      <el-tab-pane name="second" label="数据权限">
        <!-- <cy-tree :menuTreeData="menuTreeData" style="width: 19%" /> -->
        <div style="width: 24%;height: 7rem;float: left;">
          <el-scrollbar style="height: 100%;">
            <el-tree
              class="treeMenu"
              ref="dataTree"
              :data="menuTreeData"
              :show-checkbox="true"
              :default-checked-keys="dataCheckedKeyNodes"
              node-key="id"
              :check-strictly="dataCheckStrictly"
              :expand-on-click-node="false">
            </el-tree>
          </el-scrollbar>
        </div>
        <div style="width: 75%;height: 7rem;float: right;">
          <el-scrollbar style="height: 100%;">
            <div style="width: 98%;" class="permissionDialogMap">
              <div ref="contentMapRight" id="gisMapContent" class="contentMapRight">
                <div ref="mapDiv" id="mapDiv" class="map" style="height: 100%;border: none;"></div>
              </div>
            </div>
            <dataPermission @handleSuccess="handleSuccess" @handleRemove="handleRemove" @handleZoomTo="handleZoomTo" @zoomtoCode="zoomto" @handleClear="handleClear" />
          </el-scrollbar>
        </div>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="updateRolePermissionOwn">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as MapData from '@comm/static/mapData.js'
import http from '@comm/service/interface'
import cyTree from '@comm/components/cy-tree.vue'
import dataPermission from '@comm/components/dataPermission'
// import { gisMap } from '@/map/map_globel.js'
import featureUtils from '@comm/map/lib/featureUtils'
import GISMap from '@comm/map/GISMap.js'
const gisMap = new GISMap('permissionDialogMap')
const { baseMapInitParameters } = MapData
export default {
  components: { cyTree, dataPermission },
  data () {
    return {
      flagNumber: null,
      dataCheckStrictly: false,
      checkStrictly: false,
      openFlag: false,
      checkedKeyNodes: [],
      dataCheckedKeyNodes: [],
      treeData: [],
      // activeName: 'first',
      dataPermissionWKTVal: [],
      dataPermissionCodeVal: '',
      menuTreeData: []
    }
  },
  props: ['getCheckedKeys', 'updateRolePermission', 'menuData', 'activeName', 'spatialWktValue', 'spatialCodeValue'],
  computed: {
    activeIndexName: function () {
      return this.activeName
    },
    spatialWktVal: function () {
      return this.spatialWktValue
    },
    spatialCodeVal: function () {
      // console.log(this.spatialCodeValue)
      return this.spatialCodeValue
    }
  },
  watch: {
    openFlag (val) {
      if (val) {
        this.baseMapInit()
      }
    }
  },
  methods: {
    baseMapInit () {
      gisMap.baseMapInit(baseMapInitParameters, () => {}, 'mapDiv', false)
    },
    handleClick (tab) {
      if (tab.name === 'second') {
        this.$nextTick(() => {
          if (this.$refs.mapDiv.innerHTML === '') {
            gisMap.clearAll()
            this.baseMapInit()
          }
          if (this.spatialWktVal.length > 0) {
            let feature = {
              'attributes': {

              },
              'style': {
                fillcolor: 'rgba(255, 255, 255, 0)',
                strokecolor: 'red',
                strokewidth: 1
              },
              'geometry': this.spatialWktVal
            }
            let f = gisMap.transformFeatureFromWkt(this.spatialWktVal)
            gisMap.addPolygon(feature)
            gisMap.zoomToPolygon(f, 8)
          } else if (this.spatialCodeVal !== '') {
            this.codePosition(this.spatialCodeVal)
          }
        })
      }
    },
    handleClear (val) {
      this.flagNumber = val
    },
    handleZoomTo (val) {
      gisMap.clearAll()
      // let arr = []
      this.dataPermissionWKTVal = []
      this.dataPermissionCodeVal = ''
      this.dataPermissionWKTVal.push(val)
      for (var i = 0; i < this.dataPermissionWKTVal.length; i++) {
        let feature = {
          'attributes': {

          },
          'style': {
            fillcolor: 'rgba(255, 255, 255, 0)',
            strokecolor: 'red',
            strokewidth: 1
          },
          'geometry': this.dataPermissionWKTVal[i]
        }
        let f = gisMap.transformFeatureFromWkt(this.dataPermissionWKTVal[i])
        gisMap.addPolygon(feature)
        gisMap.zoomToPolygon(f, 8)
      }
    },
    zoomto (val) {
      gisMap.clearAll()
      this.dataPermissionWKTVal = []
      this.dataPermissionCodeVal = ''
      this.dataPermissionCodeVal = val
      this.codePosition(this.dataPermissionCodeVal)
    },
    handleSuccess (val) {
      gisMap.clearAll()
      this.dataPermissionWKTVal = []
      this.dataPermissionCodeVal = ''
      this.dataPermissionWKTVal.push(val.data[0])
      let feature = {
        'attributes': {},
        'style': {
          fillcolor: 'rgba(255, 255, 255, 0)',
          strokecolor: 'red',
          strokewidth: 2
        },
        'geometry': val.data[0]
      }
      // 添加面到地图
      gisMap.addPolygon(feature, 'featuresSourceAllImage')
      gisMap.flyTo(featureUtils.transformFeatureFromWkt(feature.geometry), () => {}) // 定位
    },
    handleRemove () {
      gisMap.clearAll()
    },
    // code定位
    codePosition (code) {
      http.getAreaWkt({
        code
      }).then(res => {
        let wktResponse = res.data
        let feature = {
          'attributes': {

          },
          'style': {
            fillcolor: 'rgba(255, 255, 255, 0)',
            strokecolor: 'red',
            strokewidth: 2
          },
          'geometry': wktResponse
        }
        // this.setWkt('') // 之前注释掉是因为行政区划这样查询太慢,这个修改成传code到后台联查,现在这里清空是为了使用code查询时候不熟wkt的干扰
        gisMap.drawPolygon(feature)
        let f = gisMap.transformFeatureFromWkt(wktResponse)
        // 飞到某地
        gisMap.flyTo(f, () => {})
      })
    },
    // 关闭对话窗
    closeDialog () {
      this.$emit('handlePermissionClose')
      this.openFlag = false
      // this.buttonDisabled = false
      // this.inputDisabled = false
      // this.selectDisabled = true
    },
    setCheckedKeyNodes (treeData, check) {
      this.checkStrictly = true
      this.treeData = treeData
      this.$nextTick(() => {
        this.$refs['tree'].setCheckedKeys(check)
      })
      this.$nextTick(() => {
        this.checkStrictly = false
      })
    },
    setDataCheckedKeyNodes (treeData, check) {
      this.dataCheckStrictly = true
      this.menuTreeData = treeData
      this.$nextTick(() => {
        this.$refs['dataTree'].setCheckedKeys(check)
      })
      this.$nextTick(() => {
        this.dataCheckStrictly = false
      })
    },
    // 提交选中节点
    updateRolePermissionOwn () {
      if (this.flagNumber === 4) {
        gisMap.clearAll()
        this.dataPermissionWKTVal = []
        this.dataPermissionCodeVal = ''
      }
      this.$emit('updateRolePermission', {
        checkedKeys: this.$refs['tree'].getCheckedKeys(),
        halfCheckedKeys: this.$refs['tree'].getHalfCheckedKeys(),
        dataCheckedKeys: this.$refs['dataTree'].getCheckedKeys(),
        dataHalfCheckedKeys: this.$refs['dataTree'].getHalfCheckedKeys(),
        dataPermissionCodeVal: this.dataPermissionCodeVal,
        dataPermissionWKTVal: this.dataPermissionWKTVal[0]
      })
      // this.$emit('updateDataRolePermission', {
      //   halfCheckedKeys: this.$refs['dataTree'].getHalfCheckedKeys(),
      // })
    },
    getCheckedKeysOwn (val) {
      console.log(val)
    }
  }
}
</script>

<style>
.contentMapRight {
  width: 100%;
  height: 4.4rem;
  border:1px solid rgba(232,236,251,1);
  overflow: hidden;
  position: relative;
  z-index: 0;
  margin-bottom: .2rem;
}
  .radioDiv{
    padding-bottom: 10px;
  }
</style>
