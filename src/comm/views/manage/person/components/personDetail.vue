<template>
  <div class= "totalMain">
    <el-tabs v-model="activeName">
      <el-tab-pane label="总览" name="first">
        <totalInfo />
      </el-tab-pane>
      <el-tab-pane label="个人信息" name="second">
        <personalInformation />
      </el-tab-pane>
      <el-tab-pane label="账户安全" name="third">
        <personBindAccount />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import personBindAccount from './personBindAccount'
import personalInformation from './personalInformation'
import totalInfo from './totalInfo'
export default {
  components: {personBindAccount, personalInformation, totalInfo},
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    getUserInfo () {
      http.userGetById().then(res => {
        this.userInfo = res.data
      })
    }
  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang="scss" scoped>
.totalMain{
  height: 87%;
}
.el-tabs__header {
    background-color: rgba(255,255,255,.5) !important;
}

.el-tabs__header .el-tabs__item {
    color: #3d94ec !important;
}
</style>
