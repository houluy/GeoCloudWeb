<template>
  <div class="total">
    <div  class = "totalFirst">
     <div class="personInfo">个人信息 </div>
     <div class="touxiangIcon">
     <img  src="@/assets/img/touxiang.png" alt=""></div>
     <div class="rightInfo">
     <!-- <div class="AdminImg">Admin <img  width="100%" height="100%" src="@/assets/img/admin.png" alt="">管理员</div> -->
     <div class="infoPerson">
      <ul >
        <li>真实姓名：{{this.userInfo.name}}</li>
        <li>昵称：{{this.userInfo.nickName}}</li>
        <!--<li>性别：{{this.userInfo.sex}}</li>-->
      </ul>
     </div>
    <div class="infoContact">
    <ul>
      <li>联系电话：{{this.userInfo.phoneMobile}}</li>
      <li>邮箱：{{this.userInfo.email}}</li>
    </ul>
    </div>
    </div>
    </div>
    <div class = "totalSecond">
    <div class="personInfo">订单概览 </div>
    <div class="infoOrder">
    <ul>
      <li><img  src="@/assets/img/orderDone.png" alt="">已完成订单（{{this.orderWc}}）</li>
      <li><img  src="@/assets/img/orderDing.png" alt="">处理中订单（{{this.orderCl}}）</li>
      <li><img  src="@/assets/img/orderCheck.png" alt="">待审核订单（{{this.orderDs}}）</li>
      <li><img  src="@/assets/img/orderFail.png" alt="">失败订单（{{this.orderSb}}）</li>
    </ul>
    </div>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
export default {
  data () {
    return {
      userInfo: '',
      orderWc: '',
      orderCl: '',
      orderDs: '',
      orderSb: ''

    }
  },
  methods: {
    getUserInfo () {
      http.userGetById().then(res => {
        if (res.data) {
          if (res.data.sex === 1) {
            res.data.sex = '男'
          } else if (res.data.sex === 0) {
            res.data.sex = '女'
          } else {
            res.data.sex = '-'
          }
        }
        this.userInfo = res.data
      })
    },
    getOrderData () {
      http.getOrderStatis().then(res => {
        console.log(res)
        if (res.data) {
          res.data.forEach(item => {
            if (item.orderStatus === 0) {
              this.orderDs = item.orderNum
            } else if (item.orderStatus === 4) {
              this.orderWc = item.orderNum
            } else if (item.orderStatus === 5) {
              this.orderSb = item.orderNum
            } else if (item.orderStatus === 3) {
              this.orderCl = item.orderNum
            }
          })
        }
      })
    }
  },
  mounted () {
    this.getUserInfo()
    //this.getOrderData()
  }
}
</script>

<style scoped>

.total{
  height: 100%;
  width: 100%
}

.totalFirst {
  height: 4rem;
  border:1px solid lightgray;
  margin-bottom :5%;
  width: 99%;
}

.totalSecond{
  height: 4rem;
  float: left;
  border: 1px solid lightgray;
  width: 99%;
  display: none;
}

.personInfo{
  font-size: .5rem;
  margin-top: .5rem;
  margin-bottom:.2rem ;
  margin-left: .2rem
}
.touxiangIcon{
  margin-top: .5rem;
  margin-left: .5rem;
  float: left;
  width: 10%;
  height: 50%;
}
.rightInfo{
  float: left; ;
}
.AdminImg{
  margin: 0.4rem;
  font-size: .4rem;
}
.infoPerson ul li{
  font-size: .3rem;
  line-height: .1rem;
  float: left;
  margin-left: .2rem;
  margin-right: .8rem;
  margin-top: .2rem;
  margin-bottom:.3rem
}
.infoOrder ul li{
  font-size: .3rem;
  line-height: .1rem;
  float: left;
  margin-left: .4rem;
  margin-right: .3rem;
  margin-top: .3rem
}
.infoContact ul li{
  font-size: .3rem;
  line-height: .1rem;
  float: left;
  margin-left: .2rem;
  margin-right: .8rem;
  margin-top: .3rem
}
img{
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
</style>
