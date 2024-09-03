<template>
  <div class="resultDetailsDiv">
    <el-dialog class="titleD" :fullscreen="showDiv" title="详情信息" :visible.sync="xqDialogVisible"
               width="60%" :before-close="handleClose" :modal-append-to-body="false">
      <div style="float: right;margin-right: 20px;margin-top: -45px;font-size: 15px;">
        <i class="el-icon-zoom-out" @click="divToSim" style="cursor:pointer;margin-top: 3px;"></i>
        <i class="el-icon-zoom-in" @click="divToBig"
           style="cursor:pointer;margin-top: 3px;margin-left: 10px;margin-right: 10px;"></i>
      </div>
      <div v-if="!fourthShow" style="position:relative;top:-48px;left:80px;width:10rem;">
        <span class="newDhhClass">新档案号：{{ this.newDhh }}</span>
        <span class="oldDhhClass">旧档案号：{{ this.oldDhh }}</span>
      </div>
      <div ref="diaDiv" style="width: 100%;margin-top: -50px;">
        <el-tabs type="border-card" class="elClassTab" v-model="activeTab" @tab-click="handleClick" ref="tabs">
          <el-tab-pane v-if="firstShow" label="测区信息" name="first">
            <div ref="firstHeight"
                 style="overflow: hidden; overflow-y: auto; width: 100%; margin-left: 30px;margin-top: 35px;margin-bottom: 15px;"
                 :style="{height: heightpx}">
              <!--增加hidden代码-->
              <div data-v-72faee09="" hidden="hidden">
                <span data-v-72faee09="" title="OBJECTID" class="spantab">{{ this.objectTitle }}</span>
                <span data-v-72faee09="" title="580" class="spantab"
                      style="width: 32%; color: rgb(0, 0, 0);">{{ this.objectValue }}</span>
              </div>
              <div style="" v-show="true" v-for="(item, index) in paramRowDatanew" :key="index">
                <span :title="index" class="spantabIndex">&nbsp;&nbsp;{{ item.label}}:</span>
                <span :title="item" class="spantab" style="width: 32%;color: #000;">&nbsp;&nbsp;{{ item.value }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane v-if="secondShow" label="项目信息" name="second">
            <div ref="firstHeight"
                 style="overflow: hidden; overflow-y: auto; margin-left: 30px;margin-top: 35px;margin-bottom: 15px;"
                 :style="{height: heightpx}">
              <div v-show="xmData.length !== 0" v-for="(item, index) in xmData" :key="index">
                <span style="text-align: left" :title="item.name"
                      class="spantabIndex">&nbsp;&nbsp;{{ item.name }}:</span><span :title="item.value" class="spantab"
                                                                                    style="width: 32%;color: #000;">&nbsp;&nbsp;{{ item.value }}</span>
              </div>
              <div style="width: 100%; float: left;">
                <span v-if="xmDatajj.length !== 0" style="text-align: left;" class="content">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;内容提要:</span>
                <span v-if="xmDatajj.length !== 0" class="contentjj"
                      style="color:#000;padding-top: 10px;padding-left: 10px;font-size: 13px;">&nbsp;&nbsp;&nbsp;&nbsp;{{ this.xmDatajj[0].value }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane class="detailsTab" v-if="thirdShow" label="资料信息" name="third">
            <!-- <el-cascader placeholder="请选择检索列" v-model="rowproperty" :options="options" filterable></el-cascader> -->
            <!-- <el-input size="small" style="width:294px" v-model="rowpropertyvalue" placeholder="请输入内容"></el-input>
            <el-button type="primary" size="small" @click="getZLdata">检索</el-button> -->
            <el-table size="mini" :height="height" id="eltableData" :data="tableData"
                      @selection-change="handleSelectionChange" style="width:100%;">
              <el-table-column type="selection" min-width="10%">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="FILENAME" label="文件名称" min-width="16%">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="FILECHINANAME" label="文件题名" min-width="43%">
              </el-table-column>
              <el-table-column prop="FILETYPE" label="类型" min-width="10%">
              </el-table-column>
            </el-table>
            <div class="resultPagination" v-show="showPagination">
              <el-pagination :current-page="currentPage" :page-size="pageSize" :pager-count="5"
                             style="float:right; margin-top: 5px" @current-change="handleCurrentChange"
                             @size-change="handleSizeChange" layout="total, prev, pager, next, jumper"
                             :total="shopTotal">
              </el-pagination>
            </div>
            <!--隐藏域，所有的资料信息，用于导出全部使用-->
            <el-table size="mini" :height="height" id="allTableData" :data="initData" style="width:100%;display:none;">
              <el-table-column type="selection" min-width="10%">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="FILENAME" label="文件名称" min-width="16%">
              </el-table-column>
              <el-table-column :show-overflow-tooltip="true" prop="FILECHINANAME" label="文件题名" min-width="43%">
              </el-table-column>
              <el-table-column prop="SOFTTYPE" label="类型" min-width="10%">
              </el-table-column>
            </el-table>
            <!--TODO: 地质云-购物车-->
            <!-- <el-button type="primary" style="float: left;margin-top: 5px;margin-left: 5px;" @click="handleAddShop" icon="el-icon-plus">添加到购物车</el-button>-->
            <el-button v-show="showPagination" style="margin: 5px 0 0 5px;float: left;" type="primary" size="small"
                       @click="exportExcel"><i class="el-icon-download"></i>导出
            </el-button>
            <el-button v-show="showPagination" style="margin: 5px 0 0 5px;float: left;" type="primary" size="small"
                       @click="exportAllExcel"><i class="el-icon-download"></i>导出全部
            </el-button>
            <el-input size="small" style="width: 150px;margin-left: 5px;margin-top: 5px;" v-model="rowpropertyvalue"
                      placeholder="请输入内容"></el-input>
            <el-button type="primary" size="small" @click="getZLdata">检索</el-button>
          </el-tab-pane>
          <el-tab-pane v-if="fourthShow" label="数据信息" name="fourth">
            <div style="overflow: hidden; overflow-y: auto; width: 100%;height: 570px;">
              <!--            <div class="eldialog_con_map">-->
              <!--              <div ref="mapDivDialog" id="mapDivDialog" class="map" style="height: 52.5%;width: 50%;right: 0;-->
              <!--    position: absolute;margin:5px;"></div>-->
              <!--            </div>-->
              <!--            <div style="width: 100%; height: 53.5%;margin:5px;">-->
              <!--              <el-image :src="this.paramRowimageData" style="width: 48.5%;height: 100%;right: 0;position: relative;">-->
              <!--                <div slot="placeholder" class="image-slot">-->
              <!--                  加载中<span class="dot">...</span>-->
              <!--                </div>-->
              <!--              </el-image>-->
              <!--              &lt;!&ndash;<img :src="this.paramRowimageData" alt="" style="width: 100%; height: 100%;">&ndash;&gt;-->
              <!--            </div>-->
              <el-scrollbar>
                <div style="margin-left:5px" v-for="(item, index) in paramRowDatanew" :key="index" v-show="getBR(index)">
                  <span :title="index" class="spantabIndex">&nbsp;&nbsp;{{ item.label}}:</span>
                  <span :title="item" class="spantab" style="width: 32%;">&nbsp;&nbsp;{{ item.value }}</span>
                </div>
              </el-scrollbar>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from 'axios'
import http from '@comm/service/interface.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import {
  mapActions,
  mapState
} from 'vuex'
import GISMap from '@comm/map/GISMap.js'
import * as MapData from '@comm/map/lib/mapData.js'

const {baseMapInitParameters} = MapData
let gisMapDia = null
export default {
  name: 'resultDetails',
  props: {
    paramRowData: {
      // type: Object,
      default: {
        alias: '',
        description: ''
      }
    },
    paramRowimageData: {
      type: String
    }
  },
  data() {
    return {
      innerVisible2: true,
      paramRowDatanew: {},
      objectTitle: '',
      objectValue: '',
      firstShow: true,
      secondShow: true,
      thirdShow: true,
      fourthShow: false,
      showDiv: false,
      hTable: 440,
      paginationVisible: false,
      xqDialogVisible: false,
      ketData: '',
      oldDhh: '',
      newDhh: '',
      selectData: [],
      initData: [],
      xmData: [],
      xmDatajj: [{
        name: '',
        value: ''
      }],
      xmDatacq: [],
      showPagination: false,
      addShopShow: false,
      activeTab: 'first',
      currentPage: 1,
      pageSize: 30,
      shopTotal: 0,
      tableData: [],
      typeData: [{
        value: 1,
        label: '电子'
      },
        {
          value: 2,
          label: '纸质'
        },
        {
          value: 3,
          label: '电子纸质'
        }
      ],
      beasData: [{
        'ID_ML_PK': 'df5d38f5-f074-440d-afc5-777c3c961778',
        'id_fl': '',
        'dzwdh': '',
        'id_dzwdh_pk': '000002',
        'c_dag': '',
        'id_qgdgh': '',
        'C_HJLB': '',
        'id_hjld': '',
        'TM': '222西藏藏东地区航磁调查综合研究成果报告',
        'XCDW': '中国国土资源航空物探遥感中心',
        'P_BZZ': '乔春贵，徐剑春，刘伟，刘志强，王德发，梁秀娟，单希鹏，杨海，曹宝宝，段淑海，石磊，吴云',
        'C_GB': '',
        'GB': '',
        'C_WZ': '',
        'WZ': '',
        'C_YZ': '',
        'YZ': '中文',
        'C_MJ': '',
        'MJ': '不涉密',
        'C_BGQX': '',
        'BGQX': '',
        'DT_BHQ': null,
        'DT_BGXC': '2016/10/1 0:00:00',
        'DT_GZKS': '2011/1/1 0:00:00',
        'DT_GZJS': '2016/12/31 0:00:00',
        'DT_PSSJ': '2017/5/19 0:00:00',
        'SPJG': '中国地质调查局',
        'C_SPJGJB': '',
        'SPJGJB': '',
        'JD_START': 'E',
        'JD_START_D': '095',
        'JD_START_F': '26',
        'JD_START_M': '00',
        'JD_END': 'E',
        'JD_END_D': '098',
        'JD_END_F': '47',
        'JD_END_M': '00',
        'WD_START': 'N',
        'WD_START_D': '28',
        'WD_START_F': '30',
        'WD_START_M': '00',
        'WD_END': 'N',
        'WD_END_D': '32',
        'WD_END_F': '02',
        'WD_END_M': '00',
        'C_XZQMC_SEQ': '542100 ',
        'XZQMC_SEQ': '西藏自治区 昌都地区',
        'C_gzcd': '13',
        'gzcd': '1/25万',
        'C_ZLLB': '10',
        'ZLLB': '区调',
        'TZZT': '',
        'C_KC_SEQ': '',
        'KC_SEQ': '',
        'ZMLH': '',
        'ZMLXCSJ': null,
        'ZMLTM': '',
        'ZMLXCDW': '',
        'NUM_WS': 1,
        'NUM_YS': null,
        'BZ_W': '',
        'NUM_FT': 13,
        'BZ_FT': '',
        'NUM_FJ': 3,
        'BZ_FJ': '',
        'NUM_FB': 2,
        'BZ_FB': '',
        'NUM_SPS': 2,
        'BZ_SPS': '',
        'NUM_DMT': 0,
        'BZ_DMT': '',
        'NRTY': '为促进西藏藏东地区的基础地质研究和矿产勘查，中国国土资源航空物探遥感中心于2011-2016年在西藏藏东地区开展了1∶25万航磁调查工作。累计完成工作量52523.5km，覆盖面积约97613km2。各项测量指标均达到或优于设计要求，为西藏藏东地区提供了一份可靠的基础地球物理资料。\n全区共选编航磁异常493处，其中新编415处。通过对成矿环境、找矿意义的综合分析，确定甲、乙类异常234处，为在藏东地区寻找铁、铜、铅锌等金属矿产提供了重要线索。\n通过航磁异常地面查证，在阿谢同异常（藏C-2016-38）新发现的闪长玢岩体内发现长42m、宽13m的孔雀石化蚀变带，经捡块取样分析，Cu含量为1.75～6.47%。\n参考以往地质、物探、化探、遥感等多元信息，对航磁反映的断裂构造形迹、岩性分布特征及局部异常与矿产之间的关系等问题进行了综合分析研究，取得了丰硕成果，为今后在该地区开展基础地质研究、矿产资源评价提供了依据。全区共确定断裂41条，其中一、二级断裂14条；推断火山机构4处；圈定各类侵入岩体180处，其中隐伏岩体73处。\n全区共圈定找矿远景预测区42个，并在远景区内指出了重点找矿靶区，其中一级找矿远景预测区12个、二级找矿远景预测区12个、三级找矿远景预测区18个。这些远景区和找矿靶区的圈定，对该地区今后的矿产资源勘查工作具有一定的指导意义。\n',
        'NUM_DA': null,
        'P_HJ': '中国国土资源航空物探遥感中心',
        'FZ': '',
        'CGBCDW': '',
        'SWBCDW': '中国国土资源航空物探遥感中心',
        'LJ_FTP': '000001-000100/000001',
        'STATUS': '1',
        'P_TBR': '',
        'P_LRR': '',
        'P_SHR': '',
        'DT_LRRQ': null,
        'DAGMC': '中国国土资源航空物探遥感中心',
        'GPH': '',
        'LX': '成果',
        'DT_HJ': '2017/10/16 0:00:00',
        'ZTC': ''
      }],
      beasZLdata: [
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0006.JPG',
          'BLC': '1/25万',
          'BZ': '97.99cm*122.92cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 35.0110,
          'FILECHINANAME': 'I-46-[16]、I-47-[13]、H-46-[4]、H-47-[1]、  H-46-[8]、H-47-[5]、H-46-[12]、H-47-[9] 西藏藏东地区航磁ΔT等值线平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '91bc3b60-b633-4f56-bdaf-22964ecee0b8',
          'FILENAME': 'T01_0006.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0006',
          'TH': 'Ⅳ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0007.JPG',
          'BLC': '1/25万',
          'BZ': '81.75cm*111.00cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.09,
          'FILECHINANAME': 'I-47-[14]、H-47-[2]、H-47-[6] 西藏藏东地区航磁ΔT等值线平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '931ced34-3f69-4d6b-b0f6-bc1eb71f153a',
          'FILENAME': 'T01_0007.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0007',
          'TH': 'Ⅳ2'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0008.JPG',
          'BLC': '1/25万',
          'BZ': '139.84cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 21.2840,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14] 西藏藏东地区航磁ΔT等值线平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '8bd0988e-d708-417e-8aa2-73440d99bb7d',
          'FILENAME': 'T01_0008.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0008',
          'TH': 'Ⅳ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0009.JPG',
          'BLC': '1/50万',
          'BZ': '90.13cm*97.32cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 27.26,
          'FILECHINANAME': 'I-46-D、I-47-C、H-46-B、H-47-A、H-46-D  H-47-C西藏藏东地区航磁ΔT化极等值线平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': 'fd839dbb-83cd-4a9a-8584-1a4bc522780f',
          'FILENAME': 'T01_0009.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0009',
          'TH': 'Ⅴ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0010.JPG',
          'BLC': '1/50万',
          'BZ': '90.13cm*97.32cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 21.0360,
          'FILECHINANAME': 'I-46-D、I-47-C、H-46-B、H-47-A、H-46-D  H-47-C西藏藏东地区航磁ΔT化极垂向一阶导数等值线平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '8a1a4c21-9dde-4d1e-a962-ec9ae12ff7dc',
          'FILENAME': 'T01_0010.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0010',
          'TH': 'Ⅵ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0011.JPG',
          'BLC': '1/50万',
          'BZ': '90.52cm*97.32cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 28.3320,
          'FILECHINANAME': 'I-46-D、I-47-C、H-46-B、H-47-A、H-46-D  H-47-C西藏藏东地区航磁ΔT化极上延1km等值线平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': 'b1aef250-f57b-4860-a08f-63edca81b0ff',
          'FILENAME': 'T01_0011.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0011',
          'TH': 'Ⅶ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0012.JPG',
          'BLC': '1/50万',
          'BZ': '89.79cm*96.82cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 12.7760,
          'FILECHINANAME': 'I-46-D、I-47-C、H-46-B、H-47-A、H-46-D  H-47-C西藏藏东地区航磁推断岩性构造图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '9a760b09-cc1c-49a1-b940-287d5323735e',
          'FILENAME': 'T01_0012.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0012',
          'TH': 'Ⅷ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0013.JPG',
          'BLC': '1/50万',
          'BZ': '98.92cm*97.41cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 12.5760,
          'FILECHINANAME': 'I-46-D、I-47-C、H-46-B、H-47-A、H-46-D  H-47-C西藏藏东地区航磁异常分布及找矿远景预测图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '2afd7b56-aed3-4ad8-ac01-df8368fbb822',
          'FILENAME': 'T01_0013.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0013',
          'TH': 'Ⅸ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/B01_0001.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 1.6230,
          'FILECHINANAME': '附表1 西藏藏东地区航磁异常登记表',
          'FILEEXTENSION': '.pdf',
          'FILEID': '0c92efd5-9d69-47de-b63b-3ba78971119a',
          'FILENAME': 'B01_0001.pdf',
          'FILETYPE': '附表',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'B01_0001.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/B01_0002.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 1.0730,
          'FILECHINANAME': '附表2 西藏藏东地区岩矿石磁化率统计表',
          'FILEEXTENSION': '.pdf',
          'FILEID': '6d503c5c-7428-487a-b0a4-038e57f72f33',
          'FILENAME': 'B01_0002.pdf',
          'FILETYPE': '附表',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'B01_0002.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/J01_0001.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 3.5280,
          'FILECHINANAME': '附件1 西藏藏东地区航磁调查测量成果报告',
          'FILEEXTENSION': '.pdf',
          'FILEID': '26e3f4fe-2b5d-48cd-b5e6-cb11b65754ce',
          'FILENAME': 'J01_0001.pdf',
          'FILETYPE': '附件',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'J01_0001.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/J01_0002.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 3.3850,
          'FILECHINANAME': '附件2 西藏藏东地区航磁异常查证成果报告（一）',
          'FILEEXTENSION': '.pdf',
          'FILEID': '3c753073-ae11-4bd2-b335-866da287b1d7',
          'FILENAME': 'J01_0002.pdf',
          'FILETYPE': '附件',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'J01_0002.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/J01_0003.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 14.0530,
          'FILECHINANAME': '附件3 西藏藏东地区航磁异常查证成果报告（二）',
          'FILEEXTENSION': '.pdf',
          'FILEID': '3f2ece93-9f28-4dd1-a914-a202d8ce95e3',
          'FILENAME': 'J01_0003.pdf',
          'FILETYPE': '附件',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'J01_0003.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/Q01_0001.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 0.6170,
          'FILECHINANAME': '中国地质调查局地质调查子项目任务书（编号：[2015]02-12-02-002）',
          'FILEEXTENSION': '.pdf',
          'FILEID': '1969e0ec-4d0f-45e6-9c34-7db519b979bd',
          'FILENAME': 'Q01_0001.pdf',
          'FILETYPE': '其它',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'Q01_0001.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/Q01_0002.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 0.3040,
          'FILECHINANAME': '中国地质调查局地质调查子项目任务书（编号：基[2014]01-035-022）',
          'FILEEXTENSION': '.pdf',
          'FILEID': '5e33b773-e49c-4464-bdcb-101b24d008f4',
          'FILENAME': 'Q01_0002.pdf',
          'FILETYPE': '其它',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'Q01_0002.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/Q01_0003.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:22',
          'ENDFILENAME': '',
          'FILEBYTE': 0.2490,
          'FILECHINANAME': '中国地质调查局地质调查子项目任务书（编号：基[2011]03-08-01)',
          'FILEEXTENSION': '.pdf',
          'FILEID': '89c24270-dd14-47ea-b8f4-53907554a782',
          'FILENAME': 'Q01_0003.pdf',
          'FILETYPE': '其它',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'Q01_0003.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/Z01_0001.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 19.4410,
          'FILECHINANAME': '西藏藏东地区航磁调查综合研究成果报告',
          'FILEEXTENSION': '.pdf',
          'FILEID': '25f807b3-5e94-4815-9032-47f59580ed0d',
          'FILENAME': 'Z01_0001.pdf',
          'FILETYPE': '正文',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'Z01_0001.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/S01_0001.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 0.2640,
          'FILECHINANAME': '中地调（总）审字[2017]316号的审查意见书',
          'FILEEXTENSION': '.pdf',
          'FILEID': '2629aca8-de07-4c47-928b-f3f9c53d4dc0',
          'FILENAME': 'S01_0001.pdf',
          'FILETYPE': '审批',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'S01_0001.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/S01_0002.pdf',
          'BLC': '',
          'BZ': '',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 2.7240,
          'FILECHINANAME': '中地调（总）评字[2016]581号的评审意见书',
          'FILEEXTENSION': '.pdf',
          'FILEID': 'a5788822-57bb-45c2-8d8e-572d8dbc8a65',
          'FILENAME': 'S01_0002.pdf',
          'FILETYPE': '审批',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '.docx',
          'SOURCEFILENAME': 'S01_0002.docx',
          'TH': ''
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0001.JPG',
          'BLC': '1/50万',
          'BZ': '91.38cm*97.32cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 13.9550,
          'FILECHINANAME': 'I-46-D、I-47-C、H-46-B、H-47-A、H-46-D  H-47-C西藏藏东地区航迹图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '119b5c16-ddf0-4781-8426-99d138842e29',
          'FILENAME': 'T01_0001.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0001',
          'TH': 'Ⅰ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0002.JPG',
          'BLC': '1/50万',
          'BZ': '91.35cm*97.32cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 27.1980,
          'FILECHINANAME': 'I-46-D、I-47-C、H-46-B、H-47-A、H-46-D  H-47-C西藏藏东地区飞行高度图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '0685d2de-db67-4bea-96b5-6d2a38354d2f',
          'FILENAME': 'T01_0002.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0002',
          'TH': 'Ⅱ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0003.JPG',
          'BLC': '1/25万',
          'BZ': '102.95cm*121.92cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 29.3110,
          'FILECHINANAME': 'I-46-[16]、I-47-[13]、H-46-[4]、H-47-[1]、H-46-[8]、H-47-[5]、H-46-[12]、H-47-[9]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '90458b1f-28a5-4d7a-bf0c-4f6e627125d8',
          'FILENAME': 'T01_0003.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0003',
          'TH': 'Ⅲ1'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0004.JPG',
          'BLC': '1/25万',
          'BZ': '81.82cm*111.00cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 15.9090,
          'FILECHINANAME': 'I-47-[14]、H-47-[2]、H-47-[6]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': 'bb114c46-493f-406f-87ba-89d757233102',
          'FILENAME': 'T01_0004.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0004',
          'TH': 'Ⅲ2'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        },
        {
          'ABPATH': '000001-000100/000001/存档电子文件/T01_0005.JPG',
          'BLC': '1/25万',
          'BZ': '143.75cm*86.74cm',
          'CREATENAME': 'system',
          'CREATETIME': '2019-08-20T10:54:21',
          'ENDFILENAME': '',
          'FILEBYTE': 17.9540,
          'FILECHINANAME': 'H-47-[9]、H-47-[10]、H-47-[13] 、H-47-[14]西藏藏东地区航磁ΔT剖面平面图',
          'FILEEXTENSION': '.JPG',
          'FILEID': '84625f3a-f63e-4486-a553-8edbc5e1ee64',
          'FILENAME': 'T01_0005.JPG',
          'FILETYPE': '附图',
          'GCJG': '中国国土资源航空物探遥感中心',
          'id_dzwdh_pk': '000001',
          'ID_ML_PK': '8a130343-9a34-43b5-95c5-7a4a57631144',
          'MJ': '不涉密',
          'SMSX': '',
          'SMYM': '',
          'SMZL': '',
          'SOFTTYPE': '1',
          'SOURCEFILEEXTENSION': '',
          'SOURCEFILENAME': 'T01_0005',
          'TH': 'Ⅲ3'
        }
      ],
      cequLabel: {
        'F_IMAGECOUNT': '航片数',
        'F_AREA': '测区面积',
        'F_STATE': '测区状态',
        'F_PLANETYPE': '机型',
        'F_HEIGHT': '飞行高度',
        'F_TRANSVERSEOVERLAP': '旁向重叠',
        'F_COURSEOVERLAP': '航向重叠',
        'F_CAMERA': '航摄仪',
        'F_CAMERAID': '航摄仪编号',
        'F_FOCUSLENGTH': '航摄焦距',
        'F_FILMSIZE': '像幅大小',
        'F_FILMTYPE': '胶片类型',
        'F_SCALE': '航摄比例尺',
        'F_SACOMPANY': '航摄单位',
        'F_SCANCOMPANY': '扫描单位',
        'F_REFERENCE_FILE': '相机参数鉴定表',
        'F_DESIGN_FILE': '飞行设计',
        'F_REPORT_FILE': '成果报告',
        'F_AUXILIARY': '辅助观测值',
        'F_DISCRIPTION': '说明',
        'F_REMARKS': '备注',
        'F_SANUMBER': '测区号',
        'F_SANAME': '测区名',
        'F_STARTDATE': '航摄开始时间',
        'F_ENDDATE': '航摄结束时间',
        'OBGECTID': 'OBJECTID'
      },
      beasLabel: {
        'ID_ML_PK': '编号ID',
        'ID_DH': '档号(旧）',
        'DZWDH': '电子文档号(旧)',
        'ID_DZWDH_PK': '档号（新）',
        'TM': '题名',
        'XCDW': '形成单位',
        'P_BZZ': '编著者',
        'GB': '稿本',
        'WZ': '文种',
        'YZ': '语种',
        'MJ': '密级',
        'BGQX': '保管期限',
        'DT_BHQ': '保护期',
        'DT_BGXC': '报告形成时间',
        'DT_GZKS': '工作开始日期',
        'DT_GZJS': '工作结束日期',
        'DT_PSSJ': '评审时间',
        'SPJG': '审批机构',
        'GZCD': '工作程度',
        'ZLLB': '资料类别',
        'TZZT': '投资主体',
        'ZTC': '主题词',
        'ZMLXCDW': '形成单位',
        'NUM_WS': '文数',
        'NUM_YS': '页数',
        'BZ_W': '正文备注',
        'NUM_FT': '附图',
        'BZ_FT': '附图备注',
        'NUM_FJ': '附件',
        'BZ_FJ': '附件备注',
        'NUM_FB': '附表',
        'BZ_FB': '附表备注',
        'NUM_SPS': '审批书',
        'BZ_SPS': '审批书备注',
        'NUM_DMT': '多媒体',
        'BZ_DMT': '多媒体备注',
        'NRTY': '内容提要',
        'NUM_DA': '档案盒数',
        'P_HJ': '汇交人名称',
        'FZ': '附注/备注',
        'CGBCDW': '原本（成果）保存单位及地点',
        'SWBCDW': '实物资料保存单位及地点',
        'DAGMC': '档案馆名称',
        // 'STATUS': '状态',
        // 'LJ_FTP': 'FTP路径',
        // 'GPH': '光盘号',
        'LX': '类型',
        'DT_HJ': '定制时间',
        'F_IMAGECOUNT': '航片数',
        'F_AREA': '测区面积',
        'F_STATE': '测区状态',
        'F_PLANETYPE': '机型',
        'F_HEIGHT': '飞行高度',
        'F_TRANSVERSEOVERLAP': '旁向重叠',
        'F_COURSEOVERLAP': '航向重叠',
        'F_CAMERA': '航摄仪',
        'F_CAMERAID': '航摄仪编号',
        'F_FOCUSLENGTH': '航摄焦距',
        'F_FILMSIZE': '像幅大小',
        'F_FILMTYPE': '胶片类型',
        'F_SCALE': '航摄比例尺',
        'F_SACOMPANY': '航摄单位',
        'F_SCANCOMPANY': '扫描单位',
        'F_REFERENCE_FILE': '相机参数鉴定表',
        'F_DESIGN_FILE': '飞行设计',
        'F_REPORT_FILE': '成果报告',
        'F_AUXILIARY': '辅助观测值',
        'F_DISCRIPTION': '说明',
        'F_REMARKS': '备注',
        'F_SANUMBER': '测区号',
        'F_SANAME': '测区名',
        'F_STARTDATE': '航摄开始时间',
        'F_ENDDATE': '航摄结束时间'
        // 'ZTC_KC': '矿产主题词'
      },
      options: [
        {
          value: 'FILENAME',
          label: '文件名称'
        }, {
          value: 'FILECHINANAME',
          label: '文件题名'
        }, {
          value: 'SOFTTYPE',
          label: '类型'
        }],
      height: '445px',
      heightpx: '430px',
      rowproperty: '',
      rowpropertyvalue: ''
    }
  },
  methods: {
    baseMapInit() {
      if (gisMapDia == null) {
        gisMapDia = new GISMap('MainMapDia')
        gisMapDia.baseMapInit(baseMapInitParameters, () => {
          gisMapDia.map.on('moveend', gisMapDia.checkZoomAndCenter.bind(gisMapDia))
        }, 'mapDivDialog', false)
      }
    },
    zoomto(wktResponse) {
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
      if (feature.geometry.indexOf("POLYGON") != -1) {
        gisMapDia.drawPolygon(feature)
      } else {
        feature = {
          'attributes': {},
          'style': null,
          'geometry': wktResponse
        }
        gisMapDia.addPoint(feature)
      }
      let f = gisMapDia.transformFeatureFromWkt(wktResponse)
      // 飞到某地
      gisMapDia.flyTo(f, () => {
      })
    },
    ...mapActions('searchStore', {
      setDialogShow: 'setDialogShow'
    }),
    getLable(index) {
      for (let key in this.cequLabel) {
        if (index === key) {
            return this.cequLabel[index]
        }
      }
    },
    getBR(index) {
      if (index !== 'F_CENTERTIME' && index !== 'isShop' && index !== 'NODENAME' && index !== 'NODEID' && index !== 'WKTRESPONSE' && index !== 'RECEIVE_TIME' && index !== 'CENTERTIME' && index !== 'F_DATAID' && index !== 'imageurlDQ' && index !== 'imageurl' && index !== 'OBJECTID' && index !== 'isSelect' && index !== 'F_ID') {
        return true
      } else {
        return false
      }
    },
    // 加入购物车
    handleAddShop() {
      let _this = this
      let arr = []
      _this.obj = {}
      _this.selectData.forEach(item => {
        // this.str += item.F_DATAID + ','
        _this.obj = {
          // receivetime: item.F_CENTERTIME,
          tm: _this.beasData[0]['TM'],
          docnum: this.newDhh, // _this.beasData[0]['id_dzwdh_pk'],
          docnumold: this.oldDhh, // 旧档案号
          // nodelabel: this.nodeLabel, // 菜单节点名称，从后台获取
          datapath: item.ABPATH,
          dataid: item.FILEID,
          dataname: item.FILENAME,
          datasize: item.FILEBYTE,
          datatype: '1',
          nodeid: this.nodeId
        }
        arr.push(_this.obj)
      })
      // this.str = this.str.slice(0, this.str.length - 1)
      http.addAgrsSave({
        data: arr
      }).then(res => {
        if (res.data.length !== 0) {
          // _this.getShopId()
          // _this.$message({
          //   message: '成功加入购物车！',
          //   type: 'success'
          // })
          this.$notify({
            title: '提示',
            message: '成功加入购物车',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          this.$emit('onChildByValue', false)
          // _this.shopInitTable()
          // _this.getShopId()
          // this.handleShopNum()
        }
      })
    },
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
    exportExcel() {
      let nameindex = []
      let nameindexweb = {}
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#eltableData'), {raw:true})
      /* get binary string as output */
      if (this.selectData.length > 0) {
        this.selectData.forEach(item => {
          if (wb.Sheets.Sheet1) {

            for (let key in wb.Sheets.Sheet1) {
              if (key.indexOf('B') > -1) {
                if (item.FILENAME === wb.Sheets.Sheet1[key].v) {
                  nameindex.push(key.slice(1, key.length))
                }
              }
            }
          }
        })
        for (let keyI in wb.Sheets.Sheet1) {
          if (keyI === '!merges' || keyI === '!ref'|| keyI === 'B1' || keyI === 'C1' || keyI === 'D1' || keyI === 'E1') {
            nameindexweb[keyI] = wb.Sheets.Sheet1[keyI]
          }
          for (let i = 0; i < nameindex.length; i++) {
            let h = i + 2
            if (nameindex[i]) {
              nameindexweb['B' + h] = wb.Sheets.Sheet1['B' + nameindex[i]]
              nameindexweb['C' + h] = wb.Sheets.Sheet1['C' + nameindex[i]]
              nameindexweb['D' + h] = wb.Sheets.Sheet1['D' + nameindex[i]]

            }
          }
        }
        wb.Sheets.Sheet1 = nameindexweb
        console.log(wb, 'wb')
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
          }), 'eltableData.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    exportAllExcel() {
      let nameindex = []
      let nameindexweb = {}
      /* generate workbook object from table */
      //
      var wb = XLSX.utils.table_to_book(document.querySelector('#allTableData'))
      /* get binary string as output */
      if (this.initData.length > 0) {
        this.initData.forEach(item => {
          if (wb.Sheets.Sheet1) {
            for (let key in wb.Sheets.Sheet1) {
              if (key.indexOf('B') > -1) {
                if (item.FILENAME === wb.Sheets.Sheet1[key].v) {
                  nameindex.push(key.slice(1, key.length))
                }
              }
            }
          }
        })
        for (let keyI in wb.Sheets.Sheet1) {
          if (keyI === '!merges' || keyI === '!ref' || keyI === 'A1' || keyI === 'B1' || keyI === 'C1' || keyI === 'D1' || keyI === 'E1') {
            nameindexweb[keyI] = wb.Sheets.Sheet1[keyI]
          }
          for (let i = 0; i < nameindex.length; i++) {
            if (nameindex[i]) {
              nameindexweb['B' + nameindex[i]] = wb.Sheets.Sheet1['B' + nameindex[i]]
              nameindexweb['C' + nameindex[i]] = wb.Sheets.Sheet1['C' + nameindex[i]]
              nameindexweb['D' + nameindex[i]] = wb.Sheets.Sheet1['D' + nameindex[i]]
            }
          }
        }
        // for (let i = 0; i < this.initData.length; i++) {
        //   nameindexweb['B' + (i + 2)] = {t: 's', v: this.initData[i].FILENAME}
        //   nameindexweb['C' + (i + 2)] = {t: 's', v: this.initData[i].FILECHINANAME}
        //   nameindexweb['D' + (i + 2)] = {t: 's', v: this.initData[i].SOFTTYPE}
        // }
        wb.Sheets.Sheet1 = nameindexweb
        var wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array'
        })
        try {
          FileSaver.saveAs(new Blob([wbout], {
            type: 'application/octet-stream'
          }), 'eltableData.xlsx')
        } catch (e) {
          if (typeof console !== 'undefined') console.log(e, wbout)
        }
        return wbout
      } else {
        this.$message({
          message: '暂无数据！',
          type: 'warning'
        })
      }
    },
    handleSelectionChange(val) {
      this.selectData = val
      console.log(val, '0000')
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.tableData = this.initData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.tableData = this.initData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    handleClick(tab) {
      // this.getZlShopStatus;
      if (tab.label === '资料信息') {
        this.showPagination = true
        if (this.token) {
          http.getShopZlStatus().then(res => {
            if (res.data === 'true') {
              this.addZLshopShow = true
            } else {
              this.addZLshopShow = false
            }
            this.addShopShow = true
            // this.addShopShow = this.addZLshopShow
          })
        }
      } else if (tab.label === '项目信息') {
        this.showPagination = false
      } else {
        this.showPagination = false
      }
    },
    getData() {
      if  (window.shopXC) {
        // 现场版
        // ===========================start=============================
        var param = '/material/Archive/TB_MLSX/GetList?where=dzwdh=\'' + this.oldDhh + '\'&startIndex=1&endIndex=1'
        axios({
          headers: {
            'Authorization': 'Bearer ' +
              // 以下为0616最新token
              // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoYW5neWFvIiwianRpIjoiNzM2Yzg0NzUtYjJkMC00Yzc0LTg5YzktNWM2MmM0ZDk4MGY4IiwibmJmIjoxNTkyMTUxMDIwLCJleHAiOjE2Nzg1NTEwMjAsImlzcyI6IllEVFIiLCJhdWQiOiJoYW5neWFvIn0.W917fEu8xnL6fZPo-g6kjIRW-aeHa_0qOEVSRw7Ru0g'
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoYW5neWFvIiwianRpIjoiYTU0ZmMwYjYtNWEzZS00YWFiLTk0NmQtMGZiMTVhYzZiNTdmIiwibmJmIjoxNjkyNjc2MjQ1LCJleHAiOjE3NzkwNzYyNDUsImlzcyI6IllEVFIiLCJhdWQiOiJoYW5neWFvIn0.InnyvxwMJe-204Dg_vM_SgsR1y8da6MAseRq_6hu6wg'
          },
          methods: 'get',
          url: param
        }).then(res => {
          this.xmDatajj = []
          this.xmData = []
          this.ketData = ''
          if (res.data && res.data.length > 0) {
            for (let key in res.data[0]) {
              if (key !== 'ID_ML_PK') {
                if (key === 'NRTY') {
                  this.xmDatajj.push({
                    name: this.beasLabel[key.toLocaleUpperCase()],
                    value: res.data[0][key]
                  })
                } else if (key === 'id_dzwdh_pk') {
                  this.ketData = res.data[0][key]
                  this.newDhh = res.data[0][key]
                } else {
                  if (this.beasLabel[key.toLocaleUpperCase()]) {
                    this.xmData.push({
                      name: this.beasLabel[key.toLocaleUpperCase()],
                      value: res.data[0][key]
                    })
                  }
                }
              }
            }
          }
          this.getZLdata()
          this.xqDialogVisible = true
        })
      } else {
        // ===========================end=============================
        // 公司版
        // ===========================start=============================
        for (let key in this.beasData[0]) {
          if (key === 'id_dzwdh_pk' || key === 'ID_DZWDH_PK') {
            this.newDhh = this.beasData[0][key]
          }
          if (key === 'NRTY') {
            this.xmDatajj.push({
              name: this.beasLabel[key.toLocaleUpperCase()],
              value: this.beasData[0][key]
            })
          } else {
            if (this.beasLabel[key.toLocaleUpperCase()] !== '编号ID' && this.beasLabel[key.toLocaleUpperCase()]) {
              this.xmData.push({
                name: this.beasLabel[key.toLocaleUpperCase()],
                value: this.beasData[0][key]
              })
            }
          }
        }
        this.getZLdata()
      }
    },
    getZLdata() {
      if (window.shopXCZL) {
        // 现场版
        // =========================start===============================
        var zlparam = ''
        if (this.rowpropertyvalue !== '') {
          zlparam = '/material/Archive/TB_FILEINFO/GetList?where=id_dzwdh_pk=\'' + this.ketData + '\' and ( FILENAME like \'%' + this.rowpropertyvalue + '%\' or  FILECHINANAME like \'%' + this.rowpropertyvalue + '%\' or SOFTTYPE like \'%' + this.rowpropertyvalue +
            '%\')'
        } else {
          zlparam = '/material/Archive/TB_FILEINFO/GetList?where=id_dzwdh_pk=\'' + this.ketData + '\''
        }
        axios({
          methods: 'get',
          url: zlparam,
          headers: {
            'Authorization': 'Bearer ' +
              // 以下为0616最新token
              // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoYW5neWFvIiwianRpIjoiNzM2Yzg0NzUtYjJkMC00Yzc0LTg5YzktNWM2MmM0ZDk4MGY4IiwibmJmIjoxNTkyMTUxMDIwLCJleHAiOjE2Nzg1NTEwMjAsImlzcyI6IllEVFIiLCJhdWQiOiJoYW5neWFvIn0.W917fEu8xnL6fZPo-g6kjIRW-aeHa_0qOEVSRw7Ru0g'
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJoYW5neWFvIiwianRpIjoiYTU0ZmMwYjYtNWEzZS00YWFiLTk0NmQtMGZiMTVhYzZiNTdmIiwibmJmIjoxNjkyNjc2MjQ1LCJleHAiOjE3NzkwNzYyNDUsImlzcyI6IllEVFIiLCJhdWQiOiJoYW5neWFvIn0.InnyvxwMJe-204Dg_vM_SgsR1y8da6MAseRq_6hu6wg'
          }
        }).then(res => {
          if (res.data && res.data.length > 0) {
            res.data.forEach(item => {
              if (item.SOFTTYPE) {
                item.SOFTTYPE = this.typeData[item.SOFTTYPE - 1].label
                item.oldDhh = this.paramRowData.档案号
              } else {
                item.SOFTTYPE = '-'
              }
              // })
              this.initData = res.data
              this.shopTotal = res.data.length
              this.tableData = res.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
            })
          } else {
            this.tableData = []
            this.shopTotal = 0
          }
        })
      } else {
        // 公司版
        // ==============================start=================================
        let tabelTemp = []
        this.beasZLdata.forEach(item => {
          if (item.SOFTTYPE) {
            item['SOFTTYPE_zh'] = this.typeData[Number(item.SOFTTYPE) - 1].label
            item.oldDhh = this.paramRowData.档案号
          } else {
            item.SOFTTYPE = '-'
          }
          if (item.FILENAME.indexOf(this.rowpropertyvalue) > -1) {
            tabelTemp.push(item)
          }
          this.initData = tabelTemp
          this.shopTotal = tabelTemp.length
          this.tableData = tabelTemp.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        })
      }
    },
    handleClose(row) {
      this.xqDialogVisible = false
      this.showPagination = false
      this.rowpropertyvalue = ''
    }
  },
  watch: {
    dialogShow(val) {
      if (val === 1) {
        this.xqDialogVisible = true
        // this.$nextTick(() => {
        //   if (this.$refs.mapDivDialog.innerHTML === '') {
        //       this.baseMapInit()
        //   }
        // })
      }
    },
    paramRowDatanew(val) {
      console.log(val)
      delete val.OBJECTID
      delete val.imageurl
      // 以下新增删除
      delete val.NODEID
      delete val.WKTRESPONSE
      delete val.F_DATAID
      delete val.NODENAME
      delete val.RECEIVE_TIME
      delete val.F_CENTERTIME
    },
    paramRowData(val) {
      let _that = this
      this.objectTitle = 'OBJECTID:'
      this.objectValue = val.OBJECTID
      this.oldDhh = val.档案号
      this.xqDialogVisible = true
      if (val) {
        for (let key in val) {
          val[key.toLocaleUpperCase()] = val[key]
          if (key.toLocaleUpperCase() === 'F_DATANAME' || key.toLocaleUpperCase() === 'DATANAME') {
            this.name = val[key]
          }
          if (key.toLocaleUpperCase() === 'F_DATAID' || key.toLocaleUpperCase() === 'F_DATAID') {
            this.dataId = val[key]
          }
        }
      }
      _that.xqDialogVisible = true
      if (val) {
        let id = ''
        if (val.F_DID) {
          id = val.F_DID
        } else if (val.F_DATAID) {
          id = val.F_DATAID
        } else {
          id = val.DID
        }
        http.getAgrsObjectById({
          dataId: this.dataId,
          nodeId: val.NODEID,
          label: val.NODENAME,
          did: id
        }).then(res => {
          if (res.data){
            _that.paramRowDatanew = []
            res.data[0].map(item => {
              let d = item.key
              if (d === '采集时间' ||d === '入库时间'|| d === '制图日期' || d === '航摄开始时间' || d === '航摄结束时间' || d === '结束日期' || d === '起始日期'|| d === '结束时间') {
                item.value = this.commonMethod.timestampToTime(item.value)
              }
              if (d === '数据大小') {
                item.value = this.commonMethod.dataSizeFormatter(item.value)
              }
              // let obj = {label:item.key,value:item.value}
              if(d && item.value){
                _that.paramRowDatanew.push({
                  label: d,
                  value: item.value
                })
              }
            })
          }
        })
      }
      this.height = '445px'
      this.heightpx = '430px'
      this.showDiv = false
      this.setDialogShow(0)
      this.paramRowDatanew = {}
      if (this.nodeId === '10101' || this.nodeId === '10121') {
        this.firstShow = false
        this.secondShow = true
        this.thirdShow = true
        this.fourthShow = false
        this.activeTab = 'second'
        this.getData()
        // this.$refs.tabs.$children[0].$refs.tabs[1].style.display = 'none';
      } else {
        if (this.tableShow) {
          this.firstShow = true
          this.secondShow = true
          this.thirdShow = true
          this.fourthShow = false
          this.activeTab = 'first'
          this.getData()
        } else {
          this.firstShow = false
          this.secondShow = false
          this.thirdShow = false
          this.fourthShow = true
          this.activeTab = 'fourth'
        }
      }

    },
    paramRowimageData(val) {
    },
    tableShow() {
      if (!this.tableShow) {
        this.firstShow = false
        this.secondShow = false
        this.thirdShow = false
        this.fourthShow = true
        this.activeTab = 'fourth'
      } else {
        this.firstShow = true
        this.secondShow = true
        this.thirdShow = true
        this.fourthShow = false
        this.activeTab = 'first'
      }
    }
  },
  computed: {
    ...mapState('searchStore', {
      tableShow(state) {
        return state.tableShow
      },
      nodeLabel(state) {
        return state.nodeLabel
      },
      nodeId(state) {
        return state.nodeId
      },
      dialogShow(state) {
        return state.dialogShow
      }
    }),
    ...mapState('user', {
      token(state) {
        return state.token
      }
    })
  },
  mounted() {
    // this.getData()
    // this.getZLdata()
    if (!this.tableShow) {
      this.activeTab = 'fourth'
    }
    // this.hTable = document.documentElement.clientHeight - 130
  }
}
</script>

<style scoped>
.elClassTab {
  width: 100%;
  margin-top: 30px;
  border-top: 3px solid #B8C9F5;
}

.resultDetailsDiv >>> .el-dialog {
  background-color: #F4F5F4;
  margin-top: 11vh !important;
}

.resultDetailsDiv .titleD {
  /*border-left: 3px solid #316BFC;*/
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

.content {
  padding-top: 15px;
  line-height: 7px;
  display: inline-block;
  background-color: #F5F6FA;
  /*height: 200px;*/
  width: 17%;
  border: 1px solid #EBEEF5;
  float: left;
  /*line-height: 30px;*/
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
  height: 18px;
}

.contentjj {
  padding-top: 35px;
  overflow: hidden;
  overflow-y: auto;
  width: 77%;
  display: inline-block;
  /*height: 200px;*/
  border: 1px solid #EBEEF5;
  float: left;
  padding-right: 10px;
}

.fourthSpan {
  font-size: 20px;
  width: 40%;
  line-height: 100px;
  height: 100px;
  text-align: center;
}

.newDhhClass {
  display: inline-block;
  background-color: #E6F9E6;
  padding: 5px 15px 5px 15px;
  color: #71D871;
  border: 1px solid #BFEFBF;
  border-radius: 4px;
}

.oldDhhClass {
  display: inline-block;
  background-color: #D7E0F4;
  margin-left: 8px;
  padding: 5px 15px 5px 15px;
  color: #588FF7;
  border: 1px solid #58b7f7;
  border-radius: 4px;
}

.resultDetailsDiv >>> .el-dialog__header {
  margin: 0 20px !important;
  padding: 20px 0px 10px !important;
 /* border-bottom: 3px solid #B8C9F5 !important;*/
}

.resultDetailsDiv >>> .el-table tbody tr td > .cell {
  height: 18px;
  line-height: 18px;
}

.resultDetailsDiv >>> .el-table th {
  padding: 0 !important;
  height: 34px;
  line-height: 34px;
}

.resultDetailsDiv >>> .el-table th > .cell {
  width: 100% !important;
  /* height: 34px; */
  /* line-height: 34px; */
  background-color: #F6F7F6;
  color: #000;
  /*height: 25px;*/
  /*line-height: 25px;*/
  /*margin: 0;*/
  /*padding: 0;*/
}

.resultDetailsDiv >>> .el-table__body-wrapper {
  min-height: 450px !important;
}

.resultDetailsDiv >>> .el-dialog.is-fullscreen {
  margin-top: 0 !important;
}

.resultDetailsDiv >>> .el-tabs__content {
  padding: 0 0 10px 0 !important;
}

.el-icon-zoom-out:hover {
  color: #3371F8 !important
}

.el-icon-zoom-in:hover {
  color: #3371F8 !important
}

::-webkit-scrollbar {
  background-color: #DAEBFE;
}

::-webkit-scrollbar-thumb {
  background-color: #0065F7;
  border-radius: 3px;
}

.el-tabs--border-card >>> .el-tabs__header .el-tabs__item.is-active {
  border-bottom: 3px solid #316BFD;
  font-size: 14px;
}
</style>
