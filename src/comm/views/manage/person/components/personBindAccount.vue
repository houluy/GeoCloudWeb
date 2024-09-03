<template>
  <div class="bindAccount">
    <span class="personBinding">账号绑定</span>
    <div class="personCenterMessage">
      <div class="personIcon" style="display: inline-block;">
        <img width="100%" height="100%" src="@/assets/img/safety.png" alt="">
      </div>
      <div class="personText" style="display: inline-block;">
        <span style="font-size: .32rem;font-weight: bold;">
          密码
        </span>
        <span style="font-size: .24rem;">
           已设置
        </span>
        <p style="font-size: .28rem;color: #A8A8A8;">
          用于保护账号信息和登录安全
        </p>
      </div>
      <div class="personButton">
        <!--<el-button @click="changePasswordButton" round style="margin-top: -.4rem;">修改</el-button>-->
      </div>
    </div>
    <div class="personCenterMessage">
      <div class="personIcon" style="display: inline-block;">
        <img width="100%" height="100%" src="@/assets/img/email.png" alt="">
      </div>
      <div class="personText" style="display: inline-block;">
        <span style="font-size: .32rem;font-weight: bold;">
          邮箱
        </span>
        <span style="font-size: .24rem;">
           {{this.userInfo.email}}
        </span>
        <span style="font-size: .24rem;">
           已绑定
        </span>
        <p style="font-size: .28rem;color: #A8A8A8;">
          可用邮箱加密码登录，可用邮箱找回密码
        </p>
    </div>
    <el-dialog title="修改密码" :visible.sync="changePasswordDialogVisible" width="30%" >
      <el-form  :model="changePassword" status-icon :rules="rules3" ref="changePasswordPass" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPW">
          <el-input type="password" v-model="changePassword.oldPW"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPW">
          <el-input type="password" v-model="changePassword.newPW" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPW">
          <el-input type="password" v-model="changePassword.confirmPW" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button type="primary" @click="confirmChange('changePasswordPass')">确认</el-button>
          <el-button @click="resetForm('changePasswordPass')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <div class="personButton">
      <!--<el-button @click="changeEmailButton = true" round style="margin-top: -.4rem;">更改</el-button>-->
      <el-dialog title="修改邮箱" :visible.sync="changeEmailButton" width="30%" >
        <el-form  :model="changePassword" status-icon :rules="rules3" ref="changePassword" label-width="100px" class="demo-ruleForm" >
          <el-form-item label="新邮箱" prop="newEmail">
            <el-input  v-model="changePassword.newEmail"  placeholder="请输入新的邮箱" ></el-input>
          </el-form-item>
          <el-form-item style="text-align: right;">
            <el-button type="primary" @click="confirmChangeEmail">确认</el-button>
            <el-button @click="resetForm('changePassword')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
    </div>
    <div class="personCenterMessage">
      <div class="personIcon" style="display: inline-block;">
        <img width="100%" height="100%" src="@/assets/img/phone.png" alt="">
      </div>
      <div class="personText" style="display: inline-block;">
        <span style="font-size: .32rem;font-weight: bold;">
           手机
        </span>
        <span style="font-size: .24rem;color: #EF1817;">
           {{this.userInfo.phoneMobile}}
        </span>
        <p style="font-size: .28rem;color: #A8A8A8;">
          可用手机号加密码登录，可通过手机号找回密码
        </p>
      </div>
      <div class="personButton">
        <!--<el-button @click="changePhoneButton = true" round style="margin-top: -.4rem;">更改</el-button>-->
        <el-dialog title="修改手机号码" :visible.sync="changePhoneButton" width="30%" >
          <el-form :model="changePassword" status-icon :rules="rules3" ref="changePassword" label-width="100px" class="demo-ruleForm">
            <el-form-item label="新手机号码"  prop="newPhone">
              <el-input  v-model="changePassword.newPhone"  placeholder="请输入新手机号码"></el-input>
            </el-form-item>
             <el-form-item style="text-align: right;">
              <el-button type="primary" @click="confirmChangePhone">确认</el-button>
              <el-button @click="resetForm('changePassword')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import { mapState } from 'vuex'
export default {
  data () {
    // var validateChangeOldPass = (rule, value, callback) => {
    //   var regPass = new RegExp('this.getRegularData.REGEX_PASSWORD')
    //   if (regPass.test(value) === '') {
    //     callback(new Error('请输入原密码'))
    //   } else {
    //     if (regPass.test(value)) {
    //       callback()
    //     } else {
    //       callback(new Error('请输入正确的密码, 包含大写字母、小写字母和数字'))
    //     }
    //   }
    // }
    var validateChangePass = (rule, value, callback) => {
      var regPass = new RegExp(this.getRegularData.REGEX_PASSWORD)
      if (regPass.test(value) === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的密码, 包含大写字母、小写字母和数字'))
        }
      }
    }
    var validateConfirmPass = (rule, value, callback) => {
      var regPass = new RegExp(this.getRegularData.REGEX_PASSWORD)
      if (regPass.test(value) === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.changePassword.newPW) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        if (regPass.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的密码, 包含大写字母、小写字母和数字'))
        }
      }
    }
    var validateChangeEmail = (rule, value, callback) => {
      var regPass = new RegExp(this.getRegularData.REGEX_EMAIL)
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
    var validateChangePhone = (rule, value, callback) => {
      var regPass = new RegExp(this.getRegularData.REGEX_MOBILE)
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
    return {
      changePhoneButton: false,
      changeEmailButton: false,
      changePasswordDialogVisible: false,
      getRegularData: null,
      changePassword: {
        oldPW: '',
        newPW: '',
        confirmPW: '',
        newEmail: '',
        newPhone: ''
      },
      userInfo: '',
      rules3: {
        // oldPW: [
        //   { validator: validateChangeOldPass, trigger: 'blur' },
        //   { min: 8, message: '长度最少为8位,不能超过20位', trigger: 'blur' }
        // ],
        newPW: [
          { validator: validateChangePass, trigger: 'blur' },
          { min: 8, message: '长度最少为8位,不能超过20位', trigger: 'blur' }
        ],
        confirmPW: [
          { validator: validateConfirmPass, trigger: 'blur' },
          { min: 8, message: '长度最少为8位,不能超过20位', trigger: 'blur' }
        ],
        newEmail: [
          { validator: validateChangeEmail, trigger: 'blur' },
          { min: 8, message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        newPhone: [
          { validator: validateChangePhone, trigger: 'blur' },
          { min: 11, message: '请输入正确的电话号码', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  computed: {
    // ...mapState('manage', {
    //   getRegularData (state) {
    //     console.log(state.regularData)
    //     return state.regularData
    //   }
    // })
  },
  methods: {
    getUserInfo () {
      http.userGetById().then(res => {
        console.log(res)
        if (res.data) {
          if(res.data.sex === 1) {
            res.data.sex = '男'
          } else {
            res.data.sex = '女'
          }
        }
        this.userInfo = res.data
      })
    },
    changePasswordButton () {
      this.changePasswordDialogVisible = true
    },
    confirmChange (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          http.changePassword({oldPassWord: this.changePassword.oldPW, newPassword: this.changePassword.newPW}).then(res => {
            console.log(res,'8080808080')
            if (res.data === 'true') {
              // this.$message({
              //   message: ' 修改成功！',
              //   type: 'success'
              // })
              this.$notify({

                message: '修改成功！',
                position: 'bottom-right',
                duration: 1500,
                type: 'success'
              })
              this.changePasswordDialogVisible = false
            } else {
              // this.$message.error('修改失败！')
              this.$notify.error({
                message: '修改失败！',
                position: 'bottom-right',
                duration: 0
              })
            }
          })
        }
      })
    },
    confirmChangePhone () {
      http.changePassword({newPhone: this.changePassword.newPhone}).then(res => {
        if (res.data === 'true') {
          // this.$message({
          //   message: ' 修改成功！',
          //   type: 'success'
          // })
          this.$notify({

            message: '修改成功！',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          this.changePhoneButton = false
        } else {
          // this.$message.error('修改失败！')
          this.$notify.error({
            message: '修改失败！',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
    },
    confirmChangeEmail () {
      http.changePassword({newEmail: this.changePassword.newEmail}).then(res => {
        if (res.data === 'true') {
          // this.$message({
          //   message: ' 修改成功！',
          //   type: 'success'
          // })
          this.$notify({

            message: '修改成功！',
            position: 'bottom-right',
            duration: 1500,
            type: 'success'
          })
          this.changeEmailButton = false
        } else {
          // this.$message.error('修改失败！')
          this.$notify.error({
            message: '修改失败！',
            position: 'bottom-right',
            duration: 0
          })
        }
      })
    },
    // 充值修改密码框
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getRegularData = JSON.parse(localStorage.getItem('regularRules'))
    })
    this.getUserInfo()
  }
}
</script>

<style scoped>
.bindAccount{
  width: 100%;
  height: 100%;
}
.personBinding{
 width: 100%;
 height: 1rem;
 display: inline-block;
 line-height: 1rem;
 font-size: .34rem;
 padding-left: .2rem;
 border-bottom: 1px solid #ccc;
}
.personCenterMessage{
 width: 95%;
 height: 2rem;
 padding-left: .3rem;
 border-bottom: 1px solid #ccc;
 overflow: hidden;
}
.personCenterMessage .personIcon{
 height: 1rem;
 vertical-align: bottom;
}
.personCenterMessage .personIcon img{
 width: .4rem;
 height: .4rem;
 margin-top: .1rem;
 margin-right: .1rem;
}
.personCenterMessage .personText{
 height: 1rem;
 margin-top: .8rem;
}
.personCenterMessage .personButton{
 float: right;
 margin-top: 1rem;
 margin-right: .4rem;
 display: inline-block;
}
.personCenterMessageIcon{
 width: .6rem;
 height: .7rem;
 font-size: .48rem;
}
</style>
