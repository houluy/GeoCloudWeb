<template>
  <div @mouseenter="updateXY" @mouseleave="updateXYOut" class="cy-result cy-result_hb" ref="cy-result">
    <div>
      <img class="resultImg" height="100" :title="this.resultImgFlag ? '收缩': '展开'"
           :src="this.resultImgFlag ? require('@/assets/images/search/arrowz21.png') : require('@/assets/images/search/arrowz22.png')"
           @click="handleMenu">
      <div style="" class="resultTitle">
        <span @click="spanClickS('condition')" :class="{isactive: this.activeName === 'condition'}">数据查询</span>
        <span @click="spanClickS('result')" :class="{isactive: this.activeName === 'result'}">查询结果</span>
      </div>
      <div v-show="this.activeName === 'condition'" class="resultDivZ">
        <el-tabs style="background: #fff;border-radius: 8px;" @tab-click="handleClick" v-model="activeNameT">
          <!-- 查询条件 -->
          <el-tab-pane stretch="true" label="属性查询" class="conditionDiv" name="propertyQuery">
            <searchCondition @handleSearchCondition="handleSearchCondition"
                             :queryFieldsListValues="queryFieldsListValues" :tables="tables" :tablesZ="tablesZ"
                             :sensorData="sensorData"/>
          </el-tab-pane>
          <el-tab-pane stretch="true" label="Excel查询" class="resultDiv" name="ExcelQuery">
            <el-radio-group @change="changeRadio" style="font-size: 13px; line-height: 30px;" v-model="radioDataZ">
              <el-radio label="sceneId">景号</el-radio>
              <el-radio label="productId">产品号</el-radio>
              <el-radio label="fileName">文件名</el-radio>
              <el-radio label="path_row">path+row+轨道号</el-radio>
            </el-radio-group>
            <div style="margin-top: 10px; height:36px;">
              <el-input :disabled="true" v-model="execlD"
                        style="width: 77%; float: left; margin-right: 13px;"></el-input>
              <div style="float: left">
                <uploadShp @toolsFeatureExecl="toolsFeatureExecl"/>
              </div>
            </div>
            <div class="contionDivZ">
              <img v-on:mouseover="changeActive($event)" v-on:mouseout="removeActive($event)"
                   src="@/assets/img/info_tx.png" alt="" class="contionImg">
              <span class="contionSpanD">点击下载&nbsp;<a :href=hrefData
                                                      :download="hrefShowData + '.xls'">{{ this.hrefShowData }}</a>&nbsp;查询专用Excel模板</span>
            </div>
            <div class="contionDivZLast" v-if="this.notDataListZ.length > 0">
              <img src="@/assets/img/iimg.png" alt="">
              <span class="contionDivZLastSpan" @click="dialogVisibleDetail = true">点击查看未匹配数据列表</span>
              <el-button size="mini" type="primary" @click="export2Excel">导出</el-button>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="newTimeD" v-if="newTimeData !== ''">
          <span style="font-size: 14px">当前最新数据的采集时间：</span>
          <span class="spanColor">{{ newTimeData }}</span>
        </div>
        <div style="width: 100%;text-align:center;">
          <el-button class="resultSearchButton" :type="styles.btnColor" size="small" @click="searchFunc"
                     style="margin-top: .2rem;">查 询
          </el-button>
          <el-button v-if="!butD" class="resultSearchButton" type="primary" plain size="small" @click="resettingFunc"
                     style="margin-top: .2rem;">重 置
          </el-button>
          <el-button disabled v-if="butD" class="resultSearchButton" type="primary" plain size="small"
                     style="margin-top: .2rem;">重 置
          </el-button>
        </div>
      </div>
      <div class="txnoif" v-if="txNoinfo">
        <span class="txnoif_zy"></span>
        <p>使用专用模板才能正确查导数据：</p>
        <p>1.根据检索项下载专用excel模板</p>
        <p>2.按照模板格式进行信息填</p>
        <p>3.上传填写后的Excel文件</p>
      </div>
      <div class="txnoif_bto" v-show="this.activeName === 'result'">
        <div style="padding: .3rem .2rem;" class="resultDZ">

          <el-checkbox v-show="switchingNameFlag" v-model="checkedDataz" @change="checkedDataAll" >全选</el-checkbox>
          <button @click="currentPageChartlet" :class="{buttonActive: buttonActiveD, bottZ: true}">叠加
          </button>
          <button @click="handleAddShop" style="margin-left: 5px" class="bottDz">订购</button>
          <el-row style="display: inline-block;position: relative;bottom: -6px;" class="export">
            <el-col>
              <el-dropdown>
                <span>
                  <button slot="reference" class="bottDz" v-show="isDownload">
                  <i class="el-icon-download"></i>导出</button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <button id="exportButton" @click="deriveShopDateOnlyShp">导出落图</button>
                  <br>
                  <button id="exportButtons" @click="deriveQuickViewImg">导出快视图</button>
                  <br>
                  <button id="exportButtons" @click="deriveNo" v-if="yxButton">导出未覆盖</button>
                  <br>
                  <button id="exportButtons" @click="deriveYxNo" v-if="!yxButton">导出优选未覆盖</button>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
          <button @click="dataListSelect" style="background-color: #2E6DFC; color: #FFFFFF" :class="{buttonActive: buttonSelect, bottDzS: true}">数据筛选</button>
          <button @click="dataListSelectYx" v-if="yxButton" style="background-color: #2E6DFC; color: #FFFFFF" :class="{buttonActive: buttonSelect, bottDzS: true}">数据优选</button>
          <button @click="addYx" v-if="yxButton" style="background-color: #2E6DFC; color: #FFFFFF" :class="{buttonActive: buttonSelect, bottDzS: true}">添加优选</button>
          <button @click="delYx" v-if="!yxButton" style="background-color: #2E6DFC; color: #FFFFFF" :class="{buttonActive: buttonSelect, bottDzS: true}">优选移除</button>
        </div>
        <div class="txnoif_bto2" v-show="buttenShow">
            <el-radio-group v-model="changeDataList"  border="true" style="margin-left: 20%;">
              <el-radio-button label="全部记录" style="letter-spacing: 15px;"></el-radio-button>
              <el-radio-button label="优选结果" style="letter-spacing: 15px;"></el-radio-button>
            </el-radio-group>
        </div>


        <!-- 影像查询结果 -->
        <div class="tableD">
          <el-table
            class="resultDataTable"
            ref="singleTable"
            :data="tableData"
            :key="timeKey"
            size="mini"
            stripe
            :height="tableW"
            style="width: 100%; margin-bottom: 20px;cursor: pointer;overflow-y: auto"
            highlight-current-row
            @cell-mouse-enter="handleRowHover"
            @row-dblclick="handleShowDetail"
            @cell-mouse-leave="handleRowLeave"
            v-if="currentTable"
          >
            <!--@sort-change="changeTableSort"-->
            <!-- 静态列 -->
            <el-table-column width="30">
              <template slot="header">
                <!-- 全选当前页 -->
                <el-checkbox v-model="imageAllCheck" @change="currentPageAllSelect"></el-checkbox>
              </template>
              <template slot-scope="scope">
                <div>
                  <!--每条数据前面的多选框-->
                  <el-checkbox :key="scope.$index" @change="handleTableChange(scope.$index, scope.row)"
                               v-model="scope.row.isSelect"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="90" align="left">
              <template slot-scope="scope">
                <div style="cursor: pointer;">
                  <img title="详情" style="width: 34px; height: 27px;" :src="scope.row.imageurl">
                  <img v-if="tieImg" title="叠图" style="width: .3rem;cursor: pointer;"
                       @click.stop="handleChartlet(scope.row)" :src="scope.row.isMapping ? overlayNoSrc : overlaySrcs">
                  <img title="定位" style="width: .3rem;cursor: pointer;" @click.stop="handleLocation(scope.row)"
                       src="@/assets/images/search/dingwei.png">
                  <img title="已被优选" style="width: .3rem;cursor: pointer;" v-show="scope.row.isYx" src="@/assets/images/search/youxuan.png">
                </div>
              </template>
            </el-table-column>
            <!-- 动态列 -->
            <el-table-column class="tableWidthD" v-show="showCon.length > 0"
                             :sortable="item.alisaName !== '数据名称' ? zsortable : !zsortable"
                             v-for="(item, index) in showCon" :key="index" style="text-align: center;"
                             :prop="item.name.toUpperCase()" :label="item.alisaName">
              <template slot-scope="scope">
                <div v-show="item.name.toUpperCase() !== 'F_RECEIVETIME'" :title="scope.row[item.name.toUpperCase()]">
                  {{ getTabele(scope.row[item.name.toUpperCase()]) }}
                </div>
                <div v-show="item.name.toUpperCase() === 'F_RECEIVETIME'">
                  <p>{{ scope.row[item.name.toUpperCase()].slice(0, 10) }}</p>
                  <p>{{ scope.row[item.name.toUpperCase()].slice(10, 19) }}</p>
                </div>
              </template>
            </el-table-column>
            <!--购物车-->
            <el-table-column width="40">
              <template slot-scope="scope">
                <div>
                  <img v-show="scope.row.isShop" src="@/assets/img/shoppingZ.png" style="width: .4rem;"/>
                </div>
              </template>
            </el-table-column>
            <!-- 动态列结束 -->
          </el-table>
          <!--优选结果数据-->
        </div>
        <div style="padding: 0 .2rem" v-if="currentTable">
          <!-- 查询结果分页 -->
          <div class="resultPagination" style="line-height: 26px; text-align: center;">
            <span style="font-size: 13px; float: right; color: #606266;">总共 {{ this.totalNum }} 页</span>
            <el-pagination
              class="resultPagination_z"
              style="margin-left: 0 !important; float:right;"
              :current-page="currentPage"
              :page-size="pageSize"
              small
              :pager-count="indexSize"
              @current-change="handleCurrentChange"
              layout="total, prev, jumper, next "
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <dialogShowDetail :dialogShowData=dialogShowData :titleDialog=titleDialog></dialogShowDetail>
    <dialogResult @dialogCallBack="dialogCallBack" :dataListShow=dataListShow></dialogResult>
    <cyResultYx ref="cyResultYx" @cyResultYxCallBack="cyResultYxCallBack" :allYxData=allYxData></cyResultYx>
    <toolsVue ref="toolsVue" v-show="false"></toolsVue>
    <el-dialog
      :title="hrefShowDataTitle"
      :visible.sync="dialogVisibleDetail"
      class="dialog_content"
      :append-to-body='true'
      width="57%">
      <div class="eldialog_con_z">
        <div class="eldialog_con_list">
          <!--<el-checkbox-group v-model="checkedDialogD">-->
          <!--<el-checkbox v-for="(item, index) in showDiaLogDataList" :label="item.label" :key="index">{{item.label}}</el-checkbox>-->
          <!--</el-checkbox-group>-->
          <span class="spanDataListZ" style="" v-for="(item, index) in notDataListZ"
                :key="index">{{ index + 1 }}, {{ item.value }}</span>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="export2Excel">导 出</el-button>
      </div>
    </el-dialog>
    <!--数据优选弹窗-->
    <el-dialog
      title="数据优选"
      :visible.sync="isOptimization"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%">
      <div>
        <el-form ref="form" label-width="80px">
          <el-radio-group v-model="yxType">
            <el-radio  label="F_CLOUDPERCENT">云量越少越好</el-radio>
            <el-radio  label="F_LOCATION">分辨率越高越好</el-radio>
            <el-radio  label="F_RECEIVETIME">时间越新越好</el-radio>
          </el-radio-group>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="getYouXuanShow(2)">数据优选使用手册</el-button>
            <el-button @click="getYouXuanShow(0)">取 消</el-button>
            <el-button type="primary" @click="getYouXuanShow(1)">确 定</el-button>
          </span>
    </el-dialog>
    <!--添加优选弹窗-->
    <el-dialog
      title="添加优选"
      :visible.sync="addOptimization"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%">
      <div>
        <span>是否确定将已选数据添加到数据优选后结果？</span>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button @click="addYxShow(0)">取 消</el-button>
            <el-button type="primary" @click="addYxShow(1)">确 定</el-button>
          </span>
    </el-dialog>
    <!--订购数据是否将与之配对的数据也一并加入购物车弹窗-->
    <el-dialog
      title="数据订购配对"
      :visible.sync="addPairDataDialog"
      :append-to-body="true"
      :close-on-click-modal="false"
      :show-close="false"
      width="30%">
      <div>
        <span>检测到您订购的数据有对应的配对数据没有勾选，是否一并将配对数据添加到购物车</span>
      </div>
      <span slot="footer" class="dialog-footer">
            <el-button id="confirmButton" type="primary" @click="addPairDataDialog = false; addPairData = true">确定</el-button>
            <el-button id="cancelButton" @click="addPairDataDialog = false; addPairData = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import Vue from 'vue'
  import Stroke from 'ol/style/Stroke'
  import Fill from 'ol/style/Fill'
  import Style from 'ol/style/Style'
  import http from '@comm/service/interface.js'
  import uploadShp from './uploadExecl'
  import styles from '@/assets/css/global.scss'
  import {getToken, setToken} from '@comm/utils/auth'
  import {gisMap} from '@comm/map/map_globel.js'
  import {mapActions, mapState} from 'vuex'
  import searchCondition from '@comm/components/searchCondition.vue'
  import dialogShowDetail from '@comm/components/dialogShowDetail.vue'
  import dialogResult from '@comm/components/dialogResult.vue'
  import cyResultYx from '@comm/views/search/components/cy-resultyx.vue'
  import toolsVue from '@comm/views/Layout/components/mapComponent/tools.vue'

  import moment from 'moment'
  import Tools from "../../manage/person/components/tools0rder"; //导入文件
  Vue.prototype.$moment = moment;//赋值使用
  export default {
    name: 'cy-result',
    components: {
      Tools,
      uploadShp,
      searchCondition,
      dialogResult,
      dialogShowDetail,
      cyResultYx,
      toolsVue
    },
    data() {
      return {
        // 是否添加配对数据到购物车
        addPairData: false,
        // 是否添加配对数据到购物车的控制显示
        addPairDataDialog: false,
        // 添加优选弹窗的控制显示
        addOptimization: false,
        // 优选弹窗的控制显示
        isOptimization: false,
        // 优选弹窗的控制显示
        buttenShow: false,
        // 合并面
        heBingMian: [],
        // 优选按钮是否选中
        isYxData: false,
        // 控制数据优选按钮显示
        yxButton: true,
        // 为了给vuex中allYxData的值存入多个对象，使用这个变量组合，并存入vuex中allYxData的yxData对象，方便优选页面获取各个参数使用
        yxData: {},
        // 当前页面查询结果table列表是否展示
        currentTable: true,

        scrollTop: null,
        resStatus: '',
        progress: 0,
        timeKey: 0,
        butD: false,
        wktlistData: [],
        temptimeChange: '',
        tiemsFun: null,
        dataListShow: false,
        selectedOption: 'F_CLOUDPERCENT',
        selectedButton: 1,
        yxType: 'F_CLOUDPERCENT',
        tieImg: window.chartletShow,
        dataListShowD: '',
        indexSize: 5,
        totalNum: 0,
        checkedDialogD: [],
        showDiaLogDataList: [
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          },
          {
            label: 'T01_400044.Jpg'
          }
        ],
        titleDialog: '数据详情',
        dialogShowData: {},
        dialogShowDataId: '',
        dialogVisibleDetail: false,
        numbThree: 3,
        href_jh: '',
        txNoinfo: false,
        screenDataAll: [],
        buttonActiveD: false,
        buttonSelect: false,
        tabelPopdataShow: true,
        buttonActiveSeamless: false,
        checkedDataz: false,
        radioDataZ: 'sceneId',
        execlD: '',
        hrefData: '../../../../static/jhexecl.xls',
        hrefShowData: '景号',
        hrefShowDataTitle: '未匹配数据清单-景号',
        execlDName: '',
        resultImgFlag: true,
        activeNameT: 'propertyQuery',
        tokenZ: '',
        imageAllCheck: false,
        switchingArrPoint: [],
        showMZ: true,
        featureCurrent: false,
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
        switchingName: '显示点选结果',
        switchingFlag: false,
        switchingArr: [],
        switchingTableArr: [],
        AllTableDataArr: [],
        TableDataArr: [],
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
        nameDownLoad: '下载',
        isDownload: true,
        nodeShowId: '',
        tableW: '',
        height: '',
        imgSrc: require('@/assets/img/rigth.png'),
        imgUrl: require('@/assets/img/left.png'),
        imgUrlT: require('@/assets/img/rigth.png'),
        nameAllSelect: '当前页全选',
        nameChartlet: '叠加',
        shopFlag: false,
        styles,
        menuShow: true,
        vueArr: [],
        // 查询全局对象
        queryObj: {},
        notDataListZ: [],
        // 覆盖率弹窗
        guid: null,
        areaCode: '',
        pageSize: 30,
        currentPage: 1,
        total: 0,
        totalT: 0,
        shopCurrentPage: 1,
        shopPageSize: 6,
        shopTotal: 0,
        shopTableData: [],
        shopRecordsData: [],
        addZLshopShow: false,
        zsortable: true,
        tableName: {},
        showCon: {},
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
        // 贴图默认
        isOverlay: false,
        overlaySrcs: require('@/assets/images/search/tucenZ.png'),
        overlayNoSrc: require('@/assets/img/tietux_open.png'),
        overlayisSeamless: require('@/assets/img/isSeamless_open.png'),
        overlayNoSeamless: require('@/assets/images/search/wufeng.png'),
        overLayImg: require('@/assets/img/zy302a_mux_015524_005124_20190317112435_01_sec_0004_1904027580_pre.png'),
        obj: {},
        overLayKUrlImg: 'http://10.82.8.57:9527/metaImage/GF2/2019/11/13/1194923599613145089/1194923599613145089_quick.jpg',
        overLayMUrlImg: 'http://10.82.8.57:9527/metaImage/GF2/2019/11/13/1194923599613145089/1194923599613145089_thumb.jpg',
        overLayTUrlImg: 'http://10.82.8.57:9527/metaImage/GF2/2019/11/13/1194923599613145089/1194923599613145089_shape.jpg',
        paramRowData: {
          alias: '',
          description: ''
        },
        newNodeId: '',
        isNoWkt: 1,
        satelliteParamRowData: {},
        paramRowimageData: '',
        dialog_img_detail: '',
        dialogListData: [],
        dialogListDataInit: [
          {
            label: '轨道号',
            value: '12312'
          },
          {
            label: '景PATH-ROW',
            value: 'sfsf'
          },
          {
            label: '采集时间',
            value: '3333'
          },
          {
            label: '产品类型',
            value: 'rtb4rb'
          },
          {
            label: '空间分辨率（米）',
            value: '43rbrr'
          },
          {
            label: '产品序列号',
            value: 'qt4e34'
          },
          {
            label: '卫星偏航角',
            value: '3b44'
          },
          {
            label: '拍摄卫星',
            value: '45rnb34'
          },
          {
            label: '数据ID',
            value: '35rn'
          },
          {
            label: '相机',
            value: ''
          },
          {
            label: '云量',
            value: ''
          },
          {
            label: '产品级别',
            value: ''
          },
          {
            label: '景号',
            value: ''
          },
          {
            label: '景中心经度',
            value: ''
          },
          {
            label: '左上角经度',
            value: ''
          },
          {
            label: '左下角经度',
            value: ''
          },
          {
            label: '右上角经度',
            value: ''
          },
          {
            label: '右下角经度',
            value: ''
          },
          {
            label: '卫星俯仰角',
            value: ''
          },
          {
            label: '卫星滚转角',
            value: ''
          },
          {
            label: '相机滚转角',
            value: ''
          },
          {
            label: '景中心纬度',
            value: ''
          },
          {
            label: '左上角纬度',
            value: ''
          },
          {
            label: '左下角纬度',
            value: ''
          },
          {
            label: '右上角纬度',
            value: ''
          },
          {
            label: '右下角纬度',
            value: ''
          },
          {
            label: '相机俯仰角',
            value: ''
          }
        ],
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
          }
        ],
        clientHeight: '',
        clientWidth: '',
        allcheckvalue: [],
        queryFieldsListTables: [],
        queryFieldsListValues: [],
        newTimeData: '',
        arrList: [
          {
            value: 'sceneId',
            label: '景号',
            hrefData: '../../../../static/jhexecl.xls'
          },
          {
            value: 'productId',
            label: '产品号',
            hrefData: '../../../../static/productNb.xls'
          },
          {
            value: 'fileName',
            label: '文件名',
            hrefData: '../../../../static/projectName.xls'
          },
          {
            value: 'path_row',
            label: 'path+row+轨道号',
            hrefData: '../../../../static/pathrow.xls'
          }
        ],
        sensorData: [],
        intervalDays: 0 //时间间隔，结束时间减去开始时间
      }
    },
    created() {
      this.tableW = (document.documentElement.clientHeight - 280) / 50 + 'rem'
    },

    mounted() {
      this.tokenZ = sessionStorage.getItem('token')
      this.clientHeight = `${document.documentElement.clientHeight}`
      // 获取浏览器可视区域高度
      this.clientWidth = (`${document.documentElement.clientWidth}` - 165) / 2 // 获取浏览器可视区域高度
      this.init(this.clientHeight)
      // this.initCanvas()
      if (this.navHide) {
        this.height = (document.documentElement.clientHeight - 125) / 50 + 'rem'
      } else {
        this.height = (document.documentElement.clientHeight - 280) / 50 + 'rem'
      }

      setTimeout(() => {
        this.getNewtimeD()
        if (localStorage.getItem('userName')) {
          this.shopInitTable()
          this.shopFlag = true
        }
        if (sessionStorage.getItem('actid')) {
          this.getWKTInit(sessionStorage.getItem('actid'))
        }
      }, 500)

    },
    methods: {

      stopFactoryHuMen(){
        // 获取URL中的taskId参数
        let urlParams = new URLSearchParams(window.location.search)
        urlParams.get('taskId')


      },
      getWKTInit(param) {
        http.getWktInfoHome({actid: param, suboutpath: this.$route.query.suboutpath}).then(res => {
          console.log(res, 'res.data')
          if (res.data.wkt) {
            let feature = {
              'attributes': {},
              'style': {
                fillcolor: 'rgb(255, 255, 255, 0)',
                strokecolor: 'red',
                strokewidth: 2
              },
              'geometry': res.data.wkt
            }
            // 添加面到地图
            this.setQueryStatus(1)
            this.setWkt(res.data.code)
            gisMap.drawPolygon(feature)
            gisMap.flyTo(gisMap.transformFeatureFromWkt(res.data.wkt))
          }
        })
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
      getSensortransData() {
        http.getSensortrans({
          currentPage: 1,
          pageSize: 1000
        }).then(res => {
          if (res.data && res.data.records.length > 0) {
            this.sensorData = res.data.records
          } else {
            this.sensorData = []
          }
        })
      },
      getAllTableDataArr(val) {
        let indexAllArr = []
        if (val.length > 0) {
          val.forEach(item => {
            if (!item.isSelect) {
              indexAllArr.push(item)
            }
          })
          if (indexAllArr.length > 0) {
            this.checkedDataz = false
          } else {
            this.checkedDataz = true
          }
        } else {
          this.checkedDataz = false
        }
      },
      // 全选所有页
      checkedDataAll(val) {
        if(this.yxData.tableShowYx === 'block'){
          //优选
          this.$refs.cyResultYx.checkedDataAll(this.checkedDataz)
          return
        }
        // 清空当前点选数据所有勾选
        this.switchingSelect = []
        this.TableDataArr = []
        let dataALL = []
        // 筛选数据和全部数据的区分 this.buttonSelect = true 是筛选数据 否则就是  全部数据
        if (this.buttonSelect) {
          dataALL = this.screenDataAll
        } else {
          dataALL = this.AllTableDataArr
        }
        if (this.checkedDataz) {
          dataALL.map((item, index) => {
            item.isSelect = true
            this.$set(dataALL, index, item)
            item.F_RECEIVETIME = this.commonMethod.timestampToTime(item.F_RECEIVETIME)
            item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.F_DID + '&nodeId=' + item.NODEID
            this.TableDataArr.push(item)
          })
          this.tableData.map((item, index) => {
            item.isSelect = true
            this.$set(this.tableData, index, item)
            // 当前点选数据所有勾选
            this.switchingSelect.push(item.F_DID.toString())

            let i = this.TableDataArr.findIndex(da => da.F_DID == item.F_DID);
            if (i === -1) {
              this.TableDataArr.push(item)
            } else {
              this.$set(this.TableDataArr, i, item)
            }
          })
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].isSelect = true
          }
          this.imageAllCheck = true
        } else {
          // 清空当前点选数据所有勾选
          this.switchingSelect = []
          // 所有页数据全设置为取消选择
          this.AllTableDataArr.map((item, index) => {
            item.isSelect = false
            this.TableDataArr = []
          })
          // 当前页数据全设置为取消选择
          this.tableData.map((item, index) => {
            item.isSelect = false
          })
          dataALL.map((item, index) => {
            item.isSelect = false
            this.$set(dataALL, index, item)
            item.F_RECEIVETIME = this.commonMethod.timestampToTime(item.F_RECEIVETIME)
            item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.F_DID + '&nodeId=' + item.NODEID
          })
          this.imageAllCheck = false
        }
      },
      getNewtimeD() {
        http.getfindNewTimeByNodeName().then(res => {
          if (res.data) {
            this.newTimeData = res.data.retuenNewTime
          }
        })
      },
      handle() {
        alert('执行测试')
      },
      init(val) {
        if (this.navHide) {
          this.height = (val - 125) / 50 + 'rem'
        } else {
          this.height = (val - 230) / 50 + 'rem'
        }
      },
      updateXY() {
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
      handleSearchCondition(val) {
        this.queryFieldsListTables = []
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

        // 为了可以跨页选择订购数据，单选的时候加一个数组供使用
        let i = this.TableDataArr.findIndex(item => item.F_DID == val.F_DID);
        // 如果当前F_DID在TableDataArr中找不到并且当前是选中状态，就往里push，若找得到但是是取消选中，那就删除这个元素
        if (i === -1) {
          if(val.isSelect === true){
            this.TableDataArr.push(val)
          }
        }else {
          if(val.isSelect === false){
            this.TableDataArr.splice(i, 1)
          }
        }

        let _this = this
        _this.switchingSelect = []
        _this.tableData.forEach(item => {
          if (item.isSelect) {
            _this.switchingSelect.push(item.F_DID.toString())
            // item.isSelect = true
            this.$set(this.tableData, index, val)
          } else {
            if (_this.switchingSelect.indexOf(item.F_DID.toString()) > -1) {
              let index = _this.switchingSelect.indexOf(item.F_DID.toString())
              _this.switchingSelect.splice(index, 1)
            }
            this.$set(this.tableData, index, val)
          }
        })
        console.log("this.AllTableDataArr", this.AllTableDataArr)
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
                if (d.档案号 === item.档案号) {
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
          _this.tableData = _this.tableDataT
          _this.total = _this.totalT
        }
        _this.switchingFlag = !_this.switchingFlag
      },
      childByValue(val) {
        this.xqDialogVisible = val
        this.setActiveName('shopCar')
        this.shopInitTable()
      },
      handleMenu1() {
        if (this.menuShow) {
          this.imgSrc = this.imgUrl
        } else {
          this.imgSrc = this.imgUrlT
        }
        this.menuShow = !this.menuShow
      },
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
      getXqIfon(row) {
        if (this.tableShow) {
          this.paramRowData = {}
          var newrow = {
            ...row
          }
          delete newrow.F_CENTERTIME,
            delete newrow.F_F_DATAID,
            delete newrow.CENTERTIME,
            delete newrow.F_RECEIVETIME,
            delete newrow.WKTRESPONSE,
            delete newrow.结束日期,
            delete newrow.起始日期,
            delete newrow.航摄开始时间,
            delete newrow.航摄结束时间,
            delete newrow.制图日期,
            delete newrow.采集时间
          this.paramRowData = newrow
        } else {
          http.getAgrsObjectById({
            label: this.nodeLabel,
            dataId: row.F_DATAID,
            nodeId: this.nodeId
          }).then(res => {
            if (res.data) {
              if (this.nodeId === '10152' || this.nodeId === '10153' || this.nodeId === '10151' || this.nodeId === '10141' || this.nodeId === '10142' || this.nodeId === '10143') {
                if (this.nodeId === '10141') {
                  res.data[0].titleValue = '详细信息-1:25万航磁系列图件'
                } else if (this.nodeId === '10142') {
                  res.data[0].titleValue = '详细信息-1:250万航磁系列图件'
                } else if (this.nodeId === '10143') {
                  res.data[0].titleValue = '详细信息-遥感解译成果图件'
                } else {
                  res.data[0].titleValue = '详细信息'
                }
                this.satelliteParamRowData = {
                  ...res.data[0]
                }
              } else {
                this.paramRowData = res.data[0]
                for (var d in this.paramRowData) {
                  if (d === '接收时间') {
                    this.paramRowData[d] = this.commonMethod.timestampToTime(this.paramRowData[d])
                  }
                }
              }
              this.paramRowimageData = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + row.F_DID + '&nodeId=' + row.nodeId
            } else {
              this.$notify({
                message: '暂无影像详情！',
                position: 'bottom-right',
                duration: 3500,
                type: 'warning'
              })
            }
          })
        }
        this.xqDialogVisible = true
      },
      // 导出shp
      exportShp() {
        let _this = this
        let objList = []
        _this.tableData.forEach(item => {
          if (item.isSelect) {
            objList.push(item)
          }
        })

        if (_this.tableData.length > 0) {
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
        }
      },
      // 双击显示详情
      handleShowDetail(row) {
        // alert("双击显示详情")
        this.setDialogShowDataZ(row)
        this.setDetailShow(1)
      },
      handleLocation(row) {
        let wkt = row.WKTRESPONSE
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
      spanClickS(val) {
        this.activeName = val
        // 向子组件 cy-resultyx 传参，关闭优选页面
        this.yxData.type = '切换'
        this.yxData.tableShowYx = 'none'
        this.setAllYxData({yxData: this.yxData})
        this.currentTable = true
      },
      handleMenu() {
        this.resultImgFlag = !this.resultImgFlag
        this.$refs['cy-result'].style.right = this.resultImgFlag ? '0rem' : '-25vw'
        document.getElementById('tools').style.right = this.resultImgFlag ? '25.2vw' : '.2vw'
        document.getElementById('mapDiv_coordinate').style.right = this.resultImgFlag ? '26.6vw' : '1.3vw'
      },
      // 鼠标移入当前行，地图合并面高亮显示
      handleRowHover(row, column, event) {
        gisMap.productTableHoverRemove(this.nodeShowId)
        let wkt = row.WKTRESPONSE
        let feature = {
          'attributes': {
            'productTable_hover': ''
          },
          'style': {
            fillcolor: 'rgba(0, 255, 0, 0)',
            strokecolor: '#00FF00',
            strokewidth: 5
          },
          'geometry': wkt
        }
        gisMap.addPoint(feature)
      },
      // 鼠标移出当前行，地图合并面取消高亮显示
      handleRowLeave(row, column, event) {
        gisMap.productTableHoverRemove(this.nodeShowId)
      },
      // 排序
      changeTableSort(column) {
        //获取字段名称和排序类型
        this.fieldName = column.prop;
        this.sortingType = column.order;
        let ll = this.getTableData(this.fieldName, this.sortingType, 1)
        let res = {
          data: {
            pageList: ll,
            total: this.buttonSelect ? this.screenDataAll.length : this.AllTableDataArr.length
          }
        }
        // 重新绘制
        let _this = this
        this.listResult(res)
      },
      // 类似后台的处理分页排序
      getTableData(sortColumn, sortingType, currentPage) {
        let list = []
        let allList = []
        if (this.buttonSelect) {
          allList = this.deepClone(this.screenDataAll)
        } else {
          allList = this.deepClone(this.AllTableDataArr)
        }
        allList.map(item => {
          item.createTime2 = this.$moment(item[sortColumn]).valueOf();
        });

        //按照降序排序
        if (sortingType == "descending") {
          allList = allList.sort((a, b) => b['createTime2'] - a['createTime2']);
        }
        //按照升序排序
        else {
          allList = allList.sort((a, b) => a['createTime2'] - b['createTime2']);
        }
        if (allList.length < 30 && currentPage === 1) {
          list = allList.slice(currentPage - 1, currentPage + 30)
        } else {
          list = allList.slice((currentPage - 1) * 30, (currentPage - 1) * 30 + 30)
        }
        this.currentPage = currentPage
        console.log(list, 'list')
        return list
      },
      // 全选当前页
      currentPageAllSelect() {
        // 清空当前点选数据所有勾选
        this.switchingSelect = []
        if (this.imageAllCheck) {
          this.tableData.map((item, index) => {
            item.isSelect = true
            this.$set(this.tableData, index, item)
            let i = this.TableDataArr.findIndex(da => da.F_DID == item.F_DID);
            if (i === -1) {
              this.TableDataArr.push(item)
            } else {
              this.$set(this.TableDataArr, i, item)
            }
            // 当前点选数据所有勾选
            this.switchingSelect.push(item.F_DID.toString())
          })
        } else {
          this.tableData.map((item, index) => {
            item.isSelect = false
            this.$set(this.tableData, index, item)
          })
          let i = this.TableDataArr.findIndex(da => da.F_DID == item.F_DID);
          if (i === -1) {
            this.TableDataArr.push(item)
          } else {
            this.$set(this.TableDataArr, i, item)
          }
          // 清空当前点选数据所有勾选
          this.switchingSelect.push([])
          this.checkedDataz = false
        }
      },
      // 当前页贴图
      currentPageChartlet() {
        if(this.yxData.tableShowYx === 'block'){
          //优选
          this.$refs.cyResultYx.currentPageChartlet()
          return
        }
        // this.resetChartlet()
        let _this = this
        this.buttonActiveD = !this.buttonActiveD
        if (this.tableData.length > 0) {
          this.tableData.forEach((item, index) => {
            let feature = {
              imagesrc: '/mj/metaImage/getImageByTypeForAll?typeId=3&dataId=' + item.F_DID + '&nodeId=' + item.NODEID,
              geometry: item.WKTRESPONSE
            }
            if (_this.buttonActiveD && !item.isMapping) {
              item.isMapping = true
              gisMap.toggleStaticImage(true, feature, item.F_DID)
            } else if (!this.buttonActiveD && item.isMapping) {
              item.isMapping = false
              gisMap.toggleStaticImage(false, feature, item.F_DID)
            }
            _this.$set(this.tableData, index, item)
          })

        }
        if (this.buttonSelect) {
          if (this.screenDataAll.length > 0) {
            for (let i = this.pageSize * (this.currentPage - 1); i < this.pageSize * (this.currentPage - 1) + this.pageSize; i++) {
              this.buttonActiveD ? this.screenDataAll[i].isMapping = true : this.screenDataAll[i].isMapping = false
            }
          }
        } else {
          if (this.AllTableDataArr.length > 0) {
            for (let i = this.pageSize * (this.currentPage - 1); i < this.pageSize * (this.currentPage - 1) + this.pageSize; i++) {
              this.buttonActiveD ? this.AllTableDataArr[i].isMapping = true : this.AllTableDataArr[i].isMapping = false
            }
          }
        }
        this.overfulfil()
      },
      // 全选无缝
      handleIsSeamlessAll() {
        this.buttonActiveSeamless = !this.buttonActiveSeamless
        if (this.buttonActiveSeamless) {
          let productTableFeatures = gisMap.featuresSource.getFeatures()
          for (let i = 0; i < productTableFeatures.length; i++) {
            gisMap.featuresSource.removeFeature(productTableFeatures[i])
          }
          if (this.tableData.length > 0) {
            this.tableData.forEach(item => {
              item.isSeamless = true
            })
          }
        } else {
          if (this.switchingTableArr.length > 0) {
            this.switchingTableArr.forEach(item => {
              let feature = {
                attributes: item.F_DATAID,
                style: {
                  fillcolor: 'rgba(255,255,255, 0.1)',
                  strokecolor: 'rgba(44,117,242, 0.5)',
                  strokewidth: 2
                },
                geometry: item.WKTRESPONSE
              }
              gisMap.addPolygon(feature)
            })
          }
          if (this.tableData.length > 0) {
            this.tableData.forEach(item => {
              item.isSeamless = false
            })
          }
        }
      },
      // 无缝
      handleIsSeamless(row) {
        let feature = {
          attributes: row.F_DATAID,
          style: {},
          geometry: row.WKTRESPONSE
        }
        row.isSeamless = !row.isSeamless
        if (!row.isSeamless) {
          feature.style = {
            fillcolor: 'rgba(255,255,255, 0.1)',
            strokecolor: 'rgba(44,117,242, 0.5)',
            strokewidth: 2
          }
          gisMap.addPolygon(feature)
        } else {
          let productTableFeatures = gisMap.featuresSource.getFeatures()
          for (let i = 0; i < productTableFeatures.length; i++) {
            if (productTableFeatures[i].attributes === row.F_DATAID) {
              gisMap.featuresSource.removeFeature(productTableFeatures[i])
            }
          }
        }
      },
      // 点击拇指图查看详情
      rowDataDetails(row) {
        if (this.hasPerm('/search/datamanage/getDetails')) {
          this.getOrderDetails({id: '' + row.F_DID, nodeId: '' + row.F_NODEID, type: 'result'})
        } else {
          this.$message({
            type: 'error',
            message: '暂无权限！'
          })
        }
      },
      // 贴片数量超额时的提示
      overfulfil() {
        let num = 0
        if (this.buttonSelect) {
          for (let i in this.screenDataAll) {
            if (this.screenDataAll[i].isMapping) {
              num++
            }
          }
        } else {
          for (let i in this.AllTableDataArr) {
            if (this.AllTableDataArr[i].isMapping) {
              num++
            }
          }
        }

        if (num > 60) {
          this.$notify({
            message: '图片太多会影响地图的操作',
            type: 'warning'
          })
        }
      },
      // 贴图
      handleChartlet(row, column, cell) {

        // 获取当前贴图按钮的位置，位于滚动条的位置
        const scrollTop=this.$refs.singleTable.bodyWrapper.scrollTop

        this.handleRowHover(row)
        this.nodeShowId = row.F_DATAID
        gisMap.productTableCRemove()
        let featureZ = {
          imagesrc: '/mj/metaImage/getImageByTypeForAll?typeId=3&dataId=' + row.F_DID + '&&nodeId=' + row.NODEID,
          geometry: row.WKTRESPONSE
        }
        row.isMapping = !row.isMapping
        if (row.isMapping) {
          gisMap.toggleStaticImage(true, featureZ, row.F_DID)
        } else {
          gisMap.toggleStaticImage(false, featureZ, row.F_DID)
        }
        if (this.buttonSelect) {
          if (this.screenDataAll.length > 0) {
            let lengthD
            if (this.pageSize * (this.currentPage - 1) + this.pageSize > this.screenDataAll.length) {
              lengthD = this.screenDataAll.length
            } else {
              lengthD = this.pageSize * (this.currentPage - 1) + this.pageSize
            }
            for (let i = this.pageSize * (this.currentPage - 1); i < lengthD; i++) {
              if (this.screenDataAll[i].F_DATAID === row.F_DATAID) {
                this.screenDataAll[i].isMapping = row.isMapping
              }
            }
            let that = this
            that.tableData.forEach((item, index) => {
              if (item.F_DID === row.F_DID) {
                item.isMapping = row.isMapping
                that.$set(that.tableData, index, item)
              }
            })
          }
        } else {
          if (this.AllTableDataArr.length > 0) {
            let lengthD
            if (this.pageSize * (this.currentPage - 1) + this.pageSize > this.AllTableDataArr.length) {
              lengthD = this.AllTableDataArr.length
            } else {
              lengthD = this.pageSize * (this.currentPage - 1) + this.pageSize
            }
            for (let i = this.pageSize * (this.currentPage - 1); i < lengthD; i++) {
              if (this.AllTableDataArr[i].F_DATAID === row.F_DATAID) {
                this.AllTableDataArr[i].isMapping = row.isMapping
              }
            }
            let that = this
            that.tableData.forEach((item, index) => {
              if (item.F_DID === row.F_DID) {
                item.isMapping = row.isMapping
                that.$set(that.tableData, index, item)
              }
            })
          }
        }
        this.overfulfil()
        if(scrollTop){
          this.$nextTick(() => {
            setTimeout(() => {
              // 设置滚动条的位置
              this.$refs.singleTable.bodyWrapper.scrollTop = scrollTop
            }, 100) // 需要设置延迟，否则无效
          })
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
      getTimegs(val) {
        if (val.length > 0) {
          let _this = this
          val.forEach(item => {
            if (item.name === 'f_receivetime') {
              if (sessionStorage.getItem('timeDE') || sessionStorage.getItem('endtime')) {
                item.queryValue[0] = sessionStorage.getItem('timeDE')
                item.queryValue[1] = sessionStorage.getItem('endtime')
                /*for (let i = 0; i < item.queryValue.length; i++) {
                  item.queryValue[i] = _this.commonMethod.timestampToTime(item.queryValue[i])
                }*/
                _this.intervalDays = _this.GetDateDiff(item.queryValue[0], item.queryValue[1], "day")
                if (_this.intervalDays > 366) {
                  _this.$message({
                    type: 'warning',
                    message: '您当前选择的时间超过1年，查询可能会慢'
                  })
                }
              } else {
                for (let i = 0; i < item.queryValue.length; i++) {
                  item.queryValue[i] = _this.commonMethod.timestampToTime(item.queryValue[i])
                }
              }
            }
            if (item.name === 'f_sensorid') {
              item.queryValue = _this.locationD
            }
            // if (item.name === 'f_dataname') {
            //     item.queryValue = [this.dataListShowD]
            // }
          })
          return val
        } else {
          return []
        }
      },
      // 获取查询条件
      getQueryCondition() {
        this.nodeIdPra = this.nodeId
        if (this.nodeId.length === 0) {
          this.$message({
            type: 'warning',
            message: '请您至少选择一个传感器！'
          })
          return
        }
        console.log(this.nodeId, "wwwwwwwww")
        if (this.nodeId.indexOf(',') > -1) {
          this.nodeIdPra = this.newNodeId
        }
        if (this.activeNameT === 'ExcelQuery') {
          if (this.execlDName === '') {
            this.$message({
              message: '请上传查询文件！',
              type: 'warning'
            })
          }
          this.queryObj = {
            guid: this.guid,
            // nodeId: nodeIdPra,
            nodeId: this.nodeIdPra,
            nodeName: this.tableName,
            // geometryType: this.geometryType,
            // areaCode: this.code,
            // wkt: this.wkt,
            isExl: 'true',
            //isNoWkt: this.isNoWkt,
            exlName: this.execlDName,
            xlsType: this.radioDataZ,
            pageSize: this.pageSize,
            currentPage: this.currentPage,
            queryType: 'PageQuery'
          }
        } else {
          if (this.queryFieldsListTables.length > 0) {
            this.queryObj = {
              guid: this.guid,
              // nodeId: nodeIdPra,
              nodeId: this.nodeIdPra,
              nodeName: this.tableName,
              geometryType: this.geometryType,
              areaCode: this.code,
              wkt: this.wkt,
              queryStatus: this.queryStatus,
              wktStr: this.wkt,
              isNoWkt: this.isNoWkt,
              isExl: 'false',
              pageSize: this.pageSize,
              currentPage: this.currentPage,
              queryType: 'PageQuery',
              intervalDays: this.intervalDays, //结束日期减去开始时间，时间间隔
              sensortranslations: this.sensorData, //卫星传感器
              tables: [{
                tableName: this.tableName,
                queryFieldsList: this.getTimegs(this.queryFieldsListTables)
              }]
            }
          } else {
            this.queryObj = {
              guid: this.guid,
              nodeId: this.nodeIdPra,
              nodeName: this.tableName,
              geometryType: this.geometryType,
              areaCode: this.code,
              wkt: this.wkt,
              queryStatus: this.queryStatus,
              wktStr: this.wkt,
              isExl: 'false',
              isNoWkt: this.isNoWkt,
              pageSize: this.pageSize,
              currentPage: this.currentPage,
              queryType: 'PageQuery',
              intervalDays: this.intervalDays, //结束日期减去开始时间，时间间隔
              sensortranslations: this.sensorData, //卫星传感器
              tables: [{
                tableName: this.tableName,
                queryFieldsList: this.getTimegs(this.tablesZ)
              }]
            }
          }
        }
        return true
      },
      // 构造查询条件
      constructQueryCondition() {
        this.initWebSocket()
        this.getQueryCondition()
        if (this.nodeIdPra) {
          if (this.activeNameT === 'ExcelQuery') {
            // execl查询
            if (this.execlDName !== '') {
              this.condition()
              this.getNotDataList()
            }
          } else {
            if (this.wkt === '' && this.code === '') {
              this.$message({
                type: 'warning',
                message: '您未设置空间信息，请设置！'
              })
            } else {
              let index = 0
              this.queryObj.tables[0].queryFieldsList.forEach(item => {
                if (item.alisaName === '传感器') {
                  index = item.queryValue.length
                }
              })
              this.condition()
              // if (index !== 0) {
              //   this.condition()
              // } else {
              //   this.$message({
              //     type: 'warning',
              //     message: '请选择至少一个传感器！'
              //   })
              // }
            }
          }
        }
        // else {
        //   this.$alert('请选择数据分类', '警告', {
        //     confirmButtonText: '确定',
        //     callback: action => {
        //       this.$notify({
        //         message: '已取消查询',
        //         position: 'bottom-right',
        //         duration: 1500
        //       })
        //       this.loading = false
        //     }
        //   })
        // }
      },
      getNotDataList(val) {
        this.notDataListZ = []
        // http.getNotDataListSceneId(this.queryObj).then(res => {
        if (val && val.length > 0) {
          val.forEach((item, index) => {
            // item =
            this.notDataListZ.push({
              value: item,
              id: index
            })
          })
          // this.notDataListZ = res.data.notDataList
        }
        // })
      },
      condition() {
        this.setClearPoint(3)
        gisMap.clearAllFeatures()
        this.query(this.queryObj)
      },
      // 点击重置
      resettingFunc() {
        this.queryFieldsListTables = []
        this.setNodeIndexData(true)
      },
      // 点击查询按钮
      searchFunc() {
        this.buttenShow = false
        // 重置用于优选各种逻辑的yx传参数组
        this.yxData = []
        this.yxData.type = '清空'
        this.setAllYxData({yxData: this.yxData})
        // 开启当前所有记录表格的显示
        this.currentTable = true
        // 清空单选的记录
        this.TableDataArr = []
        this.checkedDataz = false
        this.imageAllCheck = false
        if (this.searchArea === 1) {
          this.$message({
            message: '查询面积超过全国面积，请重新绘制！',
            type: 'warning'
          })
          return
        }
        this.setHfShowTl(false)
        this.setHcShowTl(false)
        this.setHdShowTl(false)
        this.setHyShowTl(false)
        this.currentPage = 1
        this.pageSize = 30
        gisMap.clearAllFeatures()
        this.constructQueryCondition()
        this.resetChartlet()

      },

      // 对分页查询到的当前页数据进行处理
      listResult(res, callback) {
        if (res.data === null || res.data.pageList === null || Object.keys(res.data).length === 0) {
          this.$message({
            message: '查询暂无数据！',
            type: 'warning'
          })
          this.$notify.closeAll()
          this.butD = false
          return
        }
        this.nameChartlet = '叠加'
        let data = res.data.pageList
        if (data) {
          data.forEach(d => {
            d.isSelect = false
            d.isYx = false
            d.isShop = false
            // 为了可以跨页的每条数据单选按钮可以联动后台分页查询，按照之前存入单选框字段是true的TableDataArr数组，修改再次查询到的data的d.isSelect
            let arr = this.TableDataArr.filter(item => item.isSelect === true)
            let i = arr.findIndex(item => item.F_DID == d.F_DID);
            if (i !== -1) {
              d.isSelect = true
            }

            if (d.isMapping === undefined) {
              d.isMapping = false
            }
            d.isSeamless = false
            d.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + d.F_DID + '&nodeId=' + d.NODEID,
              d.F_RECEIVETIME = this.commonMethod.timestampToTime(d.F_RECEIVETIME)
            let a = this.AllTableDataArr.findIndex(item => item.F_DID == d.F_DID)
            this.$set(this.AllTableDataArr, a, d)
          })
        } else {
          this.tableData = []
        }
        this.tableData = data
        
        if (this.buttenShow != false){
          // 为了可以在普通查询列表中标记出来被优选到的数据
          let tableDataYx = JSON.parse(localStorage.getItem('tableDataYx'))
          for (let i = 0; i < tableDataYx.length; i++){
            const index = this.tableData.findIndex(obj => obj['F_DID'] === tableDataYx[i].F_DID);
            // 设置为被优选
            if(index !== -1){
              this.tableData[index].isYx = true
            }
          }
        }
        let dataObj = {
          total: this.total,
          tableData: data
        }
        sessionStorage.setItem('dataObj', JSON.stringify(dataObj))
        this.tableDataT = data
        gisMap.clearCurrentFeatures()
        let _seft = this
        if (_seft.tableData) {
          // 地图绘制面
          this.addPolygonAllData(_seft.tableData, 1)
          this.getShopCheckData(_seft.tableData)
          this.tableDataP = _seft.tableData
          this.nodeIdP = _seft.nodeId
          if (_seft.AllTableDataArr.length > 0) {
            _seft.arrAll = _seft.AllTableDataArr.slice((this.currentPage - 1) * 30, this.currentPage * 30 + 1)
            _seft.tableData.forEach(e => {
              for (let i = 0; i < _seft.arrAll.length; i++) {
                if (_seft.arrAll[i].F_DATAID === e.F_DATAID) {
                  e.isSelect = _seft.arrAll[i].isSelect
                }
              }
            })
          }
          if (callback) {
            callback()
          }
        }
      },
      // 前段分页处理
      getPageInfo(){
        //清空 tableDataYx 中的数据
        this.tableDataYx = [];
        // 获取当前页的数据
        for(let i=(this.currentPage-1)*this.pageSize;i<this.total;i++){
          //把遍历的数据添加到 tableDataYx 里面
          this.tableDataYx.push(this.AllTableDataArr[i]);
          //判断是否达到一页的要求
          if(this.tableDataYx.length===this.pageSize) break;
        }
        // 清除地图绘制面
        gisMap.clearCurrentFeatures()
        // 地图绘制面
        let _seft = this
        if (_seft.tableDataYx) {
          this.addPolygonAllData(_seft.tableDataYx, 1)
          this.getShopCheckData(_seft.tableDataYx)
          if (_seft.AllTableDataArr.length > 0) {
            _seft.arrAll = _seft.AllTableDataArr.slice((this.currentPage - 1) * 30, this.currentPage * 30 + 1)
            _seft.tableDataYx.forEach(e => {
              for (let i = 0; i < _seft.arrAll.length; i++) {
                if (_seft.arrAll[i].F_DATAID === e.F_DATAID) {
                  e.isSelect = _seft.arrAll[i].isSelect
                }
              }
            })
          }
        }
      },
      initCanvas() {
        this.imgcolor.forEach(item => {
          this.createCanvasImg(item.colors, item.blc, item.type)
        })
      },
      toolsFeature(val) {
        if (val[2].length > 0) {
          this.fileData = val[2]
        }
      },
      ShowDialogData() {
        // this.dialogVisibleDetail = true
      },
      toolsFeatureExecl(val) {
        this.execlD = val[1].name
        this.execlDName = val[0]
      },
      changeRadio(val) {
        this.arrList.forEach(item => {
          if (item.value === val) {
            this.hrefShowData = item.label
            this.hrefShowDataTitle = '未匹配数据清单' + item.label
            this.hrefData = item.hrefData
          }
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
          ctx.lineTo(0, 10)
          ctx.moveTo(10, 0)
          ctx.lineTo(10, 10)
        } else if (type === 'hf') {
          ctx.moveTo(0, 0)
          ctx.lineTo(10, 0)
          ctx.moveTo(0, 10)
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
        // 沿着坐标点顺序的路径绘制直cy-result_hb线
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
          ctx1.lineTo(0, 10)
          ctx1.moveTo(10, 0)
          ctx1.lineTo(10, 10)
        } else if (type === 'hf') {
          ctx1.moveTo(0, 0)
          ctx1.lineTo(10, 0)
          ctx1.moveTo(0, 10)
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
      changeActive() {
        this.txNoinfo = true
      },
      upDownExcle() {
      },
      removeActive() {
        this.txNoinfo = false
      },
      addPolygonAllData(res, index, color) {
        color = color || 'rgba(88,231,218, 0)'
        if (res.length > 0) {
          res.forEach(item => {
            let feature = {
              attributes: item,
              style: {
                fillcolor: color,
                //设置当前页高亮边框的颜色
                strokecolor: index === 1 ? 'rgba(127,30,222, 0.9)' : 'rgba(44,117,242, 0.5)',
                strokewidth: 2
              },
              geometry: item.WKTRESPONSE
            }
            // 添加面到地图
            if (index === 1) {
              gisMap.addPolygon(feature)
            } else {
              gisMap.addPolygon(feature, index)
            }
          })
        }
      },
      resultStyleByCatalog(res, nodeId, isCurrentPage) {
        // gisMap.map.removeLayer(gisMap.featuresSource)
        // let data = [res[0], res[1], res[2]]
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
              if (item.type === 'hf') {
                if (item.blc === each.测量比例尺OLD) {
                  imgdata = item.url
                  syl = item.style
                  syl2 = item.style2
                  countnum = '2'
                }
              }
            }
            if (nodeId === '10092') {
              if (item.type === 'hf') {
                if (item.blc !== each.测量比例尺OLD) {
                  itemtype = 'hf'
                }
              }
            }
            if (nodeId === '10093') {
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
              if (item.type === 'hd') {
                if (item.blc !== each.测量比例尺OLD) {
                  itemtype = 'hd'
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
          })
          ths.$nextTick(() => {
            if (imgdata === '') {
              imgdata = ths.imgbesa[this.imgbesa.length - 1].url
              syl = ths.imgbesa[this.imgbesa.length - 1].style
              syl2 = ths.imgbesa[this.imgbesa.length - 1].style2
            }
          })
          if (nodeId === '10091' || nodeId === '10092' || nodeId === '10093' || nodeId === '10094' || nodeId === '10101' || nodeId === '10111' || nodeId === '10121' || nodeId === '11312' || nodeId === '11311' ||
            nodeId === '10141' || nodeId === '10142' || nodeId === '10143') {
            let featureOne = {
              attributes: attributes,
              geometry: attributes.WKTRESPONSE
            }
            if (countnum === '1' && nodeId === '10091') {
              ths.setHfShowTl(false)
              ths.setHcShowTl(true)
              ths.setHdShowTl(false)
              ths.setHyShowTl(false)
            }
            if (countnum === '1' && nodeId === '10092') {
              ths.setHfShowTl(true)
              ths.setHcShowTl(false)
              ths.setHdShowTl(false)
              ths.setHyShowTl(false)
            }
            if (countnum === '1' && nodeId === '10093') {
              ths.setHfShowTl(false)
              ths.setHcShowTl(false)
              ths.setHdShowTl(true)
              ths.setHyShowTl(false)
            }
            if (countnum === '1' && nodeId === '10094') {
              ths.setHfShowTl(false)
              ths.setHcShowTl(false)
              ths.setHdShowTl(false)
              ths.setHyShowTl(true)
            }
            // 添加面到地图
            if (this.currentPage === 1) {
              // if (ths.currentStyle.indexOf(attributes.F_DATAID) === -1) {
              gisMap.addCrossPolygon2(featureOne, 'featuresSourceAllImage', syl, countnum, nodeId, itemtype)
              //  }
            }
            if (isCurrentPage) {
              gisMap.addCrossPolygon2(featureOne, 'featuresSource', syl2, countnum, nodeId, itemtype)
              // ths.currentStyle.push(attributes.F_DATAID)
            }
          } else {
            // 卫星影像
            let feature = {
              attributes: attributes,
              style: {
                fillcolor: 'rgba(0,0,255, 0.1)',
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
      // 返回总记录条数
      // getResultCount() {
      //   let _this = this
      //   http.findQueryCount({
      //     guid: _this.guid
      //   }).then(res1 => {
      //     _this.total = res1.data
      //     _this.totalT = res1.data
      //     if (_this.nodeId === '10091' || _this.nodeId === '10092' || _this.nodeId === '10093' || _this.nodeId === '10094' || _this.nodeId === '10101' || _this.nodeId === '10111' || _this.nodeId === '10121') {
      //
      //     } else {
      //       _this.tableData.forEach(item => {
      //         // item.imageurl = "http://gf.agrs.cn/order/meta.imager?flag=1&metaId=" + item.DATAID + "&dataTablename=TB_BAS_META_YGYX"
      //         // item.imageurl = _this.validateImage('/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.DATAID)
      //         // item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.DATAID
      //       })
      //     }
      //     _this.fullscreenLoading = false
      //     setTimeout(function() {
      //       Notification.closeAll()
      //     }, 2000)
      //   })
      // },
      createTlByPageList(res, nodeId) {
        var htmlValue = ''
        let tlList = []
        let reg = new RegExp(',', 'g') // g代表全部
        res.forEach(each => {
          var attributes = each
          var colors = ''
          var blc = each.测量比例尺OLD
          var hsblc = each.航摄比例尺F
          if (nodeId !== '10101' && nodeId !== '10121') {
            if (blc === undefined) {
              blc = hsblc
            }
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
        for (var i = 0; i < tlList.length; i++) {
          if (nodeId === '10091') { // 航磁
            if ('1:' + tlList[i] === '1:5,000'.replace(reg, '')) {
              htmlValue += 'hc5000:true;'
            } else if ('1:' + tlList[i] === '1:10,000'.replace(reg, '')) {
              htmlValue += 'hc10000:true;'
            } else if ('1:' + tlList[i] === '1:20,000'.replace(reg, '')) {
              htmlValue += 'hc20000:true;'
            } else if ('1:' + tlList[i] === '1:25,000'.replace(reg, '')) {
              htmlValue += 'hc25000:true;'
            } else if ('1:' + tlList[i] === '1:35,000'.replace(reg, '')) {
              htmlValue += 'hc35000:true;'
            } else if ('1:' + tlList[i] === '1:50,000'.replace(reg, '')) {
              htmlValue += 'hc50000:true;'
            } else if ('1:' + tlList[i] === '1:100,000'.replace(reg, '')) {
              htmlValue += 'hc100000:true;'
            } else if ('1:' + tlList[i] === '1:200,000'.replace(reg, '')) {
              htmlValue += 'hc200000:true;'
            } else if ('1:' + tlList[i] === '1:250,000'.replace(reg, '')) {
              htmlValue += 'hc250000:true;'
            } else if ('1:' + tlList[i] === '1:500,000'.replace(reg, '')) {
              htmlValue += 'hc500000:true;'
            } else if ('1:' + tlList[i] === '1:1000,000'.replace(reg, '')) {
              htmlValue += 'hc1000000:true;'
            }
          } else if (nodeId === '10092') { // 航放
            if ('1:' + tlList[i] === '1:10,000'.replace(reg, '')) {
              htmlValue += 'hf10000:true;'
            } else if ('1:' + tlList[i] === '1:25,000'.replace(reg, '')) {
              htmlValue += 'hf25000:true;'
            } else if ('1:' + tlList[i] === '1:35,000'.replace(reg, '')) {
              htmlValue += 'hf35000:true;'
            } else if ('1:' + tlList[i] === '1:50,000'.replace(reg, '')) {
              htmlValue += 'hf50000:true;'
            } else if ('1:' + tlList[i] === '1:100,000'.replace(reg, '')) {
              htmlValue += 'hf100000:true;'
            } else if ('1:' + tlList[i] === '1:200,000'.replace(reg, '')) {
              htmlValue += 'hf200000:true;'
            } else if ('1:' + tlList[i] === '1:500,000'.replace(reg, '')) {
              htmlValue += 'hf500000:true;'
            }
          } else if (nodeId === '10093') { // 航电
            if ('1:' + tlList[i] === '1:5,000'.replace(reg, '')) {
              htmlValue += 'hd5000:true;'
            } else if ('1:' + tlList[i] === '1:10,000'.replace(reg, '')) {
              htmlValue += 'hd10000:true;'
            } else if ('1:' + tlList[i] === '1:25,000'.replace(reg, '')) {
              htmlValue += 'hd25000:true;'
            } else if ('1:' + tlList[i] === '1:50,000'.replace(reg, '')) {
              htmlValue += 'hd50000:true;'
            } else if ('1:' + tlList[i] === '1:100,000'.replace(reg, '')) {
              htmlValue += 'hd100000:true;'
            } else if ('1:' + tlList[i] === '1:500,000'.replace(reg, '')) {
              htmlValue += 'hd500000:true;'
            }
          } else if (nodeId === '10111') { // 航空遥感测量
            if ('1:' + tlList[i] === '1:2,000'.replace(reg, '')) {
              htmlValue += 'hy2000:true;'
            } else if ('1:' + tlList[i] === '1:5,000'.replace(reg, '')) {
              htmlValue += 'hy5000:true;'
            } else if ('1:' + tlList[i] === '1:7,500'.replace(reg, '')) {
              htmlValue += 'hy7500:true;'
            } else if ('1:' + tlList[i] === '1:8,000'.replace(reg, '')) {
              htmlValue += 'hy8000:true;'
            } else if ('1:' + tlList[i] === '1:10,000'.replace(reg, '')) {
              htmlValue += 'hy10000:true;'
            } else if ('1:' + tlList[i] === '1:12,000'.replace(reg, '')) {
              htmlValue += 'hy12000:true;'
            } else if ('1:' + tlList[i] === '1:14,000'.replace(reg, '')) {
              htmlValue += 'hy14000:true;'
            } else if ('1:' + tlList[i] === '1:15,000'.replace(reg, '')) {
              htmlValue += 'hy15000:true;'
            } else if ('1:' + tlList[i] === '1:16,000'.replace(reg, '')) {
              htmlValue += 'hy16000:true;'
            } else if ('1:' + tlList[i] === '1:17,000'.replace(reg, '')) {
              htmlValue += 'hy17000:true;'
            } else if ('1:' + tlList[i] === '1:18,000'.replace(reg, '')) {
              htmlValue += 'hy18000:true;'
            } else if ('1:' + tlList[i] === '1:20,000'.replace(reg, '')) {
              htmlValue += 'hy20000:true;'
            } else if ('1:' + tlList[i] === '1:20,600'.replace(reg, '')) {
              htmlValue += 'hy20600:true;'
            } else if ('1:' + tlList[i] === '1:21,000'.replace(reg, '')) {
              htmlValue += 'hy21000:true;'
            } else if ('1:' + tlList[i] === '1:22,000'.replace(reg, '')) {
              htmlValue += 'hy22000:true;'
            } else if ('1:' + tlList[i] === '1:23,000'.replace(reg, '')) {
              htmlValue += 'hy2000:true;'
            } else if ('1:' + tlList[i] === '1:24,000'.replace(reg, '')) {
              htmlValue += 'hy24000:true;'
            } else if ('1:' + tlList[i] === '1:25,000'.replace(reg, '')) {
              htmlValue += 'hy25000:true;'
            } else if ('1:' + tlList[i] === '1:30,000'.replace(reg, '')) {
              htmlValue += 'hy30000:true;'
            } else if ('1:' + tlList[i] === '1:32,000'.replace(reg, '')) {
              htmlValue += 'hy32000:true;'
            } else if ('1:' + tlList[i] === '1:35,000'.replace(reg, '')) {
              htmlValue += 'hy35000:true;'
            } else if ('1:' + tlList[i] === '1:36,000'.replace(reg, '')) {
              htmlValue += 'hy36000:true;'
            } else if ('1:' + tlList[i] === '1:40,000'.replace(reg, '')) {
              htmlValue += 'hy40000:true;'
            } else if ('1:' + tlList[i] === '1:45,000'.replace(reg, '')) {
              htmlValue += 'hy45000:true;'
            } else if ('1:' + tlList[i] === '1:50,000'.replace(reg, '')) {
              htmlValue += 'hy50000:true;'
            } else if ('1:' + tlList[i] === '1:55,000'.replace(reg, '')) {
              htmlValue += 'hy55000:true;'
            } else if ('1:' + tlList[i] === '1:56,000'.replace(reg, '')) {
              htmlValue += 'hy56000:true;'
            } else if ('1:' + tlList[i] === '1:60,000'.replace(reg, '')) {
              htmlValue += 'hy60000:true;'
            } else if ('1:' + tlList[i] === '1:65,000'.replace(reg, '')) {
              htmlValue += 'hy65000:true;'
            } else if ('1:' + tlList[i] === '1:67,000'.replace(reg, '')) {
              htmlValue += 'hy67000:true;'
            } else if ('1:' + tlList[i] === '1:92,000'.replace(reg, '')) {
              htmlValue += 'hy92000:true;'
            } else if ('1:' + tlList[i] === '1:100,000'.replace(reg, '')) {
              htmlValue += 'hy10000:true;'
            } else if ('1:' + tlList[i] === '1:200,000'.replace(reg, '')) {
              htmlValue += 'hy200000:true;'
            } else if ('1:' + tlList[i] === '1:250,000'.replace(reg, '')) {
              htmlValue += 'hy250000:true;'
            }
          }
        }

        if (nodeId === '10101') { // 物探科研
          htmlValue = 'wtky:true;'
        } else if (nodeId === '10121') { // 遥感科研
          htmlValue = 'ygky:true;'
        }

        this.settlList(htmlValue.substr(0, htmlValue.length - 1))
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
        obj.pageSize = 30
        this.currentPage
        // 打点查询不能用到索引，以打点的wkt加减0.0001变为一个矩形作为查询条件可以用到索引，查询速度就快了
        if (obj.isExl !== 'true') {
          if (obj.wkt.indexOf("POINT") > -1) {
            let pointWkt = []
            pointWkt = obj.wkt.substring(6, obj.wkt.length - 1).split(" ")
            let y = Number(pointWkt[0])
            let x = Number(pointWkt[1])
            let leftTopY = String(Number(y + 0).toFixed(4)) + ' '
            let leftTopX = String(Number(x + 0).toFixed(4))

            let rightTopY = String(Number(y + 0.0001).toFixed(4)) + ' '
            let rightTopX = String(Number(x + 0).toFixed(4)) + ','

            let rightDownY = String(Number(y + 0).toFixed(4)) + ' '
            let rightDownX = String(Number(x + 0.0001).toFixed(4)) + ','

            let leftDownY = String(Number(y - 0.0001).toFixed(4)) + ' '
            let leftDownX = String(Number(x + 0).toFixed(4)) + ','
            let pointWkt1 =
              'POLYGON((' + leftTopY + leftTopX + ','
              + '' + rightTopY + rightTopX
              + rightDownY + rightDownX
              + leftDownY + leftDownX
              + leftTopY + leftTopX + '))'
            obj.wkt = pointWkt1
            obj.wktStr = pointWkt1
          }
        }

        // let _this = this
        this.$notify.closeAll()
        this.$notify({
          message: '检索中...',
          position: 'bottom-right',
          duration: 0
        })
        this.butD = true
        if (this.menuShow) {
          document.getElementsByClassName('el-notification')[0].style.right = '500px'
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
        if (this.nodeId.indexOf(',') > -1) {
          http.findPageQueryByNodes(obj).then(res => {
            // 先清空这个缓存，然后传入查询对象到缓存里，供定点查询使用
            let time = new Date().getTime()
            obj.time = time
            obj.objType = 'WX'
            localStorage.setItem('searchDataToWX', JSON.stringify(obj))

            if (res.data.total === 80000) {
              this.$message({
                message: '当前查询结果超过8万条，请修改查询条件！',
                type: 'warning'
              })
              _this.$notify.closeAll()
              return
            }
            this.listResult(res, function () {
              if (res.data.total > 0) {
                if (_this.currentPage === 1) {
                  gisMap.featuresSourceAllImage.clear();
                  _this.coverage()
                } else {
                  _this.$notify.closeAll()
                }
              } else {
                _this.$notify.closeAll()
                _this.butD = false
                _this.$message({
                  message: '查询暂无数据！',
                  type: 'warning'
                })
                _this.total = 0
                _this.totalT = 0
                _this.fullscreenLoading = false
              }
            })
          })
          if (this.currentPage === 1 || this.queryObj.currentPage === 1) {
            obj.currentPage = 1
            this.queryObj.currentPage = 1
            // this.total = 0
            // this.totalT = 0
            // this.totalNum = 0
          } else {
            this.currentPage = obj.currentPage
            this.queryObj.currentPage = obj.currentPage
          }
        } else {
          http.findQuery(obj).then(res => {

            // 先清空这个缓存，然后传入查询对象到缓存里，供定点查询使用
            let time = new Date().getTime()
            obj.time = time
            obj.objType = 'WX'
            localStorage.setItem('searchDataToWX', JSON.stringify(obj))
            if (res.data.total === 80000) {
              this.$message({
                message: '当前查询结果超过8万条，请修改查询条件！',
                type: 'warning'
              })
              _this.$notify.closeAll()
              return
            }
            this.listResult(res, function () {
              if (res.data.total && res.data.total > 0) {
                if (_this.guid !== res.data.guid) {
                  _this.$message({
                    message: '您短时间内查询次数较频繁，请放缓查询时间间隔',
                    type: 'warning'
                  })
                  return
                }

                if (_this.currentPage === 1) {
                  gisMap.featuresSourceAllImage.clear();
                  _this.coverage()
                } else {
                  _this.$notify.closeAll()
                }

              } else {
                _this.$notify.closeAll()
                _this.butD = false
                _this.$message({
                  message: '查询暂无数据！',
                  type: 'warning'
                })
                _this.total = res.data.total
                _this.totalT = res.data.total
                _this.fullscreenLoading = false
              }
            })
          })
          if (this.currentPage === 1 || this.queryObj.currentPage === 1) {
            obj.currentPage = 1
            this.queryObj.currentPage = 1
            // this.total = 0
            // this.totalT = 0
            // this.totalNum = 0
          } else {
            this.currentPage = obj.currentPage
            this.queryObj.currentPage = obj.currentPage
          }
        }
      },
      GetDateDiff(startTime, endTime, diffType) {
        //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
        startTime = startTime.replace(/\-/g, "/");
        endTime = endTime.replace(/\-/g, "/");
        //将计算间隔类性字符转换为小写
        diffType = diffType.toLowerCase();
        var sTime = new Date(startTime); //开始时间
        var eTime = new Date(endTime); //结束时间
        //作为除数的数字
        var timeType = 1;
        switch (diffType) {
          case"second":
            timeType = 1000;
            break;
          case"minute":
            timeType = 1000 * 60;
            break;
          case"hour":
            timeType = 1000 * 3600;
            break;
          case"day":
            timeType = 1000 * 3600 * 24;
            break;
          default:
            break;
        }
        return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
      },
      coverage() {
        let _this = this
        _this.checkedDataz = false
        _this.switchingTableArr = []
        _this.butD = true
        _this.AllTableDataArr = []
        // 回调合并面
        if (this.nodeId.indexOf(',') > -1) {
          http.findCoverageByNodes(this.queryObj).then(res => {
            _this.$notify.closeAll()
            _this.butD = false
            if (res.data.pageList) {
              // pu,uv ====== excel暂时不上报
              if (this.activeNameT !== 'ExcelQuery') {
                _this.postDataPVuV(this.queryObj)
              } else {
                this.getNotDataList(res.data.excelUnFindList)
              }
              let totalTemp = 0;
              res.data.pageList.forEach(item => {
                if (item.SIZENUM) {
                  totalTemp += item.SIZENUM
                }
              })
              _this.total = totalTemp
              _this.totalT = totalTemp
              if (this.activeNameT == 'ExcelQuery') {
                _this.total = res.data.pageList.length
                _this.totalT = res.data.pageList.length
              }
              this.getTotalNum(_this.total)
              _this.setActiveName('result')
            }

            _this.addPolygonAllData(res.data.pageList, 'featuresSourceAllImage', 'rgba(88,231,218, 0.1)')
            _this.heBingMian = res.data.pageList
            
            localStorage.setItem('allDataHeBingMian', JSON.stringify(_this.heBingMian))
          })


          // 20220711 mj 新增异步查询获取全选所有的列表
          http.findNewAgrsAllListWktForHCNodes(this.queryObj).then(res => {
            _this.AllTableDataArr = []
            _this.$notify.closeAll()
            _this.butD = false
            if (res.data.pageList) {
              // pu,uv ====== excel暂时不上报
              if (this.activeNameT !== 'ExcelQuery') {
                _this.postDataPVuV(this.queryObj)
              } else {
                this.getNotDataList(res.data.excelUnFindList)
              }
              _this.total = res.data.total
              _this.totalT = res.data.total
              // alert("2")
              this.getTotalNum(res.data.total)
              // _this.switchingTableArr = res.data.pageList
              _this.AllTableDataArr = res.data.pageList
              _this.setActiveName('result')
            }
            _this.switchingNameFlag = true

          })
        } else {
          http.findCoverage(this.queryObj).then(res => {
            _this.$notify.closeAll()
            _this.butD = false
            if (res.data.pageList) {
              // pu,uv ====== excel暂时不上报
              if (this.activeNameT !== 'ExcelQuery') {
                _this.postDataPVuV(this.queryObj)
              } else {
                this.getNotDataList(res.data.excelUnFindList)
              }
              if (res.data.pageList[0].SIZENUM != undefined) {
                _this.total = res.data.pageList[0].SIZENUM
                _this.totalT = res.data.pageList[0].SIZENUM
              } else {
                _this.total = res.data.pageList.length
                _this.totalT = res.data.pageList.length
              }
              this.getTotalNum(_this.total)
              _this.setActiveName('result')
            }
            if (_this.guid !== res.data.guid) {
              _this.$message({
                message: '非本次查询结果！',
                type: 'warning'
              })
              return;
            }
            _this.addPolygonAllData(res.data.pageList, 'featuresSourceAllImage', 'rgba(88,231,218, 0.1)')
            _this.heBingMian = res.data.pageList
            localStorage.setItem('allDataHeBingMian', JSON.stringify(_this.heBingMian))
          })

          // 20220711 mj 新增异步查询获取全选所有的列表 单卫星
          http.findNewAgrsAllListWktForHCNodes(this.queryObj).then(res => {
            _this.AllTableDataArr = []
            _this.$notify.closeAll()
            _this.butD = false
            if (res.data.pageList) {
              // pu,uv ====== excel暂时不上报
              if (this.activeNameT !== 'ExcelQuery') {
                _this.postDataPVuV(this.queryObj)
              } else {
                this.getNotDataList(res.data.excelUnFindList)
              }
              _this.total = res.data.total
              _this.totalT = res.data.total
              this.getTotalNum(res.data.total)
              // _this.switchingTableArr = res.data.pageList
              _this.AllTableDataArr = res.data.pageList
              _this.setActiveName('result')
            }
            _this.switchingNameFlag = true

          })
        }
      },
      // 合并面接口慢
      getCalCoverage() {
        let _this = this
        http.getCalCoverage({
          guid: this.guid
        }).then(res => {
          // 数据接收
          // const redata = JSON.parse(e.data)
          let daarr = res.data.split('&')
          gisMap.featuresSourceVectorLayerAllImage.getSource().clear()
          let feature = {
            attributes: '',
            style: {
              fillcolor: 'rgba(3, 168, 158, 0.5)',
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
            // _this.$message({
            //   type: 'info',
            //   message: '绘制完成'
            // })
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
      getTotalNum(val) {
        // this.totalNum = 0
        if (val !== 0) {
          this.totalNum = val
          let zc = parseInt(val / 30)
          let ys = val % 30
          if (zc !== 0 && ys !== 0) {
            this.totalNum = zc + 1
          } else if (zc !== 0 && ys === 0) {
            this.totalNum = zc
          } else {
            this.totalNum = 1
          }
        }
      },
      getTabele(val) {
        // 判断是不是ie浏览器
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
          this.clientWidth = (`${document.documentElement.clientWidth}` * 0.23 - 177)
          return val.slice(0, parseInt(this.clientWidth / 7.8)) + '....'
        } else {
          return val
        }
      },
      // 当前页发生改变会触发此方法
      handleCurrentChange: function (val) {
        this.currentPage = val
        this.nameAllSelect = '当前页全选'
        this.queryObj.currentPage = val
        this.query(this.queryObj)
        // }
      },
      // 翻页操作
      handlePageBtn() {
        
        this.queryObj.currentPage = this.currentPage
        this.butD = true

        let ll = this.getTableData(this.fieldName, this.sortingType, this.currentPage)
        let res = {
          data: {
            pageList: ll,
            total: this.buttonSelect ? this.screenDataAll.length : this.AllTableDataArr.length
          }
        }
        // 重新绘制
        this.listResult(res)
        
      },
      // 重置贴图
      resetChartlet() {
        console.log(this.tableData, 'this.tableData')
        console.log(this.AllTableDataArr, 'this.AllTableDataArr')
        let imgChartlet = document.getElementsByClassName('chartlet')
        for (let i = 0, len = imgChartlet.length; i < len; i++) {
          imgChartlet[i].src = this.overlaySrcs
        }
        if (this.tableData) {
          this.tableData.forEach(item => {
            if (item.WKTRESPONSE) {
              let feature = {
                imagesrc: '/mj/metaImage/getImageByTypeForAll?typeId=3&dataId=' + item.F_DID + '&nodeId=' + item.nodeId,
                // imagesrc: this.overLayTUrlImg,
                geometry: item.WKTRESPONSE
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
      // 查询数据-数据覆盖面导出_____
      deriveShopDateOnlyShp1() {
        this.wktlistData = []
        let wktlistAdd = []
        if (this.AllTableDataArr.length > 0) {
          wktlistAdd = this.AllTableDataArr
        } else {
          wktlistAdd = this.tableData
        }
        if (wktlistAdd.length > 0) {
          wktlistAdd.forEach(item => {
            if (item.isSelect) {
              this.wktlistData.push(item.WKTRESPONSE)
            }
          })
          if (this.wktlistData.length > 0) {
            if (this.wktlistData.length > 1) {
              http.getDeriveShopDateOnlyShp({
                wktlist: this.wktlistData
              }).then(res => {
                if (res.data) {
                  // window.location.href = res.data
                  this.downloadFile(res.data, '1234')
                }
              })
            } else {
              http.deriveShopDateOnlyShpOne({
                wktlist: this.wktlistData[0]
              }).then(res => {
                if (res.data) {
                  // window.location.href = res.data
                  this.downloadFile(res.data, '1254325')
                }
              })
            }
          } else {
            this.$message({
              message: '请选择数据！',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '请先查询数据！',
            type: 'warning'
          })
        }
      },
      // 数据筛选功能弹窗
      dataListSelect() {
        if (this.tableData.length !== 0) {
          this.setClearPoint(2)
          this.dataListShow = true
        } else {
          this.$message({
            message: '当前查询结果为空，无法进行筛选！',
            type: 'warning'
          })
        }
      },
      // 移除优选功能弹窗
      delYx() {
        if (this.tableData.length !== 0) {
          this.$refs.cyResultYx.delYx()
        } else {
          this.$message({
            message: '当前总查询结果为空，还无法进行移除！',
            type: 'warning'
          })
        }
      },
      // 切换列表为全部记录
      selectAll () {
        if (this.tableData.length !== 0) {
          // 清除合并面
          gisMap.featuresSource.clear();
          gisMap.featuresSourceAllImage.clear();
          gisMap.featuresSourceAllImageYx.clear();
          this.addPolygonAllData(this.heBingMian, 'featuresSourceAllImage', 'rgba(88,231,218, 0.1)')
          // 地图绘制面
          this.addPolygonAllData(this.tableData, 1)
          this.yxData.type = '切换'
          this.yxData.tableShowYx = 'none'
          this.setAllYxData({yxData: this.yxData})

          this.tableData.map(item =>{
              item.isYx = false
          })
          if (this.buttenShow != false){
            // 为了可以在普通查询列表中标记出来被优选到的数据
            let tableDataYx = JSON.parse(localStorage.getItem('tableDataYx'))
            for (let i = 0; i < tableDataYx.length; i++){
              const index = this.tableData.findIndex(obj => obj['F_DID'] === tableDataYx[i].F_DID);
              // 设置为被优选
              if(index !== -1){
                this.tableData[index].isYx = true
              }
            }
          }
          this.currentTable = true
        }else {
          this.$message({
            message: '当前查询结果为空，无法切换列表！',
            type: 'warning'
          })
        }
      },
      // 切换列表为优选结果记录
      selectYx () {
        if (this.tableData.length !== 0) {
          if (this.yxData.isOk) {
            this.isYxData = true
            this.yxData.type = '切换'
            this.yxData.tableShowYx = 'block'
            this.setAllYxData({yxData: this.yxData})
            // 清除合并面
            gisMap.featuresSource.clear();
            gisMap.featuresSourceAllImage.clear();
            gisMap.featuresSourceAllImageYx.clear();
            // 画全部记录合并面
            this.addPolygonAllData(this.heBingMian, 'featuresSourceAllImage', 'rgba(88,231,218, 0.1)')
            // 画优选结果合并面
            this.$refs.cyResultYx.addYxHBM()
            this.currentTable = false
          } else {
            this.$message({
              message: '当前还没有进行优选，无法切换到优选列表！',
              type: 'warning'
            })
          }
        }else {
          this.$message({
            message: '当前查询结果为空，无法切换列表！',
            type: 'warning'
          })
        }
      },
      // 数据优选功能弹窗
      dataListSelectYx() {
        if (this.tableData.length !== 0) {
          this.isOptimization = true
        } else {
          this.$message({
            message: '当前查询结果为空，无法进行优选！',
            type: 'warning'
          })
        }
      },
      // 数据优选 功能
      getYouXuanShow(val) {
        let _this = this
        if (val === 0) {
          _this.isOptimization = false
        }else if(val === 1){
          _this.buttenShow = true
          _this.yxData.type = '查询'
          _this.yxData.tableShowYx = 'block'
          _this.queryObj.yxType = _this.yxType
          _this.yxData.queryObj = _this.queryObj
          _this.yxData.showCon = _this.showCon
          _this.setAllYxData({yxData: _this.yxData})
          _this.currentTable = false
          // 用作判断是否进行了数据优选
          _this.yxData.isOk = true
          _this.isOptimization = false
        }else{
          window.open('http://geogf.agrs.cn//YxManual//地质云遥感数据优选查询流程说明.pdf', '_blank')
        }
      },
      // 添加优选功能弹窗
      addYx() {
        if (this.tableData.length !== 0) {
          if(this.yxData.isOk){
            if(this.TableDataArr.length !== 0){
              this.addOptimization = true
            }else {
              this.$message({
                message: '请选择数据！',
                type: 'warning'
              })
            }
          }else {
            this.$message({
              message: '当前还未进行过数据优选，数据优选列表为空，无法添加优选！',
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: '当前查询结果为空，无法添加优选！',
            type: 'warning'
          })
        }
      },
      // 添加优选 功能
      addYxShow(val) {
        let _this = this
        if (val === 0) {
          _this.addOptimization = false
        }else {
          this.$refs.toolsVue.addYxDataDingdian(1)
          this.$refs.cyResultYx.addYx(_this.TableDataArr)
          _this.addOptimization = false
        }
      },
      // 移除优选功能
      delYxShow(val) {
        let _this = this
        if (val === 0) {
          _this.delOptimization = false
        }else {
          _this.TableDataArr
          _this.delOptimization = false
        }
      },
      cyResultYxCallBack(val){

      },
      // 数据筛选功能
      dialogCallBack(val) {

        // 筛选去掉页面贴图
        if (gisMap.m) {
          for (let key in gisMap.m) {
            gisMap.map.removeLayer(gisMap.m[key])
          }
        }
        this.dataListShow = false
        this.checkedDataz = false
        this.dataListShowD = val
        this.pageSize = 30
        this.currentPage = 1
        if (val === '还原') {

          this.buttonSelect = false
          this.AllTableDataArr.forEach(item => {
            item.F_RECEIVETIME = this.commonMethod.timestampToTime(item.F_RECEIVETIME)
            item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.F_DID + '&nodeId=' + item.NODEID
            item.isMapping = false
          })
          this.tableData = this.AllTableDataArr.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
          this.total = this.totalT
          // 取消
          this.imageAllCheck = false
          gisMap.clearCurrentAllFeatures()
          this.addPolygonAllData(this.heBingMian, 'featuresSourceAllImage', 'rgba(88,231,218, 0.1)')
          // this.currentPageAllSelect()
          this.getTotalNum(this.total)
          this.addPolygonAllData(this.tableData, 1)
          if(this.yxData.tableShowYx === 'block'){
            //优选
            this.$refs.cyResultYx.dialogCallBack(val)
          }
          if (this.buttenShow != false){
            // 为了可以在普通查询列表中标记出来被优选到的数据
            let tableDataYx = JSON.parse(localStorage.getItem('tableDataYx'))
            for (let i = 0; i < tableDataYx.length; i++){
              const index = this.tableData.findIndex(obj => obj['F_DID'] === tableDataYx[i].F_DID);
              // 设置为被优选
              if(index !== -1){
                this.tableData[index].isYx = true
              }
            }
          }
        } else if (val === '取消') {
          return
        }else {
          if(this.yxData.tableShowYx === 'block'){
            //优选
            this.$refs.cyResultYx.dialogCallBack(val)
            return
          }
          this.buttonSelect = true
          this.screenDataAll = []
          if (this.AllTableDataArr.length > 0) {
            this.AllTableDataArr.forEach(item => {
              item.imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.F_DID + '&nodeId=' + item.NODEID
              item.F_RECEIVETIME = this.commonMethod.timestampToTime(item.F_RECEIVETIME)
              item.isMapping = false
              if (item.F_DATANAME.toLocaleUpperCase().indexOf(val.toLocaleUpperCase()) > -1) {
                this.screenDataAll.push(item)
              }
            })
          }
          this.switchingNameFlag = true
          this.switchingArrPoint = this.screenDataAll
          gisMap.clearCurrentAllFeatures()
          this.addPolygonAllData(this.screenDataAll, 'featuresSourceAllImage', 'rgba(88,231,218, 0.1)')
          // 点选一页显示所有
          this.tableData = this.screenDataAll.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
          if (this.buttenShow != false){
            this.tableData.map(item =>{
              item.isYx = false
            })
            // 为了可以在普通查询列表中标记出来被优选到的数据
            let tableDataYx = JSON.parse(localStorage.getItem('tableDataYx'))
            for (let i = 0; i < tableDataYx.length; i++){
              const index = this.tableData.findIndex(obj => obj['F_DID'] === tableDataYx[i].F_DID);
              // 设置为被优选
              if(index !== -1){
                this.tableData[index].isYx = true
              }
            }
          }
          this.addPolygonAllData(this.tableData, 1)
          console.log(this.tableData)
          this.total = this.screenDataAll.length
          this.getTotalNum(this.screenDataAll.length)
          // this.totalNum = 1
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
      // 导出落图
      deriveShopDateOnlyShp() {
        if(this.yxData.tableShowYx === 'block'){
          //优选
          this.$refs.cyResultYx.deriveShopDateOnlyShp()
          return
        }
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
        let timeChange = ''
        if (this.buttonSelect) {
          if (this.screenDataAll.length > 0) {
            wktlistAdd = this.screenDataAll
          } else if (this.switchingSelect.length > 0 && this.imageAllCheck === true) {
            wktlistAdd = this.tableData
          }
        }
        else {
          if (this.switchingNameFlag === true && this.checkedDataz === true) {
            if (this.AllTableDataArr.length > 0) {
              wktlistAdd = this.AllTableDataArr
            }
          } else {
            wktlistAdd = this.tableData
          }
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
            times = this.getTimes(parseInt(this.wktlistData.length))
            this.temptimeChange = parseInt(this.wktlistData.length / 2)
            document.getElementsByClassName('el-loading-text')[0].innerHTML = '导出剩余时间大概为：' + times
            this.$confirm('导出所需时间大概' + times + '是否继续导出?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.tiemsFun = setInterval(() => {
                if (this.progress + 1 === dataIds.length) {
                  timeChange = '导出即将完成！正在压缩文件······'
                } else {
                  // timeChange = '导出剩余时间大概为：' + this.temptimeChange
                  timeChange = '正在生成shp······'
                }
                document.getElementsByClassName('el-loading-text')[0].innerHTML = timeChange
              }, 1000)
              timeChange = ''
              // typeId == 1 或 null 或 4 是快视图 typeId==2 是拇指图 typeId==3 是配准图，导出落图需要配准图
              let typeId = '3'
              // this.tieImg ? typeId = '4' : typeId = '3'
              // =================================================================================

              http.getUUid({}).then(res => {
                let uuid = ''
                uuid = res.data
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
                      typeId: typeId,
                      uuId: uuid,
                      // exportType是导出类型 1：落图 2：快视图
                      exportType: 1
                    }
                })
                const intervalId = setInterval(() => {
                  http.getLuotuStatus({uuId: uuid}).then(response => {
                    if (response.data.F_STATUS === '1') {
                      clearInterval(intervalId); // 停止循环
                      loading.close()
                      window.open(response.data.F_ZIPURL, '_blank')
                    } else if (response.data.uuid === '为空') {
                      this.resStatus = response.data.uuid
                    } else {
                      this.progress = parseFloat(response.data.F_PROGRESS)
                    }
                  })
                }, 2000); // 设置每隔1秒钟访问一次接口
              })
            }).catch(() => {
              this.$message({
                message: '已取消导出！',
                type: 'warning'
              })
              loading.close()
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
      // 导出快视图
      deriveQuickViewImg() {
        if(this.yxData.tableShowYx === 'block'){
          //优选
          this.$refs.cyResultYx.deriveQuickViewImg()
          return
        }
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
        let timeChange1 = ''
        if (this.buttonSelect) {
          if (this.screenDataAll.length > 0) {
            wktlistAdd = this.screenDataAll
          } else if (this.switchingSelect.length > 0 && this.imageAllCheck === true) {
            wktlistAdd = this.tableData
          }
        }
        else {
          if (this.switchingNameFlag === true && this.checkedDataz === true) {
            if (this.AllTableDataArr.length > 0) {
              wktlistAdd = this.AllTableDataArr
            }
          } else {
            wktlistAdd = this.tableData
          }
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
            times = this.getTimes(parseInt(this.wktlistData.length * 3))
            this.temptimeChange = parseInt(this.wktlistData.length / 2)
            document.getElementsByClassName('el-loading-text')[0].innerHTML = '导出剩余时间大概为：' + times
            this.$confirm('导出所需时间大概' + times + '是否继续导出?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.tiemsFun = setInterval(() => {
                if (this.progress + 1 === dataIds.length) {
                  timeChange1 = '导出即将完成！正在压缩文件······'
                } else {
                  timeChange1 = '当前需生成图片总数：' + dataIds.length + '，' + '当前已生成图片个数：' + this.progress
                }
                document.getElementsByClassName('el-loading-text')[0].innerHTML = timeChange1
              }, 1000)
              // typeId == 1 或 null 或 4 是快视图 typeId==2 是拇指图 typeId==3 是配准图，导出落图需要配准图
              let typeId = '3'

              http.getUUid({}).then(res => {
                let uuid = ''
                uuid = res.data
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
                      typeId: typeId,
                      uuId: uuid,
                      // exportType是导出类型 1：落图 2：快视图
                      exportType: 2
                    }
                })
                const intervalId = setInterval(() => {
                  http.getLuotuStatus({uuId: uuid}).then(response => {
                    if (response.data.F_STATUS === '1') {
                      clearInterval(intervalId); // 停止循环
                      loading.close()
                      window.open(response.data.F_ZIPURL, '_blank')
                    } else if (response.data.uuid === '为空') {
                      this.resStatus = response.data.uuid
                    } else {
                      this.progress = parseFloat(response.data.F_PROGRESS)
                    }
                  })
                }, 2000); // 设置每隔1秒钟访问一次接口
              })
            }).catch(() => {
              this.$message({
                message: '已取消导出！',
                type: 'warning'
              })
              loading.close()
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
      // 导出优选未覆盖面
      deriveYxNo(){
        if(this.yxData.tableShowYx === 'block'){
          // 优选未覆盖面方法
          this.$refs.cyResultYx.deriveYxNo()
          return
        }
      },
      // 导出未覆盖面
      deriveNo(){
        const loading = this.$loading({
          lock: true,
          text: '导出查询结果未覆盖面shp中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        this.queryObj.yxHbmWkt = this.heBingMian[0].WKTRESPONSE
        http.deriveYxNo(this.queryObj).then(res => {
          loading.close()
          window.open(res.data, '_blank')
        })
      },
      downloadFile(fileurl, filename) {
        var a = document.createElement('a')
        a.download = filename
        a.style.display = 'none'
        // var blob = new Blob([fileurl], {type: 'aplication/zip'})
        a.target = '_barck'
        // a.href = URL.createObjectURL(blob)
        a.href = fileurl
        document.body.appendChild(a)
        a.click() // 触发点击
        document.body.removeChild(a) // 然后移除
      },
      // （订购）加入购物车
      handleAddShop() {
        if(this.yxData.tableShowYx === 'block'){
          //优选
          this.$refs.cyResultYx.handleAddShop()
          return
        }
        if (localStorage.getItem('userName')) {
          this.$notify({
            message: '正在加入购物车....',
            position: 'bottom-right',
            duration: 0
          })
          let _this = this
          let arr = []
          let shopAdd = []
          _this.obj = {}
          if (this.buttonSeleczt) {
            if (_this.screenDataAll.length > 0) {
              shopAdd = _this.screenDataAll
            } else {
              shopAdd = _this.tableData
            }
          } else {
            // 如果全选所有页按钮为选中
            if (this.checkedDataz) {
              if (_this.AllTableDataArr.length > 0) {
                shopAdd = _this.AllTableDataArr
              }
            }
            else {
              shopAdd = _this.TableDataArr
          }

          // 做数据配对处理
          let shopAddDataName = shopAdd.map(item => { return item.F_DATANAME })
          let allDataName = _this.AllTableDataArr.map(item => { return item.F_DATANAME })
          let newList = []
          let dataPair = window.dataPair

          for (let yx of shopAddDataName) {
          let yxArr = yx.split("_");
          let satName = yxArr[0];
          let extracted1 = this.extracted(dataPair, satName, yx);
          if (this.isEmpty(extracted1)) {
            newList.push(yx);
            continue;
          }
          for (let common of allDataName) {
            let commonArr = common.split("_");
            let commonSatName = commonArr[0];
            let extracted2 = this.extracted(dataPair, commonSatName, common);
            if (this.isEmpty(extracted2)) {
              continue;
            }
            if (extracted1 === extracted2) {
              newList.push(common);
            }
          }
        }
        newList = Array.from(new Set(newList))
            if (newList.length > shopAdd.length) {
              this.addPairDataDialog = true;
              // 如果用户点击的是确定那进行配对数据加入购物车
              const handleConfirm = () => {
              this.addPairDataDialog = false;
              this.addPairData = true;

              newList.forEach((s1) => {
                const existingData = this.AllTableDataArr.find((stringObjectMap) => {
                  return stringObjectMap.F_DATANAME === s1;
                });

                if (existingData) {
                  const duplicateData = shopAdd.find((item) => {
                    return item.F_DATANAME === s1;
                  });

                  if (!duplicateData) {
                    existingData.isSelect = true
                    shopAdd.push(existingData);
                  }
                }
              });

              console.log(shopAdd)
              shopAdd.forEach(item => {
                if (!item.isShop && item.isSelect) {
                  _this.obj = {
                    receivetime: this.commonMethod.getDateTyPE(item.F_RECEIVETIME),
                    dataid: item.F_DATAID,
                    dataname: item.F_DATANAME,
                    did: item.F_DID,
                    productlevel: item.F_PRODUCTLEVEL,
                    satelite: item.F_SATELLITEID,
                    sensor: item.F_SENSORID,
                    datasize: item.F_DATASIZE,
                    imageurl: '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.F_DID + '&nodeId=' + item.NODEID,
                    wktresponse: item.WKTRESPONSE,
                    nodename: item.NODENAME,
                    cloudpercent: item.F_CLOUDPERCENT,
                    sgtablename: item.F_TABLENAME,
                    location: item.F_LOCATION + '米',
                    nodeid: item.NODEID, // gy,
                    // 后加的===
                    orbitid: item.F_ORBITID, // gy,
                    scenepath: item.F_SCENEPATH, // gy,
                    scenerow: item.F_SCENEROW // gy,
                  }
                  arr.push(_this.obj)
                }
            })
          if (arr.length > 0) {
            http.addAgrsSave({
              data: arr
            }).then(res => {
              this.$notify.closeAll()
              // loading.close()
              if (res.data !== '0') {
                _this.$message({
                  message: '成功加入购物车',
                  type: 'success'
                })
                // puvu
                this.commonPvzh.postDataPVuVcommonMe({
                  fDataIds: res.data,
                  fUserid: localStorage.getItem('userName'),
                  fClientip: localStorage.getItem('returnCitySNIp'),
                  fBehaviortype: 3
                })
                _this.switchingSelect = []
                _this.getShopCheckData(_this.tableData, 0)
                _this.getShopCarNum()
                _this.checkedDataz = false
                _this.imageAllCheck = false
                _this.TableDataArr = []
                return
              } else {
                _this.$message({
                  message: '暂无数据加入购物车',
                  type: 'warning'
                })
                return
              }
            })
          } else {
            this.$notify.closeAll()
            // loading.close()
            this.$message({
              message: '请选择未加入购物车数据！',
              type: 'warning'
            })
            return
          }
                          
            // 移除确认按钮的点击事件监听
            confirmButton.removeEventListener('click', handleConfirm);
            // 移除取消按钮的点击事件监听
            cancelButton.removeEventListener('click', handleCancel);
          };
          // 如果用户点击的是取消那就不进行配对数据加入购物车
            const handleCancel = () => {
              this.addPairDataDialog = false;
              this.addPairData = false;
              shopAdd.forEach(item => {
                if (!item.isShop && item.isSelect) {
                  _this.obj = {
                    receivetime: this.commonMethod.getDateTyPE(item.F_RECEIVETIME),
                    dataid: item.F_DATAID,
                    dataname: item.F_DATANAME,
                    did: item.F_DID,
                    productlevel: item.F_PRODUCTLEVEL,
                    satelite: item.F_SATELLITEID,
                    sensor: item.F_SENSORID,
                    datasize: item.F_DATASIZE,
                    imageurl: '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.F_DID + '&nodeId=' + item.NODEID,
                    wktresponse: item.WKTRESPONSE,
                    nodename: item.NODENAME,
                    cloudpercent: item.F_CLOUDPERCENT,
                    sgtablename: item.F_TABLENAME,
                    location: item.F_LOCATION + '米',
                    nodeid: item.NODEID, // gy,
                    // 后加的===
                    orbitid: item.F_ORBITID, // gy,
                    scenepath: item.F_SCENEPATH, // gy,
                    scenerow: item.F_SCENEROW // gy,
                  }
                  arr.push(_this.obj)
                }
              })
                if (arr.length > 0) {
                  http.addAgrsSave({
                    data: arr
                  }).then(res => {
                    this.$notify.closeAll()
                    // loading.close()
                    if (res.data !== '0') {
                      _this.$message({
                        message: '成功加入购物车',
                        type: 'success'
                      })
                      // puvu
                      this.commonPvzh.postDataPVuVcommonMe({
                        fDataIds: res.data,
                        fUserid: localStorage.getItem('userName'),
                        fClientip: localStorage.getItem('returnCitySNIp'),
                        fBehaviortype: 3
                      })
                      _this.switchingSelect = []
                      _this.getShopCheckData(_this.tableData, 0)
                      _this.getShopCarNum()
                      _this.checkedDataz = false
                      _this.imageAllCheck = false
                      _this.TableDataArr = []
                      return
                    } else {
                      _this.$message({
                        message: '暂无数据加入购物车',
                        type: 'warning'
                      })
                      return
                    }
                  })
                } else {
                  this.$notify.closeAll()
                  // loading.close()
                  this.$message({
                    message: '请选择未加入购物车数据！',
                    type: 'warning'
                  })
                  return
                }
                
                // 移除确认按钮的点击事件监听
                confirmButton.removeEventListener('click', handleConfirm);
                // 移除取消按钮的点击事件监听
                cancelButton.removeEventListener('click', handleCancel);
              };
              // 监听确认按钮的点击事件
              const confirmButton = document.getElementById('confirmButton');
              confirmButton.addEventListener('click', handleConfirm);

              // 监听取消按钮的点击事件
              const cancelButton = document.getElementById('cancelButton');
              cancelButton.addEventListener('click', handleCancel);
            }else {
              shopAdd.forEach(item => {
                if (!item.isShop && item.isSelect) {
                  _this.obj = {
                    receivetime: this.commonMethod.getDateTyPE(item.F_RECEIVETIME),
                    dataid: item.F_DATAID,
                    dataname: item.F_DATANAME,
                    did: item.F_DID,
                    productlevel: item.F_PRODUCTLEVEL,
                    satelite: item.F_SATELLITEID,
                    sensor: item.F_SENSORID,
                    datasize: item.F_DATASIZE,
                    imageurl: '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + item.F_DID + '&nodeId=' + item.NODEID,
                    wktresponse: item.WKTRESPONSE,
                    nodename: item.NODENAME,
                    cloudpercent: item.F_CLOUDPERCENT,
                    sgtablename: item.F_TABLENAME,
                    location: item.F_LOCATION + '米',
                    nodeid: item.NODEID, // gy,
                    // 后加的===
                    orbitid: item.F_ORBITID, // gy,
                    scenepath: item.F_SCENEPATH, // gy,
                    scenerow: item.F_SCENEROW // gy,
                  }
                  arr.push(_this.obj)
                }
              })
            if (arr.length > 0) {
              http.addAgrsSave({
                data: arr
              }).then(res => {
                this.$notify.closeAll()
                // loading.close()
                if (res.data !== '0') {
                  _this.$message({
                    message: '成功加入购物车',
                    type: 'success'
                  })
                  // puvu
                  this.commonPvzh.postDataPVuVcommonMe({
                    fDataIds: res.data,
                    fUserid: localStorage.getItem('userName'),
                    fClientip: localStorage.getItem('returnCitySNIp'),
                    fBehaviortype: 3
                  })
                  _this.switchingSelect = []
                  _this.getShopCheckData(_this.tableData, 0)
                  _this.getShopCarNum()
                  _this.checkedDataz = false
                  _this.imageAllCheck = false
                  _this.TableDataArr = []
                  return
                } else {
                  _this.$message({
                    message: '暂无数据加入购物车',
                    type: 'warning'
                  })
                  return
                }
              })
            } else {
              this.$notify.closeAll()
              // loading.close()
              this.$message({
                message: '请选择未加入购物车数据！',
                type: 'warning'
              })
              return
            }
          }
        }
      } else {
          this.$message({
            message: '您还未登陆，请先登录！',
            type: 'warning'
          })
          return
        }
      },
      extracted(jsonObject, satName, dataName) {
        // 获取json规则文件
        let jsonObject2 = jsonObject[satName];
        if (!jsonObject2) {
          return null;
        }
        let substrBE2 = jsonObject2.substrBE;
        let substrBEArr2 = substrBE2.split(",");
        return dataName.substring(parseInt(substrBEArr2[0]), parseInt(substrBEArr2[1]));
      },
      isEmpty(str) {
        return str === null || str === undefined || str.trim() === '';
      },
      postDataPVuV(val) {
        let fSensorid = ''
        let fProductlevel = ''
        let fCloudpercent = ''
        let fReceivestarttime = ''
        let fReceiveendtime = ''
        if (val.tables.length !== 0) {
          val.tables[0].queryFieldsList.forEach(item => {
            if (item.alisaName === '传感器') {
              fSensorid = item.queryValue.join('+')
            }
            if (item.alisaName === '产品级别') {
              fProductlevel = item.queryValue.join('+')
            }
            if (item.alisaName === '接收时间') {
              fReceivestarttime = item.queryValue[0]
              fReceiveendtime = item.queryValue[1]
            }
            if (item.alisaName === '云量') {
              fCloudpercent = item.queryValue[0]
            }
          })
        }
        // puvu
        this.commonPvzh.postDataPVuVcommonMe({
          fUserid: localStorage.getItem('userName'),
          fClientip: localStorage.getItem('returnCitySNIp'),
          fAreacode: val.areaCode,
          fNodeName: val.nodeName,
          fSensorid: fSensorid,
          fProductlevel: fProductlevel,
          fCloudpercent: fCloudpercent,
          fReceivestarttime: fReceivestarttime,
          fReceiveendtime: fReceiveendtime,
          fWkt: val.wkt,
          fBehaviortype: 2
        })
      },
      getShopId() {
        let _this = this
        http.getAllShopDataForPage({}).then(res => {
          let shopData = res.data.list
          if (shopData && shopData.length > 0) {
            _this.tableData.map(e => {
              let d = e.F_DATAID
              e.isShop = false
              for (let i = 0; i < shopData.length; i++) {
                if (parseInt(shopData[i].dataid) === parseInt(d)) {
                  e.isShop = true
                  e.isSelect = false
                }
              }
            })
          } else {
            if (_this.tableData) {
              _this.tableData.map(e => {
                e.isShop = false
              })
            }
          }
        })
      },
      getShopCheckData(val, index) {
        let ids = []
        if (val.length > 0) {
          val.forEach(item => {
            ids.push(item.F_DATAID)
          })
        }
        if (localStorage.getItem('userName')) {
          http.checkMeansInShopByIds({data: {dataIds: ids, userid: localStorage.getItem('id')}}).then(res => {
            if (res.data && res.data.length > 0) {
              // 清除点选框中的勾选状态
              this.switchingSelect.push([])
              this.tableData.forEach(item => {
                if (index === 0) {
                  item.isSelect = false
                }
                if (res.data.indexOf(item.F_DATAID) > -1) {
                  item.isShop = true
                }
              })
            }
          })
        }
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
      // // 根据meta去获取购物车数据
      // getMetaByIds (ids, nodeId) {
      //   let t = this
      //   http.getListBeanById({
      //     ids: ids,
      //     nodeId: nodeId
      //   }).then(res => {
      //     this.shopTableData = []
      //     for (var j = 0; j < t.shopRecordsData.length; j++) {
      //       for (var i = 0; i < res.data.length; i++) {
      //         if (parseInt(t.shopRecordsData[j].dataId) === res.data[i].id) {
      //           let obj = {
      //             shopId: t.shopRecordsData[j].id,
      //             dataName: res.data[i].data_name,
      //             dataSize: res.data[i].data_size,
      //             satellite: res.data[i].satellite,
      //             receiveTime: res.data[i].F_RECEIVETIME,
      //             sensor: res.data[i].sensor
      //           }
      //           this.shopTableData.push(obj)
      //         }
      //       }
      //     }
      //   })
      // },
      // 导出所有未未匹配清单
      export2Excel() {
        if (this.notDataListZ.length > 0) {
          require.ensure([], () => {
            const {export_json_to_excel} = require('@comm/static/vendor/Export2Excel')
            const tHeader = [this.hrefShowData]// 生成Excel表格的头部标题栏
            const filterVal = ['value']// 生成Excel表格的内容栏（根据自己的数据内容属性填写）
            const list = this.notDataListZ// 需要导出Excel的数据
            const data = this.formatJson(filterVal, list)
            export_json_to_excel(tHeader, data, '未匹配清单')// 这里可以定义你的Excel表的默认名称
          })
        } else {
          this.$message({
            message: '暂无数据！',
            type: 'warning'
          })
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      confirmOrder() {
        //
        //   // this.userId这里需要传id
        //   var shopId = this.shopId
        //   var param = {
        //     shopId: shopId,
        //     // dataId: this.dataId,
        //     orderName: this.ruleForm.orderReference
        //   }
        //   http.addOrder(param).then(res => {
        //
        //     if (res.data) {
        //       this.$message({
        //         message: '生成订单成功！',
        //         type: 'success'
        //       })
        //       this.shopDialogVisible = false
        //       this.shopInitTable()
        //       // this.handleShopNum()
        //     } else {
        //       this.$message.error('生成订单失败！')
        //       this.shopDialogVisible = false
        //     }
        //   }, (response) => {
        //     this.$message.error('生成订单失败！')
        //   })
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
      // 关闭弹框
      // handleClose (done) {
      //   done()
      // },
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
        setDetailShow: 'setDetailShow',
        setClearPoint: 'setClearPoint',
        setShopIDs: 'setShopIDs',
        settlList: 'settlList',
        setCode: 'setCode',
        setWkt: 'setWkt',
        setQueryStatus: 'setQueryStatus',
        setname: 'setname',
        setSwitchingSelect: 'setSwitchingSelect',
        setDialogShowDataZ: 'setDialogShowDataZ',
        setHfShowTl: 'setHfShowTl',
        setNodeIndexData: 'setNodeIndexData',
        setHcShowTl: 'setHcShowTl',
        setHdShowTl: 'setHdShowTl',
        setHyShowTl: 'setHyShowTl'
      }),
      ...mapActions('configManage', {
        getOrderDetails: 'getOrderDetails',
        getCommonHeight: 'getCommonHeight',
        getShopCarNum: 'getShopCarNum'
      }),
      ...mapActions('news', {
        setAllYxData: 'setAllYxData'
      }),
      ...mapActions('news', {
        setChangeDataList: 'setChangeDataList'
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
      }
    },
    computed: {
      ...mapState('searchStore', {
        tables(state) {
          this.getSensortransData()
          if (Object.keys(state.resultData).length === 0) return
          let {
            queryFieldsList
          } = state.resultData.tables[0]
          this.tableName = state.resultData.tables[0].tableName
          this.showCon = []
          if (state.resultData.tables[0].showFieldsList) {
            state.resultData.tables[0].showFieldsList.forEach(item => {
              if (window.resultSpanLi.indexOf(item.alisaName) > -1) {
                this.showCon.push(item)
              }
            })
          }
          if (this.showCon.length > 0) {
            this.showCon = [this.showCon[1], this.showCon[0]]
          }
          this.queryFieldsListValues = state.resultData.values
          queryFieldsList.forEach(each => {
            each.nodeId = state.resultData.nodeId
            each.queryValue = []
            if (each.type === 'SingleIntConfig') {
              each.queryValue = [20]
            }
          })
          console.log(queryFieldsList, 'queryFieldsList')

          return queryFieldsList
        },
        tablesZ(state) {
          if (Object.keys(state.resultDataZ).length === 0) return
          let queryFieldsListZ = state.resultDataZ.tables[0].queryFieldsList
          this.tableName = state.resultDataZ.tables[0].tableName
          if (this.tableName.indexOf(',') > -1) {
            this.newNodeId = ''
            let arrName = this.tableName.split(',')
            let nodeA = state.resultDataZ.nodeId.split(',')
            arrName.forEach((item, index) => {
              this.newNodeId += item + '-' + nodeA[index] + ','
            })
            this.newNodeId = this.newNodeId.slice(0, this.newNodeId.length - 1)
          } else {
            this.newNodeId = state.resultDataZ.nodeId
          }
          queryFieldsListZ.forEach(each => {
            each.queryValue = []
            each.nodeId = this.newNodeId
            if (each.type === 'RangeDateConfig') {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              each.queryValue = [start, end]
            }
            if (each.type === 'SingleIntConfig') {
              each.queryValue = [20]
            }
          })
          return queryFieldsListZ
        },
        clientdata(state) {
          return state.clientHeight
        },
        newTimed(state) {
          return state.newTimed
        },
        searchArea(state) {
          return state.searchArea
        },
        locationD(state) {
          return state.locationD
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
        queryStatus(state) {
          return state.queryStatus
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
      },
      allYxData: {
        get: function () {
          return this.$store.state.news.allYxData
        },
        set: function (newValue) {
          this.$store.state.news.allYxData = newValue
        }
      },
      changeDataList: {
        get: function () {
          return this.$store.state.news.changeDataList
        },
        set: function (newValue) {
          this.$store.state.news.changeDataList = newValue
        }
      }
    },
    watch: {
      changeDataList(val){
        if(val === "全部记录"){
          this.selectAll()
        }
        if(val === "优选结果"){
          this.selectYx()
        }
      },
      allYxData(val) {
        if (val.yxData.tableShowYx === 'block') {
          this.yxButton = false
        }
        if (val.yxData.tableShowYx === 'none') {
          this.yxButton = true
        }
      },
      tableData() {
        this.timeKey = new Date().getTime()
      },
      clientdata(val) {
        this.clientHeight = val
        this.init(val)
        this.tableW = (document.documentElement.clientHeight - 280) / 50 + 'rem'
      },
      tabelPopdata(val) {
        if (val[0] === 1) {
          this.switchingFlag = false
          // this.switchingNameFlag = false
          this.switchingName = '显示点选结果'
          this.pageSize = 30
          let dataC = []
          dataC = JSON.parse(sessionStorage.getItem('dataObj')).tableData
          this.$set(this.tableData, 'refresh', '0')
          // this.total = this.AllTableDataArr.length > 0 ? this.AllTableDataArr[0].SIZENUM : 1
          this.total = this.AllTableDataArr.length
          this.tableData = dataC
          this.$forceUpdate()
          console.log('refresh', this.tableData)
          this.switchingNameFlag = true
          // this.tableData = dataC
          // 取消
          this.imageAllCheck = false
          // this.currentPageAllSelect()
          this.getTotalNum(this.total)
          // if(val[0] === 1){
          //   this.query(this.queryObj)
          // }
        } else {
          this.switchingName = '显示全部结果'
          this.switchingNameFlag = true
          this.switchingArrPoint = val
          // 点选一页显示所有
          this.pageSize = val.length
          this.tableData = []
          this.tableData = val
          this.switchingNameFlag = false
          for (let i = 0; i < this.tableData.length; i++) {
            this.tableData[i].F_RECEIVETIME = this.formatTime(this.tableData[i].F_RECEIVETIME, 'Y-M-D h:m:s')
            this.tableData[i].imageurl = '/mj/metaImage/getImageByTypeForAll?typeId=2&dataId=' + this.tableData[i].F_DID + '&nodeId=' + this.tableData[i].NODEID
          }
          this.total = val.length
          this.totalNum = 1
        }
      },
      navListIndex(val) {
      },
      switchingSelect(val) {
        this.setSwitchingSelect(val)
      },
      resultStr(val) {
        let _this = this
        if (val.length > 0) {
          _this.tableData.forEach((item, index) => {
            if (val.indexOf(item.F_DID.toString()) > -1) {
              item.isSelect = true
              _this.$set(_this.tableData, index, item)
              _this.TableDataArr.push(item)
            } else {
              item.isSelect = false
              _this.$set(_this.tableData, index, item)
              _this.TableDataArr = []
            }
          })
        } else {
          _this.tableData.forEach((item, index) => {
            item.isSelect = false
            _this.$set(_this.tableData, index, item)
          })
        }
      },
      nodeId() {
        this.resetChartlet()
        this.total = 0
        this.tableData = []
        // gisMap.clearAll()
      },
      tableD() {
        // this.resetChartlet()
        this.total = 0
        this.tableData = []
        this.setActiveName('condition')
        // gisMap.clearAll()
      },
      menuShow() {
        this.$refs['cy-result'].style.right = this.menuShow ? 0 : '-500px'
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
      // tableData: {
      //   handler(newVal, oldVal) {
      //     let _this = this
      //     let indexArr = []
      //     if (newVal) {
      //       if (newVal.length > 0) {
      //         newVal.forEach(item => {
      //           if (!item.isSelect) {
      //             indexArr.push(item)
      //           }
      //           if (this.buttonSelect) {
      //             if (_this.screenDataAll.length > 0) {
      //               _this.screenDataAll.forEach(e => {
      //                 if (item.F_DATAID === e.F_DATAID) {
      //                   e.isSelect = item.isSelect
      //                   // e.isShop = item.isShop
      //                 }
      //               })
      //             }
      //           } else {
      //             if (_this.AllTableDataArr.length > 0) {
      //               _this.AllTableDataArr.forEach(e => {
      //                 if (item.F_DATAID === e.F_DATAID) {
      //                   e.isSelect = item.isSelect
      //                   // e.isShop = item.isShop
      //                 }
      //               })
      //             }
      //           }
      //         })
      //       }
      //     }
      //     if (indexArr.length > 0) {
      //       _this.imageAllCheck = false
      //     } else {
      //       _this.imageAllCheck = true
      //     }
      //     console.log(_this.screenDataAll,_this.AllTableDataArr)
      //     let arrayD = []
      //     if(_this.buttonSelect){
      //       arrayD = _this.screenDataAll
      //     }else{
      //       if(_this.imageAllCheck === true && _this.checkedDataz === true){
      //         arrayD = _this.AllTableDataArr
      //       }else{
      //         arrayD = _this.tableData
      //       }
      //     }
      //     console.log(arrayD)
      //     this.getAllTableDataArr(arrayD)
      //     // this.getShopId()
      //   },
      //   deep: true
      // },
      AllTableDataArr: {
        handler(newVal, oldVal) {
          let indexAllArr = []
          if (newVal.length > 0) {
            newVal.forEach(item => {
              if (!item.isSelect) {
                indexAllArr.push(item)
              }
            })
          }
          // if (indexAllArr.length > 0) {
          //   this.checkedDataz = false
          // } else {
          //   this.checkedDataz = true
          // }
        },
        deep: true
      },
      shopAgen(val) {
        // this
        this.shopInitTable()
        this.getShopId()
      },
      allScaleControl() {
      },
      $route: {
        handler: function (val, oldVal) {
          if (val.params.shapepath !== undefined) {
            let path = val.params.shapepath
            let _this = this
            http.getWktInfo({
              shapePath: path
            }).then(res => {
              _this.setWkt(res.data)
              let feature = {
                style: {
                  fillcolor: 'rgba(255, 255, 0, 0)',
                  strokecolor: 'rgba(255, 0, 0, 1)',
                  strokewidth: 3
                },
                geometry: res.data
              }
              gisMap.addPolygon(feature, "featuresSourcePageImage")
              gisMap.flyTo(gisMap.transformFeatureFromWkt(res.data))
            })
          }
          if (val.fullPath === '/search') {
            this.setActiveName('condition')
          }
          this.tableData = []
          this.total = 0
          this.setname('')
          this.setCode('')
          this.setWkt('')
        },
        // 深度观察监听
        deep: true
      }
    },
    activated() {
      this.tableW = (document.documentElement.clientHeight - 280) / 50 + 'rem'
    }
  };
</script>


<style lang="scss">
  @import '@/assets/css/global.scss';

  .cy-result {
    position: absolute;
    /*width: 7rem;*/
    width: 26vw;
    right: 0;
    z-index: 1;
    top: $cyresultTop;
    transition: right 0.8s;
    /*border-left: 1px solid #E5E6E5;*/
    height: $cyresultH;
    //滚动条的宽度
    ::-webkit-scrollbar {
      background-color: #DAEBFE;
    }

    //滚动条的滑块
    ::-webkit-scrollbar-thumb {
      background-color: #0065F7;
      border-radius: 3px;
    }

    .bottZ {
      width: 36px;
      background: #f0f4fe;
      border: 1px solid rgba(61, 110, 241, 0.2);
      font-size: 12px;
      cursor: pointer;
    }

    .bottDzS {
      background: #f0f4fe;
      border: 1px solid rgba(61, 110, 241, 0.2);
      font-size: 12px;
      padding: 0 7px;
      cursor: pointer;
    }

    .resultDZ .el-checkbox__label {
      font-size: 13px !important;
      padding-left: 4px !important;
      padding-right: 4px !important;
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
      font-size: 15px !important;
    }

    .buttonActive {
      border: 1px solid rgba(61, 110, 241, 1) !important;
      background-color: rgba(61, 110, 241, 1) !important;
      color: #fff !important;
    }

    .bottDz {
      cursor: pointer;
      background: #4978f1;
      padding: 0px 7px;
      color: #fff;
      font-size: 13px;
    }

    .txnoif_bto {
      margin-top: 5px;
      overflow: hidden;
      height: $resultDivZH;
      background: #fff;
    }

    .txnoif_bto2 {
      margin-top: 0px;
      overflow: hidden;
      height: 0.7rem;
      background: #fff;
    }
    .txnoif_bto2 button {
      background-color: rgba(46, 109, 252, 0.2);
      color: #000000;
      display: inline-block;
      width: 200px;
      height: 29px;
      border: 1px solid #21ADB7; /* 添加边框样式 */
      border-radius: 4px;
      transition: background-color 0.1s ease;
      /* 添加其他按钮样式，如边框、阴影等 */
    }

    .txnoif_bto2 button:focus,
    .txnoif_bto2 button:hover {
      outline: none;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      background-color: #2E6DFC; /* 按钮鼠标悬停时的渐变效果 */
      border-color: #21ADB7; /* 添加边框颜色 */
    }
    .isYxSelected {
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      background-color: #2E6DFC;
      border-color: #21ADB7;
    }
    .selected {
      background-color: #E3F7FC;
      border-color: #409EFF;
      color: #409EFF;
    }
    .txnoif_zy {
      display: inline-block;
      /* background: blue; */
      position: absolute;
      left: -11px;
      top: 18px;
      width: 0;
      height: 0;
      border-right: 12px solid rgb(252, 231, 196);
      border-bottom: 10px solid transparent;
      border-top: 12px solid transparent;
    }

    .txnoif {
      line-height: 23px;
      border-radius: 2px;
      border: 1px solid rgb(249, 206, 137);
      position: absolute;
      top: 4.4rem;
      width: 182px;
      background: rgb(252, 231, 196);
      height: 96px;
      left: 96px;
      color: rgb(243, 156, 18);
      font-size: 12px;
      padding: 7px;
    }

    .spanColor {
      color: #5B85F1;
    }

    .newTimeD {
      text-align: center;
      line-height: 40px;
      background: rgba(73, 120, 241, 0.05);
      /*height: 40px;*/
      width: 90%;
      padding: 5px;
      margin-left: 5%;
    }

    .resultDivZ {
      margin-top: 5px;
      overflow: hidden;
      height: $resultDivZH;
      background: #fff;

      .el-tabs__content {
        /*padding: .2rem .1rem !important;*/
      }

      .el-radio {
        margin-right: 3px !important;
      }

      .el-radio__label {
        padding-left: 2px !important;
      }
    }

    .resultDataTable > > > .el-table .cell {
      padding: 0 !important;
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

    .resultDataTable {
      height: 11.6rem !important;
      td {
        padding: 3px 0;
      }

      img {
        width: 25px;
        height: 27px;
      }
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
        /*height: 20px;*/
        /*margin-left: 10px;*/
        /*line-height: 20px;*/
        /*margin-top: 17px;*/
        /*display: inline-block;*/
        /*padding-left: 5px;*/
        /*border-left: 3px solid #316BFC;*/
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
        display: flex;
        align-items: center;
        padding: 0.1rem 0;
        font-size: 0.26rem;

        .conditionSpan {
          text-align: right;
          /*flex: 1.5;*/
          width: 25%;
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
    }

    .resultDiv {
      .resultPagination {
        line-height: 26px;
        width: 100%;
        text-align: center;
        font-size: 14px !important;

        span {
          font-size: 14px !important;
        }

        .el-pagination__jump {
          margin-left: 0 !important;
          font-size: 14px !important;
        }

        .el-pagination__total {
          font-size: 14px !important;
        }
      }

      .resultButton {
        width: 100%;
        text-align: left;
        // margin-top: 0.2rem;
        .el-button--mini {
          padding: 7px 3px;
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

  .resultPagination_z > > > .el-pagination__jump {
    margin-left: 0 !important;
  }

  .resultPagination_z span {
    margin-left: 0 !important;
  }

  .tableD {
    /*height: 70%;*/
    .el-table th {
      padding: 0 !important;
      color: #353535 !important;
      background-color: #EBF0FA !important;
    }

    .el-table th, td {
      text-align: center !important;
    }

    .el-table td {
      border-bottom: none;
    }

    .el-table .cell {
      padding: 0 !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      display: -webkit-box !important;
      -webkit-line-clamp: 2 !important;
      -webkit-box-orient: vertical !important;
      -webkit-box-sizing: border-box !important;
      box-sizing: border-box !important;
      white-space: normal !important;
      word-break: break-all !important;
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

  .resultDataTable > > > .el-table__row > .cell {
    padding-right: 0 !important;
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
    /*opacity: 0.7;*/
    //bottom: -6px !important;
    z-index: 3004;
    right: 491px !important;
    height: 58px;
    margin: 7px;
    padding: 0;
    border-radius: 12px;
    color: #fff;
    padding-top: 12px;
    background: #5a9cff;
    border-color: #edc893;
  }

  .el-notification .el-icon-info {
    display: none !important;
  }

  .eldialog_con {
    width: 100%;
    height: 60vh;
  }

  .eldialog_con_z {
    width: 100%;
    height: 60vh;
    margin-bottom: 10px;
    overflow: auto;
  }

  .contionImg {
    width: 43px;
    padding: 0.6rem 0.4rem;
    float: left;
  }

  .contionDivZ {
    position: relative;
    margin-top: 10px;
    height: 100px;
    line-height: 100px;
    background: #F3F4F9;
    color: #3C6EF0;
  }

  .contionDivZLastSpan {
    font-size: 13px;
    display: inline-block;
    line-height: 20px;
    cursor: pointer;
    width: 45%;
  }

  .contionDivZLast {
    position: relative;
    margin-top: 10px;
    height: 60px;
    line-height: 60px;
    background: #F3F4F9;
    color: #3C6EF0;

    img {
      width: 43px;
      padding: 0.2rem 0.4rem;
      float: left;
    }
  }

  .contionSpanD {
    font-size: 13px;
    padding: .8rem 0;
    display: inline-block;
    line-height: 20px;
    width: 73%;

    a {
      color: rgb(28, 81, 217);
      font-weight: bold;
      cursor: pointer;
      font-size: 14px;
    }
  }

  .dialog_content {
    .spanDataListZ {
      width: 22%;
      display: inline-block;
      margin: 12px;
      text-align: center;
      font-size: 17px;
    }

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

    .el-dialog__body {
      padding: 0 20px 20px 20px !important;
    }

    .el-dialog__title {
      line-height: 24px;
      font-size: 17px;
      color: #303133;
      font-weight: bold;
    }

    .el-checkbox {
      color: #606266;
      font-weight: 500;
      cursor: pointer;
      font-size: 16px !important;
      width: 23% !important;
      margin: 7px !important;
      text-align: center;
    }

    .el-checkbox__label {
      font-size: 16px !important;
    }

    .cy-result > > > .el-tabs__item {
      font-size: 15px !important;
    }
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
</style>
