<template>
  <div class="createOrder">
    <div class="createOrder_one" v-if="!showDiv">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
            <span>订单基本信息</span>
          </div>
        </div>
        <div class="content">
          <basicOrderInfo v-if="this.orderStatusIndex === -1 || this.orderStatusIndex === 2" @basicOrderInfoD = basicOrderInfoD></basicOrderInfo>
          <orderNoAduti v-if="this.orderStatusIndex === 0 || this.orderStatusIndex === 1 || this.orderStatusIndex === 5 || this.orderStatusIndex === 6 || this.orderStatusIndex === 7"></orderNoAduti>
          <!--<div :title="index" :name="essentialInfo.length" :class="{lastOne: (index % 2 === 0 && index === essentialInfo.length - 1), content_span: true }" v-for="(item, index) in essentialInfo" :key="index"><span style="color:#999999;display: inline-block; margin-left: 30px; width: 18vh;">{{item.label}} ： </span>-->
            <!--&lt;!&ndash;<span>{{item.value}}</span>&ndash;&gt;-->
            <!--<el-input v-model="item.value">{{item.value}}</el-input>-->
          <!--</div>-->
        </div>
      </el-card>
      <el-card class="box-card"  style="margin: .2rem 0;">
        <div slot="header" class="clearfix">
          <div>
            <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
            <span>2订单附件</span>
          </div>
        </div>
        <div class="content_tow">
          <div v-if="this.orderStatusIndex === 0 || this.orderStatusIndex === 1 || (this.orderStatusIndex === 6 && userProName !== '管理员') || this.orderStatusIndex === 5 || this.orderStatusIndex === 7">
            <div class="content_UP" v-for="(item, index) in upDataD" :key="index" :class="{content_UPz_Z: index === 2 || index === 4, content_UP_b: index === 3}" >
            <div style="margin-bottom: 14px;">{{item.label}}<img v-if="(orderDetlia.getMethod==='在线下载'&&index < 4) || (orderDetlia.getMethod !=='在线下载'&&index === 3) || (orderDetlia.getMethod !=='在线下载'&&index < 2)" src="@/assets/img/noetmp.png" alt=""></div>
              <div v-for="(e, index) in item.file" :key="index">
                <!--<a  :href="e.fDataPath" target="_blank" download>{{e.fDataName.slice(19, e.fDataName.length)}}</a>-->
                <a style="cursor: pointer" @click="opendown(e.fDataPath, e.fDataName.slice(19, e.fDataName.length))">{{e.fDataName.slice(19, e.fDataName.length)}}</a>
                <!--<span @click="opendown(e.fDataPath)">{{e.fDataName}}</span>-->
              </div>
            </div>
          </div>
          <upDataFile v-if="this.orderStatusIndex === -1 || this.orderStatusIndex === 2 || (this.orderStatusIndex === 6 && userProName === '管理员')" @upDataFileClick = upDataFileClick  :UpgetMethod="UpgetMethod"></upDataFile>
        </div>
      </el-card >
      <el-card class="box-card" style="margin: .2rem 1% .2rem 0; width: 50%; float:left; height: 40vh;">
        <div slot="header" class="clearfix">
          <div>
            <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
            <span>订购数据信息</span>
          </div>
        </div>
        <div class="content">
          <el-table
            @row-click="handleRow"
            @selection-change="handleSelectionChange"
            :data="tableData"
            style="width: 100%">
            <!--<el-table-column  type="selection" width="55"></el-table-column>-->
            <el-table-column  width="55">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="imageAllCheck" @change="currentPageAllSelect"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <div>
                  <el-checkbox v-model="scope.row.isSelect"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="75" label="拇指图">
              <template slot-scope="scope">
                <img :src="scope.row.imageurl" alt="" width="44px" height="28px">
              </template>
            </el-table-column>
            <el-table-column label="数据类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{dataTypeData[parseInt(scope.row.datatype)]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dataname" label="数据名称" show-overflow-tooltip></el-table-column>
            <el-table-column
              label="数据状态"
              align="center">
              <template slot-scope="scope">
                <span @click.stop="getFlogData(scope.row)" :class="{colorindexO: scope.row.sstatus === 2}" v-if="orderStatusIndex === 6 || orderStatusIndex === 1">{{dataStutas[scope.row.sstatus]}} <i v-if="scope.row.sstatus === 2" class="el-icon-search"></i></span>
                <span v-if="orderStatusIndex !== 6 && orderStatusIndex !== 1">-</span>
              </template>
              <span></span>
            </el-table-column>
            <el-table-column
              label="操作"
              style="cursor: pointer"
              align="center">
              <template slot-scope="scope">
                <img title="预览" style="margin-right: 10px; cursor: pointer;" width="16px" height="16px" src="@/assets/img/showDetail.png" alt="" @click="handleDetails(scope.row)" >
                <!--<img style="cursor: pointer;"  v-if="orderStatusIndex === -1" title="删除" width="16px" height="16px" src="@/assets/img/deleicon.png" alt="" @click="handleDelete(scope.$index, scope.row)" >-->
                <!--<el-button type="primary" size="mini">详情</el-button>-->
                <!--<el-button @click="removeData(scope.row)" type="danger" size="mini"><i style="margin-right: 8px;" class="el-icon-upload2"></i>导 出</el-button>-->
              </template>
            </el-table-column>
          </el-table>
          <el-checkbox @change="changeshopTableDataAll" style="float: left;margin: 15px 19px 0;" v-model="checkedAllData">全 选</el-checkbox>
          <el-button style="float:left; margin: 10px 10px 0;" @click="exportData" size="mini" type="primary">导出</el-button>
          <el-button v-if="userProName === '管理员' && showCT && orderStatusIndex !== 5" style="float:left; margin: 10px 0;" @click="downloadAgain" size="mini" type="primary">重提</el-button>
          <span style="font-size: 13px; float: right; margin: 20px 10px 0">总共 {{this.totalNum}} 页</span>
          <el-pagination
            class="pagination"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            style="margin: 10px 10px 0;float:right; "
            layout="total, prev, jumper, next "
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <el-card class="box-card mapDivDialogDec" style="margin: .2rem 0; width: 48.6%; float:left;">
        <div class="mapDivDialogDe_map">
          <div ref="mapDivDialogDe" id="mapDivDialogDe" class="map" style="height: 100%;"></div>
        </div>
      </el-card>
      <div style="width: 100%;text-align: center;" class="">
        <!--// 待审核——是否管理员-->
        <div v-if="orderStatusIndex === 0">
          <div v-if="userProName === '管理员'">
            <el-button @click="handleEditTg(1, orderDetlia)" style="margin: 0.2rem; " type="primary"  >审核通过</el-button>
            <el-button @click="handleEditBtg(2, orderDetlia)" style="margin: 0.2rem;" type="danger"  >2驳 回</el-button>
          </div>
          <div v-if="userProName !== '管理员'">
            <!--<el-button @click="goSubmitData(-1)" style="margin: 0.2rem; " type="primary"  >保 存</el-button>-->
            <el-button @click="goSubmitData(-1, '撤回')" style="margin: 0.2rem;" type="primary"  >撤 回</el-button>
          </div>

        </div>
        <!--// 审核未通过-->
        <div v-if="orderStatusIndex === 2">
          <el-button @click="goSubmitData(-1)" style="margin: 0.2rem; " type="primary"  >暂 存</el-button>
          <el-button @click="goSubmitData(0)" style="margin: 0.2rem;" type="primary"  >重新提交</el-button>
        </div>
        <!--待提交-->
        <div v-if="orderStatusIndex === -1">
          <el-button @click="goSubmitData(-1)" style="margin: 0.2rem; " type="primary"  >保 存</el-button>
          <el-button @click="goSubmitData(0)" style="margin: 0.2rem;" type="primary"  >提 交</el-button>
        </div>
        <!--异常订单-->
        <div v-if="orderStatusIndex === 5">
          <!--<el-button @click="goSubmitData(-1)" style="margin: 0.2rem; " type="primary"  >订单重置</el-button>-->
          <!--<el-button @click="handleEditBtg(2, orderDetlia)" style="margin: 0.2rem;" type="danger"  >订单驳回</el-button>-->
        </div>
        <!--数据准备完成订单-->
        <!--orderDetlia.getMethod === '线下拷贝' &&-->
        <div v-if="orderStatusIndex === 6">
          <el-button @click="getOrderFile" style="margin: 0.2rem;" type="danger"  >下载订单附件</el-button>
          <el-button v-if="userProName === '管理员'" @click="goSubmitData(7, '订单状态置为完成！')" style="margin: 0.2rem;" type="success"  >完成订单</el-button>
          <el-button v-if="userProName === '管理员'" @click="goSubmitData(6, '暂存成功！')" style="margin: 0.2rem;" type="success">暂存</el-button>
          <el-button v-if="userProName === '管理员'" @click="changeState(5, orderDetlia.id)" style="margin: 0.2rem;" type="warning"  >逾期订单</el-button>
        </div>
        <!--完成订单-->
        <div v-if="orderStatusIndex === 1  || orderStatusIndex === 7">
          <!--<el-button @click="goSubmitData(-1)" style="margin: 0.2rem; " type="primary"  >保 存</el-button>-->
          <el-button @click="getOrderFile" style="margin: 0.2rem;" type="danger"  >下载订单附件</el-button>
        </div>
      </div>
    </div>
    <dialogShowDetail :titleDialog = titleDialog></dialogShowDetail>
    <el-dialog class="elDialog_Aduti" :title="title" :visible.sync="dialogVisible" width="7rem">
      <span>
        <div style="width: 100%">
              <el-input :rows="4"
                        type="textarea"
                        v-model="inputFeekBack"></el-input>
        </div>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   @click="dialogVisible = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="audit(2, orderDetlia)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="this.titleDialog_titleZ"
      :visible.sync="dialogVisibleDetailZ"
      class="dialog_contentz"
      :append-to-body = 'true'
      width="57%">
      <div class="eldialog_conz">
        <img width="100%" height="100%"  :src="showUrlZ" alt="" v-if="showType">
        <iframe :src="showUrlZ"  width="100%" height="100%" v-if="!showType"></iframe>
      </div>
    </el-dialog>
    <el-dialog class="elDialog_Aduti" :title="titleFlog" :visible.sync="dialogVisibleFlog" width="7rem">
      <span>
        <div style="width: 100%">
          <!--<el-form ref="form" label-width="2rem" style="text-align: left">-->
          <!--<el-form-item>-->
              <el-input :rows="4"
                        type="textarea"
                        :disabled="true"
                        v-model="inputFeekBackFlog"></el-input>
          <!--</el-form-item>-->
          <!--</el-form>-->
        </div>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   type="primary"
                   @click="dialogVisibleFlog = false">确 定</el-button>
        <!--<el-button size="small"-->
        <!--type="primary"-->
        <!--@click="editDialogVisible"-->
        <!--v-if="show === false">确 定</el-button>-->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import customTable from '@comm/components/customTable'
import dialogShowDetail from '@comm/components/dialogShowDetail'
import orderNoAduti from '@comm/components/orderNoAduti'
import upDataFile from '@comm/components/upDataFile'
import basicOrderInfo from '@comm/components/basicOrderInfo'
import http from '@comm/service/interface.js'
import { mapActions, mapState } from 'vuex'
import GISMap from '@comm/map/GISMap.js'
import axios from 'axios'
// import featureUtils from '@/map/lib/featureUtils'
import * as MapData from '@comm/map/lib/mapData.js'
const { baseMapInitParameters } = MapData
let gisMapDiaDe = null
export default {
  components: {
    customTable,
    basicOrderInfo,
    orderNoAduti,
    dialogShowDetail,
    upDataFile
  },
  data () {
    var validateUserCardId = (rule, value, callback) => {
      let regPass = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
      if (regPass.test(value) === '') {
        callback(new Error('请输入新信息'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的身份证信息'))
        }
      }
    }
    return {
      multipleSelection: [],
      inputFeekBack: '',
      title: '请填写审批未通过原因:',
      orderStatusIndex: 0,
      dataTypeData: ['原始影像数据', '档案资料数据', '航空影像数据', '标准产品', 'J星产品'],
      showCT: false,
      buttonShow: false,
      userProName: '管理员',
      titleDialog: '订购数据详情',
      dialogShowData: {},
      UpgetMethod: [],
      orderDetlia: {},
      FJdataURl: '',
      showDiv: false,
      showType: false,
      titleDialog_titleZ: '',
      showUrlZ: '',
      dialogVisibleDetailZ: false,
      textarea: '',
      rules: {
        userCardId: [
          { validator: validateUserCardId, trigger: 'blur' },
          { min: 15, message: '请输入正确的证件信息', trigger: ['blur', 'change'] }
        ]
      },
      essentialInfo: [
        {
          label: '订单编号',
          value: '1234057943850439'
        },
        {
          label: '申请人',
          value: '杜文祥'
        },
        {
          label: '订单账号',
          value: 'xiaobaibai83757'
        },
        {
          label: '联系电话',
          value: '13698374928'
        },
        {
          label: '订购产品数量',
          value: '38景'
        },
        {
          label: '项目名称',
          value: '远安至保康支线铁路一期工程可研1：1万区域地质调绘项目'
        },
        {
          label: '订购数据量',
          value: '16.798GB'
        },
        {
          label: '申请单位',
          value: '北京航天宏图股份有限公司'
        },
        {
          label: '订单生成时间',
          value: '2020/06/10'
        },
        {
          label: '用途领域',
          value: '科研'
        },
        {
          label: '订单状态',
          value: '审核通过'
        },
        {
          label: '在线下载',
          value: '否'
        },
        {
          label: '备注',
          value: '2020/06/10'
        }
      ],
      filesForm: {},
      dialogFormDataClear: false,
      dialogFormDataClearSub: false,
      comData: 0,
      uploadFileList: {
        taskDataCard: [], // 3：任务来源说明文件
        identityCard: [], // 1 身份证
        introductionLetter: [], // 2 介绍信
        otherDoc: [], // 4 其他
        regisForm: [] // 5：签字后的分发登记表
      },
      formLabelWidth: '80px',
      dialogFormVisible: false,
      getMethodOptions: [
        {
          label: '在线下载',
          value: '在线下载'
        },
        {
          label: '线下拷贝',
          value: '线下拷贝'
        }
      ],
      usageOptions: [
        {
          label: '地质矿产资源调查与评价',
          value: '地质矿产资源调查与评价'},
        {
          label: '矿产资源开发现状调查与监管',
          value: '矿产资源开发现状调查与监管'},
        {
          label: '地质灾害调查与监测',
          value: '地质灾害调查与监测'},
        {
          label: '灾害应急',
          value: '灾害应急'},
        {
          label: '生态地质调查与监测',
          value: '生态地质调查与监测'},
        {
          label: '境外地质',
          value: '境外地质'},
        {
          label: '土地利用',
          value: '土地利用'},
        {
          label: '测绘',
          value: '测绘'},
        {
          label: '科研',
          value: '科研'},
        {
          label: '其他',
          value: '其他'}
      ],
      dataStutas: ['已提取', '提取中', '提取失败'],
      dialogVisible: false,
      imageAllCheck: false,
      checkedAllData: false,
      dataListDel: [],
      userDisabled: false,
      companyDisabled: false,
      phoneDisabled: false,
      total: 0,
      tableDataAll: [],
      currentPage: 1,
      dialogVisibleFlog: false,
      titleFlog: '数据提取失败原因:',
      inputFeekBackFlog: '',
      totalNum: 0,
      wktData: [],
      pageSize: 5,
      labelPosition: 'top',
      formLabelAlign: {
        user: '',
        phone: '',
        company: '',
        employ: '',
        downloadWay: '2',
        disFrequency: '',
        delayInterval: '',
        extractionPaths: '',
        descriptor: '',
        getMethod: '在线下载',
        userCardId: ''
      },
      tableData: [],
      companyData: [],
      spanLabelData: '',
      disFrequencyData: [
        {label: '按天', value: '0'},
        {label: '按周', value: '1'},
        {label: '按月', value: '2'},
        {label: '按年', value: '3'}
      ],
      delayIntervalData: [
        {label: '不延迟', value: '0'},
        {label: '延迟1小时', value: '1'},
        {label: '延迟2小时', value: '2'}
      ],
      extractionPathsData: [],
      orderId: [],
      shopfIds: [],
      userID: '',
      orderReference: '',
      proID: '',
      list: [],
      upDataD: [
        {
          id: '6',
          label: '任务来源说明文件',
          file: []
        },
        {
          id: '7',
          label: '签字后的分发登记表',
          file: []
        },
        {
          id: '2',
          label: '介绍信',
          file: []
        },
        {
          id: '1',
          label: '身份证',
          file: []
        },
        {
          id: '4',
          label: '其他附件',
          file: []
        }
      ],
      dataIdArr: [],
      wktresponseArr: []
    }
  },
  watch: {
    dialogFormDataClear () {
      if (this.dialogFormDataClear) {
        this.dialogFormDataClearSub = true
      } else {
        this.dialogFormDataClearSub = false
      }
    },
    orderDetailI: {
      handler (newD, oldD) {
        // console.log(newD, 'val123')
        // console.log(oldD, 'val123')
      },
      deep: true
    },
    spanLabel: {
      handler (newD, oldD) {
        this.spanLabelData = newD
      },
      deep: true
    },
    tableData: {
      handler (newVal, oldVal) {
        let _this = this
        let indexArr = []
        this.dataIdArr = []
        this.wktresponseArr = []
        if (newVal) {
          if (newVal.length > 0) {
            newVal.forEach(item => {
              if (!item.isSelect) {
                indexArr.push(item)
              } else {
                this.dataIdArr.push(item.did)
                this.wktresponseArr.push(item.wktresponse)
              }
            })
          }
        }
        if (indexArr.length > 0) {
          _this.imageAllCheck = false
        } else {
          _this.imageAllCheck = true
        }
      },
      deep: true
    },
    tableDataAll: {
      handler (newVal, oldVal) {
        let indexAllArr = []
        if (newVal.length > 0) {
          newVal.forEach(item => {
            if (!item.isSelect) {
              indexAllArr.push(item)
            }
          })
        }
        if (indexAllArr.length > 0) {
          this.checkedAllData = false
        } else {
          this.checkedAllData = true
        }
      },
      deep: true
    }
  },
  mounted () {
    this.pageSize = this.changeFixedPageSizeZ(document.documentElement.clientHeight * 0.4 - 140, 45)
    let orderDataID = sessionStorage.getItem('orderDataID')
    this.$nextTick(() => {
      // if (!this.$refs.mapDivDialogDe.innerHTML) {
      this.baseMapInit()
      // }
      this.orderDetlia = JSON.parse(orderDataID)
      console.log(this.orderDetlia, 'this.orderDetlia')
      this.orderDetlia.creattime = this.commonMethod.setDateTime(this.orderDetlia.creattime)
      this.getTabelDataAll(this.orderDetlia.id)
      this.getByOrderIdFileD(this.orderDetlia.id)
      this.orderReference = this.orderDetlia.ordername
      this.basicOrderInfoD(this.orderDetlia) // 初始化属性值
      this.getDataIndex(this.orderDetlia.sstatus)
      this.getUserR()
      this.getDataUrlFJ()
    })
  },
  methods: {
    baseMapInit () {
      gisMapDiaDe = new GISMap('MainMapDiaDe')
      gisMapDiaDe.baseMapInit(baseMapInitParameters, () => {
        gisMapDiaDe.map.on('moveend', gisMapDiaDe.checkZoomAndCenter.bind(gisMapDiaDe))
      }, 'mapDivDialogDe', false)
    },
    zoomto (wktResponse, index) {
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
      gisMapDiaDe.drawPolygon(feature)
    },
    getTotalNum (val) {
      this.totalNum = 0
      if (val !== 0) {
        this.totalNum = val
        let zc = parseInt(val / this.pageSize)
        let ys = val % this.pageSize
        if (zc !== 0 && ys !== 0) {
          this.totalNum = zc + 1
        } else if (zc !== 0 && ys === 0) {
          this.totalNum = zc
        } else {
          this.totalNum = 1
        }
      }
    },
    getUserR () {
      let userID = JSON.parse(localStorage.getItem('principalUserID'))
      let userRote = JSON.parse(userID.principal)
      if (userRote.roleIds.length > 0) {
        if (userRote.roleIds[0].indexOf('管理员') > -1) {
          this.userProName = '管理员'
          this.userName = null
        } else {
          this.userProName = ''
          this.userName = userRote.userName
        }
      } else {
        this.userProName = ''
        this.userName = userRote.userName
      }
    },
    getDataIndex (val) {
      if (val === '待提交订单' || val === -1) {
        this.orderStatusIndex = -1
      } else if (val === '待审核订单' || val === 0) {
        this.orderStatusIndex = 0
      } else if (val === '审核通过订单' || val === 1) {
        this.orderStatusIndex = 1
      } else if (val === '审核未通过订单' || val === 2) {
        this.orderStatusIndex = 2
      } else if (val === '数据准备完成订单' || val === 6) {
        this.orderStatusIndex = 6
      } else if (val === '已完成订单' || val === 7) {
        this.orderStatusIndex = 7
      } else if (val === '逾期订单' || val === 5) {
        this.orderStatusIndex = 5
      } else if (val === '全部订单' || val === 'orderManage') {
        this.orderStatusIndex = ''
      }
    },
    handleRow (row, column, event) {
      let f = gisMapDiaDe.transformFeatureFromWkt(row.wktresponse)
      // 飞到某地
      gisMapDiaDe.flyTo(f, () => {})
    },
    handleSelectionChange () {
      this.dataIdArr = []
      this.wktresponseArr = []
      if (this.tableDataAll.length > 0) {
        this.tableDataAll.forEach(item => {
          this.dataIdArr.push(item.dataid)
          this.wktresponseArr.push(item.wktresponse)
        })
      }
    },
    downloadAgain () {
      if (this.orderDetlia.id) {
        http.getAgrsGetDataAgainAll({
          data: {
            orderIdStr: this.orderDetlia.id
          }
        }).then(res => {
          if (res.data === 'true') {
            this.$message({
              message: '重提数据成功！',
              type: 'success'
            })
            this.getTabelDataAll(this.orderDetlia.id)
          } else {
            this.$message({
              message: '重提数据失败！',
              type: 'warning'
            })
          }
        })
      }
    },
    exportData () {
      let ListWkt = []
      let ListDataName = []
      let ListSatellite = []
      let ListSensor = []
      let dids = []
      let nodeIds = []
      this.dataIdArr = []
      this.wktresponseArr = []
      if (this.tableDataAll.length > 0) {
        this.tableDataAll.forEach(item => {
          if (item.isSelect) {
            this.dataIdArr.push(item.did)
            this.wktresponseArr.push(item.wktresponse)
            ListWkt.push(item.wktresponse)
            ListDataName.push(item.dataname)
            ListSatellite.push(item.satelite)
            ListSensor.push(item.sensor)
            dids.push(item.did.toString())
            nodeIds.push(item.nodeid)
          }
        })
        if (this.dataIdArr.length > 0) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          http.getderiveShopDateOnlyShpByNew({
            data: {
              wktlist: ListWkt,
              listDataName: ListDataName,
              satelites: ListSatellite,
              sensors: ListSensor,
              dids: dids,
              nodeIds: nodeIds,
              dataIds: this.dataIdArr,
              typeId: '2'
            }
          }).then(res => {
            loading.close()
            window.open(res.data, '_blank')
            // window.location.href = res.data
          })
        } else {
          this.$message({
            message: '请选择要导出的数据！',
            type: 'warning'
          })
        }
      } else {
        this.$message({
          message: '暂无数据！',
          type: 'warning'
        })
      }
    },
    histroyFw () {
      this.downloadPDF(this.FJdataURl, this.orderDetlia.ordername)
    },
    getDataUrlFJ () {
      http.agrsGetOrderOldFile({data: {ordername: this.orderDetlia.ordername}}).then(res => {
        if (res.data !== 'false') {
          this.buttonShow = true
          this.FJdataURl = res.data
        } else {
          this.buttonShow = false
        }
      })
    },
    downloadPDF (url, fileName) {
      axios({
        method: 'get',
        responseType: 'arraybuffer',
        url: url
      }).then(function (res) {
        // 调用下载方法，把后端传过来的流传给fileDownload方法
        this.fileDownload(res.data, fileName)
        console.log(res.data, fileName)
      }.bind(this)).catch(
        // this.$message.error('网络请求出错')
      )
    },
    fileDownload (data, fileName) {
      let blob = new Blob([data], {
        // type类型后端返回来的数据中会有，根据自己实际进行修改
        type: 'application/zip'
      })
      let filename = fileName
      if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, filename)
      } else {
        var blobURL = window.URL.createObjectURL(blob)
        // 创建隐藏<a>标签进行下载
        var tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = blobURL
        tempLink.setAttribute('download', filename)
        if (typeof tempLink.download === 'undefined') {
          tempLink.setAttribute('target', '_blank')
        }
        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(blobURL)
      }
    },
    opendown (val, title) {
      this.dialogVisibleDetailZ = true
      this.showUrlZ = val
      this.titleDialog_titleZ = '附件预览—' + title
      if (val.indexOf('jpg') > -1) {
        this.showType = true
      } else {
        this.showType = false
      }
    },
    upDataFileClick (val) {
      this.comData = 1
      for (let key in val) {
        if (val[key].length > 0) {
          // val[key].forEach(item => {
          //   // let nameArr = item.filePath.split('\\')
          //   // item.fileName = nameArr[nameArr.length - 1]
          // })
          this.uploadFileList[key] = val[key]
        } else {
          this.uploadFileList[key] = []
        }
      }
    },
    getTabelData (val) {
      this.setTotalDataLength(0)
      this.wktData = []
      http.getagrsListOfSate({
        data: {orderid: val},
        pageSize: this.pageSize,
        currentPage: this.currentPage
      }).then(res => {
        console.log(res, 'spjefowhegioh')
        gisMapDiaDe.clearAll()
        if (res.data.list.length > 0) {
          res.data.list.forEach((item, index) => {
            // replace('T', ' ')
            item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.dataid + '&nodeId=' + item.nodeid
            item.datasize = this.commonMethod.dataSizeFormatter(item.datasize)
            if (item.receivetime && item.receivetime.indexOf('T') > -1) {
              item.receivetime = item.receivetime.replace('T', ' ')
            }
            // item.scenedate = this.commonMethod.timestampToTime(item.scenedate)
            this.zoomto(item.wktresponse, index)
            this.wktData.push(item.wktresponse)
          })
          if (this.wktData.length === res.data.list.length) {
            this.getwktData()
          }
          this.tableData = res.data.list
          this.total = res.data.total
          this.setTotalDataLength(this.total)
        }
      })
    },
    getTabelDataAll (val) {
      this.showCT = false
      http.getagrsListOfSate({
        data: {orderid: val}
      }).then(res => {
        console.log(res, 'ressasfaf')
        gisMapDiaDe.clearAll()
        this.shopfIds = []
        if (res.data.list.length > 0) {
          res.data.list.forEach((item, index) => {
            item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.did + '&nodeId=' + item.nodeid
            item.datasize = this.commonMethod.dataSizeFormatter(item.datasize)
            item.scenedate = this.commonMethod.timestampToTime(item.scenedate)
            item.receivetime = item.receivetime.replace('T', ' ')
            item.isSelect = false
            this.shopfIds.push(item.dataid)
            this.zoomto(item.wktresponse, index)
            this.wktData.push(item.wktresponse)
            if (item.sstatus === 2) {
              this.showCT = true
            }
          })
          if (this.wktData.length === res.data.list.length) {
            this.getwktData()
          }
          this.tableDataAll = res.data.list
          this.tableData = this.tableDataAll.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
          this.total = res.data.list.length
          this.setTotalDataLength(this.total)
          this.getTotalNum(this.total)
        }
      })
    },
    getwktData () {
      let datax = []
      let datay = []
      if (this.wktData.length > 0) {
        this.wktData.forEach(item => {
          let arrList1 = item.split('((')
          arrList1[1] = arrList1[1].replace(/, /g, ',')
          let arrList = arrList1[1].slice(0, arrList1[1].length - 2).split(',')
          arrList.forEach(e => {
            let arrLic = e.split(' ')
            datax.push(arrLic[0])
            datay.push(arrLic[1])
          })
        })
        let arr2 = datax.sort(this.compare)
        let arr3 = datay.sort(this.compare)
        let wktResponse = 'POLYGON((' + arr2[0] + ' ' + arr3[0] + ',' + arr2[0] + ' ' + arr3[arr3.length - 1] + ',' + arr2[arr2.length - 1] + ' ' + arr3[arr3.length - 1] + ',' + arr2[arr2.length - 1] + ' ' + arr3[0] + ',' + arr2[0] + ' ' + arr3[0] + '))'
        let f = gisMapDiaDe.transformFeatureFromWkt(wktResponse)
        // 飞到某地
        gisMapDiaDe.flyTo(f, () => {})
      }
    },
    compare (num1, num2) {
      return num2 - num1
    },
    getByOrderIdFileD (val) {
      http.getByOrderIdFile({orderId: val}).then(res => {
        if (res.data.length > 0) {
          this.UpgetMethod = res.data
          let arrList = ['', 'identityCard', 'introductionLetter', '', 'otherDoc', '', 'taskDataCard', 'regisForm']
          res.data.forEach(item => {
            this.uploadFileList[arrList[parseInt(item.type)]].push({
              filePath: item.fDataPath,
              fileName: item.fDataName,
              fileType: item.type
            })
            this.upDataD.forEach(e => {
              if (e.id === item.type) {
                e.file.push(item)
              }
            })
          })
        }
      })
    },
    dialogResetFields () {
      if (this.dialogVisible === false) {
        if (this.$refs['ruleForm1'] !== undefined) {
          this.$refs['ruleForm1'].resetFields()
        }
        if (this.$refs['ruleForm2'] !== undefined) {
          this.$refs['ruleForm2'].resetFields()
        }
      }
    },
    saveData () {
      this.goSubmitData(-1)
    },
    handleEditTg (index, row) {
      this.$confirm('审核通过后，订单将进入数据准备状态，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.audit(index, row)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    },
    handleEditBtg (index, row) {
      this.inputFeekBack = ''
      this.dialogVisible = true
    },
    audit (index, row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let loginName = localStorage.getItem('userId')
      http.auditOrder({
        data: {
          'cause': this.inputFeekBack,
          'orderid': row.id,
          'orderName': row.ordername,
          'status': index,
          'auditor': loginName
        }
      }).then(res => {
        loading.close()
        if (res.data) {
          this.$notify({
            message: '审核成功！',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          if (index === 1) {
            this.setSpanLabel('待审核订单')
            this.$router.push({name: 'orderManage_stayAudit_rep'})
          } else {
            this.setSpanLabel('待提交订单')
            this.$router.push({name: 'orderManage_stayAudit_rep'})
          }
        } else {
          this.$notify.error({
            message: '审核失败！',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
      this.dialogVisible = false
    },
    upDataFileTow (val, string) {
      let fileArr = this.uploadFileList.taskDataCard.concat(this.uploadFileList.regisForm, this.uploadFileList.introductionLetter, this.uploadFileList.identityCard, this.uploadFileList.otherDoc)
      if (this.orderDetlia.ordername) {
        http.updateOrderFileList(
          {data: {
            uploadFileList: fileArr,
            ordername: this.orderDetlia.ordername,
            id: this.orderDetlia.id,
            sstatus: val
          }}
        ).then(res => {
          if (res.data === 'true') {
            if (string) {
              this.$message({
                message: '撤回成功！',
                type: 'success'
              })
            } else {
              this.$message({
                message: val === 0 ? '提交成功！' : '保存成功',
                type: 'success'
              })
            }
            if (val === 0) {
              this.setSpanLabel('待审核订单')
              this.$router.push({name: 'orderManage_stayAudit_rep'})
            } else {
              this.setSpanLabel('待提交订单')
              this.$router.push({name: 'orderManage_staySubmit_rep'})
            }
          } else {
            if (string) {
              this.$message({
                message: '撤回失败！',
                type: 'success'
              })
            } else {
              this.$message({
                message: val === 0 ? '提交失败！' : '保存失败',
                type: 'error'
              })
            }
          }
        })
      }
    },
    // 修改订单状态
    changeState (index, id) {
      this.$confirm('修改订单状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.update(index, id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        })
      })
    },
    update (index, id) {
      http.stateOrder({
        orderId: id,
        orderStatus: index
      }).then(res => {
        if (res.data === '1') {
          this.$message({
            message: '修改状态成功！',
            type: 'success'
          })
          if (index === 7) {
            this.setSpanLabel('已完成订单')
            this.$router.push({name: 'orderManage_completeAudit_rep'})
          } else {
            this.setSpanLabel('逾期订单')
            this.$router.push({name: 'orderManage_unusualAudit_rep'})
          }
        } else {
          this.$message({
            message: '修改状态失败！',
            type: 'error'
          })
        }
      })
      this.dialogVisible = false
    },
    getOrderFile () {
      http.getOrderFileByOrderId({
        orderId: this.orderDetlia.id,
        orderName: this.orderReference
      }).then(res => {
        if (res.data) {
          // window.open(res.data, '_blank')
          this.downloadPDF(res.data, this.orderReference)
        }
      })
    },
    goSubmitData (val, string) {
      if (this.comData === 0 && this.orderStatusIndex === 2 && this.formLabelAlign.getMethod === this.orderDetlia.getMethod && this.formLabelAlign.user === this.orderDetlia.applyuser && this.formLabelAlign.phone === this.orderDetlia.applyUserPhone && this.formLabelAlign.proName === this.orderDetlia.productName && this.formLabelAlign.company === this.orderDetlia.applyUserUnit && this.formLabelAlign.employ === this.orderDetlia.applyUserUsed && this.textarea === this.orderDetlia.description && this.formLabelAlign.extractingElements === this.orderDetlia.extractingElements
      ) {
        this.$message({
          message: '请更改信息！',
          type: 'warning'
        })
        return
      }
      if (this.formLabelAlign.user === '' || this.formLabelAlign.company === '' || this.formLabelAlign.getMethod === '' || this.formLabelAlign.proName === '' || this.formLabelAlign.employ === '' || this.formLabelAlign.phone === '' || this.formLabelAlign.extractingElements === '') {
        this.$message({
          message: '必填项不能为空！',
          type: 'warning'
        })
      } else {
        if (this.tableData.length > 0) {
          this.goSubmit(val, string)
        } else {
          this.$message({
            message: '订购数据不能为空！',
            type: 'warning'
          })
        }
      }
    },
    basicOrderInfoD (val) {
      this.formLabelAlign.phone = val.applyUserPhone
      this.formLabelAlign.company = val.applyUserUnit
      this.formLabelAlign.getMethod = val.getMethod
      this.formLabelAlign.proName = val.productName
      this.formLabelAlign.employ = val.applyUserUsed
      this.formLabelAlign.user = val.applyuser
      // this.formLabelAlign.processDescribe = val.processDescribe
      this.orderDetlia.proInstructions = val.processDescribe
      this.formLabelAlign.extractingElements = val.extractingElements
      this.textarea = val.description
    },
    dialogFormBeforeClose () {
      this.$confirm('此操作将无法保存已上传的附件, 是否继续?', '提示', {
        confirmButtonText: '保存并退出',
        cancelButtonText: '清空并退出',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.dialogFormVisible = false
        this.dialogFormDataClear = false
      }).catch(() => {
        this.dialogFormVisible = false
        this.dialogFormDataClear = true
      })
    },
    createShopOrder () {
      this.dialogFormVisible = false
    },
    changeshopTableDataAll () {
      if (this.checkedAllData) {
        this.tableDataAll.map(item => {
          item.isSelect = true
        })
      } else {
        this.tableDataAll.map(item => {
          item.isSelect = false
        })
      }
    },
    currentPageAllSelect () {
      if (this.imageAllCheck) {
        this.tableData.map(item => {
          item.isSelect = true
        })
      } else {
        this.tableData.map(item => {
          item.isSelect = false
        })
      }
    },
    getFlogData (val) {
      if (val.sstatus === 2) {
        this.dialogVisibleFlog = true
        this.inputFeekBackFlog = val.flog
      }
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.tableData = this.tableDataAll.slice((val - 1) * this.pageSize, val * this.pageSize)
    },
    createOrder (val, string) {
      this.orderId = []
      this.shopfIds = []
      this.tableDataAll.forEach(item => {
        this.orderId.push(item.dataid)
        this.shopfIds.push(item.dataid)
      })
      this.confirmOrder(val, string)
    },
    confirmOrder (val, string) {
      this.openFullScreen()
      http.getagrsUpdateSave({data: {
        getMethod: this.formLabelAlign.getMethod, // 获取方式
        // userCardId: this.formLabelAlign.userCardId, // 身份证号
        deleteDataId: this.dataListDel, // 删除数据ID
        shopIds: this.orderId, // 余留数据ID
        sstatus: val,
        id: this.orderDetlia.id,
        cause: '',
        productName: this.formLabelAlign.proName, // 项目名称
        distmethod: this.formLabelAlign.getMethod === '在线下载' ? 0 : 2,
        description: this.textarea, // 备注
        descriptor: this.formLabelAlign.processDescribe, // 再加工说明
        // dataNum: this.tableData.length, // 数据条数
        // dataSum: this.dataSizeAll, // 数据总量
        applyUserUsed: this.formLabelAlign.employ, // 使用用途
        applyuser: this.formLabelAlign.user, // 申请人
        applyUserPhone: this.formLabelAlign.phone, // 申请人联系方式
        applyUserUnit: this.formLabelAlign.company, // 申请人单位
        // 不改变的属性
        ordername: this.orderReference, // 订单名称
        // downlodPathFile: this.orderDetlia.downlodPathFile,
        userid: this.orderDetlia.userid,
        delaytime: this.orderDetlia.delaytime,
        userName: this.orderDetlia.userName,
        loginUser: this.orderDetlia.loginUser,
        groupName: this.orderDetlia.groupName,
        creattime: this.orderDetlia.creattime,
        dataType: this.orderDetlia.dataType,
        // 再加工订单参数===================
        type: 2,
        processDescribe: this.orderDetlia.proInstructions,
        assignment: this.orderDetlia.levelD,
        endtime: this.orderDetlia.endtime
        // ===========================
      }}).then(res => {
        if (res.data === 'true') {
          this.comData = 0
          this.upFileData(val, string)
        } else {
          this.closeFullScreen(this.openFullScreen())
          this.$message({
            message: '操作失败！',
            type: 'success'
          })
        }
      })
    },
    upFileData (val, string) {
      let fileArr = this.uploadFileList.taskDataCard.concat(this.uploadFileList.regisForm, this.uploadFileList.introductionLetter, this.uploadFileList.identityCard, this.uploadFileList.otherDoc)
      if (this.orderDetlia.ordername) {
        http.updateOrderFileList(
          {data: {
            uploadFileList: fileArr,
            ordername: this.orderDetlia.ordername,
            id: this.orderDetlia.id,
            sstatus: val
          }}
        ).then(res => {
          this.closeFullScreen(this.openFullScreen())
          if (res.data === 'true') {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            if (val === 0) {
              this.setSpanLabel('待审核订单')
              this.$router.push({name: 'orderManage_stayAudit_rep'})
            } else if (val === -1) {
              this.setSpanLabel('待提交订单')
              this.$router.push({name: 'orderManage_staySubmit_rep'})
            } else if (val === 6) {
              this.setSpanLabel('数据准备完成订单')
              this.$router.push({name: 'orderManage_dataReadyFinish_rep'})
            } else if (val === 7) {
              this.setSpanLabel('已完成订单')
              this.$router.push({name: 'orderManage_completeAudit_rep'})
            }
          } else {
            this.$message({
              message: '操作失败！',
              type: 'success'
            })
          }
        })
      }
    },
    upFileDataDataCom (val, string) {
      let fileArr = this.uploadFileList.taskDataCard.concat(this.uploadFileList.regisForm, this.uploadFileList.introductionLetter, this.uploadFileList.identityCard, this.uploadFileList.otherDoc)
      if (this.orderDetlia.ordername) {
        http.updateOrderFileList(
          {data: {
            uploadFileList: fileArr,
            ordername: this.orderDetlia.ordername,
            id: this.orderDetlia.id,
            sstatus: val
          }}
        ).then(res => {
          if (res.data === 'true') {
            this.$message({
              message: string,
              type: 'success'
            })
            this.upDataStu(val, string)
            this.setSpanLabel('数据准备完成订单')
            this.$router.push({name: 'orderManage_dataReadyFinish_rep'})
          } else {
            this.$message({
              message: '操作失败！',
              type: 'error'
            })
          }
        })
      }
    },
    goSubmit (val, string) {
      if (val !== -1) {
        if (this.formLabelAlign.getMethod === '在线下载') {
          if (this.uploadFileList.taskDataCard.length === 0 || this.uploadFileList.identityCard.length === 0 || this.uploadFileList.introductionLetter.length === 0 || this.uploadFileList.regisForm.length === 0) {
            this.$message({
              message: '请上传必传项！',
              type: 'warning'
            })
          } else {
            this.getUpDataOrder(val, string)
          }
        } else {
          if (this.uploadFileList.taskDataCard.length === 0  || this.uploadFileList.identityCard.length === 0 || this.uploadFileList.regisForm.length === 0) {
            this.$message({
              message: '请上传必传项！',
              type: 'warning'
            })
          } else {
            this.getUpDataOrder(val, string)
          }
        }
      } else {
        this.getUpDataOrder(val, string)
      }
    },
    getUpDataOrder (val, string) {
      this.createOrder(val, string)
    },
    goSubmitDataCom (val, string) {
      if (val === 7) {
        if (this.uploadFileList.taskDataCard.length === 0 || this.uploadFileList.identityCard.length === 0 || this.uploadFileList.introductionLetter.length === 0 || this.uploadFileList.regisForm.length === 0) {
          this.$message({
            message: '请上传必传项！',
            type: 'warning'
          })
        } else {
          this.upFileDataDataCom(val, string)
        }
      } else {
        this.upFileDataDataCom(val, string)
      }
    },
    // 自动创建订单名称
    createName () {
      let name = ''
      let d = new Date()
      d.getYear() // 年月日[NW][WDP]0000
      name += d.getFullYear()
      var m = d.getMonth() + 1
      name += (m > 9 ? m : ('0' + m))
      var day = d.getDay()
      name += (day > 9 ? day : ('0' + day))
      name += 'WP'
      var hh = d.getHours()
      name += (hh > 9 ? hh : ('0' + hh))
      var mm = d.getMinutes()
      name += (mm > 9 ? mm : ('0' + mm))
      var ss = d.getSeconds()
      name += (ss > 9 ? ss : ('0' + ss))
      var mis = d.getMilliseconds()
      if (mis < 10) {
        name += ('00' + mis)
      } else if (mis < 100 && mis > 9) {
        name += ('0' + mis)
      } else {
        name += mis
      }
      return name
    },
    handleDelete (index, row) {
      let arrID = []
      this.dataListDel.push(row.dataid)
      let dataList = []
      this.tableData.forEach(item => {
        if (item.dataid !== row.dataid) {
          dataList.push(item)
          arrID.push(item.dataid)
        }
      })
      this.tableData = dataList
    },
    handleDetails (row) {
      this.setDialogShowDataZ(row)
      this.setDetailShow(1)
    },
    openFullScreen () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      return loading
    },
    closeFullScreen (loading) {
      loading.close()
    },
    ...mapActions('searchStore', {
      setShopAgen: 'setShopAgen',
      setShopIDs: 'setShopIDs',
      setSpanLabel: 'setSpanLabel',
      setDialogShowDataZ: 'setDialogShowDataZ',
      setTotalDataLength: 'setTotalDataLength',
      setDetailShow: 'setDetailShow'
    }),
    ...mapActions('manage', {
      setRouterPath: 'setRouterPath'
    })
  },
  computed: {
    ...mapState({
      token: function (state) {
        return state.user.token
      },
      shopIDs: function (state) {
        return state.searchStore.shopIDs
      }
    }),
    ...mapState('searchStore', {
      orderDetailId (state) {
        return state.orderDetailId
      },
      spanLabel (state) {
        this.spanLabelData = state.spanLabel
        return state.spanLabel
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .el-input, .el-select {
    /*width: 280px!important;*/
    width: 21.2vw !important;
  }
  #uploadFilesDialog ::v-deep .el-dialog__footer{
    background-color: #F3F3F3!important;
  }
  #uploadFilesDialog ::v-deep .el-form-item__label{
    border-left: .1rem solid #2E6CFC;
    margin-top: 5px;
    line-height: 14px;
  }
  #uploadFilesDialog ::v-deep .el-upload--picture-card{
    width: 80px;
    height: 80px;
    line-height: 80px!important;
  }
  #uploadFilesDialog ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 80px!important;
    height: 80px!important;
    margin-bottom: 0 !important;
  }
  .content_tow{
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
    float: left;
  }
  .lastOne{
    width:100% !important;
  }
  .content_span{
    font-size: 13px;
    float:left;
    width: 50%;
    border-bottom: 1px dotted #D9D9D9;
    line-height: 4vh;
    height: 4vh;
  }
  .content_UP{
    width: 17.8%;
    background: rgb(255, 255, 255);
    padding: 1%;
    border: 1px solid rgba(73, 120, 241, 0.19);
    float: left;
    height: 13vh;
    overflow-y: auto;
  }
  .content_tow>>>.el-upload--picture-card {
    width: 13vh !important;
    height: 13vh !important;
    line-height: 13vh !important;
  }
  .content{
    float: left;
    width: 100%;
    margin-bottom: 20px;
  }
  .uploadFilesItemClass {
    /*width: 95%;*/
    min-height: 73%;
    padding: 10px;
    padding-bottom: 0px;
    background-color: #F9F9F9!important;
    border: 1px solid #E9E9E9;
  }
  .createOrder{
    /*margin: 4vh 5vw 4vh 5vw;*/
  }
  .styleHeader {
    position: absolute;
    left: 6.2rem;
    top: 0.1rem;
    font-size: 0.4rem;
  }
  .pagination {
    overflow: auto;
    text-align: center;
  }
  .pagination>>>.el-pagination__jump{
    margin-left: 0 !important;
  }
  .dialogLeft {
    width: 60%;
    float: left;
  }
  .dialogRight {
    width: 39%;
    float: left;
    margin-left: 0.1rem;
  }
  .overviews {
    width: 100%;
    height: 4rem;
    border: 1px solid #ccc;
  }
  .dialogRightMap {
    width: 100%;
    height: 4.4rem;
    border: 1px solid #ccc;
    margin-top: 0.2rem;
  }
  .personCenter_right_t{
    width: 100%;
    height: 46px;
    line-height: 46px;
  }
  .personCenter_right_t img{
    height: 33%;
    width: 5px;
    margin-right: 7px;
    position: relative;
    top: 15px;
    float: left;
  }
  .personCenter_right_t span{
    display: inline-block;
    font-weight: bold;
  }
  .createOrder_span{
    float: left;
    background: rgba(73, 120, 241, 0.1);
    font-size: 13px;
    line-height: 25px;
    margin-top: 8px;
    margin-left: 20px;
    padding: 0px;
    width: 143px;
    border-radius: 3px;
    text-align: center;
    border: 1px solid rgba(73,120,241,0.2)
  }
  .inFoD{
    width: 93.4%;
    background: #FBF4EA;
    border: 1px solid #e8d5b696;
    border-left: 5px solid #F39C12;
    margin-top: 6vh;
    box-shadow: 0px 1px 4px 0px rgba(0,0,0,0.32);
    color: #F3A72C;
    padding: 1% 3%;
    line-height: 28px;
  }
  .createOrder_span_T {
    width: 57px;
    font-size: 12px;
    background: #FFB92A;
    color: #fff;
    float: left;
    line-height: 25px;
    margin-top: 8px;
    margin-left: 20px;
    border-radius: 3px;
    text-align: center;
  }
  .createOrder_span span{
    font-weight: 400 !important;
  }
  .spanIMG_Z{
    width: 5px;
    height: 16px;
    position: relative;
    top: -1px;
    margin-right: 4px;
  }
  .createOrder>>>.el-card__body {
    padding: 0 20px 10px;
  }
  .createOrder>>>.el-card__header {
    border-bottom: none !important;
  }
  .createOrder>>>.el-card {
    box-shadow: 0 2px 12px 0 rgb(249, 247, 247);
  }
  .createOrder>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
  }
  .createOrder>>>.el-table th{
    text-align: center !important;
  }
  .createOrder>>>.el-table td{
    text-align: center !important;
  }
  .createOrder>>>.el-form--label-top .el-form-item__label {
    padding: 0;
  }
  .createOrder>>>.el-textarea__inner{
    width: 73.5vw !important;
  }
  .elDialog_Aduti>>>.el-textarea__inner{
    width: 100% !important;
  }
  .elDialog_Aduti>>>.el-dialog__body{
    padding: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__header{
    padding: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__headerbtn{
    top: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__title {
    font-size: 15px !important;
    font-weight: bold !important;
  }
  .elDialog_Aduti>>>.el-dialog__footer {
    padding: 10px !important;
    text-align: center !important;
  }
  .eldialog_conz{
    height: 60vh;
  }
  .dialog_contentz {
    .el-dialog__header {
      padding: 10px;
      margin-left: 1%;
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
  }
  .dialog_contentz>>>.el-dialog__body {
    padding: 0 20px 20px 20px;
    background-color: #fff;
  }
  .dialog_contentz>>>.el-dialog__title {
    line-height: 24px;
    font-size: 17px;
    color: #303133;
    font-weight: bold;
  }
  .mapDivDialogDe_map{
    position: relative;
    width: 100%;
    height: 40vh;
  }
  .mapDivDialogDec>>>.el-card__body {
    padding: 0 !important;
  }
  .colorindexO{
    color: #FF504F;
    cursor: pointer;
  }
</style>
