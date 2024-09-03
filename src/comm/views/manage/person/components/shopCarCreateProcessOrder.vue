<template>
  <div class="createOrder">
    <el-page-header title="返回" @back="goBack" content="创建再加工订单详情">
    </el-page-header>
    <!--<div style="font-size: 18px; color: #303133; line-height: 24px;">创建再加工订单详情</div>-->
    <el-card class="box-card" style="margin: .2rem 0;">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <div class="content">
        <el-form class="elForm" :label-position="labelPosition" label-width="120px" :model="formLabelAlign" :inline="true">
          <el-form-item label="申请人">
            <el-input :disabled="userDisabled" v-model="formLabelAlign.user"></el-input>
          </el-form-item>
          <el-form-item label="申请单位">
            <el-input :disabled="companyDisabled" v-model="formLabelAlign.company"></el-input>
            <!-- <el-input v-model="formLabelAlign.company"></el-input> -->
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input :disabled="phoneDisabled" v-model="formLabelAlign.phone"></el-input>
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
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card"
             style="margin: .2rem 0;">
      <div slot="header"
           class="clearfix">
        <span>级别信息</span>
      </div>
      <div class="content">
        <el-form class="elForm" :label-position="labelPosition" label-width="110px" :inline="true">
          <el-form-item label="产品级别">
            <el-select v-model="productLevel" clearable placeholder="请选择">
              <el-option v-for="item in Level" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="分发频率">-->
            <!--<el-select v-model="formLabelAlign.disFrequency" placeholder="请选择">-->
              <!--<el-option v-for="item in disFrequencyData" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
            <!--&lt;!&ndash; <el-input v-model="formLabelAlign.disFrequency"></el-input> &ndash;&gt;-->
          <!--</el-form-item>-->
          <!--<el-form-item label="延迟间隔">-->
            <!--<el-select v-model="formLabelAlign.delayInterval" placeholder="请选择">-->
              <!--<el-option v-for="item in delayIntervalData" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
            <!--&lt;!&ndash; <el-input v-model="formLabelAlign.delayInterval"></el-input> &ndash;&gt;-->
          <!--</el-form-item>-->
          <!--<el-form-item label="提取路径">-->
            <!--<el-select v-model="formLabelAlign.extractionPaths" placeholder="请选择">-->
              <!--<el-option v-for="item in extractionPathsData" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
             <!--<el-input v-model="formLabelAlign.extractionPaths"></el-input> -->
          <!--</el-form-item>-->
          <!--<el-form-item label="描述信息">-->
            <!--<el-input type="textarea" v-model="formLabelAlign.descriptor"></el-input>-->
            <!--&lt;!&ndash; <el-input v-model="formLabelAlign.descriptor"></el-input> &ndash;&gt;-->
          <!--</el-form-item>-->
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card" style="margin: .2rem 0;">
      <div slot="header" class="clearfix">
        <span>数据信息</span>
      </div>
      <div class="content">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="dataid" label="数据ID" show-overflow-tooltip></el-table-column>
          <el-table-column prop="dataname" label="数据名称" show-overflow-tooltip></el-table-column>
          <!--<el-table-column prop="satelite" label="卫星" show-overflow-tooltip></el-table-column>-->
          <el-table-column prop="receivetime" label="采集时间" show-overflow-tooltip></el-table-column>
          <!--<el-table-column prop="datasize" label="数据大小" show-overflow-tooltip></el-table-column>-->
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="scope">
              <!--<el-button type="primary" size="mini">详情</el-button>-->
              <el-button  @click="removeData(scope.$index, scope.row)" type="danger" size="mini">删除</el-button>
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
    <div style="width: 100%;text-align: left;" class="">
      <el-button @click="createOrder" style="margin: 0.3rem;" type="primary" >创&nbsp;&nbsp;建</el-button>
      <!-- <el-button type="danger" size="mini">取消</el-button> -->
    </div>
    <el-dialog ref="rules" :modal="true" title="确认订单" :visible.sync="dialogVisible" width="43%">
      <el-form ref="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="订单名称">
          <el-input v-model="orderReference" placeholder="请输入订单名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('rules')">取 消</el-button>
        <el-button type="primary" @click="confirmOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import customTable from '@comm/components/customTable'
import http from '@comm/service/interface.js'
import { mapActions, mapState } from 'vuex'
export default {
  components: {
    customTable
  },
  data () {
    return {
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
      labelPosition: 'right',
      productLevel: '',
      Level: [
        {
          label: '一级',
          value: 1
        },
        {
          label: '二级',
          value: 2
        },
        {
          label: '三级',
          value: 3
        }
      ],
      formLabelAlign: {
        user: '',
        phone: '',
        company: '',
        employ: '',
        downloadWay: '2',
        disFrequency: '',
        delayInterval: '',
        extractionPaths: '',
        descriptor: ''
      },
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
      userID: '',
      orderReference: '',
      list: []
    }
  },
  methods: {
    removeData (index, row) {
      console.log(row)
      let dataList = []
      this.tableData.forEach(item => {
        if (item.id !== row.id) {
          dataList.push(item)
        }
      })
      this.tableData = dataList
    },
    goBack () {
      // this.$router.push({ name: 'shopCar' })
      this.$router.go(-1)
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
        console.log(res, '99999999')
        this.userID = res.data.id
        this.formLabelAlign.user = res.data.nickName
        this.formLabelAlign.company = res.data.name
        this.formLabelAlign.phone = res.data.phoneMobile
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
    getShopData () {
      // let dataid = JSON.parse(sessionStorage.getItem('shopIDs'))
      let dataid = JSON.parse(this.shopIDs)
      http.getAllShopDataForPage({
        currentPage: this.currentPage,
        pageSize: this.pageSize,
        // data: {ids: dataid}
        data: {}
      }).then(res => {
        console.log(res)
        res.data.list.forEach(item => {
          item.receivetime = new Date(item.favoritetime).toLocaleString()
        })
        this.list = []
        for (let key in dataid) {
          res.data.list.forEach(item => {
            if (item.id === dataid[key]) {
              this.list.push(item)
            }
          })
        }
        // console.log(list)
        // this.tableData = res.data.list
        // this.total = res.data.total
        this.tableData = this.list
        this.total = this.list.length
      })
    },
    createOrder () {
      if (this.formLabelAlign.downloadWay === '') {
        // this.$message.error('请选择下载方式！')
        this.$notify.error({
          message: '请选择下载方式！',
          position: 'bottom-right',
          duration: 0,
          type: 'success'
        })
        return
      }
      // else if (this.formLabelAlign.disFrequency === '') {
      //   this.$message.error('请选择分发频率！')
      //   return
      // } else if (this.formLabelAlign.delayInterval === '') {
      //   this.$message.error('请选择延迟间隔！')
      //   return
      // }
      this.orderReference = this.createName()
      this.orderId = []
      this.tableData.forEach(item => {
        this.orderId.push(item.id)
      })
      // this.dialogVisible = true
      this.confirmOrder()
    },
    confirmOrder () {
      http.createOrder({data: {
        level: this.productLevel,
        shopIds: this.orderId,
        ordername: this.orderReference,
        distmethod: this.formLabelAlign.downloadWay,
        distfrequency: this.formLabelAlign.disFrequency,
        delaytime: this.formLabelAlign.delayInterval,
        description: this.formLabelAlign.descriptor,
        applyUserUsed: this.formLabelAlign.employ,
        type: 2
      }}).then(res => {
        console.log(res)
        if (res.data === 'true') {
          // this.$message({
          //   message: '创建订单成功！',
          //   type: 'success'
          // })
          this.$notify({
            message: '创建订单成功！',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          this.getShopData()
          this.setShopAgen(2)
          this.$router.push({
            name: 'orderManage'
          })
          this.setRouterPath('/manage/person/orderManage')
          // this.dialogVisible = false
        } else {
          // this.$message.error('创建订单失败！')
          this.$notify.error({
            message: '创建订单失败！',
            position: 'bottom-right',
            duration: 0
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
    resetForm (formName) {
      this.dialogVisible = false
      this.$refs[formName].resetFields()
    },
    ...mapActions('manage', {
      setRouterPath: 'setRouterPath'
    }),
    ...mapActions('searchStore', {
      setShopAgen: 'setShopAgen'
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
  activated () {
    this.getUserData()
    this.getShopData()
  }
}
</script>

<style lang="scss" scoped>
  .createOrder{
    margin: 4vh 4vw 4vh 5vw;
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
</style>
