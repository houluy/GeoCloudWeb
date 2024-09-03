<template>
  <div class="mapSwitch"  @mouseover="show" @mouseleave="hide"  >
    <transition name="fade">
    <div transiton="fade"  style="height: 64px;background: #fff;border-radius: 4px;border: 1px solid #d8d8d8;" v-if="!this.resultImgFlag">
      <el-radio-group v-model="radio4" size="medium" border="true">
        <el-radio label="矢量"  @click.native="handleChangeLayer('矢量')" ></el-radio><br/>
        <el-radio label="影像"  @click.native="handleChangeLayer('影像')"></el-radio>
      </el-radio-group>
    </div>
    </transition>
    <!--@click="handleClik"-->
    <el-button  style=" font-weight: bold;border: none;" class="open" >
      <img  height="18" width="18"  style="padding-right: 3px; "  :src="require('@/assets/images/search/earch.png')"  >
      地图
    </el-button>

  </div>
</template>
<script>
  export default {
    name: 'MapSwitch',
    data () {
      return {
        radio4: '矢量',
        resultImgFlag: true
      }
    },
    methods: {
      show () {
        this.resultImgFlag = false
      },
      hide () {
        this.resultImgFlag = true
      },
      // 切换底图
      handleChangeLayer (popup) {
        window.GISMaps['MainMap'].baseMapLayerChange(popup)
      }
    }
  }
</script>
<style  lang="scss"  scoped>
  .mapSwitch{
    width:93px;
    height:auto;
    border-radius:4px;
    opacity:0.8;
    display: inline-block;
    .hide {
      background:#fff;
      color: rgba(0,153,250,1);
    }
    .open {
      background:rgba(0,153,250,1);
      color: #fff;
    }
    .el-radio {
      color: #606266;
      font-weight: bold;
      line-height: 1;
      position: relative;
      cursor: pointer;
      display: inline-block;
      white-space: nowrap;
      outline: none;
      font-size: 28px;
      margin-left: 18px;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
    .el-button--small {
      padding: 9px 19px;
      font-size: 12px;
      border-radius: 3px;
      width: 100%;
    }
    .fade-enter-active, .fade-leave-active {
      transition: opacity .5s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
  }
</style>
