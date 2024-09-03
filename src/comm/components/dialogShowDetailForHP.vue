<template>
  <div style="width: 100%;" class="dialog_top">
    <el-dialog
      :title="this.titleDialog_title"
      :visible.sync="dialogVisibleDetail"
      class="dialog_content"
      :append-to-body = 'true'
      width="57%">
      <div class="eldialog_conz">
        <div style="height: 32vh;">
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
            <div ref="mapDivDialogd" id="mapDivDialogd" class="map" style="height: 100%;"></div>
          </div>
        </div>
       <!-- <div class="eldialog_con_list">
          <div :class="{eldialog_con_list_four: index > dialogListData.length - 5 }" class="eldialog_con_span" v-for="(item, index) in dialogListData" :key="index">
            <span :title="item.label" class="eldialog_con_spanOne">{{item.label}}</span>
            <span :title="item.value" class="eldialog_con_spanTwo">{{item.value}}</span>
          </div>
        </div>-->
        <div class="eldialog_con_list">
          <div :class="{eldialog_con_list_four: index > dialogListData.length - 5 }" class="eldialog_con_span" v-for="(item, index) in dialogListData" :key="index">
            <span :title="item.label" class="eldialog_con_spanOne">{{item.label}}</span>
            <template v-if="item.label === '测区编号'">
              <span :title="item.value" class="eldialog_con_spanTwo"
                    style="cursor: pointer; border-bottom: 5px solid cornflowerblue;color:cornflowerblue;"
                    data-toggle="tooltip" @click="innerClick(item.value)">{{item.value}}</span>
            </template>
            <template v-else>
              <span :title="item.value" class="eldialog_con_spanTwo">{{item.value}}</span>
            </template>
          </div>

        </div>
        <el-dialog
          width="40%"
          height="10%"
          title="测区信息"
          :visible.sync="innerVisible2"
          :fullscreen="showDiv"
          append-to-body>

          <div style="float: right;margin-right: 20px;margin-top: -61px;font-size: 15px;">
            <i class="el-icon-zoom-out" @click="divToSim" style="cursor:pointer;margin-top: 3px;"></i>
            <i class="el-icon-zoom-in" @click="divToBig"
               style="cursor:pointer;margin-top: 3px;margin-left: 10px;margin-right: 10px;"></i>
          </div>


          <div style="overflow: hidden; overflow-y: auto; width: 100%;height: 60vh;">
            <el-scrollbar class="cequ">
              <div style="margin-left:5px" v-for="(item, index) in paramRowDat" :key="index" >
                <template v-if="item.value">
                  <span :title="item.lab" class="spantabIndex" >&nbsp;&nbsp;&nbsp;{{item.lab }}:</span>
                  <span :title="item.value" class="spantab" style="width: 32%;color: #000;">&nbsp;&nbsp;&nbsp;{{ item.value }}</span>
                </template>
              </div>
            </el-scrollbar>
          </div>

        </el-dialog>
        <div style="clear:both; width: 100%;"></div>
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
  String.prototype.myReplace=function(f,e){
    var reg = new RegExp(f,"g"); //创建正则RegExp对象
    return this.replace(reg,e);
  }
  const { baseMapInitParameters } = MapData
  let gisMapDia = null
  export default {
    name: 'dialogShowDetailForHP',
    props: ['dialogShowData', 'titleDialog'],
    data () {
      return {
        innerVisible2: false,
        height: '445px',
        heightpx: '430px',
        showDiv: false,
        paramRowDat:[
          {
            key:'FCOURSEOVERLAP',
            lab: '航向重叠',
            value: ''
          },
          {
            key:'FCAMERA',
            lab: '航摄仪编号',
            value: ''
          },
          {
            key:'FFOCUSLENGTH',
            lab: '航摄焦距',
            value: ''
          },
          {
            key:'FFILMSIZE',
            lab: '像幅大小',
            value: ''
          },
          {
            key:'FFILMTYPE',
            lab: '胶片类型',
            value: ''
          },
          {
            key:'FSCALE',
            lab: '航摄比例尺',
            value: ''
          },
          {
            key:'FSACOMPANY',
            lab: '航摄单位',
            value: ''
          },
          {
            key:'FSCANCOMPANY',
            lab: '扫描单位',
            value: ''
          },
          {
            key:'FREFERENCE_FILE',
            lab: '相机参数鉴定表',
            value: ''
          },
          {
            key:'FDESIGN_FILE',
            lab: '飞行设计',
            value: ''
          },
          {
            key:'FREPORT_FILE',
            lab: '成果报告',
            value: ''
          },
          {
            key:'FAUXILIARY',
            lab: '辅助观测值',
            value: ''
          },
          {
            key:'FDISCRIPTION',
            lab: '说明',
            value: ''
          },
          {
            key:'FREMARKS',
            lab: '备注',
            value: ''
          },
          {
            key:'FSANUMBER',
            lab: '测区号',
            value: ''
          },
          {
            key:'FSANAME',
            lab: '测区名',
            value: ''
          },
          {
            key:'FSTARTDATE',
            lab: '航摄开始时间',
            value: ''
          },
          {
            key:'FENDDATE',
            lab: '航摄结束时间',
            value: ''
          },
          {
            key:'FIMAGECOUNT',
            lab: '航片数',
            value: ''
          },
          {
            key:'FAREA',
            lab: '测区面积',
            value: ''
          },
          {
            key:'FSTATE',
            lab: '测区状态',
            value: ''
          },
          {
            key:'FPLANETYPE',
            lab: '机型',
            value: ''
          },
          {
            key:'FHEIGHT',
            lab: '飞行高度',
            value: ''
          },
          {
            key:'FTRANSVERSEOVERLAP',
            lab: '旁向重叠',
            value: ''
          }

        ],
        paramRowDatanew: {},
        numbIndex: 4000,
        dialogVisibleDetail: false,
        titleDialog_title: '',
        dialog_img_detail: '',
        satelliteImgArr: [],
        dialogListData: [],
        name: '',
        dataId: ''
      }
    },
    methods: {
      divToBig() {
        this.height = document.documentElement.clientHeight - 150 + 'px'
        this.heightpx = document.documentElement.clientHeight - 200 + 'px'
        this.showDiv = true
      },
      divToSim() {
        this.height = '445px'
        this.heightpx = '430px'
        // document.getElementsByClassName('el-dialog')[0].css.marginTop = '11vh'
        this.showDiv = false
      },
      innerClick(item, index) {
        this.innerVisible2 = true
        http.aerialDetails({
          FSANUMBER: item
        }).then(res =>{
          res.data.forEach((item, index) => {
            for (var i = 0; i <this.paramRowDat.length; i++){
              if(this.paramRowDat[i].key.toLowerCase() === 'farea' ){
                this.paramRowDat[i].value = item.farea
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fauxiliary' ){
                this.paramRowDat[i].value = item.fauxiliary
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fcamera' ){
                this.paramRowDat[i].value = item.fcamera
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fcameraid' ){
                this.paramRowDat[i].value = item.fcameraid
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fcourseoverlap' ){
                this.paramRowDat[i].value = item.fcourseoverlap
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fdesignfile' ){
                this.paramRowDat[i].value = item.fdesignfile
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fdiscription' ){
                this.paramRowDat[i].value = item.fdiscription
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fencrypttype' ){
                this.paramRowDat[i].value = item.fencrypttype
              } if(this.paramRowDat[i].key.toLowerCase() === 'fenddate' ){
                this.paramRowDat[i].value = item.fenddate
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'ffilmsize' ){
                this.paramRowDat[i].value = item.ffilmsize
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'ffilmtype' ){
                this.paramRowDat[i].value = item.ffilmtype
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'ffocuslength' ){
                this.paramRowDat[i].value = item.ffocuslength
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fheight' ){
                this.paramRowDat[i].value = item.fheight
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fimagecount' ){
                this.paramRowDat[i].value = item.fimagecount
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fplanetype' ){
                this.paramRowDat[i].value = item.fplanetype
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'freferencefile' ){
                this.paramRowDat[i].value = item.freferencefile
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fsacompany' ){
                this.paramRowDat[i].value = item.fsacompany
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fsaname' ){
                this.paramRowDat[i].value = item.fsaname
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fsanumber' ){
                this.paramRowDat[i].value = item.fsanumber
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fscale' ){
                this.paramRowDat[i].value = item.fscale
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'fstartdate' ){
                this.paramRowDat[i].value = item.fstartdate
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'ftransverseoverlap' ){
                this.paramRowDat[i].value = item.ftransverseoverlap
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'gwarea' ){
                this.paramRowDat[i].value = item.gwarea
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'gwlength' ){
                this.paramRowDat[i].value = item.gwlength
              }
              if(this.paramRowDat[i].key.toLowerCase() === 'gwobjectcid' ){
                this.paramRowDat[i].value = item.gwobjectcid
              }
            }
          })
        })
      },
      baseMapInit () {
        gisMapDia = new GISMap('MainMapDiaNew')
        gisMapDia.baseMapInit(baseMapInitParameters, () => {
          gisMapDia.map.on('moveend', gisMapDia.checkZoomAndCenter.bind(gisMapDia))
        }, 'mapDivDialogd', false)
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
        if(wktResponse.indexOf("POINT")!==-1){
          gisMapDia.addPoint(feature)
        }else{
          gisMapDia.drawPolygon(feature)
        }

        let f = gisMapDia.transformFeatureFromWkt(wktResponse)
        // 飞到某地
        gisMapDia.flyTo(f, () => {})
      },
      ...mapActions('searchStore', {
        setDetailShow: 'setDetailShow'
      }),
      getDialogShowData (val) {
        let _that = this
        //_that.dialogListDataInit = _that.dialogListDataInit_temp
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
        // setTimeout(function () {
        //   _that.$refs.mapDivDialogd.innerHTML = ''
        //   if (_that.$refs.mapDivDialogd.innerHTML === '') {
        //     _that.baseMapInit()
        //   }
        // },1000)
        _that.$nextTick(() => {
          _that.$refs.mapDivDialogd.innerHTML = ''
          if (_that.$refs.mapDivDialogd.innerHTML === '') {
            _that.baseMapInit()
          }
        })
        if (val) {
          let id = ''
          if (val.F_DID) {
            id = val.F_DID
          } else if (val.F_DATAID) {
            id = val.F_DATAID
          }else {
            id = val.DID
          }
          http.getAgrsObjectById({
            dataId: this.dataId,
            nodeId: val.NODEID,
            label: val.NODENAME,
            did: id
          }).then(res => {
            if (res.data) {
              _that.dialogListData = []
              let dataList = res.data[0]
              res.data[0].map(item => {
                let d = item.key
                if (d === '采集时间' ||d === '入库时间'|| d === '制图日期' || d === '航摄开始时间' || d === '航摄结束时间' || d === '结束日期' || d === '起始日期' || d === '结束时间') {
                  item.value = this.commonMethod.timestampToTime(item.value)
                }
                if (d === '数据大小') {
                  item.value = this.commonMethod.dataSizeFormatter(item.value)
                }
               // let obj = {label:item.key,value:item.value}
                if(d && item.value) {
                  _that.dialogListData.push({
                    label: d,
                    value: item.value
                  })
                }
              })
              if (_that.titleDialog === '购物车详情') {
                _that.titleDialog_title = _that.titleDialog + '-' + this.name
                _that.dialog_img_detail = val.IMAGEURL
                let imgurl = val.IMAGEURL.replace('typeId=2', 'typeId=1')
                _that.satelliteImgArr = [imgurl]
              } else {
                _that.dialog_img_detail = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + id + '&nodeId=' + val.NODEID
                let titleName = ''
                if(val.NODEID === '10141'||val.NODEID === '10142'||val.NODEID === '10143'){
                  if(dataList.图件名称 !== undefined){
                    titleName =  '-' + dataList.图件名称
                  }else{
                    titleName =  '-' + dataList.图件名
                  }
                }
                if(titleName==='-undefined'){
                  _that.titleDialog_title = _that.titleDialog
                }else{
                  _that.titleDialog_title = _that.titleDialog +titleName
                }

                _that.satelliteImgArr = ['/mj/metaImage/getImageByTypeForAll?typeId=1&dataId=' + id + '&nodeId=' + val.NODEID]
              }
              _that.zoomto(val.WKTRESPONSE.myReplace(' 0.0',''))

              if(val.WKTRESPONSE.indexOf("POINT")!==-1){
                let feature = {
                  'attributes': 'productTable_dbclick',
                  'style': null,
                  'geometry': val.WKTRESPONSE.myReplace(' 0.0','')
                }
                gisMapDia.addPoint(feature)
              }else{
                // 卫星影像
                let feature = {
                  attributes: {},
                  style: {
                    fillcolor: 'rgba(0,0,255, 0)',
                    strokecolor: 'rgba(0,0,255, 0.5)',
                    strokewidth: 2
                  },
                  geometry: val.WKTRESPONSE.myReplace(' 0.0','')
                }
                gisMapDia.addPolygon(feature)
              }

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
      },
      // 父组件传值
      detailShowW(val, row) {
        if (val === 1) {
          this.getDialogShowData(row)
          this.setDetailShow(0)
        } else {
          this.setDetailShow(0)
        }
      }
    },
    watch: {
       // detailShow(val) {
       //   if (val === 1) {
       //     this.getDialogShowData(this.dialogShowDataZ)
       //     this.setDetailShow(0)
       //   } else {
       //     this.setDetailShow(0)
       //   }
       // }
    },
    computed: {
      ...mapState('searchStore', {
        //setDetailShow: 'setDetailShow'
         detailShow(state) {
           return state.detailShow
         },
         dialogShowDataZ(state) {
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
  }
  .cequ {
    //border-shadow: 2px 2px 10px red;
    border: 1px  solid #e5e4e4;
    border-left: 0px  solid #e5e4e4;
    box-shadow: 1px 1px 1px 1px #b6b5b5;
  }

  .spantabIndex {
    border-bottom: 2px dotted #EBEEF5;
    display: block;
    float: left;
    width: 17.2%;
    height: 18px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 7px;
    text-align: left;
    font-size: 13px;
    padding-top: 15px;
    background-color: #F5F6FA;
    text-indent: 1em;
  }
  .spantab {
    border-bottom: 2px dotted #EBEEF5;
    display: block;
    float: left;
    width: 17%;
    height: 18px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    line-height: 7px;
    text-align: left;
    font-size: 13px;
    padding-top: 15px;
    text-indent: 1em;
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
    .el-dialog__body {
      height: 60vh;
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
    /*float: left;*/
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
