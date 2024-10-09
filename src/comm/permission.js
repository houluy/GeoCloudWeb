import router from '@/router'
// import store from './store/index.js'
import {
  Message
} from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
import {
  getToken
} from '@comm/utils/auth' // getToken from cookie

// NProgress.configure({
//   showSpinner: false
// }) // NProgress Configuration

// permission judge function
// function hasPermission (roles, permissionRoles) {
//   if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
//   if (!permissionRoles) return true
//   return roles.some(role => permissionRoles.indexOf(role) >= 0)
// }

const whiteList1 = '/search' // no redirect whitelist
const whiteList2 = '/userGuide' // no redirect whitelist
const whiteList3 = '/contactUs' // no redirect whitelist
const whiteList4 = '/offLineDisk'

router.beforeEach((to, from, next) => {
  console.log(to.path,from.path)
  // debugger
  const token = getToken()
  // NProgress.start() // start progress bar
  // 如果未匹配到路由
  if (to.matched.length === 0) {
    // Message.error('无效路由！')
    // next()
    router.push('/forbidden')
  } else {
    if (token !== '' && token !== null && token !== 'undefined' && token !== undefined) {
      next()
    } else {
      if (to.path === whiteList1 || to.path === whiteList2 || to.path === whiteList3 || to.path === whiteList4) {
        next()
      } else {
        // next()
        next(whiteList1)
        // Message({
        //   type: 'error',
        //   showClose: true,
        //   message: '没有权限，请登录！',
        //   duration: 3000,
        //   onClose: () => {
        //     next(whiteList)
        //   }
        // })
      }
    }
  }
})

router.afterEach(() => {
  // NProgress.done() // finish progress bar
})
