<template>
  <ul>
    <li style="min-width: 1.6rem; line-height: .5rem; font-weight: 400;text-align: center; background: #fff">
      <el-dropdown trigger="click" placement="bottom-start">
      <span class="el-dropdown-link" style="color: #000;">
        {{cityNameTrue}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
        <el-dropdown-menu class="el-dropdown-menu-coordinate dropdownCity">
          <city />
        </el-dropdown-menu>
      </el-dropdown>
    </li>
    <!--<span class="line"></span>-->
    <li>
      <el-dropdown trigger="click" placement="bottom-start">
      <span class="el-dropdown-link">
        <img src="@/assets/img/shangchuanshp.png" title="上传shp" alt="" />
      </span>
        <el-dropdown-menu class="el-dropdown-menu-coordinate dropdownPos">
          <uploadShp />
        </el-dropdown-menu>
      </el-dropdown>
    </li>
    <!--<li>-->
    <!--<img @click="zoomOut" src="@/assets/img/zoomin.png" alt="" title="放大" />-->
    <!--</li>-->
    <!--<li>-->
    <!--<img @click="zoomIn" src="@/assets/img/zoomout.png" alt="" title="缩小" />-->
    <!--</li>-->
    <!--<li>-->
    <!--<img @click="openPan" src="@/assets/img/pingyi.png" title="平移" alt="" />-->
    <!--</li>-->
    <!--<li>-->
    <!--<img @click="prevAndNext('prev')" src="@/assets/img/prev.png" alt="" title="前一视图" />-->
    <!--</li>-->
    <!--<li>-->
    <!--<img @click="prevAndNext('next')" src="@/assets/img/next.png" alt="" title="后一视图" />-->
    <!--</li>-->
    <!--<span class="line"></span>-->

    <li>
      <img @click="drawRectangleAnddrawPolygon('Point')" src="@/assets/img/dianchaxun.png" title="打点" alt="" />
    </li>
    <li>
      <img @click="drawRectangleAnddrawPolygon('LineString')" src="@/assets/img/xianchaxun.png" title="画线" alt="" />
    </li>
    <li>
      <img @click="drawRectangleAnddrawPolygon('Rectangle')" src="@/assets/img/rect.png" title="拉框" alt="" />
    </li>
    <li>
      <img @click="drawRectangleAnddrawPolygon('Polygon')" src="@/assets/img/duobianxing.png" title="多边形" alt="" />
    </li>
    <!--<li>-->
    <!--<img @click="bookmark($event)" src="@/assets/img/bookmark.png" title="书签" alt="" />-->
    <!--</li>-->
    <li>
      <el-dropdown trigger="click" placement="bottom-start">
      <span class="el-dropdown-link">
        <img src="@/assets/img/pointPosition.png" title="点定位" alt="" />
      </span>
        <el-dropdown-menu class="el-dropdown-menu-coordinate dropdownPos longLat">
          <el-input placeholder="输入经度" v-model="pointLong" size="mini" clearable>
          </el-input>
          <el-input placeholder="输入纬度" v-model="pointLat" size="mini" clearable>
          </el-input>
          <el-button @click="handlePointZoomTo" size="mini" :type="styles.btnColor">定 位</el-button>
        </el-dropdown-menu>
      </el-dropdown>
    </li>
    <li>
      <el-dropdown trigger="click" placement="bottom-start">
      <span class="el-dropdown-link">
        <img src="@/assets/img/jingweidu.png" title="经纬度" alt="" />
      </span>
        <el-dropdown-menu class="el-dropdown-menu-coordinate dropdownPos longLat">
          <el-input placeholder="输入左上角经度" v-model="leftTopLong" size="mini" clearable>
          </el-input>
          <el-input placeholder="输入左上角纬度" v-model="leftTopLat" size="mini" clearable>
          </el-input>
          <el-input placeholder="输入右下角经度" v-model="rightBottomLong" size="mini" clearable>
          </el-input>
          <el-input placeholder="输入右下角纬度" v-model="rightBottomLat" size="mini" clearable>
          </el-input>
          <el-button @click="handleZoomTo" size="mini" :type="styles.btnColor">定 位</el-button>
        </el-dropdown-menu>
      </el-dropdown>
    </li>
    <!--<li>-->
    <!--<img @click="openSwipe" src="@/assets/img/rollerShutters.png" title="卷帘" alt="" />-->
    <!--</li>-->
    <!--<li>-->
    <!--<img @click="splitScreen" src="@/assets/img/split.png" title="分屏" alt="" />-->
    <!--</li>-->
    <!--<span class="line"></span>-->
    <li>
      <img @click="OpenMeasureLength" src="@/assets/img/ceju.svg" title="测距" alt=""/>
    </li>
    <li>
      <img @click="OpenMeasureArea" src="@/assets/img/cemian.svg" title="测面" alt=""/>
    </li>
    <li v-show="toolList">
      <img @click="showTuLi" src="@/assets/img/tuli.png" title="图例" alt="" />
    </li>
    <li :class="{backAction: showChaxunFlag}" v-show="nodeId !== '11311'">
      <img @click="showChaxun" src="@/assets/img/定位.png" title="定点查询" alt="" />
    </li>
    <li>
      <img @click="showTotalMap" src="@/assets/img/quantu.png" title="全图" alt="" />
    </li>
    <li>
      <img @click="deleteSource" src="@/assets/img/icon-z-lajitong.png" title="清除" />
    </li>
    <!--<li>-->
    <!--<img @click="handleTransition($event)" src="@/assets/img/3d.png" alt="" title="2d" />-->
    <!--</li>-->
  </ul>
</template>

<script>
  import {
    gisMap
  } from '@comm/map/map_globel.js'
  // import Bscroll from 'better-scroll'
  import uploadShp from './uploadShp'
  import city from './city'
  import http from '@comm/service/interface'
  import {
    mapActions,
    mapState
  } from 'vuex'
  import styles from '@/assets/css/global.scss'
  import $ from 'jquery'
  import { Notification } from 'element-ui';
  export default {
    name: 'tools',
    components: {
      uploadShp,
      city
    },
    data () {
      return {
        styles,
        leftTopLong: '',
        leftTopLat: '',
        rightBottomLong: '',
        rightBottomLat: '',
        pointLong: '',
        pointLat: '',
        isShowTuLi: true,
        toolList: false,
        showChaxunFlag: false,
        str1: [],
        feature: [],
        yxData: [],
        DDXClist: []
      }
    },
    mounted () {
      if (this.searchIndex > 0) {
        this.deleteSource()
      }
    },
    methods: {
      // 放大
      zoomOut () {
        this.clearPointSearch()
        gisMap.zoomOut()
      },
      // 缩小
      zoomIn () {
        this.clearPointSearch()
        gisMap.zoomIn()
      },
      showTotalMap () {
        // this.clearPointSearch()
        gisMap.zoomToInit()
        // gisMap.baseMapInit(baseMapInitParameters, initcallback, gisMapContentDiv, twoDMapDiv, threeDMapDiv, flage)
      },
      // 平移
      openPan () {
        this.clearPointSearch()
        gisMap.openPan()
      },
      // 前一视图，后一视图
      prevAndNext (value) {
        this.clearPointSearch()
        gisMap.computeViewArr(value)
      },
      // 查询面积判定是否超过全国面积，如果超过不允许进行查询。
      getWktDrawFW(param) {
        http.searchArea({wkt: param}).then(res => {
          if (res.data === 'false') {
            this.$message({
              message: '查询面积超过全国面积，请重新绘制！',
              type: 'warning'
            })
            this.setSearchArea(1)
          } else {
            this.setSearchArea(0)
          }
        })
      },
      // 多边形和拉框
      drawRectangleAnddrawPolygon (type) {
      
        this.yxData.type = '切换'
        this.yxData.tableShowYx = 'none'
        this.setAllYxData({yxData: this.yxData})
        gisMap.clearAllFeatures()
        let _this = this
        _this.clearPointSearch()
        // type: 1.Point(点)。2.LineStrin(线)。3.Polygon(多边形)。4.Rectangle(拉框)。
        gisMap.openDrawTool(type, function (response) {
          // 回调函数清除上次绘制的图层
          gisMap.drawSoruceVectorLayer.getSource().clear()
          gisMap.featuresSourceVectorLayerAllImage.getSource().clear()
          gisMap.featuresSourceVectorLayerPageImage.getSource().clear()
          _this.setActiveName('condition')
          _this.setWkt(response)
          _this.setQueryStatus(0)
          // 在回调函数中进行，范围大小的判断，是否超出范围
          if (type === 'Rectangle' || type === 'Polygon') {
            _this.getWktDrawFW(response)
          }
          let feature = {
            'attributes': {},
            'style': {
              fillcolor: 'rgba(255, 255, 255, 0)',
              strokecolor: 'red',
              strokewidth: 2
            },
            'geometry': response
          }
          let f = gisMap.transformFeatureFromWkt(response)
          // 飞到某地
          gisMap.flyTo(f, () => {})
        }, {
          fillcolor: 'rgba(255,255,255,0)',
          strokecolor: 'red',
          strokewidth: 2
        })
        _this.setGeometryType(2)
        _this.setCode('')
      },
      bookmark (e) {
        this.clearPointSearch()
        gisMap.bookList(e)
      },
      // 多边形定位
      handleZoomTo () {
        this.setActiveName('condition')
        this.clearPointSearch()
        gisMap.clearAll()
        if (!this.leftTopLong) {
          // this.$message.error('请填写左上角经度')
          this.$notify.error({
            message: '请填写左上角经度',
            position: 'bottom-right',
            duration: 0
          })
          return
        } else {
          if (parseFloat(this.leftTopLong) < -180 || parseFloat(this.leftTopLong) > 180) {
            // this.$message.error('左上角经度请在-180°~+180°之间')
            this.$notify.error({
              message: '左上角经度请在-180°~+180°之间',
              position: 'bottom-right',
              duration: 0
            })
            return
          }
        }
        if (!this.leftTopLat) {
          // this.$message.error('请填写左上角纬度')
          this.$notify.error({
            message: '请填写左上角纬度',
            position: 'bottom-right',
            duration: 0
          })
          return
        } else {
          if (parseFloat(this.leftTopLat) < -90 || parseFloat(this.leftTopLat) > 90) {
            // this.$message.error('左上角纬度在-90°~+90°之间')
            this.$notify.error({
              message: '左上角纬度在-90°~+90°之间',
              position: 'bottom-right',
              duration: 0
            })
            return
          }
        }
        if (!this.rightBottomLong) {
          // this.$message.error('请填写右下角经度')
          this.$notify.error({
            message: '请填写右下角经度',
            position: 'bottom-right',
            duration: 0
          })
          return
        } else {
          if (parseFloat(this.rightBottomLong) < -180 || parseFloat(this.rightBottomLong) > 180) {
            // this.$message.error('右下角经度请在-180°~+180°之间')
            this.$notify.error({
              message: '右下角经度请在-180°~+180°之间',
              position: 'bottom-right',
              duration: 0
            })
            return
          }
        }
        if (!this.rightBottomLat) {
          // this.$message.error('请填写右下角纬度')
          this.$notify.error({
            message: '请填写右下角纬度',
            position: 'bottom-right',
            duration: 0
          })
          return
        } else {
          if (parseFloat(this.rightBottomLat) < -90 || parseFloat(this.rightBottomLat) > 90) {
            // this.$message.error('右下角纬度在-90°~+90°之间')
            this.$notify.error({
              message: '右下角纬度在-90°~+90°之间',
              position: 'bottom-right',
              duration: 0
            })
            return
          }
        }
        let wkt = `Polygon((${this.leftTopLong} ${this.leftTopLat}, ${this.rightBottomLong} ${this.leftTopLat},${this.rightBottomLong}  ${this.rightBottomLat},${this.leftTopLong} ${this.rightBottomLat}, ${this.leftTopLong} ${this.leftTopLat}))`
        let feature = {
          'attributes': {
            name: 'ZoomTo'
          },
          'style': {
            fillcolor: 'rgba(255, 255, 255, 0)',
            strokecolor: 'red',
            strokewidth: 1
          },
          'geometry': wkt
        }
        let f = gisMap.transformFeatureFromWkt(wkt)
        // gisMap.addPolygon(feature)
        gisMap.drawPolygon(feature)
        gisMap.zoomToPolygon(f, 8)

        this.setGeometryType(2)
        this.setCode('')
        this.setWkt(wkt)
        this.setQueryStatus(0)
      },
      showTuLi () {
        // this.clearPointSearch()
        this.setTlShow(this.isShowTuLi)
        this.isShowTuLi = !this.isShowTuLi
      },
      showChaxun () {
        let _this = this
        _this.showChaxunFlag = !_this.showChaxunFlag
        if (_this.showChaxunFlag) {
          // document.body.style.cursor = 'crosshair'
          document.getElementById('mapDiv').style.cursor = 'crosshair'
          this.setShowPXFlag(true)
          gisMap.map.on('singleclick', function (evt) {
            const {coordinate} = evt
            // 将定点查询变为后台接口查询，需要将获取到的点wkt转换为矩形，就可以用到索引了
            let wktY = evt.coordinate[0]
            let wktX = evt.coordinate[1]
            let leftTopY = String(Number(wktY+0).toFixed(4))+' '
            let leftTopX = String(Number(wktX+0).toFixed(4))

            let rightTopY = String(Number(wktY+0.0001).toFixed(4))+' '
            let rightTopX = String(Number(wktX+0).toFixed(4))+','

            let rightDownY = String(Number(wktY+0).toFixed(4))+' '
            let rightDownX = String(Number(wktX+0.0001).toFixed(4))+','

            let leftDownY = String(Number(wktY-0.0001).toFixed(4))+' '
            let leftDownX = String(Number(wktX+0).toFixed(4))+','
            let DDCXwkt =
              'POLYGON(('+leftTopY+leftTopX+','
              + ''+rightTopY+rightTopX
              +rightDownY+rightDownX
              +leftDownY+leftDownX
              +leftTopY+leftTopX+'))'
            let objWX = JSON.parse(localStorage.getItem("searchDataToWX"))
            let objBZCP = JSON.parse(localStorage.getItem("searchDataToBZCP"))
            let objZL = JSON.parse(localStorage.getItem("searchDataToZL"))
            let timeZ = new Date()
            let obj = []
            if(objWX === undefined || objWX === null){
              objWX = []
              let time1 = timeZ.setTime(timeZ.getTime() - 3600 * 1000 * 24 * 30)
              objWX.time = time1
            }
            if(objBZCP === undefined || objBZCP === null){
              objBZCP = []
              let time2 = timeZ.setTime(timeZ.getTime() - 3600 * 1000 * 24 * 30)
              objBZCP.time = time2
            }
            if(objZL === undefined || objZL === null){
              objZL = []
              let time3 = timeZ.setTime(timeZ.getTime() - 3600 * 1000 * 24 * 30)
              objZL.time = time3
            }
              if(objWX.time > objBZCP.time && objWX.time > objZL.time){
                obj = objWX
              }
              if(objBZCP.time > objWX.time && objBZCP.time > objZL.time){
                obj = objBZCP
              }
              if(objZL.time > objWX.time && objZL.time > objBZCP.time){
                obj = objZL
              }
            obj.wkt = DDCXwkt
            obj.wktStr = DDCXwkt
            _this.$notify.closeAll()
            _this.$notify({
              message: '定点查询检索中...',
              position: 'bottom-right',
            })
            obj.currentPage = 1
            if(obj.objType === 'WX'){
              if (obj.nodeId.indexOf(',') > -1) {
                http.findPageQueryByNodes(obj).then(res => {
                  _this.feature = []
                  _this.feature = res.data.pageList
                  _this.feature.forEach(data => {
                    data.isSelect = false
                  })
                  console.log(_this.feature)
                  if (_this.feature.length === 0) {
                    // alert("4")
                    gisMap.addPop(coordinate, '', _this.addPopFinish)
                    view.animate({
                      zoom: zoom,
                      center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                    })
                  }
                  if (_this.feature.length > 0) {
                    gisMap.addPop(coordinate, '', _this.addPopFinish)
                    view.animate({
                      zoom: zoom,
                      center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                    })
                  }
                })
              }
              else {
                http.findQuery(obj).then(res => {
                  _this.feature = []
                  _this.feature = res.data.pageList
                  _this.feature.forEach(data => {
                    data.isSelect = false
                  })
                  console.log(_this.feature)
                  if (_this.feature.length === 0) {
                    // alert("4")
                    gisMap.addPop(coordinate, '', _this.addPopFinish)
                    view.animate({
                      zoom: zoom,
                      center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                    })
                  }
                  if (_this.feature.length > 0) {
                    gisMap.addPop(coordinate, '', _this.addPopFinish)
                    view.animate({
                      zoom: zoom,
                      center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                    })
                  }
                })
              }
            }
            if(obj.objType === 'ZL'){
              http.findNewAgrsPageList(obj).then(res => {
                let ZLtableName = localStorage.getItem('ZLtableName',this.tableName)
                _this.feature = []
                _this.feature = res.data.pageList
                _this.feature.forEach(data => {
                  data.isSelect = false
                  data.nodename = ZLtableName
                })
                if (_this.feature.length === 0) {
                  // alert("4")
                  gisMap.addPop(coordinate, '', _this.addPopFinish)
                  view.animate({
                    zoom: zoom,
                    center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                  })
                }
                if (_this.feature.length > 0) {
                  gisMap.addPop(coordinate, '', _this.addPopFinish)
                  view.animate({
                    zoom: zoom,
                    center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                  })
                }
              })
            }
            if(obj.objType === 'BZCP'){
              http.findQuery(obj).then(res => {
                let ZLtableName = localStorage.getItem('ZLtableName',this.tableName)
                _this.feature = []
                _this.feature = res.data.pageList
                _this.feature.forEach(data => {
                  data.isSelect = false
                  data.nodename = ZLtableName
                  data.isShop = false
                })
                if (_this.feature.length === 0) {
                  // alert("4")
                  gisMap.addPop(coordinate, '', _this.addPopFinish)
                  view.animate({
                    zoom: zoom,
                    center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                  })
                }
                if (_this.feature.length > 0) {
                  gisMap.addPop(coordinate, '', _this.addPopFinish)
                  view.animate({
                    zoom: zoom,
                    center: [coordinate[0] + 0.7, coordinate[1] + 0.3]
                  })
                }
              })
            }
            // 判断点击事件是否从弹窗过来，若是阻止，不是放行
            let popDivs = $(evt.originalEvent.target).closest('.feature-popup')
            if (popDivs.length > 0) {
              return
            }
            let view = gisMap.map.getView()
            let zoom = view.getZoom()
            const pixel = gisMap.map.getEventPixel(evt.originalEvent)
          })
          /** **********************详情信息对话框不被左右两边遮挡设置结束***************************/
        } else {
          // document.body.style.cursor = 'auto'
          // document.getElementById('mapDiv').style.cursor = 'auto'
          // gisMap.removePop()
          _this.clearPointSearch()
        }
      },

      // 弹窗内容回调
      addPopFinish () {
        let _this = this
        var dataArr = []
        var nub = 0
        gisMap.productTableCRemove()
        gisMap.productTableHoverRemove()
        // 除去重复数据
        var tempeArr = _this.feature

        if (_this.feature.length > 0) {
          dataArr = _this.feature
          for (let i = 0; i < tempeArr.length; i++) {
            dataArr.forEach(item => {
              if (item != undefined) {
                let showD = false
                this.nodeId
                if (this.nodeIdSerachData || this.nodeId === '1000310') {
                  // 卫星点查
                  // alert("卫星点查")
                  // showD= item.attributes.F_DATANAME === tempeArr[i].attributes.F_DATANAME
                  showD= item.F_DATANAME === tempeArr[i].F_DATANAME
                } else {
                  // alert("资料点查")
                  // 资料点查
                  showD= item.项目名称 === tempeArr[i].项目名称
                }
                if (showD) {
                  nub++
                }
              }
            })
            // 防止有多个重复数据
            if (nub === 0) {
              dataArr.push(tempeArr[i])
            }
          }
          _this.feature = dataArr
        }
        let tabelPopdata = []
        this.nodeNameSingle
        let clickInput = document.createElement('div')
        _this.str1 = []
        clickInput.id = 'test'
        if (!this.nodeIdSerachData) {
          clickInput.style.minWidth = 300 + 'px'
        }
        clickInput.style.marginTop = 20 + 'px'
        _this.feature.forEach(item => {
          if (item != undefined) {
            if (this.nodeIdSerachData || this.nodeId === '1000310') {
              item.imageurlDQ = require('@/assets/images/search/dingwei.png')
              // 卫星显示
              if (item.F_DATANAME !== undefined) {
                tabelPopdata.push(item)
                item.项目名称 = item.F_DATANAME
                clickInput.innerHTML += `<div style="margin-bottom: 10px;">
                      <input class="aInput" style="vertical-align: top; cursor: pointer;" type="checkbox" value="${item.F_DID}" />
                      <a style="margin-left: 5px;color: #333;font-weight: 400;display: inline-block;width: 90%;">${item.F_DATANAME}</a>
                      </div>`
              }
            }
            else {
              // 资料显示
              item.isShop = false
              // 添加定位图片
              if (item.WKTRESPONSE === 'POLYGON((-280.999721527 -89.9999999999999,-281 -89.9999999999999,-281 -89.999721527,-280.999721527 -89.999721527,-280.999721527 -89.9999999999999))') {
                item.imageurlDQ = require('@/assets/images/search/dingwei_n.png')
              } else {
                item.imageurlDQ = require('@/assets/images/search/dingwei.png')
              }
              tabelPopdata.push(item)
              if (item.OBJECTID !== undefined) {
                if (item.档案号 === undefined) {
                  item.档案号 = item.NODEID
                }
                if (item.项目名称 === undefined) {
                  if (item.测区名) {
                    item.项目名称 = item.测区名
                  }
                  if (item.图件名) {
                    item.项目名称 = item.图件名
                  }
                  if (item.图件名称) {
                    item.项目名称 = item.图件名称
                  }
                }
                clickInput.innerHTML += `<div style="width: 100%; margin-bottom: 10px;">
              <input class="aInput" style="vertical-align: top; cursor: pointer; width: 5%;" type="checkbox" value="${item.F_DATAID}" />
              <a style="margin-left: 5px;color: #333;font-weight: 400;display: inline-block;width: 90%;">${item.档案号}, ${item.项目名称}</a></div>`
              } else {
                if (item.NODEID === '11312') {
                  item.项目名称 = item.F_SANAME
                }
                if (item.NODEID === '10141' || item.NODEID === '10142') {
                  item.项目名称 = item.图件名
                }
                if (item.NODEID === '10143') {
                  item.项目名称 = item.F_TJNAME
                }
                if (item.项目名称 === undefined) item.项目名称 = ''
                clickInput.innerHTML += `<div style="width: 100%; margin-bottom: 10px;">
              <input class="aInput" style="vertical-align: top; cursor: pointer; width: 5%;" type="checkbox" value="${item.F_DATAID}" />
              <a style="margin-left: 5px;color: #333;font-weight: 400;display: inline-block;width: 90%;">${item.NODEID}  ${item.项目名称}</a></div>`
              }
            }
          }
        })
        _this.setTabelPopdata(tabelPopdata)
        document.getElementById('PopInfo').style.maxHeight = '30vh'
        document.getElementById('PopInfo').style.overflowY = 'auto'
        document.getElementById('PopInfo').style.paddingRight = '16px'
        document.getElementById('PopInfo').appendChild(clickInput)
        let inputDivs = document.getElementsByClassName('aInput')
        for (var i = 0, len = inputDivs.length; i < len; i++) {
          inputDivs[i].onchange = function () {
            _this.str1 = []
            for (let j = 0; j < inputDivs.length; j++) {
              if (inputDivs[j].checked) {
                _this.str1.push(inputDivs[j].value)
              }
            }
          }
        }
        document.getElementById('popupCloser').onclick = function () {
          _this.setTabelPopdata([1])
          _this.clearPointSearch()
          gisMap.removePop()
        }
      },
      // 添加优选专用
      addYxDataDingdian(val){
        console.log(val)
        let _this = this
        _this.setTabelPopdata([1])
        _this.clearPointSearch()
        gisMap.removePop()
      },
      // 清空定点查询
      clearPointSearch (val) {
        this.showChaxunFlag = false
        if (gisMap.map.removeEventListener && gisMap.map.removeEventListener !== null) {
          gisMap.map.removeEventListener('singleclick')
        }
        document.getElementById('mapDiv').style.cursor = 'default'
        this.setShowPXFlag(false)
        if (gisMap.featurePopInfo.content) {
          gisMap.removePop()
        }
        if (!val) {
          this.setname('行政区划')
        }
      },
      // 点定位
      handlePointZoomTo () {
        this.setActiveName('condition')
        this.clearPointSearch()
        gisMap.clearAll()
        if (!this.pointLong) {
          this.$notify.error({
            message: '请填写经度！',
            position: 'bottom-right',
            duration: 0
          })
          return
        } else {
          if (parseFloat(this.pointLong) < -180 || parseFloat(this.pointLong) > 180) {
            // this.$message.error('左上角经度请在-180°~+180°之间！')
            this.$notify.error({
              message: '左上角经度请在-180°~+180°之间！',
              position: 'bottom-right',
              duration: 0
            })
            return
          }
        }
        if (!this.pointLat) {
          // this.$message.error('请填写纬度！')
          this.$notify.error({
            message: '请填写纬度！',
            position: 'bottom-right',
            duration: 0
          })
          return false
        } else {
          if (parseFloat(this.pointLat) < -90 || parseFloat(this.pointLat) > 90) {
            // this.$message.error('左上角纬度在-90°~+90°之间！')
            this.$notify.error({
              message: '左上角纬度在-90°~+90°之间！',
              position: 'bottom-right',
              duration: 0
            })
            return false
          }
        }
        let wkt = `Polygon((${this.pointLong} ${this.pointLat}, ${this.pointLong} ${this.pointLat}, ${this.pointLong} ${this.pointLat}))`
        let feature = {
          'attributes': {
            name: 'ZoomTo'
          },
          'style': {
            fillcolor: 'red',
            strokecolor: 'red',
            strokewidth: 14,
            imageradius: 17,
            imagefillcolor: 'red'
          },
          'geometry': wkt
        }
        let f = gisMap.transformFeatureFromWkt(wkt)
        // gisMap.addPoint(feature)
        gisMap.drawPolygon(feature)
        gisMap.zoomToPoint(f, 8)

        let searchWkt = `POINT(${this.pointLong} ${this.pointLat})`
        this.setGeometryType(2)
        this.setCode('')
        this.setQueryStatus(0)
        this.setWkt(searchWkt)
      },
      // 卷帘
      openSwipe () {
        this.clearPointSearch()
        this.setMenuShow(false)
        gisMap.mapOpenSwipe()
      },
      // 分屏
      splitScreen () {
        this.clearPointSearch()
        gisMap.mapSplitInit(4)
      },
      // 测距
      OpenMeasureLength () {
        this.clearPointSearch()
        gisMap.measureLength()
      },
      // 测面
      OpenMeasureArea () {
        this.clearPointSearch()
        gisMap.measureArea()
      },
      // 删除所有图层、code、wkt（恢复到初始化）
      deleteSource () {
        this.clearPointSearch()
        this.setCode('')
        this.setWkt('')
        this.setQueryStatus(0)
        this.settableD('1')
        this.setname('行政区划')
        gisMap.clearAll()
        this.setSearchArea(0)
      },
      deleteSourceclear () {
        this.clearPointSearch(true)
        this.setActiveName('condition')
        gisMap.clearAllzh()
      },
      handleTransition (e) {
        if (e.target.title === '3d') {
          this.setTransition3D(false)
          e.target.title = '2d'
          e.target.src = require('@/assets/img/3d.png')
        } else {
          this.setTransition3D(true)
          e.target.title = '3d'
          e.target.src = require('@/assets/img/2d.png')
        }
        // this.setTransition3D()
      },
      ...mapActions('searchStore', {
        setGeometryType: 'setGeometryType',
        setSearchArea: 'setSearchArea',
        setWkt: 'setWkt',
        setQueryStatus: 'setQueryStatus',
        setCode: 'setCode',
        setname: 'setname',
        setActiveName: 'setActiveName',
        setTransition3D: 'setTransition3D',
        setSplitNum: 'setSplitNum',
        setMenuShow: 'setMenuShow',
        settableD: 'settableD',
        setTlShow: 'setTlShow',
        setNewTimeD: 'setNewTimeD',
        setResultStr: 'setResultStr',
        setResultStr2: 'setResultStr2',
        setTabelPopdata: 'setTabelPopdata',
        setClearPoint: 'setClearPoint',
        setShowPXFlag: 'setShowPXFlag'
      }),
      ...mapActions('news',{
          setAllYxData: 'setAllYxData'
      })
    },
    watch: {
      str1 (val) {
        console.log(val, 'str1')
        this.setResultStr(val)
      },
      cleartPoint (val) {
        if (val === 2) {
          this.clearPointSearch()
        } else if (val === 3) {
          this.clearPointSearch(true)
        }
        this.setClearPoint(1)
      },
      switchingSelectArr (val) {
        let inputDivs = document.getElementsByClassName('aInput')
        if (val.length > 0) {
          for (var i = 0, len = inputDivs.length; i < len; i++) {
            if (val.indexOf(inputDivs[i].value) > -1) {
              inputDivs[i].checked = 'checked'
            } else {
              inputDivs[i].checked = false
            }
          }
        } else {
          for (var i = 0, len = inputDivs.length; i < len; i++) {
            if (inputDivs[i].checked) {
              inputDivs[i].checked = false
            }
          }
        }
      },
      newTimed (val) {
        this.toolList = this.toolListData
        if (val !== 0) {
          if (this.searchIndex > 0) {
            this.deleteSourceclear()
          }
          this.setNewTimeD(0)
        }
      },
      switchingSelect(val) {
        this.setSwitchingSelect(val)
      },
    },
    computed: {
      ...mapState('searchStore', {
        cityNameTrue (state) {
          return state.name ? state.name : '行政区划'
        },
        switchingSelectArr (state) {
          return state.switchingSelectArr
        },
        setSwitchingSelect (state) {
          return state.setSwitchingSelect
        },
        searchIndex (state) {
          return state.searchIndex
        },
        newTimed (state) {
          return state.newTimed
        },
        toolListData (state) {
          return state.toolListData
        },
        cleartPoint (state) {
          return state.cleartPoint
        },
        nodeIdSerachData (state) {
          return state.nodeIdSerachData
        },
        nodeId (state) {
          return state.nodeId
        }
      })
    }
  }
</script>

<style lang="scss" scoped>
  ul {
    /*background-color: rgba(255, 255, 255, .8);*/
    padding: 0.1rem;
    li {
      float: left;
      padding: .1rem;
      cursor: pointer;
      /* line-height: 0.5rem; */
      background: #fff;
      margin-left: .1rem;
      background: rgba(255,255,255,0.5);
      box-shadow: 0px 2px 4px 0px rgba(0,0,0,0.1);
      /*width: .5rem;*/
      height: .5rem;
      img {
        width: 0.5rem;
        height: 0.5rem;
      }
    }
    .line {
      display: inline-block;
      width: 1px;
      background-color: #ccc;
    }
  }
  .dropdownPos {
    width: 3rem;
    display: flex;
    flex-direction: column;
    .el-input--mini {
      margin-bottom: 0.1rem;
    }
  }
  .dropdownCity {
    width: 300px;
    height: 335px;
  }
  .backAction{
    background: #e7ea20;
  }
</style>
