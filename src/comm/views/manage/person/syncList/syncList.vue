<template>
  <div ref="orderContent" class="orderContent" style="">
    <div :class="{active_form: this.orderStatusIndex === ''}" class="fromZ active_form">
      <el-form :inline="true"
               class="demo-form-inline"
               style="    width: 86%; display: inline-block;">
        <!--<el-form-item class="time_form" label="订单类型" v-if = "orderStatusIndex === ''">-->
          <!--<el-select v-model="queryOrderType"-->
                     <!--clearable-->
                     <!--placeholder="请选择">-->
            <!--<el-option v-for="item in optionsType"-->
                       <!--:key="item.value"-->
                       <!--:label="item.label"-->
                       <!--:value="item.value"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item  class="time_form" label="订单编号">
          <el-autocomplete
            class="inline-input"
            v-model="orderNumber"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入编号"
            :trigger-on-focus="false"
            @focus = "handleSlideInNub(0)"
            @select="handleSelect"
          ></el-autocomplete>
          <!--<el-input v-model="orderNumber" placeholder="请输入编号"></el-input>-->
        </el-form-item>
        <el-form-item class="time_form" label="申请单位">
          <el-autocomplete
            class="inline-input"
            v-model="applicant"
            clearable
            :fetch-suggestions="querySearch"
            placeholder="请输入单位"
            :trigger-on-focus="false"
            @focus = "handleSlideInCom(1)"
            @select="handleSelect"
          ></el-autocomplete>
          <!--<el-input v-model="applicant" placeholder="请输入单位"></el-input>-->
        </el-form-item>
        <!--<el-form-item label="订购时间" class="time_picke">-->
          <!--<el-date-picker-->
            <!--:picker-options="pickerOptions"-->
            <!--v-model="OrderStartTime"-->
            <!--type="datetimerange"-->
            <!--start-placeholder="开始日期"-->
            <!--end-placeholder="结束日期"-->
            <!--range-separator="至">-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->
        <el-form-item  class="time_form" label="订单状态"  v-if = "orderStatusIndex === ''">
          <el-select v-model="queryOrderStatus"
                     clearable
                     @change = "handleSelectStatu"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  class="time_form" label="申请人">
          <el-input v-model="usernamevalue" placeholder="请输入申请人"></el-input>
        </el-form-item>
        <el-form-item  class="time_form" label="订购账号">
          <el-input @change="getUsernameNum" v-model="usernameNum" placeholder="请输入订购账号"></el-input>
        </el-form-item>
        <el-form-item label="订购时间" class="time_picke">
          <el-date-picker
            :picker-options="pickerOptions"
            v-model="OrderEndTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            range-separator="至">
          </el-date-picker>
          <!--<el-date-picker v-model="orderDate_0"-->
                          <!--type="date"-->
                          <!--style="width: 45%;"-->
                          <!--placeholder="起始日期"-->
                          <!--format="yyyy-MM-dd"-->
          <!--&gt;</el-date-picker>-->
          <!--<span>至</span>-->
          <!--<el-date-picker v-model="orderDate_1"-->
                          <!--type="date"-->
                          <!--style="width: 45%;"-->
                          <!--placeholder="结束日期"-->
                          <!--format="yyyy-MM-dd"-->
          <!--&gt;</el-date-picker>-->
        </el-form-item>
      </el-form>
      <div style="display: inline-block; margin-top: 15px;">
          <el-button style="margin: 0 0 0 .2rem;"
                     type="primary"
                     @click="findOrderListByUser">查询</el-button>
          <el-button style="margin: 0 0 0 .2rem;"
                     type="primary"
                     @click="emptyData">重 置</el-button>
      </div>
    </div>
    <div class="tableDZ">
      <!--<div class="orderButton">-->
        <!--<el-button style="margin-left: .1rem;"-->
                   <!--size="mini"-->
                   <!--@click="conventionOrder('ordinary')"-->
                   <!--type="primary">常规需求订单创建</el-button>-->
        <!--&lt;!&ndash;<el-button size="mini"&ndash;&gt;-->
        <!--&lt;!&ndash;@click="conventionOrder('emergy')"&ndash;&gt;-->
        <!--&lt;!&ndash;type="primary"&ndash;&gt;-->
        <!--&lt;!&ndash;style="margin-left: .2rem;">应急订单创建</el-button>&ndash;&gt;-->
      <!--</div>-->
      <el-table
        ref="multipleTable"
        :data="tableData3"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column
          label="订单编号"
          align="center"
          width="150"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color:#3C6EF0;">{{scope.row.ordername}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
        <!--prop="userName"-->
        <!--label="申请人"-->
        <!--show-overflow-tooltip-->
        <!--align="center"></el-table-column>-->
        <!--<el-table-column-->
        <!--prop="groupName"-->
        <!--label="申请单位"-->
        <!--align="center"-->
        <!--show-overflow-tooltip>-->
        <!--</el-table-column>-->
        <el-table-column
          prop="applyuser"
          label="申请人"
          show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column
          prop="applyUserUnit"
          label="申请单位"
          show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column
          prop="applyUserPhone"
          label="联系方式"
          show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column
          prop="getMethod"
          label="获取方式"
          v-if="orderStatusIndex !== 8"
          show-overflow-tooltip
          align="center">
        </el-table-column>
        <el-table-column
          prop="creattime"
          label="订购时间"
          show-overflow-tooltip
          align="center"></el-table-column>
        <el-table-column
          label="响应时效"
          v-if="orderStatusIndex === 8"
          show-overflow-tooltip
          align="center">
          <template slot-scope="scope">
            <span>{{feedBacklabel[parseInt(scope.row.responseSpeed)]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="服务态度"
          v-if="orderStatusIndex === 8"
          show-overflow-tooltip
          align="center">
          <template slot-scope="scope">
            <span>{{feedBacklabel[parseInt(scope.row.serviceAttitude)]}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总体评价"
          v-if="orderStatusIndex === 8"
          show-overflow-tooltip
          align="center">
          <template slot-scope="scope">
            <span>{{feedBacklabel[parseInt(scope.row.appraise)]}}</span>
          </template>
        </el-table-column>
        <!--<el-table-column-->
          <!--prop="creattime"-->
          <!--label="订单完成时间"-->
          <!--show-overflow-tooltip-->
          <!--align="center"></el-table-column>-->
        <el-table-column
          prop="dataSum"
          label="产品数据量"
          v-if="orderStatusIndex !== 8"
          show-overflow-tooltip
          align="center"></el-table-column>
        <!-- <el-table-column
          prop="orderStatus"
          label="数据量"
          align="center"
          :formatter="statusConverter"></el-table-column> -->
        <el-table-column
          v-if="this.orderStatusIndex !== -1"
        label="订单状态"
        align="center"
        :formatter="statusConverter">
          <template slot-scope="scope">
            <span :class="{colorindexO: scope.row.sstatus === 2 || scope.row.sstatus === 5, colorindexT: scope.row.sstatus === 3, colorindexTh: true }">{{scope.row.statusLabel}}</span>
          </template>
          <span></span>
        </el-table-column>
        <el-table-column
        label="数据准备进度"
        v-if="this.orderStatusIndex === 1"
        align="center"
          :width="150"
        :formatter="statusConverter">
          <template slot-scope="scope">
            <el-progress v-if="scope.row.sstatus !== 0 && scope.row.sstatus !== 5 && scope.row.sstatus !== -1" :percentage=scope.row.dataPercent.percentStr :color="colorsZ"></el-progress>
            <span v-if="scope.row.sstatus === 0 || scope.row.sstatus === 5 || scope.row.sstatus === -1">-</span>
            <div style="width: 65%; display: inline-block">
            <span v-if="scope.row.sstatus !== 0 && scope.row.sstatus !== 5 && scope.row.sstatus !== -1">
              <span title="总景数" style="color:#000; cursor: pointer;">{{scope.row.dataPercent.allSize}}</span>/
              <span title="完成景数" style="color:green;cursor: pointer;">{{scope.row.dataPercent.isin}}</span>/
              <span title="失败景数" style="color:red;cursor: pointer;">{{scope.row.dataPercent.failed}}</span>/
              <span title="待提景数" style="color:blue;cursor: pointer;">{{scope.row.dataPercent.doing}}</span>
            </span>
            </div>
          </template>
          <span></span>
        </el-table-column>
        <!--<el-table-column-->
          <!--v-if="this.orderStatusIndex === '' || this.orderStatusIndex === 3 || this.orderStatusIndex === 6"-->
          <!--label="数据状态"-->
          <!--align="center"-->
          <!--:formatter="statusConverter">-->
          <!--<template slot-scope="scope">-->
            <!--<span :class="{colorindexT: scope.row.status === 3, colorindexTh: true }">{{dataStatus[scope.row.status]}}</span>-->
            <!--<span v-if="scope.row.status === -1">-</span>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <!--<el-table-column-->
          <!--prop="status"-->
          <!--label="订单状态"-->
          <!--align="center"></el-table-column>-->
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              @click="orderNodeData(scope.$index, scope.row)">流程</el-button> -->
             <img title="详情" style="margin-right: 5px; cursor: pointer;" @click="orderData(scope.row)" width="16px" height="16px" src="@/assets/img/showDetail.png" alt="">
            <img title="评价" style="cursor: pointer;" @click="openFeedBack(scope.row, 0)" v-if="orderStatusIndex === 7" src="@/assets/img/fk_pj.png" alt="">
            <img title="评价展示" style="cursor: pointer; margin-right: 5px;" v-if="orderStatusIndex === 8" @click="openFeedBack(scope.row, 1)"  src="@/assets/img/fk_zs.png" alt="">
            <img title="反馈附件下载" style="cursor: pointer;" v-if="orderStatusIndex === 8 && scope.row.feedBackUpload" @click="openFeedBackXZ(scope.row)"  src="@/assets/img/fk_xz.png" alt="">
             <img v-if="(orderStatusIndex === 0 || scope.row.sstatus === 0) && userProName === '管理员'" title="审核通过" style="margin-right: 5px; cursor: pointer;" @click="handleEditTg(1, scope.row)" width="16px" height="16px" src="@/assets/img/ApprovedD.png" alt="">
             <img v-if="(orderStatusIndex === 0 || scope.row.sstatus === 0)&& userProName === '管理员'" title="审核不通过1" style="margin-right: 5px; cursor: pointer;" @click="handleEditBtg(2, scope.row)" width="16px" height="16px" src="@/assets/img/rejectD.png" alt="">
             <!--<img style="cursor: pointer;" v-if=" orderStatusIndex=== 5" title="重置"  @click="orderData(scope.row)" width="16px" height="16px" src="@/assets/img/ResetD.png" alt="">-->
            <i v-if=" scope.row.sstatus === 6 && scope.row.getMethod === '在线下载'" @click="downData(scope.row)"  class="el-icon-download" style="font-size: 18px;color: blue; cursor: pointer; font-weight: bold; position: relative; top: 3px;"></i>
            <i class="infoContactd" v-if=" scope.row.sstatus === 6 && scope.row.getMethod === '线下拷贝'" >
              <el-popover
                border="1px solid #87CEFA"
                placement="right"
                width="210"
                trigger="click">
                <div style="display: flex; margin-bottom: 10px;margin-top: 10px">
                  <span style="flex: 1;">联系电话:</span><span style="flex: 2;">62060078、62060340</span>
                </div>
                <div style="display: flex; margin-bottom: 10px">
                  <span style="flex: 1;">获取地址:</span><span style="flex: 2;">海淀区学院路31号航遥中心</span>
                </div>
                <div v-if="userProName === '管理员'" style="display: flex; margin-bottom: 10px">
                  <span style="flex: 1;">物理地址1:</span><span style="flex: 2;">{{scope.row.downlodPathFile}}</span>
                </div>
                <div style="line-height: 22px;text-align: center;color: blue;cursor:pointer;" @click="checkInfo()" >点击查看详情</div>
                <el-button slot="reference"><i class="el-icon-chat-dot-round" style=" width: 20px; font-size: 16px; color: blue; cursor: pointer; font-weight: bold; position: relative;"></i></el-button>
              </el-popover>
            </i>
          </template>
        </el-table-column>
      </el-table>
      <div class="paginationAnddeleteButton">
        <div class="deleteButton">
          <el-button style="margin-left: .1rem;"
          size="mini"
          @click="deleteAllData"
          type="primary"><i style="margin-right: 8px;" class="el-icon-delete"></i>批量删除</el-button>
          <!--<el-button size="mini"-->
          <!--@click="meetOrder"-->
          <!--type="primary"-->
          <!--style="margin-left: .2rem;">批量审核</el-button>-->
          <!--<el-button size="mini"-->
          <!--type="primary"-->
          <!--style="margin-left: .2rem;">失败数据重新提取</el-button>-->
        </div>
        <el-pagination class="pagination"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       background
                       layout="total, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
        <!--<div class="userShow"-->
             <!--v-show="this.userRight ==  'false'">-->
          <!--<el-checkbox></el-checkbox>-->
          <!--<span>已有信息导入:</span>-->
          <!--<el-input style="width:10rem"-->
                    <!--v-model="msgInput"> </el-input>-->
          <!--<el-button type="primary"-->
                     <!--style="margin-left: .2rem;">添加</el-button>-->
        <!--</div>-->
      </div>
    </div>
    <el-dialog class="elDialog_Aduti" :title="title" :visible.sync="dialogVisible" width="7rem">
      <span>
        <div>
          <!--<el-form ref="form" label-width="2rem" style="text-align: left">-->
            <!--<el-form-item>-->
              <el-input :rows="4"
                        type="textarea"
                        v-model="inputFeekBack"></el-input>
            <!--</el-form-item>-->
          <!--</el-form>-->
        </div>
      </span>
      <span slot="footer"
            class="dialog-footer">
        <el-button size="small"
                   @click="dialogVisible = false">取 消</el-button>
        <el-button size="small"
                   type="primary"
                   @click="audit(2)">确 定</el-button>
        <!--<el-button size="small"-->
                   <!--type="primary"-->
                   <!--@click="editDialogVisible"-->
                   <!--v-if="show === false">确 定</el-button>-->
      </span>
    </el-dialog>
    <el-dialog class="elDialog_Aduti" title="数据下载信息：" :close-on-click-modal="false"
               :close-on-press-escape="true" :visible.sync="dialogVisibledonw" width="600px">
      <span class="ftp_class">
        <div class="title_name">下载地址：</div><div class="conton_con">{{arrDataFtp[0]}}</div>
        <div class="title_name">主机：</div><div class="conton_con">{{arrDataFtp[1]}}</div>
        <div class="title_name">账号名称：</div><div class="conton_con">{{arrDataFtp[2]}}</div>
        <div class="title_name">提取码：</div><div class="conton_con">{{arrDataFtp[3]}}</div>
        <div class="title_name">端口号：</div><div class="conton_con">{{arrDataFtp[4]}}</div>
        <div class="notion_name">
          <span class="ftpDown">注：请复制“下载地址”到本地电脑的下载器中自行进行数据获取。若本地电脑未安装合适下载器，本站推荐免费下载器 <span @click="spanFTP" class="ftpDown_a">“FileZilla”</span> ，请自行下载使用。</span>
        </div>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="dialogVisibledonw = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog class="FeedBackD" title="订单基本信息：" :close-on-click-modal="false"
               :close-on-press-escape="true" :visible.sync="openFeedBackDialog" width="600px">
      <div class="FeedBack_content">
        <div class="FeedBack_content_notion">
          <div class="FeedBack_content_span" v-for="(item, index) in FeedBackData" :key="index">
            <span class="FeedBack_content_span_left">{{item.name}}：</span>
            <span class="FeedBack_content_span_right">{{item.value}}</span>
          </div>
        </div>
        <div class="FeedBack_content_text" style="position: relative;">
          <div class="FeedBack_evaluate">订单评价</div><span style="" class="spanbt" > *</span>
          <div class="FeedBack_evaluate_content">
            <div class="FeedBack_evaluate_left" v-for="(item, index) in FeedBackDataTow" :key="index">
              <div class="FeedBack_evaluate_left_label">{{item.label}}</div>
              <div class="FeedBack_evaluate_left_rate">
                <template>
                  <el-radio-group :disabled = 'disabledD' v-model="item.value">
                    <el-radio :label=0>非常满意</el-radio>
                    <el-radio :label=1>满意</el-radio>
                    <el-radio :label=2>一般</el-radio>
                    <el-radio :label=3>不满意</el-radio>
                  </el-radio-group>
                </template>
              </div>
            </div>
          </div>
          <div class="FeedBack_evaluate_right">
            <span class="FeedBack_evaluate_right_span">订单反馈</span>
            <a :href = hrefData download = "反馈模板.doc"><span class="FeedBack_evaluate_right_down">模板下载</span></a>
            <div style="clear:both;"></div>
            <div class="FeedBack_evaluate_right_load">
              <upload :disabledD = 'disabledD' @uploadData="uploadData"></upload>
            </div>
            <div v-show="fileDShow" class="FeedBack_evaluate_right_load_span">
              <span v-show="FeedBackFileName !== ''">{{FeedBackFileName}}</span>
              <i v-show="!disabledD && FeedBackFileName !== ''" @click="FeedBackFileDle" class="el-icon-close"></i>
            </div>
          </div>
          <div style="clear:both;"></div>
          <div class="FeedBack_evaluate_right textareaC">
            <span class="FeedBack_evaluate_right_span">您的宝贵意见</span>
            <div class="textareaC_span">
              <el-input
                :disabled = 'disabledD'
                type="textarea"
                :rows="4"
                placeholder="请输入内容..."
                v-model="textarea">
              </el-input>
            </div>
          </div>
        </div>
      </div>
      <span v-show="!disabledD" slot="footer" class="dialog-footer FeedBackdialog-footer " >
        <el-button type="primary" size="small" @click="FeedBackClick">确 定</el-button>
        <el-button type="primary" size="small" plain @click="openFeedBackDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from '@/utils/auth'
import { mapActions, mapState } from 'vuex'
import upload from './uploadData/upload.vue'
// import { getOrderListForPage, deleteOrderById, getOrderUser, getShopCountByUser,updateOrderStatusById } from '@/api/oderAndShop'
import http from '@comm/service/interface.js'
export default {
  components: {
    upload
  },
  data () {
    return {
      GroupNameList: [],
      OrderNameList: [],
      textarea: '',
      disabledD: true,
      feedBacklabel: ['非常满意', '满意', '一般', '不满意'],
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
      OrderStartTime: [],
      OrderEndTime: [],
      queryOrderType: '全部类型',
      // 普通用户的权限
      userRight: '',
      orderStatusIndex: 0,
      orderStatusGly: '',
      // 导入的信息
      msgInput: '',
      SlideIn: '',
      tableData3: [],
      multipleSelection: [],
      // 控制弹框显示隐藏
      dialogVisible: false,
      openFeedBackDialog: false,
      FeedBackFileName: '',
      hrefData: '../../../../static/fk_mb.doc',
      uploadDataF: '',
      fileDShow: true,
      FeedBackData: [],
      rowData: {},
      orderNameData: [],
      examineValue: [
        {
          value: 1,
          label: '审核通过'
        },
        {
          value: 2,
          label: '审核未通过'
        }
      ],
      FeedBackDataTow: [
        {
          value: '',
          label: '总体评价：'
        },
        {
          value: '',
          label: '响应时效：'
        },
        {
          value: '',
          label: '服务态度：'
        }
      ],
      dataStatus: ['-', '-', '-', '待提取', '-', '-', '提取完成'],
      applicant: '',
      orderNumber: '',
      optionsType: [
        {
          value: 0,
          label: '已有产品订单'
        },
        {
          value: 1,
          label: '常规需求订单'
        },
        {
          label: '再加工订单',
          value: 2
        },
        {
          value: '',
          label: '全部类型'
        }
      ],
      options: [
        {
          value: -1,
          label: '待提交'
        },
        {
          value: 0,
          label: '待审核'
        },
        {
          value: 1,
          label: '审核通过'
        },
        {
          value: 2,
          label: '审核未通过'
        },
        {
          value: 6,
          label: '数据准备完成'
        },
        {
          value: 7,
          label: '已完成'
        },
        {
          value: 5,
          label: '逾期'
        },
        {
          value: '',
          label: '所有状态'
        }
      ],
      value: '',
      thishtml: null,
      inputFeekBack: '',
      orderId: '',
      ordername: '',
      orderName: '',
      orderStatus: '',
      orderStatusInfo: '',
      total: null,
      currentPage: 1,
      pageSize: 10,
      show: true,
      dialogVisibledonw: false,
      arrDataFtp: [],
      title: '',
      usernamevalue: '',
      usernameNum: '',
      usernameNumData: '',
      optionUserName: [],
      orderDate_1: null,
      orderDate_0: null,
      queryOrderStatus: '所有状态',
      date1: '',
      aHref: '',
      spanLabelZ: '',
      orderstatusLabel: ['待审核', '审核通过', '审核未通过', '审核通过-待打包', '数据准备完成', '逾期', '数据准备完成', '已完成', '已反馈'],
      OrderStatusInput: [],
      userProName: '',
      userName: '',
      restaurants: [],
      colorsZ: [
        {color: '#f56c6c', percentage: 20},
        {color: '#e6a23c', percentage: 40},
        {color: '#5cb87a', percentage: 60},
        {color: '#1989fa', percentage: 80},
        {color: '#6f7ad3', percentage: 100}
      ]
    }
  },

  methods: {
    getByOrderName () {
      let userID = JSON.parse(localStorage.getItem('principalUserID'))
      let userRote = JSON.parse(userID.principal)
      this.OrderNameList = []
      http.getOrderNameListByOrderName({
        luser: userRote.userId
      }).then(res => {
        if (res.data.records.length > 0) {
          res.data.records.forEach(item => {
            this.OrderNameList.push({
              value: item.F_ORDERNAME
            })
          })
        }
      })
    },
    getComNameList () {
      http.getagrsGroupNameList().then(res => {
        this.GroupNameList = []
        if (res.data.records.length > 0) {
          res.data.records.forEach(item => {
            this.GroupNameList.push({
              value: item.F_NAME
            })
          })
        }
      })
    },
    handleSelectStatu (val) {
      this.orderStatusGly = val
    },
    querySearch (queryString, cb) {
      var restaurants = []
      if (this.SlideIn === 0) {
        restaurants = this.OrderNameList
      } else {
        restaurants = this.GroupNameList
      }
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {},
    handleSlideInCom (val) {
      this.SlideIn = val
    },
    handleSlideInNub (val) {
      this.SlideIn = val
    },
    getUserR () {
      let userID = JSON.parse(localStorage.getItem('principalUserID'))
      let userRote = JSON.parse(userID.principal)
      console.log(userID, 'userID')
      console.log(userRote, 'userRote')
      if (userRote.roleIds.length > 0) {
        if (userRote.roleIds[0].indexOf('管理员') > -1) {
          this.userProName = '管理员'
          this.userName = null
        } else {
          this.userProName = ''
          this.userName = userRote.userId
        }
      } else {
        this.userProName = ''
        this.userName = userRote.userId
      }
    },
    getDataIndex (val) {
      this.emptyData() // 清空查询条件
      if (val === '待提交订单' || val === 'orderManage_staySubmit') {
        this.orderStatusIndex = -1
      } else if (val === '待审核订单' || val === 'orderManage_stayAudit') {
        this.orderStatusIndex = 0
      } else if (val === '审核通过订单' || val === 'orderManage_pastAudit') {
        this.orderStatusIndex = 1
      } else if (val === '审核未通过订单' || val === 'orderManage_onAudit') {
        this.orderStatusIndex = 2
      } else if (val === '已完成订单' || val === 'orderManage_completeAudit') {
        this.orderStatusIndex = 7
      } else if (val === '数据准备完成订单' || val === 'orderManage_dataReadyFinish') {
        this.orderStatusIndex = 6
      } else if (val === '逾期订单' || val === 'orderManage_unusualAudit') {
        this.orderStatusIndex = 5
      }  else if (val === '已反馈订单' || val === 'orderManage_feedback') {
        this.orderStatusIndex = 8
      } else if (val === '全部订单' || val === 'orderManage') {
        this.orderStatusIndex = ''
      }
    },
    conventionOrder (data) {
      this.$router.push({
        name: 'conventionOrderCreate',
        params: {
          type: data
        }
      })
    },
    meetOrder () {},
    usernameQuerySearch (queryString, cb) {
      var restaurants = this.optionUserName
      var results = queryString ? restaurants.filter((restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.orderNameData = []
      for (let i = 0; i < val.length; i++) {
        this.orderNameData.push(val[i].ordername)
      }
    },
    hasLetter: function (str) {
      for (var i in str) {
        var asc = str.charCodeAt(i)
        if ((asc >= 65 && asc <= 90) || (asc >= 97 && asc <= 122)) {
          return true
        }
      }
      return false
    },
    getUsernameNum () {
      if (this.usernameNum) {
        this.usernameNumData = this.usernameNum
      } else {
        if (window.systemName === 'DZY') {
          this.usernameNumData = localStorage.getItem('userName')
        } else if (window.systemName === 'FW') {
          this.usernameNumData = this.userName
        }
      }
    },
    findOrderList () {
      let statusIndex = ''
      if (this.orderStatusIndex === '') {
        statusIndex = this.orderStatusGly
      } else {
        statusIndex = this.orderStatusIndex
      }
      this.getUsernameNum()
      http.getManOrderListForPage({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        data: {
          type: 0,
          ordercode: this.orderNumber,
          sstatus: statusIndex,
          userName: this.usernameNumData,
          groupName: this.applicant,
          applyuser: this.usernamevalue,
          // lessOrderStartTime: this.OrderStartTime === null ? null : this.OrderStartTime[0],
          // moreOrderStartTime: this.OrderStartTime === null ? null : this.OrderStartTime[1],
          lessCreattime: this.OrderEndTime === null ? null : this.OrderEndTime[0],
          moreCreattime: this.OrderEndTime === null ? null : this.OrderEndTime[1],
          lessCreattimeStr: this.OrderEndTime === null ? null : this.commonMethod.timestampToTimeD(this.OrderEndTime[0]),
          moreCreattimeStr: this.OrderEndTime === null ? null : this.commonMethod.timestampToTimeD(this.OrderEndTime[1])
        }
      }).then(res => {
        res.data.list.forEach(item => {
          if (item.creattime) {
            item.creattime = item.creattime.replace('T', ' ')
          }
          // item.creattime = this.commonMethod.timestampToTime(item.creattime)
          if (!this.hasLetter(item.dataSum)) {
            item.dataSum = this.commonMethod.dataSizeFormatter(item.dataSum)
          }
          if (item.dataPercent) {
            item.dataPercent = JSON.parse(item.dataPercent)
          }
          if (item.sstatus === -1) {
            item.sstatus = -1
            item.statusLabel = '待提交'
          } else {
            item.statusLabel = this.orderstatusLabel[item.sstatus]
          }
        })
        console.log(res.data.list, 'res.data.list')
        this.tableData3 = res.data.list
        this.total = res.data.total
      }, (resq) => {
        this.tableData3 = []
        this.total = 0
      })
    },
    goToNextR (val) {
      if (val === 0) {
        this.setSpanLabel('待审核订单')
        this.$router.push({name: 'orderManage_stayAudit'})
      } else if (val === -1) {
        this.setSpanLabel('待提交订单')
        this.$router.push({name: 'orderManage_staySubmit'})
      } else if (val === 1) {
        this.setSpanLabel('审核通过订单')
        // this.$router.push({name: 'orderManage_pastAudit'})
      } else if (val === 2) {
        this.setSpanLabel('审核未通过订单')
        this.$router.push({name: 'orderManage_onAudit'})
      } else if (val === 5) {
        this.setSpanLabel('逾期订单')
        this.$router.push({name: 'orderManage_unusualAudit'})
      } else if (val === 6) {
        this.setSpanLabel('数据准备完成订单')
        this.$router.push({name: 'orderManage_dataReadyFinish'})
      } else if (val === 7) {
        this.setSpanLabel('已完成订单')
        this.$router.push({name: 'orderManage_completeAudit'})
      } else if (val === 8) {
        this.setSpanLabel('已反馈订单')
        this.$router.push({name: 'orderManage_feedback'})
      }
    },
    initTable () {
      if (this.spanLabel === '') {
        this.findOrderList()
      }
    },
    orderNodeData (index, row) {
      this.show = false
      this.title = '订单流程信息'
      this.dialogVisible = true
      this.orderName = row.orderName
      this.inputFeekBack = row.orderStatusInfo
    },
    downData: function (val) {
      // var gotolink = document.createElement('a')
      // gotolink.href = val.downlodPathFile
      // gotolink.setAttribute("target", "_blank")
      // document.body.appendChild(gotolink)
      // gotolink.click()

      // let getTimestamp=new Date().getTime();

      // val.downlodPathFile = val.downlodPathFile + "?timestamp="+getTimestamp

      // let showDocContentWindow = ''
      // if (showDocContentWindow) { // 已经打开过
      //   showDocContentWindow.close(); // 关闭
      // }
      // console.log(showDocContentWindow, 'showDocContentWindow')
      // window.open(val.downlodPathFile, '_blank')
      // window.location.href = val.downlodPathFile
      // puvu

      if (val.downlodPathFile) {
        this.dialogVisibledonw = true
        let stringD = val.downlodPathFile.slice(0, val.downlodPathFile.indexOf('@'))
        let stringL = val.downlodPathFile.slice(val.downlodPathFile.indexOf('@') + 1, val.downlodPathFile.length)
        let arr = stringD.split(':')
        let arrL = stringL.split(':')
        this.arrDataFtp = [val.downlodPathFile,arrL[0], arr[1].slice(2,arr[1].length),  arr[2], arrL[1]]
      }
      this.commonPvzh.postDataPVuVcommonMe({
        fOrdername: val.ordername,
        fUserid: localStorage.getItem('userId'),
        fClientip: localStorage.getItem('returnCitySNIp'),
        fBehaviortype: 5,
        fUseragent: localStorage.getItem('userAgent'),
        fDetailurl: window.location.href
      })
    },
    checkInfo () {
      window.open('/contactUs')
    },
    downDataCopy (val) {
      console.log(val)
    },
    openFeedBackXZ(row) {
      window.open(row.feedBackUpload, '_blank')
    },
    openFeedBack(row, index = 0) {
      console.log(row, '999999')
      this.fileDShow = true
      this.uploadDataF = ''
      this.rowData = row
      this.FeedBackData = [
        {
          name: '订单编号',
          value: row.ordername
        },
        {
          name: '数据景数',
          value: row.dataCount
        },
        {
          name: '数据量',
          value: row.dataSum
        },
        {
          name: '项目名称',
          value: row.productName
        },
        {
          name: '用途',
          value: row.applyUserUsed
        },
        {
          name: '申请单位',
          value: row.applyUserUnit
        },
      ]
      if  (index === 1) {
        this.disabledD = !row.edit
        if (row.feedBackUpload) {
          this.uploadDataF = row.feedBackUpload
          let fILEd = row.feedBackUpload.split('/')
          this.FeedBackFileName = fILEd[fILEd.length - 1].slice(19)
        } else {
          this.FeedBackFileName = ''
        }
        this.FeedBackDataTow = [
          {
            value: Number(row.appraise),
            label: '总体评价：'
          },
          {
            value:  Number(row.responseSpeed),
            label: '响应时效：'
          },
          {
            value: Number(row.serviceAttitude),
            label: '服务态度：'
          }
        ]
        this.textarea = row.feedBack ? row.feedBack : ''
      } else if (index === 0) {
        this.disabledD = false
        this.FeedBackDataTow = [
          {
            value: '',
            label: '总体评价：'
          },
          {
            value: '',
            label: '响应时效：'
          },
          {
            value: '',
            label: '服务态度：'
          }
        ]
      }
      this.openFeedBackDialog = true
    },
    // 删除反馈文件
    FeedBackFileDle(){
      this.$confirm('此操作将删除反馈文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.FeedBackFileName = ''
        this.uploadDataF = ''
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    uploadData (val) {
      console.log(val, 'uploadData')
      this.fileDShow = false
      this.uploadDataF = val
    },
    FeedBackClick(){
      let a = this.FeedBackDataTow.some(item => item.value === '')
      console.log(a)
      if (a) {
        this.$message({
          message: '请选择订单评价',
          type: 'warning'
        })
      } else {
        http.agrsOrderFeedBack({
          data: {
            responseSpeed: this.FeedBackDataTow[1].value.toString(),
            serviceAttitude: this.FeedBackDataTow[2].value.toString(),
            appraise: this.FeedBackDataTow[0].value.toString(),
            feedBackUpload: this.uploadDataF,
            feedBack: this.textarea,
            sstatus: 8,
            ordername: this.rowData.ordername,
            id: this.rowData.id // 订单编号
          }
        }).then(res => {
          console.log(res, '0000000')
          if (res.data && res.data === 'true') {
            this.$message({
              message: '反馈成功！',
              type: 'success'
            })
            this.findOrderList()
          } else {
            this.$message({
              message: '反馈失败！',
              type: 'error'
            })
          }
        })
        this.openFeedBackDialog = false
      }
      //
    },
    orderData (row) {
      console.log(row, 'row')
      this.setOrderDetailId(row.id)
      let objStr = JSON.stringify(row)
      sessionStorage.setItem('orderDataID', [objStr])
      if (this.token !== undefined && this.token !== 'undefined' && this.token !== '') {
        this.$router.push({
          name: 'orderManage_details'
        })
      } else if (this.userRight === 'false') {
        this.$router.push({
          name: 'orderManage_details'
        })
      }
    },
    handleEditTg (index, row) {
      this.$confirm('审核通过后，订单将进入数据准备状态，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.inputFeekBack = ''
        this.orderStatus = row.orderStatus
        this.orderId = row.id
        this.ordername = row.ordername
        this.audit(index)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        })
      })
    },
    handleEditBtg (index, row) {
      this.title = '请填写审批未通过原因：'
      this.inputFeekBack = ''
      this.orderStatus = row.orderStatus
      this.orderId = row.id
      this.ordername = row.ordername
      this.dialogVisible = true
    },
    deleteAllData () {
      if (this.orderNameData.length > 0) {
        this.handleDelete(2, this.orderNameData)
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    handleDelete (index, row) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.getUpdateOrderStatus({data: { orderNames: row, sstatus: -2 }}).then(res => {
          if (res.data) {
            this.$notify({
              message: '删除成功！',
              position: 'bottom-right',
              duration: 1500,
              type: 'success'
            })
            this.findOrderList()
          } else {
            this.$notify.error({
              message: '删除失败！',
              position: 'bottom-right',
              duration: 0
            })
          }
        })
      }).catch(() => {
        this.$notify.info({
          message: '已取消删除',
          position: 'bottom-right',
          duration: 1500
        })
      })
    },
    audit (val) {
      let loginName = localStorage.getItem('userId')
      http.auditOrder({
        data: {
          'cause': this.inputFeekBack,
          'orderid': this.orderId,
          'orderName': this.ordername,
          'status': val,
          'auditor': loginName
        }
      }).then(res => {
        if (res.data) {
          this.$notify({
            message: '审核完成！',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          this.findOrderList()
          // this.goToNextR(val)
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
    editDialogVisible () {
      this.dialogVisible = false
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.findOrderList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.findOrderList()
    },
    spanFTP () {
      window.open('https://filezilla-project.org/download.php?type=client', '_blank')
    },
    statusConverter (val) {
      for (var i = 0; i < this.options.length; i++) {
        if (val.orderStatus === this.options[i].value) {
          return this.options[i].label
        }
      }
    },
    emptyData () {
      // this.queryOrderType = ''
      this.orderNumber = ''
      this.OrderEndTime = null
      this.OrderStartTime = null
      this.applicant = ''
      this.usernamevalue = ''
      this.usernameNum = ''
    },
    findOrderListByUser () {
      this.findOrderList()
    },
    ...mapActions('searchStore', {
      setOrderDetailId: 'setOrderDetailId',
      setSpanLabel: 'setSpanLabel'
    })
  },
  mounted () {
    this.pageSize = this.changeFixedPageSizeZ(document.documentElement.clientHeight - 380, 53)
    this.$refs.orderContent.style.height = 'calc(100% - 46px)'
    // this.initTable()
    this.userRight = sessionStorage.getItem('userRight')
    let pathArr = this.$route.path.split('/')
    this.getUserR()
    let pathIndex = pathArr[pathArr.length - 1]
    this.getDataIndex(pathIndex)
    if (this.$route.path.indexOf('orderManage') > -1) {
      this.findOrderList()
      this.getByOrderName()
      this.getComNameList()
    }
    /*orderManage.$on('test',(test)=>{
      console.log(test);
      this.orderData();
    })*/

  },
  computed: {
    ...mapState({
      token: function (state) {
        return state.user.token
      }
    }),
    ...mapState('searchStore', {
      spanLabel: function (state) {
        this.getDataIndex(state.spanLabel)
        // this.findOrderList()
        return state.spanLabel
      }
    })
  },
  watch: {
    // $route: {
    //   handler (newval, oldval) {
    //     this.initTable()
    //   },
    //   deep: true
    // }
    // spanLabel: {
    // handler (newval, oldval) {
    //   this.spanLabelData = newval
    //   if (newval === '待提交订单') {
    //     this.orderStatusIndex = -1
    //   } else if (newval === '待审核订单') {
    //     this.orderStatusIndex = 0
    //   }
    //   // if (newval !== '') {
    //   this.findOrderList()
    //   // }
    // },
    // deep: true
    // }
  }
}
</script>

<style scoped>
  .fromZ{
    background: #fff;
    padding-left: 10px;
    margin-bottom: 10px;
    border: 1px solid #edeff1;
    /*height: 110px;*/
  }
  .active_form{
    padding-top: 16px;
  }
  .tableDZ{
    padding: 10px;
    background: #fff;
    border: 1px solid #edeff1;
    margin-bottom: 20px;
  }
.oderContent {
  height: 100%;
}
.orderButton {
  text-align: left;
  width: 100%;
  margin-bottom: 0.2rem;
}
.paginationAnddeleteButton {
  margin-top: 0.2rem;
  height: 30px;
}
.deleteButton {
  text-align: left;
  margin-bottom: 0.2rem;
  float: left;
  width: 35%;
}
.pagination {
  text-align: right;
  width: 59%;
  float: right;
}
.userShow {
  position: absolute;
  left: 1rem;
  /* width:30%; */
  margin-top: 0.2rem;
  top: 9.6rem;
}
.el-checkbox {
  margin-right: 10px;
}
.el-input--small .el-input__inner {
  height: 20px;
  line-height: 20px;
}
  .tableDZ>>>.el-table th{
    /*padding: 0!important;*/
    color: #353535 !important;
    background-color: #EBF0FA !important;
  }
  .tableDZ>>>.el-table th{
    text-align: center !important;
  }
  .tableDZ>>>.el-table td{
    text-align: center !important;
  }
  .personCenter_right_t{
    height: 4vh;
    line-height: 2vh;
  }
  .personCenter_right_t img{
    height: 48%;
    width: 5px;
    margin-right: 7px;
    position: relative;
    top: -1px;
  }
  .personCenter_right_t span{
    display: inline-block;
    font-weight: bold;
  }
  .time_picke{
    /*width: 47%;*/
  }
  .time_picke>>>.el-range-editor--small{
    width: 26vw;
  }
  .time_form{
    /*width: 26%;*/
  }
  .time_form>>>.el-input--small{
    width: 12vw;
  }
  .time_picke>>>.el-form-item__content{
    /*width: 81%;*/
  }
  .colorindexTh{
    color: #3C6EF0;
  }
  .colorindexO{
    color: #FF504F;
  }
  .colorindexT{
    color: #1BBA70;
  }
  .elDialog_Aduti>>>.el-dialog__body{
    padding: 10px !important;
  }
  .FeedBackD>>>.el-dialog__body{
    padding: 10px 0 !important;
    border-top: 1px solid gainsboro;
  }
  .elDialog_Aduti>>>.el-dialog__header{
    padding: 10px !important;
  }
  .FeedBackD>>>.el-dialog__header{
    padding: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__headerbtn{
    top: 10px !important;
  }
  .FeedBackD>>>.el-dialog__headerbtn{
    top: 10px !important;
  }
  .elDialog_Aduti>>>.el-dialog__title {
    font-size: 15px !important;
    font-weight: bold !important;
  }
  .FeedBackD>>>.el-dialog__title {
    font-size: 15px !important;
    font-weight: bold !important;
  }
  .elDialog_Aduti>>>.el-dialog__footer {
    padding: 10px !important;
    text-align: center !important;
  }
  .FeedBackD>>>.el-dialog__footer {
    padding: 10px !important;
    text-align: right !important;
  }
  .el-button{
    border: 0px solid #DCDFE6
  }
  .infoContactd>>>.el-button--small, .el-button--small.is-round{
    padding: 8px 0;
  }
  .ftp_class div{
    display: inline-block;
    height: 30px;
    line-height: 30px;
    font-size: 16px;
  }
  .conton_con {
    width: 80%;
  }
  .title_name{
    width: 18%;
    margin-left: 2%;
  }
  .ftpDown{
    font-size: 14px;
    color: red;
    padding: 20px;
    display: inline-block;
  }
  .ftpDown_a{
    color: blue;
    cursor: pointer;
  }
  .iConfk{
    font-size: 19px;
    cursor: pointer;
    font-weight: bold;
    color: #321FDC;
    position: relative;
    top: 3px;
   }
  .FeedBack_content_span{
    width: 49%;
    display: inline-block;
    line-height: 30px;
  }
  .FeedBack_content_span span{
    display: inline-block;
  }
  .FeedBack_content_span_left{
    width: 27%;
    float: left;
  }
  .FeedBack_content_span_right{
    width: 71%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .FeedBack_content_notion{
    padding: 0 18px;
    border-bottom: 1px solid gainsboro;
  }
  .FeedBack_evaluate{
    font-size: 15px !important;
    padding: 10px;
    font-weight: bold !important;
    /* border-bottom: 1px solid gainsboro; */
    color: #6E6E6E;
    line-height: 30px;
  }
  .FeedBack_evaluate_left{
    line-height: 6vh;
    padding-left: 20px;
}
.FeedBack_evaluate_content{
  margin: 0 20px;
  border: 1px solid gainsboro;
  /*width: 50%;*/
  /*display: inline-block;*/
}
.FeedBack_evaluate_left_label{
  /*width: 25%;*/
  display: inline-block;
}
.FeedBack_evaluate_left_rate{
  /*width: 63%;*/
  display: inline-block;
  position: relative;
  top: -1px;
}
  .FeedBack_evaluate_right{
    /*width: 48%;*/
    padding: 10px 10px 0;
  }
  .FeedBack_evaluate_right_span{
    /*display: block;*/
    line-height: 6vh;
    font-size: 15px !important;
    /*padding: 5px 10px;*/
    font-weight: bold !important;
    /* border-bottom: 1px solid gainsboro; */
    color: #6E6E6E;
  }
  .FeedBack_evaluate_right_down{
    display: inline-block;
    line-height: 1vh;
    font-size: 13px;
    background: #FFB92A;
    color: #fff;
    padding: 8px;
    border-radius: 10px;
    cursor: pointer;
  }
  .FeedBack_evaluate_right_load{
    float: left;
    padding: 0 5%;
  }
  .FeedBack_evaluate_right_load_span{
    display: block;
    line-height: 27px;
    /* margin-right: 10px; */
    float: left;
    /*padding: 0 5%;*/
  }
  .FeedBack_evaluate_right_load_span span{
    display: inline-block;
     margin-right: 10px;
  }
  .FeedBack_evaluate_right_load_span i{
    cursor: pointer;
     display: inline-block;
     margin-right: 10px;
  }
  .FeedBack_evaluate_right_load_span i:hover{
     color: #3c6ef0;
  }
  .textareaC{
    width: 98%;
  }
  .textareaC_span{
    padding: 0 2%;
  }
  .spanbt{
    color: red;
    position: absolute;
    font-size: 30px;
    display: inline-block;
    margin-left: 7px;
    top: 14px;
    left: 72px;
  }
</style>
