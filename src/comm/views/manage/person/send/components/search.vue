<template>
  <div class="searchDiv">
    <el-form :inline="true" :model="formInline" label-position="left" size="mini">
      <el-form-item label="任务名称">
        <el-input v-model="formInline.fTaskName"></el-input>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="formInline.fTaskStatus" clearable>
          <el-option label="待推送" value="0"></el-option>
          <el-option label="推送中" value="2"></el-option>
          <el-option label="暂停" value="4"></el-option>
          <el-option label="推送成功" value="6"></el-option>
          <el-option label="推送失败" value="8"></el-option>
          <el-option label="取消" value="10"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="接收单位">-->
        <!--<el-cascader-->
          <!--style="width: 100%"-->
          <!--expand-trigger="hover"-->
          <!--ref="cascaderAddr"-->
          <!--:props="{ checkStrictly: true }"-->
          <!--:options="fDistrictCodeAll"-->
          <!--clearable-->
          <!--@change="handleChange">-->
        <!--</el-cascader>-->
        <!--&lt;!&ndash;<el-select v-model="formInline.fDistrictCode" clearable>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-option :label="item.fCname" :value="item.fCode" v-for="item in fDistrictCodeAll" :key="item.fCode"></el-option>&ndash;&gt;-->
        <!--&lt;!&ndash;</el-select>&ndash;&gt;-->
      <!--</el-form-item>-->
      <el-form-item label="用户名称" prop="PronameData">
        <el-select class="select_name" v-model="formInline.fLoginUser" clearable  filterable placeholder="请选择">
          <el-option
            v-for="item in proName"
            :key="item.id"
            :label="item.name"
            :value="item.loginName">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推送开始时间">
        <el-date-picker
          v-model="formInline.fDataStartTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="推送结束时间">
        <el-date-picker
          v-model="formInline.fDataEndTime"
          type="date"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('one')">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('two')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '@comm/service/interface'
export default {
  data () {
    return {
      formInline: {
        fTaskName: '',
        fTaskStatus: '',
        fApplyuserunit: '',
        fDataStartTime: '',
        fLoginUser: '',
        fDataEndTime: ''
      },
      fDistrictCodeAll: [],
      proName: []
    }
  },
  props: ['getSearchData'],
  methods: {
    onSubmit (val) {
      // console.log(JSON.stringify(this.formInline))    测试时间少8小时问题
      if (val === 'one') {
        this.$emit('getSearchData', this.formInline)
      } else {
        this.formInline = {
          fTaskName: '',
          fTaskStatus: '',
          fDistrictName: '',
          fDataStartTime: '',
          fUserId: '',
          fDataEndTime: ''
        }
        this.$emit('getSearchData2', this.formInline)
      }
    },
    handleChange (value) {
      if (value.length > 0) {
        let diquName = this.$refs.cascaderAddr.getCheckedNodes()[0].pathLabels
        let diquName2 = diquName[diquName.length - 1]
        // let lastValue = value[value.length - 1]
        this.formInline.fApplyuserunit = diquName2
      } else if (value.length === 0) {
        this.formInline.fApplyuserunit = ''
      }
      // console.log(this.formInline.fDistrictName)
      // console.log(this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels)
    },
    initTree () {
      http.groupTree({pid: 0}).then(res => {
        this.fDistrictCodeAll = res.data
      })
    }
  },
  mounted () {
    // this.initTree()
    // http.userTable().then(res => {
    //   let arrName = []
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
    //   console.log(this.proName, 'this.proName')
    // })
    // http.listByCode({fCode: 100000, levels: [1]}).then(res => {
    //   this.fDistrictCodeAll = res.data
    // })
    http.listData().then(res => {
      let arrName = []
      console.log(res, '1244')
      res.data.list.forEach(item => {
        arrName.push({
          id: item.id,
          name: item.name,
          phoneMobile: item.phoneMobile,
          loginName: item.name
        })
      })
      this.proName = arrName
      console.log(this.proName, 'this.proName')
    })
  }
}
</script>

<style scoped>
.searchDiv{
  margin-top:10px;
}
.el-select, .el-input, .el-date-editor{
  width: 130px !important;;
}
</style>
