<template>
  <div class="personalInformation">
    <span class="personalInformationTitle">个人信息预览</span>
    <el-form :model="numberValidateForm" :rules="rules3" ref="numberValidateForm" label-width="110px" :inline="true" class="demo-form-inline">
       <el-form-item label="登录账号" prop="loginName" >
        <el-input v-model="numberValidateForm.loginName"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="name" >
        <el-input v-model="numberValidateForm.name"></el-input>
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickName">
        <el-input v-model="numberValidateForm.nickName"></el-input>
      </el-form-item>
      <!--<el-form-item label="性 别" prop ="sex">-->
        <!--<el-select v-model="numberValidateForm.sex" placeholder="请选择证件类型">-->
          <!--<el-option label="男" value="1"></el-option>-->
          <!--<el-option label="女" value="0"></el-option>-->
        <!--</el-select>-->
      <!--</el-form-item>-->
      <el-form-item label="证件类型" prop="credentialsType">
      <el-select @change="changeData" v-model="numberValidateForm.credentialsType" placeholder="请选择证件类型">
       <el-option label="身份证" value="身份证"></el-option>
       <el-option label="护照" value="护照"></el-option>
       <el-option label="军官证" value="军官证"></el-option>
      </el-select>
      </el-form-item>
      <el-form-item label="证件号码"  prop="IDNumeber">
        <el-input v-model="numberValidateForm.IDNumeber"></el-input>
      </el-form-item>
      <el-form-item label="办公电话" prop="homeNumber">
        <el-input v-model="numberValidateForm.homeNumber"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneMobile">
      <el-input v-model="numberValidateForm.phoneMobile"></el-input>
      </el-form-item>
      <el-form-item label="邮箱地址"  prop="email">
        <el-input v-model="numberValidateForm.email"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" pro= "address">
        <el-input v-model="numberValidateForm.address"></el-input>
      </el-form-item>
      <!--<div class="" style="text-align: right;">-->
        <!--<el-button style="margin-right:.2rem;" @click="getUserInfo"  >取消</el-button>-->
        <!--<el-button style="margin-right: 1rem;" type="primary" @click="onSubmit">保存</el-button>-->
      <!--</div>-->
    </el-form>
  </div>
</template>

<script>

import http from '@comm/service/interface.js'

export default {
  data () {
    var validateChangeEmail = (rule, value, callback) => {
      var regPass = new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$')
      if (regPass.test(value) === '') {
        callback(new Error('请输入新邮箱'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的邮箱地址'))
        }
      }
    }
    // eslint-disable-next-line no-unused-vars
    var validateChangeID = (rule, value, callback) => {
      let type = this.changeD
      var regPass = ''
      if (type === '身份证') {
        regPass = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/
      } else if (type === '护照') {
        regPass = /^([a-zA-z]|[0-9]){5,17}$/
      } else if (type === '军官证') {
        regPass = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/
      }
      if (regPass.test(value) === '') {
        callback(new Error('请输入新信息'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的' + type + '信息'))
        }
      }
    }
    var validateChangePhone = (rule, value, callback) => {
      var regPass = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (regPass.test(value) === '') {
        callback(new Error('请输入新电话号码'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的电话号码'))
        }
      }
    }
    var validateChangeHomeNumber = (rule, value, callback) => {
      var regPass = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/
      if (regPass.test(value) === '') {
        callback(new Error('请输入新电话号码'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的固定号码'))
        }
      }
    }
    return {
      numberValidateForm: {
        nickName: '',
        name: '',
        phoneMobile: '',
        loginName: '',
        email: '',
        credentialsType: '',
        IDNumeber: '',
        id: '',
        sex: '',
        address: '',
        homeNumber: ''
      },
      changeD: '',
      rules3: {
        email: [
          { validator: validateChangeEmail, trigger: 'blur' },
          { min: 8, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        IDNumeber: [
          { validator: validateChangeID, trigger: 'blur' },
          { min: 8, message: '请输入正确的证件信息', trigger: ['blur', 'change'] }
        ],
        phoneMobile: [
          { validator: validateChangePhone, trigger: 'blur' },
          { min: 8, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ],
        homeNumber: [
          { validator: validateChangeHomeNumber, trigger: 'blur' },
          { min: 8, message: '请输入正确的固定号码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    changeData (val) {
      this.changeD = val
    },
    getUserInfo () {
      http.userGetById().then(res => {
        if(res.data) {
          if(res.data.sex === 1) {
            res.data.sex = '男'
          } else {
            res.data.sex = '女'
          }
        }
        this.numberValidateForm = res.data
      })
    },
    onSubmit () {
      http.userAlter({name: this.numberValidateForm.name, nickName: this.numberValidateForm.nickName, phoneMobile: this.numberValidateForm.phoneMobile, email: this.numberValidateForm.email, address: this.numberValidateForm.address
      }).then(res => {
        if (res.data === 'true') {
          // this.$message({
          //   message: '保存成功！',
          //   type: 'success'
          // })
          this.$notify({

            message: '保存成功！',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          this.getUserInfo()
          this.dialogVisible = false
        } else {
          // this.$message.error('新增失败！')
          this.$notify.error({
            message: '新增失败！',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
    }
  },
  mounted () {
    this.getUserInfo()
  }

}
</script>

<style scoped>
.personalInformation{
  width: 100%;
  height: 100%;
}
.personalInformationTitle{
 width: 100%;
 height: 1rem;
 display: inline-block;
 line-height: 1rem;
 font-size: .34rem;
 padding-left: .2rem;
 border-bottom: 1px solid #ccc;
}
.el-form-item{
  margin-top: .4rem;
}
.el-form-item>>>.el-input__inner{
  width: 5.5rem;
}
</style>
