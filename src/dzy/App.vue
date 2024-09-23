<template>
  <!--<div id="app" v-myListener="this.myListenerDate">-->
  
  <div id="app"  @click="clickDiv">
  
 

    <!-- <router-view></router-view> -->
    <!-- 用户反馈界面 -->
    <!-- <survey></survey> -->
    <!-- 订单管理界面 -->
      <!-- <orderManage></orderManage> -->
    <!-- 订单详情界面 -->
      <orderDetail></orderDetail>
    
    <!-- 前端目录树 -->
    <!-- <newTreeZ></newTreeZ> -->
    
  </div>
</template>

<script>
import orderDetail from '../comm/views/manage/person/components/orderDetail.vue';
import newTreeZ from './views/search/components/newTreeZ.vue';
import orderManage from '../comm/views/manage/person/components/orderManage.vue';
import Survey from '../comm/components/Survey.vue';
  import http from '@comm/service/interface.js'
  import { setToken, getToken, removeToken } from '@comm/utils/auth'
  // import http from '@comm/service/interface.js'
  import { mapActions } from 'vuex'
  // import Hello from '../comm/components/hello.vue'

  // import { getToken, removeToken, setToken } from '@/utils/auth'
  // import { getGuid } from '@/utils/common.js'
  // import Cookies from 'js-cookie'
  export default {
    name: 'App',
    // components:{
    //     hello
    // },
    components:{
      Survey,
      orderManage,
      newTreeZ,
      orderDetail
    },
    provide () {

      return {
        reload: this.reload
      }
    },
    data () {
      return {
        myListenerDate: {
          testTime: 1000 * 60 * 30, // 监听时间
          interTime: 1000 * 6, // 心跳时间
          loginSucc: false, // 登录成功状态
          intervalFail: false // 心跳失败
        },
        beforeUnload_time: 0,
        gap_time: 0,
        isRouterAlive: true,
        lastTime: null, // 最后一次点击的时间
        currentTime: null, // 当前点击的时间
        timeOut: 1 * 86400 * 1000, // 设置超时时间:10分钟
        timeInterval: "",
        registerForm: {
          userId: '',
          name: '',
          uersName: '',
          password: '',
          againPass: '',
          optionsDvalue: '',
          email: '',
          postalAddress: '',
          Fax: '',
          Company: '',
          fixedTelephone: '',
          phoneMobile: '',
          identifyCodes: '1234567890',
          identifyCode: '',
          verifycode:'',
          verifycode1:''
        }
      }
    },
    mounted () {
      document.title = '遥感数据服务系统'
      // todo 内网关闭
      this.getTiemPvUv()
      sessionStorage.setItem('startTime_v', new Date().getTime())
      localStorage.setItem('userAgent', navigator.userAgent)
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      },
      getTokenData() {
        if (this.setTimeD === 1) {
          // clearInterval(this.timerData)
        } else {
          // this.timerData = setInterval(this.tokenLoad, 10000)
        }
      },
      ...mapActions('user',{
        LoginByUsername: 'LoginByUsername',
        GetUserInfo: 'GetUserInfo',
        setToken: 'setToken',
        GetNextMenu: 'GetNextMenu'
      }),
      ...mapActions('configManage',{
        getConfigSation: 'getConfigSation',
        getShopCarNum: 'getShopCarNum'
      }),
      ...mapActions('manage',{
        getRegularRules: 'getRegularRules',
        setMenuData: 'setMenuData',
        handlePerm: 'handlePerm'
      }),
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
      }),
      clickDiv() {
        // console.log("00000000000000")
        if (this.timeInterval == "") {
          // 5秒钟检测一次
          if(window.systemName === 'FW'){
            this.timeInterval = setInterval(this.isTimeOutFW, 2000);
          }
          if(window.systemName === 'DZY'){
            this.timeInterval = setInterval(this.isTimeOutDZY, 2000);
          }
        }
        this.lastTime = new Date().getTime();
      },

      removeCookie: function () {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf("=");
          const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        }
        if (cookies.length > 0) {
          for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            const domain = location.host.substr(location.host.indexOf("."));
            document.cookie =
              name +
              "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
              domain;
          }
        }
      },
      isTimeOutDZY() {

        this.currentTime = new Date().getTime(); // 当前时间
        // console.log(this.currentTime-this.lastTime,this.timeOut,"鼠标操作监测",this.currentTime - this.lastTime > this.timeOut)
        // 判断上次最后一次点击的时间和这次点击的时间间隔是否大于规定的时间,例:10分钟
        if (this.currentTime - this.lastTime > this.timeOut) {
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
          //判断是否为登录状态,只有登录状态下才调用方法
          sessionStorage.clear();
          clearInterval(this.timeInterval);
          this.timeInterval = "";
          //先返回首页,在给提示,可以根据具体需求调整
          this.$alert("检测到您长时间未操作页面,请重新登录!", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {
              let logName = localStorage.getItem('userName')
              console.log(logName, 'logName')
              http.logout({loginName: logName}).then(res => {
                http.deleteTokenByUserName({loginName: logName}).then(res => {
                  console.log(res, '09090900909')
                })
                this.isLogin = false
                localStorage.setItem('token', '')
                sessionStorage.setItem('token', '')
                localStorage.setItem('dzytoken', '')
                sessionStorage.setItem('dzytoken', '')

                setToken('')
                this.setToken(getToken())
                localStorage.removeItem('token')
                sessionStorage.removeItem('token')
                localStorage.removeItem('dzytoken')
                sessionStorage.removeItem('dzytoken')
                localStorage.setItem('userName', '')
                localStorage.setItem('authorities', '')

                this.setTimeD = 1
                this.getTokenData()
                // this.resetForm('ruleForm')
                this.$router.push({path: '/search'})
                this.userName = null
                this.setMenuData([])
                localStorage.clear()
                sessionStorage.clear()
                window.location.href = 'https://geocloudsso.cgs.gov.cn/ssoserver/login/loginout'
                this.removeCookie()
              },(resp) => {
                console.log(resp, '0000000')
              }),
                http.getUserInfo().then(response => {
                  let data = response.data
                  _this.arr = []
                  data.authorities.forEach(item => {
                    _this.arr.push(item.authority)
                  })
                  localStorage.setItem('authorities', JSON.stringify(_this.arr))
                  localStorage.setItem('userName', usr.data.loginName)
                  localStorage.setItem('loginName', usr.data.loginName)
                  localStorage.setItem('userNameShow', usr.data.name)
                  localStorage.setItem('principalUserID', JSON.stringify(data))
                  localStorage.setItem('isAudited',data.isAudited)
                  _this.userName = usr.data.loginName
                  _this.userNameShow = usr.data.name
                  _this.isLogin = true
                  _this.arr.forEach(item => {
                    _this.hasPerm(item)
                  })
                  // 用户管理权限
                  localStorage.setItem('rightFlag', true)
                  localStorage.setItem('userName', JSON.parse(data.principal).userName)
                  localStorage.setItem('id', JSON.parse(data.principal).id)
                  sessionStorage.setItem('userId', JSON.parse(data.principal).userId)
                  localStorage.setItem('userId', JSON.parse(data.principal).userId)
                  localStorage.setItem('roleIds', JSON.parse(data.principal).roleIds)
                  _this.userName = JSON.parse(data.principal).userName
                  _this.isLogin = true
                  _this.getLog()
                  _this.dialogVisible = false
                  if (localStorage.getItem('roleIds').indexOf('管理员') > -1) {
                    this.$router.push({path: '/manage/person/orderManage_stayAudit'})
                  }

                })
            }
          })
        }

      },
      isTimeOutFW() {

        this.currentTime = new Date().getTime(); // 当前时间
        // console.log(this.currentTime-this.lastTime,this.timeOut,"鼠标操作监测",this.currentTime - this.lastTime > this.timeOut)
        // 判断上次最后一次点击的时间和这次点击的时间间隔是否大于规定的时间,例:10分钟
        if (this.currentTime - this.lastTime > this.timeOut) {
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
          //判断是否为登录状态,只有登录状态下才调用方法
          sessionStorage.clear();
          clearInterval(this.timeInterval);
          this.timeInterval = "";
          //先返回首页,在给提示,可以根据具体需求调整
          this.$alert("检测到您长时间未操作页面,请重新登录!", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {
              let logName = localStorage.getItem('userName')
              console.log(logName, 'logName')
              http.logout({loginName: logName}).then(res => {
                http.deleteTokenByUserName({loginName: logName}).then(res => {
                  console.log(res, '09090900909')
                })
                this.isLogin = false
                localStorage.setItem('token', '')
                sessionStorage.setItem('token', '')
                localStorage.setItem('dzytoken', '')
                sessionStorage.setItem('dzytoken', '')

                setToken('')
                this.setToken(getToken())
                localStorage.removeItem('token')
                sessionStorage.removeItem('token')
                localStorage.removeItem('dzytoken')
                sessionStorage.removeItem('dzytoken')
                localStorage.setItem('userName', '')
                localStorage.setItem('authorities', '')


                this.setTimeD = 1
                this.getTokenData()
                // this.resetForm('ruleForm')

                this.$router.push({path: '/search'})
                this.userName = null
                this.setMenuData([])


                localStorage.clear()
                sessionStorage.clear()
                this.removeCookie()
                this.$router.go(0)

              })
              http.getUserInfo().then(response => {
                let data = response.data
                let _this = this
                _this.arr = []
                data.authorities.forEach(item => {
                  _this.arr.push(item.authority)
                })
                localStorage.setItem('authorities', JSON.stringify(_this.arr))
                localStorage.setItem('userName', usr.data.loginName)
                localStorage.setItem('loginName', usr.data.loginName)
                localStorage.setItem('userNameShow', usr.data.name)
                localStorage.setItem('principalUserID', JSON.stringify(data))
                localStorage.setItem('isAudited',data.isAudited)
                _this.userName = usr.data.loginName
                _this.userNameShow = usr.data.name
                _this.isLogin = true
                _this.arr.forEach(item => {
                  _this.hasPerm(item)
                })
                // 用户管理权限
                localStorage.setItem('rightFlag', true)
                localStorage.setItem('userName', JSON.parse(data.principal).userName)
                localStorage.setItem('id', JSON.parse(data.principal).id)
                sessionStorage.setItem('userId', JSON.parse(data.principal).userId)
                localStorage.setItem('userId', JSON.parse(data.principal).userId)
                localStorage.setItem('roleIds', JSON.parse(data.principal).roleIds)
                _this.userName = JSON.parse(data.principal).userName
                _this.isLogin = true
                _this.getLog()
                _this.dialogVisible = false
                if (localStorage.getItem('roleIds').indexOf('管理员') > -1) {
                  this.$router.push({path: '/manage/person/orderManage_stayAudit'})
                }
              })
            }
          })
        }
      },
    },
    created () {
      // this.eventStart()
      // if (getToken() && getToken() !== 'undefined') {
      // 获取系统心跳时间
      // this.getSysFrequencyValue().then(item => {
      //   this.myListenerDate = {...this.myListenerDate, loginSucc: true, intervalFail: false, interTime: item.interTime, testTime: item.logoutTime}
      // })
      // }
      // this.insertVisitLog()
      this.clickDiv()
    },
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
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  body .el-table th.gutter {
    display: table-cell !important
  }
</style>
