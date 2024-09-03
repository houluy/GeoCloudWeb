// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@comm/directives'
import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
import router from './router'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/reset.css'
import store from '../comm/store'
import echarts from 'echarts'
import 'swiper/dist/css/swiper.css'
import '@comm/permission.js'
// 引用公共方法
import commonMethod from '@comm/static/commonMethod'
import commonPvzh from '@comm/static/commonPvzh'
import commonMZ from '@comm/static/commonMZ'
import searchStore from '@comm/store/modules/searchStore.js'
import {hasPermission, changeFixedPageSizeZ, formatTime} from '@comm/utils/hasPermission'
// 文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import animate from 'animate.css'
// 图片查看器
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import deepClone from '../comm/utils/deepClone.js'
Vue.prototype.deepClone = deepClone
// 注册指令
// import * as directives from './directives'
// Object.keys(directives).forEach(k => Vue.directive(k, directives[k]))

// Vue.use(myListener)
// import $ from 'jquery'

Vue.use(animate)
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
Vue.use(Element, {
  size: 'small',
  zIndex: 3000
})
Vue.use(VueQuillEditor)

Vue.prototype.commonMethod = commonMethod
Vue.prototype.commonPvzh = commonPvzh
Vue.prototype.commonMZ = commonMZ
Vue.prototype.hasPerm = hasPermission
Vue.prototype.changeFixedPageSizeZ = changeFixedPageSizeZ
Vue.prototype.formatTime = formatTime
router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.query.navHide) {
    searchStore.state.navHide = to.query.navHide
  } else {
    searchStore.state.navHide = false
  }
  next()
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
// 图片查看器默认配置
Vue.use(Viewer) // 默认配置写法
Viewer.setDefaults({
  defaultOptions: {
    zIndex: 999999
  }
  // Options: {
  //   'inline': false,
  //   'button': false,
  //   'navbar': 0,
  //   'title': false,
  //   'toolbar': false,
  //   'tooltip': false,
  //   'movable': false,
  //   'zoomable': false,
  //   'rotatable': false,
  //   'scalable': false,
  //   'transition': false,
  //   'fullscreen': false,
  //   'keyboard': false,
  //   'url': 'data-source'
  // }
})
