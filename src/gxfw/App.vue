<template>
  <!--<div id="app" v-myListener="this.myListenerDate">-->
  <div id="app">
    <!--<router-views v-if="isRouterAlive"></router-views>-->
    <router-view />
  </div>
</template>

<script>
// import { eventBus } from '@/directives/eventBus.js'
// import http from '@comm/service/interface.js'
import { mapActions } from 'vuex'
// import { getToken, removeToken, setToken } from '@/utils/auth'
// import { getGuid } from '@/utils/common.js'
// import Cookies from 'js-cookie'
export default {
  name: 'App',
  data () {
    return {
      myListenerDate: {
        testTime: 1000 * 60 * 30, // 监听时间
        interTime: 1000 * 6, // 心跳时间
        loginSucc: false, // 登录成功状态
        intervalFail: false // 心跳失败
      },
      beforeUnload_time: 0,
      gap_time: 0
    }
  },
  mounted () {
    document.title = '信息共享与服务网'
    // todo 内网关闭
    this.getTiemPvUv()
    sessionStorage.setItem('startTime_v', new Date().getTime())
    localStorage.setItem('userAgent', navigator.userAgent)
  },
  methods: {
    getTiemPvUv: function () {
      // 记录用户进入系统和刷新时间
      window.onbeforeunload = (event) => {
        this.onload_handler()
        var e = event || window.event
        e.returnValue = ''// 这里可以放置你想做的操作代码
      }
    },
    onload_handler () {
      console.log(1234)
      if (sessionStorage.getItem('startTime_v') !== 'null') {
        this.commonPvzh.postDataPVuVcommonMe({
          fUserid: localStorage.getItem('userId'),
          fClientip: localStorage.getItem('returnCitySNIp'),
          fReceiveendtime: new Date().getTime(),
          fReceivestarttime: parseInt(sessionStorage.getItem('startTime_v')),
          fUseragent: localStorage.getItem('userAgent'),
          fDetailurl: window.location.href,
          fBehaviortype: 6
        })
      }
    },
    ...mapActions('searchStore', {
      setRouterData: 'setRouterData'
    })
  },
  // created () {
  // this.eventStart()
  // if (getToken() && getToken() !== 'undefined') {
  // 获取系统心跳时间
  // this.getSysFrequencyValue().then(item => {
  //   this.myListenerDate = {...this.myListenerDate, loginSucc: true, intervalFail: false, interTime: item.interTime, testTime: item.logoutTime}
  // })
  // }
  // this.insertVisitLog()
  // },
  // computed: {
  //   ...mapState('user', {
  //     token: (state) => {
  //       return state.token
  //     }
  //   })
  // }
  watch: {
    // 全局监听路由变化
    $route: {
      handler (val, oldVal) {
        this.setRouterData(val.name)
      },
      // 深度观察监听
      deep: true
    }
    //   token () {
    //     if (this.token) {
    //       this.getSysFrequencyValue().then(item => {
    //         this.myListenerDate = {...this.myListenerDate, loginSucc: true, interTime: item.interTime, testTime: item.logoutTime}
    //       })
    //     } else {
    //       this.getSysFrequencyValue().then(item => {
    //         this.myListenerDate = {...this.myListenerDate, loginSucc: false, intervalFail: false, interTime: item.interTime, testTime: item.logoutTime}
    //       })
    //     }
    //   }
  }
  // methods: {
  //   insertVisitLog () {
  //     // 插入访问记录，统计 通过cookie 计算当天的记录，不然不更新
  //     let visitIP = Cookies.get('visitIP')
  //     if (visitIP != null) {
  //     } else {
  //       let curDate = new Date()
  //       let curTamp = curDate.getTime()
  //       // 当日凌晨的时间戳,减去一毫秒是为了防止后续得到的时间不会达到00:00:00的状态
  //       let curWeeHours = new Date(curDate.toLocaleDateString()).getTime() - 1
  //       // 当日已经过去的时间（毫秒）
  //       let passedTamp = curTamp - curWeeHours
  //       // 当日剩余时间
  //       let leftTamp = 24 * 60 * 60 * 1000 - passedTamp
  //       let leftTime = new Date()
  //       leftTime.setTime(leftTamp + curTamp)
  //       // 创建cookie
  //       visitIP = getGuid()
  //       Cookies.set('visitIP', visitIP, { 'expires': leftTime }) // 24小时不变
  //     }
  //     let uuidMAC = getGuid()
  //     let param = {
  //       'ip': visitIP,
  //       'mac': uuidMAC
  //     }
  //     http.insertVisitLog(param).then(res => { // 提交记录
  //     })
  //   },
  //   // getSysFrequencyValue () {
  //   //   let self = this
  //   //   var p = new Promise(function (resolve, reject) {
  //   //     // 做一些异步操作
  //   //     http.sysGetSysInfoByKey({'key': 'frequency'}).then(res => {
  //   //       let interTime = Number(res.data.sysValue || 0)
  //   //       if (interTime < 999) {
  //   //         interTime = 1000
  //   //       }
  //   //       http.sysGetSysInfoByKey({'key': 'logoutTime'}).then(res => {
  //   //         let logoutTime = Number(res.data.sysValue || 0)
  //   //         if (logoutTime < 999) {
  //   //           logoutTime = 1000 * 60 * 20
  //   //         }
  //   //         resolve({'interTime': interTime, 'logoutTime': logoutTime })
  //   //       })
  //   //     })
  //   //   })
  //   //   return p
  //   // },
  //   eventStart () {
  //     // 注销事件
  //     eventBus.$on('logout', (type) => {
  //       // removeToken()
  //       // this.setToken(getToken())
  //       http.logout().then(res => {
  //         removeToken()
  //         this.setToken(getToken())
  //         // localStorage.removeItem('token')
  //         // this.setToken(localStorage.getItem('token'))
  //         // localStorage.setItem('userName', '')
  //         // localStorage.setItem('authorities', '')
  //         // this.$router.push({path: '/search'})
  //         this.myListenerDate = {...this.myListenerDate, loginSucc: false, intervalFail: false}
  //       })
  //       // 调用注销用户接口
  //     })
  //     // 登录事件
  //     eventBus.$on('login', (type) => {
  //       let account = localStorage.getItem('userId')
  //       this.LoginByUsername({account, pass: type}).then(res => {
  //         this.myListenerDate = {...this.myListenerDate, loginSucc: true}
  //       })
  //       // 调用登录用户接口，重新设置cookie，成功的回调中设置myListenerDate.success为true
  //     })
  //     eventBus.$on('sendInterval', () => {
  //       http.getFrequency().then(res => {
  //       }).catch(err => {
  //         this.myListenerDate = {...this.myListenerDate, intervalFail: true}
  //       })
  //       // 调用心跳接口事件 如果失败的话设置myListenerDate.intervalFail为true
  //     })
  //   },
  //   ...mapActions('user', {
  //     LoginByUsername: 'LoginByUsername',
  //     setToken: 'setToken'
  //   })
  // }
}
</script>

<style>
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    font-family: MicrosoftYaHei;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body .el-table th.gutter {
    display: table-cell !important
  }
  #mytitle {
    position: absolute;
    color: #ffffff;
    font-size: 14px;
    padding: 4px;
    background: rgba(40, 40, 40, 0.8);
    border-radius:5px;
    z-index:999;
  }
</style>
