<template>
<div class="resultDetailsDivz">
  <el-dialog class="resultDZ" v-dialogDrag :fullscreen="showDiv" :title="titleValue" :visible.sync="satelliteDialogVisible" width="50%" height="568" :before-close="handleClose"  :modal-append-to-body="false">
    <div style="float: right;margin-right: 20px;margin-top: -45px;font-size: 15px;">
      <i class="el-icon-zoom-out" @click="divToSim" style="cursor:pointer;margin-top: 3px;"></i>
      <i class="el-icon-zoom-in" @click="divToBig" style="cursor:pointer;margin-top: 3px;margin-left: 10px;margin-right: 10px;"></i>
    </div>
    <div ref="diaDiv" style="width: 100%;margin-top: -50px;">
          <div ref="firstHeight" v-if="showInfo" style="overflow: hidden; overflow-y: auto; width: 95%; height: 505px; margin-left: 27px;margin-top: 35px;">
            <div style="height:190px" class="spanbottom">
              <span style="line-height: 160px; height: 183px; padding-top:0; font-size: 19px; font-weight: bold;" class="spantab">&nbsp;&nbsp;快视图:</span>
              <span style="display: inline-block;overflow: hidden;text-align: center;margin-bottom: 10px; width: 83%;
    height: 164px;line-height: 164px;">
                <!--<img :src="satelliteImg" height="109%" alt="" @click="changeInfoToImage">-->
                <el-image
                  title="点击查看大图"
                  style="width: 40%; "
                  :src="satelliteImg"
                  :preview-src-list="satelliteImgArr">
                  <div slot="error" class="image-slot">
                     加载中<span class="dot">...</span>
                  </div>
                </el-image>
              </span>
            </div>
            <div style="" v-for="(item, index) in satelliteParamRowData" :key="index" v-if="getBR(index)">
              <span :title="index" class="spantab" :class="{spantabActive: index < 5,spanbottom:true}">&nbsp;&nbsp;{{index}}:</span>
              <span :class="{spantabActive: index < 5, spanbottom:true}" :title="item" class="spantab" style="width: 33%;color: #000;">&nbsp;&nbsp;{{item}}</span>
            </div>
          </div>
          <div ref="firstHeight" v-if="showBigImage" style="overflow: hidden; overflow-y: auto; height: 503px; width: 100%; ;margin-top: 35px;">
            <div style="" >
              <span style="display: inline-block;;overflow: hidden;text-align: center;opacity:0.6;margin-bottom: 10px; width: 38vw;">
                <img :src="satelliteImg"  width="100%" alt="">
              </span>
            </div>
            <div class="searchFunc" style="text-align: center">
              <el-button style="width: 100px;" type="primary" size="small" @click="changeImageToInfo">返回属性信息</el-button>
            </div>
          </div>
    </div>
  </el-dialog>
</div>
</template>
<script>
import axios from 'axios'
import http from '@comm/service/interface.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import moment from 'moment'
import {
  mapActions,
  mapState
} from 'vuex'
export default {
  filters: {
    formatDate (time) {
      time = time * 1000
      let date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  name: 'satelliteResultDetails',
  props: {
    satelliteParamRowData: {
      type: Object
    },
    paramRowimageData: {
      type: String
    }
  },
  data () {
    return {
      showInfo: true,
      showBigImage: false,
      titleValue: '详情信息',
      satelliteImg: '',
      satelliteImgArr: [
        // 'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg'
      ],
      showDiv: false,
      hTable: 440,
      paginationVisible: false,
      satelliteDialogVisible: false,
      ketData: '',
      oldDhh: '',
      newDhh: '',
      selectData: [],
      initData: [],
      xmData: [],
      xmDatajj: [],
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
        'id_dzwdh_pk': '000001',
        'c_dag': '',
        'id_qgdgh': '',
        'C_HJLB': '',
        'id_hjld': '',
        'TM': '111西藏藏东地区航磁调查综合研究成果报告',
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
        'ZTC': '',
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
        'DT_HJ': '2017/10/16 0:00:00'
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
      beasLabel: {
        'ID_ML_PK': '编号ID',
        // 'ID_FL': '分类号',
        'ID_DH': '档号(旧）',
        'DZWDH': '电子文档号(旧)',
        'ID_DZWDH_PK': '档号（新）',
        // 'C_DAG': '档案馆代码',
        // 'ID_QGDGH': '全国档案号',
        // 'C_HJLB': '汇交类别',
        // 'ID_HJLD': '汇交联单号',
        'TM': '题名',
        'XCDW': '形成单位',
        'P_BZZ': '编著者',
        // 'C_GB': '稿本代码',
        'GB': '稿本',
        // 'C_WZ': '文种代码',
        'WZ': '文种',
        // 'C_YZ': '语种代码',
        'YZ': '语种',
        // 'C_MJ': '密级代码',
        'MJ': '密级',
        // 'C_BGQX': '保管期限及代码',
        'BGQX': '保管期限',
        'DT_BHQ': '保护期',
        'DT_BGXC': '报告形成时间',
        'DT_GZKS': '工作开始日期',
        'DT_GZJS': '工作结束日期',
        'DT_PSSJ': '评审时间',
        'SPJG': '审批机构',
        // 'C_SPJGJB': '审批机构级别代码',
        // 'SPJGJB': '审批机构级别',
        // 'JD_START': '起始经度',
        // 'JD_START_D': '起始经度（度）',
        // 'JD_START_F': '起始经度（分）',
        // 'JD_START_M': '起始经度（秒）',
        // 'JD_END': '终止经度',
        // 'JD_END_D': '终止经度（度）',
        // 'JD_END_F': '终止经度（分）',
        // 'JD_END_M': '终止经度（秒）',
        // 'WD_START': '起始纬度',
        // 'WD_START_D': '起始纬度（度）',
        // 'WD_START_F': '起始纬度（分）',
        // 'WD_START_M': '起始纬度（秒）',
        // 'WD_END': '终止纬度',
        // 'WD_END_D': '终止纬度（度）',
        // 'WD_END_F': '终止纬度（分）',
        // 'WD_END_M': '终止纬度（秒）',
        // 'C_XZQMC_SEQ': '行政区名称代码',
        // 'XZQMC_SEQ': '行政区名称序列以空格分开',
        // 'C_GZCD': '工作程度代码',
        'GZCD': '工作程度',
        // 'C_ZLLB': '资料类别代码',
        'ZLLB': '资料类别',
        'TZZT': '投资主体',
        'ZTC': '主题词',
        // 'C_KC_SEQ': '矿产名称代码',
        // 'KC_SEQ': '矿产名称序列',
        // 'ZMLH': '子目录号',
        // 'ZMLXCSJ': '形成时间（子目录）',
        // 'ZMLTM': '子目题名',
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
        // 'P_TBR': '填表人',
        // 'P_LRR': '录入人',
        // 'P_SHR': '审核人',
        // 'DT_LRRQ': '录入日期',
        'DAGMC': '档案馆名称',
        // 'STATUS': '状态',
        // 'LJ_FTP': 'FTP路径',
        // 'GPH': '光盘号',
        'LX': '类型',
        'DT_HJ': '定制时间'
        // 'ZTC_KC': '矿产主题词'
      },
      options: [{
        value: 'FILENAME',
        label: '文件名称'
      }, {
        value: 'FILECHINANAME',
        label: '文件题名'
      }, {
        value: 'SOFTTYPE',
        label: '类型'
      }],
      rowproperty: '',
      rowpropertyvalue: ''
    }
  },
  methods: {
    ...mapActions('searchStore', {
      setDetailShow: 'setDetailShow'
    }),

    ...mapActions('searchStore', {
      setDialogShow: 'setDialogShow'
    }),
    // 加入购物车
    handleAddShop () {
      let _this = this
      let arr = []
      _this.obj = {}
      _this.selectData.forEach(item => {
        // this.str += item.F_DATAID + ','
        _this.obj = {
          // receivetime: item.F_CENTERTIME,
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
        if (res.data === 'true') {
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
    divToBig () {
      this.showDiv = true
    },
    divToSim () {
      this.showDiv = false
    },
    exportExcel () {
      /* generate workbook object from table */
      var wb = XLSX.utils.table_to_book(document.querySelector('#eltableData'))
      /* get binary string as output */
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
    },
    handleSelectionChange (val) {
      this.selectData = val
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.tableData = this.initData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.tableData = this.initData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    handleClick (tab) {
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
            this.addShopShow = this.addZLshopShow
          })
        }
      } else if (tab.label === '项目信息') {
        this.showPagination = false
      } else {
        this.showPagination = false
      }
    },
    getData () {
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
        this.getZLdata()
        this.satelliteDialogVisible = true
      })
      // ===========================end=============================
      // 公司版
      // ===========================start=============================
      // for (let key in this.beasData[0]) {
      //   if (key === 'NRTY') {
      //     this.xmDatajj.push({
      //       name: this.beasLabel[key.toLocaleUpperCase()],
      //       value: this.beasData[0][key]
      //     })
      //   } else {
      //     if (this.beasLabel[key.toLocaleUpperCase()]) {
      //       this.xmData.push({
      //         name: this.beasLabel[key.toLocaleUpperCase()],
      //         value: this.beasData[0][key]
      //       })
      //     }
      //   }
      // }
      // ===========================end=============================
    },
    getZLdata () {
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
      // ===============================end================================
      // 公司版
      // ==============================start=================================
      // this.beasZLdata.forEach(item => {
      //   if (item.SOFTTYPE) {
      //     item.SOFTTYPE = this.typeData[item.SOFTTYPE - 1].label
      //     // item.oldDhh = this.satelliteParamRowData.档案号
      //   } else {
      //     item.SOFTTYPE = '-'
      //   }
      //   this.initData = this.beasZLdata
      //   this.shopTotal = this.beasZLdata.length
      //   this.tableData = this.beasZLdata.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      // })
      // ===============================end================================
    },
    handleClose () {
      this.satelliteDialogVisible = false
      this.showPagination = false
      this.rowpropertyvalue = ''
    },
    changeImageToInfo () {
      this.showBigImage = false
      this.showInfo = true
    },
    changeInfoToImage () {
      this.showInfo = false
      this.showBigImage = true
    },
    getBR (index) {
      if (index !== 'F_CENTERTIME' && index !== 'isShop' && index !== 'NODENAME' && index !== 'NODEID' && index !== 'WKTRESPONSE' && index !== 'RECEIVE_TIME' && index !== 'CENTERTIME' && index !== 'F_DATAID' && index !== 'imageurlDQ' && index !== 'imageurl' && index !== 'OBJECTID' && index !== 'isSelect' && index !== '航摄开始时间' && index !== '航摄结束时间' && index !== '制图日期' && index !== '采集时间' && index !== '起始日期' && index !== '结束日期' && index !== 'F_ID') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    dialogShow (val) {
      if (val === 2) {
        this.satelliteDialogVisible = true

      }
    }

  },
  computed: {
    ...mapState('searchStore', {
      tableShow (state) {
        return state.tableShow
      },
      nodeLabel (state) {
        return state.nodeLabel
      },
      nodeId (state) {
        return state.nodeId
      },
      dialogShow (state) {
        return state.dialogShow
      },
      dialogShowDataZ (state) {
        return state.dialogShowDataZ
      }
    }),
    ...mapState('user', {
      token (state) {
        return state.token
      }
    })
  }
}
</script>

<style scoped>
.elClassTab {
  width: 100%;
  margin-top: 34px;
  border-top: 3px solid #B8C9F5;
}
.resultDetailsDivz>>>.el-dialog{
  /*height: 800px;*/
  /*margin-top: 12vh !important;*/
}
.resultDetailsDivz>>>.el-dialog__headerbtn{
  top: 0 !important;
}

.resultDetailsDivz>>>.el-dialog {
  /*height: 582px;*/
  /*margin-top: 10vh !important;*/
  /*margin-bottom: -140px;*/
}

.resultDetailsDivz .resultDZ {
  /*border-left: 3px solid #316BFC;*/
}
.resultDetailsDivz>>>.el-dialog__header {
  margin: 0 20px !important;
  padding: 20px 0px 10px !important;
  border-bottom: 3px solid #B8C9F5 !important;
}
.resultDetailsDivz>>>.el-dialog__headerbtn .el-dialog__close {
  padding-top: 29px !important;
}
.spantabActive{
  border-top: 2px dotted #EBEEF5;
}
.spanbottom {
  border-bottom: 2px dotted #EBEEF5;
}
.spantab {
  display: block;
  float: left;
  width: 17%;
  height: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 2px;
  text-align: left;
  font-size: 14px;
  padding-top: 15px;
}

.content {
  display: inline-block;
  height: 200px;
  width: 17%;
  border: 1px solid #EBEEF5;
  float: left;
  line-height: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.contentjj {
  overflow: hidden;
  overflow-y: auto;
  width: 81%;
  display: inline-block;
  height: 200px;
  border: 1px solid #EBEEF5;
  float: left;
}

.fourthSpan {
  font-size: 20px;
  width: 40%;
  line-height: 100px;
  height: 100px;
  text-align: center;
}

.oldDhhClass {
  display: inline-block;
  background-color: #D7E0F4;
  padding: 5px 15px 5px 15px;
  color: #206BF7;
}

.newDhhClass {
  display: inline-block;
  background-color: #F6F0D4;
  margin-left: 8px;
  padding: 5px 15px 5px 15px;
  color: #FEB006;
}

.resultDetailsDivz>>>.el-table tbody tr td>.cell {
  height: 18px;
  line-height: 18px;
}

.resultDetailsDivz>>>.el-table th {
  padding: 0 !important;
  height: 34px;
  line-height: 34px;
}

.resultDetailsDivz>>>.el-table th>.cell {
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

.resultDetailsDivz>>>.el-table__body-wrapper {
  height: 450px !important;
}

.resultDetailsDivz>>>.el-tabs__content {
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

.el-tabs--border-card>>>.el-tabs__header .el-tabs__item.is-active {
  border-bottom: 3px solid #316BFD;
  font-size: 14px;
}

</style>
