<template>
  <div class="shopTableDataZ">
    <div class="shopH">
      <el-table :height="heightInt" ref="multipleTable" stripe :data="shopTableData" tooltip-effect="dark"
                style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column width="55">
          <template slot="header" slot-scope="scope">
            <el-checkbox v-model="imageAllCheck" @change="currentPageAllSelect"></el-checkbox>
          </template>
          <template slot-scope="scope">
            <div>
              <el-checkbox v-model="scope.row.isSelect" @change.native="getTemplateRow(scope.row)"></el-checkbox>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="75" label="拇指图">
          <template slot-scope="scope">
            <img :src="scope.row.imageurl" alt="" width="44px" height="24px"/>
          </template>
        </el-table-column>
        <el-table-column prop="datatype" width="100" label="数据类型" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ dataTypeData[scope.row.datatype] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="dataname" label="数据名称" show-overflow-tooltip></el-table-column>
        <!--<el-table-column prop="productlevel" label="产品等级" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="satelite" label="卫星" show-overflow-tooltip></el-table-column>-->
        <!--<el-table-column prop="sensor" label="传感器" show-overflow-tooltip></el-table-column>-->
        <el-table-column prop="receivetime" width="200" label="采集时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="datasize" width="100" label="数据大小" show-overflow-tooltip></el-table-column>
        <el-table-column prop="location" width="100" label="分辨率" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.location ? scope.row.location : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cloudpercent" width="100" label="云量" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.cloudpercent ? scope.row.cloudpercent : '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="查看详情" width="100">
          <template slot-scope="scope">
            <img style="margin-right: 10px" width="16px" height="16px" src="@/assets/img/showDetail.png" alt=""
                 @click="handleDetails(scope.row)">
            <img width="16px" height="16px" src="@/assets/img/deleicon.png" alt="" @click="handleDelete(1, scope.row)">
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 10px">
      <div class="resultPagination">
        <el-pagination
          style="overflow: auto"
          :current-page="shopCurrentPage"
          :page-size="shopPageSize"
          @current-change="handleShopCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[50, 100, 200, 500]"
          :pager-count="pagerCount"
          layout="total, prev, pager, next, sizes, jumper"
          :total="shopTotal">
        </el-pagination>
      </div>
      <div class="resultButton">
        <el-checkbox @change="changeshopTableDataAll" style="margin-left: 1.3vw;margin-right: 1vw;"
                     v-model="checkedAllData">全 选
        </el-checkbox>

        <el-button v-if="userProNameIs && directGetData" @click="directAcquisition" size="mini" type="primary"><i
          style="margin-right: 8px;"
          class="el-icon-tickets"></i>直接获取
        </el-button>
        <el-button v-if="userProNameIs" @click="createShopOrder(0)" size="mini" type="primary"><i
          style="margin-right: 8px;" class="el-icon-tickets"></i>生成已有产品订单
        </el-button>
        <!--todo 内网 再加工订单-->
        <el-button v-if="userProNameIs && showOrderCb" @click="createShopOrder(1)" size="mini" type="primary"><i
          style="margin-right: 8px;" class="el-icon-tickets"></i>创建再加工订单
        </el-button>
        <el-button @click="deleteAllData" size="mini" type="primary"><i style="margin-right: 8px;"
                                                                        class="el-icon-delete"></i>移除
        </el-button>
        <el-button @click="exportDataShp" size="mini" type="primary"><i style="margin-right: 8px;"
                                                                     class="el-icon-upload2"></i>导出落图
        </el-button>
        <el-button @click="exportDataView" size="mini" type="primary"><i style="margin-right: 8px;"
                                                                     class="el-icon-upload2"></i>导出快视图
        </el-button>
        <el-button @click="reflashData" size="mini" type="primary"><i style="margin-right: 8px;"
                                                                      class="el-icon-refresh"></i>刷新
        </el-button>
      </div>
    </div>
    <el-dialog title="确认订单" :visible.sync="dialogTableVisible" width="43%">
      <el-form ref="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="数据ID">
          <el-input :disabled="disabled" v-model="dataid"></el-input>
        </el-form-item>
        <el-form-item label="数据名称">
          <el-input v-model="dataname" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="数据大小">
          <el-input v-model="datasize" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="卫星">
          <el-input v-model="satelite" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="传感器">
          <el-input v-model="sensor" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="采集时间">
          <el-input v-model="receivetime" :disabled="disabled"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="resetForm">确 定</el-button>
      </span>
    </el-dialog>
    <dialogShowDetail :titleDialog=titleDialog></dialogShowDetail>
    <shopCarDirectAcquisition :flagdata="flag"></shopCarDirectAcquisition>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import {mapActions} from 'vuex'
import dialogShowDetail from '@comm/components/dialogShowDetail.vue'
import shopCarDirectAcquisition from '@comm/views/manage/person/components/shopCarDirectAcquisition'

export default {
  data() {
    return {
      dataTypeData: ['原始影像数据', '档案资料数据', '航空影像数据', '标准产品', 'J星产品'],
      dialogShowData: {},
      titleDialog: '购物车详情',
      shopCurrentPage: 1,
      shopPageSize: 50,
      pagerCount: 5,
      flag: {},
      shopPageSizeInt: 7,
      shopTotal: 0,
      heightInt: 0,
      checkedAllData: false,
      userProNameIs: true,
      showOrderCb: window.repOrder,
      directGetData: window.directGetData,
      imageAllCheck: false,
      shopTableData: [],
      shopTableDataAll: [],
      shopRecordsData: [],
      dialogTableVisible: false,
      shopId: [],
      DeleId: [],
      wktlist: [],
      nodeIdSData: [],
      ListWkt: [],
      ListDataName: [],
      dataTypeSet: null,
      ListSatellite: [],
      ListSensor: [],
      typeId: '',
      orderReference: '',
      orderName: '',
      dataid: '',
      dataname: '',
      datasize: '',
      satelite: '',
      sensor: '',
      receivetime: '',
      templateSelection: '',
      disabled: true
    }
  },
  components: {
    dialogShowDetail,
    shopCarDirectAcquisition
  },
  methods: {
    getUserR() {
      let userID = JSON.parse(localStorage.getItem('principalUserID'))
      let userRote = JSON.parse(userID.principal)
      if (userRote.roleIds.length > 0) {
        if (userRote.roleIds[0].indexOf('注册') > -1 || userRote.roleIds[0].indexOf('游客') > -1) {
          this.userProNameIs = false
        } else {
          this.userProNameIs = true
        }
      } else {
        this.userProNameIs = false
      }
    },
      getTemplateRow(row) {
        this.templateSelection = row;
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
    directcommit(val){

      this.handleSelectionChange()
      localStorage.setItem('IDs', JSON.stringify(this.DeleId))
      this.orderReference = this.createName()
      let userID = ''
      if (window.systemName === 'FW') {
        if (localStorage.getItem('userId')){
          userID = localStorage.getItem('userId')
        } else {
          userID = JSON.parse(JSON.parse(localStorage.getItem('principalUserID')).principal).userId
        }
      } else if (window.systemName === 'DZY') {
        userID = localStorage.getItem('userName')
      }
      let projectName= sessionStorage.getItem('projectName')
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.orderId = []
      this.shopfIds = []
      let shopid = this.shopId
      this.shopTableData.forEach(item => {
        for(let i=0;i<shopid.length;i++){
          if(shopid[i] === item.did){
            this.shopfIds.push(item.id)
          }
        }
      })
      // 由于需要提取 factory 请求过来订单，需要修改订单提取的位置，所以要增加 type distmethod 两个变量来控制 factory订单的提取位置
      let type = 0
      let distmethod = 2
      if(val !== undefined || val !== null){
        distmethod = val.distmethod
      }
      http.createOrder({data: {
          // uploadFileList: '',
          getMethod: '线下拷贝', // 获取方式
          // userCardId: this.formLabelAlign.userCardId, // 身份证号
          shopIds: this.shopId, // 数据ID
          shopfIds: this.shopfIds, // 数据fId
          loginUser: userID,
          dataType: '2', // 数据类别1:资料数据 2：非资料数据
          ordername: this.orderReference, // 订单名称
          productName: '', // 项目名称
          distmethod: distmethod,
          // distfrequency: this.formLabelAlign.disFrequency,
          // delaytime: this.formLabelAlign.delayInterval,
          description: '', // 备注
          dataNum: this.total, // 数据条数
          dataSum: this.dataSizeAll, // 数据总量
          dataSizeKb: this.dataSizeAllKb, // 数据总量kb
          applyUserUsed: '地质矿产资源调查与评价', // 使用用途
          applyuser: '航遥中心项目组', // 申请人
          applyUserPhone: '15011112222', // 申请人联系方式
          applyUserUnit: '中国自然资源航空物探遥感中心', // 申请人单位
          sstatus: 1,
          type: type
	  }
       }).then(res => {
        this.orderReference = ''
        this.orderDataList = []
        this.orderDataCpUrl = ['', '']
        loading.close()
        console.log(res, 'oorderpfdjpsdjgpe')
        let obj = res.data
        this.orderName = obj.cpordername
        this.flag= {
          flager:false,
          orderName: obj.cpordername,
          data: 1
        }
        if (obj !== 'false') {
          this.showDiv = true
          // obj[0].forEach(item => {
          for (var key in obj) {
            if (key === 'cpordername') {
              this.orderReference += '产品订单：' + obj[key] + ' 创建成功， '
              this.orderDataList.push(obj[key])
              this.orderDataCpUrl[0] = obj[key]
            } else if (key === 'zlordername') {
              this.orderReference += '资料订单：' + obj[key] + ' 创建成功， '
              this.orderDataList.push(obj[key])
            } else if (key === 'cporderurl') {
              this.orderDataCpUrl[1] = obj[key]
            }
          }
          //删除购物车列表中已经下单的值
          this.shopDataForAllPage()
          //删除页面头部购物车后面的数字
          this.getShopCarNum()

          // })
          // this.orderReference = obj[0].split(',')[0]
          this.$message({
            message: '订单数据属性信息保存成功！',
            type: 'success'
          })
          // this.orderDataList = obj[0].split(',')
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
      this.shopDataForAllPage()
    },
    currentPageAllSelect() {
      if (this.imageAllCheck) {
        this.shopTableData.map(item => {
          item.isSelect = true
        })
      } else {
        this.shopTableData.map(item => {
          item.isSelect = false
        })
      }
    },
    changeshopTableDataAll() {
      this.DeleId = []
      if (this.checkedAllData) {
        this.shopTableDataAll.map(item => {
          item.isSelect = true
          this.DeleId.push(item.id)
        })
      } else {
        this.shopTableDataAll.map(item => {
          item.isSelect = false
        })
      }
    },
    deleteAllData() {
      this.handleSelectionChange()
      if (this.DeleId.length > 0) {
        this.handleDelete(2, this.DeleId)
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    getDeleteDataName() {
        let dataId = this.templateSelection.dataid
        http.getDeleteShopByDataName({
          data: {
            dataid: dataId
          }
        }).then(res => {
            if (res.data === 'true') {
              this.shopDataForAllPage()
              this.getShopCarNum()
            }

        })

      },
    exportDataShp() {
      this.handleSelectionChange()
      if (this.shopId.length > 0) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        // http.getDeriveShopDate({
        //   dataIds: this.shopId,
        //   wktlist: this.wktlist,
        //   typeId: '2'
        // }).then(res => {
        http.getUUid({}).then(res => {
          let uuid = ''
          uuid = res.data
          http.getderiveShopDateOnlyShpByNew({
            data: {
              wktlist: this.wktlist,
              listDataName: this.ListDataName,
              satelites: this.ListSatellite,
              sensors: this.ListSensor,
              dids: this.shopId,
              nodeIds: this.nodeIdSData,
              dataIds: this.shopId,
              typeId: '3',
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
              }else {
                this.progress = parseFloat(response.data.F_PROGRESS)
              }
            })
          }, 2000); // 设置每隔1秒钟访问一次接口
        })
      } else {
        this.$message({
          message: '请选择数据!',
          type: 'warning'
        })
      }
    },
    exportDataView() {
      this.handleSelectionChange()
      if (this.shopId.length > 0) {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        // http.getDeriveShopDate({
        //   dataIds: this.shopId,
        //   wktlist: this.wktlist,
        //   typeId: '2'
        // }).then(res => {
        http.getUUid({}).then(res => {
          let uuid = ''
          uuid = res.data
          http.getderiveShopDateOnlyShpByNew({
            data: {
              wktlist: this.wktlist,
              listDataName: this.ListDataName,
              satelites: this.ListSatellite,
              sensors: this.ListSensor,
              dids: this.shopId,
              nodeIds: this.nodeIdSData,
              dataIds: this.shopId,
              typeId: '3',
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
              }else {
                this.progress = parseFloat(response.data.F_PROGRESS)
              }
            })
          }, 2000); // 设置每隔1秒钟访问一次接口
        })
      } else {
        this.$message({
          message: '请选择数据!',
          type: 'warning'
        })
      }
    },
    reflashData() {
      this.shopCurrentPage = 1
      this.shopDataForAllPage()
      if (this.shopTableData.length > 0) {
        this.$message({
          message: '刷新成功!',
          type: 'success'
        })
      }
    },
    // 初始化购物车
    shopInitTable() {
      let _this = this
      http.getAllShopDataForPage({
        currentPage: _this.shopCurrentPage,
        pageSize: _this.shopPageSize,
        data: {
          datatype: '0'
        }
      }).then(res => {
        res.data.list.forEach(item => {
          item.datatypename = 'GF1_MSS压缩包'
          // item.receivetime = this.commonMethod.timestampToTime(item.receivetime)
          if (item.receivetime.indexOf('T') > -1) {
            item.receivetime = item.receivetime.replace('T', ' ').slice(0, 19)
          }
          if (item.location.indexOf('undefined') > -1) {
            item.receivetime = '-'
          }
          item.cloudpercent = item.cloudpercent + '%'
          item.isSelect = false
        })
        this.shopTableData = res.data.list
        this.shopTotal = res.data.total
      })
    },
    // 初始化购物车
    shopDataForAllPage() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      http.getAllShopDataForAllPage({
        data: {
          // datatype: '0'
        }
      }).then(res => {
        loading.close()
        // console.log(res, 'RESSSSSSS')
        if (res.data && res.data.length > 0) {
          res.data.forEach((item, index) => {
            item.datatypename = 'GF1_MSS压缩包'
            if (item.receivetime && item.receivetime.indexOf('T') > -1) {
              item.receivetime = item.receivetime.replace('T', ' ').slice(0, 19)
            }
            if (!item.location || item.location.indexOf('undefined') > -1) {
              item.location = '-'
            }
            item.cloudpercent = item.cloudpercent + '%'
            item.isSelect = false
            if (item.datasize) {
              item.datasize = this.commonMZ.dataSizeFormatter(item.datasize)
            } else {
              item.datasize = '-'
            }
          })
          this.shopTableDataAll = res.data
          this.shopTableData = this.shopTableDataAll.slice((this.shopCurrentPage - 1) * this.shopPageSize, this.shopCurrentPage * this.shopPageSize)
          this.shopTotal = res.data.length
        } else {
          this.shopTableDataAll = []
          this.shopTableData = []
          this.shopTotal = 0
          this.imageAllCheck = false
          this.checkedAllData = false
        }
      })
    },
    // 购物车删除
    handleDelete(index, row) {
      let _this = this
      if (index === 1) {
        _this.shopId = [row.id]
      } else {
        _this.shopId = row
      }
      _this.$confirm('确认将数据移除购物车？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        http.deleteShop({
          // ids: _this.shopId
          data: {
            shopIds: _this.shopId
          }
        }).then(res => {
          if (res.data !== 'false') {
            _this.$notify({
              message: '删除成功！',
              position: 'bottom-right',
              duration: 1500,
              type: 'success'
            })
            _this.shopDataForAllPage()
            _this.getShopCarNum()
          } else {
            _this.$notify.error({
              message: '删除失败！',
              position: 'bottom-right',
              duration: 0
            })
          }
        }, (resp) => {
          _this.$notify.error({
            message: '请求失败！',
            position: 'bottom-right',
            duration: 0
          })
        })
      }).catch(() => {
        _this.$notify.info({
          message: '已取消删除！',
          position: 'bottom-right',
          duration: 3500
        })
      })
    },
    // 选择购物车数据
    handleSelectionChange() {
      this.shopId = []
      this.wktlist = []
      this.DeleId = []
      this.ListWkt = []
      this.ListDataName = []
      this.ListSatellite = []
      this.ListSensor = []
      this.typeId = '2'
      this.dataTypeSet = new Set()
      for (let i = 0; i < this.shopTableDataAll.length; i++) {
        if (this.shopTableDataAll[i].isSelect) {
          this.shopId.push(this.shopTableDataAll[i].did)
          this.DeleId.push(this.shopTableDataAll[i].id)
          this.nodeIdSData.push(this.shopTableDataAll[i].nodeid)
          this.wktlist.push(this.shopTableDataAll[i].wktresponse)
          this.ListDataName.push(this.shopTableDataAll[i].dataname)
          this.ListSatellite.push(this.shopTableDataAll[i].satelite)
          this.ListSensor.push(this.shopTableDataAll[i].sensor)
          this.dataTypeSet.add(this.shopTableDataAll[i].datatype)
        }
      }
    },
    //直接获取
    directAcquisition() {
      this.handleSelectionChange()
      localStorage.setItem('IDs', JSON.stringify(this.DeleId))
      if (this.shopId.length > 0) {
        console.log(localStorage)
        this.flag = {
          flager:true,
          orderName:this.orderName
        }
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    // 生成订单
    createShopOrder(index) {
      this.handleSelectionChange()
      localStorage.setItem('IDs', JSON.stringify(this.DeleId))
      if (this.shopId.length > 0) {
        sessionStorage.setItem('shopIDs', JSON.stringify(this.shopId))
        this.setShopIDs(this.shopId)
        if (index === 0) {
          this.$router.push({path: '/manage/person/shopCarCreateOrder'})
        } else if (index === 1) {
          if (this.dataTypeSet.size > 1) {
            this.$message({
              message: '创建再加工订单目前只支持选择一种数据类型的数据！',
              type: 'warning'
            })
          } else {
            this.$router.push({path: '/manage/person/createReporder'})
          }
        }
      } else {
        this.$message({
          message: '请选择数据！',
          type: 'warning'
        })
      }
    },
    // 重置订单名称输入框
    resetForm() {
      this.dialogTableVisible = false
    },
    // 点击购物车分页
    handleShopCurrentChange(val) {
      this.shopCurrentPage = val
      this.shopTableData = this.shopTableDataAll.slice((val - 1) * this.shopPageSize, val * this.shopPageSize)
    },
    // 点击购物车分页
    handleSizeChange(val) {
      this.shopPageSize = val
      this.shopTableData = this.shopTableDataAll.slice((this.shopCurrentPage - 1), this.shopCurrentPage * val)
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
    handleDetails(row) {
      this.setDialogShowDataZ(row)
      this.setDetailShow(1)
    },
    ...mapActions('searchStore', {
      setShopIDs: 'setShopIDs',
      setDialogShowDataZ: 'setDialogShowDataZ',
      setDetailShow: 'setDetailShow'
    }),
    ...mapActions('configManage', {
      getShopCarNum: 'getShopCarNum'
    })
  },
  created() {
    if (window.systemName === 'DZY') {
      this.heightInt = document.documentElement.clientHeight * 0.65
    } else {
      this.heightInt = document.documentElement.clientHeight * 0.68
    }
  },
  mounted() {
    if (this.$route.path === '/manage/person/shopCar') {
      this.shopDataForAllPage()
    }
    this.getUserR()
  },
  watch: {
    shopTableData: {
      handler(newVal, oldVal) {
        let _this = this
        let indexArr = []
        this.shopId = []
        this.DeleId = []
        this.wktlist = []
        if (newVal) {
          if (newVal.length > 0) {
            newVal.forEach(item => {
              if (!item.isSelect) {
                indexArr.push(item)
              } else {
                this.shopId.push(item.dataid)
                this.DeleId.push(item.id)
                this.wktlist.push(item.wktresponse)
              }
            })
            if (indexArr.length > 0) {
              _this.imageAllCheck = false
            } else {
              _this.imageAllCheck = true
            }
          }
        }
      },
      deep: true
    },
    shopTableDataAll: {
      handler(newVal, oldVal) {
        let indexAllArr = []
        if (newVal.length > 0) {
          newVal.forEach(item => {
            if (!item.isSelect) {
              indexAllArr.push(item)
            }
          })
          if (indexAllArr.length > 0) {
            this.checkedAllData = false
          } else {
            this.checkedAllData = true
          }
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';

.resultPagination {
  /*width: 46%;*/
  text-align: right;
  float: right;
}

.shopTableDataZ {
  /*min-height: 87%;*/
  width: 98%;
  border: 1px solid #E2E7EF;
  padding: 1%;
  background: #fff;
  float: left;
  /*height: 70%;*/
}

.shopH {
  overflow: auto;
}

.shopTableDataZ > > > .el-table th {
  /*padding: 0!important;*/
  color: #353535 !important;
  background-color: #EBF0FA !important;
}

.shopTableDataZ > > > .el-table th {
  text-align: center !important;
}

.shopTableDataZ > > > .el-table td {
  text-align: center !important;
}

.shopTableDataZ > > > .el-table td {
  /*border-bottom: none;*/
}

.resultButton {
  /*width: 54%;*/
  float: left;
}

.resultButton > > > .el-checkbox__label {
  font-size: .3rem !important;
}
</style>
