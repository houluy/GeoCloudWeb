<template>
  <div class="passDialog">
    <el-dialog
      title="密码验证"
      :visible.sync="flag"
      width="30%"
      modal
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="密码验证">
          <el-input @keyup.enter.native="submitPassForm('form')" type="password" v-model="form.pass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitcancel">取 消</el-button>
        <el-button type="primary" @click="submitPassForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  // props: {
  //   passDialogVisible: {
  //     type: Boolean,
  //     default: false
  //   },
  //   passReset: {
  //     type: Boolean,
  //     default: false
  //   }
  // },
  props: ['passDialogVisible', 'passReset', 'passWordApproveFlag'],
  data () {
    return {
      form: {
        pass: ''
      },
      flag: false,
      passResetFlag: false,
      passWordApprove: false
    }
  },
  watch: {
    passDialogVisible: {
      handler (newval, oldval) {
        this.flag = newval
      },
      deep: true,
      immediate: true
    },
    passReset (val) {
      this.passResetFlag = val
    },
    passWordApproveFlag (val) {
      this.passWordApprove = val
    }
  },
  methods: {
    submitcancel () {
      this.flag = false
      this.form.pass = ''
      this.$emit('passDialogData', false, this.flag, false)
    },
    submitPassForm (formName) {
      let account = sessionStorage.getItem('userId')
      this.LoginByUsername({account, pass: this.form.pass}).then(res => {
        this.$notify({
          title: '成功',
          message: '密码验证成功',
          type: 'success'
        })
        this.flag = false
        this.form.pass = ''
        this.$emit('passDialogData', this.passWordApprove, this.flag, this.passResetFlag)
      })
    },
    ...mapActions('user', {
      LoginByUsername: 'LoginByUsername',
      setToken: 'setToken'
    })
  }
}
</script>

<style lang="scss" scoped>
.passDialog{
  .el-notification{
    z-index: 9999;
  }
}
</style>
