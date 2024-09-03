<template>
<div id="gisMapContent" ref="gisMapContent">
  <Tools id="tools" />
  <div v-if="!mapFlag" ref="mapDiv" id="mapDiv" class="map" :style="{ height: height}"></div>
  <div v-show="mapFlag" ref="cesiumContainer" id="cesiumContainer" class="map" style="height: 100%;"></div>
</div>
</template>

<script>
import {
  gisMap
} from '@comm/map/map_globel.js'
// import {
//   gisMap3D
// } from '@/map/map3d.js'
import Tools from './mapComponent/tools.vue'
import * as MapData from '@comm/static/mapData.js'
import {
  mapActions,
  mapState
} from 'vuex'
const {
  baseMapInitParameters
} = MapData
export default {
  name: 'cy-menu',
  components: {
    Tools
  },
  data () {
    return {
      clientHeight: '',
      point: [],
      mapFlag: false,
      height: ''
    }
  },
  methods: {
    baseMapInit () {
      gisMap.baseMapInit(baseMapInitParameters, () => {
        // gisMap.map.on('click', function (evt) {
        //   const {
        //     coordinate,
        //     frameState
        //   } = evt
        //   const {
        //     extent
        //   } = frameState
        //   const geometry = JSON.stringify({
        //     x: coordinate[0],
        //     y: coordinate[1]
        //   })
        //   const mapExtent = extent.join(',')
        //   const body = {
        //     f: 'json',
        //     Layers: '3',
        //     tolerance: '3',
        //     returnGeometry: false,
        //     imageDisplay: '1600, 757, 96',
        //     geometry,
        //     mapExtent
        //   }
        //   http.identify(body).then(res => {
        //     if (res.results && res.results.length > 0) {
        //       let attributes = res.results[0].attributes
        //       this.createPopup((content) => {
        //         for (let key in attributes) {
        //           if (key === 'FID' || key === 'Shape' || key === 'OBJECTID') continue
        //           content.innerHTML += `<div>
        //             <span>${key}</span> : <span>${attributes[key]}</span>
        //           </div>`
        //         }
        //       }, coordinate)
        //     }
        //   })
        // })
        gisMap.map.on('moveend', gisMap.checkZoomAndCenter.bind(gisMap))
      }, 'gisMapContent', 'mapDiv', 'cesiumContainer')
    },
    ...mapActions('configManage', {
      getConfigSation: 'getConfigSation'
    }),
    ...mapActions('searchStore', {
      setNumberOne: 'setNumberOne'
    }),
    init (val) {
      if (this.navHide) {

      } else {
        // this.$refs.gisMapContent.style.height = (window.screen.height - 264) / 50 + 'rem'
        // this.$refs.gisMapContent.style.height = (val - 102) / 50 + 'rem'
      }
    }
  },
  mounted () {
    this.clientHeight = `${document.documentElement.clientHeight}`// 获取浏览器可视区域高度
    // let that = this
    // window.onresize = () => {
    //   return (() => {
    //     this.clientHeight = `${document.documentElement.clientHeight}`
    //   })()
    // }
    if (this.$refs.mapDiv.innerHTML === '') {
      this.$nextTick(() => {
        gisMap.removeAll()
        this.baseMapInit()
        gisMap.clearAll()
      })
    }
    this.init(this.clientHeight)
    // http.sysInfolist().then(res => {
    //   let data = res.data
    //   let leftTopLong = ''
    //   let leftTopLat = ''
    //   let rightBottomLong = ''
    //   let rightBottomLat = ''
    //   for (let i = 0; i < data.length - 1; i++) {
    //     if (data[i].sysKey === 'vectorMap') {
    //       baseMapInitParameters.layers[0].layerUrl = data[i].sysValue
    //     }
    //     if (data[i].sysKey === 'longTopLeft') {
    //       leftTopLong = data[i].sysValue
    //     }
    //     if (data[i].sysKey === 'latTopLeft') {
    //       leftTopLat = data[i].sysValue
    //     }
    //     if (data[i].sysKey === 'longTopRight') {
    //       rightBottomLong = data[i].sysValue
    //     }
    //     if (data[i].sysKey === 'latTopRight') {
    //       rightBottomLat = data[i].sysValue
    //     }
    //   }
    //   if (leftTopLong !== '') {
    //     let wkt = `Polygon((${leftTopLong} ${leftTopLat}, ${rightBottomLong} ${leftTopLat}, ${rightBottomLong}  ${rightBottomLat}, ${leftTopLong} ${rightBottomLat}, ${leftTopLong} ${leftTopLat}))`
    //     let f = gisMap.transformFeatureFromWkt(wkt)
    //     let polygon = f.getGeometry()
    //     let point = gisMap.getCenterPoint(polygon.getExtent())
    //     baseMapInitParameters.views.center = point
    //     this.baseMapInit()
    //   } else {
    //     if (this.$refs.mapDiv.innerHTML === '') {
    //       this.$nextTick(() => {
    //         gisMap.removeAll()
    //         this.baseMapInit()
    //         gisMap.clearAll()
    //       })
    //     }
    //   }
    // })
  },
  computed: {
    ...mapState('searchStore', {
      transition3D (state) {
        return state.transition3D
      },
      numberOne (state) {
        return state.numberOne
      },
      navHide (state) {
        return state.navHide
      },
      clientdata (state) {
        return state.clientHeight
      }
    })
  },
  watch: {
    clientdata (val) {
      this.init(val)
    },
    transition3D (val) {
      // this.$refs.mapDiv.innerHTML = ''
      if (val === true) {
        this.mapFlag = true
        this.base3DMapInit()
      } else {
        this.$refs.cesiumContainer.innerHTML = ''
        this.mapFlag = false
        // this.baseMapInit()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';
#gisMapContent {
    position: relative;
    width: 100%;
    height: $cymapH;
    top: 0;
    z-index: 0;
}
#tools {
    position: absolute;
    /*top: 0.1rem;*/
    right: 26.2vw;
    z-index: 1;
    display: flex;
    transition: right 0.8s;
}
</style>
