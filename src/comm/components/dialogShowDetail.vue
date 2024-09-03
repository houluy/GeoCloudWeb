<template>
  <div style="width: 100%;" class="dialog_top">
    <el-dialog
      :title="this.titleDialog_title"
      :visible.sync="dialogVisibleDetail"
      class="dialog_content"
      :append-to-body = 'true'
      width="57%">
      <div class="eldialog_conz">
        <div class="eldialog_con_img">
          <el-image
            style="width: 100%; height:100%;"
            :src="dialog_img_detail"
            title="点击查看大图"
            :z-index = 'numbIndex'
            :preview-src-list="satelliteImgArr">
            <div slot="error" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
          <!--<img :src="dialog_img_detail" alt="" width="100%" height="100%">-->
        </div>
        <div class="eldialog_con_map">
          <div ref="mapDivDialog" id="mapDivDialog" class="map" style="height: 100%;"></div>
        </div>
        <div class="eldialog_con_list">
          <div :class="{eldialog_con_list_four: index > dialogListDataInit.length - 5 }" class="eldialog_con_span" v-for="(item, index) in dialogListDataInit" :key="index">
            <span :title="item.label" class="eldialog_con_spanOne">{{item.label}}</span>
            <span :title="item.value" class="eldialog_con_spanTwo">{{item.value}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import GISMap from '@comm/map/GISMap.js'
// import featureUtils from '@/map/lib/featureUtils'
import * as MapData from '@comm/map/lib/mapData.js'
import { mapActions, mapState } from 'vuex'
const { baseMapInitParameters } = MapData
let gisMapDia = null
export default {
  name: 'dialogShowDetail',
  props: ['dialogShowData', 'titleDialog'],
  data () {
    return {
      numbIndex: 4000,
      dialogVisibleDetail: false,
      dialogListDataInit: [
        {
          label: '拍摄卫星',
          value: ''
        },
        {
          label: '传感器',
          value: ''
        },
        {
          label: '空间分辨率米',
          value: ''
        },
        {
          label: '采集时间',
          value: ''
        },
        {
          label: '产品级别',
          value: ''
        },
        {
          label: '云量',
          value: ''
        },
        {
          label: '轨道号',
          value: ''
        },
        {
          label: '景号',
          value: ''
        },
        {
          label: '左上角经度',
          value: ''
        },
        {
          label: '左上角纬度',
          value: ''
        },
        {
          label: '右上角经度',
          value: ''
        },
        {
          label: '右上角纬度',
          value: ''
        },
        {
          label: '右下角经度',
          value: ''
        },
        {
          label: '右下角纬度',
          value: ''
        },
        {
          label: '左下角经度',
          value: ''
        },
        {
          label: '左下角纬度',
          value: ''
        },
        {
          label: '景中心经度',
          value: ''
        },
        {
          label: '景中心纬度',
          value: ''
        },
        // {
        //   label: '景_PATH',
        //   value: ''
        // },
        // {
        //   label: '景_ROW',
        //   value: ''
        // },
        // {
        //   label: '卫星滚转角',
        //   value: ''
        // },
        // {
        //   label: '卫星偏航角',
        //   value: ''
        // },
        {
          label: '卫星俯仰角',
          value: ''
        },
        // {
        //   label: '相机俯仰角',
        //   value: ''
        // },
        // {
        //   label: '相机滚转角',
        //   value: ''
        // },
        {
          label: '产品类型',
          value: ''
        },
        {
          label: '数据大小',
          value: ''
        },
        // {
        //   label: '产品序列号',
        //   value: ''
        // }
      ],
      dialogListDataHY: [
        {
          label: '拍摄卫星',
          value: ''
        },
        {
          label: '传感器',
          value: ''
        },
        {
          label: '空间分辨率米',
          value: ''
        },
        {
          label: '采集时间',
          value: ''
        },
        {
          label: '产品级别',
          value: ''
        },
        {
          label: '云量',
          value: ''
        },
        {
          label: '轨道号',
          value: ''
        },
        {
          label: '景号',
          value: ''
        },
        {
          label: '左上角经度',
          value: ''
        },
        {
          label: '左上角纬度',
          value: ''
        },
        {
          label: '右上角经度',
          value: ''
        },
        {
          label: '右上角纬度',
          value: ''
        },
        {
          label: '右下角经度',
          value: ''
        },
        {
          label: '右下角纬度',
          value: ''
        },
        {
          label: '左下角经度',
          value: ''
        },
        {
          label: '左下角纬度',
          value: ''
        },
        {
          label: '景中心经度',
          value: ''
        },
        {
          label: '景中心纬度',
          value: ''
        },
        // {
        //   label: '景_PATH',
        //   value: ''
        // },
        // {
        //   label: '景_ROW',
        //   value: ''
        // },
        // {
        //   label: '卫星滚转角',
        //   value: ''
        // },
        // {
        //   label: '卫星偏航角',
        //   value: ''
        // },
        // {
        //   label: '卫星俯仰角',
        //   value: ''
        // },
        // {
        //   label: '相机俯仰角',
        //   value: ''
        // },
        // {
        //   label: '相机滚转角',
        //   value: ''
        // },
        {
          label: '产品类型',
          value: ''
        },
        {
          label: '数据大小',
          value: ''
        },
        // {
        //   label: '产品序列号',
        //   value: ''
        // }
      ],
      dialogListDataInit_temp: [
        {
          label: '拍摄卫星',
          value: ''
        },
        {
          label: '传感器',
          value: ''
        },
        {
          label: '空间分辨率米',
          value: ''
        },
        {
          label: '采集时间',
          value: ''
        },
        {
          label: '产品级别',
          value: ''
        },
        {
          label: '云量',
          value: ''
        },
        {
          label: '轨道号',
          value: ''
        },
        {
          label: '景号',
          value: ''
        },
        {
          label: '左上角经度',
          value: ''
        },
        {
          label: '左上角纬度',
          value: ''
        },
        {
          label: '右上角经度',
          value: ''
        },
        {
          label: '右上角纬度',
          value: ''
        },
        {
          label: '右下角经度',
          value: ''
        },
        {
          label: '右下角纬度',
          value: ''
        },
        {
          label: '左下角经度',
          value: ''
        },
        {
          label: '左下角纬度',
          value: ''
        },
        {
          label: '景中心经度',
          value: ''
        },
        {
          label: '景中心纬度',
          value: ''
        },
        {
          label: '景_PATH',
          value: ''
        },
        {
          label: '景_ROW',
          value: ''
        },
        {
          label: '卫星滚转角',
          value: ''
        },
        // {
        //   label: '卫星偏航角',
        //   value: ''
        // },
        // {
        //   label: '卫星俯仰角',
        //   value: ''
        // },
        // {
        //   label: '相机俯仰角',
        //   value: ''
        // },
        // {
        //   label: '相机滚转角',
        //   value: ''
        // },
        {
          label: '产品类型',
          value: ''
        },
        {
          label: '数据大小',
          value: ''
        },
        {
          label: '产品序列号',
          value: ''
        }
      ],
      dialogListDataInit_YIBANTU: [
        {
          label: '分辨率',
          value: ''
        },
        {
          label: '产品时间',
          value: ''
        },
        {
          label: '产品类型',
          value: ''
        },
        {
          label: '色彩模式',
          value: ''
        },
        {
          label: '产品大小',
          value: ''
        },
        {
          label: '产品格式',
          value: ''
        },
        {
          label: '坐标系',
          value: ''
        },
        {
          label: '投影名称',
          value: ''
        },
        {
          label: '左上角经度',
          value: ''
        },
        {
          label: '左上角纬度',
          value: ''
        },
        {
          label: '右上角经度',
          value: ''
        },
        {
          label: '右上角纬度',
          value: ''
        },
        {
          label: '右下角经度',
          value: ''
        },
        {
          label: '右下角纬度',
          value: ''
        },
        {
          label: '左下角经度',
          value: ''
        },
        {
          label: '左下角纬度',
          value: ''
        },
        // {
        //   label: '景中心经度',
        //   value: ''
        // },
        // {
        //   label: '景中心纬度',
        //   value: ''
        // },
        // {
        //   label: '景_PATH',
        //   value: ''
        // },
        // {
        //   label: '景_ROW',
        //   value: ''
        // },
        // {
        //   label: '卫星滚转角',
        //   value: ''
        // },
        // {
        //   label: '产品类型',
        //   value: ''
        // },
        // {
        //   label: '数据大小',
        //   value: ''
        // },
        // {
        //   label: '产品序列号',
        //   value: ''
        // }
      ],
      dialogListDataInit_GWCG46: [
        {
          label: '卫星名称',
          value: ''
        },
        {
          label: '传感器',
          value: ''
        },
        {
          label: '分辨率',
          value: ''
        },
        {
          label: '采集时间',
          value: ''
        },
        {
          label: '产品等级',
          value: ''
        },
        {
          label: '轨道号',
          value: ''
        },
        {
          label: '波段数',
          value: ''
        },
        {
          label: '升降轨标准',
          value: ''
        },
        {
          label: '左上角经度',
          value: ''
        },
        {
          label: '左上角纬度',
          value: ''
        },
        {
          label: '右上角经度',
          value: ''
        },
        {
          label: '右上角纬度',
          value: ''
        },
        {
          label: '右下角经度',
          value: ''
        },
        {
          label: '右下角纬度',
          value: ''
        },
        {
          label: '左下角经度',
          value: ''
        },
        {
          label: '左下角纬度',
          value: ''
        },

        {
          label: '太阳方位角',
          value: ''
        },
        {
          label: '太阳高度角',
          value: ''
        },
        {
          label: '列号',
          value: ''
        },
        {
          label: '行号',
          value: ''
        },

        {
          label: '接收站',
          value: ''
        },
      ],
      dialogListDataInit_DiZhiTu: [
        {
          label: '别名',
          value: ''
        },
        {
          label: '旧图幅号',
          value: ''
        },
        {
          label: '生产日期',
          value: ''
        },
        {
          label: '坐标系统',
          value: ''
        },
        {
          label: '生产单位',
          value: ''
        },
        {
          label: '盘号',
          value: ''
        },
        {
          label: '分辨率',
          value: ''
        },
        {
          label: '新图幅号',
          value: ''
        },
        {
          label: '备注',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },        {
          label: '',
          value: ''
        },        {
          label: '',
          value: ''
        },        {
          label: '',
          value: ''
        },        {
          label: '',
          value: ''
        },        {
          label: '',
          value: ''
        },        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
        {
          label: '',
          value: ''
        },
      ],
      dialogListDataInit_KaiYuanEO1H: [
        {
          label: '拍摄卫星',
          value: ''
        },
        {
          label: '传感器',
          value: ''
        },
        {
          label: '采集时间',
          value: ''
        },
        {
          label: '空间分辨率米',
          value: ''
        },
        {
          label: '轨道号',
          value: ''
        },
        {
          label: '数据大小',
          value: ''
        },
        {
          label: '波段数',
          value: ''
        },
        {
          label: '宽方向像素数',
          value: ''
        },
        {
          label: '高方向像素数',
          value: ''
        },
        {
          label: '左上角经度',
          value: ''
        },
        {
          label: '左上角纬度',
          value: ''
        },
        {
          label: '右上角经度',
          value: ''
        },
        {
          label: '右上角纬度',
          value: ''
        },
        {
          label: '右下角经度',
          value: ''
        },
        {
          label: '右下角纬度',
          value: ''
        },
        {
          label: '左下角经度',
          value: ''
        },
        {
          label: '左下角纬度',
          value: ''
        },
        {
          label: '像素类型',
          value: ''
        },
        {
          label: '轨道行号',
          value: ''
        },
        {
          label: '投影参数',
          value: ''
        },
        {
          label: '投影方式',
          value: ''
        },
        {
          label: '空间基准',
          value: ''
        }
      ],
      dialogListDataInit_KaiYuanSenTine: [
        {
          label: '拍摄卫星',
          value: ''
        },
        {
          label: '传感器',
          value: ''
        },
        {
          label: '采集时间',
          value: ''
        },
        {
          label: '空间分辨率米',
          value: ''
        },
        {
          label: '轨道号',
          value: ''
        },
        {
          label: '数据大小',
          value: ''
        },
        {
          label: '左上角经度',
          value: ''
        },
        {
          label: '左上角纬度',
          value: ''
        },
        {
          label: '右上角经度',
          value: ''
        },
        {
          label: '右上角纬度',
          value: ''
        },
        {
          label: '右下角经度',
          value: ''
        },
        {
          label: '右下角纬度',
          value: ''
        },
        {
          label: '左下角经度',
          value: ''
        },
        {
          label: '左下角纬度',
          value: ''
        },
        {
          label: '波段数',
          value: ''
        },
        {
          label: '宽方向像素数',
          value: ''
        },
        {
          label: '高方向像素数',
          value: ''
        },
        {
          label: '像素类型',
          value: ''
        },
        {
          label: '空间基准',
          value: ''
        },
        {
          label: '投影方式',
          value: ''
        },
        {
          label: '投影方式',
          value: ''
        },
        {
          label: '相对轨道号',
          value: ''
        },
        {
          label: '卫星平台',
          value: ''
        },
        {
          label: '空间分辨率米',
          value: ''
        },
        {
          label: '产品类型',
          value: ''
        }
      ],
      dialogListDataInit_WuXing: [
        {
          label: '项目名称',
          value: ''
        },
        {
          label: '采样点编号',
          value: ''
        },
        {
          label: '采样点地名',
          value: ''
        },
        {
          label: '经度',
          value: ''
        },
        {
          label: '纬度',
          value: ''
        },
        {
          label: '高度',
          value: ''
        },
        {
          label: '岩性',
          value: ''
        },
        {
          label: '年代地层',
          value: ''
        },
        {
          label: '磁化率仪',
          value: ''
        },
        {
          label: '磁化率最小值',
          value: ''
        },
        {
          label: '磁化率最大值',
          value: ''
        },
        {
          label: '磁化率均值',
          value: ''
        },
        {
          label: '剩余磁化强度',
          value: ''
        },
        {
          label: '剩磁偏角',
          value: ''
        },
        {
          label: '剩磁倾角',
          value: ''
        },
        {
          label: '能谱仪',
          value: ''
        },
        {
          label: '钾含量',
          value: ''
        },
        {
          label: '铀含量',
          value: ''
        },
        {
          label: '钍含量',
          value: ''
        },
        {
          label: '总量',
          value: ''
        },
        {
          label: '电阻率仪',
          value: ''
        },
        {
          label: '电阻率',
          value: ''
        },
        {
          label: '极化率',
          value: ''
        },
        {
          label: '密度仪器',
          value: ''
        },
        {
          label: '密度',
          value: ''
        },
        {
          label: '测量时间',
          value: ''
        },
        {
          label: '操作员',
          value: ''
        },
        {
          label: '采样点位置',
          value: ''
        }
      ],
      titleDialog_title: '',
      dialog_img_detail: '',
      satelliteImgArr: [],
      name: '',
      dataId: ''
    }
  },
  methods: {
    baseMapInit () {
      gisMapDia = new GISMap('MainMapDia')
      gisMapDia.baseMapInit(baseMapInitParameters, () => {
        gisMapDia.map.on('moveend', gisMapDia.checkZoomAndCenter.bind(gisMapDia))
      }, 'mapDivDialog', false)
    },
    zoomto (wktResponse) {
      gisMapDia.clearAll()
      let feature = {
        'attributes': {},
        'style': {
          // fillcolor: 'rgba(3, 168, 158, 0.3)',
          // strokecolor: 'rgba(3, 168, 158, 0.3)',
          // strokewidth: 2
          fillcolor: 'rgba(255,255,255, 0.1)',
          strokecolor: 'rgba(44,117,242, 0.5)',
          strokewidth: 2
        },
        'geometry': wktResponse
      }
      gisMapDia.drawPolygon(feature)
      let f = gisMapDia.transformFeatureFromWkt(wktResponse)
      // 飞到某地
      gisMapDia.flyTo(f, () => {})
      setTimeout(function () {
        gisMapDia.zoomToLevel(gisMapDia.getMapLevel()-2)
      },3000)
    },
    ...mapActions('searchStore', {
      setDetailShow: 'setDetailShow'
    }),
    getDialogShowData (val) {
      let _that = this
      _that.dialogListDataInit = _that.dialogListDataInit_temp
      if(val.NODEID === '1000310' || val.nodeid === '1000310'){
        _that.dialogListDataInit = _that.dialogListDataInit_YIBANTU
      }
      if(val.NODEID === '1000342' || val.nodeid === '1000342' || val.NODEID === '1000343' || val.nodeid === '1000343'){
        _that.dialogListDataInit = _that.dialogListDataHY
      }
      if(val.NODEID === '1000344'){
        _that.dialogListDataInit = _that.dialogListDataInit_GWCG46
      }
      if(val.NODEID === '1000345' || val.NODEID === '1000346' || val.NODEID === '1000347'
        || val.NODEID === '1000348' || val.NODEID === '1000349' || val.NODEID === '1000350'
        || val.NODEID === '1000351' || val.NODEID === '1000352' || val.NODEID === '1000353'){
        _that.dialogListDataInit = _that.dialogListDataInit_DiZhiTu
      }
      if(val.NODEID === '1000355'){
        _that.dialogListDataInit = _that.dialogListDataInit_WuXing
      }
      if(val.NODEID === '1000356' || val.NODEID === '1000357' || val.NODEID === '1000358' ||val.NODEID === '1000359' ||
         val.NODEID === '1000360' || val.NODEID === '1000361' || val.NODEID === '1000362'){
        _that.dialogListDataInit = _that.dialogListDataInit_KaiYuanEO1H
      }
      if(val.NODEID === '1000357' || val.NODEID === '1000359' ||val.NODEID === '1000360'){
        _that.dialogListDataInit = _that.dialogListDataInit_KaiYuanSenTine
      }
      if (val) {
        for (let key in val) {
          val[key.toLocaleUpperCase()] = val[key]
          if (key.toLocaleUpperCase() === 'F_DATANAME' || key.toLocaleUpperCase() === 'DATANAME') {
            this.name = val[key]
          }
          if (key.toLocaleUpperCase() === 'F_DATAID' || key.toLocaleUpperCase() === 'DATAID') {
            this.dataId = val[key]
          }
        }
      }
      _that.dialogVisibleDetail = true
      _that.$nextTick(() => {
        if (_that.$refs.mapDivDialog.innerHTML === '') {
          _that.baseMapInit()
        }
      })
      if (val) {
        let id = ''
        if (val.F_DID) {
          id = val.F_DID
        } else {
          id = val.DID
        }
        http.getAgrsObjectByIdForMETA({
          dataId: this.dataId,
          nodeId: val.NODEID,
          label: val.NODENAME,
          did: id
        }).then(res => {
          if (res.data) {
            console.log(res.data, 'res.dataasfas')
            _that.dialogListData = []
            let dataList = res.data[0]
            for (let d in dataList) {
              if (d === '采集时间'|| d === '制图日期' || d === '航摄开始时间' || d === '航摄结束时间' || d === '结束日期' || d === '起始日期' || d === '结束时间' || d === '产品时间') {
                dataList[d] = this.commonMethod.timestampToTime(dataList[d])
              }
              if (d === '数据大小' || d === '产品大小') {
                dataList[d] = this.commonMethod.dataSizeFormatter(dataList[d])
              }
              if (d === '云量') {
                dataList[d] = dataList[d] + '%'
              }
              _that.dialogListData.push({
                label: d,
                value: dataList[d]
              })
              _that.dialogListDataInit.forEach(item => {
                if (d === item.label) {
                  item.value = dataList[d]
                }
              })
            }
            if (_that.titleDialog === '购物车详情') {
              _that.titleDialog_title = _that.titleDialog + '   ' + this.name
              _that.dialog_img_detail = val.IMAGEURL
              let imgurl = val.IMAGEURL.replace('typeId=2', 'typeId=1')
              _that.satelliteImgArr = [imgurl]
            } else {
              _that.dialog_img_detail = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + id + '&nodeId=' + val.NODEID,
              _that.titleDialog_title = _that.titleDialog + '   ' + this.name
              _that.satelliteImgArr = ['/mj/metaImage/getImageByTypeForAll?typeId=1&dataId=' + id + '&nodeId=' + val.NODEID]
            }
            _that.zoomto(val.WKTRESPONSE)
          } else {
            _that.$notify({
              message: '暂无影像详情！',
              position: 'bottom-right',
              duration: 2500,
              type: 'warning'
            })
          }
        })
      }
    }
  },
  watch: {
    detailShow (val) {
      if (val === 1) {
        this.getDialogShowData(this.dialogShowDataZ)
        this.setDetailShow(0)
      } else {
        this.setDetailShow(0)
      }
    }
  },
  computed: {
    ...mapState('searchStore', {
      detailShow (state) {
        return state.detailShow
      },
      dialogShowDataZ (state) {
        return state.dialogShowDataZ
      }
    })
  },
  mounted () {}
}
</script>

<style scoped lang="scss">
  .eldialog_conz {
    width: 100%;
    /*height: 60vh;*/
  }
  .dialog_content {
    .el-dialog__header {
      padding: 10px;
      margin-left: 1%;
      min-height: 24px;
    }
    .el-dialog__headerbtn {
      top: 10px;
    }
    .el-dialog__title {
      line-height: 24px;
      font-size: 17px;
      color: #303133;
      font-weight: bold;
    }
    .eldialog_con_img {
      float: left;
      width: 48.5%;
      height: 32vh;
      margin-right: 1%;
      border: 1px solid #437BFC;
    }
    .eldialog_con_map {
      position: relative;
      float: left;
      width: 48%;
      height: 32vh;
      margin-left: 1.7%;
      border: 1px solid #437BFC;
    }
    .eldialog_con_list {
      float: left;
      width: 100%;
      /*height: 32vh;*/
      margin-top: 1.5%;
      /*overflow: auto;*/
    }
    .eldialog_con_span {
      width: 24.7%;
      float: left;
      height: 30px;
      line-height: 30px;
      border-top: 1px dashed #d8d8d8;
      border-right: 1px solid #e8e8e8;
      border-left: 1px solid #e8e8e8;
      font-size: 12px;
    }
    .eldialog_con_spanOne {
      display: inline-block;
      width: 37%;
      background: #F5F6FA;
      border-right: 1px solid #e8e8e8;
      overflow: hidden;
      height: 30px;
      padding-left: 5px;
      text-overflow: ellipsis; //文本溢出显示省略号
      white-space: nowrap; //文本不会换行
    }
    .eldialog_con_spanTwo {
      display: inline-block;
      width: 57%;
      overflow: hidden;
      height: 30px;
      text-overflow: ellipsis; //文本溢出显示省略号
      white-space: nowrap; //文本不会换行
      color: #0B0B0B;
    }
    .eldialog_con_list_four {
      border-bottom: 1px dashed #d8d8d8;
    }
  }
  .dialog_content>>>.el-dialog__body {
    padding: 0 20px 20px 20px;
    float: left;
    background-color: #fff;
  }
  .dialog_content>>>.el-dialog__header {
    min-height: 24px;
  }
  .dialog_content>>>.el-dialog__title {
    line-height: 24px;
    font-size: 17px;
    color: #303133;
    font-weight: bold;
  }
  .dialog_content>>>.el-image-viewer__close {
    color: #ffff;
  }
</style>
