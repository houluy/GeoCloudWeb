<template>
<div class="navList">
  <el-menu :default-openeds="openDefault" :default-active='defaultId' class="el-menu-vertical" background-color="#FFFFFF" text-color="black" :unique-opened="true" active-text-color="#87ABFF" @select="menuClick" @open="menuClick" @close="menuClickClose">
    <template v-for="child in list">
      <el-submenu v-if="child.children.length" :index="`${child.id}/${child.parentId}`" :key="child.id">
        <template slot="title">
          <!-- <img :src="activeIndex === `${child.id}` ? child.imgUrlOpen : child.imgUrlClose" alt=""> -->
          <img v-show="activeIndex === `${child.id}`" :src="child.imgUrlOpen" alt="">
          <img v-show="!(activeIndex === `${child.id}`)" :src="child.imgUrlClose" alt="">
          {{child.label}}
        </template>
        <el-menu-item v-for="children in child.children" :key="children.id" :index="`${children.id}/${children.parentId}`">
          <img src="@/assets/img/images/文件夹.png" style="vertical-align: sub;" alt="">
          {{children.label}}
        </el-menu-item>
        <!-- <navList :list="child.children" /> -->
      </el-submenu>
      <el-menu-item v-else-if="!child.children.length" :key="child.id" :index="`${child.id}/${child.parentId}`">
        <img src="@/assets/img/images/文件夹.png" style="vertical-align: sub;" alt="">
        {{child.label}}
      </el-menu-item>
    </template>
  </el-menu>
</div>
</template>

<script>
import {
  mapActions
} from 'vuex'
export default {
  name: 'navList',
  props: ['list'],
  data () {
    return {
      defaultId: '10091/10009',
      openDefault: ['10009/0'],
      activeIndex: '10009',
      str: ''
    }
  },
  methods: {
    menuClickClose (index) {
      this.defaultId = ''
      this.activeIndex = '123'
    },
    menuClick (index) {
      this.defaultId = ''
      let _this = this
      _this.defaultId = ''
      let arr = index.split('/')
      let id = arr[0]
      let parentId = arr[1]
      if (parentId === '0') {
        _this.openDefault = []
        _this.openDefault.push(index)
        _this.activeIndex = id
        _this.list.forEach(item => {
          if (item.id === id) {
            _this.defaultId = `${item.children[0].id}/${id}`
          }
        })
        _this.str = _this.defaultId
      } else {
        _this.defaultId = index
        _this.str = index
        _this.activeIndex = parentId
      }
    },
    ...mapActions('searchStore', {
      setNavListIndex: 'setNavListIndex'
    })
  },
  // computed: {
  //   defaultId: function () {
  //     return this.defaultActiveId || '10091/10009'
  //   }
  // },
  watch: {
    str (val) {
      this.setNavListIndex(val)
    }
  }
}
</script>

<style scoped>
.navList {
  height: 100%;
}

.navList>>>.el-menu {
  height: 100%;
}

.navList>>>.el-menu-item {
  padding-left: 43px !important;
}

.navList>>>.el-submenu__title {
  height: 54px !important;
  line-height: 54px !important;
}

img {
  vertical-align: middle;
}
</style>
