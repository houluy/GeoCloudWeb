import Vue from 'vue'
import { HeartListern, eventBus } from '../eventBus.js'
let heartListern = null
export default {
  bind (el, binding, vnode) {
    heartListern = new HeartListern()
    heartListern.testStart(el, binding)
  },
  inserted (el, binding, vnode) {
    el.addEventListener('mousemove', () => heartListern.testStart(el, binding), true)
    el.addEventListener('click', () => heartListern.testStart(el, binding), true)
    window.document.addEventListener('keydown', () => heartListern.testStart(el, binding), true)
  },
  update (el, binding, vnode) {
    // 登录成功/注销
    if (binding.value.loginSucc) {
      let myTestDiv = document.getElementById('myTestDiv')
      if (myTestDiv) el.removeChild(myTestDiv)
      heartListern.testDivFlag = false
      heartListern.timeIntervalStart(binding)
    } else {
      heartListern.testDivFlag = true
      heartListern.timeIntervalEnd()
    }
    // 发送心跳失败
    if (binding.value.intervalFail) {
      heartListern.timeIntervalEnd()
      heartListern.testDivShow(el, binding.value.intervalFail)
    }
  },
  componentUpdated (el, binding, vnode) {},
  unbind (el, binding, vnode) {}
}
