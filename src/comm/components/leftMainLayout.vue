<template>
  <div class="main-containerBg" style="width: 100%; height: calc(100% - 46px);" datatype="customLayout">
    <div ref="navBar" class="navBar">
        <span>当前位置：</span>
        <span :key="index" v-for="(item,index) in routerList"  :id="item.key" :style="{ color:(routerList.length-1==index) ? '#0099FA': '#868A90'}" >
          {{item.name}} {{(routerList.length-1==index) ? '': '>'}}
        </span>
    </div>
    <div style="height: calc(100% - 66px);width: 5.7rem;float: left;padding-top: 8px;overflow: auto" ref="leftNode">
      <slot name="left"></slot>
    </div>
    <div  style="width: 0.2rem;float: left;top: calc(50% - 50px);position: relative; text-align: center;">
      <img class="img" ref="imgNode" height="100" width="8px" :title="this.menuShow ? '收缩': '展开'"
           :src="this.menuShow ? require('@/assets/images/search/arrow21.png'): require('@/assets/images/search/arrow22.png')"
           @click="handleMenu">
    </div>
    <div style="height: calc(100% - 66px);width: calc(100% - 5.9rem);float: left;margin-top: 8px; " ref="mainNode">
      <slot name="main"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'leftMainLayout',
  props: {
    mainOnly: {// 左侧是否可见，如果这个设置为true，那么直接保留主面板单独
      type: Boolean,
      required: false,
      default: false
    },
    routerList: {// 左侧是否可见，如果这个设置为true，那么直接保留主面板单独
      type: Array,
      required: false
    }
  },
  data () {
    return {
      menuShow: true
      // routerList: [
      //   {name:'系统管理',key:'sys'},
      //   {name:'用户管理',key:'user'}
      // ]
    }
  },
  mounted () {
    if (this.mainOnly) {
      this.$refs['leftNode'].style.display = 'none'
      this.$refs['imgNode'].style.visibility = 'hidden'
      this.$refs['mainNode'].style.width = 'calc(100% - 0.2rem)'
    }
  },
  methods: {
    handleMenu () {
      this.menuShow = !this.menuShow
      this.$refs['leftNode'].style.width = this.menuShow ? '5.7rem' : '0px'
      this.$refs['leftNode'].style.display = this.menuShow ? '' : 'none'
      this.$refs['mainNode'].style.width = this.menuShow ? 'calc(100% - 5.9rem)' : 'calc(100% - 0.2rem)'
    }
  }
}
</script>

<style scoped>
  .img{
    cursor: pointer;
    padding-top:calc(50% - 37px);
  }
  .navBar {
    height: 30px;
    width: 100%;
    padding: 5px 23px;
    line-height: 30px;
    color: rgb(134, 138, 144);
    border-bottom: 1px solid #E8E8E8;
    /*font-weight: bolder;*/
    font-size: 12px;
  }
</style>
