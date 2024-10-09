import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout'
import CyMain from '@comm/views/Layout/components/cy-main'
// import router from "../../gxfw/router";
import http from '@comm/service/interface.js'
// import SurveyLink from '../../comm/components/SurveyLink.vue'
// import SurveyPage from '../../comm/components/SurveyPage.vue'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'Layout',
    component: Layout,
    redirect: '/search',
    children: [
      {
        path: '/search',
        name: 'search',
        component: () =>
          import('@/views/search/index.vue')
      },
      {
        path: '/contactUs',
        name: 'contactUs',
        component: () =>
          import('@/views/contactUs/index.vue')
      },
      {
        path: '/offLineDisk',
        name: 'offLineDisk',
        component: () =>
          import('@/views/disk/index.vue')
      },
      {
        path: '/userGuide',
        name: 'userGuide',
        component: () =>
          import('@/views/userGuide/index.vue')
      },
      {
        path: '/person',
        name: 'person',
        component: () =>
          import('@comm/views/manage/person'),
        children: [{
          path: 'personDetail',
          name: 'personDetail',
          component: () =>
            import('@comm/views/manage/person/components/personDetail')
        },
        {
          path: '/',
          name: '',
          component: () =>
              import('@comm/views/manage/person/components/personDetail')
        }
        ]
      },
      {
        path: '/manage',
        name: 'manage',
        component: CyMain,
        redirect: '/manage/person',
        children: [
          {
            path: 'person',
            name: 'person',
            component: () => import('@comm/views/manage/person'),
            children: [
              {
                path: 'shopCarCreateOrder',
                name: 'shopCarCreateOrder',
                component: () => import('@comm/views/manage/person/components/shopCarCreateOrder')
              },
              {
                path: 'personDetail',
                name: 'personDetail',
                component: () => import('@comm/views/manage/person/components/personDetail')
              },
              {
                path: 'directoryConfig',
                name: 'directoryConfig',
                component: () => import('@comm/views/manage/person/dataRelease/directoryConfig')
              },
              {
                path: 'fieldConfig',
                name: 'fieldConfig',
                component: () => import('@comm/views/manage/person/dataRelease/fieldConfig')
              },
              {
                path: 'shopCar',
                name: 'shopCar',
                component: () => import('@comm/views/manage/person/components/shopCar')
              },
              {
                path: 'orderManage',
                name: 'orderManage',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_stayAudit',
                name: 'orderManage_stayAudit',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_staySubmit',
                name: 'orderManage_staySubmit',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_dataReadyFinish',
                name: 'orderManage_dataReadyFinish',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_completeAudit',
                name: 'orderManage_completeAudit',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_feedback',
                name: 'orderManage_feedback',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_onAudit',
                name: 'orderManage_onAudit',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_pastAudit',
                name: 'orderManage_pastAudit',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_unusualAudit',
                name: 'orderManage_unusualAudit',
                component: () => import('@comm/views/manage/person/components/orderManage')
              },
              {
                path: 'orderManage_details',
                name: 'orderManage_details',
                component: () => import('@comm/views/manage/person/components/orderDetail')
              },
              {
                path: 'orderManage_useraddressDetails',
                name: 'orderManage_useraddressDetails',
                component: () => import('@comm/views/manage/person/components/useraddressDetail')
              },
              {
                path: 'subscriberManage',
                name: 'subscriberManage',
                component: () =>
                  import('@comm/views/manage/person/components/subscriberManage')
              },
              {
                path: 'createSubscriptionOrder',
                name: 'createSubscriptionOrder',
                component: () =>
                  import('@comm/views/manage/person/components/createSubscriptionOrder')
              },
              {
                path: 'send',
                name: 'send',
                component: () =>
                  import('@comm/views/manage/person/send')
              },
              {
                path: 'orderSetPriority',
                name: 'orderSetPriority',
                component: () =>
                  import('@comm/views/manage/person/orderSetPriority')
              },
              {
                path: 'dataTask',
                name: 'dataTask',
                component: () =>
                  import('@comm/views/manage/person/dataTask')
              },
              {
                path: 'dataSyncDb',
                name: 'dataSyncDb',
                component: () =>
                  import('@comm/views/manage/person/dataSyncDb/SyncDb')
              },
              {
                path: 'dataSyncTask',
                name: 'dataSyncTask',
                component: () =>
                  import('@comm/views/manage/person/dataSyncTask/index')
              },
              {
                path: 'ordercompStat',
                name: 'ordercompStat',
                component: () =>
                  import('@comm/views/manage/person/statisticsModule/ordercompStat')
              },
              {
                path: 'dataReceiveStat',
                name: 'dataReceiveStat',
                component: () =>
                  import('@comm/views/manage/person/statisticsModule/dataReceiveStat')
              },
              {
                path: 'metadataExport',
                name: 'metadataExport',
                component: () =>
                  import('@comm/views/manage/person/statisticsModule/metadataExport')
              },
              {
                path: 'coverArea',
                name: 'coverArea',
                component: () =>
                  import('@comm/views/manage/person/statisticsModule/coverArea')
              },

              {
                path: 'dataDownStat',
                name: 'dataDownStat',
                component: () =>
                  import('@comm/views/manage/person/statisticsModule/dataDownStat')
              },
              {
                path: 'userBehavioStat',
                name: 'userBehavioStat',
                component: () =>
                  import('@comm/views/manage/person/statisticsModule/userBehavioStat')
              },
              {
                path: 'createReporder',
                name: 'createReporder',
                component: () =>
                  import('@comm/views/manage/person/reporder/createReporder')
              },
              {
                path: 'repOrderManage',
                name: 'repOrderManage',
                component: () =>
                  import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderManage_stayAudit_rep',
                name: 'orderManage_stayAudit_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderManage_staySubmit_rep',
                name: 'orderManage_staySubmit_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderManage_dataReadyFinish_rep',
                name: 'orderManage_dataReadyFinish_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderManage_completeAudit_rep',
                name: 'orderManage_completeAudit_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderManage_onAudit_rep',
                name: 'orderManage_onAudit_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderManage_pastAudit_rep',
                name: 'orderManage_pastAudit_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderDetail_rep',
                name: 'orderDetail_rep',
                component: () => import('@comm/views/manage/person/reporder/orderDetail_rep')
              },
              {
                path: 'orderManage_unusualAudit_rep',
                name: 'orderManage_unusualAudit_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'orderManage_details_rep',
                name: 'orderManage_details_rep',
                component: () => import('@comm/views/manage/person/reporder/repOrderManage')
              },
              {
                path: 'dataModal',
                name: 'dataModal',
                component: () =>
                  import('@comm/views/manage/person/components/data-modal.vue')
              },
              {
                path: 'user',
                name: 'user',
                component: () =>
                  import('@comm/views/manage/user')
              },
              {
                path: 'role',
                name: 'role',
                component: () =>
                  import('@comm/views/manage/role')
              },
              {
                path: 'department',
                name: 'department',
                component: () =>
                  import('@comm/views/manage/department')
              },
              {
                path: 'power',
                name: 'power',
                component: () =>
                  import('@comm/views/manage/power')
              },
              {
                path: 'log',
                name: 'log',
                component: () =>
                  import('@comm/views/manage/log')
              }
            ]
          },
          {
            path: '/shopCarCreateProcessOrder',
            name: 'shopCarCreateProcessOrder',
            component: () =>
              import('@comm/views/manage/person/components/shopCarCreateProcessOrder')
          },
          {
            path: 'configManage',
            name: 'configManage',
            component: () =>
              import('@comm/views/manage/configManage/index.vue')
          }
        ]
      }
    ]
  }, {
    path: '/error',
    name: 'error',
    component: () => import('@comm/components/error_z.vue')
  },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () =>
        import('@comm/components/403.vue')
    }]
})
router.beforeEach((to, from, next) => {
  // http.getAgrsCatalogTree().then(res => {
  //   if (to.name === 'error') {
  //     // router.push({path: '/search'})
  //     window.location.href = 'http://geocloudsso.cgs.gov.cn/ssoserver/moc2/authorize?response_type=code&client_id=HYZXGFv2020&redirect_uri=http://geogf.agrs.cn/search&state=http://geogf.agrs.cn/search'
  //   }
  // }).catch((err) => {
  //   router.push({path: '/error'})
  // })
  next()
})
export default router
