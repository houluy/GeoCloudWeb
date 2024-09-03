<template>
    <div>
      <div class="topcon">
        <span class="spanIcon"></span><span>您现在的位置是：<span class="spanColor"> > 联系我们</span></span>
      </div>
      <div class="conMidlle">
        <div class="conMidlleOne">
          <span class="spantitle">— 中国地质调查局自然资源航空物探遥感中心 —</span>
          <div class="imgDIV">
            <img :src="url" alt="" width="100%" height="100%">
          </div>
          <div class="spanDIV">
            <span class="spanList" v-for="(item, index) in addressImg" :key="index">
              <img :src="item.Img" alt="">
              {{item.info}}
            </span>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      index: '',
      url: require('@/assets/img/lxwmMAP.png'),
      addressImg: [
        {id: 0, Img: require('@/assets/contactUsImg/dw.png'), info: '单位名称：中国地质调查局自然资源航空物探遥感中心'},
        {id: 1, Img: require('@/assets/contactUsImg/dzyx.png'), info: '电子邮件：agrs@mail.cgs.gov.cn'},
        {id: 2, Img: require('@/assets/contactUsImg/lxdh.png'), info: '联系电话：010-62060078、010-62060340'},
        {id: 3, Img: require('@/assets/contactUsImg/txdz.png'), info: '通讯地址：北京市海淀区学院路31号航遥中心'},
        {id: 4, Img: require('@/assets/contactUsImg/cz.png'), info: '传真号码：010-62060000'},
        {id: 5, Img: require('@/assets/contactUsImg/ybhm.png'), info: '邮政编码：100083'}
      ]
    }
  }
}
</script>

<style scoped>
.topcon{
  /*width: 100%;*/
  padding: 0 15%;
  line-height: 40px;
  background-color: #E9EDF8;
}
.conMidlle{
  width: 70%;
  min-height: 40vh;
  background-color: #F8F8F8;
  padding: 1% 15% 0 15%;
}
.conMidlleOne{
  width: 100%;
  background: #fff;
  padding-bottom: 1%;
}
.spanIcon{
  width: 10px;
  height: 10px;
  background: blue;
  display: inline-block;
  /* position: relative; */
  /* top: 0; */
  border-radius: 50%;
  margin-right: 10px;
}
  .spanColor{
    color: #0540d5;
  }
  .spantitle{
    display: inline-block;
    width: 100%;
    text-align: center;
    font-size: 27px;
    line-height: 46px;
  }
  .imgDIV{
    width: 95.6%;
    height: 44vh;
    margin: 0 2% 1% 2%;
    border: 1px solid #A7B9D3;
  }
  .spanDIV{
    /*width: 92%;*/
    height: 15vh;
    margin: 2% 2% 1.5% 2%;
    padding: 1%;
    box-shadow: 0 2px 18px #cabdbd;
  }
  .spanList{
    display: inline-block;
    width: 43%;
    margin-left: 7%;
    line-height: 5vh;
  }
  .spanList img{
    margin-right: 10px;
  }
</style>
