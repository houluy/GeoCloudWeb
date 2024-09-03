import Vue from 'vue'
export const eventBus = new Vue()
export const HeartListern = class {
  constructor () {
    this.timer = 0
    this.intervalTime = 0
    this.testDivFlag = true
  }
  testStart (el, binding) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.testDivShow(el)
    }, binding.value.testTime)
  }
  testDivShow (el, intervalFail) {
    if (this.testDivFlag) return
    const title = intervalFail ? '网络连接超时,请尝试重新刷新页面' : '无操作时间过长,请重新输入密码'
    let height = document.getElementsByTagName('html')[0].clientHeight + 'px'
    let testBgStyle = {
      position: 'fixed',
      width: '100%',
      height,
      top: 0,
      background: 'rgba(0,0,0,.7)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    let titleStyle = {
      textAlign: 'center',
      color: '#fff',
      height: '30px',
      lineHeight: '30px',
      fontSize: '14px'
    }
    let testPassWord = Vue.extend({
      template: `<div class="testBg" id="myTestDiv" :style="testBgStyle">
        <div class="testPassDiv">
          <div :style="titleStyle">{{title}}</div>
          <el-input placeholder="请输入密码" inline v-model="input" show-password @change="enterPass" v-show="!intervalFail"></el-input>
        </div>
      </div>`,
      data () {
        return {
          input: '',
          testBgStyle,
          title,
          titleStyle,
          intervalFail
        }
      },
      mounted () {
        eventBus.$emit('logout')
      },
      methods: {
        enterPass () {
          eventBus.$emit('login', this.input)
        }
      }
    })
    let div = document.createElement('div')
    el.appendChild(div)
    new testPassWord().$mount(div)
    this.testDivFlag = true
  }
  timeIntervalStart (binding) {
    this.intervalTime ? clearInterval(this.intervalTime) : null
    this.intervalTime = setInterval(() => {
      eventBus.$emit('sendInterval')
    }, binding.value.interTime)
  }
  timeIntervalEnd () {
    clearInterval(this.intervalTime)
  }
}
