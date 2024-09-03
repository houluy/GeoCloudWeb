<template>
<div id="layout" @mousemove="moveEvent" @click="moveEvent">
  <HeaderFW ref="cyHeader" v-if="!this.navHide" />
  <NavFW :activeMenu="activeMenu" v-show="!this.navHide" />
  <cy-main />
  <cy-map v-if="mapFlag" />
</div>
</template>

<script>
import cyMain from '@comm/views/Layout/components/cy-main'
import cyMap from '@comm/views/Layout/components/cy-map.vue'
import HeaderFW from './components/Header_FW.vue'
import NavFW from './components/Nav_FW.vue'
import { getToken, setToken } from '@comm/utils/auth'
import http from '@comm/service/interface.js'
import {
  mapState
} from 'vuex'
import {
  gisMap
} from '@comm/map/map_globel.js'
export default {
  name: 'layout',
  components: {
    cyMain,
    cyMap,
    HeaderFW,
    NavFW,
  },
  data () {
    return {
      mapFlag: true,
      timmer: null,
      activeMenu: '/search',
      dialogFlag: false,
      showClose: true,
      headerTextFlag: false,
      parampath: ''
    }
  },
  mounted () {
     // this.getTokenData()
  },
  computed: {
    ...mapState('searchStore', {
      navHide: function (state) {
        return state.navHide
      }
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.mapFlag = to.name === 'search'
      vm.activeMenu = '/' + to.name
    })
  },
  beforeRouteUpdate (to, from, next) {
    // console.log('update' + to.fullPath)
    this.mapFlag = to.name === 'search'
    this.activeMenu = '/' + to.name
    // gisMap.clearAllFeatures()
    next()
  },
  methods: {
    handleLogin (val) {
      // this.dialogFlag = val
    },
    moveEvent () {
      // if (this.dialogFlag) {
      //   clearTimeout(this.timmer)
      // } else {
      //   clearTimeout(this.timmer)
      //   this.init()
      // }
    },
    init () {
      // this.timmer = setTimeout(() => {
      //   this.dialogFlag = true
      //   this.showClose = false
      //   this.headerTextFlag = true
      // }, 30 * 60 * 1000)
    },
    // 进入页面获取token
    getTokenData () {
      console.log(1241325346)
      let search = window.location.search// 获取本地url  http://ip:/search
      let param = this.GetRequest(search)// 获取四个参数 aoth

      if (param.state) {
        this.parampath = param.state
      }
      // 校验若newToken标识不存在则设置token为空
      // if (!param.newToken) {
      //   setToken('')
      // }
      let token = getToken()
      console.log(token, 'token')
      // console.log(param.code, 'param.code')
      if (token) {
        // 初始化用户和菜单
        this.$nextTick(() => {
          this.$refs['cyHeader'].initGetUserName()// 初始化用户信息？
        })
        // sessionStorage.setItem('token', token)
        // this.$refs['cyHeader'].getLog()
      }
      /* 如果不存在token和code
          则获取请求授权码地址并跳转至该地址
      */
      if (!token && !param.code) {
        http.getCodeData().then(res => { // 获取code
          if (res.data) {
            let url = window.location.href
            window.location.href = res.data + '&state=' + url
          }
        })
      } else if (param.code) {
        /* token不存在且授权码存在
           则请求后端获取token并把token存储到document.cookie中
           并跳转至用户最终请求的地址
        */
        http.getTokenData({ code: param.code }).then(res => {
          if (res.data) {
            setToken(res.data)
            sessionStorage.setItem('token', res.data)
            var redirectUrl = this.parampath
            // 设置连接符
            var splicingSymbol = redirectUrl.indexOf('?') === -1 ? '?' : '&'
            window.location.href = redirectUrl + splicingSymbol + 'newToken=true'
          } else {
            this.$message({
              message: '获取token失败！',
              type: 'warning'
            })
          }
        })
      }
    },
    GetRequest (url) { // 获取url中"?"符后的字串
      var theRequest = {}
      if (url.indexOf('?') !== -1) {
        var str = url.substr(1)
        var strs = str.split('&')
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
        }
      }
      return theRequest
    }
  },
  watch: {
    // dialogFlag (val) {
    //   this.dialogFlag = val
    // }
  }
}
</script>

<style scoped>
#layout {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
