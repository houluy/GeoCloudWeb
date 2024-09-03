<template>
<div style="height: 40px; width: 100%; background-color: #4978F1 !important; text-align: center">
  <el-menu class="el-menu-demo" :default-active="activeMenu" mode="horizontal" @select="handleSelect" router text-color="black">
    <el-menu-item :index="item.href" v-for="item in navData" :key="item.href">{{item.label}}</el-menu-item>
  </el-menu>
</div>
</template>

<script>
// import http from '@comm/service/interface.js'
// import { getToken, removeToken } from '@/utils/auth'
import {
  mapState, mapActions
} from 'vuex'
export default {
  data () {
    return {
      navData: [],
      activeMenu: '/search',
      navDataShowOnA: [
        // {label: '首页', href: '/home', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        {label: '数据订购', href: '/search', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        // {label: '用户中心', href: '/manage/person/shopCar', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        // {label: '产品介绍', href: '/productIntro', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        {label: '用户指南', href: '/userGuide', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        {label: '联系我们', href: '/contactUs', iconPath1: JSON.stringify(['检索.png', '检索no.png'])}
      ],
      navDataShow: [
        // {label: '首页', href: '/home', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        {label: '数据订购', href: '/search', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        {label: '用户中心', href: '/manage/person/shopCar', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        // {label: '产品介绍', href: '/productIntro', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        {label: '用户指南', href: '/userGuide', iconPath1: JSON.stringify(['检索.png', '检索no.png'])},
        {label: '联系我们', href: '/contactUs', iconPath1: JSON.stringify(['检索.png', '检索no.png'])}
      ]
    }
  },
  props: {
    // activeMenu: String,
    required: true
  },
  methods: {
    handleSelect (path) {
      this.$router.push(path)
      this.activeMenu = path
    },
    ...mapActions('searchStore', {
      setSpanLabel: 'setSpanLabel'
    })
  },
  computed: {
    ...mapState('searchStore', {
      showPXFlag (state) {
        return state.showPXFlag
      }
    }),
    ...mapState('user', {
      token: (state) => {
        return state.token
      }
    }),
    ...mapState('manage', {
      menuData: (state) => {
        return state.menuData
      }
    })
  },
  mounted () {
    if (this.$route.path.indexOf('/manage/person') > -1) {
      this.activeMenu = '/manage/person/shopCar'
    } else {
      this.navDataShow.forEach(item => {
        if (item.href === this.$route.path) {
          this.activeMenu = item.href
        }
      })
    }
  },
  watch: {
    $route (to, from) {
      if (to.fullPath.indexOf('/manage/person') > -1) {
        this.activeMenu = '/manage/person/shopCar'
      } else {
        this.activeMenu = to.fullPath
      }
    },
    token (val) {
      if (!val) {
        this.navData = this.navDataShowOnA
      }
    },
    menuData: {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.navData = newVal[0].children
        } else {
          this.navData = this.navDataShowOnA
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="scss">
.el-menu--horizontal>.el-menu-item {
  height: 40px;
  line-height: 40px;
  /*margin-left: 5%;*/
  text-align: center;
  font-size: 18px;
}

ul {
  /*padding-left: 1%;*/
  /*width: 100%;*/
  background-color: #4978F1;
  /*margin-left: 10%;*/
  display: inline-block;
  text-align: center;
}

.is-active {
  color: #2e6dfc !important;
}
.el-menu-demo{
  .el-menu-item{
    &:hover{
      background:linear-gradient(360deg,rgba(0,152,249,0.1) 0%,rgba(0,133,217,0) 100%);
      border-bottom-color: #fff !important;
    }
    &{
      background-color: #4978F1 !important;
      font-weight: bold;
      width: 13vw !important;
      text-align: center !important;
    }
    &.is-active{
      background:linear-gradient(360deg,rgba(62, 102, 205, 1) 0%,rgba(62, 102, 205,.5) 100%);
      border-bottom-color: #1D42A1 !important;
      font-weight: bold;
    }
    color: #fff !important;
  }
}
</style>
