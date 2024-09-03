<template>
  <div>
    <el-form :inline="true" :model="addModalData" size="mini" label-position="right">
      <div style="padding: 10px;background: #ffff;">
        <div style="padding: 10px 0 16px 0;">
          <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
          <span>推送设置</span>
        </div>
        <div>
          <el-form-item label="用户名称:">
            <!--<el-cascader-->
              <!--style="width: 100%"-->
              <!--expand-trigger="hover"-->
              <!--ref="cascaderAddr"-->
              <!--:options="options"-->
              <!--clearable-->
              <!--:disabled="editFlag"-->
              <!--@change="handleChange">-->
              <el-select @change="selectChangeU" v-model="addModalData.fUserId" :disabled="editFlag">
                <el-option
                  v-for="item in proName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            <!--</el-cascader>-->
          </el-form-item><span class='xin'>*</span>
          <el-form-item label="数据推送周期:">
            <el-select v-model="addModalData.fTimeQuantum" :disabled="editFlag">
              <el-option label="日" value="日"></el-option>
              <el-option label="周" value="周"></el-option>
              <el-option label="月" value="月"></el-option>
            </el-select>
          </el-form-item><span class='xin'>*</span>
          <el-form-item label="数据范围:">
            <el-cascader
              :disabled="editFlag"
              v-model="addModalData.fGeometryId"
              change-on-select
              clearable
              ref="cascaderDiv"
              @change="cascaderChange"
              :options="fGeometryIdAll"
              :props="{ expandTrigger: 'hover' }"
            ></el-cascader> <span class='xin'>*</span>
            <el-upload
              :disabled="editFlag"
              class="upload-demo"
              v-show="addModalData.fGeometryType === '1'"
              :action="wktManager"
              :file-list="fileList"
              :limit="1"
              :on-success="fileSuccess"
            >
              <el-button size="mini" type="primary" style="marginTop:10px" :disabled="editFlag">点击上传(shp文件压缩包)</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="推送启动时间:">
            <el-date-picker
              :disabled="editFlag"
              :picker-options="pickerOptions0"
              v-model="addModalData.fExecuteTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item><span class='xin'>*</span>
          <el-form-item label="数据时间范围:">
            <el-date-picker
              :disabled="editFlag"
              v-model="addModalData.startEndTime"
              style="width: 100%"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item><span class='xin'>*</span>
          <el-form-item label="优先级:">
            <el-input-number v-model="addModalData.fOrder" controls-position="right" @change="handleChangeNum" :min="1" :max="10"></el-input-number>
          </el-form-item><span class='xin'>*</span>
          <el-form-item label="任务书:">
            <uploadtest @uploadtestData = 'uploadtestD'></uploadtest>
          </el-form-item><span class='xin'>*</span>
          <!--<el-form-item label="数据采集时间:">-->
            <!--<el-date-picker-->
              <!--:disabled="editFlag"-->
              <!--v-model="addModalData.catchStartEndTime"-->
              <!--style="width: 100%"-->
              <!--size="mini"-->
              <!--type="daterange"-->
              <!--range-separator="至"-->
              <!--start-placeholder="开始日期"-->
              <!--end-placeholder="结束日期">-->
            <!--</el-date-picker>-->
          <!--</el-form-item><br>-->
          <!--<el-form-item label="产品序列号:">-->
            <!--<el-input size="mini" placeholder="请输入或者导入序列号" v-model="addModalData.fProductid"  clearable></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item style="margin-left: 1%"><el-upload-->
            <!--ref="upload1"-->
            <!--:before-upload="beforeUpload"-->
            <!--class="upload-demo"-->
            <!--:show-file-list="false"-->
            <!--:action="wktManager"-->
            <!--accept=".txt"-->
            <!--:limit="1"-->
            <!--:on-success="fileSuccess1"-->
          <!--&gt;-->
            <!--<el-button size="mini" type="primary" style="margin-left: 1%;marginTop:5px" title="内容为一列">导入txt</el-button>-->
          <!--</el-upload></el-form-item>-->
          <!--<el-form-item label="景序列号:">-->
            <!--<el-input size="mini" placeholder="请输入或者导入序列号" v-model="addModalData.fSceneid"  clearable></el-input>-->
          <!--</el-form-item>-->
          <!--<el-form-item style="margin-left: 1%"><el-upload-->
            <!--ref="upload"-->
            <!--class="upload-demo"-->
            <!--:before-upload="beforeUpload"-->
            <!--:show-file-list="false"-->
            <!--:action="wktManager"-->
            <!--accept=".txt"-->
            <!--:limit="1"-->
            <!--:on-success="fileSuccess2"-->
          <!--&gt;-->
            <!--<el-button size="mini" type="primary" style="margin-left: 1%;marginTop:5px" title="内容为一列">导入txt</el-button>-->
          <!--</el-upload></el-form-item>-->
          <!--<el-input size="mini" placeholder="请输入" v-model="addModalData.fProductid"></el-input>-->
          <!--<el-input size="mini" placeholder="请输入" v-model="addModalData.fSceneid"></el-input>-->
          <!--<div style="width: 100%;">-->
            <!--<div style="font-size: 13px;    margin-bottom: 5px;-->
    <!--float: left;position: relative;-->
    <!--top: 11px;-->
    <!--margin-right: 10px;">-->
              <!--待接收FTP:-->
            <!--</div>-->
            <!--<div style="width: 93%; display: inline-block">-->
              <!--<el-table-->
                <!--:data="addModalData.ftpManagerDos"-->
                <!--size="mini"-->
              <!--&gt;-->
                <!--<el-table-column label="类别" prop="index" width="60"></el-table-column>-->
                <!--<el-table-column label="名称" prop="fFtpName" >-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-input size="mini" :disabled="editFlag" placeholder="请输入" v-model="scope.row.fFtpName"></el-input>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="FTP地址" prop="fFtpAddress"  width="120">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-input size="mini" :disabled="editFlag" placeholder="请输入" v-model="scope.row.fFtpAddress"></el-input>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="FTP端口" prop="fFtpPort">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-input size="mini" :disabled="editFlag" placeholder="请输入" v-model="scope.row.fFtpPort"></el-input>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="存储路径" prop="fFtpStorePath">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-input size="mini" :disabled="editFlag" placeholder="请输入" v-model="fFtpStorePath1"></el-input>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="用户名" prop="fFtpUserName">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-input size="mini" :disabled="editFlag" placeholder="请输入" v-model="scope.row.fFtpUserName"></el-input>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="密码" prop="fFtpPasword">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-input size="mini" placeholder="请输入" :disabled="editFlag" v-model="scope.row.fFtpPasword"></el-input>-->
                  <!--</template>-->
                <!--</el-table-column>-->
                <!--<el-table-column label="操作">-->
                  <!--<template slot-scope="scope">-->
                    <!--<el-button type="primary" size="mini" @click="testFtp(scope.row)" v-show="!ftpFlagArr[scope.row.fFtpType - 1]">测试</el-button>-->
                    <!--<span v-show="ftpFlagArr[scope.row.fFtpType - 1]">测试成功</span>-->
                  <!--</template>-->
                <!--</el-table-column>-->
              <!--</el-table>-->
            <!--</div>-->
          <!--</div>-->
        </div>
      </div>
      <div style="padding: 10px;background: #ffff; margin-top: 12px">
        <div style="padding: 10px 0 16px 0;">
          <img class="spanIMG_Z" src="@/assets/img/spanIMG.png" alt="">
          <span>数据信息</span>
        </div>
        <el-row type="flex" >
          <el-col style="width:110px;fontSize:13px;paddingRight:12px;marginTop:8px">
            推送数据类型:
            <i class="el-icon-folder-add addTableTaskz" @click="addTableTask" v-show="!editFlag"></i>
          </el-col>
          <el-col :span="24">
            <el-table
              :data="addModalData.taskSatDos"
              size="mini"
            >
              <el-table-column label="序号" prop="index" width="60"></el-table-column>
              <el-table-column label="产品级别" prop="fProductLevel">
                <template slot-scope="scope">
                  <el-select size="mini" v-model="scope.row.fProductLevel" @change="selectChange(scope.row, '1')" :disabled="editFlag">
                    <el-option :label="item.name" :value="item.name" v-for="(item, i) in scope.row.startType" :key="i"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="卫星类型" prop="fSat">
                <template slot-scope="scope">
                  <el-select size="mini" v-model="scope.row.fSat" @change="selectChange(scope.row, '2')" :disabled="editFlag">
                    <el-option :label="item.name" :value="item.name" v-for="(item, i) in childrenOne(scope.row)" :key="i"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="传感器" prop="fSensor" width="160">
                <template slot-scope="scope">
                  <el-select multiple collapse-tags size="mini" v-model="scope.row.fSensorZ" :disabled="editFlag">
                    <el-option :label="item.name" :value="item.name" v-for="(item, i) in childrenTwo(scope.row)" :key="i"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="云量(<=%)" prop="fCloundAmount">
                <template slot-scope="scope">
                  <el-input-number style="width: 80px" size="mini" :controls="false" v-model="scope.row.fClounodAmunt"  :min="0" :max="100"  placeholder="请输入" :disabled="editFlag"></el-input-number>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="danger" size="mini" @click="removeTableTask(scope.$index + 1)" :disabled="editFlag">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer spanfooter">
      <el-button @click="modalVisible = false">取消</el-button>
      <el-button type="primary" @click="saveAddData">保存</el-button>
    </span>
  </div>
</template>
<script>
/* eslint-disable no-trailing-spaces */
import http from '@comm/service/interface'
import uploadtest from './uploadData/uploadtest.vue'
import { SM4Util } from '@comm/service/sm4encry'
import {mapState} from 'vuex'
export default {
  data () {
    return {
      fSceneid: '', // 景序列号
      fFtpStorePath1: '',
      groupname: '',
      dialogTitleType: '添加任务',
      proName: [],
      newarr: [],
      startType: [],
      ftpManagerDosTitle: [
        {name: '主'}, {name: '副'}
      ],
      userLevel: [], // 产品级别
      sat: [],
      options: [],
      indexzzz: '',
      modalVisible: false,
      editFlag: false,
      indexNum: 0,
      addModalData: this.getAddModalDataInit(),
      fDistrictCodeAll: [], // 所在地区所有行政区（省）
      fGeometryIdAll: [], // 数据范围所有行政区（市）
      listenfGeometryType: '', // 监听数据范围选择自定义还是行政区
      wktManager: http.wktManager, // wkt上传地址
      ftpFlagArr: [false, false],
      pickerOptions0: { // 限制开始推送时间
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      fileList: [],
      uploadData: []
    }
  },
  props: ['saveTableData', 'editModalData', 'reflashTask'],
  components: {
    uploadtest
  },
  computed: {
    childrenOne () {
      return function (row) {
        if (row.fProductLevel) {
          let arr = row.startType.filter(item => item.name === row.fProductLevel)
          return arr[0].children
        }
        return []
      }
    },
    childrenTwo () {
      return function (row) {
        if (row.fSat) {
          let arr = row.startType.filter(item => item.name === row.fProductLevel)
          let arrTwo = arr[0].children.filter(item => item.name === row.fSat)
          return arrTwo[0].children
        }
        return []
      }
    },
    ftpManagerDosOne () {
      return this.addModalData.ftpManagerDos[0]
    },
    ftpManagerDosTwo () {
      return this.addModalData.ftpManagerDos[1]
    },
    ...mapState('searchStore', {
      spanLabel: function (state) {
        return state.spanLabel
      }
    })
  },
  watch: {
    listenfGeometryType (newVal, oldVal) {
      if (newVal === '自定义') {
        this.addModalData.fGeometryType = '1'
      } else if (newVal) {
        this.addModalData.fGeometryType = '0'
        this.addModalData.fGeometryId = newVal
      }
    },
    ftpManagerDosOne: {
      handler (newVal, oldVal) {
        this.ftpFlagArr[0] = false
      },
      deep: true
    },
    ftpManagerDosTwo: {
      handler (newVal, oldVal) {
        this.ftpFlagArr[1] = false
      },
      deep: true
    },
    // $route: {
    //   handler (val, oldVal) {
    //     console.log(val)
    //     console.log(this.addModalData.taskSatDos)
    //     if (val) {
    //       this.indexzzz = val.path
    //     }
    //     // this.$nextTick(() => {
    //     if (this.addModalData.taskSatDos && this.addModalData.taskSatDos.length === 0) {
    //       this.getUserscrpge()
    //     }
    //     // })
    //   },
    //   // 深度观察监听
    //   deep: true
    // },
    spanLabel: {
      handler (newval, oldVal) {
        if (newval) {
          if (!(this.addModalData.taskSatDos && this.addModalData.taskSatDos.length > 0)) {
            this.getUserscrpge()
          }
        }
      },
      // 深度观察监听
      immediate: true,
      deep: true
    }
  },
  updated () {
  },
  methods: {
    handleChangeNum (value) {
      console.log(value)
    },
    isNumber (value) {
      if (value === undefined || value === null || value === '') {
        return false
      }
      if (typeof (value) === 'string') {
        // 正整数
        var reNumber = /^\d+$/
        // 负整数
        var reNeNumber = /^-\d+$/
        // 正实数
        var reRealNumber1 = /^[1-9]\d*[.]\d+$/ // 非零开头
        var reRealNumber2 = /^0[.]\d+$/ // 零开头
        // 负实数
        var reNeRealNumber1 = /^-[1-9]\d*[.]\d+$/ // 非零开头
        var reNeRealNumber2 = /^-0[.]\d+$/ // 零开头
        if (reNumber.test(value) || reNeNumber.test(value) || reRealNumber1.test(value) || reRealNumber2.test(value) || reNeRealNumber1.test(value) || reNeRealNumber2.test(value)) {
          return true
        } else {
          return false
        }
      } else if (typeof (value) === 'number') {
        return true
      } else {
        return false
      }
    },
    beforeUpload (file) {
      console.log(file)
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      const extension = testmsg === 'txt'
      // const extension2 = testmsg === 'xlsx'
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension) {
        this.$message({
          message: '上传文件只能是txt格式!',
          type: 'warning'
        })
      }// if(!isLt2M)
      //     this.$message({
      //         message: '上传文件大小不能超过 10MB!',
      //         type: 'warning'
      //     });
      // }
      // return extension || extension2 && isLt2M
      return extension
    },
    selectChangeU (val) {
      http.userGetById({val}).then(res => {
        console.log(res, '0a0a0a0a0a0')
        let arr = res.data
        http.departmentTable({currentPage: 1,
          pageSize: 99,
          describe: '',
          groupIds: '',
          name: ''}).then(res => {
          res.data.list.forEach(item => {
            if (item.id === arr.groupIds[0]) {
              console.log(item.name, 'item.name')
              this.groupname = item.name
            }
          })
        })
        // if (res.data) {
        //   this.departmentData.forEach(item => {
        //     if (item.id === res.data.groupIds[0]) {
        //       this.formLabelAlign.groupid = res.data.groupIds[0]
        //       this.formLabelAlign.groupname = item.name
        //     }
        //   })
        // }
      })
    },
    handleChange (value) {
      if (value.length > 0) {
        let lastVlaue = value[value.length - 1] // 获取选中下拉的id
        http.groupGetById({id: lastVlaue}).then(res => {
          this.fFtpStorePath1 = res.data.districtCode
        })
        // this.addModalData.fDistrictCode = lastVlaue
        this.getDataftp(Number(lastVlaue))
        // // 递归循环数据
        let arrt = this.options
        this.render(arrt, this.newarr, lastVlaue)
        // console.log(this.newarr, '用户单位id返回数据')
        this.addModalData.fDistrictName = this.newarr[0].label
        this.addModalData.fDistrictCode = this.newarr[0].id
      }
    },
    render (arr, newarr, lastVlaue) { // 遍历获取推送单位
      // alert(JSON.stringify(arr))
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === lastVlaue) {
          newarr.push(arr[i])
        }
        if (arr[i].children && arr[i].children.length > 0) {
          this.render(arr[i].children, newarr, lastVlaue)
        }
      }
    },
    initTree () {
      http.groupTree({pid: 0}).then(res => {
        this.options = res.data
      })
    },
    modalOpen () {
      let arrName = []
      // http.userTable().then(res => {
      //   console.log(res, '1244')
      //   res.data.list.forEach(item => {
      //     arrName.push({
      //       id: item.id,
      //       name: item.name,
      //       phoneMobile: item.phoneMobile,
      //       loginName: item.loginName
      //     })
      //   })
      //   this.proName = arrName
      // })
      http.listData().then(res => {
        res.data.list.forEach(item => {
          arrName.push({
            id: item.id,
            name: item.name,
            phoneMobile: item.phonemobile,
            loginName: item.name
          })
        })
        console.log(arrName, 'arrName')
        this.proName = arrName
      })
      this.getListByCode({fCode: 100000, levels: [1]}, (data) => {
        this.fDistrictCodeAll = data
      })
      this.getListByCode({fCode: 100000, levels: [1, 2, 3]}, (data) => {
        data = this.addLabel(data)
        data.unshift({label: '自定义', value: '自定义', children: []})
        this.fGeometryIdAll = data
      })
      this.listenfGeometryType = ''
      this.ftpFlagArr = [false, false] // fDataEndTime fDistrictCode
      if (this.editModalData && Object.keys(this.editModalData).length) {
        this.editFlag = true
        let editModalData = this.editModalData
        editModalData.taskSatDos.map(item => {
          item.fSensor = item.fSensor.split(',')
        })
        editModalData.startEndTime = [editModalData.fDataStartTime, editModalData.fDataEndTime]
        editModalData.taskSatDos.map(item => {
          item.startType = this.startType
        })
        this.addModalData = editModalData
      } else {
        this.editFlag = false
        this.$refs['cascaderDiv'] && this.$refs['cascaderDiv'].handleClear()
        this.addModalData = this.getAddModalDataInit()
      }
    },
    // 递归加label和value
    addLabel (arr) {
      arr.map(item => {
        if (item.children) {
          this.addLabel(item.children)
        }
        item.label = item.fCname
        item.value = item.id
      })
      return arr
    },
    uploadtestD (val) {
      console.log(val, '0009090909')
      this.uploadData = val
    },
    cascaderChange (codeArr) {
      this.$refs['cascaderDiv'].toggleDropDownVisible(false)
      this.listenfGeometryType = codeArr[codeArr.length - 1]
    },
    // 上传shp文件
    fileSuccess (response) {
      var d = JSON.parse(SM4Util.decryptData_ECB(response.data))
      if (d === 'false') {
        this.$message({
          message: '无效的shp压缩包文件!',
          type: 'warning'
        })
        this.fileList = []
      } else {
        this.addModalData.fGeometryId = d.join(',')
      }
    },
    fileSuccess1 (response, file, fileList) {
      // this.$refs.upload1.clearFiles()
      var reader = new FileReader()
      let that = this
      reader.onload = function () {
        let s = reader.result.replace(/\r\n/g, '') // txt文本内容，接下来就可以对其进行校验处理了
        let isnumber = that.isNumber(s)
        if (isnumber) {
          that.addModalData.fProductid = reader.result.replace(/\r\n/g, ',') // txt文本内容，接下来就可以对其进行校验处理了
          that.$message({
            message: '导入成功！',
            type: 'success'
          })
        } else {
          that.$message({
            message: 'txt文件中只能包含数字!',
            type: 'warning'
          })
        }
      }
      reader.readAsText(file.raw, 'UTF-8')
    },
    fileSuccess2 (response, file, fileList) {
      // this.$refs.upload.clearFiles()
      var reader = new FileReader()
      let that = this
      reader.onload = function () {
        let s = reader.result.replace(/\r\n/g, '') // txt文本内容，接下来就可以对其进行校验处理了
        let isnumber = that.isNumber(s)
        if (isnumber) {
          that.addModalData.fSceneid = reader.result.replace(/\r\n/g, ',') // txt文本内容，接下来就可以对其进行校验处理了
          that.$message({
            message: '导入成功！',
            type: 'success'
          })
        } else {
          that.$message({
            message: 'txt文件中只能包含数字!',
            type: 'warning'
          })
        }
      }
      // reader.onload = function () {
      //   that.addModalData.fSceneid = reader.result.replace(/\r\n/g, ',')// txt文本内容，接下来就可以对其进行校验处理了
      //   that.$message({
      //     message: '导入成功！',
      //     type: 'success'
      //   })
      // }
      reader.readAsText(file.raw, 'UTF-8')
    },
    // 获取所有省或者所有市
    getListByCode (obj, callBack) {
      http.listByCode(obj).then(res => {
        callBack(res.data)
      })
    },
    // 卫星数据选择
    selectChange (row, num) {
      if (num === '1') {
        row.satelliteType = ''
        row.satelliteSensor = ''
      }
      if (num === '2') {
        row.satelliteSensor = this.childrenTwo(row).length === 1 ? [this.childrenTwo(row)[0].name] : ''
      }
    },
    // 添加一条卫星数据类型
    addTableTask () {
      let len = this.addModalData.taskSatDos.length + 1
      this.addModalData.taskSatDos.push({index: len, proClass: '', satelliteType: '', satelliteSensor: '', cloudNum: '', startType: this.startType})
    },
    // 删除一条卫星数据
    removeTableTask (index) {
      let arr = this.addModalData.taskSatDos.filter(item => item.index !== index)
      arr.map((item, i) => {
        item.index = i + 1
        return item
      })
      this.addModalData.taskSatDos = arr
    },
    // 测试ftp
    testFtp (row) {
      let _this = this
      http.connect(row).then(res => {
        if (res.data === 'true') {
          let arr = _this.ftpFlagArr
          arr[row.fFtpType - 1] = true
          _this.ftpFlagArr = [...arr]
        }
      })
    },
    // 初始化addModalDataInit
    getAddModalDataInit () {
      return {
        fProductid: '', // 产品序列号
        fSceneid: '', // 景序列号
        fUserId: '',
        fOrder: 1,
        fApplyuser: '',
        fApplyuserphone: '',
        fApplyuserunit: '',
        fLoginUser: '',
        catchStartEndTime: [], // 数据采集时间
        fDistrictName: '', // 推送单位
        startEndTime: [], // 前端控件开始结束时间
        fDistrictCode: '', // 所在地区id
        fTimeQuantum: '日', // 数据推送周期
        fGeometryType: '', // 数据范围类型：1行政区，2WKT
        fGeometryId: '', // 数据范围：1 code，2 WKT-id
        fExecuteTime: '', // 开始推送数据的时间
        fDataStartTime: '', // 数据推送开始时间
        fDataEndTime: '', // 数据推送结束时间
        taskSatDos: [ // 卫星类型数据
          // {
          //   index: 1,
          //   fProductLevel: '',
          //   fSat: '',
          //   fSensor: '',
          //   fCloundAmount: '',
          //   startType: window.startType
          // }
        ],
        ftpManagerDos: [ // ftp信息
          {
            index: '主',
            fFtpType: '1',
            fFtpName: '',
            fFtpAddress: '',
            fFtpStorePath: '',
            fFtpUserName: '',
            fFtpPasword: '',
            fFtpPort: ''
          },
          {
            index: '备',
            fFtpType: '2',
            fFtpName: '',
            fFtpAddress: '',
            fFtpStorePath: '',
            fFtpUserName: '',
            fFtpPasword: '',
            fFtpPort: ''
          }
        ],
        filePath: '',
        fileName: ''
      }
    },
    saveAddData () {
      if (this.editFlag) {
        let {id, fTaskStatus} = this.addModalData
        let ftpManagerDos = this.addModalData.ftpManagerDos
        let recordInfos = [{id, statusCode: fTaskStatus}]
        http.taskOperation({operationCode: 2, recordInfos, taskLevel: 0, ftpManagerDos}).then(res => {
          if (res.data === 'true') {
            this.$message({
              message: '添加任务成功',
              type: 'success'
            })
          }
          this.$emit('reflashTask')
          this.modalVisible = false
        }).catch(err => {
          this.$message(err)
        })
      } else {
        let s1 = this.addModalData.fSceneid.replace(',', '') // txt文本内容，接下来就可以对其进行校验处理了
        let s2 = this.addModalData.fProductid.replace(',', '') // txt文本内容，接下来就可以对其进行校验处理了
        if (s1) {
          if (!this.isNumber(s1)) {
            this.$message({
              message: '景序列号只能为数字！',
              type: 'error'
            })
            return
          }
        }
        if (s2) {
          if (!this.isNumber(s2)) {
            this.$message({
              message: '产品序列号只能为数字！',
              type: 'error'
            })
            return
          }
        }
        const { startEndTime } = this.addModalData
        const { catchStartEndTime } = this.addModalData
        this.addModalData.fDataStartTime = this.commonMZ.timestampToTimeT(startEndTime[0])
        this.addModalData.fDataEndTime = this.commonMZ.timestampToTimeT(startEndTime[1])
        this.addModalData.fSceneStartTime = catchStartEndTime[0]
        this.addModalData.fSceneEndTime = catchStartEndTime[1]
        this.addModalData.taskSatDos.map(item => {
          if (typeof item.fSensorZ === 'object') {
            item.fSensor = item.fSensorZ.join(',')
          }
        })
        console.log(this.addModalData)
        this.proName.forEach(item => {
          if (item.id === this.addModalData.fUserId) {
            this.addModalData.fApplyuser = item.name
            this.addModalData.fApplyuserphone = item.phoneMobile
            this.addModalData.fApplyuserunit = this.groupname
            this.addModalData.fLoginUser = item.loginName
          }
        })
        if (this.uploadData.length === 0) {
          this.$message({
            message: '请上传任务书！',
            type: 'warning'
          })
          return
        } else {
          this.addModalData.filePath = this.uploadData[0].filepath
          this.addModalData.fileName = this.uploadData[0].name
        }
        http.saveTask(this.addModalData).then(res => {
          console.log(res, 'a0if09a')
          if (res.data === 'true') {
            this.modalVisible = false
            this.$emit('saveTableData')
            this.$message({
              message: '添加任务成功',
              type: 'success'
            })
            this.uploadData = [] // 清空任务书
            this.$router.push({path: '/manage/person/send'})
          } else {
            if (res.data.indexOf('绑定ftp信息') > -1) {
              this.$confirm('该用户暂未绑定ftp地址，是否要跳转到ftp绑定页面吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push({path: '/manage/person/subscriberManage'})
              }).catch(() => {})
            } else {
              this.$message({
                message: res.data,
                type: 'error'
              })
            }
          }
        }).catch(() => {
          this.addModalData.taskSatDos.map(item => {
            item.fSensor = item.fSensor.split()
          })
          this.$message({
            message: '‘发送任务失败’',
            type: 'error'
          })
        })
      }
    },
    // 获取传感器类型
    getDataLine () {
      http.getDataSourceByPid({'id': '10002', 'fValue': 'GF1'}).then(res => {
        this.addModalData.taskSatDos = res.data
      }).catch(err => {
        this.$message(err)
      })
    },
    // 获取用户等级
    getUserscrpge () {
      http.getDataallstatistics().then(res => {
        console.log(res, '0000000')
        this.startType = res.data
      }).catch(err => {
        this.$message(err)
      })
    },
    getDataftp (ById) {
      http.getDatabaseftp(ById).then(res => {
        this.sat = []
        this.sat = res.data
        let lengthsat = this.sat.length
        if (lengthsat > 0 && lengthsat <= 1) {
          this.addModalData.ftpManagerDos[0].fFtpName = this.sat[0].fFtpName
          this.addModalData.ftpManagerDos[0].fFtpAddress = this.sat[0].fFtpAddress
          this.addModalData.ftpManagerDos[0].fFtpStorePath = this.sat[0].fFtpStorePath
          this.addModalData.ftpManagerDos[0].fFtpUserName = this.sat[0].fFtpUserName
          this.addModalData.ftpManagerDos[0].fFtpPasword = this.sat[0].fFtpPasword
          this.addModalData.ftpManagerDos[0].fFtpPort = this.sat[0].fFtpPort
        } else {
          this.addModalData.ftpManagerDos[0].fFtpName = this.sat[0].fFtpName
          this.addModalData.ftpManagerDos[0].fFtpAddress = this.sat[0].fFtpAddress
          this.addModalData.ftpManagerDos[0].fFtpStorePath = this.sat[0].fFtpStorePath
          this.addModalData.ftpManagerDos[0].fFtpUserName = this.sat[0].fFtpUserName
          this.addModalData.ftpManagerDos[0].fFtpPasword = this.sat[0].fFtpPasword
          this.addModalData.ftpManagerDos[0].fFtpPort = this.sat[0].fFtpPort

          this.addModalData.ftpManagerDos[1].fFtpName = this.sat[1].fFtpName
          this.addModalData.ftpManagerDos[1].fFtpAddress = this.sat[1].fFtpAddress
          this.addModalData.ftpManagerDos[1].fFtpStorePath = this.sat[1].fFtpStorePath
          this.addModalData.ftpManagerDos[1].fFtpUserName = this.sat[1].fFtpUserName
          this.addModalData.ftpManagerDos[1].fFtpPasword = this.sat[1].fFtpPasword
          this.addModalData.ftpManagerDos[1].fFtpPort = this.sat[1].fFtpPort
        }

        // console.log("产品等级",this.sat)
      })
    }
  },
  activated () {
    this.initTree()
    this.getUserscrpge()
  },
  mounted () {
    this.modalOpen()
  }
}
</script>

<style>
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width:180px;
  }
  .addTableTaskz{
    position: absolute;
    top: 45px;
    left: 29px;
    font-size: 16px;
    color: #4da4fc;
  }
  .xin{
    color:red;
    font-size: 20px;
  }
  .spanIMG_Z{
    width: 5px;
    height: 16px;
    position: relative;
    top: -1px;
    margin-right: 4px;
  }
  .spanfooter{
    display: inline-block;
    width: 100%;
    padding: 16px;
    text-align: center;
  }
</style>
