<template>
   <div>
     <el-row class="footer_buttom">
       <el-col class="footerLeft">
         <div class="logoTitle">
           <img src='@/assets/images/headerImg/log.png' style="margin-top: 15%;">
           <div v-show="showF === 'FW'" class="title5">信息共享与服务网</div>
           <div v-show="showF === 'DZY'" class="title5">地质云</div>
         </div>
       </el-col>
       <el-col class="footerRight">
         <div class="logoTitle1">
           <div class="callUs">
             <span class="words">联系我们</span>
             <div :class="[item.id===1 ? 'address1' : 'address']" :key="index" v-for="(item, index) in addressImg">
               <img :src='item.Img'>
               <span style="margin-left: 2%">{{item.info}}</span>
             </div>
           </div>
           <div class="addressMap">
             <img class="banner" src='@/assets/homeImg/map.png'>
           </div>
         </div>
       </el-col>
       <div class="versionInfo">
         <span>版权所有：中国自然资源航空物探遥感中心      &nbsp;&nbsp;&nbsp;备案序号：京ICP备 05055290 号      &nbsp;&nbsp;&nbsp;技术支持：信息中心 (010-62060075) </span>
       </div>
     </el-row>
   </div>
</template>

<script>
export default {
  name: 'footCom',
  data () {
    return {
      addressImg: [
        {id: 1, Img: require('@/assets/homeImg/底部-定位.png'), info: '北京市海淀区学院路31号航遥中心'},
        {id: 2, Img: require('@/assets/homeImg/底部-电话.png'), info: '010-62060078, 010-62060340'},
        {id: 3, Img: require('@/assets/homeImg/底部-传真.png'), info: '010-62060000'},
        {id: 4, Img: require('@/assets/homeImg/底部-email.png'), info: 'agrs@mail.cgs.gov.cn'},
        {id: 5, Img: require('@/assets/homeImg/底部-邮编.png'), info: '100083'}
      ],
      showF: window.systemName
    }
  }
}
</script>

<style scoped>
  .footer_buttom{
    background:rgba(22, 46, 87, 1);
    width: 100%;
    height: 32vh;
  }
  .footerLeft{
    height: 80%;
    width: 29.5%;
  }
  .footerRight{
    height: 80%;
    width: 70.5%;
  }
  .title5{
     font-size:.5rem !important;
     font-family:AlibabaPuHuiTiM;
     color: #FFFFFF !important;
     float: none !important;
     margin-left: 0px !important;
     margin-top: 6%;
   }
  .address{
    margin-top: 4%;
    font-size: .28rem;
    color:rgba(144,144,155,1);
  }
  .address1{
    margin-top: 6%;
    font-size: .28rem;
    color:rgba(144,144,155,1);
  }
  .banner{
    width: 100%;
    height: 100%;
  }
  .logoTitle1{
    width: 79%;
    margin-top: 1.23%;
    height: 22vh;
    /*text-align: center;*/
    border-bottom: 1px solid #44484D;
  }
  .callUs{
    font-size: .3rem;
    font-family: MicrosoftYaHei;
    color: rgba(240,240,240,1);
    width: 35%;
    height: 96%;
    padding-top: 1%;
    padding-left:3%;
    float: left;
  }
  .addressMap{
    width: 58%;
    float: right;
    height: 76%;
    margin-top: 1%;
    padding: 1%;
    border: 1px solid rgba(255,255,255,0.22);
  }
  .versionInfo{
    font-size: .28rem;
    font-family:MicrosoftYaHei;
    color:rgba(144,144,155,1);
    width: 100%;
    height: 20%;
    line-height: 4vh;
    text-align: center;
  }
  .logoTitle{
    margin-left: 50%;
    width: 50%;
    margin-top: 3%;
    height: 22vh;
    text-align: center;
    border-bottom: 1px solid #44484D;
    border-right: 1px solid #44484D;
  }
</style>
