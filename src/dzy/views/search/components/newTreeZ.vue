<template>
  <div class="cy-menu" ref="cy-menu">
    <img class="img"  height="100" :title="this.menuShow ? '收缩': '展开'" :src="this.menuShow ? require('@/assets/images/search/arrowz21.png'): require('@/assets/images/search/arrowz22.png')" @click="handleMenu">
    <div style="width: calc(100% - 16px); padding: 8px 8px; height: calc(100% - 20px);  text-align: center;">
      <el-scrollbar  style="height: calc(100%);">
        <el-collapse v-model="activeNames" @change="handleChange" accordion>
          <!--切换分辨率和卫星-->
          <el-collapse-item v-for="(item) in  menuTreeDataMuilt"  :name="item.id" :key="item.index">
            <template slot="title">
              <img style=" margin-left: 10px;" :src="imgListD[0]" alt="" width="21px">
              <div class="groupC" >
                <el-tooltip class="item" effect="dark" content="按分辨率检索" placement="top">
                  <button :disabled="activeNames_acticve !== item.id" :class="{groupCButT: true, acgroupCBut: !selectBut}" @click.stop="groupBut(1)"><img :src="imgShowQh[1]" alt=""></button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="按卫星检索" placement="top">
                  <button :disabled="activeNames_acticve !== item.id" :class="{groupCBut: true, acgroupCBut: selectBut}" @click.stop="groupBut(0)"><img :src="imgShowQh[0]" alt=""> </button>
                </el-tooltip>
                <span style="font-size: 16px;float: left;position: relative;top: -11px;margin-left: 4px;">{{item.label}}</span>
                <!--<el-checkbox-group @change="handleChangeBoxMuilt(index)"  v-model="checkListMuilt">-->
                <!--<el-checkbox :disabled="activeNames_acticve !== item.id" :indeterminate="isIndeterminateMuilt" :label="item" >{{item.label}}</el-checkbox>-->
                <!--</el-checkbox-group>-->
              </div>
            </template>
            <!--按分辨率-->
            <!--<div v-if="selectBut" class="muiltslidercon">-->
            <!--<div class="muiltsliderSpan">分辨率:</div>-->
            <!--<div class="muiltslider">-->
            <!--<el-slider-->
            <!--range-->
            <!--input-size="mini"-->
            <!--v-model="sliderValue"-->
            <!--:max= "maxIndex"-->
            <!--:step=" 1"-->
            <!--show-stops>-->
            <!--</el-slider>-->
            <!--</div>-->
            <!--</div>-->
            <!--按卫星-->
            <div v-if="!selectBut" class="muilt_Z">
              <div v-for="(e, index) in item.children" :key="index" class="muiltCheckCon">
                <div class="muiltNode">{{e.label}}</div>
                <div id="muiltCheck">
                  <el-checkbox-group @change="handleChangeGroupEitem" v-model="checkListEitem">
                    <el-checkbox v-for="(eitem, index) in e.children" :title="eitem.title" :label = 'eitem.value +"+"+ eitem.parentnodeid'  :key="index">{{eitem.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <div v-if="selectBut" id="muilt_Z_local">
              <el-collapse class="muilt_coll" v-model="activeNames_local" @change="handleChangeLocal">
                <el-collapse-item v-for="(item) in  dataNewType"  :name="item.id" :key="item.id">
                  <template slot="title">
                    <div class="groupC_local" @click.stop="stopDefault">
                      <el-checkbox-group @change="handleChangeBoxMuilt_local(item.id)"  v-model="checkListMuilt">
                        <el-checkbox :checked="item.isSelect" :indeterminate="item.indeterminate" :label="item.id" >{{item.FL}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </template>
                  <div v-for="(e, index) in item.children" :key="index" class="muiltCheckCon">
                    <div class="muiltNode_loacl">{{e.name}}</div>
                    <div id="muiltCheck_loacl">
                      <el-checkbox-group @change="handleChangeGroupEitem_local" v-model="checkListEitem">
                        <el-checkbox  v-for="(eitem, index) in e.children" :title="eitem.title" :label = 'eitem.value +"+"+ eitem.parentnodeid'  :key="index">{{eitem.name}}</el-checkbox>
                      </el-checkbox-group>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-collapse-item>
          <!--可多选卫星，不切换分辨率-->
          <el-collapse-item v-for="(item, index) in  menuTreeDataT"  :name="item.id" :key="item.id">
            <template slot="title" >
              <img style=" margin-left: 10px;" :src="item.imgUrLl" alt="" width="21px">
              <div class="groupC" @click.stop="stopDefault">
                <el-checkbox-group @change="handleChangeBox(index)"  v-model="checkList_top">
                  <el-checkbox :disabled="activeNames_acticve !== item.id" :label="item" >{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </template>
            <div>
              <el-checkbox-group @change="handleChangeGroup" v-model="checkList">
                <el-checkbox v-for="(e, index) in item.children" :title="e.label" :label = 'e.id' :key="index">{{e.label}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-collapse-item>
          <!--资料单选数据-->
          <el-collapse-item  v-for="(item) in  dataTableDZY"  :name="item.id" :key="item.id">
            <template slot="title">
              <img style=" margin-left: 10px;" :src="item.imgUrLl" alt="" width="21px">
              <span class="titleSpan">{{item.label}}</span>
            </template>
            <div>
              <div :class="{activelist: activeC === e.id, childrenList: true}" @click="childrenListChange(e)" v-for="(e, index) in item.children" :title="e.label" :label = 'e.id' :key="index"><img src="@/assets/img/images/文件夹.png" style="vertical-align: sub; margin-right: 5px" alt="">{{e.label}}</div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-scrollbar>
    </div>
    <!--图例-->
    <div v-if="this.tlList.length > 0 && this.tlShow" ref="showTL" id="showTL" class="icontl">
      <p style="line-height:25px;text-align:center;margin-top:4px;color: #333;font-size: 16px;margin-bottom: 5px;">图例</p>
      <div v-for="(item, index) in this.tlList" :key="index">
        <img :src="item.imgUrl" style="height:15px; float: left;" alt="" title="图例" />
        <span style="color:black; float: left">&nbsp;&nbsp;{{item.label}}</span><br />
      </div>
    </div>
  </div>
</template>
<script>
  import navList from '@comm/components/navList.vue'
  import styles from '@/assets/css/global.scss'
  import http from '@comm/service/interface.js'
  import {gisMap} from '@comm/map/map_globel.js'
  import { mapActions, mapState } from 'vuex'
  export default {
    name: 'cy-menu',
    props: ['menuTreeData'],
    components: {navList},
    data () {
      return {
        yxData: [],
        value1: '',
        sliderValue: [0, 2],
        maxIndex: 16,
        highlight: false,
        selectBut: false,
        showtl: true,
        isIndeterminateMuilt: false,
        styles,
        type: 'searchData',
        treeKey: '',
        count: 0,
        activeNames: '10001',
        activeNames_local: [0,1,2,3],
        activeNames_acticve: '10001',
        menuTreeDataT: [],
        menuTreeDataMuilt: [],
        menuTreeDataMuiltChild: [],
        menuTreeMuilLaction: [],
        menuTreeMuilMRLaction: [],
        menuTreeMuilMR: [],
        locationData: [],
        locationNodeId: [],
        imgListD: [
          require('@/assets/img/tree_test.png'),
          //require('@/assets/img/gxzzcp.png'),
          require('@/assets/img/images/测量open.png'),
          require('@/assets/img/images/航空物探应用-1.png'),
          require('@/assets/img/images/航空遥感测量-1.png'),
          require('@/assets/img/images/遥感应用-1.png'),
          require('@/assets/img/images/遥感影像图-1.png'),
          require('@/assets/img/images/专题产品数据-1.png'),
          //require('@/assets/img/zthyy.png')
        ],
        imgShowQh: [
          require('@/assets/img/WX.png'),
          require('@/assets/img/DPI.png'),
        ],
        nodeRest: '',
        checkNodeName: [],
        checkList: ['100016'],
        checkList_top: [],
        checkListMuilt: [],
        EitemData: true,
        checkListEitem: [],
        showDataBut: '按分辨率',
        dataTableD: [],
        dataTableDZY: [],
        menuTreeInitD: [],
        clientHeight: '',
        activeC: '',
        dataNewType: [],
        dataNewTypeChildren: [],
        GF7: 0,
        ZY301: 0,
        ZY302: 0,
        ZY303: 0
      }
    },
    mounted () {
      this.getTree()
      this.getAgrsCatalogList()
      this.getAgrsCatalogListLocal()
      this.clientHeight = `${document.documentElement.clientHeight}`// 获取浏览器可视区域高度
      window.onresize = () => {
        return (() => {
          this.clientHeight = `${document.documentElement.clientHeight}`
          this.setclientHeight(this.clientHeight)
        })()
      }
      setTimeout(() => {
        this.groupBut(1)
      }, 200)
    },
    methods: {
      // 获取原始影像所有传感器
      getMuiltChild (val) {
        this.menuTreeMuilLaction = []
        this.menuTreeDataMuiltChild = []
        this.menuTreeMuilMRLaction = []
        let laction = []
        if (val.length > 0){
          val[0].children.forEach(item => {
            if (item.children.length > 0) {
              // 所有的原始影像的子类
              this.menuTreeDataMuiltChild = this.menuTreeDataMuiltChild.concat(item.children)
              if (item.children && item.children.length > 0) {
                // 获取所有传感器对象拼接的check绑定的对象
                item.children.forEach(eitem => {
                  this.menuTreeMuilLaction.push(eitem.value +"+"+ eitem.parentnodeid)
                })
                // 获取所有传感器对象拼接的check绑定的默认对象---卫星
                item.children.forEach(eitem => {
                  if (eitem.default) {
                    this.menuTreeMuilMRLaction.push(eitem.value +"+"+ eitem.parentnodeid)
                  }
                })
                // 获取所有传感器对象拼接的check绑定的默认对象--分辨率
                item.children.forEach(eitem => {
                  if (eitem.location) {
                    eitem.location.forEach(e => {
                      laction.push(parseFloat(e))
                      if (parseFloat(e) >= 0 && parseFloat(e) <= 2) {
                        if (this.menuTreeMuilMR.indexOf(eitem.value +"+"+ eitem.parentnodeid) === -1) {
                          this.menuTreeMuilMR.push(eitem.value +"+"+ eitem.parentnodeid)
                        }
                      }
                    })
                  }
                })
                this.maxIndex = Math.max(...laction)
              }
            }
          })
        }
      },
      // tree数据获取
      getTree () {
        http.getAgrsCatalogTree().then(res => {
          this.dataTableD = []
          let dzyData = []
          if (res.data.length > 0) {
            this.menuTreeInitD = res.data
            this.setTreeChecked(res.data)
            res.data.forEach(item => {
              // this.dataTableDZY.push(item)
              if (window.nodeName.indexOf(item.label) > -1) {
                this.dataTableD.push(item)
              }
              if (window.nodeNameSingle.indexOf(item.label) > -1 && window.nodeNameSinglezl) {
                dzyData.push(item)
              }
            })
            this.menuTreeDataT = this.dataTableD
            this.dataTableDZY = dzyData
            console.log(this.dataTableDZY, 'this.dataTableDZY')
            this.getMuiltChild(this.menuTreeDataMuilt)
          }
        })
      },
      getAgrsCatalogList() {
        http.getAgrsCatalogListByUid().then(res => {
          if (res.data) {
            this.menuTreeDataMuilt = [res.data]
            this.getMuiltChild(this.menuTreeDataMuilt)
          }
        })
      },
      getAgrsCatalogListLocal() {
        http.getResolutionpower().then(res => {
          // http.getAgrsCatalogListByUid().then(res => {
          console.log('getResolutionpower', res)
          if (res.data) {
            this.dataNewType = res.data.children
            let node = this.dataNewType[0].children[0].children[0]
            // this.checkListEitem = [node.value + "+" + node.parentnodeid]
            this.handleChangeGroupEitem_local(this.checkListEitem)
          }
        })
      },
      // 循环tree目录添加图片
      setTreeChecked (val) {
        if (val.length > 0) {
          val.forEach((item, index) => {
            if (item.id === '10009') {
              item.imgUrLl = this.imgListD[1]
            }else if (item.id === '10010'){
              item.imgUrLl = this.imgListD[2]
            }else if (item.id === '10011'){
              item.imgUrLl = this.imgListD[3]
            }else if (item.id === '10012'){
              item.imgUrLl = this.imgListD[4]
            }else if (item.id === '10013'){
              item.imgUrLl = this.imgListD[5]
            }else if (item.id === '10014'){
              item.imgUrLl = this.imgListD[6]
            }else {
              item.imgUrLl = this.imgListD[0]
            }
            /*index++
            item.imgUrLl = this.imgListD[index]*/
          })
        }
      },
      // 展开数据，默认勾选第一个
      getFirstOneD (val) {
        let _this = this
        if (_this.menuTreeInitD.length > 0) {
          _this.menuTreeInitD.forEach(item => {
            if (val === item.id) {
              if (item.children.length > 0) {
                _this.setCatalogNodeId(item.children[0].id)
                // _this.semetadataExporttCatalogNodeIdZ(item.children[0].id)
                // 默认勾选第一个
                _this.checkList = [item.children[0].id]
                _this.activeC = item.children[0].id
                _this.setNodeLabel(item.children[0].name)
              }
            }
          })
        }
      },
      handleChangeLocal() {},
      // 展开父类
      handleChange (val) {
        this.checkList_top = []
        if (val) {
          if (window.nodeIdSerach.indexOf(val) > -1) {
            // 卫星结果面板展示
            this.$emit('headCallBack', true)
            // 工具栏图例隐藏
            this.setToolListShow(false)
            // 区分资料和卫星的点查询 true是卫星
            this.setNodeIdSerachData(true)
            //触发勾选左侧获取查询条件及结果方法
            this.handleChangeGroupEitem_local(this.checkListEitem)
          } else {
            // 资料结果面板展示
            this.$emit('headCallBack', false)
            // 工具栏图例显示
            this.setToolListShow(true)
            if ((val === '10013') || (val === '10014')) {
              this.setTableShow(false)
            } else {
              this.setTableShow(true)
            }
            // 区分资料和卫星的点查询 false是资料
            this.setNodeIdSerachData(false)
          }
          this.setNewTimeD(1)
          this.setSearchIndex(1)
          this.setTlShow(false)
          if (val !== this.activeNames_acticve) {
            if (val !== '10001') {
              // 切换目录时，选中该目录下的第一个传感器 （原始影像除外）
              this.getFirstOneD(val)
              // 去除原始影像的目录的勾选状态
              this.isIndeterminateMuilt = false
              this.checkListMuilt = []
            } else {
              if (this.selectBut) {
                // 切换目录时，分辨率恢复到默认 ======
                this.isIndeterminateMuilt = true
                this.EitemData = false
                // this.sliderValue = [0, 2]
              } else {
                // 切换目录时，清空卫星选择的传感器 ======
                this.handleChangeGroupEitem([])
                this.checkListEitem = []
              }
            }
            // this.checkList = []
            this.activeNames_acticve = val
          }
        }
      },
      // 阻止事件冒泡
      stopDefault (e) {
        e.stopPropagation()
      },
      // 按卫星和按分辨率切换
      groupBut (val) {
        this.setNewTimeD(1)
        this.setSearchIndex(1)
        this.checkListMuilt = []
        this.checkListEitem = []
        // this.isIndeterminateMuilt = false
        this.EitemData = true
        if (val === 1) {
          this.selectBut = true
          // this.isIndeterminateMuilt = true
          this.EitemData = false
          if (this.dataNewType.length > 0) {
            let node = this.dataNewType[0].children[0].children[0]
            // this.checkListEitem = [node.value + "+" + node.parentnodeid]
            this.handleChangeGroupEitem_local(this.checkListEitem)
          }
          // this.sliderValue = [0, 2]
        } else {
          this.selectBut = false
          // 卫星查询切换条件为空
          this.getLocationDandNodeId([])
        }
      },
      // 原始影像，全部选择，三种状态切换功能
      handleChangeBoxMuilt(val) {
        if (this.isIndeterminateMuilt) {
          // 勾选所有的传感器
          this.isIndeterminateMuilt = false
          this.EitemData = false
          this.checkListMuilt = this.menuTreeDataMuilt
          this.checkListEitem = this.menuTreeMuilLaction
          this.getLocationDandNodeId(this.checkListEitem)
        } else {
          if (this.EitemData) {
            // 勾选所有的默认传感器
            this.isIndeterminateMuilt = true
            this.EitemData = false
            if (this.selectBut) {
              // 勾选所有的默认传感器--分辨率
              this.checkListEitem = this.menuTreeMuilMR
            } else {
              // 勾选所有的默认传感器--卫星
              this.checkListEitem = this.menuTreeMuilMRLaction
            }
            this.getLocationDandNodeId(this.checkListEitem)
          } else {
            // 去掉所有的勾选的传感器
            this.EitemData = true
            this.checkListMuilt = []
            this.checkListEitem = []
            this.getLocationDandNodeId(this.checkListEitem)
          }
        }
      },
      // 当前分辨率全选
      handleChangeBoxMuilt_local (val){
        this.yxData.type = '切换'
        this.yxData.tableShowYx = 'none'
        this.setAllYxData({yxData: this.yxData})
        gisMap.clearAllFeatures()
        let arr = []
        this.dataNewType.forEach((item, index) => {
          if (this.checkListMuilt.indexOf(item.id) > -1) {
            item.indeterminate = false
            if (item.children.length > 0) {
              item.children.forEach(e => {
                if (e.children.length > 0) {
                  e.children.forEach((ec) => {
                    //ec.isSelect = true
                    arr.push(ec.value +"+"+ ec.parentnodeid)
                  })
                }
              })
            }
          }
          if (item.indeterminate) {
            if (item.children.length > 0) {
              item.children.forEach(e => {
                if (e.children.length > 0) {
                  e.children.forEach((ec) => {
                    if (ec.isSelect) {
                      arr.push(ec.value +"+"+ ec.parentnodeid)
                    }
                  })
                }
              })
            }
          }
        })
        this.checkListEitem = arr
        this.getLocationDandNodeId(this.checkListEitem)
      },
      // 原始影像子类，选择
      handleChangeGroupEitem_local (val) {
        this.yxData.type = '切换'
        this.yxData.tableShowYx = 'none'
        this.setAllYxData({yxData: this.yxData})
        gisMap.clearAllFeatures()
        let GF7 = '100052'
        let ZY301 = '100014'
        let ZY302 = '100015'
        let ZY303 = '100055'

        if (window.systemName === 'FW') {
          GF7 = '1000365'
          ZY301 = '100014'
          ZY302 = '100015'
          ZY303 = '1000341'
        }

        let GF7BWD = val.indexOf('GF7-BWD+'+GF7)
        let GF7MUX = val.indexOf('GF7-MUX+'+GF7)
        let GF7MUXlist = this.checkListEitem.indexOf('GF7-MUX+'+GF7)
        let GF7BWDlist = this.checkListEitem.indexOf('GF7-BWD+'+GF7)

        let ZY301NAD = val.indexOf('ZY301-NAD+'+ZY301)
        let ZY301MUX = val.indexOf('ZY301-MUX+'+ZY301)
        let ZY301NADlist = this.checkListEitem.indexOf('ZY301-NAD+'+ZY301)
        let ZY301MUXlist = this.checkListEitem.indexOf('ZY301-MUX+'+ZY301)

        let ZY302NAD = val.indexOf('ZY302-NAD+'+ZY302)
        let ZY302MUX = val.indexOf('ZY302-MUX+'+ZY302)
        let ZY302NADlist = this.checkListEitem.indexOf('ZY302-NAD+'+ZY302)
        let ZY302MUXlist = this.checkListEitem.indexOf('ZY302-MUX+'+ZY302)


        let ZY303NAD = val.indexOf('ZY303-NAD+'+ZY303)
        let ZY303MUX = val.indexOf('ZY303-MUX+'+ZY303)
        let ZY303NADlist = this.checkListEitem.indexOf('ZY303-NAD+'+ZY303)
        let ZY303MUXlist = this.checkListEitem.indexOf('ZY303-MUX+'+ZY303)

        this.dataNewTypeChildren = val
        // 选择GF7的任何一个传感器都要让两个传感器都选择上
        if (GF7BWD !== -1 && GF7MUX === -1 && this.GF7 === 0) {
          if (GF7MUXlist === -1) {
            this.checkListEitem.push('GF7-MUX+'+GF7)
            this.GF7 = 1
          }
          if (this.dataNewTypeChildren.indexOf('GF7-MUX+'+GF7) === -1) {
            this.dataNewTypeChildren.push('GF7-MUX+'+GF7)
            this.GF7 = 1
          }
        }else if (GF7MUX !== -1 && GF7BWD === -1 && this.GF7 === 0) {
          if (GF7BWDlist === -1) {
            this.checkListEitem.push('GF7-BWD+'+GF7)
            this.GF7 = 1
          }
          if (this.dataNewTypeChildren.indexOf('GF7-BWD+'+GF7) === -1) {
            this.dataNewTypeChildren.push('GF7-BWD+'+GF7)
            this.GF7 = 1
          }
        }else {
          this.GF7 = 0
        }
        // 去掉GF7的任何一个传感器也都让它去掉所有的传感器
        if (GF7BWD !== -1 && GF7MUX === -1 && this.GF7 === 0) {
          if (GF7BWDlist !== -1) {
            this.checkListEitem.splice(GF7BWDlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('GF7-BWD+'+GF7) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('GF7-BWD+'+GF7), 1)
          }
        }else if (GF7MUX !== -1 && GF7BWD === -1 && this.GF7 === 0) {
          if (GF7MUXlist !== -1) {
            this.checkListEitem.splice(GF7MUXlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('GF7-MUX+'+GF7) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('GF7-MUX+'+GF7), 1)
          }
        }
//-----------------------------------------------------------------------
        // 选择ZY301的任何一个传感器都要让两个传感器都选择上
        if (ZY301NAD !== -1 && ZY301MUX === -1 && this.ZY301 === 0) {
          if (ZY301MUXlist === -1) {
            this.checkListEitem.push('ZY301-MUX+'+ZY301)
            this.ZY301 = 1
          }
          if (this.dataNewTypeChildren.indexOf('ZY301-MUX+'+ZY301) === -1) {
            this.dataNewTypeChildren.push('ZY301-MUX+'+ZY301)
            this.ZY301 = 1
          }
        }else if (ZY301MUX !== -1 && ZY301NAD === -1 && this.ZY301 === 0) {
          if (ZY301NADlist === -1) {
            this.checkListEitem.push('ZY301-NAD+'+ZY301)
            this.ZY301 = 1
          }
          if (this.dataNewTypeChildren.indexOf('ZY301-NAD+'+ZY301) === -1) {
            this.dataNewTypeChildren.push('ZY301-NAD+'+ZY301)
            this.ZY301 = 1
          }
        }else {
          this.ZY301 = 0
        }

        // 去掉ZY301的任何一个传感器也都让它去掉所有的传感器
        if (ZY301NAD !== -1 && ZY301MUX === -1 && this.ZY301 === 0) {
          if (ZY301NADlist !== -1) {
            this.checkListEitem.splice(ZY301NADlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('ZY301-NAD+'+ZY301) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('ZY301-NAD+'+ZY301), 1)
          }
        }else if (ZY301MUX !== -1 && ZY301NAD === -1 && this.ZY301 === 0) {
          if (ZY301MUXlist !== -1) {
            this.checkListEitem.splice(ZY301MUXlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('ZY301-MUX+'+ZY301) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('ZY301-MUX+'+ZY301), 1)
          }
        }

//-----------------------------------------------------------------------
        // 选择ZY302的任何一个传感器都要让两个传感器都选择上
        if (ZY302NAD !== -1 && ZY302MUX === -1 && this.ZY302 === 0) {
          if (ZY302MUXlist === -1) {
            this.checkListEitem.push('ZY302-MUX+'+ZY302)
            this.ZY302 = 1
          }
          if (this.dataNewTypeChildren.indexOf('ZY302-MUX+'+ZY302) === -1) {
            this.dataNewTypeChildren.push('ZY302-MUX+'+ZY302)
            this.ZY302 = 1
          }
        }else if (ZY302MUX !== -1 && ZY302NAD === -1 && this.ZY302 === 0) {
          if (ZY302NADlist === -1) {
            this.checkListEitem.push('ZY302-NAD+'+ZY302)
            this.ZY302 = 1
          }
          if (this.dataNewTypeChildren.indexOf('ZY302-NAD+'+ZY302) === -1) {
            this.dataNewTypeChildren.push('ZY302-NAD+'+ZY302)
            this.ZY302 = 1
          }
        }else {
          this.ZY302 = 0
        }

        // 去掉ZY302的任何一个传感器也都让它去掉所有的传感器
        if (ZY302NAD !== -1 && ZY302MUX === -1 && this.ZY302 === 0) {
          if (ZY302NADlist !== -1) {
            this.checkListEitem.splice(ZY302NADlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('ZY302-NAD+'+ZY302) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('ZY302-NAD+'+ZY302), 1)
          }
        }else if (ZY302MUX !== -1 && ZY302NAD === -1 && this.ZY302 === 0) {
          if (ZY302MUXlist !== -1) {
            this.checkListEitem.splice(ZY302MUXlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('ZY302-MUX+'+ZY302) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('ZY302-MUX+'+ZY302), 1)
          }
        }
//-----------------------------------------------------------------------

        // 选择ZY303的任何一个传感器都要让两个传感器都选择上
        if (ZY303NAD !== -1 && ZY303MUX === -1 && this.ZY303 === 0) {
          if (ZY303MUXlist === -1) {
            this.checkListEitem.push('ZY303-MUX+'+ZY303)
            this.ZY303 = 1
          }
          if (this.dataNewTypeChildren.indexOf('ZY303-MUX+'+ZY303) === -1) {
            this.dataNewTypeChildren.push('ZY303-MUX+'+ZY303)
            this.ZY303 = 1
          }
        }else if (ZY303MUX !== -1 && ZY303NAD === -1 && this.ZY303 === 0) {
          if (ZY303NADlist === -1) {
            this.checkListEitem.push('ZY303-NAD+'+ZY303)
            this.ZY303 = 1
          }
          if (this.dataNewTypeChildren.indexOf('ZY303-NAD+'+ZY303) === -1) {
            this.dataNewTypeChildren.push('ZY303-NAD+'+ZY303)
            this.ZY303 = 1
          }
        }else {
          this.ZY303 = 0
        }

        // 去掉ZY303的任何一个传感器也都让它去掉所有的传感器
        if (ZY303NAD !== -1 && ZY303MUX === -1 && this.ZY303 === 0) {
          if (ZY303NADlist !== -1) {
            this.checkListEitem.splice(ZY303NADlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('ZY303-NAD+'+ZY303) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('ZY303-NAD+'+ZY303), 1)
          }
        }else if (ZY303MUX !== -1 && ZY303NAD === -1 && this.ZY303 === 0) {
          if (ZY303MUXlist !== -1) {
            this.checkListEitem.splice(ZY303MUXlist, 1)
          }
          if (this.dataNewTypeChildren.indexOf('ZY303-MUX+'+ZY303) !== -1) {
            this.dataNewTypeChildren.splice(this.dataNewTypeChildren.indexOf('ZY303-MUX+'+ZY303), 1)
          }
        }

        this.getLocationDandNodeId(this.dataNewTypeChildren)
        this.checkListMuilt = []
        this.dataNewType.forEach((item, index) => {
          let isSelect = 0
          let childrenlen = 0
          if (item.children.length > 0) {
            item.children.forEach(e => {
              if (e.children.length > 0) {
                e.children.forEach((ec) => {
                  childrenlen ++
                  let a = ec.value + "+" + ec.parentnodeid
                  if (this.dataNewTypeChildren.indexOf(a) > -1) {
                    ec.isSelect = true
                    isSelect ++
                  } else {
                    ec.isSelect = false
                  }
                })
              }
            })
          }
          if (isSelect === childrenlen) {
            item.indeterminate = false
            this.checkListMuilt.push(item.id)
          } else if (isSelect < childrenlen && isSelect>0) {
            item.indeterminate = true
          } else {
            item.indeterminate = false
          }
        })
      },
      handleChangeGroupEitem(val) {
        this.getLocationDandNodeId(val)
        if (val.length === this.menuTreeDataMuiltChild.length) {
          this.isIndeterminateMuilt = false
          this.EitemData = false
          this.checkListMuilt = this.menuTreeDataMuilt
        } else if (val.length === 0){
          this.isIndeterminateMuilt = false
          this.checkListMuilt = []
        } else {
          this.isIndeterminateMuilt = true
        }
      },
      // 勾选结果内容的筛选和逻辑判断，以及数据传输
      getLocationDandNodeId (val) {
        this.setActiveName('condition')
        this.setNewTimeD(1)
        this.setSearchIndex(1)
        this.locationData = []
        this.locationNodeId = []
        if (val.length !== 0) {
          // GF1-PMS+100016
          val.forEach(item => {
            let a = item.split('+')
            // 去除重复的nodeid
            if (this.locationNodeId.indexOf(a[1]) === -1) {
              this.locationNodeId.push(a[1])
            }
            this.locationData.push(a[0])
          })
          let nodeId = this.locationNodeId.join(',')
          // 往result.vue传递选中的传感器
          this.setlocationData(this.locationData)
          // 动态获取其他的条件
          this.setCatalogNodeId(nodeId)
          // 动态获取辅助动态变化功能
          this.setCatalogNodeIdZ(nodeId)
        } else {
          this.setCatalogNodeId('')
          this.setCatalogNodeIdZ('')
        }
      },
      // 非原始影像子类选择
      handleChangeBox (val) {
        this.checkList = []
        if (this.checkList_top.length > 0) {
          this.checkList_top[0].children.forEach(item => {
            this.checkList.push(item.id)
          })
          this.handleChangeGroup()
        } else {
          this.checkList = []
          this.handleChangeGroup()
        }
      },
      // 资料子类选择
      childrenListChange (val) {
        this.setActiveName('condition')
        // this.$emit('headCallBack', true)
        this.setNewTimeD(1)
        this.setSearchIndex(1)
        this.setTlShow(false)
        this.activeC = val.id
        this.setCatalogNodeId(val.id)
      },
      // 非原始影像选择
      handleChangeGroup () {
        let _that = this
        _that.checkNodeName = []
        _that.setActiveName('condition')
        let nodeId = ''
        if (_that.checkList.length > 0) {
          _that.checkList.forEach(item => {
            nodeId += item + ','
            _that.dataTableD.forEach(iteme => {
              iteme.children.forEach(e => {
                if (e.id === item) {
                  _that.checkNodeName.push(e.name)
                }
              })
            })
          })
        }
        if (nodeId) {
          nodeId = nodeId.slice(0, nodeId.length - 1)
          this.nodeRest = nodeId
        }
        this.setCatalogNodeId(nodeId)
        this.setCatalogNodeIdZ(nodeId)
        this.setNewTimeD(1)
        this.setSearchIndex(1)
      },
      // 左右滑块tree
      handleMenu () {
        this.menuShow = !this.menuShow
        this.setMenuShow(this.menuShow)
      },
      ...mapActions('searchStore', {
        setCatalogNodeId: 'setCatalogNodeId',
        setCatalogNodeIdZ: 'setCatalogNodeIdZ',
        setNodeIdSerachData: 'setNodeIdSerachData',
        setlocationData: 'setlocationData',
        setActiveName: 'setActiveName',
        setNewTimeD: 'setNewTimeD',
        setSearchIndex: 'setSearchIndex',
        setMenuShow: 'setMenuShow',
        setTableShow: 'setTableShow',
        setNodeIndexData: 'setNodeIndexData',
        setToolListShow: 'setToolListShow',
        setTlShow: 'setTlShow',
        setNodeLabel: 'setNodeLabel',
        setclientHeight: 'setclientHeight'
      }),
      ...mapActions('news',{
        setAllYxData: 'setAllYxData'
      })
    },
    computed: {
      menuShow: {
        get: function () {
          return this.$store.state.searchStore.menuShow
        },
        set: function (newValue) {
          this.$store.state.searchStore.menuShow = newValue
        }
      },
      ...mapState('configManage', {
        treeHeight (state) {
          return state.commonHeight
        }
      }),
      ...mapState('searchStore', {
        nodeIndexData (state) {
          return state.nodeIndexData
        },
        tlList (state) {
          return state.tlList
        },
        tlShow (state) {
          return state.tlShow
        }
      }),
      allYxData: {
        get: function () {
          return this.$store.state.news.allYxData
        },
        set: function (newValue) {
          this.$store.state.news.allYxData = newValue
        }
      }
    },
    watch: {
      menuShow () {
        let curWidth = this.$refs['cy-menu'].clientWidth
        // this.$refs['cy-menu'].style.left = this.menuShow ? '0px' : '-17vw'
        this.$refs['cy-menu'].style.left = this.menuShow ? '0px' : `-${curWidth}px`
      },
      nodeIndexData (val) {
        if (val) {
          this.getLocationDandNodeId(this.checkListEitem)

        }
      },
      // 监控分辨率的滑动触发条件获取和多选框勾选
      // sliderValue (val) {
      //   let nodeId = []
      //   this.menuTreeDataMuiltChild.forEach(eitem => {
      //     if (eitem.location) {
      //       eitem.location.forEach(e => {
      //         if (parseFloat(e) >= val[0] && parseFloat(e) <= val[1]) {
      //           if (nodeId.indexOf(eitem.value +"+"+ eitem.parentnodeid) === -1) {
      //             nodeId.push(eitem.value +"+"+ eitem.parentnodeid)
      //           }
      //         }
      //       })
      //     }
      //   })
      //   this.checkListEitem = nodeId
      //   this.handleChangeGroupEitem(nodeId)
      // }
      dataNewType: {
        handler (newval, oldval) {
          console.log(newval, '0909090')
        },
        immediate: true,
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '@/assets/css/global.scss';
  .cy-menu{
    /*width: 4.7rem;*/
    width: 17vw;
    min-width: 265px;
    position: absolute;
    left: 0;
    top: $cymenuTop;
    z-index: 1;
    transition: left .8s;
    height: auto;
    padding: 0;
    bottom: 0;
    background-color:#fff;
    /*box-shadow: 0 0 3px #888;*/
    box-shadow:2px 0 20px 0 rgba(0,0,0,0.1);
    opacity: 0.95;
  }
  .img{
    position:absolute;
    // left: 16.9vw;
    right: -24px;
    /*left: 4.6rem;*/
    height: 60px;
    color: rgba(0, 116, 214, .9);
    cursor: pointer;
    top:calc(50% - 40px);
  }
  .el-tree{
    opacity: .8;
    /*color: #fff;*/
    /*background-color: #2B2F35;*/
    color: #606266;
    font-weight:500;
    background-color: rgba(249,250,251,1);
  }
  .cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-checked>.el-tree-node__content {
    background-color: rgba(0,153,250,0.1);
    color:rgb(64, 158, 255);
  }
  .cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-current>.el-tree-node__content {
    /*background-color: rgb(13, 13, 13);*/
    background-color: rgba(0,153,250,0.1);
    color: #0099FA;
    font-weight: bold;
  }
  .cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-focusable>.el-tree-node__content {
    /*background-color: rgb(13, 13, 13);*/
  }
  .cy-menu .el-tree--highlight-current /deep/ .el-tree-node.is-focusable>.el-tree-node__content:hover {
    /*background-color: rgb(13, 13, 13);*/
    background-color: rgba(0,153,250,0.1);
  }
  .cy-menu .el-tree--highlight-current /deep/ .el-tree-node:focus>.el-tree-node__content {
    /*background-color: rgb(13, 13, 13);*/
    background-color: rgba(0,153,250,0.1);
  }
  .search_input >>> .el-input__inner {
    height: 32px;
    line-height: 32px;
    border-radius: 30px!important;
    background-color: rgba(234,234,234,0.5)!important;
    color: #999999!important;
  }
  .cy-menu>>>.el-collapse-item__header.is-active {
    border-radius: 5px 5px 0px 0 !important;
  }
  .cy-menu>>>.el-collapse-item__header {
    background: #3D6EF1;
    /*background: #3D6EF1 !important;*/
    height: 35px !important;
    line-height: 35px !important;
    color: #FFF !important;
    border-radius: 5px 5px 5px 5px;
  }
  .cy-menu>>> #muilt_Z_local .el-collapse-item__header {
    background: #F3F6FE;
    /*background: #3D6EF1 !important;*/
    height: 35px !important;
    line-height: 35px !important;
    color: #262604 !important;
    border-radius: 5px 5px 5px 5px;
    border-left: 1px solid #ECE6E6;
    border-right: 1px solid #ECE6E6;
    margin-top: 5px;
  }
  .cy-menu>>>.el-collapse-item__content .el-checkbox{
    width: 59%;
    padding: 10px;
  }
  .cy-menu>>>.el-collapse {
    border: none !important;
  }
  .cy-menu>>>.el-collapse-item__header .el-checkbox{
    width: 84.1%;
    display: block;
    color: #FFF !important;
  }
  .cy-menu>>> #muilt_Z_local .el-collapse-item__header .el-checkbox{
    width: 84.1%;
    display: block;
    color: #353517 !important;
  }
  .cy-menu>>>.el-collapse-item__header .el-checkbox__label{
    font-size: 16px !important;
    float: left;
  }
  .cy-menu>>>.el-collapse-item__header .el-checkbox__input{
    font-size: 16px !important;
    float: right;
  }
  .cy-menu>>>.el-collapse-item__content .el-checkbox__label{
    font-size: 13px !important;
    float: left;
    /*width: 63%;*/
    overflow: hidden;
    text-overflow: ellipsis; /*以省略号...显示*/
    white-space: nowrap; /*强制不换行*/
  }
  .cy-menu>>>.el-collapse-item__content .el-checkbox__input{
    font-size: 14px !important;
    float: right;
  }
  .cy-menu>>>.el-checkbox-group .el-checkbox__label{
    font-size: 16px !important;
    float: left;
    width: 72%;
    text-align: left !important;
  }
  .cy-menu>>> #muilt_Z_local .el-checkbox-group .el-checkbox__label{
    font-size: 15px !important;
  }
  .cy-menu>>>.el-checkbox-group .el-checkbox__input{
    font-size: 13px !important;
    float: right;
    z-index: 1000;
  }
  .cy-menu>>> #muiltCheck .el-checkbox-group .el-checkbox__label{
    font-size: 14px !important;
    float: left;
    width: 63%;
    text-align: left !important;
  }
  .cy-menu>>> #muiltCheck_loacl .el-checkbox-group .el-checkbox__label{
    font-size: 13px !important;
    float: left;
    width: 63%;
    text-align: left !important;
  }
  .cy-menu>>>#muiltCheck  .el-checkbox-group .el-checkbox__input{
    font-size: 13px !important;
    float: left;
    z-index: 1000;
  }
  .cy-menu>>>#muiltCheck_loacl  .el-checkbox-group .el-checkbox__input{
    font-size: 13px !important;
    float: left;
    z-index: 1000;
  }
  .cy-menu>>>.el-checkbox-group{
    width: 97%;
    z-index: 100;
  }
  .cy-menu>>>.el-checkbox{
    margin-right: 0px !important;
  }
  .groupC{
    width: 100%;
    height: 35px;
    padding-top: 22px;
    position: relative;
    .groupCBut{
      float: right;
      left: 70%;
      position: absolute;
      /* padding: 2px 5px; */
      top: 19px;
      border-radius: 4px;
      background: #4674F1;
      font-size: 12px;
      /*border: 1px solid #fbd104;*/
      z-index: 1001;
    }
    .groupCButT{
      float: right;
      left:56%;
      position: absolute;
      /* padding: 2px 5px; */
      top: 19px;
      border-radius: 4px;
      background: #4674F1;
      font-size: 12px;
      /*border: 1px solid #fbd104;*/
      z-index: 1001;
    }
    .acgroupCBut{
      background:  #d9dede;
    }
  }
  .groupC>>>.el-checkbox__input.is-checked+.el-checkbox__label{
    color: #fff!important;
  }
  .cy-menu>>>.el-collapse-item__content {
    padding-bottom: 3px !important;
    margin-bottom: 20px;
    border: 1px solid #ECE6E6;
    border-radius: 0 0 5px 5px;
    overflow: hidden;
    width: 99%;
  }
  .cy-menu>>>.el-collapse-item__wrap{
    border-bottom: none;
  }
  .cy-menu>>>.el-scrollbar__wrap{
    /*margin-right: -7px !important;*/
  }
  .cy-menu>>>.el-checkbox__label{
    line-height: 16px !important;
  }
  .cy-menu>>>.el-scrollbar__bar.is-vertical{
    right: -9px;
  }
  .cy-menu>>> .el-slider__button{
    width: 10px !important;
    height: 10px !important;
  }
  .titleSpan{
    padding-left: 10px;
    font-size: 14px !important;
    float: left;
    text-align: left !important;
  }
  .childrenList{
    height: 40px !important;
    line-height: 40px !important;
    /*background-color: #EFF3FD !important;*/
    font-size: 14px;
    cursor: pointer;
    padding-left: 30px !important;
    text-align: left;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow:hidden;
  }
  .activelist {
    color: rgb(135, 171, 255);
  }
  #showTL{
    position: absolute;
    background-color: rgb(255, 255, 255);
    opacity: 0.7;
    width: max-content;
    line-height: 16px;
    margin-left: 2px;
    /*padding-bottom: 10px;*/
    border-radius: 5px;
    padding: 0 15px 10px;
    text-align: left;
    left: 17vw;
    bottom: 4px;
  }
  .muiltslidercon{
    width: calc(100% - 20px);
    float: left;
    padding: 10px;
    background: #fff;
    .muiltsliderSpan{
      float: left;
      width: 25%;
      line-height: 38px;
      font-weight: bold;
      margin-right: 10px;
    }
    .muiltslider{
      float: left;
      width: 70%;
    }
  }
  .muiltCheckCon{
    min-height: 40px;
  }
  .muiltNode{
    text-align: left;
    padding-left: 1vw;
    font-size: 15px;
    float: left;
    width: 24%;
    line-height: 36px;
  }
  .muiltNode_loacl{
    text-align: left;
    padding-left: 1vw;
    // padding-left: 10px;
    font-size: 14px;
    float: left;
    width: 24%;
    line-height: 36px;
  }
  .muiltCheck{

  }
  #muiltCheck{
    text-align: left;
    float: left;
  }
  #muiltCheck_loacl{
    text-align: left;
    float: left;
  }
  #muiltCheck{
    width: 69%;
    .el-checkbox{
      width: 43%!important;
      padding: 10px 0 10px 10px !important;
      .el-checkbox__input{
        float: right !important;
      }
      .el-checkbox__label{
        width: 69% !important;
      }
    }
  }
  #muiltCheck_loacl{
    width: 69%;
    .el-checkbox{
      width: 43%!important;
      padding: 10px 0 10px 10px !important;
      .el-checkbox__input{
        float: right !important;
      }
      .el-checkbox__label{
        width: 69% !important;
      }
    }
  }
  #muiltCheck{
    width: 69%;
    .el-checkbox__input{
      float: right !important;
    }
    .el-checkbox__label{
      width: 69% !important;
    }
  }
  #muiltCheck_loacl{
    width: 69%;
    .el-checkbox__input{
      float: right !important;
    }
    .el-checkbox__label{
      width: 69% !important;
    }
  }
  #muilt_Z_local{
    padding: 5% 3%;
    width: 94%;
  }
  /*#muilt_Z_local>>>.el-collapse-item__heade{*/
  /*background: #F3F6FE !important;*/
  /*}*/
  #muilt_coll .el-collapse-item__heade{
    background: #F3F6FE !important;
  }
  .groupC_local{
    width: 47% !important;
    padding-left: 10px;
  }
  .groupC_local>>> .el-checkbox {
    padding: 0!important;
  }
  .groupC_local>>> .el-checkbox .el-checkbox__input{
    float: left;
  }
  .groupC_local>>> .el-checkbox .el-checkbox__label{
    /*clear: both !important;*/
  }
</style>
