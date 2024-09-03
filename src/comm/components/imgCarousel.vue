<template>
<div>
  <el-row class="el-carouselTop">
    <el-col :span = '24'>
      <el-carousel height="28vh" :interval="5000" arrow="always">
        <el-carousel-item v-for="(item, index) in headerImg" :key="index">
          <img class="banner" :src="item.Img">
        </el-carousel-item>
      </el-carousel>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'imgCarousel',
  data () {
    return {
      headerImg: [
        {id: 1, Img: require('@/assets/homeImg/bg1920_5p.jpg')},
        {id: 2, Img: require('@/assets/homeImg/bg1920_2p.jpg')},
        {id: 3, Img: require('@/assets/homeImg/bg1920_3p.jpg')},
        {id: 4, Img: require('@/assets/homeImg/bg1920_4p.jpg')},
        {id: 5, Img: require('@/assets/homeImg/bg1920_1p.jpg')}
      ]
    }
  }
}
</script>

<style scoped>
  .el-carouselTop{
    height: 20%;
  }
  .el-carouselTop >>> .el-carousel__button {
    background: rgba(0,0,0,0.64) !important;
    width: 1.9vh !important;
    border-radius: 20px !important;
    height: 1.9vh !important;
    opacity: 1 !important;
  }
  .el-carouselTop  >>> .el-carousel__indicator.is-active button {
     /*opacity: 0.5 !important;*/
     background:rgba(61,110,241,1) !important;
   }
  .banner{
    width: 100%;
    height: 100%;
  }
</style>
