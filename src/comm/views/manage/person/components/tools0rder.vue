<template>
<ul>
  <li style=" width: 1.6rem; line-height: .5rem; font-weight: 400;">
    <el-dropdown trigger="click" placement="bottom-start">
      <span class="el-dropdown-link">
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
        <img src="@/assets/img/shangchuanshp.png" title="上传1shp" alt="" />
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
  <!--<li>-->
  <!--<img @click="OpenMeasureLength" src="@/assets/img/ceju.png" title="测距" alt=""/>-->
  <!--</li>-->
  <!--<li>-->
  <!--<img @click="OpenMeasureArea" src="@/assets/img/cemian.png" title="测面" alt=""/>-->
  <!--</li>-->
  <!--<li>-->
    <!--<img @click="showTuLi" src="@/assets/img/tuli.png" title="图例" alt="" />-->
  <!--</li>-->
  <!--<li>-->
    <!--<img @click="showChaxun" src="@/assets/img/定位.png" title="定点查询" alt="" />-->
  <!--</li>-->
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
// import Bscroll from 'better-scroll'
import uploadShp from './upshpData.vue'
import city from './cityZ.vue'
import {
  mapActions,
  mapState
} from 'vuex'
import styles from '@/assets/css/global.scss'
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
      isShowTuLi: false,
      nodeId: '',
      showChaxunFlag: false,
      str1: [],
      str2: [],
      feature: [],
      gisMapDiaZ: null
    }
  },
  methods: {
    // 放大
    zoomOut () {
      this.clearPointSearch()
      this.gisMapDiaZ.zoomOut()
    },
    // 缩小
    zoomIn () {
      this.clearPointSearch()
      this.gisMapDiaZ.zoomIn()
    },
    showTotalMap () {
      this.clearPointSearch()
      this.gisMapDiaZ.zoomToInitView()
      // this.gisMapDiaZ.baseMapInit(baseMapInitParameters, initcallback, this.gisMapDiaZContentDiv, twoDMapDiv, threeDMapDiv, flage)
    },
    // 平移
    openPan () {
      this.clearPointSearch()
      this.gisMapDiaZ.openPan()
    },
    // 前一视图，后一视图
    prevAndNext (value) {
      this.clearPointSearch()
      this.gisMapDiaZ.computeViewArr(value)
    },
    // 多边形和拉框
    drawRectangleAnddrawPolygon (type) {
      let _this = this
      _this.clearPointSearch()
      // type: 1.Point(点)。2.LineStrin(线)。3.Polygon(多边形)。4.Rectangle(拉框)。
      _this.gisMapDiaZ.openDrawTool(type, function (response) {
        // 回调函数清除上次绘制的图层
        _this.gisMapDiaZ.drawSoruceVectorLayer.getSource().clear()
        _this.gisMapDiaZ.featuresSourceVectorLayerAllImage.getSource().clear()
        _this.gisMapDiaZ.featuresSourceVectorLayerPageImage.getSource().clear()
        _this.setActiveName('condition')
        _this.setWkt(response)
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
      this.gisMapDiaZ.bookList(e)
    },
    // 多边形定位
    handleZoomTo () {
      this.setActiveName('condition')
      this.clearPointSearch()
      this.gisMapDiaZ.clearAll()
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
      let f = this.gisMapDiaZ.transformFeatureFromWkt(wkt)
      // this.gisMapDiaZ.addPolygon(feature)
      this.gisMapDiaZ.drawPolygon(feature)
      this.gisMapDiaZ.zoomToPolygon(f, 8)

      this.setGeometryType(2)
      this.setCode('')
      this.setWkt(wkt)
    },
    showTuLi () {
      this.clearPointSearch()
      if (this.isShowTuLi) {
        this.setTlShow(false)
        this.isShowTuLi = false
      } else {
        this.setTlShow(true)
        this.isShowTuLi = true
      }
    },
    showChaxun () {
      let _this = this
      _this.showChaxunFlag = !_this.showChaxunFlag
      if (_this.showChaxunFlag) {
        // document.body.style.cursor = 'crosshair'
        document.getElementById('mapDiv').style.cursor = 'crosshair'
        _this.setShowPXFlag(true)
        _this.gisMapDiaZ.map.on('singleclick', function (evt) {
          const {coordinate} = evt
          const pixel = _this.gisMapDiaZ.map.getEventPixel(evt.originalEvent)
          _this.feature = []
          _this.gisMapDiaZ.map.forEachFeatureAtPixel(pixel, (feature, layer) => {
            _this.feature.push(feature)
            if (layer) {
              _this.gisMapDiaZ.addPop(coordinate, '', _this.addPopFinish)
            }
          })
        })
      } else {
        // document.body.style.cursor = 'auto'
        // this.gisMapDiaZ.removePop()
        // _this.str2 = []
        _this.clearPointSearch()
      }
    },
    // 弹窗内容回调
    addPopFinish () {
      let _this = this
      var dataArr = []
      var nub = 0
      var tempeArr = _this.feature
      if (!(_this.feature.length === 0 || _this.feature.length === 1)) {
        dataArr = [_this.feature[0]]
        for (let i = 1; i < tempeArr.length; i++) {
          dataArr.forEach(item => {
            if (item.attributes && tempeArr[i].attributes) {
              if (item.attributes.项目名称 === tempeArr[i].attributes.项目名称) {
                nub++
              }
            }
          })
          if (nub === 0) {
            dataArr.push(tempeArr[i])
          }
        }
        _this.feature = dataArr
      }
      let tabelPopdata = []
      let clickInput = document.createElement('div')
      _this.str1 = []
      _this.str2 = []
      clickInput.id = 'test'
      clickInput.style.minWidth = 280 + 'px'
      clickInput.style.marginTop = 20 + 'px'
      // 还不知道feature的格式和内容  究竟是个什么东西
      // _this.feature.forEach(item => {})
      _this.feature.map(item => {
        if (item.attributes) {
          // 添加定位图片
          if (item.attributes.WKTRESPONSE === 'POLYGON((-280.999721527 -89.9999999999999,-281 -89.9999999999999,-281 -89.999721527,-280.999721527 -89.999721527,-280.999721527 -89.9999999999999))') {
            item.attributes.imageurlDQ = require('@/assets/img/images/地球灰.png')
          } else {
            item.attributes.imageurlDQ = require('@/assets/img/images/地球.png')
          }
          tabelPopdata.push(item.attributes)
          if (item.attributes.档案号 !== undefined) {
            _this.str2.push(item.attributes.档案号)
            clickInput.innerHTML += `<div style="width: 100%;margin-bottom: 10px;"><input class="aInput" style="vertical-align: top;width: 9%;" type="checkbox" value="${item.attributes.档案号}" /><a style="cursor: pointer;margin-left: 5px;color: #333;font-weight: 400;display: inline-block;width: 89%;">${item.attributes.档案号}, ${item.attributes.项目名称}</a></div>`
          }
        }
      })
      _this.setTabelPopdata(tabelPopdata)
      document.getElementById('PopInfo').appendChild(clickInput)
      let inputDivs = document.getElementsByClassName('aInput')
      for (var i = 0, len = inputDivs.length; i < len; i++) {
        inputDivs[i].onchange = function () {
          if (this.checked) {
            _this.str1.push(this.value)
          } else {
            let index = _this.str1.indexOf(this.value)
            _this.str1.splice(index, 1)
          }
        }
      }
      document.getElementById('popupCloser').onclick = function () {
        _this.setTabelPopdata([0])
        let testDiv = document.getElementById('test')
        testDiv.parentNode.removeChild(testDiv)
        _this.gisMapDiaZ.removePop()
        // _this.str2 = []
      }
    },
    // 清空定点查询
    clearPointSearch () {
      // this.showChaxunFlag = false
      this.gisMapDiaZ.map.removeEventListener('singleclick')
      // document.body.style.cursor = 'auto'
      document.getElementById('mapDivDialogZ').style.cursor = 'auto'
      this.setShowPXFlag(false)
      // this.gisMapDiaZ.removePop()
      this.str2 = []
    },
    // 点定位
    handlePointZoomTo () {
      this.setActiveName('condition')
      this.clearPointSearch()
      this.gisMapDiaZ.clearAll()
      if (!this.pointLong) {
        // this.$message.error('请填写经度！')
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
      let f = this.gisMapDiaZ.transformFeatureFromWkt(wkt)
      // this.gisMapDiaZ.addPoint(feature)
      this.gisMapDiaZ.drawPolygon(feature)
      this.gisMapDiaZ.zoomToPoint(f, 8)

      let searchWkt = `POINT(${this.pointLong} ${this.pointLat})`
      this.setGeometryType(2)
      this.setCode('')
      this.setWkt(searchWkt)
    },
    // 卷帘
    openSwipe () {
      this.clearPointSearch()
      this.setMenuShow(false)
      this.gisMapDiaZ.mapOpenSwipe()
    },
    // 分屏
    splitScreen () {
      this.clearPointSearch()
      this.gisMapDiaZ.mapSplitInit(4)
    },
    // 测距
    OpenMeasureLength () {
      this.clearPointSearch()
      this.gisMapDiaZ.measureLength()
    },
    // 测面
    OpenMeasureArea () {
      this.clearPointSearch()
      this.gisMapDiaZ.measureArea()
    },
    // 删除所有图层、code、wkt（恢复到初始化）
    deleteSource () {
      this.clearPointSearch()
      this.setCode('')
      this.setWkt('')
      this.settableD('1')
      this.setname('行政区划')
      this.gisMapDiaZ.clearAll()
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
      setWkt: 'setWkt',
      setCode: 'setCode',
      setname: 'setname',
      setActiveName: 'setActiveName',
      setTransition3D: 'setTransition3D',
      setSplitNum: 'setSplitNum',
      setMenuShow: 'setMenuShow',
      settableD: 'settableD',
      setTlShow: 'setTlShow',
      setResultStr: 'setResultStr',
      setResultStr2: 'setResultStr2',
      setTabelPopdata: 'setTabelPopdata',
      setShowPXFlag: 'setShowPXFlag'
    })
  },
  watch: {
    str1 (val) {
      this.setResultStr(val)
    },
    str2 (val) {
      this.setResultStr2(val)
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
    }
  },
  computed: {
    ...mapState('searchStore', {
      cityNameTrue (state) {
        return state.name ? state.name : '行政区划'
      },
      switchingSelectArr (state) {
        return state.switchingSelectArr
      }
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.gisMapDiaZ = window.gisMapDiaZ
      console.log(this.gisMapDiaZ, 'this.gisMapDiaZ')
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
      width: .5rem;
      height: .5rem;
        img {
            width: 0.5rem;
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
</style>
