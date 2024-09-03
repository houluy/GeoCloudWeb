<template>
  <div @mouseenter="updateXY" @mouseleave="updateXYOut" class="cy-result_hb" ref="cy-result_hb">
    <img class="resultImg" height="100" :title="this.resultImgFlag ? '收缩': '展开'"
         :src="this.resultImgFlag ? require('@/assets/images/search/arrowz21.png') : require('@/assets/images/search/arrowz22.png')"
         @click="handleMenu1">
    <div>
      <div class="resultTitle">
        <span @click="spanClickS('condition')" :class="{isactive: this.activeName === 'condition'}">数据查询</span>
        <span @click="spanClickS('result')" :class="{isactive: this.activeName === 'result'}">查询结果</span>
      </div>

      <div v-show="this.activeName === 'condition'" class="resultDivZH">
        <el-tabs style="background: #fff;border-radius: 8px;" @tab-click="handleClick" v-model="activeNameT">
          <!-- 查询条件 -->
          <el-tab-pane stretch="true" label="属性查询" class="conditionDiv" name="propertyQuery">
            <!--<div @mouseleave="updateStyle" class="cont" v-for="(item, index) in tables" :key="item.nodeId+index">-->
            <div @mouseleave="updateStyle" class="cont" v-for="(item, index) in tables" :key="item.nodeId+index+timeKey">
              <p class="conditionSpan">{{ item.alisaName }}</p>
              <div class="content">
                <div class="app" ref="app"></div>
              </div>
            </div>
            <div class="searchFunc">
              <el-button style="width: 80px;" type="primary" size="small" @click="searchFunc">查 询</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane style="color: #ccc !important;" disabled stretch="true" label="Excel查询" class="resultDiv"
                       name="ExcelQuery">
          </el-tab-pane>
        </el-tabs>
      </div>




      <div class="txnoif_bto" v-if="this.activeName === 'result'">
        <!--        // 没用-->
        <div style="padding: .3rem .2rem;" class="resultDZ">
          <el-checkbox v-if="!switchingNameFlag" v-model="checkedDataz" @change="checkedDataAll">全选</el-checkbox>
          <button v-if="daochuluotu" @click="deriveShopDateOnlyShp" style="background-color: #2E6DFC;color: white;">导出落图</button>
          <button class="resultButton" v-if="switchingNameFlag" @click="handleSwitching">
            {{ this.switchingName }}
          </button>
          <el-row style="display: inline-block;position: relative;bottom: -6px;" class="export">
            <el-col>
              <el-dropdown>
                <span><button slot="reference" class="resultButton" v-if="isDownload"><i
                  class="el-icon-download"></i>{{ this.nameDownLoad }}</button></span>
                <el-dropdown-menu slot="dropdown">
                  <button id="exportButton" @click="exportShp">工作程度图</button>
                  <br>
                  <button id="exportButtons" @click="handleExport">元数据表</button>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>

          <!--TODO: 地质云-加入购物车-->
          <button class="resultButton" v-if="shopCatShow" @click="handleAddShop">加入购物车</button>

        </div>
        <div class="resultDiv">
          <el-table
            id="archiveTable1"
            ref="singleTable"
            :data="tableData"
            :key="timeKey"
            class="tableLimit"
            size="small"
            style="width: 100%"
            :height="tableW"
            highlight-current-row
            @cell-mouse-enter="handleRowHover"
            @cell-mouse-leave="handleRowLeave"
            @cell-dblclick="handleShowDetail"
            @cell-click="handleChartlet">
            <!--             // 静态列-->
            <el-table-column prop="F_DATAID" width="30">
              <template slot="header" slot-scope="scope">
                <el-checkbox v-model="imageAllCheck" @change="currentPageAllSelect"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <div>
                  <!--每条数据前面的多选框-->
                  <el-checkbox :key="timeKey" @change="handleTableChange(scope.$index, scope.row)" v-if="scope.row.isShop == false"
                               v-model="scope.row.isSelect"></el-checkbox>
                  <img v-if="scope.row.isShop" src="@/assets/img/shopping.png" style="width: .4rem;"/>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="showMZ" prop="THUMB" label="拇指图" width="60" align="center">
              <template slot-scope="scope">
                <div style="cursor: pointer;">
                  <img :src="scope.row.imageurl" style="width: .9rem;">
                  <!--<img src="@/assets/img/zwtp.png" style="width: .6rem; height: .5rem;" />-->
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="OVERLY1" label="定位" width="45" align="center">
              <template slot-scope="scope">
                <div v-if="showDwY" style="cursor: pointer;" @click="handleLocation(scope.row)"><img
                  :src="scope.row.imageurlDQ" title="定位" width="18"/></div>
                <!-- <div v-if="showDwN" style="cursor: pointer;" @click="handleLocationN()"><img src="@/assets/img/images/地球灰.png" title="定位" width="18" /></div> -->
              </template>
            </el-table-column>
            <el-table-column v-if="showMZ" prop="OVERLY" label="贴图" width="50" align="center">
              <template slot-scope="scope">
                <img class="chartlet" :src="overlaySrcs" alt="" style="width: .4rem;cursor: pointer;"/>
              </template>
            </el-table-column>

            <!--            列表-->
            <el-table-column
              v-if="item.alisaName !== 'DSID' && item.alisaName !== 'DSID ' && item.alisaName !== 'objectid' && showCon.length > 0"
              sortable v-for="(item, index) in showCon" :key="index"
              style=" text-align: center; font-size:14px!important;" align="center" :prop="item.name.toUpperCase()"
              :label="item.alisaName" show-overflow-tooltip>
            </el-table-column>
            <!-- 动态列结束 -->
          </el-table>
          <!-- 查询结果分页 -->
          <div class="resultPagination pageInput">

            <el-pagination background style="float: right;" :current-page="currentPage"
                           :page-sizes="[30, 50, 100, 500,1000]" :page-size="pageSize" small
                           @current-change="handleCurrentChange" @size-change="handleSizeChange"
                           layout="total, prev, jumper, next, sizes"
                           :total="total">
            </el-pagination>
          </div>

        </div>
      </div>
    </div>
    <el-dialog :modal="false" title="确认订单" :visible="shopDialogVisible" width="43%" :before-close="handleClose">
      <el-form ref="rules" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="订单名称" prop="orderReference">
          <el-input v-model="ruleForm.orderReference" placeholder="请输入订单名称"></el-input>
        </el-form-item>
      </el-form>

    </el-dialog>
    <resultDetails @onChildByValue="childByValue" :paramRowimageData="this.paramRowimageData" :dialogShowData=dialogShowData :titleDialog=titleDialog
                   :paramRowData="paramRowData"/>
    <dialogShowDetail :dialogShowData=dialogShowData :titleDialog=titleDialog></dialogShowDetail>
    <dialogShowDetailForHP ref="dialogShowDetailForHP" :dialogShowData=dialogShowData :titleDialog=titleDialog @onChildByValue="childByValue"
                           :paramRowimageData="this.paramRowimageData" :paramRowData="paramRowData"/>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Stroke from 'ol/style/Stroke'
  import Fill from 'ol/style/Fill'
  import Style from 'ol/style/Style'
  import Circle from "ol/style/Circle"
  import vueComponent from '@comm/static/vueComponent.js'
  import http from '@comm/service/interface.js'
  import styles from '@/assets/css/global.scss'
  import {getToken, setToken} from '@comm/utils/auth'
  import {
    gisMap
  } from '@comm/map/map_globel.js'
  import {
    mapState,
    mapActions
  } from 'vuex'
  import resultDetails from './resultDetails'
  import dialogShowDetail from '@comm/components/dialogShowDetail.vue'
  import dialogShowDetailForHP from '@comm/components/dialogShowDetailForHP.vue'
  import XLSX from 'xlsx'
  import FileSaver from 'file-saver'
  import {export_json_to_excel} from '@comm/static/vendor/Export2Excel.js';

  String.prototype.myReplace=function(f,e){
    var reg = new RegExp(f,"g"); //创建正则RegExp对象
    return this.replace(reg,e);
  }
  // String.prototype.replace =function(f,e){
  //   var reg = new RegExp(f,"g"); //创建正则RegExp对象
  //   return this.replace(reg,e);
  // }
  export default {
    name: 'cy-result_hb',
    components: {
      resultDetails,
      dialogShowDetail,
      // satelliteDialogVisible,
      dialogShowDetailForHP
    },
    data() {
      return {
        timeKey: 0,
        titleDialog: '数据详情',
        dialogShowData: {},
        isNoWkt: 0,
        initDz: [],
        tokenZ: '',
        checkedDataz: false,
        switchingArrPoint: [],
        showMZ: true,
        disabledZ: false,
        buttonSelect: false,
        screenDataAll: [],
        AllTableDataArr: [],
        featureCurrent: false,
        activeNameT: 'propertyQuery',
        showtb1: true,
        showtb2: false,
        showtb3: false,
        showtb4: false,
        showtb5: false,
        showtb6: false,
        showtb7: false,
        showtb8: false,
        showtb9: false,
        showtb10: false,
        showtb11: false,
        showtb12: false,
        showtb13: false,
        showtb14: false,
        showtb15: false,
        showtb16: false,
        navListIndexValue: '航空磁力测量',
        switchingSelect: [],
        switchingNameFlag: false,
        daochuluotu: false,
        switchingName: '显示点选结果',
        switchingFlag: false,
        switchingArr: [],
        allTableData: [],
        switchingTableArr: [],
        showDwY: true,
        showDwN: false,
        imgDataMenuSrc1: require('@/assets/img/images/航空磁力测量.png'),
        imgDataMenuSrc2: require('@/assets/img/images/航空电磁测量.png'),
        imgDataMenuSrc3: require('@/assets/img/images/航空伽玛能谱测量.png'),
        imgDataMenuSrc4: require('@/assets/img/images/航空重力测量.png'),
        imgDataMenuSrc5: require('@/assets/img/images/物探科研.png'),
        imgDataMenuSrc6: require('@/assets/img/images/航空遥感测量.png'),
        imgDataMenuSrc7: require('@/assets/img/images/遥感科研.png'),
        imgDataMenuSrc8: require('@/assets/img/images/航空影像.png'),
        imgDataMenuSrc9: require('@/assets/img/images/1：25万航磁系列图件 .png'),
        imgDataMenuSrc10: require('@/assets/img/images/1：250万航磁系列图件 拷贝.png'),
        imgDataMenuSrc11: require('@/assets/img/images/遥感解译成果图件.png'),
        imgDataMenuSrc12: require('@/assets/img/images/高分一号.png'),
        imgDataMenuSrc13: require('@/assets/img/images/高分二号.png'),
        imgDataMenuSrc14: require('@/assets/img/images/资源02c.png'),
        imgDataMenuSrc15: require('@/assets/img/images/航片.png'),
        imgDataMenuSrc16: require('@/assets/img/images/测区.png'),
        nameDownLoad: '导出',
        isDownload: false,
        nodeShowId: '',
        tableW: 638,
        height: '',
        imgSrc: require('@/assets/img/rigth.png'),
        imgUrl: require('@/assets/img/left.png'),
        imgUrlT: require('@/assets/img/rigth.png'),
        nameAllSelect: '当前页全选',
        imageAllCheck: false,
        nameChartlet: '叠加',
        shopFlag: false,
        styles,
        menuShow: true,
        vueArr: [],
        // 查询全局对象
        queryObj: {},
        // 覆盖率弹窗
        guid: null,
        areaCode: '',
        pageSize: 30,
        currentPage: 1,
        total: 100,
        totalNum: 4,
        pageInput: 4,
        totalT: 0,
        shopCurrentPage: 1,
        shopPageSize: 6,
        shopTotal: 0,
        shopTableData: [],
        shopRecordsData: [],
        addZLshopShow: false,
        tableName: {},
        showCon: {},
        // 地质图查询结果列表的字段设置
        DiZhiTu: ['旧图幅号', '新图幅号', '分辨率'],
        GWCG46: ['采集时间', '卫星名称', '传感器'],
        KaiYuan: ['数据名称', '采集时间'],
        WuXing: ['项目名称', '岩性', '测量时间'],
        showPx: {},
        tableData: [],
        tableDataT: [],
        dataIdStr: '',
        shopId: '',
        dataId: '',
        ruleForm: {
          orderReference: ''
        },
        rules: {
          orderReference: [{
            required: true,
            message: '请输入订单名称',
            trigger: 'blur'
          },
            {
              min: 3,
              max: 8,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ]
        },
        shopDialogVisible: false,
        xqDialogVisible: false,
        resultImgFlag: true,
        // 贴图默认
        isOverlay: false,
        overlaySrcs: require('@/assets/img/tietu_close.png'),
        overlayNoSrc: require('@/assets/img/tietu_open.png'),
        overLayImg: require('@/assets/img/zy302a_mux_015524_005124_20190317112435_01_sec_0004_1904027580_pre.png'),
        obj: {},
        overLayKUrlImg: 'http://10.82.8.57:9527/metaImage/GF2/2019/11/13/1194923599613145089/1194923599613145089_quick.jpg',
        overLayMUrlImg: 'http://10.82.8.57:9527/metaImage/GF2/2019/11/13/1194923599613145089/1194923599613145089_thumb.jpg',
        overLayTUrlImg: 'http://10.82.8.57:9527/metaImage/GF2/2019/11/13/1194923599613145089/1194923599613145089_shape.jpg',
        paramRowData: {
          alias: '',
          description: ''
        },
        satelliteParamRowData: {},
        paramRowimageData: '',
        fullscreenLoading: false,
        currentStyle: [],
        imgbesa: [],
        imgbesahc: [],
        imgbesahd: [],
        imgbesahf: [],
        imgbesahy: [],
        imgcolor: [
          {
            type: 'hc',
            blc: '1:5,000',
            colors: 'rgba(153,0,204,0.5)' // 紫色
          },
          {
            type: 'hc',
            blc: '1:10,000',
            colors: 'rgba(255,0,255,0.5)' //
          },
          {
            type: 'hc',
            blc: '1:20,000',
            colors: 'rgba(255,0,255,0.5)' //
          },
          {
            type: 'hc',
            blc: '1:25,000',
            colors: 'rgba(255,128,128,0.5)' // 粉红
          },
          {
            type: 'hc',
            blc: '1:35,000',
            colors: 'rgba(228,109,10,0.5)' // 粉红
          },
          {
            type: 'hc',
            blc: '1:50,000',
            colors: 'rgba(255,0,0,0.5)' // 红粉
          },
          {
            type: 'hc',
            blc: '1:100,000',
            colors: 'rgba(255,255,0,0.5)' // 黄色
          },
          {
            type: 'hc',
            blc: '1:200,000',
            colors: 'rgba(0,255,0,0.5)' // 叶绿
          },
          {
            type: 'hc',
            blc: '1:250,000',
            colors: 'rgba(0,128,0,0.5)' // 叶绿
          },
          {
            type: 'hc',
            blc: '1:500,000',
            colors: 'rgba(0,255,255,0.5)' // 叶绿
          },
          {
            type: 'hc',
            blc: '1:1,000,000',
            colors: 'rgba(0,0,255,0.5)' // 叶绿
          },
          {
            type: 'hd',
            blc: '1:5,000',
            colors: 'rgba(153,0,204,0.5)'
          },
          {
            type: 'hd',
            blc: '1:10,000',
            colors: 'rgba(255,0,255,0.5)'
          },
          {
            type: 'hd',
            blc: '1:25,000',
            colors: 'rgba(255,128,128,0.5)'
          },
          {
            type: 'hd',
            blc: '1:50,000',
            colors: 'rgba(255,0,0,0.5)'
          },
          {
            type: 'hd',
            blc: '1:100,000',
            colors: 'rgba(255,255,0,0.5)'
          },
          {
            type: 'hd',
            blc: '1:500,000',
            colors: 'rgba(0,255,255,0.5)'
          },

          {
            type: 'hf',
            blc: '1:10,000',
            colors: 'rgba(255,0,255,0.5)'
          },
          {
            type: 'hf',
            blc: '1:25,000',
            colors: 'rgba(255,128,128,0.5)'
          },
          {
            type: 'hf',
            blc: '1:35,000',
            colors: 'rgba(228,109,10,0.5)'
          },
          {
            type: 'hf',
            blc: '1:50,000',
            colors: 'rgba(255,0,0,0.5)'
          },
          {
            type: 'hf',
            blc: '1:100,000',
            colors: 'rgba(255,255,0,0.5)'
          },
          {
            type: 'hf',
            blc: '1:200,000',
            colors: 'rgba(0,255,0,0.5)'
          },
          {
            type: 'hf',
            blc: '1:500,000',
            colors: 'rgba(0,255,255,0.5)'
          },

          {
            type: 'hy',
            blc: '1:2,000',
            colors: 'rgba(128,100,162,0.5)'
          },
          {
            type: 'hy',
            blc: '1:5,000',
            colors: 'rgba(153,0,204,0.5)'
          },
          {
            type: 'hy',
            blc: '1:7,500',
            colors: 'rgba(153,153,255,0.5)'
          },
          {
            type: 'hy',
            blc: '1:8,000',
            colors: 'rgba(153,51,255,0.5)'
          },
          {
            type: 'hy',
            blc: '1:10,000',
            colors: 'rgba(255,0,255,0.5)'
          },
          {
            type: 'hy',
            blc: '1:12,000',
            colors: 'rgba(204,0,204,0.5)'
          },
          {
            type: 'hy',
            blc: '1:14,000',
            colors: 'rgba(231,157,212,0.5)'
          },
          {
            type: 'hy',
            blc: '1:15,000',
            colors: 'rgba(160,8,19,0.5)'
          },
          {
            type: 'hy',
            blc: '1:16,000',
            colors: 'rgba(251,71,71,0.5)'
          },
          {
            type: 'hy',
            blc: '1:17,000',
            colors: 'rgba(253,157,103,0.5)'
          },
          {
            type: 'hy',
            blc: '1:18,000',
            colors: 'rgba(253,161,181,0.5)'
          },
          {
            type: 'hy',
            blc: '1:20,000',
            colors: 'rgba(255,0,255,0.5)'
          },
          {
            type: 'hy',
            blc: '1:20,600',
            colors: 'rgba(204,0,153,0.5)'
          },
          {
            type: 'hy',
            blc: '1:21,000',
            colors: 'rgba(255,80,80,0.5)'
          },
          {
            type: 'hy',
            blc: '1:22,000',
            colors: 'rgba(204,102,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:23,000',
            colors: 'rgba(217,151,149,0.5)'
          },
          {
            type: 'hy',
            blc: '1:24,000',
            colors: 'rgba(192,80,77,0.5)'
          },
          {
            type: 'hy',
            blc: '1:25,000',
            colors: 'rgba(255,128,128,0.5)'
          },
          {
            type: 'hy',
            blc: '1:30,000',
            colors: 'rgba(253,233,217,0.5)'
          },
          {
            type: 'hy',
            blc: '1:32,000',
            colors: 'rgba(250,192,144,0.5)'
          },
          {
            type: 'hy',
            blc: '1:35,000',
            colors: 'rgba(228,109,10,0.5)'
          },
          {
            type: 'hy',
            blc: '1:36,000',
            colors: 'rgba(255,204,204,0.5)'
          },
          {
            type: 'hy',
            blc: '1:40,000',
            colors: 'rgba(255,102,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:45,000',
            colors: 'rgba(204,0,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:50,000',
            colors: 'rgba(255,0,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:55,000',
            colors: 'rgba(247,225,129,0.5)'
          },
          {
            type: 'hy',
            blc: '1:56,000',
            colors: 'rgba(225,183,5,0.5)'
          },
          {
            type: 'hy',
            blc: '1:60,000',
            colors: 'rgba(255,192,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:65,000',
            colors: 'rgba(255,255,153,0.5)'
          },
          {
            type: 'hy',
            blc: '1:67,000',
            colors: 'rgba(204,255,153,0.5)'
          },
          {
            type: 'hy',
            blc: '1:92,000',
            colors: 'rgba(204,204,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:100,000',
            colors: 'rgba(255,255,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:200,000',
            colors: 'rgba(0,255,0,0.5)'
          },
          {
            type: 'hy',
            blc: '1:250,000',
            colors: 'rgba(0,128,0,0.5)'
          },
          {
            type: 'wtky',
            blc: ' ',
            colors: 'rgba(185,217,255,0.5)'
          },
          {
            type: 'ygky',
            blc: ' ',
            colors: 'rgba(185,217,255,0.5)'
          },
          {
            blc: ' ',
            colors: 'rgba(0,0,255,0.5)' // 蓝色
          },
          {
            type: 'wxyx',
            blc: 'wxyx',
            colors: 'rgba(30,144,255,0.5)' // 卫星影像合并面的颜色
          },
          {
            type: 'bzcp',
            blc: 'bzcp',
            colors: 'rgba(88,231,218, 0.5)' // 卫星影像合并面的颜色
          }
        ],
        allStatus: [
          'hc5000',
          'hc10000',
          'hc20000',
          'hc25000',
          'hc35000',
          'hc50000',
          'hc100000',
          'hc200000',
          'hc250000',
          'hc500000',
          'hc1000000',
          'hd5000',
          'hd10000',
          'hd25000',
          'hd50000',
          'hd100000',
          'hd500000',
          'hf10000',
          'hf25000',
          'hf35000',
          'hf50000',
          'hf100000',
          'hf200000',
          'hf500000',
          'wtky',
          'ygky',
          'hy2000',
          'hy5000',
          'hy7500',
          'hy8000',
          'hy10000',
          'hy12000',
          'hy14000',
          'hy15000',
          'hy16000',
          'hy17000',
          'hy18000',
          'hy20000',
          'hy20600',
          'hy21000',
          'hy22000',
          'hy23000',
          'hy24000',
          'hy25000',
          'hy30000',
          'hy32000',
          'hy35000',
          'hy36000',
          'hy40000',
          'hy45000',
          'hy50000',
          'hy55000',
          'hy56000',
          'hy60000',
          'hy65000',
          'hy67000',
          'hy92000',
          'hy100000',
          'hy200000',
          'hy25000'
        ],
        clientHeight: '',
        allcheckvalue: []
      }
    },
    mounted() {
      localStorage.setItem('checkedValue', true)
      this.tokenZ = sessionStorage.getItem('token')
      this.clientHeight = `${document.documentElement.clientHeight}` // 获取浏览器可视区域高度
      this.init(this.clientHeight)
      this.initCanvas()
      if (this.navHide) {
        this.height = (document.documentElement.clientHeight - 125) / 50 + 'rem'
      } else {
        this.height = (document.documentElement.clientHeight - 230) / 50 + 'rem'
      }
      setTimeout(() => {
        var userName = localStorage.getItem('userName')
        if (userName) {
          this.shopInitTable()
          this.shopFlag = true
        }
      }, 500)
    },
    methods: {
      handle() {
        system('执行测试')
      },
      // 查询数据-数据覆盖面导出
      deriveShopDateOnlyShp() {
        let times = 'Loading'
        const loading = this.$loading({
          lock: true,
          text: times,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.wktlistData = []
        let ListWkt = []
        let ListDataName = []
        let ListSatellite = []
        let ListSensor = []
        let wktlistAdd = []
        let dids = []
        let nodeIds = []
        let dataIds = []

        if (this.buttonSelect) {
          if (this.screenDataAll.length > 0) {
            wktlistAdd = this.screenDataAll
          } else if(this.switchingSelect.length > 0 && this.imageAllCheck === true) {
            wktlistAdd = this.tableData
          }
        }
        else {
          if(this.checkedDataz === true){
            if (this.AllTableDataArr.length > 0) {
              wktlistAdd = this.AllTableDataArr
            }
          }else{
            wktlistAdd = this.tableData
          }
          // if (this.AllTableDataArr.length > 0) {
          //   wktlistAdd = this.AllTableDataArr
          // } else {
          //   wktlistAdd = this.tableData
          // }
        }
        if (wktlistAdd.length > 0) {
          wktlistAdd.forEach(item => {
            if (item.isSelect) {
              dataIds.push(item.F_DID)
              ListWkt.push(item.WKTRESPONSE)
              ListDataName.push(item.F_DATANAME)
              ListSatellite.push(item.F_SATELLITEID)
              ListSensor.push(item.F_SENSORID)
              dids.push(item.F_DID.toString())
              nodeIds.push(item.NODEID)
              this.wktlistData.push({
                F_DATANAME: item.F_DATANAME,
                F_WKT: item.WKTRESPONSE,
                F_SATELLITEID: item.F_SATELLITEID,
                F_SENSORID: item.F_SENSORID
              })
            }
          })
          if (this.wktlistData.length > 0) {
            times = this.getTimes(parseInt(this.wktlistData.length / 2))
            this.temptimeChange = parseInt(this.wktlistData.length / 2)
            document.getElementsByClassName('el-loading-text')[0].innerHTML = '导出剩余时间大概为：' + times
            this.$confirm('导出所需时间大概' + times + '是否继续导出?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.tiemsFun = setInterval(() => {
                let timeChange = ''
                this.temptimeChange = this.temptimeChange - 60
                console.log(this.temptimeChange, 'this.temptimeChange')
                if (this.temptimeChange < 60) {
                  timeChange = '导出即将完成！'
                } else {
                  // timeChange = '导出剩余时间大概为：' + this.temptimeChange
                  timeChange = '导出剩余时间大概为：' + this.getTimes(this.temptimeChange)
                }
                document.getElementsByClassName('el-loading-text')[0].innerHTML = timeChange
              }, 60000)
              // 内网只导出 shp 不用导出快视图，所以typeid为4 this.tieImg=true时是内网环境vc =======
              let typeId = '3'
              this.tieImg ? typeId = '4' : typeId = '3'
              // =================================================================================
              http.getderiveShopDateOnlyShpByNew({
                data:
                  {
                    wktlist: ListWkt,
                    listDataName: ListDataName,
                    satelites: ListSatellite,
                    sensors: ListSensor,
                    dataIds: dataIds,
                    dids: dids,
                    nodeIds: nodeIds,
                    typeId: typeId
                  }
              }).then(res => {
                loading.close()
                if (this.tiemsFun) {
                  clearInterval(this.tiemsFun)
                }
                if (res.data) {
                  console.log(res, 'res')
                  window.open(res.data, '_blank')
                }
              })
            }).catch(() => {
              loading.close()
              this.$message({
                message: '已取消导出！',
                type: 'warning'
              })
            })
          } else {
            loading.close()
            this.$message({
              message: '请选择数据！',
              type: 'warning'
            })
          }
        } else {
          loading.close()
          this.$message({
            message: '请先查询数据！',
            type: 'warning'
          })
        }
      },
      getTimes(times) {
        if (times <= 60) {
          times = times + '秒'
        } else {
          times = parseInt(times / 60)
          if (times <= 60) {
            times = times + '分钟'
          } else {
            times = parseInt(times / 60)
            if (times <= 24) {
              times = times + '小时'
            } else {
              times = '超过一天！'
            }
          }
        }
        return times
      },
      checkedDataAll(val) {
        // 清空当前点选数据所有勾选
        this.switchingSelect = []
        let dataALL = []
        // 筛选数据和全部数据的区分 this.buttonSelect = true 是筛选数据 否则就是  全部数据
        if (this.buttonSelect) {
          dataALL = this.screenDataAll
        } else {
          dataALL = this.AllTableDataArr
        }
        if (this.checkedDataz) {
          this.tableData.map(item => {
            item.isSelect = true
            if (this.switchingName === '显示全部结果') {
              this.switchingSelect.push(item.F_DATAID.toString())
            }
          })
          this.AllTableDataArr.map(item => {
            item.isSelect = true
            if (this.switchingName === '显示全部结果') {
              this.switchingSelect.push(item.F_DATAID.toString())
            }
          })
          this.imageAllCheck = true
        } else {
          this.tableData.map(item => {
            if (item.isSelect) {
              item.isSelect = false
            }
          })
          this.AllTableDataArr.map(item => {
            if (item.isSelect) {
              item.isSelect = false
            }
          })
          this.imageAllCheck = false
        }
      },
      init(val) {
        if (this.navHide) {
          this.height = (val - 125) / 50 + 'rem'
        } else {
          this.height = (val - 230) / 50 + 'rem'
        }
      },
      updateXY() {
        if (this.showPXFlag) {
          // document.body.style.cursor = 'auto'
        }
      },
      updateStyle() {
        let dome = document.getElementsByClassName('el-tooltip__popper')
        if (dome) {
          for (let i = 0; i < dome.length; i++) {
            dome[i].style.display = 'none'
          }
        }
      },
      updateXYOut() {
        this.updateStyle()
      },
      spanClickS(val) {
        this.setActiveName(val)
      },
      handleClick(val) {
        if (val.name === 'propertyQuery') {
          document.getElementsByClassName('el-tabs__active-bar')[0].style.left = '15%'
        } else {
          this.setCode('')
          this.setWkt('')
          this.setname('行政区划')
          gisMap.clearAll()
          document.getElementsByClassName('el-tabs__active-bar')[0].style.left = '45%'
        }
      },

      // 单选某条数据
      handleTableChange(index, val) {
        // 获取当前按钮的位置，位于滚动条的位置
        const scrollTop=this.$refs.singleTable.bodyWrapper.scrollTop

        if(this.nodeId === '1000310'){
          this.switchingSelect = []
          this.tableData.forEach(item => {
            if (item.isSelect) {
              this.switchingSelect.push(item.F_DID.toString())
              // item.isSelect = true
              this.$set(this.tableData, index, val)
            } else {
              if (this.switchingSelect.indexOf(item.F_DID.toString()) > -1) {
                let index = this.switchingSelect.indexOf(item.F_DID.toString())
                this.switchingSelect.splice(index, 1)
              }
              this.$set(this.tableData, index, val)
            }
          })
          this.timeKey = new Date().getTime()
        }else{
          this.switchingSelect = []
          this.tableData.forEach(item => {
            if (item.isSelect) {
              this.switchingSelect.push(item.F_DATAID.toString())
              // item.isSelect = true
              this.$set(this.tableData, index, val)
            } else {
              if (this.switchingSelect.indexOf(item.F_DATAID.toString()) > -1) {
                let index = this.switchingSelect.indexOf(item.F_DATAID.toString())
                this.switchingSelect.splice(index, 1)
              }
              this.$set(this.tableData, index, val)
            }
          })
          this.timeKey = new Date().getTime()
        }
        if(scrollTop){
          this.$nextTick(() => {
            setTimeout(() => {
              // 设置滚动条的位置
              this.$refs.singleTable.bodyWrapper.scrollTop = scrollTop
            }, 100) // 需要设置延迟，否则无效
          })
        }
      },
      handleSwitchingT() {
        let _this = this
        _this.switchingFlag = !_this.switchingFlag
        if (_this.switchingFlag) {
          _this.switchingName = '显示点选结果'
          this.tableData = this.tableDataT
          this.total = this.totalT
        } else {
          _this.switchingName = '显示全部结果'
          this.tableData = this.tabelPopdata
          this.total = this.tabelPopdata.length
        }
      },
      handleSwitching() {
        let _this = this
        if (_this.switchingFlag) {
          _this.switchingArr = _this.tableDataT
          if (_this.switchingArrPoint.length > 0) {
            _this.switchingName = '显示全部结果'
            let arr = []
            _this.switchingTableArr.forEach(item => {
              _this.switchingArr.forEach(d => {
                if (d.F_DATAID === item.F_DATAID) {
                  item.isSelect = d.isSelect
                }
              })
            })
            _this.tableData = _this.switchingArrPoint
            _this.total = _this.switchingArrPoint.length
          } else {
            return false
          }
        } else {
          _this.switchingName = '显示点选结果'
          // _this.tableData = _this.switchingArr
          _this.tableData = _this.tableDataT
          _this.total = _this.totalT
        }
        _this.switchingFlag = !_this.switchingFlag
      },
      childByValue(val) {
        this.xqDialogVisible = val
        // this.setActiveName('shopCar')
        this.shopInitTable()
      },
      handleMenu1() {
        this.resultImgFlag = !this.resultImgFlag
        this.$refs['cy-result_hb'].style.right = this.resultImgFlag ? '0rem' : '-26vw'
        document.getElementById('tools').style.right = this.resultImgFlag ? '26.2vw' : '.2vw'
        document.getElementById('mapDiv_coordinate').style.right = this.resultImgFlag ? '26.6vw' : '.6vw'
        if (this.menuShow) {
          this.imgSrc = this.imgUrl
        } else {
          this.imgSrc = this.imgUrlT
        }
        this.menuShow = !this.menuShow
      },
      // validateImage(pathImg) { ////判断图片地址是否有效
      //   // let ImgObj = new Image();
      //   //   ImgObj.src = pathImg;
      //   var xmlHttp;
      //   if (window.ActiveXObject) {
      //     xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
      //   } else if (window.XMLHttpRequest) {
      //     xmlHttp = new XMLHttpRequest();
      //   }
      //   xmlHttp.open("Get", pathImg, false);
      //   xmlHttp.send();
      //
      //   if (xmlHttp.response.indexOf('1001') === -1) {
      //     return pathImg
      //   } else {
      //     return require('@/assets/img/zwtp.png');
      //   }
      // },
      validateImage(pathImg) { /// /判断图片地址是否有效
        var xmlHttp
        if (window.ActiveXObject) {
          xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
        } else if (window.XMLHttpRequest) {
          xmlHttp = new XMLHttpRequest()
        }
        xmlHttp.open('Get', pathImg, false)
        xmlHttp.send()
        if (xmlHttp.response.indexOf('1001') === -1) {
          return pathImg
        } else {
          return require('@/assets/img/zwtp.png')
        }
      },
      // 展是结果例详情
      // getXqIfon (row) {
      //   let _this = this
      //   if (_this.tableShow && _this.nodeId !== '10152' && _this.nodeId !== '10153' && _this.nodeId !== '10151') {
      //     this.paramRowData = {}
      //     var newrow = { ...row
      //     }
      //     delete newrow.F_CENTERTIME,
      //     delete newrow.F_DATAID,
      //     delete newrow.CENTERTIME,
      //     delete newrow.RECEIVE_TIME,
      //     delete newrow.WKTRESPONSE,
      //     delete newrow.结束日期,
      //     delete newrow.起始日期,
      //     delete newrow.航摄开始时间,
      //     delete newrow.航摄结束时间,
      //     delete newrow.制图日期,
      //     delete newrow.采集时间
      //     this.paramRowData = newrow
      //     this.setDialogShow(1)
      //     console.log(_this.paramRowData, 'paramRowData')
      //   } else {
      //     http.getAgrsObjectById({
      //       label: _this.nodeLabel,
      //       dataId: row.F_DATAID,
      //       did: row.F_DATAID,
      //       nodeId: _this.nodeId
      //     }).then(res => {
      //       if (res.data) {
      //         if (_this.nodeId === '10141') {
      //           res.data[0].titleValue = '详细信息-1:25万航磁系列图件'
      //         } else if (_this.nodeId === '10142') {
      //           res.data[0].titleValue = '详细信息-1:250万航磁系列图件'
      //         } else if (_this.nodeId = '10143') {
      //           res.data[0].titleValue = '详细信息-遥感解译成果图件'
      //         } else {
      //           res.data[0].titleValue = '详细信息'
      //         }
      //         if (_this.nodeId === '10152' || _this.nodeId === '10153' || _this.nodeId === '10151' || _this.nodeId === '10141' || _this.nodeId === '10142' || _this.nodeId === '10143'|| _this.nodeId === '11311'|| _this.nodeId === '10141') {
      //           // _this.satelliteParamRowData = { ...res.data[0]}
      //           for (var d in _this.paramRowData) {
      //             if (d === '接收时间') {
      //               _this.paramRowData[d] = _this.commonMethod.timestampToTime(_this.paramRowData[d])
      //             }
      //           }
      //           if (_this.nodeId === '10141' || _this.nodeId === '10142' || _this.nodeId === '10143' || _this.nodeId === '11311') {
      //             _this.satelliteParamRowData = '/mj/metaImage/getImageByTypeForAll?typeId=2&nodeId='+_this.nodeId+'&dataId=' + row.F_DATAID
      //           }else{
      //             _this.paramRowimageData = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + row.DATAID
      //           }
      //         }
      //       } else {
      //         _this.$notify({
      //           message: '暂无影像详情！',
      //           position: 'bottom-right',
      //           duration: 3500,
      //           type: 'warning'
      //         })
      //       }
      //     })
      //   }
      // if (_this.nodeId === '10152' || _this.nodeId === '10153' || _this.nodeId === '10151') {
      //   _this.satelliteParamRowData = row
      //   _this.setDialogShow(2)
      // } else {
      //     _this.paramRowData = row
      //     _this.setDialogShow(1)
      // }
      // },
      // 导出shp
      exportShp () {
        let _this = this
        let objList = []
        _this.tableData.forEach(item => {
          if (item.isSelect) {
            objList.push(item)
          }
        })
        if (objList.length > 0) {
          // 导出提示
          _this.$notify.closeAll()
          _this.$notify({
            message: '导出中...',
            position: 'bottom-right',
          })
          http.getExportShpWidthAttributes({
            list: objList,
            nodeId: _this.nodeId
          }).then(res => {
            let content = res
            // 组装a标签
            let elink = document.createElement('a')
            //  获取时间戳
            let timestamp = new Date().getTime()
            // 设置下载文件名
            elink.download = timestamp + '.zip'
            elink.style.display = 'none'
            let blob = new Blob([content], {
              type: 'application/x-download'
            })
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            document.body.removeChild(elink)
          })
        } else {
          this.$notify({
            message: '请选择导出数据！',
            position: 'bottom-right',
            duration: 200,
            type: 'warning'
          })
        }
      },
      tableToExcel() {
        var wb = XLSX.utils.table_to_book(document.querySelector('#archiveTable1'))
        /* get binary string as output */
        var wbout = XLSX.write(wb, {bookType: 'csv', bookSST: true, type: 'array'})
        try {
          FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), '源数据表.csv')
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout)
          }
        }
        return wbout
      },
      //导出csv
      handleExport() {
        let _this = this
        let objList = []
        _this.tableData.forEach(item => {
          if (item.isSelect) {
            objList.push(item)
          }
        })
        if (objList.length > 0) {
          //导出
          require.ensure([], () => {
            let _this = this
            let tableHeader = []
            _this.showCon.forEach(item => {
              if (item.alisaName) {
                tableHeader.push(item.alisaName)
              }
            })
            let filterVal = []
            _this.showCon.forEach(item => {
              if (item.name) {
                filterVal.push(item.name)
              }
            })
            let list = objList
            let data = this.formatJson(filterVal, list);
            export_json_to_excel(tableHeader, data, '元数据')
          }).catch(() => { });
        }else {
          this.$notify({
            message: '请选择导出数据！',
            position: 'bottom-right',
            duration: 200,
            type: 'warning'
          })
        }
      },
      formatJson (filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      //导出数据前对数据处理
      filterTableData(data) {
        data.forEach(item => {
          item.applyDate = shortTime(item.applyDate)   // 将导出的时间转换成'YYYY-MM-DD'格式
          item.workAge = item.workAge + '年'
        })
        return data;
      },
      // 双击显示详情
      handleShowDetail(row) {
        // alert("双击显示详情")
        let _this = this
        if (_this.nodeId === '10141' || _this.nodeId === '10142' || _this.nodeId === '10143' || _this.nodeId === '11311'
          || _this.nodeId === '1000310' || _this.nodeId === '1000344' || _this.nodeId === '1000345' || _this.nodeId === '1000346'
          || _this.nodeId === '1000347' || _this.nodeId === '1000348' || _this.nodeId === '1000349' || _this.nodeId === '1000350'
          || _this.nodeId === '1000351' || _this.nodeId === '1000352' || _this.nodeId === '1000353' || _this.nodeId === '1000356'
          || _this.nodeId === '1000357' || _this.nodeId === '1000358' || _this.nodeId === '1000359' || _this.nodeId === '1000360'
          || _this.nodeId === '1000361' || _this.nodeId === '1000362' || _this.nodeId === '1000355'
        ) {
          if(_this.nodeId === '11311'){
            _this.$refs.dialogShowDetailForHP.detailShowW(1, row)
          }else {
            _this.setDialogShowDataZ(row)
            _this.setDetailShow(1)
          }
        } else {
          _this.paramRowData = row
          _this.setDialogShow(1)
        }
      },
      // 点击定位
      handleLocation(row) {
        let wkt
        /*if(row.nodeId ==='11311'|| row.nodeId ==='11312'){*/
        wkt= row.WKTRESPONSE.myReplace(' 0.0', '')
        /*}else{
        wkt = row.WKTRESPONSE
      }*/
        if (wkt === 'POLYGON((-280.999721527 -89.9999999999999,-281 -89.9999999999999,-281 -89.999721527,-280.999721527 -89.999721527,-280.999721527 -89.9999999999999))' || wkt ===
          'MULTIPOLYGON(((-280.999721527 -89.9999999999999,-281 -89.9999999999999,-281 -89.999721527,-280.999721527 -89.999721527,-280.999721527 -89.9999999999999)))') {
          this.$notify({
            message: '无空间信息',
            position: 'bottom-right',
            duration: 3500,
            type: 'warning'
          })
        } else {
          gisMap.flyTo(gisMap.transformFeatureFromWkt(wkt))
        }
      },
      handleLocationN() {
        this.$notify({
          message: '无空间信息',
          position: 'bottom-right',
          duration: 3500,
          type: 'warning'
        })
      },
      // 鼠标移入当前行，地图合并面高亮显示
      handleRowHover(row, column, event) {
        this.nodeShowId =row.F_DATAID
        gisMap.productTableHoverRemove(this.nodeShowId)
        let wkt
        // gisMap.clearAll()
        if(row.NODEID === '11311'|| row.NODEID === '11312') {
          // 响应的wkt串
          wkt = row.WKTRESPONSE.myReplace(' 0.0', '')
          //gisMap.drawSource.clear();
          var style = new Style({
            //把点的样式换成ICON图标
            fill: new Fill({
              //填充颜色
              color: 'rgb(239,6,33)'
            }),
            //图形样式，主要适用于点样式
            image: new Circle({
              //半径大小
              radius: 3,
              //填充
              fill: new Fill({
                //填充颜色
                color: '#00FF00'
              })
            }),
            //层
            zIndex: 20
          })

          //转wkt为feature
          var featureTemp = gisMap.transformFeatureFromWkt(wkt);
          //应用样式
          featureTemp.setStyle(style);
          featureTemp.attributes = 'productTable_hover';
          //添加到图层
          gisMap.featuresSource.addFeature(featureTemp);

        }
        else{
          wkt = row.WKTRESPONSE
        }
        let feature = {
          'attributes': {
            'productTable_hover': ''
          },
          'style': {
            fillcolor: 'rgba(0,255,0,0)',
            strokecolor: '#00FF00',
            strokewidth: 5
          },
          'geometry': wkt
        }
        gisMap.addPoint(feature)

      },
      // 鼠标移出当前行，地图合并面取消高亮显示
      handleRowLeave(row, column, event) {
        // alert("123")
        // alert(row.RN)
        let wkt
        // gisMap.clearAll()
        if(row.NODEID === '11311'|| row.NODEID === '11312') {
          // 响应的wkt串
          wkt = row.WKTRESPONSE.myReplace(' 0.0', '')


          //gisMap.drawSource.clear();
          var style = new Style({
            //把点的样式换成ICON图标
            fill: new Fill({
              //填充颜色
              color: 'rgb(6,18,239)'
            }),
            //图形样式，主要适用于点样式
            image: new Circle({
              //半径大小
              radius: 3,
              //填充
              fill: new Fill({
                //填充颜色
                color: '#0009e8'
              })
            }),
            //层
            zIndex: 20
          })

          //转wkt为feature
          var featureTemp = gisMap.transformFeatureFromWkt(wkt);
          //应用样式
          featureTemp.setStyle(style);
          featureTemp.attributes = 'productTable_leav';
          //添加到图层
          gisMap.featuresSource.addFeature(featureTemp);


          gisMap.productTableHoverRemove(this.nodeShowId)
        }
      },
      // 全选当前页
      currentPageAllSelect() {
        /* this.switchingSelect = []
       if (this.nameAllSelect === '当前页全选') {
         this.nameAllSelect = '当前页反选'
         this.tableData.map(item => {
           item.isSelect = true
           if (this.switchingName === '显示全部结果') {
             this.switchingSelect.push(item.F_ID.toString())
           }
         })
       } else if (this.nameAllSelect === '当前页反选') {
         this.nameAllSelect = '当前页全选'
         this.tableData.map(item => {
           if (item.isSelect) {
             item.isSelect = false
           // } else {
           //   item.isSelect = true
           }
         })
       }
     },*/
        // 清空当前点选数据所有勾选
        if(this.nodeId === '1000310'){
          this.switchingSelect = []
          if (this.imageAllCheck) {
            this.tableData.map(item => {
              item.isSelect = true
              if (this.switchingName === '显示全部结果') {
                this.switchingSelect.push(item.F_DID.toString())
              }
            })
          } else {
            this.tableData.map(item => {
              if (item.isSelect) {
                item.isSelect = false
              }
            })
          }
          this.timeKey = new Date().getTime()
        }else{
          this.switchingSelect = []
          if (this.imageAllCheck) {
            this.tableData.map(item => {
              item.isSelect = true
              if (this.switchingName === '显示全部结果') {
                this.switchingSelect.push(item.F_DATAID.toString())
              }
            })
          } else {
            this.tableData.map(item => {
              if (item.isSelect) {
                item.isSelect = false
                // } else {
                //   item.isSelect = true
              }
            })
          }
          this.timeKey = new Date().getTime()
        }
      },
      // 当前页贴图
      currentPageChartlet() {
        this.resetChartlet()
        let imgChartlet = document.getElementsByClassName('chartlet')
        if (this.nameChartlet === '叠加') {
          this.nameChartlet = '取消叠加'
          for (let i = 0, len = imgChartlet.length; i < len; i++) {
            let feature = {}
            let fId = ''
            if (i < this.tableData.length) {
              feature = {
                imagesrc: '/mj/metaImage/getImageByTypeForAll?typeId=3&dataId=' + this.tableData[i].DATAID,
                // imagesrc: this.overLayTUrlImg,
                geometry: this.tableData[i].WKTRESPONSE
              }
              fId = this.tableData[i].F_DATAID
            }
            imgChartlet[i].src = this.overlayNoSrc
            if (i < this.tableData.length) {
              gisMap.toggleStaticImage(true, feature, fId)
            }
          }
        } else if (this.nameChartlet === '取消叠加') {
          this.nameChartlet = '叠加'
          for (let j = 0, len = imgChartlet.length; j < len; j++) {
            let feature = {}
            let fId = ''
            if (j < this.tableData.length) {
              feature = {
                imagesrc: '/mj/metaImage/getImageByTypeForAll?typeId=3&dataId=' + this.tableData[j].DATAID,
                // imagesrc: this.overLayTUrlImg,
                geometry: this.tableData[j].WKTRESPONSE
              }
              fId = this.tableData[j].F_DATAID
            }
            imgChartlet[j].src = this.overlaySrcs
            if (j < this.tableData.length) {
              gisMap.toggleStaticImage(false, feature, fId)
            }
          }
        }
      },
      // 贴图
      handleChartlet(row, column, cell) {
        this.nodeShowId = row.F_DATAID
        let wkt
        if(row.NODEID ==='11311'|| row.NODEID ==='11312'){
          wkt= row.WKTRESPONSE.myReplace(' 0.0', '')
        }else{
          wkt = row.WKTRESPONSE
        }
        gisMap.productTableCRemove()
        let feature = {
          'attributes': {
            'productTable_hover': '123'
          },
          'style': {
            fillcolor: 'rgba(0, 255, 0, 0)',
            strokecolor: '#00FF00',
            strokewidth: 5
          },
          'geometry': wkt
        }
        gisMap.addPoint(feature)
        let imgEl = cell.children[0].children[0]
        if (imgEl === undefined) {
          return false
        }
        if (imgEl.src) {
          let feature = {
            imagesrc: '/mj/metaImage/getImageByTypeForAll?typeId=3&dataId=' + row.DATAID,
            // imagesrc: this.overLayTUrlImg,
            geometry: row.WKTRESPONSE
          }
          if (imgEl.src.indexOf('tietu_close') !== -1) {
            imgEl.src = this.overlayNoSrc
            gisMap.toggleStaticImage(true, feature, row.F_DATAID)
          } else {
            imgEl.src = this.overlaySrcs
            gisMap.toggleStaticImage(false, feature, row.F_DATAID)
          }
        } else {
          return false
        }
      },
      S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      },
      getGuid() {
        return (this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4())
      },
      initWebSocket() {
        this.guid = this.getGuid()
      },
      getQueryCondition() {

        var nodeIdPra = this.nodeId
        //无需wkt直接查询的节点
        /* if (nodeIdPra === '10091' || nodeIdPra === '10092' || nodeIdPra === '10093' || nodeIdPra === '10094' || nodeIdPra === '10101' || nodeIdPra === '10111' || nodeIdPra === '10121' || nodeIdPra === '10141' || nodeIdPra === '10142' || nodeIdPra === '10143' || nodeIdPra === '11311' || nodeIdPra === '11312'|| nodeIdPra === '1000114') {
        this.isNoWkt = 1
      }*/
        console.log(this.tables,"this.tables")
        for (let item in this.tables){
          if(this.tables[item].type === 'scaleControl' && (localStorage.getItem('checkedValue') === true || localStorage.getItem('checkedValue') === 'true')) {
            this.tables[item].queryValue = [""]
          }
          let startTime = sessionStorage.getItem('startTime')
          let endTime = sessionStorage.getItem('endTime')
          console.log(startTime,startTime)
          if(this.tables[item].type === 'RangeDateConfig'){
            if(startTime !== null || startTime !== undefined){
              this.tables[item].queryValue[0] = sessionStorage.getItem('startTime')
            }
            if(endTime !== null || endTime !== undefined){
              this.tables[item].queryValue[1] = sessionStorage.getItem('endTime')
            }
          }
        }
        this.isNoWkt = 1
        this.queryObj = {
          guid: this.guid,
          nodeId: nodeIdPra,
          nodeName: this.tableName,
          geometryType: this.geometryType,
          areaCode: this.code,
          wkt: this.wkt,
          wktStr: this.wkt,
          isNoWkt: this.isNoWkt,
          queryStatus: this.queryStatus,
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          queryType: 'PageQuery',
          tables: [{
            tableName: this.tableName,
            queryFieldsList: this.tables
          }]
        }
        return true
      },
      // 构造查询条件
      constructQueryCondition() {
        this.initWebSocket()
        if ((this.wkt === '' && this.code === '') || this.nodeId === '') {
          if (this.wkt === '' && this.nodeId !== "11311") {
            this.$confirm('您未设置空间信息，默认查询全球数据, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.condition()
            }).catch(() => {
              this.$notify({
                message: '已取消查询',
                position: 'bottom-right',
                duration: 1500
              })
              this.loading = false
            })
          }
          if (this.nodeId ==='11311') {
            this.$message({
              type: 'warning',
              message: '您未设置空间信息，请设置！'
            })
          }
          if (this.nodeId === undefined) {
            this.$alert('请选择数据分类', '警告', {
              confirmButtonText: '确定',
              callback: action => {
                this.$notify({
                  message: '已取消查询',
                  position: 'bottom-right',
                  duration: 1500
                })
                this.loading = false
              }
            })
          }
        } else {
          this.condition()
        }
      },
      condition() {
        this.getQueryCondition()
        gisMap.clearAllFeatures()
        // let nodeIds = []
        // let k = 0
        // nodeIds = window.noCoordinateForNodeId
        // for (let i = 0; i < nodeIds.length; i++) {
        //   if(this.queryObj.nodeId === nodeIds[i]){
        //     k++
        //   }
        // }
        if (this.nodeId ==='1000310') {
          this.query(this.queryObj)
        }else{
          this.newQuery(this.queryObj)
        }
      },
      // 点击重置
      resettingFunc() {
        alert('开发中')
      },
      // 点击查询按钮
      searchFunc() {
        // this.setHfShowTl(false)
        // this.setHcShowTl(false)
        // this.setHdShowTl(false)
        // this.setHyShowTl(false)
        this.checkedDataz = false
        this.imageAllCheck = false
        this.currentPage = 1
        gisMap.featurePopInfo.content.style.visibility = 'hidden'
        gisMap.featurePop.setPosition(undefined)
        gisMap.clearAllFeatures()
        // 构造查询条件
        this.constructQueryCondition()
        this.resetChartlet()
        // region 导出和贴图功能
        if ((this.nodeId === '10091') || (this.nodeId === '10092') || (this.nodeId === '10093') || (this.nodeId === '10094') || (this.nodeId === '10101') || (this.nodeId === '10111') ||
          (this.nodeId === '10121') || (this.nodeId === '10131') || (this.nodeId === '10141') || (this.nodeId === '10142') || (this.nodeId === '10143') || (this.nodeId === '11311') ||
          (this.nodeId === '11312') ) {
          this.isDownload = true
          this.daochuluotu = false
          // this.showMZ = false
        }else if(this.nodeId === '1000310'){
          this.isDownload = false
          this.daochuluotu = true
        } else {
          this.isDownload = false
          // this.showMZ = true
        }
        /*if(this.nodeId === '10111'){
        this.$confirm('此节点未添加字段，点击确定刷新页面', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        window.location.reload();
      }*/
        if (this.nodeId === '10151' || this.nodeId === '10152' || this.nodeId === '10153') {
          this.showMZ = true
        } else {
          this.showMZ = false
        }
        // endregion
      },
      listResult(res, callback) {
        if (res.data === null || res.data.pageList === null) {
          this.$notify.error({
            message: '查询请求已经超时，请重新查询！',
            position: 'bottom-right',
            duration: 0
          })
          return
        }
        this.nameChartlet = '叠加'
        let data = res.data.pageList
        if (data) {
          localStorage.setItem('ZLtableName',this.tableName)
          data.forEach(d => {
            if (d.比例尺 != null && (d.比例尺).indexOf(':') == -1) {
              d.比例尺 = '1:' + d.比例尺
            }
            if (d.结束日期 || d.起始日期 || d.航摄开始时间 || d.航摄结束时间 || d.制图日期 || d.采集时间) {
              d.结束日期 = this.commonMethod.timestampToTime(d.结束日期)
              d.起始日期 = this.commonMethod.timestampToTime(d.起始日期)
              d.航摄开始时间 = this.commonMethod.timestampToTime(d.航摄开始时间)
              d.航摄结束时间 = this.commonMethod.timestampToTime(d.航摄结束时间)
              d.制图日期 = this.commonMethod.timestampToTime(d.制图日期)
              d.采集时间 = this.commonMethod.timestampToTime(d.采集时间)
            }
            if (d.WKTRESPONSE === 'POLYGON((-280.999721527 -89.9999999999999,-281 -89.9999999999999,-281 -89.999721527,-280.999721527 -89.999721527,-280.999721527 -89.9999999999999))' || d.WKTRESPONSE ===
              'MULTIPOLYGON(((-280.999721527 -89.9999999999999,-281 -89.9999999999999,-281 -89.999721527,-280.999721527 -89.999721527,-280.999721527 -89.9999999999999)))') {
              d.imageurlDQ = require('@/assets/images/search/dingwei_n.png')
            } else {
              d.imageurlDQ = require('@/assets/images/search/dingwei.png')
            }
            d.isSelect = false
            d.isShop = false
            d.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + d.DATAID
            d.RECEIVE_TIME = this.commonMethod.timestampToTime(d.RECEIVE_TIME)
            d.F_CENTERTIME = this.commonMethod.timestampToTime(new Date(d.F_CENTERTIME).toLocaleString())
            d.nodename = this.tableName
          })
        } else {
          this.tableData = []
        }
        data.map(item => {
          item.F_RECEIVETIME = this.formatTime(item.F_RECEIVETIME, 'Y-M-D')
          item.F_STARTDATE = this.formatTime(item.F_STARTDATE, 'Y-M-D h:m:s')
          item.F_ENDDATE = this.formatTime(item.F_ENDDATE, 'Y-M-D h:m:s')
        })
        this.tableData = data
        this.tableDataT = data
        // 地图绘制面
        if (!this.featureCurrent) {
          gisMap.clearCurrentFeatures()
        } else {
          gisMap.clearAllFeatures()
        }
        let _seft = this
        if (_seft.tableData) {
          // 绘制航磁等数据的面，或者设置面、点的框的颜色，填充的颜色
          _seft.resultStyleByCatalog(_seft.tableData, _seft.nodeId, true)
          http.getAllShopDataForPage({
            currentPage: _seft.shopCurrentPage,
            pageSize: _seft.shopPageSize,
            data: {}
          }).then(res => {
            let shopData = res.data
            if (shopData && shopData.length > 0) {
              _seft.tableData.forEach(e => {
                let d = e.F_DATAID
                for (let i = 0; i < shopData.length; i++) {
                  if (shopData[i].dataId === d) {
                    e.isShop = true
                    e.isSelect = false
                  }
                }
              })
            }
          })
          if (callback) {
            callback()
          }
        }
      },

      initCanvas() {
        this.imgcolor.forEach(item => {
          this.createCanvasImg(item.colors, item.blc, item.type)
        })
      },
      createCanvasImg(color, blc, type) {
        var cnv = document.createElement('canvas')
        cnv.width = 10
        cnv.height = 10
        var ctx = cnv.getContext('2d')

        // 注意，Canvas的坐标系是：Canvas画布的左上角为原点(0,0)，向右为横坐标，向下为纵坐标，单位是像素(px)。
        ctx.fillStyle = color
        ctx.fillRect(0, 0, 10, 10)
        // 开始一个新的绘制路径
        ctx.beginPath()

        if (type === 'hc') {
          ctx.moveTo(0, 0)
          ctx.lineTo(10, 10)
          ctx.moveTo(10, 0)
          ctx.lineTo(0, 10)
        } else if (type === 'hd') {
          ctx.moveTo(0, 0)
          ctx.lineTo(10, 0)
          ctx.moveTo(0, 10)
          ctx.lineTo(10, 10)
        } else if (type === 'hf') {
          ctx.moveTo(0, 0)
          ctx.lineTo(0, 10)
          ctx.moveTo(10, 0)
          ctx.lineTo(10, 10)
        } else if (type === 'hy') {
          ctx.moveTo(0, 0)
          ctx.lineTo(0, 10)
          ctx.moveTo(0, 0)
          ctx.lineTo(10, 0)
        } else if (type === 'wtky') {

        } else if (type === 'ygky') {

        }

        ctx.strokeStyle = color
        ctx.lineWidth = '1'
        // 沿着坐标点顺序的路径绘制直线
        ctx.stroke()
        // 关闭当前的绘制路径
        ctx.closePath()

        // 获取对应的CanvasRenderingContext2D对象(画笔)
        var cnv1 = document.createElement('canvas')
        cnv1.width = 10
        cnv1.height = 10
        var ctx1 = cnv1.getContext('2d')

        // 开始一个新的绘制路径
        ctx1.beginPath()
        if (type === 'hc') {
          ctx1.moveTo(0, 0)
          ctx1.lineTo(10, 10)
          ctx1.moveTo(10, 0)
          ctx1.lineTo(0, 10)
        } else if (type === 'hd') {
          ctx1.moveTo(0, 0)
          ctx1.lineTo(10, 0)
          ctx1.moveTo(0, 10)
          ctx1.lineTo(10, 10)
        } else if (type === 'hf') {
          ctx1.moveTo(0, 0)
          ctx1.lineTo(0, 10)
          ctx1.moveTo(10, 0)
          ctx1.lineTo(10, 10)
        } else if (type === 'hy') {
          ctx1.moveTo(0, 0)
          ctx1.lineTo(0, 10)
          ctx1.moveTo(0, 0)
          ctx1.lineTo(10, 0)
        } else if (type === 'wtky') {

        } else if (type === 'ygky') {

        }
        ctx1.strokeStyle = color
        ctx1.lineWidth = '1'
        // 沿着坐标点顺序的路径绘制直线
        ctx1.stroke()
        // 关闭当前的绘制路径
        ctx1.closePath()

        var img = new Image()
        img.src = cnv1.toDataURL('image/png')
        var pat = ctx.createPattern(cnv, 'repeat')
        var pat1 = ctx1.createPattern(cnv1, 'repeat')

        let sty = new Style({
          stroke: new Stroke({
            color: color,
            // lineDash: [5],
            width: 1,
            countnum: ''
          }),
          fill: new Fill({
            color: pat1
          })
        })

        // 加填充和网格了
        let sty2 = new Style({
          stroke: new Stroke({
            color: color,
            // lineDash: [5],
            width: 4,
            countnum: ''
          }),
          fill: new Fill({
            color: pat
          })
        })
        this.imgbesa.push({
          type: type,
          url: img.src,
          blc: blc,
          style2: sty2,
          style: sty
        })
      },
      resultStyleByCatalog(res, nodeId, isCurrentPage) {
        let ths = this
        ths.setHfShowTl(false)
        ths.setHcShowTl(false)
        ths.setHdShowTl(false)
        ths.setHyShowTl(false)
        res.forEach(each => {
          var attributes = each
          var colors = ''
          var imgdata = ''
          var syl = ''
          var syl2 = ''
          var countnum = '1'
          var itemtype = ''
          ths.imgbesa.forEach(item => {
            if (nodeId === '10091') {
              if (item.type === 'hc') {
                if (item.blc === each.测量比例尺OLD) {
                  imgdata = item.url
                  syl = item.style
                  syl2 = item.style2
                  countnum = '2'
                }
              }
            }
            if (nodeId === '10091') {
              if (item.type === 'hc') {
                if (item.blc !== each.测量比例尺OLD) {
                  itemtype = 'hc'
                }
              }
            }
            if (nodeId === '10092') {
              if (item.type === 'hd') {
                if (item.blc === each.测量比例尺OLD) {
                  imgdata = item.url
                  syl = item.style
                  syl2 = item.style2
                  countnum = '2'
                }
              }
            }
            if (nodeId === '10093') {
              if (item.type === 'hf') {
                if (item.blc === each.测量比例尺OLD) {
                  imgdata = item.url
                  syl = item.style
                  syl2 = item.style2
                  countnum = '2'
                }
              }
            }
            if (nodeId === '10093'){
              if (item.type === 'hf') {
                if (item.blc !== each.测量比例尺OLD){
                  itemtype = 'hf'
                }
              }
            }
            if (nodeId === '10111') {
              if (item.type === 'hy') {
                if (item.blc === each.航摄比例尺F) {
                  imgdata = item.url
                  syl = item.style
                  syl2 = item.style2
                  countnum = '2'
                }
              }
            }
            if (nodeId === '10111') {
              if (item.type === 'hy') {
                if (item.blc !== each.航摄比例尺F) {
                  itemtype = 'hy'
                }
              }
            }
            if (nodeId === '10101') {
              if (item.type === 'hc') {
                imgdata = item.url
                syl = item.style2
                syl2 = item.style2
              }
            }
            if (nodeId === '10121') {
              if (item.type === 'hc') {
                imgdata = item.url
                syl = item.style
                syl2 = item.style2
              }
            }
            if (nodeId === '11311') {
              if (item.type === 'hc') {
                imgdata = item.url
                syl = item.style
                syl2 = item.style2
              }
            }
            if (nodeId === '11312') {
              if (item.type === 'hc') {
                imgdata = item.url
                syl = item.style
                syl2 = item.style2
              }
            }
            if (nodeId === '10141') {
              imgdata = item.url
              syl = item.style
              syl2 = item.style2
            }
            if (nodeId === '10142') {
              imgdata = item.url
              syl = item.style
              syl2 = item.style2
            }
            if (nodeId === '10143') {
              imgdata = item.url
              syl = item.style
              syl2 = item.style2
            }
            if (nodeId === '10151') {
              imgdata = item.url
              syl = item.style
              syl2 = item.style2
            }
            if (nodeId === '10152') {
              imgdata = item.url
              syl = item.style
              syl2 = item.style2
            }
            if (nodeId === '10153') {
              imgdata = item.url
              syl = item.style
              syl2 = item.style2
            }
            if (nodeId === '1000310') {
              if (item.type === 'bzcp') {
                imgdata = item.url
                syl = item.style2
                syl2 = item.style2
              }
            }
          })
          ths.$nextTick(() => {
            if (imgdata = '') {
              imgdata = ths.imgbesa[this.imgbesa.length - 1].url
              syl = ths.imgbesa[this.imgbesa.length - 1].style
              syl2 = ths.imgbesa[this.imgbesa.length - 1].style2
            }
          })
          if (nodeId === '10091' || nodeId === '10092' || nodeId === '10093' || nodeId === '10094' || nodeId === '10101' || nodeId === '10111' || nodeId === '10121' ||
            nodeId === '10141' || nodeId === '10142' || nodeId === '10143') {
            let featureOne = {
              attributes: attributes,
              geometry: attributes.WKTRESPONSE
            }
            // 添加面到地图
            if (this.currentPage === 1) {
              gisMap.addCrossPolygon2(featureOne, 'featuresSourceAllImage', syl, countnum, nodeId, itemtype)
            }
            if (isCurrentPage) {
              gisMap.addCrossPolygon2(featureOne, 'featuresSource', syl2, countnum, nodeId, itemtype)
            }
          }else if (nodeId === '11311' || nodeId === '11312' || nodeId === '1000355'){
            let featureTwo = {
              attributes: attributes,
              geometry: attributes.WKTRESPONSE.myReplace(' 0.0', '')
            }
            if (this.currentPage === 1) {
              if(nodeId === '11311' || nodeId === '1000355'){
                gisMap.addPoint(featureTwo, 'featuresSourceAllImage')
              }else {
                gisMap.addCrossPolygon2(featureTwo, 'featuresSourceAllImage', syl, countnum, nodeId, itemtype)
              }
            }
            if (isCurrentPage) {
              if(nodeId === '11311' || nodeId === '1000355'){
                gisMap.addPoint(featureTwo)
              }else {
                gisMap.addCrossPolygon2(featureTwo, 'featuresSource', syl2, countnum, nodeId, itemtype)
              }
            }
          } else {
            // 卫星影像
            let feature = {
              attributes: attributes,
              style: {
                fillcolor: 'rgba(0,0,255, 0)',
                strokecolor: 'rgba(0,0,255, 0.5)',
                strokewidth: 2
              },
              geometry: attributes.WKTRESPONSE
            }
            // 添加面到地图
            if (isCurrentPage) {
              gisMap.addPolygon(feature)
            }
            if (this.currentPage === 1) {
              gisMap.addCrossPolygon2(feature, 'featuresSourceAllImage', syl)
            }
          }
          gisMap.darwState = false
        })
        ths.featureCurrent = false
      },
      createTlByPageList(res, nodeId) {
        var htmlValue = []
        let tlList = []
        let reg = new RegExp(',', 'g') // g代表全部
        res.forEach(each => {
          var blc = each.测量比例尺OLD ? each.测量比例尺OLD : each.航摄比例尺F
          if (nodeId !== '10101' && nodeId !== '10121') {
            if (tlList.length === 0) {
              tlList.push(blc.substr(blc.indexOf(':') + 1, blc.length).replace(reg, ''))
            }
            var tlListnum = 0
            for (var i = 0; i < tlList.length; i++) {
              if (blc.replace(reg, '') === '1:' + tlList[i].replace(reg, '')) {
                tlListnum++
              }
            }
            if (tlListnum === 0) {
              if (blc !== '1:') {
                tlList.push(blc.substr(blc.indexOf(':') + 1, blc.length).replace(reg, ''))
              }
            }
          }
        })
        this.sort(tlList)
        let labeltl = ''
        if (nodeId === '10091') { // 航磁
          labeltl = 'hc'
        } else if (nodeId === '10093') { // 航放
          labeltl = 'hf'
        } else if (nodeId === '10092') { // 航电
          labeltl = 'hd'
        } else if (nodeId === '10111') { // 航空遥感测量
          labeltl = 'hy'
        }
        if (tlList.length > 0) {
          for (var i = 0; i < tlList.length; i++) {
            if (this.allStatus.indexOf(labeltl + tlList[i]) > -1) {
              htmlValue.push({
                name: labeltl,
                imgUrl: require('@/assets/img/' + labeltl + tlList[i] + '.png'),
                label: '1:' + tlList[i]
              })
            }
          }
          htmlValue.push({
            name: labeltl,
            imgUrl: require('@/assets/img/' + labeltl + '.png'),
            label: '其他'
          })
        }
        if (nodeId === '10101') { // 物探科研
          htmlValue = [{
            name: 'wtky',
            imgUrl: require('@/assets/img/wtky.png'),
            label: '物探科研'
          }]
        } else if (nodeId === '10121') { // 遥感科研
          htmlValue = [{
            name: 'ygky',
            imgUrl: require('@/assets/img/ygky.png'),
            label: '遥感科研'
          }]
        }
        this.settlList(htmlValue)
      },
      sort(arr) {
        for (var j = 0; j < arr.length - 1; j++) {
          // 两两比较，如果前一个比后一个大，则交换位置。
          for (var i = 0; i < arr.length - 1 - j; i++) {
            if (parseFloat(arr[i]) > parseFloat(arr[i + 1])) {
              var temp = arr[i]
              arr[i] = arr[i + 1]
              arr[i + 1] = temp
            }
          }
        }
      },
      query(obj) {
        // let _this = this
        this.$notify({
          message: '检索中...',
          position: 'bottom-right',
          duration: 0
        })
        if (this.menuShow) {
          document.getElementsByClassName('el-notification')[0].style.right = '23vw'
        } else {
          document.getElementsByClassName('el-notification')[0].style.right = '20px'
        }
        if (this.currentPage === 1 || this.queryObj.currentPage === 1) {
          obj.currentPage = 1
          this.queryObj.currentPage = 1
        } else {
          this.currentPage = obj.currentPage
          this.queryObj.currentPage = obj.currentPage
        }
        let _this = this
        window.noCoordinateForNodeId

        http.findQuery(obj).then(res => {
          // 先清空这个缓存，然后传入查询对象到缓存里，供定点查询使用
          let time = new Date().getTime()
          obj.time = time
          obj.objType = 'BZCP'
          localStorage.setItem('searchDataToBZCP', JSON.stringify(obj))

          this.exportForm = obj
          this.listResult(res, function () {
            if (res.data.total > 0) {
              _this.setActiveName('result')
              _this.coverage()
            } else {
              _this.$notify.closeAll()
              _this.$alert('查询结果为空，请修改查询条件后再试', '警告', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.total = 0
                  _this.totalT = 0
                }
              })
              _this.fullscreenLoading = false
            }
          })
        })
      },
      newQuery(obj) {
        // let _this = this
        this.$notify({
          message: '检索中...',
          position: 'bottom-right',
          duration: 0
        })
        if (this.menuShow) {
          document.getElementsByClassName('el-notification')[0].style.right = '23vw'
        } else {
          document.getElementsByClassName('el-notification')[0].style.right = '20px'
        }
        if(obj.currentPage === 1){
          obj.currentPage = 1
          this.queryObj.currentPage = 1
        }
        let _this = this
        // alert("findQuery")
        window.noCoordinateForNodeId
        http.findNewAgrsPageList(obj).then(res => {
          // 先清空这个缓存，然后传入查询对象到缓存里，供定点查询使用
          let time = new Date().getTime()
          obj.time = time
          obj.objType = 'ZL'
          localStorage.setItem('searchDataToZL', JSON.stringify(obj))
          this.listResult(res, function () {
            if (res.data.total > 0) {
              _this.setActiveName('result')
              _this.newCoverage()
            } else {
              _this.$notify.closeAll()
              _this.$alert('查询结果为空，请修改查询条件后再试', '警告', {
                confirmButtonText: '确定',
                callback: action => {
                  _this.total = 0
                  _this.totalT = 0
                }
              })
              _this.fullscreenLoading = false
            }
          })
        })
      },
      coverage() {
        let _this = this
        // 回调合并面
        http.findCoverage(this.queryObj).then(res => {
          _this.$notify.closeAll()
          if (res.data.pageList) {
            _this.total = res.data.pageList[0].SIZENUM
            _this.totalT = res.data.pageList[0].SIZENUM
          }
          _this.switchingTableArr = res.data.pageList
          if (_this.nodeId === '10091' || _this.nodeId === '10092' || _this.nodeId === '10093' || _this.nodeId === '10094' || _this.nodeId === '10101' || _this.nodeId === '10111' ||
            _this.nodeId === '10121') {
            // 生成图例
            _this.createTlByPageList(res.data.pageList, _this.nodeId)
          }
          // 航片，测区，1：25万航磁系列图件，1：250万航磁系列图件，遥感解译成果图件，高分一号，高分二号，资源02C 图例
          if (_this.nodeId === '11311' || _this.nodeId === '11312' || _this.nodeId === '10141' || _this.nodeId === '10142' || _this.nodeId === '10143' ||
            _this.nodeId === '10151' || _this.nodeId === '10152' || _this.nodeId === '10153') {
            _this.createTlOther(_this.queryObj, _this.nodeId)
          }
          // 画网格
          _this.resultStyleByCatalog(res.data.pageList, _this.nodeId, false)
        })
        // 20220711 mj 新增异步查询获取全选所有的列表
        http.findNewAgrsAllListWktForHCNodes(this.queryObj).then(res => {
          _this.AllTableDataArr = []
          _this.$notify.closeAll()
          _this.butD = false
          if (res.data.pageList) {
            _this.switchingTableArr = res.data.pageList
            _this.AllTableDataArr = res.data.pageList
            _this.setActiveName('result')
          }
          _this.checkedDataAll()
        })
      },
      newCoverage() {
        let _this = this
        // 资料查询使用
        http.findNewAgrsAllListWktForHC(this.queryObj).then(res => {
          _this.$notify.closeAll()
          if (res.data.pageList) {
            _this.total = res.data.total
            _this.totalT = res.data.total
          }
          _this.switchingTableArr = res.data.pageList
          if (_this.nodeId === '10091' || _this.nodeId === '10092' || _this.nodeId === '10093' || _this.nodeId === '10094' || _this.nodeId === '10101' || _this.nodeId === '10111' ||
            _this.nodeId === '10121') {
            // 生成图例
            _this.createTlByPageList(res.data.pageList, _this.nodeId)
          }
          // 航片，测区，1：25万航磁系列图件，1：250万航磁系列图件，遥感解译成果图件，高分一号，高分二号，资源02C 图例
          if (_this.nodeId === '11311' || _this.nodeId === '11312' || _this.nodeId === '10141' || _this.nodeId === '10142' || _this.nodeId === '10143' ||
            _this.nodeId === '10151' || _this.nodeId === '10152' || _this.nodeId === '10153') {
            _this.createTlOther(_this.queryObj, _this.nodeId)
          }
          // 画网格
          _this.resultStyleByCatalog(res.data.pageList, _this.nodeId, false)
        })
      },
      // 合并面接口慢
      getCalCoverage() {
        let _this = this
        http.getCalCoverage({
          guid: this.guid
        }).then(res => {
          // 数据接收
          let daarr = res.data.split('&')
          gisMap.featuresSourceVectorLayerAllImage.getSource().clear()
          let feature = {
            attributes: '',
            style: {
              fillcolor: 'rgba(3, 168, 158, 0.3)',
              strokecolor: 'rgba(3, 168, 158, 0.3)',
              strokewidth: 1
            },
            geometry: daarr[1]
          }
          // 添加面到地图
          gisMap.addPolygon(feature, 'featuresSourceAllImage')
          _this.progressVal = parseFloat(daarr[0].split('@')[1])
          _this.progressVal = parseFloat(daarr[0].split('@')[1])
          _this.progressShow = true
          if (_this.progressVal === 100.0) {
            _this.$notify({
              message: '绘制完成',
              position: 'bottom-right',
              duration: 0,
              showClose: false
            })
          } else {
            let t = this
            setTimeout(function () {
              t.getCalCoverage()
            }, 100)
          }
        })
      },
      // 点击分页
      handleCurrentChange(val) {
        this.currentPage = val
        // alert("页码"+val)
        this.nameAllSelect = '当前页全选'
        this.resetChartlet()
        // if (this.tabelPopdata[0] === 0) {
        this.handlePageBtn(val)
        // }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.currentStyle = []
        if (this.tabelPopdata[0] === 0) {
          this.condition()
        }
      },
      // 翻页操作
      handlePageBtn(val) {
        // alert("翻页")
        //     alert(this.pageSize)
        //     http.findNewAgrsPageList({
        //       currentPage: this.currentPage,
        //       guid: this.guid
        //     }).then((res) => {
        //       this.featureCurrent = true
        //       this.listResult(res)
        //       let _this = this
        //       _this.tableData.forEach(item => {
        //         if (_this.nodeId === '10091' || _this.nodeId === '10092' || _this.nodeId === '10093' || _this.nodeId === '10094' || _this.nodeId === '10101' || _this.nodeId === '10111' || _this.nodeId === '10121') {
        //
        //         } else {
        //           // item.imageurl = _this.validateImage('/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.DATAID)
        //           // item.imageurl = "http://gf.agrs.cn/order/meta.imager?flag=1&metaId=" + item.DATAID + "&dataTablename=TB_BAS_META_YGYX"
        //           item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.DATAID
        //         }
        //       })
        // })
        this.currentPage = val
        this.nameAllSelect = '当前页全选'
        this.queryObj.currentPage = val
        if(this.nodeId === '1000310'){
          this.query(this.queryObj)
        }else{
          this.newQuery(this.queryObj)
        }
      },
      // 重置贴图
      resetChartlet() {
        let imgChartlet = document.getElementsByClassName('chartlet')
        for (let i = 0, len = imgChartlet.length; i < len; i++) {
          imgChartlet[i].src = this.overlaySrcs
        }
        if (this.tableData) {
          this.tableData.forEach(item => {
            if (item.WKTRESPONSE) {
              let feature = {
                imagesrc: '/mj/metaImage/getImageByTypeForAll?typeId=3&dataId=' + item.DATAID,
                // imagesrc: this.overLayTUrlImg,
                geometry: item.WKTRESPONSE.myReplace(' 0.0', '')
              }
              gisMap.toggleStaticImage(false, feature, item.F_DATAID)
            }
          })
        }
      },
      // 点击购物车分页
      handleShopCurrentChange(val) {
        this.shopCurrentPage = val
        this.shopInitTable()
      },
      // 导出覆盖面
      handleCoverage() {
        http.getCoverageNum(this.queryObj).then(this.getCoverageNum())
      },
      // 导出非覆盖面
      handleNoCoverage() {
        http.getNoCoverageNum(this.queryObj).then(this.getCoverageNum())
      },
      // 在表格数据返回后调用，拼面接口
      getCoverageNum() {
        return res => {
          let attributes = res.data

          let color = {
            0: '#0000FF',
            1: '#0000CD',
            2: '#191970',
            3: '#00008B',
            4: '#000080',
            5: '#4169E1',
            6: '#6495ED',
            7: '#B0C4DE'
          }
          let k = 0
          let satData = []
          for (let satName in attributes) {
            let feature = {
              attributes: {
                getArea: attributes[satName].getArea
              },
              style: {
                fillcolor: 'rgba(255, 255, 255, 0)',
                strokecolor: color[k++],
                strokewidth: 1
              },
              geometry: attributes[satName].wktResponse
            }
            this.attributes = attributes[satName]
            let o = {
              event: satName,
              getArea: attributes[satName].getArea,
              imgNum: attributes[satName].imgNum
            }
            satData.push(o)
            // 添加面到地图
            gisMap.addPolygon(feature)
          }
        }
      },
      // 加入购物车
      handleAddShop() {
        var userName = localStorage.getItem('userName')
        if (userName !== 'undefined' && userName !== '' && userName !== undefined && userName !== null) {
          let _this = this
          let arr = []
          _this.obj = {}
          _this.tableData.forEach(item => {
            if (item.isSelect) {
              // this.str += item.F_DATAID + ','
              _this.obj = {
                // receivetime: item.F_CENTERTIME,
                dataid: item.F_DATAID,
                dataname: item.DATANAME,
                datasize: item.F_DATASIZE,
                nodeid: this.nodeId // gy
              }
              arr.push(_this.obj)
            }
          })
          // this.str = this.str.slice(0, this.str.length - 1)
          http.addAgrsSave({
            data: arr
          }).then(res => {
            if (res.data === 'true') {
              _this.$notify.success({
                message: '成功加入购物车！',
                position: 'bottom-right',
                duration: 1500
              })
              _this.shopInitTable()
              _this.getShopId()
              _this.setActiveName('shopCar')
            }
          })
        } else {
          this.$message({
            type: 'warning',
            message: '您还未登陆，请先登录！'
          })
          // alert('您还未登陆，请先登录！')
        }
      },
      getShopId() {
        let _this = this
        http.getAllShopDataForPage({
          currentPage: _this.shopCurrentPage,
          pageSize: _this.shopPageSize,
          data: {}
        }).then(res => {
          let shopData = res.data.list
          if (shopData && shopData.length > 0) {
            _this.tableData.map(e => {
              let d = e.F_DATAID
              e.isShop = false
              for (let i = 0; i < shopData.length; i++) {
                if (parseInt(shopData[i].dataid) === d) {
                  e.isShop = true
                  e.isSelect = false
                }
              }
            })
          } else {
            _this.tableData.map(e => {
              e.isShop = false
            })
          }
        })
      },
      // 初始化购物车
      shopInitTable() {
        let _this = this
        http.getAllShopDataForPage({
          currentPage: _this.shopCurrentPage,
          pageSize: _this.shopPageSize,
          data: {}
        }).then(res => {
          res.data.list.forEach(item => {
            item.receivetime = new Date(item.favoritetime).toLocaleString()
          })
          _this.shopTableData = res.data.list
          _this.shopTotal = res.data.total
        })
      },
      handleDelete(index, row) {
        // this.shopId = row.shopId
        this.shopId = row.id
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.deleteShop({
            id: this.shopId
          }).then(res => {
            if (res.data) {
              this.$notify({
                message: '删除成功！',
                position: 'bottom-right',
                duration: 1500,
                type: 'success'
              })
              if (this.tableData.length > 0) {
                this.getShopId()
              }
              this.shopCurrentPage = 1
              this.shopInitTable()
            } else {
              this.$notify.error({
                message: '删除失败！',
                position: 'bottom-right',
                duration: 0
              })
            }
          }, (resp) => {
            this.$notify({
              message: '请求失败！',
              position: 'bottom-right'
            })
          })
        }).catch(() => {
          this.$notify.info({
            message: '已取消删除！',
            position: 'bottom-right'
          })
        })
      },
      // 选择购物车数据
      tableLimit(val) {
        this.shopId = []
        for (let i = 0; i < val.length; i++) {
          this.shopId.push(val[i].id)
        }
      },
      // 生成订单
      createShopOrder(val) {
        if (this.shopId.length > 0) {
          if (val) {
            this.setShopIDs(JSON.stringify(this.shopId))
            this.$router.push({
              path: '/shopCarCreateProcessOrder'
            })
          } else {
            this.setShopIDs(JSON.stringify(this.shopId))
            this.$router.push({
              path: '/shopCarCreateOrder'
            })
          }
        } else {
          this.$notify({
            message: '请选择数据！',
            position: 'bottom-right',
            duration: 3500,
            type: 'warning'
          })
        }
      },
      // 自动创建订单名称
      createName() {
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
      // 重置订单名称输入框
      resetForm(formName) {
        this.shopDialogVisible = false
        this.$refs[formName].resetFields()
      },
      handleClose() {
        this.xqDialogVisible = false
      },
      dataSizeFormatter(row, column, cellValue) {
        if (row.dataSize) {
          var datasize = parseFloat(row.dataSize)
          var str = ['B', 'K', 'M', 'G', 'T', 'P']
          for (var i = 0; i < str.length; i++) {
            if (datasize <= 10240) {
              return datasize.toFixed(2) + str[i]
            } else {
              datasize = datasize / 1024.0
            }
          }
          return 1
        } else {
          return '-'
        }
      },
      // 数组去重
      getUniq(arr) {
        let temp = []
        for (var i = 0; i < arr.length; i++) {
          if (temp.indexOf(arr[i]) === -1) {
            temp.push(arr[i])
          }
        }
        return temp
      },
      ...mapActions('searchStore', {
        setActiveName: 'setActiveName',
        setMenuShow: 'setMenuShow',
        setShopIDs: 'setShopIDs',
        settlList: 'settlList',
        setSwitchingSelect: 'setSwitchingSelect',
        setDialogShowDataZ: 'setDialogShowDataZ',
        setDetailShow: 'setDetailShow',
        setDialogShow: 'setDialogShow',
        setHfShowTl: 'setHfShowTl',
        setHcShowTl: 'setHcShowTl',
        setHdShowTl: 'setHdShowTl',
        setHyShowTl: 'setHyShowTl'
      }),
      // 表头一行显示
      labelHead(h, {
        column,
        index
      }) {
        let l = column.label.length
        let f = 16 // 每个字大小，其实是每个字的比例值，大概会比字体大小差不多大一点，
        column.minWidth = f * l // 字大小乘个数即长度 ,注意不要加px像素，这里minWidth只是一个比例值，不是真正的长度
        // 然后将列标题放在一个div块中，注意块的宽度一定要100%，否则表格显示不完全
        return h('div', {
          class: 'table-head',
          style: {
            width: '100%'
          }
        }, [column.label])
      },
      // 航片，测区，1：25万航磁系列图件，1：250万航磁系列图件 图例
      createTlOther(queryObj, nodeId) {
        let title = queryObj.tables[0].tableName
        if (nodeId === '10141') {
          title = '1：25万航磁系列图件'
        } else if (nodeId === '10142') {
          title = '1：250万航磁系列图件'
        } else if (nodeId === '11311') {
          title = '航片'
        } else if (nodeId === '11312') {
          title = '测区'
        } else if (nodeId === '10143') {
          title = '遥感解译图件'
        }
        //  let htmlValue = 'tlOther:true,' + title + ';'

        let htmlValue = [{
          name: 'wtky',
          imgUrl: require('@/assets/img/wtky.png'),
          label: title
        }]
        this.settlList(htmlValue)
      }
    },
    computed: {
      ...mapState('searchStore', {
        tables(state) {
          console.log(state, 'mj20210810')
          if (Object.keys(state.resultData).length === 0) return
          let {queryFieldsList} = state.resultData.tables[0]
          this.tableName = state.resultData.tables[0].tableName
          this.showCon = []
          // 设置查询结果列表的显示字段
          if ((state.resultData.tables[0].showFieldsList && state.nodeId === '1000345') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000346') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000347') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000348') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000349') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000350') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000351') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000352') ||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000353')) {
            state.resultData.tables[0].showFieldsList.forEach(item => {
              if (this.DiZhiTu.indexOf(item.alisaName) > -1) {
                this.showCon.push(item)
              }
            })
          }
          else if (state.resultData.tables[0].showFieldsList && state.nodeId === '1000310') {
            state.resultData.tables[0].showFieldsList.forEach(item => {
              if (window.resultSpanLi.indexOf(item.alisaName) > -1) {
                this.showCon.push(item)
              }
            })
          }
          else if (state.resultData.tables[0].showFieldsList && state.nodeId === '1000344') {
            state.resultData.tables[0].showFieldsList.forEach(item => {
              if (this.GWCG46.indexOf(item.alisaName) > -1) {
                this.showCon.push(item)
              }
            })
          }
          else if (state.resultData.tables[0].showFieldsList && state.nodeId === '1000355') {
            state.resultData.tables[0].showFieldsList.forEach(item => {
              if (this.WuXing.indexOf(item.alisaName) > -1) {
                this.showCon.push(item)
              }
            })
          }
          else if ( (state.resultData.tables[0].showFieldsList && state.nodeId === '1000356')||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000357')||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000358')||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000359')||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000360')||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000361')||
            (state.resultData.tables[0].showFieldsList && state.nodeId === '1000362')) {
            state.resultData.tables[0].showFieldsList.forEach(item => {
              if (this.KaiYuan.indexOf(item.alisaName) > -1) {
                this.showCon.push(item)
              }
            })
          }
          else {
            this.showCon = state.resultData.tables[0].showFieldsList
          }

          this.vueArr = queryFieldsList.map(each => {
            each.nodeId = state.resultData.nodeId
            if (each.queryValue && each.queryValue.length && each.queryValue.length === 0 ) {
              each.queryValue.push(each.defaultValue)
            }
            // if (each.alisaName === '测量比例尺') {
            //   // each.queryValue = each.queryValue[0].split('+')
            // }
            Vue.component(each.type, {
              data() {
                return {
                  count: 0,
                  vname: each.name,
                  dataInput: '',
                  vmodel: '',
                  tepvalue: [0, each.queryValue.length],
                  SingleIntConfigVmodel: parseFloat(each.queryValue),
                  datePickerDefault: each.queryValue[0],
                  enddatePickerDefault: each.queryValue[1],
                  cities: each.queryValue,
                  checked: each.queryValue,
                  checkedValue: true,
                  toolmsg: each.queryValue,
                  maxdata: each.queryValue.length - 1,
                  pickerOptions: {
                    shortcuts: [{
                      text: '一月前',
                      onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', date);
                      }
                    }, {
                      text: '一季度前',
                      onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 3);
                        picker.$emit('pick', date);
                      }
                    }, {
                      text: '一年前',
                      onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 12);
                        picker.$emit('pick', date);
                      }
                    }]
                  },
                  endpickerOptions: {
                    shortcuts: [{
                      text: '昨天',
                      onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24);
                        picker.$emit('pick', date);
                      }
                    },{
                      text: '一月前',
                      onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', date);
                      }
                    }, {
                      text: '一季度前',
                      onClick(picker) {
                        const date = new Date();
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 3);
                        picker.$emit('pick', date);
                      }
                    }]
                  }
                }
              },
              template: vueComponent[each.type],
              watch: {
                tableData(){
                  console.log(this.tableData,"资料tableData变化")
                  this.timeKey = new Date().getTime()
                  console.log(this.timeKey)
                },
                datePickerDefault(val) {
                  console.log(val,"1111111")
                  if (val === null) {
                    each.queryValue[0] = ''
                  }
                  sessionStorage.setItem('startTime', this.commonMethod.timestampToTime(this.datePickerDefault))
                },
                enddatePickerDefault(val) {
                  console.log(val,"2222222")
                  if (val === null) {
                    each.queryValue[1] = ''
                  }
                  sessionStorage.setItem('endTime', this.commonMethod.timestampToTime(this.enddatePickerDefault))
                }
              },
              methods: {
                timestepToolTip(index) {
                  return this.toolmsg[index]
                },
                timestepLike() {
                  if (this.tepvalue[0] === this.tepvalue[1]) {
                    each.queryValue = [this.toolmsg[this.tepvalue[0]]]
                  } else {
                    each.queryValue = this.toolmsg.slice(this.tepvalue[0], this.tepvalue[1] + 1)
                  }
                },
                alocked() {
                  if (this.checkedValue) {
                    this.tepvalue = [0, this.toolmsg.length]
                    this.allcheckvalue = each.queryValue
                    each.queryValue = []
                    // each.queryValue = this.toolmsg
                    localStorage.setItem('checkedValue', true)
                  } else {
                    each.queryValue = this.toolmsg
                    localStorage.setItem('checkedValue', false)
                  }

                  console.log(each.queryValue)
                },
                timestampToTime: function (timestamp) {
                  if (timestamp) {
                    if (typeof (timestamp) === 'object') {
                      var date = timestamp
                    } else {
                      date = new Date(timestamp)
                    }
                    // var date = timestamp
                    // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    var Y = date.getFullYear() + '-'
                    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
                    var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
                    // var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
                    // var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
                    // var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
                    return Y + M + D
                  } else {
                    return '-'
                  }
                },
                handleBtn() {
                  each.queryValue = this.checked
                },
                handleDatePicker(val) {
                  each.queryValue = val
                },
                getInputInt(val) {
                  each.queryValue = val
                },
                getInputFloat(val) {
                  each.queryValue = val
                },
                // handlestarttime(val) {
                //   each.queryValue[0] = val
                // },
                handstarttime(val) {
                  console.log(val,"33333333333")
                  // each.queryValue[0] = val
                },
                handleendtime(val) {
                  console.log(val,"44444444444")
                  each.queryValue[1] = val
                },
                handleLike(val) {
                  each.queryValue = [val]
                },
                handleSingleInt(val) {
                  each.queryValue = [parseFloat(val)]
                },
                handleEqual(val) {
                  each.queryValue = val
                },
                querySearch(queryString, cb) {
                  let arritem = []
                  if (each.queryValue.length !== 0) {
                    for (let key in each.queryValue) {
                      arritem.push({
                        value: each.queryValue[key]
                      })
                    }
                  }
                  var restaurants = arritem
                  var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
                  // 调用 callback 返回建议列表的数据
                  cb(results)
                },
                createFilter(queryString) {
                  return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
                  }
                }

              },
              created() {
                let arritem = []
                if (each.queryValue.length !== 0) {
                  for (let key in each.queryValue) {
                    arritem.push({
                      value: each.queryValue[key],
                      label: each.queryValue[key]
                    })
                  }
                }
                this.dataInput = arritem
              }
            })
            const Component = Vue.component(each.type)
            return new Component()
          })
          this.$nextTick(() => {
            for (let i = 0; i < this.vueArr.length; i++) {
              this.vueArr[i].$mount(this.$refs['app'][i])
            }
          })
          sessionStorage.removeItem('startTime')
          sessionStorage.removeItem('endTime')
          return queryFieldsList
        },
        clientdata(state) {
          return state.clientHeight
        },
        nodeId(state) {
          return state.nodeId
        },
        geometryType(state) {
          return state.geometryType
        },
        wkt(state) {
          return state.wkt
        },
        code(state) {
          return state.code
        },
        navHide(state) {
          return state.navHide
        },
        tableShow(state) {
          return state.tableShow
        },
        shopCatShow(state) {
          return state.shopCatShow
        },
        parentNodeId(state) {
          if (state.parentNodeId === '10013' || state.parentNodeId === '10014') {
            return false
          } else {
            return true
          }
        },
        nodeLabel(state) {
          return state.nodeLabel
        },
        shopAgen(state) {
          return state.shopAgen
        },
        tableD(state) {
          return state.tableD
        },
        resultStr(state) {
          return state.resultStr
        },
        showPXFlag(state) {
          return state.showPXFlag
        },
        tabelPopdata(state) {
          return state.tabelPopdata
        },
        setNavListIndex(state) {
          return state.setNavListIndex
        },
        queryStatus(state) {
          return state.queryStatus
        },
        navListIndex(state) {
          this.showtb2 = false
          this.showtb3 = false
          this.showtb4 = false
          this.showtb5 = false
          this.showtb6 = false
          this.showtb7 = false
          this.showtb8 = false
          this.showtb9 = false
          this.showtb10 = false
          this.showtb11 = false
          this.showtb12 = false
          this.showtb13 = false
          this.showtb14 = false
          this.showtb15 = false
          this.showtb16 = false
          let index = state.navListIndex
          let arr = index.split('/')
          let id = arr[0]
          if (id === '10091') {
            this.showtb1 = true
            this.navListIndexValue = '航空磁力测量'
          }
          if (id === '10092') {
            this.showtb1 = false
            this.showtb2 = true
            this.navListIndexValue = '航空电磁测量'
          }
          if (id === '10093') {
            this.showtb1 = false
            this.showtb3 = true
            this.navListIndexValue = '航空伽玛能谱测量'
          }
          if (id === '10094') {
            this.showtb1 = false
            this.showtb4 = true
            this.navListIndexValue = '航空重力测量'
          }
          if (id === '10101') {
            this.showtb1 = false
            this.showtb5 = true
            this.navListIndexValue = '物探科研'
          }
          if (id === '10111') {
            this.showtb1 = false
            this.showtb6 = true
            this.navListIndexValue = '航空遥感测量'
          }
          if (id === '10121') {
            this.showtb1 = false
            this.showtb7 = true
            this.navListIndexValue = '遥感科研'
          }
          if (id === '10131') {
            this.showtb1 = false
            this.showtb8 = true
            this.navListIndexValue = '航空影像'
          }
          if (id === '10141') {
            this.showtb1 = false
            this.showtb9 = true
            this.navListIndexValue = '1：25万航磁系列图件'
          }
          if (id === '10142') {
            this.showtb1 = false
            this.showtb10 = true
            this.navListIndexValue = '1：250万航磁系列图件'
          }
          if (id === '10143') {
            this.showtb1 = false
            this.showtb11 = true
            this.navListIndexValue = '遥感解译成果图件'
          }
          if (id === '10152') {
            this.showtb1 = false
            this.showtb12 = true
            this.navListIndexValue = '高分一号'
          }
          if (id === '10153') {
            this.showtb1 = false
            this.showtb13 = true
            this.navListIndexValue = '高分二号'
          }
          if (id === '10151') {
            this.showtb1 = false
            this.showtb14 = true
            this.navListIndexValue = '资源02C'
          }
          if (id === '11311') {
            this.showtb1 = false
            this.showtb15 = true
            this.navListIndexValue = '航片'
          }
          if (id === '11312') {
            this.showtb1 = false
            this.showtb16 = true
            this.navListIndexValue = '测区'
          }
          return state.navListIndex
        }
      }),
      ...mapState('user', {
        token(state) {
          return state.token
        }
      }),
      // 在methods里对activeName进行了赋值，导致其改变，直接在mapState中使用会报错，所以设置set方法避免该错误.
      activeName: {
        get: function () {
          return this.$store.state.searchStore.activeName
        },
        set: function (newValue) {
          this.$store.state.searchStore.activeName = newValue
        }
      }
    },
    watch: {
      tables(val){
        // 为了可以实时的让vue更新某个查询条件的数据，给他的key增加一个时间戳值，保证不重复，每次都是新的
        this.timeKey = new Date().getTime()
        console.log(this.tables,"tables变化")
      },
      clientdata(val) {
        this.clientHeight = val
        this.init(val)
        if (this.activeName === 'result' || this.activeName === 'shopCar') {
          this.tableW = (val - 295) / 50 + 'rem'
        } else {
          this.tableW = (val - 240)
        }
      },
      tabelPopdata(val) {
        if (val[0] === 1) {
          this.switchingFlag = false
          // this.switchingNameFlag = false
          this.switchingName = '显示点选结果'
          this.tableData = this.tableDataT
          this.total = this.totalT
          this.switchingNameFlag = false
          if(this.nodeId === '1000310'){
            this.query(this.queryObj)
          }else{
            this.newQuery(this.queryObj)
          }
        } else {
          this.switchingName = '显示全部结果'
          this.switchingNameFlag = true
          this.switchingArrPoint = val
          this.tableData = val
          this.switchingNameFlag = true
          this.total = val.length
          this.timeKey = new Date().getTime()
        }
      },
      activeName(val) {
        console.log(val, '00000')
        this.menuShow = true
        if (val === 'result' || val === 'shopCar') {
          this.tableW = (this.clientHeight - 295) / 50 + 'rem'
        }
      },
      navListIndex(val) {
      },
      switchingSelect(val) {
        this.setSwitchingSelect(val)
      },
      resultStr(val) {
        if (val.length > 0) {
          this.tableData.map((item, index) => {
            item.isSelect = false
            if (val.includes(item.F_DATAID.toString())) {
              item.isSelect = true
            }
            this.$set(this.tableData, index, item)
          })
          this.switchingTableArr.forEach(item => {
            if (val.indexOf(item.F_DATAID.toString()) > -1) {
              item.isSelect = true
            }
            if (val.indexOf(item.F_DATAID.toString()) === -1) {
              item.isSelect = false
            }
          })
        } else {
          this.tableData.forEach((item, index) => {
            item.isSelect = false
            this.$set(this.tableData, index, item)
          })
          this.switchingTableArr.forEach((item, index) => {
            item.isSelect = false
          })
        }
      },
      nodeId() {
        this.resetChartlet()
        this.total = 0
        this.tableData = []
      },
      tableD() {
        this.total = 0
        this.tableData = []
        this.setActiveName('condition')
      },
      menuShow() {
        this.$refs['cy-result_hb'].style.right = this.menuShow ? 0 : '-26vw'
      },
      token(val) {
        if (val) {
          this.shopFlag = true
          this.shopInitTable()
          this.getShopId()
        } else {
          this.shopFlag = false
          this.shopTableData = []
        }
      },
      tableData(newVal, oldVal) {
        oldVal.map(item => {
          if (item.isSelect) {
            this.str += item.F_DATAID + ','
          }
        })
        this.getShopId()
      },
      shopAgen(val) {
        this.shopInitTable()
        this.getShopId()
      },
      allScaleControl() {
        alert()
      }
    },
    activated() {
      this.tableW = (document.documentElement.clientHeight - 240)
    }
  }
</script>

<style lang="scss">
  @import '@/assets/css/global.scss';


  .resultDZ .el-checkbox__label {
    font-size: 13px !important;
    padding-left: 0px !important;
    padding-right: 4px !important;
  }

  .resultDZ .resultButton {
    cursor: pointer;
    background: #4978f1;
    padding: 0px 7px;
    color: #fff;
    font-size: 13px;
  }

  #exportButton {
    color: black;
    padding: 7px 7px;
    background-color: white;
  }

  #exportButton:hover {
    background-color: rgba(0, 0, 255, 0.1);
    cursor: pointer;
  }

  #exportButtons {
    color: black;
    padding: 7px 7px;
    background-color: white;
  }

  #exportButtons:hover {
    background-color: rgba(0, 0, 255, 0.1);
    cursor: pointer;
  }

  .cy-result_hb {
    position: absolute;
    width: 26vw;
    /*right: 0;*/
    right: 0;
    z-index: 1;
    top: $cyresultTop;
    transition: right 0.8s;
    border-left: 1px solid #E5E6E5;
    //滚动条的宽度
    ::-webkit-scrollbar {
      background-color: #DAEBFE;
    }

    //滚动条的滑块
    ::-webkit-scrollbar-thumb {
      background-color: #0065F7;
      border-radius: 3px;
    }

    .donghua {
      animation: 0.3s ease-out forwards;
      animation-name: fadeinR-data-v-5567753a;
    }

    .tabClass {
      background-color: #fff;
      opacity: 0.9;

      .el-tabs__content {
        padding: 0 8px 0 10px;
      }
    }

    .resultTitle {
      width: 100%;
      height: 48px;
      background-color: #ffffff;
      opacity: 0.9;
      font-weight: 500;
      font-size: 16px;
      color: #000;
      overflow: hidden;

      span {
        display: inline-block;
        height: 51px;
        line-height: 51px;
        width: 50%;
        text-align: center;
        background: #F0F4FE;
        font-size: 16px;
        float: left;
        cursor: pointer;
      }

      .isactive {
        border-top: 5px solid #3D6EF1;
        background: #FFF;
        color: rgba(61, 110, 241, 1);
        height: 46px;
        line-height: 41px;
      }
    }

    .icon {
      position: absolute;
      right: 500px;
      top: 1px;
      z-index: 1;
      color: $bg;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 4px 0 0 0;
      background: #fff;
      text-align: center;
      line-height: 58px;
      border-right: none;
    }

    .dataMenu {
      position: absolute;
      right: 499px;
      top: 57px;
      color: $bg;
      cursor: pointer;
      z-index: 1;
    }

    .conditionDiv {
      width: 103%;
      overflow: hidden;
      /*position: absolute;*/
      overflow-x: auto;
      overflow-y: auto;
      /*height: 400px;*/
      button {
        margin: 0.3rem 0;
      }

      .cont {
        position: relative;
        /*height: 20px;*/
        display: flex;
        align-items: center;
        padding: 0.1rem 0;
        // border-bottom: 1px solid #eee;
        font-size: 0.3rem;

        .conditionSpan {
          text-align: right;
          width: 20%;
          padding-right: 10px;
          font-size: 14px !important;
        }

        .content {
          flex: 3.5;
        }
      }

      .searchFunc {
        width: 100%;
        text-align: center;
      }
    }

    .resultDiv {
      .resultPagination {
        line-height: 26px;
        width: 100%;
        text-align: center;
        height: 40px !important;
        /*width: 100%;*/
        /*margin-right: calc(50% - 134px);*/
        vertical-align: unset !important;
        font-size: 13px !important;
        color: #606266 !important;

        .el-pagination__jump {
          margin-left: 0 !important;
        }

        .el-pagination button, .el-pagination span:not([class*=suffix]) {
          font-size: 13px !important;
          vertical-align: unset !important;
        }
      }
    }

    .shopDiv {
      .resultPagination {
        width: 100%;
        text-align: right;
        // margin: 0.1rem 0;
      }
    }

    .el-dialog__body {
      padding: 10px 20px !important;
    }
  }

  .tableLimit tr td .cell {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    /*可以显示的行数，超出部分用...表示 */
    -webkit-box-orient: vertical;
  }

  .resultDiv .el-table th > .cell,
  .shopDiv .el-table th > .cell {
    width: 100% !important;
    height: 34px;
    line-height: 34px;
    background-color: #D4DFFB;
    color: #000;
    /*height: 25px;*/
    /*line-height: 25px;*/
    /*margin: 0;*/
    /*padding: 0;*/
  }

  .resultDiv .el-table tbody tr td > .cell,
  .shopDiv .el-table tbody tr td > .cell {
    height: 34px;
    line-height: 34px;
  }

  .resultDiv .el-table .ascending {
    border-bottom-color: #0061F7;
  }

  .resultDiv .el-table .descending {
    border-top-color: #0061F7;
  }

  .resultDiv .el-table--small th,
  .shopDiv .el-table--small th {
    /*width: 107%;*/

    /*margin: 0;*/
    padding: 0;
  }

  .resultDiv .el-table--small td,
  .shopDiv .el-table--small td {
    /*width: 107%;*/
    /*margin: 0;*/
    padding: 0;
  }

  .el-message {
    float: right;
    right: 600px;

  }

  /***从右到左的动画  end**/
  .el-notification {
    opacity: 0.7;
    //bottom: -6px !important;
    z-index: 3004;
    right: 491px !important;
    height: 58px;
    margin: 7px;
    padding: 0;
    border-radius: 12px;
    padding-top: 12px;
  }

  .el-notification .el-icon-info {
    display: none !important;
  }

  .resultImg {
    position: absolute;
    border-radius: 5px 0 0 5px;
    left: -.48rem;
    color: rgba(0, 116, 214, .9);
    cursor: pointer;
    top: calc(50% - 28px);
    transform: rotate(180deg);
    height: 60px;
    // top: 0;
  }

  .cy-result_hb .resultDivZH {
    margin-top: 5px;
    overflow: hidden;
    height: $resultDivZH;
    background: #fff;

    #tab-ExcelQuery {
      color: #ccc !important;
    }

    .el-tabs__content {
      padding: .2rem;
    }

    .el-tabs__nav {
      width: 100%;
    }

    .el-tabs__active-bar {
      left: 15%;
    }

    .el-tabs__header {
      line-height: 1rem;
      margin: 0;
    }

    .el-tabs__item {
      width: 20%;
      text-align: center;
      padding: 0 !important;
      margin: 0 15%;
    }
  }

  .txnoif_bto {
    margin-top: 5px;
    overflow: hidden;
    height: $resultDivZH;
    background: #fff;
  }

  .conditionDiv {
    width: 103%;
    overflow: hidden;
    /*position: absolute;*/
    overflow-x: auto;
    overflow-y: auto;
    /*height: 400px;*/
    button {
      margin: 0.3rem 0;
    }

    .cont {
      position: relative;
      display: flex;
      align-items: center;
      padding: 0.1rem 0;
      font-size: 0.26rem;

      .conditionSpan {
        text-align: right;
        /*flex: 1.5;*/
        width: 25%;

        .el-tabs__content {
          padding: .2rem;
        }

        .el-tabs__nav {
          width: 100%;
        }

        .el-tabs__active-bar {
          left: 15%;
        }

        .el-tabs__header {
          line-height: 1rem;
          margin: 0;
        }

        .el-tabs__item {
          width: 20%;
          text-align: center;
          padding: 0 !important;
          margin: 0 15%;
        }

        padding-right: 10px;
      }

      .content {
        flex: 3.5;
      }
    }

    .searchFunc {
      width: 100%;
      text-align: center;
    }

    .resultPagination {
      height: 40px !important;
      width: 100%;
      margin-right: calc(50% - 134px);
      vertical-align: unset !important;
      font-size: 14px;
      color: #606266 !important;
    }
  }

</style>
