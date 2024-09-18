<template>
  <div class="createOrder">
    <div class="createOrder_one" v-if="!showDiv">
      <div class="personCenter_right_t" >
        <div style="float: left; height: 100%;">
          <img src="@/assets/img/spanIMG.png" alt="">
          <span>再加工产品订购</span>
        </div>
        <!--<div class="createOrder_span"><span style=" margin-right: 6px; color:#4978F1;">第一步</span><span>订购信息填写</span></div>-->
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
            <span>基本信息</span>
          </div>
        </div>
        <div class="content">
          <el-form :rules="rulesL" ref="ruleForm1" class="elForm" :label-position="labelPosition" label-width="68px" :model="formLabelAlign" :inline="true">
            <el-form-item label="申请人">
              <el-input  v-model="formLabelAlign.user"></el-input>
              <img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item label="申请单位" prop="company">
              <el-input v-model="formLabelAlign.company" placeholder="请填写完整的单位名称，与介绍信保持一致!"></el-input>
              <img src="@/assets/img/noetmp.png" alt="">
              <!-- <el-input v-model="formLabelAlign.company"></el-input> -->
            </el-form-item>
            <el-form-item label="联系方式" prop="phone">
              <el-input  v-model="formLabelAlign.phone"></el-input>
              <img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
          </el-form>
          <el-form ref="ruleForm2" class="elForm" :label-position="labelPosition" label-width="68px" :rules="rules" :model="formLabelAlign" :inline="true">
            <el-form-item label="项目名称" prop="proName">
              <el-input v-model="formLabelAlign.proName"></el-input>
              <img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item label="使用用途">
              <!--<el-input v-model="formLabelAlign.employ"></el-input>-->
              <el-select v-model="formLabelAlign.employ" clearable
                         placeholder="请选择">
                <el-option v-for="item in usageOptions"
                           class="commonPadding"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <!--<el-form-item label="附件">-->
            <!--<el-button type="primary" @click="openUploadFilesDialog"><i class="el-icon-circle-plus-outline"></i>&nbsp;上传附件</el-button>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="获取方式" >-->
              <!--&lt;!&ndash;<el-input v-model="formLabelAlign.employ"></el-input>&ndash;&gt;-->
              <!--<el-select v-model="formLabelAlign.getMethod"-->
                         <!--placeholder="请选择">-->
                <!--<el-option v-for="item in getMethodOptions"-->
                           <!--class="commonPadding"-->
                           <!--:key="item.value"-->
                           <!--:label="item.label"-->
                           <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select><img src="@/assets/img/noetmp.png" alt="">-->
            <!--</el-form-item>-->
          </el-form>
          <!--<el-form  style="width: 100%;" class="elForm" :label-position="labelPosition" label-width="68px" :model="formLabelAlign" :inline="true">-->
            <!--<el-form-item label="备注" style="padding-left: 5%;">-->
              <!--<el-input-->
                <!--type="textarea"-->
                <!--:rows="2"-->
                <!--placeholder="请输入内容"-->
                <!--v-model="textarea">-->
              <!--</el-input>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
        </div>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
            <span>再加工信息</span>
          </div>
        </div>
        <div class="content">
          <el-form ref="ruleForm2" class="elForm" :label-position="labelPosition" label-width="68px" :rules="rules" :model="formLabelAlign" :inline="true">
            <el-form-item label="产品级别">
              <el-select v-model="formLabelAlign.levelD" clearable
                         placeholder="请选择">
                <el-option v-for="item in levelData"
                           class="commonPadding"
                           :key="item.id"
                           :label="item.fProcessName"
                           :value="item.id">
                </el-option>
              </el-select>
              <img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item label="截止时间">
              <el-date-picker
                v-model="formLabelAlign.endtime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
              <img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <el-form-item label="提取要素">
              <el-select v-model="formLabelAlign.taskDataElements" clearable
                         placeholder="请选择">
                <el-option v-for="item in taskDefExtractingElements"
                           class="commonPadding"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
              <img src="@/assets/img/noetmp.png" alt="">
            </el-form-item>
            <!--<el-form-item label="子类级别">-->
              <!--<el-select v-model="formLabelAlign.SubDataLeveldForm" clearable-->
                         <!--placeholder="请选择">-->
                <!--<el-option v-for="item in SubDataLevel"-->
                           <!--class="commonPadding"-->
                           <!--:key="item.value"-->
                           <!--:label="item.label"-->
                           <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select>-->
              <!--<img src="@/assets/img/noetmp.png" alt="">-->
            <!--</el-form-item>-->
            <el-form-item label="加工说明" class="machining">
              <!--<el-input  v-model="formLabelAlign.proInstructions"></el-input>-->
              <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="formLabelAlign.proInstructions">
              </el-input>
            </el-form-item>
            <!--<el-form-item label="获取方式" >-->
              <!--&lt;!&ndash;<el-input v-model="formLabelAlign.employ"></el-input>&ndash;&gt;-->
              <!--<el-select v-model="formLabelAlign.getMethod"-->
                         <!--placeholder="请选择">-->
                <!--<el-option v-for="item in getMethodOptions"-->
                           <!--class="commonPadding"-->
                           <!--:key="item.value"-->
                           <!--:label="item.label"-->
                           <!--:value="item.value">-->
                <!--</el-option>-->
              <!--</el-select><img src="@/assets/img/noetmp.png" alt="">-->
            <!--</el-form-item>-->
          </el-form>
          <!--<el-form  style="width: 100%;" class="elForm" :label-position="labelPosition" label-width="68px" :model="formLabelAlign" :inline="true">-->
            <!--<el-form-item label="备注" style="padding-left: 5%;">-->
              <!--<el-input-->
                <!--type="textarea"-->
                <!--:rows="2"-->
                <!--placeholder="请输入内容"-->
                <!--v-model="textarea">-->
              <!--</el-input>-->
            <!--</el-form-item>-->
          <!--</el-form>-->
        </div>
      </el-card>
      <el-card class="box-card" style="margin: .2rem 0;">
        <div slot="header" class="clearfix">
          <div>
            <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
            <span>订购数据信息</span><span style="display: inline-block;float: right; margin-right: 60px; font-weight: bold;">数据总量：<span style="color:#FFB92A;">{{dataSizeAll}}</span></span>
          </div>
        </div>
        <div class="content">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column width="75" label="拇指图">
              <template slot-scope="scope">
                <img :src="scope.row.imageurl" alt="" width="44px" height="28px">
              </template>
            </el-table-column>
            <el-table-column prop="datatype" label="数据类型" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{dataTypeData[scope.row.datatype]}}</span>
              </template>
            </el-table-column>
            <el-table-column width="220" prop="dataname" label="产品名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="datasize" label="数据量" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="datatypename" label="产品类型" show-overflow-tooltip></el-table-column>-->
            <el-table-column prop="productlevel" label="产品等级" show-overflow-tooltip></el-table-column>
            <el-table-column prop="satelite" label="卫星" show-overflow-tooltip></el-table-column>
            <el-table-column prop="sensor" label="传感器" show-overflow-tooltip></el-table-column>
            <!--<el-table-column prop="receivetime" label="影像采集时间" show-overflow-tooltip></el-table-column>-->
            <!--<el-table-column prop="datasize" label="数据大小" show-overflow-tooltip></el-table-column>-->
            <el-table-column label="查看详情">
              <template slot-scope="scope">
                <img style="margin-right: 10px" width="16px" height="16px" src="@/assets/img/showDetail.png" alt="" @click="handleDetails(scope.row)" >
                <img width="16px" height="16px" src="@/assets/img/deleicon.png" alt="" @click="removeData(scope.$index, scope.row)" >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            class="pagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            background
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </el-card>
      <div style="width: 100%;text-align: center;" class="">
        <el-button @click="goNext" style="margin: 0.2rem;" type="primary" >下一步：上传订购附件</el-button>
        <el-button @click="goBack" style="margin: 0.2rem;" type="info" >返回购物车</el-button>
        <!-- <el-button type="danger" size="mini">取消</el-button> -->
      </div>
    </div>
    <div class="createOrder_two" v-if="showDiv">
      <div class="personCenter_right_t" >
        <div style="float: left; height: 100%;">
          <img src="@/assets/img/spanIMG.png" alt="">
          <span>再加工产品订购</span>
        </div>
        <div class="createOrder_span"><span style=" margin-right: 6px; color:#4978F1;">第二步</span><span>订单附件上传</span></div>
      </div>
      <!--<div class="personCenter_right_t" >-->
        <!--<div style="float: left; height: 100%; margin-left: 21px;">-->
          <!--<img src="@/assets/img/spanIMG.png" alt="">-->
          <!--<span>下载分发登记表</span>-->
        <!--</div>-->
        <!--<div class="createOrder_span_T" @click="downLoadFrom">下载</div>-->
      <!--</div>-->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <div>
            <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
            <span>订单附件上传</span>
          </div>
        </div>
        <div class="content_tow">
          <div @click="updataTaskSource(item.label)" class="content_UP" v-for="(item, index) in upDataD" :key="index" :class="{content_UPz_Z: index === 2 || index === 4, content_UP_b: index === 3}" >
            <div style="margin-bottom: 10px; height: 18px">{{item.label}}<img v-if="index < 2 || index === 3  " src="@/assets/img/noetmp.png" alt=""><div class="createOrder_span_T" @click="downLoadFrom" v-if="index === 1">下载</div></div>
            <approvalDoc @identityCard="identityCard" class="uploadFilesItemClass" />
          </div>
        </div>
      </el-card>
      <div class="inFoD">
        <!--<p>已有产品订单已经生成完毕，订单编号为<span>{{orderReference}}</span>，-->
        <p><span>{{orderReference}}</span>请进行订单附件上传：</p>
        <p>(1)线下拷贝订单必须上传“任务来源说明文件”，“签字后的分发登记表”、“身份证号”、“介绍信”可以在获取数据时现场提供，也可以在线上传，如果选择在线上传，则必须保障获取数据的人员信息与上传附件的人员信息一致，否则不予提供。</p>
        <p>(2)在线下载订单必须上传“任务来源说明文件”、“签字后的分发登记表”、“身份证号”、“介绍信”,其中“签字后的分发登记表”必须通过本页"下载"按钮获取后签字上传才有效。</p>
        <p>(3)如果以上材料暂未准备好，可以“保存”后关闭本页面，随后在“用户中心\待提交订单”列表中补充附件。</p>
      </div>
      <div style="width: 100%;text-align: center; margin-top: 20px;">
        <el-button @click="goSave" style="margin: 0.2rem;" type="primary" >保 存</el-button>
        <el-button @click="goSubmit" style="margin: 0.2rem;" type="primary" >提 交</el-button>
        <!-- <el-button type="danger" size="mini">取消</el-button> -->
      </div>
    </div>
    <el-dialog ref="rules2" :modal="true" title="确认订单" :visible.sync="dialogVisible" width="43%">
      <el-form ref="rules2" label-width="80px" class="demo-ruleForm">
      <el-form-item label="订单名称">
        <el-input v-model="orderReference" placeholder="请输入订单名称"></el-input>
      </el-form-item>
    </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('rules2')">取 消</el-button>
        <el-button type="primary" @click="confirmOrder">确 定</el-button>
      </span>
    </el-dialog>
    <dialogShowDetail :titleDialog = titleDialog></dialogShowDetail>
  </div>
</template>

<script>
import customTable from '@comm/components/customTable'
import dialogShowDetail from '@comm/components/dialogShowDetail'
import http from '@comm/service/interface.js'
import { mapActions, mapState } from 'vuex'
import approvalDoc from '@comm/components/approvalDoc.vue'
import $ from 'jquery'
import axios from 'axios'
export default {
  components: {
    dialogShowDetail,
    customTable,
    approvalDoc
  },
  data () {
    var validateUserCardId = (rule, value, callback) => {
      // let regPass = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
      // if (regPass.test(value) === '') {
      if (value === '') {
        callback(new Error('请输入项目名称！'))
      } else {
        callback()
        // if (value) {
        //   callback()
        // } else {
        //   // callback(new Error('请输入正确的身份证信息'))
        // }
      }
    }
    var companyD = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请填写完整的单位名称，与介绍信保持一致!'))
      } else {
        callback()
      }
    }
    var numberL = (rule, value, callback) => {
      var regPass = new RegExp('^[0-9]{11}$')
      if (value === '') {
        callback(new Error('电话号码不能为空！'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的电话号码！'))
        }
      }
    }
    return {
      rulesL: {
        phone: [
          { validator: numberL, trigger: 'blur' }
        ],
        company: [
          { validator: companyD, trigger: 'blur' }
        ]
      },
      dialogShowData: {},
      titleDialog: '订购数据详情',
      showDiv: false,
      textarea: '',
      lengthAll: '',
      dataTypeData: ['原始影像数据', '档案资料数据', '航空影像数据', '标准产品', 'J星产品'],
      tableDataAll: [],
      rules: {
        proName: [
          { validator: validateUserCardId, trigger: 'blur' }
          // { min: 15, message: '请输入正确的证件信息', trigger: ['blur', 'change'] }
        ]
      },
      dataSizeAll: 0,
      dataSizeAllKb: 0,
      filesForm: {},
      dialogFormDataClear: false,
      dialogFormDataClearSub: false,
      approvalDocData: '',
      uploadFileList: {
        taskDataCard: [],
        identityCard: [],
        introductionLetter: [],
        otherDoc: [],
        regisForm: []
      },
      formLabelWidth: '80px',
      dialogFormVisible: false,
      getMethodOptions: [
        // {
        //   label: '在线下载',
        //   value: '在线下载'
        // },
        {
          label: '线下拷贝',
          value: '线下拷贝'
        }
      ],
      levelData: [
        {id: '2', fProcessName: '地质体解译'},
        {id: '6', fProcessName: '光学影像处理'},
        {id: '3', fProcessName: '矿产分布图件制作'},
        {id: '4', fProcessName: '雷达影像处理'},
        {id: '8', fProcessName: '遥感监测图件制作'},
        {id: '5', fProcessName: '要素转换系列专题图制作'},
        {id: '7', fProcessName: '指数专题图制作'},
        {id: '1331523347455787010', fProcessName: '地质体解译-线性构造解译'},
        {id: '1331523638578233346', fProcessName: '地质体解译-水土流失解译'},
        {id: '1331524469675376641', fProcessName: '野外调查验证'},
        {id: '1331527581005889538', fProcessName: '地质体解译-地质灾害识别解译'},
        {id: '1331522072639029249', fProcessName: '地质体解译-碳酸盐解译'},
        {id: '1331522811444707329', fProcessName: '地质体解译-地质体识别解译'}
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
      dialogVisible: false,
      userDisabled: false,
      companyDisabled: false,
      phoneDisabled: false,
      total: 0,
      currentPage: 1,
      pageSize: 10,
      labelPosition: 'left',
      formLabelAlign: {
        user: '',
        phone: '',
        company: '',
        proName: '',
        employ: '',
        downloadWay: '2',
        disFrequency: '',
        delayInterval: '',
        extractionPaths: '',
        descriptor: '',
        levelD: '',
        proInstructions: '',
        getMethod: '线下拷贝',
        userCardId: '',
        taskDataElements: '',
        SubDataLeveldForm: '',
        endtime: ''
      },
      taskDefExtractingElements: window.taskDefExtractingElements,
      SubDataLevel: window.SubDataLevel,
      tableData: [],
      companyData: [],
      downloadWayData: [
        {label: '下载', value: '0'},
        {label: '推送', value: '1'},
        {label: '离线拷贝', value: '2'}
      ],
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
      arrProName: '',
      orderDataList: [],
      orderDataCpUrl: ['', ''],
      userID: '',
      orderReference: '',
      list: [],
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
      ]
    }
  },
  watch: {
    dialogFormDataClear () {
      if (this.dialogFormDataClear) {
        this.dialogFormDataClearSub = true
      } else {
        this.dialogFormDataClearSub = false
      }
    }
  },
  methods: {
    // 产品级别的获取
    getlistProcessData () {
     let p1 = http.listProcess()
     // let p2 = http.listProcess()
      Promise.all([p1]).then((result) => {
        console.log(result, 'result')
        this.levelData = result[0].data
      }).catch((error) => {
        console.log(error)
      })
    },
    getOrderShopSizeAll (val) {
      http.getOrderShopSize({data: {dataIds: val}}).then(res => {
        if (res.data) {
          // if (res.data > 5242880) { // 大于5个G只能到馆取
          //   this.getMethodOptions = [
          //     {
          //       label: '线下拷贝',
          //       value: '线下拷贝'
          //     }
          //   ]
          //   this.formLabelAlign.getMethod = '线下拷贝'
          // } else {
          //   this.getMethodOptions = [
          //     {
          //       label: '在线下载',
          //       value: '在线下载'
          //     },
          //     {
          //       label: '线下拷贝',
          //       value: '线下拷贝'
          //     }
          //   ]
          // }
          this.dataSizeAll = this.commonMethod.dataSizeFormatter(res.data)
          this.dataSizeAllKb =res.data
        } else {
          this.dataSizeAll = 0
        }
        localStorage.setItem('dataSizeAll', this.dataSizeAll)
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
    goSubmit () {
      if (this.formLabelAlign.getMethod === '在线下载') {
        if (this.uploadFileList.taskDataCard.length === 0 || this.uploadFileList.identityCard.length === 0 || this.uploadFileList.introductionLetter.length === 0 || this.uploadFileList.regisForm.length === 0) {
          this.$message({
            message: '请上传必传项！',
            type: 'warning'
          })
        } else {
          this.upFileData(0)
        }
      } else {
        if (this.uploadFileList.taskDataCard.length === 0  || this.uploadFileList.identityCard.length === 0 || this.uploadFileList.regisForm.length === 0) {
          this.$message({
            message: '请上传必传项！',
            type: 'warning'
          })
        } else {
          this.upFileData(0)
        }
      }
    },
    goSave () {
      this.$confirm('订单信息将暂存，保存后请到“用户中心\\待提交订单”中进行材料补充、提交，提交完成后进入数据获取流程！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.upFileData(-1)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消保存'
        })
      })
      // this.dialogFormVisible = true
    },
    upFileData (val) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      let fileArr = this.uploadFileList.taskDataCard.concat(this.uploadFileList.regisForm, this.uploadFileList.introductionLetter, this.uploadFileList.identityCard, this.uploadFileList.otherDoc)
      if (this.orderDataList[0]) {
        http.getagrsSaveFiles(
          {data: {
            uploadFileList: fileArr,
            orderNames: this.orderDataList,
            sstatus: val
          }}
        ).then(res => {
          loading.close()
          if (res.data) {
            this.$message({
              message: val === 0 ? '提交成功！' : '保存成功',
              type: 'success'
            })
            if (val === 0) {
              this.setSpanLabel('待审核订单')
              this.$router.push({name: 'orderManage_stayAudit_rep'})
            } else {
              this.setSpanLabel('待提交订单')
              this.$router.push({name: 'orderManage_staySubmit_rep'})
            }
            this.getShopCarNum()
          } else {
            this.$message({
              message: val === 0 ? '提交失败！' : '保存失败',
              type: 'warning'
            })
          }
        })
      }
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
    updataTaskSource (val) {
      this.approvalDocData = val
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
        type: 'application/vnd.ms-excel'
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
    downLoadFrom () {
      if (this.orderDataCpUrl.length > 0 && this.orderDataCpUrl[1]) {
        this.downloadPDF(this.orderDataCpUrl[1], this.orderDataCpUrl[0] + '.pdf')
      } else {
        this.$message({
          message: '表格暂无',
          type: 'warning'
        })
      }
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
    },
    identityCard (val) {
      // IDENTITY_CARD("1", "身份证"),
      //   INTRODUCTION_LETTER("2", "介绍信"),
      //   BORROW_CARD("3", "借阅证"),
      //   OTHER_DOC("4", "其他证件"),
      //   APPROVAL_DOC("5", "批复文件"),
      //   PLAN_DOC("6", "任务来源说明文件"),
      //   PUSHTABLE_DOC("7", "签字后的分发登记表"),
      //   REFUSE_DOC("8", "审批拒绝文件");
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
    introductionLetter (val) {
      this.uploadFileList.introductionLetter = val
    },
    borrowCard (val) {
      this.uploadFileList.borrowCard = val
    },
    otherDoc (val) {
      this.uploadFileList.otherDoc = val
    },
    openUploadFilesDialog () {
      this.dialogFormVisible = true
    },
    // 编辑
    uploadFiles () {
      this.dialogFormVisible = false
    },
    handleDetails (row) {
      this.setDialogShowDataZ(row)
      this.setDetailShow(1)
    },
    removeData (index, row) {
      let arrID = []
      if (this.tableDataAll.length === 1) {
        this.$message({
          message: '数据不能为空！',
          type: 'warning'
        })
      } else {
        this.$confirm('确认将数据移除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableDataAll.forEach(item => {
            if (item.id !== row.id) {
              // dataList.push(item)
              arrID.push(item.did)
            }
          })
          sessionStorage.setItem('shopIDs', JSON.stringify(arrID))
          this.getShopData()
          this.getdataAllSize()
          this.getOrderShopSizeAll(arrID)
        })
      }
    },
    goBack () {
      this.$router.go(-1)
    },
    goNext () {
      if (this.formLabelAlign.user === '' || this.formLabelAlign.company === '' || this.formLabelAlign.getMethod === '' || this.formLabelAlign.proName === '' || this.formLabelAlign.employ === '' || this.formLabelAlign.user === '') {
        this.$message({
          message: '必填项不能为空！',
          type: 'warning'
        })
      } else {
        if (this.tableData.length > 0) {
          this.showDiv = true
          this.createOrder()
        } else {
          this.$message({
            message: '订购数据不能为空！',
            type: 'warning'
          })
        }
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getShopData()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getShopData()
    },
    getUserData () {
      http.userGetById().then(res => {
        this.userID = res.data.id
        this.formLabelAlign.user = res.data.nickName
        this.formLabelAlign.phone = res.data.phoneMobile
        // this.formLabelAlign.company = res.data.unit
        // if (res.data.groupIds[0]) {
        // this.getgroupGetById(res.data.groupIds[0])
        // }
        if (this.formLabelAlign.user) {
          this.userDisabled = true
        }
        if (this.formLabelAlign.company) {
          this.companyDisabled = true
        }
        if (this.formLabelAlign.phone) {
          this.phoneDisabled = true
        }
      })
    },
    getgroupGetById (val) {
      http.groupGetById({id: val}).then(res => {
        if (res.data.name) {
          this.formLabelAlign.company = res.data.name
        } else {
          this.formLabelAlign.company = '-'
        }
      })
    },
    getShopData () {
      let dataid = JSON.parse(sessionStorage.getItem('shopIDs'))
      let ids = JSON.parse(localStorage.getItem('IDs'))
      http.getAllShopDataForPage({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        data: {
          dataIds: dataid
          // idsStr: ids
        }
      }).then(res => {
        let arrid = []
        res.data.list.forEach((item, index) => {
          arrid.push(item.dataid)
          item.datatypename = 'GF1_MSS压缩包'
          item.datasize = this.commonMethod.dataSizeFormatter(item.datasize)
          item.cloudpercent = item.cloudpercent + '%'
        })
        this.tableData = res.data.list
        this.total = res.data.total
      })
    },
    getdataAllSize () {
      let dataid = JSON.parse(sessionStorage.getItem('shopIDs'))
      let ids = JSON.parse(localStorage.getItem('IDs'))
      http.getAllShopDataForPage({
        data: {dataIds: dataid}
        // data: {idsStr: ids}
      }).then(res => {
        let arrid = []
        res.data.list.forEach(item => {
          arrid.push(item.dataid)
        })
        this.getOrderShopSizeAll(arrid)
        this.tableDataAll = res.data.list
      })
    },
    createOrder () {
      this.orderReference = this.createName()
      this.orderId = []
      this.shopfIds = []
      this.tableDataAll.forEach(item => {
        this.orderId.push(parseInt(item.did))
        this.shopfIds.push(item.id)
      })
      this.confirmOrder()
    },
    confirmOrder () {
      let userID = JSON.parse(JSON.parse(localStorage.getItem('principalUserID')).principal).userId
      // let fileArr = this.uploadFileList.borrowCard.concat(this.uploadFileList.identityCard, this.uploadFileList.introductionLetter, this.uploadFileList.otherDoc)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // 产品等级等于6 任务进行拆分
      let levelD = null
      let level = this.levelData.filter(item => item.id === this.formLabelAlign.levelD)
      console.log(level, 'level')
      if (level[0].fHighLevel >= 13 && parseInt(this.tableData[0].datatype) ===  0) {
        levelD = 2
      } else {
        levelD = null
      }
      http.createOrder({data: {
        // uploadFileList: '',
        getMethod: this.formLabelAlign.getMethod, // 获取方式
        // userCardId: this.formLabelAlign.userCardId, // 身份证号
        shopIds: this.orderId, // 数据ID
        shopfIds: this.shopfIds, // 数据fId
        sstatus: -1,
        loginUser: userID,
        dataType: parseInt(this.tableData[0].datatype), // 数据类别1:资料数据 2：非资料数据
        ordername: this.orderReference, // 订单名称
        productName: this.formLabelAlign.proName, // 项目名称
        distmethod: this.formLabelAlign.getMethod === '在线下载' ? 0 : 2,
        // distfrequency: this.formLabelAlign.disFrequency,
        // delaytime: this.formLabelAlign.delayInterval,
        description: this.textarea, // 备注
        dataNum: this.total, // 数据条数
        dataSum: this.dataSizeAll, // 数据总量
        dataSizeKb: this.dataSizeAllKb, // 数据总量kb
        applyUserUsed: this.formLabelAlign.employ, // 使用用途
        applyuser: this.formLabelAlign.user, // 申请人
        applyUserPhone: this.formLabelAlign.phone, // 申请人联系方式
        applyUserUnit: this.formLabelAlign.company, // 申请人单位
        // 再加工订单参数===================
        type: 2,
        processDescribe: this.formLabelAlign.proInstructions,  // 加工说明
        assignment: this.formLabelAlign.levelD, // 产品级别
        endtime: this.formLabelAlign.endtime,
        subassignment: parseInt(this.tableData[0].datatype) === 0 ? 4 : null, // 子类的产品级别
        extractingElements: this.formLabelAlign.taskDataElements, // 提取要素
        modifyType: levelD  // 0：不拆分，1：合并 2：拆分
        // ===========================
      }}).then(res => {
        this.orderReference = ''
        this.orderDataList = []
        this.orderDataCpUrl = ['', '']
        loading.close()
        if (res.data !== 'false') {
          this.showDiv = true
          for (var key in res.data) {
            if (key === 'cpordername') {
              this.orderReference += '再加工产品订单：' + res.data[key] + ' 创建成功， '
              this.orderDataList.push(res.data[key])
              this.orderDataCpUrl[0] = res.data[key]
            } else if (key === 'zlordername') {
              this.orderReference += '资料订单：' + res.data[key] + ' 创建成功， '
              this.orderDataList.push(res.data[key])
            } else if (key === 'cporderurl') {
              this.orderDataCpUrl[1] = res.data[key]
            }
          }
          // this.orderReference = res.data.split(',')[0]
          this.$message({
            message: '订单数据属性信息保存成功！',
            type: 'success'
          })
          // this.orderDataList = res.data.split(',')
          /* eslint-disable no-var,no-use-before-define */
          // puvu
          this.commonPvzh.postDataPVuVcommonMe({
            fOrdername: this.orderDataCpUrl[0],
            fUserid: localStorage.getItem('userName'),
            fClientip: localStorage.getItem('returnCitySNIp'),
            fUseragent: localStorage.getItem('userAgent'),
            fDetailurl: window.location.href,
            fBehaviortype: 4
          })
        } else {
          this.$message({
            message: '订单数据属性信息保存失败！',
            type: 'warning'
          })
        }
      })
    },
    // 自动创建订单名称
    createName () {
      let name = ''
      let d = new Date()
      d.getYear() // 年月日[NW][WDP]0000
      name += d.getFullYear()
      var m = d.getMonth() + 1
      name += (m > 9 ? m : ('0' + m))
      var day = d.getDate()
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
    resetForm (formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    ...mapActions('manage', {
      setRouterPath: 'setRouterPath'
    }),
    ...mapActions('configManage', {
      setRouterPath: 'setRouterPath',
      getShopCarNum: 'getShopCarNum'
    }),
    ...mapActions('searchStore', {
      setShopAgen: 'setShopAgen',
      setShopIDs: 'setShopIDs',
      setDialogShowDataZ: 'setDialogShowDataZ',
      setSpanLabel: 'setSpanLabel',
      setDetailShow: 'setDetailShow'
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
    })
  },
  mounted () {
    this.pageSize = this.changeFixedPageSizeZ(document.documentElement.clientHeight - 597, 45)
    this.getlistProcessData()
    this.dialogResetFields()
    this.getUserData()
    this.getShopData()
    this.getdataAllSize()
  }
}
</script>

<style lang="scss" scoped>
  .el-input, .el-select {
    /*width: 280px!important;*/
    width: 21.2vw !important;
  }
  .machining >>>.el-input{
    /*width: 280px!important;*/
    width: 29.2vw !important;
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
  .content_UP{
    width: 17.8%;
    background: rgb(255, 255, 255);
    padding: 1%;
    border: 1px solid rgba(73, 120, 241, 0.19);
    float: left;
    height: 22vh;
    /*overflow-y: auto;*/
  }
  .content_UPz_Z{
    border: 1px solid rgba(73, 120, 241, 0.19);
  }
  .content_UP_b{
    border-bottom: 1px solid rgba(73, 120, 241, 0.19);
  }
  .content_tow>>>.el-upload--picture-card {
    width: 11vh !important;
    height: 11vh !important;
    line-height: 11vh !important;
  }
  .content_tow>>>.el-upload-list--picture-card .el-upload-list__item {
    width: 11vh !important;
    height: 11vh !important;
    /*line-height: 11vh !important;*/
  }
  .uploadFilesItemClass {
    height: 78%;
    padding: 10px;
    padding-bottom: 0px;
    /*background-color: #F9F9F9 !important;*/
    /*border: 1px solid #E9E9E9;*/
    overflow: auto;
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
    text-align: right;
    width: 100%;
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
    margin-top: 4vh;
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
    /*float: left;*/
    line-height: 25px;
    /*margin-top: 8px;*/
    /*margin-left: 20px;*/
    border-radius: 3px;
    text-align: center;
    cursor: pointer;
    float: right;
    top: -5px;
    margin-right: 28px;
    position: relative;
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
    width: 85vw !important;
  }
  .createOrder>>>.el-form--inline .el-form-item {
    margin-right: 4% !important;
  }
</style>
