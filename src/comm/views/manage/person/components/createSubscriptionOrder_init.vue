<template>
<div class="content">
  <div class="eldialog_con_map">
    <Tools0rder id="Tools0rder" ref="Toolsref"></Tools0rder>
    <div ref="mapDivDialogZ" id="mapDivDialogZ" class="map" style="height: 100%;"></div>
  </div>
  <div class="contionOrder">
    <div class="contionOrderOne">
      <span class="contionOrderOne_spanOne"></span>
      <span class="contionOrderOne_spanTow">订阅信息</span>
    </div>
    <div class="contentZ">
      <div class="contentM">
        <el-form size="mini" :label-position="labelPosition" label-width="75px" :model="formLabelAlign">
          <el-form-item label="订阅用户">
            <el-input placeholder="请输入订阅用户" v-model="formLabelAlign.subscriber">
              <el-button :distable="true" @click="showPro" title="选择用户" slot="append" icon="el-icon-plus"></el-button>
            </el-input>
            <!--<template>-->
              <!--<el-select v-model="formLabelAlign.subscriber" filterable placeholder="请选择">-->
                <!--<el-option-->
                  <!--v-for="item in options"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</template>-->
          </el-form-item>
          <el-form-item label="申请单位">
            <el-input placeholder="请输入申请单位" v-model="formLabelAlign.company"></el-input>
            <!--<template>-->
              <!--<el-select v-model="formLabelAlign.company" filterable placeholder="请选择">-->
                <!--<el-option-->
                  <!--v-for="item in options"-->
                  <!--:key="item.value"-->
                  <!--:label="item.label"-->
                  <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
            <!--</template>-->
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input placeholder="请输入联系方式" v-model="formLabelAlign.phone"></el-input>
          </el-form-item>
          <el-form-item label="用途领域">
            <template>
              <el-select v-model="formLabelAlign.purpose" filterable placeholder="请选择">
                <el-option
                  v-for="item in usageOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="数据类别">
            <template>
              <el-select v-model="formLabelAlign.dataType" filterable placeholder="请选择">
                <el-option
                  v-for="item in dataTypeZ"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input placeholder="请输入项目名称" v-model="formLabelAlign.proName"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="contentM">
        <el-form size="mini" :label-position="labelPosition" label-width="75px" :model="formLabelAlign">
          <el-form-item label="传感器">
            <template>
              <el-select v-model="formLabelAlign.sensor" filterable placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="数据级别">
            <template>
              <el-select v-model="formLabelAlign.dataLevel" filterable placeholder="请选择">
                <el-option
                  v-for="item in dataLevelZ"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="云量">
            <el-slider style="width: 95%;" v-model="formLabelAlign.cloudiness"></el-slider>
          </el-form-item>
          <el-form-item label="采集时间">
            <template>
              <el-date-picker
                style="width: 100%;"
                v-model="formLabelAlign.collectionTime"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right">
              </el-date-picker>
            </template>
          </el-form-item>
          <el-form-item label="分发频率">
            <template>
              <el-select v-model="formLabelAlign.disFrequency" filterable placeholder="请选择">
                <el-option
                  v-for="item in disFrequencyD"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              style="width: 100%;"
              v-model="formLabelAlign.timeFrame"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="分发时间">
            <el-date-picker
              style="width: 100%;"
              v-model="formLabelAlign.distributionTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="formLabelAlign.remarks">
            </el-input>
          </el-form-item>
          <!--<el-form-item label="附件上传">-->
            <!--<el-button  @click="showUpData" type="primary">打开上传</el-button>-->
            <!--&lt;!&ndash;<approvalDoc />&ndash;&gt;-->
          <!--</el-form-item>-->
          <!--<el-form-item >-->
            <!--<div class="content_info">-->
              <!--文件类型为：DOC、DOCX、PDF、ZIP、RAR、JPG、文件大小不得超过100M-->
            <!--</div>-->
          <!--</el-form-item>-->
          <el-form-item style="margin-top: 20px;">
            <el-button type="primary" @click="establish">创建</el-button>
            <el-button type="primary" plain>取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
  <el-dialog
    width="65%"
    title="附件上传"
    class="content_Z"
    :visible.sync="dialogFormVisible">
    <div class="content_tow">
      <div @click="updataTaskSource(item.label)" class="content_UP" v-for="(item, index) in upDataD" :key="index" >
        <div style="margin-bottom: 14px;">{{item.label}}<img v-if="index < 4" src="@/assets/img/noetmp.png" alt=""></div>
        <approvalDoc @identityCard="identityCard" class="uploadFilesItemClass" />
      </div>
    </div>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button size="small" type="primary" @click="uploadFiles">确定</el-button>
      <el-button size="small" @click="dialogFormVisible = false">取消</el-button>
    </div>
  </el-dialog>
  <el-dialog
    width="65%"
    title="选定用户"
    class="content_Z"
    :visible.sync="dialogFormVisiblePro">
    <el-form :inline="true" style="padding: 0 25px;" ref="form" :model="userForm" label-width="80px" label-position="left">
      <el-form-item label="用户账号">
        <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="mini" clearable v-model="userForm.userLogin"></el-input>
      </el-form-item>
      <el-form-item label="用户单位">
        <el-input @keyup.enter.native="userSearch" placeholder="输入内容" size="mini" clearable v-model="userForm.userNick"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" type="primary" icon="el-icon-search" @click="userSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="content_towZ">
      <!--<div style="height: 20vh;">-->
      <!--</div>-->
      <el-table
        ref="multipleTable"
        :data="tableData"
        stripe
        tooltip-effect="dark"
        style="width: 100%; text-align:center;"
        @selection-change="handleSelectionChange">
        <el-table-column label="选择" width="65">
          <template slot-scope="scope">
            <el-radio :label="scope.$index + 1"  v-model="radio" @change.native="getCurrentRow(scope.row)"></el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="申请人">
        </el-table-column>
        <el-table-column
          prop="ftpuser"
          label="账号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="phonemobile"
          label="联系方式"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="groupname"
          label="单位"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="danger"  @click="handleEdit(scope.row)">验证</el-button>
            <el-button size="mini" type="primary"  @click="handleEdit(scope.row)">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" style="text-align: right">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button size="small" type="primary" @click="uploadFilesPro">选 定</el-button>
      <el-button size="small" @click="dialogFormVisiblePro = false">关 闭</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import http from '@comm/service/interface.js'
import GISMap from '@comm/map/GISMap.js'
import * as MapData from '@comm/map/lib/mapData.js'
import { mapActions, mapState } from 'vuex'
import approvalDoc from '@/hangYao/common/uploadOrderFile/approvalDoc.vue'
import Tools0rder from './tools0rder.vue'
const { baseMapInitParameters } = MapData
// let gisMapDiaZ = null
export default {
  name: 'createSubscriptionOrder',
  components: {
    approvalDoc,
    Tools0rder
  },
  data () {
    return {
      userForm: {
        userNick: '',
        userLogin: ''
      },
      value2: 20,
      value1: 20,
      pageSize: 10,
      total: 0,
      currentPage: 1,
      radio: '',
      formLabelAlign: {
        userid: '',
        subscriber: '',
        company: '',
        phone: '',
        purpose: '',
        dataType: '',
        proName: '',
        sensor: '',
        dataLevel: '',
        cloudiness: 20,
        collectionTime: '',
        disFrequency: '',
        timeFrame: '',
        distributionTime: '',
        region: '',
        remarks: ''
      },
      labelPosition: 'right',
      dialogFormVisible: false,
      templateSelection: {},
      dialogFormVisiblePro: false,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
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
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      upDataD: [
        {
          id: 0,
          label: '任务来源说明文件'
        },
        {
          id: 0,
          label: '签字后的分发登记表'
        },
        {
          id: 0,
          label: '介绍信'
        },
        {
          id: 0,
          label: '身份证'
        },
        {
          id: 0,
          label: '其他附件'
        }
      ],
      disFrequencyD: [
        {
          id: 0,
          label: '按天'
        },
        {
          id: 1,
          label: '按周'
        },
        {
          id: 2,
          label: '按月'
        },
        {
          id: 3,
          label: '按季度'
        },
        {
          id: 4,
          label: '按年'
        }
      ],
      dataTypeZ: [
        {
          id: 0,
          label: '原始影像数据'
        },
        {
          id: 1,
          label: '航空影像数据'
        },
        {
          id: 2,
          label: '参考影像数据'
        },
        {
          id: 3,
          label: '影像增值产品数据'
        },
        {
          id: 4,
          label: 'DEM数据'
        },
        {
          id: 5,
          label: '专题影像数据'
        },
        {
          id: 6,
          label: '其他'
        }
      ],
      dataLevelZ: [
        {
          id: 'LEVEL1A',
          label: 'LEVEL1A'
        }
      ],
      approvalDocData: '',
      uploadFileList: {
        taskDataCard: [],
        identityCard: [],
        introductionLetter: [],
        otherDoc: [],
        regisForm: []
      },
      tableData: []
    }
  },
  computed: {
    ...mapState('searchStore', {
      code (state) {
        return state.code
      },
      wkt (state) {
        return state.wkt
      }
    })
  },
  methods: {
    baseMapInit () {
      var gisMapDiaZ = new GISMap('MainMapDia')
      window.gisMapDiaZ = gisMapDiaZ
      gisMapDiaZ.baseMapInit(baseMapInitParameters, () => {
        gisMapDiaZ.map.on('moveend', gisMapDiaZ.checkZoomAndCenter.bind(gisMapDiaZ))
      }, 'mapDivDialogZ', false)
    },
    // 订购用户数据获取
    getOrderList () {
      http.getagrsList({data: {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        name: this.userForm.userLogin,
        groupname: this.userForm.userNick
      }}).then(res => {
        if (res.data && res.data.list.length > 0) {
          console.log(res)
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.tableData = []
          this.total = 0
          this.$message.warning('暂无数据！')
        }
      })
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    showUpData () {
      this.dialogFormVisible = true
      console.log(124)
    },
    showPro () {
      this.dialogFormVisiblePro = true
      console.log(124)
    },
    uploadFilesPro () {
      this.formLabelAlign.subscriber = this.templateSelection.name
      this.formLabelAlign.company = this.templateSelection.groupname
      this.formLabelAlign.phone = this.templateSelection.phonemobile
      this.formLabelAlign.userid = this.templateSelection.userid
      this.formLabelAlign.loginname = this.templateSelection.loginname
      this.dialogFormVisiblePro = false
    },
    getCurrentRow (row) {
      // 获取选中数据
      this.templateSelection = row
    },
    userSearch () {
      this.getOrderList()
    },
    establish () {
      // this.getOrderList()
      // formLabelAlign: {
      //   subscriber: '',
      //     company: '',
      //     phone: '',
      //     purpose: '',
      //     dataType: '',
      //     proName: '',
      //     sensor: '',
      //     dataLevel: '',
      //     cloudiness: 20,
      //     collectionTime: '',
      //     disFrequency: '',
      //     timeFrame: '',
      //     distributionTime: '',
      //     region: '',
      //     remarks: ''
      // },
      let aa = {
        userid: this.formLabelAlign.userid,
        name: this.formLabelAlign.subscriber,
        loginname: this.formLabelAlign.loginname,
        phonemobile: this.formLabelAlign.phone,
        groupname: this.formLabelAlign.company,
        groupid: this.templateSelection.groupid,
        applyuserused: this.formLabelAlign.purpose,
        datatype: this.formLabelAlign.dataType,
        productName: this.formLabelAlign.proName,
        sensor: this.formLabelAlign.sensor,
        level: this.formLabelAlign.dataLevel,
        cloudamount: this.formLabelAlign.cloudiness,
        cjstarttime: this.formLabelAlign.collectionTime[0],
        cjendtime: this.formLabelAlign.collectionTime[1],
        distfrequency: this.formLabelAlign.disFrequency,
        starttime: this.formLabelAlign.timeFrame[0],
        endtime: this.formLabelAlign.timeFrame[1],
        fftime: this.formLabelAlign.distributionTime,
        description: this.formLabelAlign.remarks,
        code: this.code,
        wkt: this.wkt
      }
      console.log(aa)
      http.saveAgrsSubscribe({data: {
        userid: this.formLabelAlign.userid,
        name: this.formLabelAlign.subscriber,
        loginname: this.formLabelAlign.loginname,
        phonemobile: this.formLabelAlign.phone,
        groupname: this.formLabelAlign.company,
        groupid: this.templateSelection.groupid,
        applyuserused: this.formLabelAlign.purpose,
        datatype: this.formLabelAlign.dataType,
        productName: this.formLabelAlign.proName,
        sensor: this.formLabelAlign.sensor,
        level: this.formLabelAlign.dataLevel,
        cloudamount: this.formLabelAlign.cloudiness,
        cjstarttime: this.formLabelAlign.collectionTime[0],
        cjendtime: this.formLabelAlign.collectionTime[1],
        distfrequency: this.formLabelAlign.disFrequency,
        starttime: this.formLabelAlign.timeFrame[0],
        endtime: this.formLabelAlign.timeFrame[1],
        fftime: this.formLabelAlign.distributionTime,
        description: this.formLabelAlign.remarks,
        code: this.code,
        wkt: this.wkt
      }}).then(res => {
        if (res.data === 'true') {
          console.log(res)
          this.$message({
            type: 'success',
            message: '创建成功!'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '创建失败!'
          })
        }
      })
    },
    handleSelectionChange () {},
    uploadFiles () {
      this.dialogFormVisible = false
      console.log(124)
    },
    identityCard (val) {
      if (this.approvalDocData === '任务来源说明文件') {
        this.uploadFileList.taskDataCard = this.getUpDataList(val[1], '6')
      } else if (this.approvalDocData === '签字后的分发登记表') {
        this.uploadFileList.regisForm = this.getUpDataList(val[1], '7')
      } else if (this.approvalDocData === '介绍信') {
        this.uploadFileList.introductionLetter = this.getUpDataList(val[1], '2')
      } else if (this.approvalDocData === '身份证') {
        this.uploadFileList.identityCard = this.getUpDataList(val[1], '1')
      } else if (this.approvalDocData === '其他附件') {
        this.uploadFileList.otherDoc = this.getUpDataList(val[1], '4')
      }
    },
    updataTaskSource (val) {
      this.approvalDocData = val
    },
    getUpDataList (val, index) {
      let arrlist = []
      if (val.length > 0) {
        val.forEach(item => {
          let othername = item.response.data.split('/')
          arrlist.push({
            filePath: item.url,
            // fileName: item.name,
            fileName: othername[othername.length - 1],
            fileType: index
            // othername: othername[othername.length - 1]
          })
        })
      } else {
        arrlist = []
      }
      return arrlist
    }
  },
  mounted () {
    this.baseMapInit()
    this.getOrderList()
  }
}
</script>

<style scoped>
  .content{
    width: 100%;
    float: left;
  }
.eldialog_con_map{
  position: relative;
  height: calc(98vh - 147px);
  width: 78%;
  box-shadow: 0 0 3px #E2E2E2;
  float: left;
}
  .contionOrder{
    height: calc(98vh - 147px);
    width: 21%;
    background-color: #ffffff;
    box-shadow: 0 0 3px #E2E2E2;
    float: right;
  }
  .contionOrderOne{
    width: 100%;
    height: 36px;
    background: #4978F1;
    line-height: 36px;
  }
  .contionOrderOne_spanOne{
    color: #ffffff;
    display: inline-block;
    line-height: 36px;
    width: 4px;
    height: 17px;
    background: #ffffff;
    margin-top: 9px;
    margin-left: 10px;
    float: left;
  }
  .contionOrderOne_spanTow{
    display: inline-block;
    margin-left: 10px;
    color: #ffffff;
  }
  .contentZ{
    width: 100%;
    height: calc(100% - 36px);
    overflow: auto;
  }
  .contentM{
    padding: 10px 10px 0 0;
    border-bottom: 1px solid rgba(137,137,137,0.16);
  }
  .contentM>>>.el-form-item__label{
    font-size: 13px !important;
  }
  .contentM>>>.el-input__inner{
    font-size: 13px !important;
  }
  .contentM>>>.el-textarea__inner{
    font-size: 13px !important;
  }
  .contentM>>>.el-form-item{
    margin-bottom: 12px !important;
  }
  .content_info{
    background: rgb(255, 236, 180);
    font-size: 12px;
    /* opacity: 0.15; */
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: justify;
    color: rgb(253, 173, 2);
    line-height: 17px;
    letter-spacing: 0px;
    border: 1px solid rgba(215, 174, 56, 0.35);
    border-radius: 3px;
    padding: 5px;
  }
  #Tools0rder {
    position: absolute;
    /*top: 0.1rem;*/
    /*right: 23.2vw;*/
    z-index: 3;
    display: flex;
    right: 0;
  }
  .content_UP{
    width: 17.7%;
    background: rgb(255, 255, 255);
    padding: 1%;
    border: 1px solid rgba(73, 120, 241, 0.19);
    float: left;
    height: 22vh;
    /*overflow-y: auto;*/
  }
  .content_tow{
    width: 100%;
    height: 22vh;
    margin-bottom: 33px;
  }
  .content_Z>>>.el-dialog__body {
    padding: 0 20px;
  }
  .content_Z>>>.el-dialog__body {
    padding: 0 20px;
  }
  .content_towZ{
    border: 1px solid #EBEEF5;
  }
  .content_towZ>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
  }
  .content_towZ>>>.el-table th{
    text-align: center !important;
  }
  .content_towZ>>>.el-table td{
    text-align: center !important;
  }
  .content_towZ>>> .el-table th.gutter {
    display: table-cell !important
  }
  .content_towZ>>> .el-radio__label {
    display: none !important
  }
</style>
