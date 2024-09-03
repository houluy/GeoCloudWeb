<template>
  <div class="contain">
    <div class="fullModalDiv">
      <div class="fullModalLeft">
        <div class="dataMore">
          <div class="dataTitle">
            <img :src="titleImg" style="verticalAlign: -6px" >
            数据列表
          </div>
          <div class="dataUlBtn" v-if="type === 'send'">
            <el-button size="mini" @click="controlData(12, 4)">删除</el-button>
            <el-button size="mini" @click="controlData(8, 4)">重新推送</el-button>
          </div>
          <div class="dataUlBtn" v-if="type === 'receive'">
            <el-form :inline="true" :model="formInline" label-position="left" size="mini">
              <el-form-item label="推送时间">
                <el-date-picker
                  v-model="formInline.lessDataStartTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="至">
                <el-date-picker
                  v-model="formInline.moreDataStartTime"
                  type="date"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="状态">
                <el-select size="small" style="width: 100px;" v-model="formInline.fDataStatus">
                  <el-option label="全部"  value="-1"></el-option>
                  <el-option label="接收成功"  value="6"></el-option>
                  <el-option label="接收失败"  value="8"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-option label="待接收"  value="0"></el-option>
              <el-option label="推接收"  value="2"></el-option>
              <el-option label="暂停"  value="4"></el-option>  -->
              <el-form-item>
                <el-button type="primary" @click="updateData">查询</el-button>
              </el-form-item>
            </el-form>
          </div>
          <ul class="dataUl">
            <li v-for="item in dataMoreArr" class="dataLi" :style="{background: item.add ? item.add.bg : null}" :key="item.id" @click.stop="showDataMessage($event, item)" ref="dataLi">
              <div class="check" @click.stop>
                <el-checkbox v-model="item.dataCheckbox" @change="dataCheckboxChange"></el-checkbox>
              </div>
              <div class="name">
                <!--{{item.fTaskInfoName}}-->{{item.fSatelite}}&nbsp;&nbsp;{{item.fSensor}}<br/>
                {{item.fReceivetime}}
              </div>
              <div class="status" @click.stop>
                <i :class="item.add ? item.add.picc : null" style="fontSize:16px"></i>
              </div>
            </li>
          </ul>
          <page :total="total" :pageSize="30" @currentChange="currentChangeTask"/>
        </div>
        <div class="taskMore">
          <div>
            <div class="dataTitle">
              <img :src="titleImg" style="verticalAlign: -6px" >
              数据信息
            </div>
            <el-form label-position="left" inline class="dataMessage" label-width="50%">
              <div class="rowList">
                <el-form-item>
                  <label slot="label">
                    <img :src="dataOneImg.satelile" alt="" width="15" style="margin: 0 20px">
                    卫星类型:
                  </label>
                  <span>{{ dataOne.fSatelite }}</span>
                </el-form-item>
                <el-form-item>
                  <label slot="label">
                    <img :src="dataOneImg.sensor" alt="" width="15" style="margin: 0 20px">
                    传感器类型:
                  </label>
                  <span>{{ dataOne.fSensor }}</span>
                </el-form-item>
              </div>
              <div class="rowList">
                <el-form-item>
                  <label slot="label">
                    <img :src="dataOneImg.jing" alt="" width="15" style="margin: 0 20px">
                    景号:
                  </label>
                  <span>{{ dataOne.fSceneid }}</span>
                </el-form-item>
                <el-form-item>
                  <label slot="label">
                    <img :src="dataOneImg.chanpin" alt="" width="15" style="margin: 0 20px">
                    产品号:
                  </label>
                  <span>{{ dataOne.fProductid }}</span>
                </el-form-item>
              </div>
              <div class="rowList">
                <el-form-item>
                  <label slot="label">
                    <img :src="dataOneImg.shuju" alt="" width="15" style="margin: 0 20px">
                    数据量:
                  </label>
                  <span>{{ dataOne.fDatasize }}(M)</span>
                </el-form-item>
                <el-form-item>
                  <label slot="label">
                    <img :src="dataOneImg.yun" alt="" width="15" style="margin: 0 20px">
                    云量:
                  </label>
                  <span>{{ dataOne.fCloudpercent }}(%)</span>
                </el-form-item>
              </div>
              <div class="rowList">
                <el-form-item label="推送开始时间:">
                  <label slot="label">
                    <img :src="dataOneImg.start" alt="" width="15" style="margin: 0 20px">
                    推送开始时间:
                  </label>
                  <span>{{ dataOne.fPushStart }}</span>
                </el-form-item>
                <el-form-item label="推送结束时间:">
                  <label slot="label">
                    <img :src="dataOneImg.end" alt="" width="15" style="margin: 0 20px">
                    推送结束时间:
                  </label>
                  <span>{{ dataOne.fPushFinish }}</span>
                </el-form-item>
              </div>
              <div class="rowList" style="width: 50%;">
                <el-form-item>
                  <label slot="label">
                    <img :src="dataOneImg.zhuangtai" alt="" width="15" style="margin: 0 20px">
                    推送状态:
                  </label>
                  <span>{{ dataOne.add ? dataOne.add.text : ''}}</span>
                </el-form-item>
                <!--<el-form-item>-->
                  <!--<label slot="label" v-if="type==='receive'">-->
                    <!--<img :src="dataOneImg.zhuangtai" alt="" width="15" style="margin: 0 20px">-->
                    <!--相对路径:-->
                  <!--</label>-->
                  <!--<span  v-if="type==='receive'">{{ dataOne.fLocation }}</span>-->
                <!--</el-form-item>-->
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <div class="fullModalRight">
        <div class="imgTitle">
          <img :src="fanweiImg" style="verticalAlign: -3px;margin: 0 5px">
          范围
        </div>
        <ViewMap />
        <div class="imgTitle">
          <img :src="kuaishituImg" style="verticalAlign: -3px;margin: 0 5px" />
          快视图
        </div>
        <img :src="picImg ? picImg : noImg" width="100%" height="380" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import ViewMap from '@comm/components/ViewMap'
// import { gisMap } from '@/map/map_globel.js'
import http from '@comm/service/interface'
import page from '@comm/components/page'
import {mapActions, mapState} from 'vuex'
export default {
  data () {
    return {
      formInline: {},
      dataOne: {},
      dataMoreArr: [],
      selectionArr: [],
      noImg: require('@/assets/img/noImg.jpg'),
      titleImg: require('@/assets/img/title.png'),
      fanweiImg: require('@/assets/img/fanwei.png'),
      kuaishituImg: require('@/assets/img/kuaishitu.png'),
      dataOneImg: {
        jing: require('@/assets/img/jing.png'),
        chanpin: require('@/assets/img/chanpin.png'),
        shuju: require('@/assets/img/shuju.png'),
        yun: require('@/assets/img/yun.png'),
        start: require('@/assets/img/start.png'),
        end: require('@/assets/img/end.png'),
        zhuangtai: require('@/assets/img/zhuangtai.png'),
        satelile: require('@/assets/img/satellite.png'),
        sensor: require('@/assets/img/sensor.png')
      },
      picImg: '',
      total: 0,
      type: '',
      gisMapDiaZOrder: null
    }
  },
  methods: {
    updateData () {
      this.initData()
    },
    showDataMessage (e, data) {
      let target = e.target || e
      let el = null
      if (target.className === 'dataLi') {
        el = target
      } else {
        el = target.parentNode
      }
      for (let i = 0; i < this.$refs['dataLi'].length; i++) {
        this.$refs['dataLi'][i].style.border = '1px solid #fff'
      }
      el.style.border = '1px solid black'
      let {fWktresponse} = data
      if (fWktresponse) {
        this.zoomto(fWktresponse)
      }
      this.picImg = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + data.fDataId
      this.dataOne = data
    },
    // 定位
    zoomto (wkt) {
      if (this.gisMapDiaZOrder === null) {
        this.gisMapDiaZOrder = window.gisMapDiaZOrder
      }
      this.gisMapDiaZOrder.clearAllDraws()
      let feature = {
        'attributes': {},
        'style': {
          fillcolor: 'rgba(0, 0, 0, .3)',
          strokecolor: 'red',
          strokewidth: 2
        },
        'geometry': wkt
      }
      this.gisMapDiaZOrder.drawPolygon(feature)
      let f = this.gisMapDiaZOrder.transformFeatureFromWkt(wkt)
      // 飞到某地
      this.gisMapDiaZOrder.flyTo(f, () => {})
    },
    dataCheckboxChange () {
      let arr = this.dataMoreArr.filter(item => item.dataCheckbox)
      this.selectionArr = arr
    },
    // 重新推送数据
    controlData (operationCode, taskLevel) {
      if (this.selectionArr.length > 0) {
        let recordInfos = []
        let sendFlag = true
        this.selectionArr.map(item => {
          let {id, fDatastatus} = item
          let obj = {id, statusCode: fDatastatus}
          if (fDatastatus !== 8 && operationCode !== 12) {
            this.$message('此任务不能进行当前操作')
            sendFlag = false
          }
          recordInfos.push(obj)
        })
        if (sendFlag === true) {
          if (operationCode === 12) {
            this.$confirm('确定要删除吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              http.taskOperation({operationCode, taskLevel, recordInfos}).then(res => {
                this.$message('操作成功')
                this.getTableData()
              }).catch(err => {
                this.$message(err)
              })
            }).catch(() => {})
          } else {
            http.taskOperation({operationCode, taskLevel, recordInfos}).then(res => {
              this.$message('操作成功')
              this.getTableData()
            }).catch(err => {
              this.$message(err)
            })
          }
        }
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    // 分页
    currentChangeTask (index) {
      this.initData(index)
    },
    // 初始化数据列表
    initData (currentPage = 1) {
      this.setDataDitel(0)
      this.type = this.$route.query.type
      if (this.type === 'send') {
        let {fSubTaskId} = this.$route.query
        let data = {fSubTaskId}
        http.listBySubTaskId({data, currentPage, pageSize: 30}).then(res => {
          if (res.data && res.data.list.length > 0) {
            res.data.list.map((item, index) => {
              if (item.fReceivetime && item.fReceivetime.indexOf('T') > -1) {
                item.fReceivetime = item.fReceivetime.replace('T', ' ')
              } else {
                item.fReceivetime = '-'
              }
              // item.fReceivetime = this.formatTime(item.fReceivetime, 'Y-M-D h:m:s')
              item.fDatasize = item.fDatasize == null ? '' : (item.fDatasize / 1024).toFixed(2)
              item.add = this.judgeStatus(parseInt(item.fPushStatus))
              if (item.fPushFinish) {
                item.fPushFinish = item.fPushFinish.replace('T', ' ')
                // item.fPushFinish = this.formatTime(item.fPushFinish, 'Y-M-D h:m:s')
              } else {
                item.fPushFinish = '-'
              }
              if (item.fPushStart) {
                // item.fPushStart = this.formatTime(item.fPushStart, 'Y-M-D h:m:s')
                item.fPushStart = item.fPushStart.replace('T', ' ')
              } else {
                item.fPushStart = '-'
              }
              item.dataCheckbox = false
            })
            this.dataMoreArr = res.data.list
            this.dataMoreArr.map(item => {
              let date = new Date(item.fScenetime)
              item.fScenetime = date.getFullYear() + '-' + formate(date.getMonth() + 1) + '-' + formate(date.getDate()) + ' ' + formate(date.getHours()) + ':' + formate(date.getMinutes()) + ':' + formate(date.getSeconds())
              function formate (num) {
                return num < 10 ? '0' + num : num
              }
            })
            this.total = res.data.total
            this.$nextTick(() => {
              let el = document.querySelector('.dataLi')
              el && this.showDataMessage(document.querySelector('.dataLi'), this.dataMoreArr[0])
            })
          }
        })
      } else {
        let _this = this
        let {fTaskId} = this.$route.query
        let data = {fTaskId, ...this.formInline}
        http.listByTaskIdRe({data, currentPage, pageSize: 30}).then(res => {
          if (res.data && res.data.list.length > 0) {
            res.data.list.map(item => {
              item.add = this.judgeStatus(parseInt(item.fDataStatus))
              if (item.fPushFinish) {
                item.fPushFinish = _this.formatTime(item.fPushFinish, 'Y-M-D h:m:s')
              }
              item.dataCheckbox = false
            })
            // res.data.fPushFinish = _this.formatTime(res.data.fPushFinish, 'Y-M-D h:m:s')
            this.dataMoreArr = res.data.list
            this.total = res.data.total
            this.$nextTick(() => {
              let el = document.querySelector('.dataLi')
              el && this.showDataMessage(document.querySelector('.dataLi'), this.dataMoreArr[0])
            })
          }
        })
      }
    },
    judgeStatus (dataStatus) {
      switch (dataStatus) {
        case 0:
          dataStatus = {bg: '#D9D9DA', picc: 'el-icon-remove-outline', text: '待推送'}
          break
        case 2:
          dataStatus = {bg: '#1F90E5', picc: 'el-icon-loading', text: '推送中'}
          break
        case 4:
          dataStatus = {bg: '#fdcc4f', picc: 'el-icon-video-pause', text: '暂停'}
          break
        case 6:
          dataStatus = {bg: '#88CF6C', picc: 'el-icon-circle-check', text: '推送成功'}
          break
        case 8:
          dataStatus = {bg: '#fc561f', picc: 'el-icon-circle-close', text: '推送失败'}
          break
        case 10:
          dataStatus = {bg: '#d8d8d8', picc: 'el-icon-remove-outline', text: '取消'}
          break
        case 12:
          dataStatus = {bg: '#d8d8d8', picc: 'el-icon-remove-outline', text: '删除'}
      }
      return dataStatus
    },
    ...mapActions('searchStore', {
      setDataDitel: 'setDataDitel'
    })
  },
  components: {page, ViewMap},
  activated () {
    this.initData()
  },
  mounted () {
    // this.initData()
    // this.initData(1)
    // this.setSpanLabel('数据详情')
  },
  computed: {
    ...mapState('searchStore', {
      dataDitelShow (state) {
        if (state.dataDitelShow === 1) {
          console.log(state.dataDitelShow)
          this.initData()
        }
        return state.dataDitelShow
      }
    })
  },
  watch: {
    dataDitelShow: {
      handler (newval, oldval) {
        if (newval === 1) {
          this.initData()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.contain{
  background: #fafafa;
  /*margin:30px 50px;*/
}
.fullModalDiv{
  display: flex;
  height:740px;
}
.fullModalLeft{
  flex:3;
  background: #fff;
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  margin-right:10px;
}
.fullModalRight{
  flex:1;
  position: relative;
}
.dataMore{
  flex:6;
  overflow-y: auto;
}
.taskMore{
  background: #f1f9fe;
  margin-top:10px;
  flex:3;
}
.rowList{
  display: flex;
  border-bottom: 1px solid #ddd;
}
.rowList div{
  flex: 1;
  margin:0 50px;
}
.dataMessage{
  padding:20px;
}
.dataTitle{
  background: #eee;
  padding:10px;
}
.imgTitle{
  padding:10px;
}
.taskLeft{
  border-right: 1px solid #eee;
  margin-right:10px;
}
.taskName{
  padding-top:5px;
  padding-left:10px;
  color:#3097f1;
}
.dataUl{
  padding:10px 20px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
}
.dataLi{
  border: 1px solid #fff;
  display: flex;
  cursor: pointer;
  width: 180px;
  list-style: none;
  height:60px;
  border:1px solid #ddd;
  font-size:14px;
  float:left;
  border-radius: 5px;
  margin-right:7px;
  margin-bottom:7px;
}
.dataLi .check{
  margin:5px;
}
.dataLi .name{
  word-break:break-all;
  color:#fff;
  padding: 5px 0px 10px 0px;
  line-height: 21px;
}
.dataLi .status{
  align-self: flex-end;
  margin:5px;
  color:#fff;
}
.dataUlBtn{
  background: #f1f9fe;
  height:35px;
  list-style: none;
  margin:10px 20px;
}
.dataUlBtn button{
  float:right;
  margin-top:4px;
  margin-right:10px;
}
.el-form-item{
  margin-bottom: 0;
  margin-left:10px;
}
</style>
