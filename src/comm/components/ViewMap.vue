<template>
  <div id="gisMapContent" ref="gisMapContent">
    <div ref="mapDivZOrder" id="mapDivZOrder" class="map" style="height: 100%;"></div>
  </div>
</template>

<script>
import GISMap from '@comm/map/GISMap.js'
import * as MapData from '@comm/map/lib/mapData.js'
const { baseMapInitParameters } = MapData
export default {
  methods: {
    baseMapInit () {
      var gisMapDiaZOrder = new GISMap('MainMapDia')
      window.gisMapDiaZOrder = gisMapDiaZOrder
      gisMapDiaZOrder.baseMapInit(baseMapInitParameters, () => {
        gisMapDiaZOrder.map.on('moveend', gisMapDiaZOrder.checkZoomAndCenter.bind(gisMapDiaZOrder))
      }, 'mapDivZOrder', false)
    }
  },
  mounted () {
    this.baseMapInit()
  }
}
</script>

<style scoped>
#gisMapContent{
  width:100%;
  height:275px;
  position: relative;
}
</style>
