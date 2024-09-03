<template>
  <div ref="personCenter" class="personCenter">
    <div style="width: 13%;float:left;" v-if="this.show_left">
          <div class="personCenter_left">
            <div class="accountNumber">
              <el-menu
                :default-active="indexD"
                :unique-opened="trueD"
                router
                class="el-menu-vertical-demo"
                background-color="#EDF1FD"
                style="border: none;">
                <template :index="item.href" v-for="(item, index) in orderManageMenu">
                  <el-submenu :key="index" v-if="item.children" :index="item.href" >
                    <template slot="title">
                      <img style="margin-right: 7px;" :src="item.iconPath === undefined ? '' :  '/static/' + JSON.parse(item.iconPath)[0]" />
                      <span>{{item.label}}</span>
                    </template>
                    <el-menu-item @click="selectChange(e)" :key="eindex" :index="e.href" v-for="(e, eindex) in item.children">
                      <span style="display: inline-block; margin-right: 5px; width: 6px; height: 6px; border-radius: 4px; background-color: #bccdf8;"></span>
                      <span>{{e.label}}</span>
                    </el-menu-item>
                  </el-submenu>
                  <el-menu-item class="onChildrenClass" @click="selectChange(item)" :key="index" v-else-if="!item.children" :index="item.href">
                    <img style="margin-right: 7px;" :src="item.iconPath === undefined ? '' :  '/static/' + JSON.parse(item.iconPath)[0]"/>
                    <span>{{item.label}}</span>
                  </el-menu-item>
                </template>
              </el-menu>
            </div>
          </div>
        </div>
    <div style="width: 87%; float: left;" id="personCenter_right_w">
      <div class="personCenter_right" v-if="isRouterAlive">
            <div class="personCenter_right_t" v-if="show_left">
              <img :src="spanIMG" alt="">
              <span>{{spanLabelD === '查询与展示配置' ? '展示字段配置' : spanLabelD}}</span>
            </div>
            <!--<keep-alive>-->
            <router-view :key="$route.path"></router-view>
            <!--</keep-alive>-->
             <!--<personalInformation v-show="index === 'personalInformation'"/> -->
      </div>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import {mapState, mapActions} from 'vuex'
export default {
  data () {
    return {
      show_left: true,
      trueD: true,
      isRouterAlive: true,
      spanLabelD: '购物车',
      activeIndex: null,
      name: '',
      // index: '/manage/person/orderManage',
      indexD: '',
      activeName: 'first',
      loginName: '',
      spanIMG: require('@/assets/img/spanIMG.png'),
      orderManageMenu: [],
      orderManageMenuD: [
        {label: '购物车4', href: '/manage/person/shopCar', imgSrc: require('@/assets/img/dinddangwc.png')},
        {label: '个人中心', href: '/manage/person/personDetail', imgSrc: require('@/assets/img/personimg.png')},

        {label: '订阅订单管理',
          href: '/manage/person/createSubscriptionOrder_z',
          imgSrc: require('@/assets/img/dingdanCJ.png'),
          children: [
            {label: '订阅订单创建', href: '/manage/person/createSubscriptionOrder', imgSrc: '@/assets/img/orderManage.png'},
            {label: '订阅订单信息', href: '/manage/person/send', imgSrc: '@/assets/img/orderManage.png'}

          ]
        },
        // {label: '我的信息', href: '/manage/person/personDetail1', imgSrc: '@/assets/img/shopCar.png', children: []},创建订阅订单
        {label: '已有产品订单',
          href: '/manage/person/orderManagez',
          imgSrc: require('@/assets/img/dingdangl.png'),
          children: [
            {label: '全部订单', href: '/manage/person/orderManage', imgSrc: '@/assets/img/orderManage.png'},
            {label: '待提交订单', href: '/manage/person/orderManage_staySubmit', imgSrc: '@/assets/img/orderManage.png'},
            {label: '待审核订单', href: '/manage/person/orderManage_stayAudit', imgSrc: '@/assets/img/orderManage.png'},
            {label: '审核通过订单', href: '/manage/person/orderManage_pastAudit', imgSrc: '@/assets/img/orderManage.png'},
            {label: '数据准备完成订单', href: '/manage/person/orderManage_dataReadyFinish', imgSrc: '@/assets/img/orderManage.png'},
            {label: '已完成订单', href: '/manage/person/orderManage_completeAudit', imgSrc: '@/assets/img/orderManage.png'},
            {label: '审核未通过订单', href: '/manage/person/orderManage_onAudit', imgSrc: '@/assets/img/orderManage.png'},
            {label: '状态异常订单', href: '/manage/person/orderManage_unusualAudit', imgSrc: '@/assets/img/orderManage.png'}
            // {label: '订单详情 ', href: '/manage/person/orderManage_details', imgSrc: '@/assets/img/orderManage.png'}
          ]},
        {label: '再加工订单',
          href: '/manage/person/repOrderManage',
          imgSrc: require('@/assets/img/dingdangl.png'),
          children: [
            {label: '全部订单', href: '/manage/person/repOrderManage', imgSrc: '@/assets/img/orderManage.png'},
            {label: '待提交订单', href: '/manage/person/orderManage_staySubmit_rep', imgSrc: '@/assets/img/orderManage.png'},
            {label: '待审核订单', href: '/manage/person/orderManage_stayAudit_rep', imgSrc: '@/assets/img/orderManage.png'},
            {label: '审核通过订单', href: '/manage/person/orderManage_pastAudit_rep', imgSrc: '@/assets/img/orderManage.png'},
            {label: '数据准备完成订单', href: '/manage/person/orderManage_dataReadyFinish_rep', imgSrc: '@/assets/img/orderManage.png'},
            {label: '已完成订单', href: '/manage/person/orderManage_completeAudit_rep', imgSrc: '@/assets/img/orderManage.png'},
            {label: '审核未通过订单', href: '/manage/person/orderManage_onAudit_rep', imgSrc: '@/assets/img/orderManage.png'},
            {label: '状态异常订单', href: '/manage/person/orderManage_unusualAudit_rep', imgSrc: '@/assets/img/orderManage.png'}
            // {label: '订单详情 ', href: '/manage/person/orderManage_details', imgSrc: '@/assets/img/orderManage.png'}
          ]},
        // {label: '系统配置',
        //   href: '/manage/person/orderManagee',
        //   imgSrc: require('@/assets/img/xitongpeizhi.png'),
        //   children: [
        //     {label: '订单审核设置', href: '/manage/person/orderManage11', imgSrc: '@/assets/img/orderManage.png'},
        //     {label: '在线下载设置', href: '/manage/person/orderManage12', imgSrc: '@/assets/img/orderManage.png'},
        //     {label: '用户设置', href: '/manage/person/orderManage13', imgSrc: '@/assets/img/orderManage.png'},
        //     {label: '产品介绍设置', href: '/manage/person/orderManage14', imgSrc: '@/assets/img/orderManage.png'},
        //     {label: '文件共享设置', href: '/manage/person/orderManage15', imgSrc: '@/assets/img/orderManage.png'},
        //     {label: '新闻管理 ', href: '/manage/person/orderManage16', imgSrc: '@/assets/img/orderManage.png'},
        //     {label: '用途管理 ', href: '/manage/person/orderManage17', imgSrc: '@/assets/img/orderManage.png'}
        //   ]},
        {label: '系统管理',
          href: '/manage/person/',
          imgSrc: require('@/assets/img/xitonggl.png'),
          children: [
            {label: '订阅用户管理', href: '/manage/person/subscriberManage', imgSrc: '@/assets/img/orderManage.png'},
            {label: '机构用户管理', href: '/manage/person/user', imgSrc: '@/assets/img/orderManage.png'},
            {label: '角色管理', href: '/manage/person/role', imgSrc: '@/assets/img/orderManage.png'},
            {label: '部门管理', href: '/manage/person/department', imgSrc: '@/assets/img/orderManage.png'},
            {label: '日志统计', href: '/manage/person/log', imgSrc: '@/assets/img/orderManage.png'},
            {label: '功能管理', href: '/manage/person/power', imgSrc: '@/assets/img/orderManage.png'}
          ]},
        {label: '数据任务',
          href: '/manage/person/dataTask', imgSrc: require('@/assets/img/dingdangl.png')
        },
        // {label: '数据任务',
        //   href: '/manage/person/dataSyncTask', imgSrc: require('@/assets/img/dingdangl.png')
        // }
        // {label: '数据统计',
        //   href: '/manage/person/statisticsModule_con',
        //   imgSrc: require('@/assets/img/xitonggl.png'),
        //   children: [
        //     {label: '订单完成情况统计', href: '/manage/person/ordercompStat', imgSrc: '@/assets/img/dataDownStat.png'},
        //     {label: '下载数据情况统计', href: '/manage/person/dataDownStat', imgSrc: '@/assets/img/dataDownStat.png'}
        //     {label: '用户行为分析统计', href: '/manage/person/userBehavioStat', imgSrc: '@/assets/img/dataDownStat.png'}
        //   ]}
      ]
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    },
    getPathAndLabel (val) {
      if (val) {
        this.orderManageMenu.forEach(item => {
          if (item.href === val) {
            this.indexD = item.href
            this.spanLabelD = item.label
          } else {
            if (item.children && item.children.length > 0) {
              item.children.forEach(eitem => {
                if (eitem.href === val) {
                  this.indexD = eitem.href
                  this.spanLabelD = eitem.label
                }
              })
            }
          }
        })
      }
    },
    selectChange (val) {
      console.log(val, '已反馈订单')
      this.spanLabelD = val.label
      this.setSpanLabel(val.label)
      this.indexD = val.href
      localStorage.setItem('spanLabelD', this.spanLabelD)
    },
    getMenuD () {
      http.getMenu({parentId: '1085417713933684699', subSysId: '1085417713933684711'}).then(res => {
        let arrD = []
        if (res.data && res.data.length > 0) {
          res.data[0].children.forEach(item => {
            if (item.label === '用户中心') {
              item.children.forEach(e => {
                // if (e.label === '数据发布配置') {
                //   e.children[1].label = '展示字段配置'
                // }
                if (e.href) {
                  arrD.push(e)
                }
              })
            }
          })
          // console.log(arrD, 'arrD')
          this.orderManageMenu = arrD
          this.getPathAndLabel(this.$route.path)
        } else {
          this.orderManageMenu = []
        }
      })
    },
    getRouter (val) {
      if (document.getElementById('personCenter_right_w')) {
        if (val === '/manage/person/shopCarCreateOrder' || val === '/manage/person/createReporder') {
          this.show_left = false
          document.getElementById('personCenter_right_w').style.width = '100%'
        } else {
          this.show_left = true
          document.getElementById('personCenter_right_w').style.width = '87%'
        }
      }
    },
    ...mapActions('searchStore', {
      setSpanLabel: 'setSpanLabel'
    })
  },
  computed: {
    ...mapState({
      routerPath: function (state) {
        return state.manage.routerPath
      }
    }),
    ...mapState('searchStore', {
      spanLabel: function (state) {
        return state.spanLabel
      }
    }),
    ...mapState('manage', {
      menuData: (state) => {
        return state.menuData
      }
    })
  },
  watch: {
    // routerPath (val) {
    //   console.log(val, '12312431251')
    //   this.index = val
    //   // if(val === 'person'){
    //   //   this.index = '/manage/person/personDetail'
    //   // }
    // },
    $route: {
      handler (val, oldVal) {
        this.getMenuD()
        this.$nextTick(() => {
          this.getRouter(val.fullPath)
        })
      },
      // 深度观察监听
      deep: true
    },
    // spanLabel: {
    //   handler (newval, oldVal) {
    //     if (newval) {
    //       this.orderManageMenu.forEach(item => {
    //         if (item.label === newval) {
    //           this.indexD = item.href
    //           this.spanLabelD = item.label
    //         } else {
    //           if (item.children && item.children.length > 0) {
    //             item.children.forEach(e => {
    //               if (e.label === newval) {
    //                 this.indexD = e.href
    //                 this.spanLabelD = e.label
    //               }
    //             })
    //           }
    //         }
    //       })
    //     }
    //   },
    //   // 深度观察监听
    //   deep: true
    // },
    menuData: {
      handler (newVal, oldVal) {
        let arr = []
        if (newVal.length > 0) {
          newVal[0].children.forEach(item => {
            if (item.label === '用户中心') {
              item.children.forEach(e => {
                if (e.href) {
                  arr.push(e)
                }
              })
            }
          })
          this.orderManageMenu = arr
        } else {
          this.orderManageMenu = []
          // this.navData = this.navDataShowOnA
        }
      },
      deep: true
    }
  },
  mounted () {
    // 路由不刷新问题=====
    // this.reload()
    // ==================
    if (localStorage.getItem('userName') !== null) {
      this.loginName = ',' + localStorage.getItem('userName')
    } if (localStorage.getItem('spanLabelD') !== null) {
      this.spanLabelD = localStorage.getItem('spanLabelD')
    }
    this.indexD = this.$route.path
    this.getMenuD()
    this.getRouter(this.indexD)
    // this.$nextTick(() => {
    //   this.getMenuD()
    //   this.getRouter(this.indexD)
    // })
  }
}
</script>

<style scoped lang="scss">
  @import '@/assets/css/global.scss';
  .personCenter_right_t img{
    height: 33%;
    width: 5px;
    margin-right: 7px;
    position: relative;
    top: -1px;
  }
  .personCenter_right_t span{
    display: inline-block;
    font-weight: bold;
  }
.personCenter{
  position: relative;
  width: 100vw;
  /*margin-top: .2rem;*/
}
.personCenter_left{
  height: $ordermenuH;
  overflow: hidden;
  background-color: #EDF1FD;
  overflow-y: auto;
  padding-top: 25px;
}
.personCenter_left .personImg{
  width: 2rem;
  height: 2rem;
  margin-top: .7rem;
  border: 4px solid #ccc;
  border-radius: 50%;
  margin-left: .72rem;
  position: relative;
}
/* .personCenter_left .accountNumber{

} */
.personCenter_left .personName, .personCenter_left .personIcons{
  margin-top: .2rem;
}
.personCenter_left .personImg img{
  border-radius: 50%;
}
.personCenter_left .personIcons img{
  width: .4rem;
  height: .4rem;
  background-color: #fff;
  margin-left: .2rem;
  display: inline-block;
  line-height: .4rem;
  text-align: center;
}
.personCenter_right{
  overflow: hidden;
  background: #FAFAFA;
  height: $orderResultH;
  padding: 0 1vw 2vh 1vw;
  overflow-y: auto;
}
.personCenter_right_t{
  width: 100%;
  height: 46px;
  line-height: 46px;
}
.accountNumberTitle{
  text-align: left;
  font-size: .32rem;
  font-weight: 500;
}
.accountNumber>>>.el-menu-item.is-active{
  background-color: #8AA8F6 !important;
  color: #FFF !important;
}
.accountNumber>>>.el-menu-item{
  height: 40px !important;
  line-height: 40px !important;
}
.accountNumber>>> .el-submenu__title {
  font-size: 14px !important;
}
.accountNumber>>>.onChildrenClass{
  font-weight: bold;
}
.accountNumber>>>.is-opened .el-submenu__title{
  background-color: #EDF1FD !important;
  color: #303133 !important
}
/*.accountNumber>>>.is-opened .el-menu-item {*/
  /*background-color: #F7F9FC !important;*/
  /*!*color: #FFF !important*!*/
/*}*/
.accountNumber>>>.is-opened .el-menu-item .is-active {
  background-color: #8AA8F6 !important;
  /*color: #FFF !important*/
}
.accountNumber>>>.el-submenu__title{
  height: 40px !important;
  line-height: 40px !important;
  font-weight: bold;
}
.personalTitle{
  font-size: .8rem
}
.totalTitle{
  height: 1.2rem;
}
.personalTitle{
  margin: .1rem;
}
.totalMain{
 height: 100%;
}
.el-tabs__header {
    background-color: rgba(255,255,255,.5) !important;
}

.el-tabs__header .el-tabs__item {
    color: #3d94ec !important;
}
</style>

