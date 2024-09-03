<template>
<div>
  <el-row class="tac">
    <el-col :span="4">
      <el-menu
        default-active="1"
        class="el-menu-vertical-demo"
        style="height: 600px;"
        @select="handleSelect"
        background-color="rgba(244, 244, 244, 1)">
        <div class="configTop">
          <img src="@/assets/img/configMant.png" height="72" width="72"/>
          <p>配置管理</p>
        </div>
        <el-menu-item index="1">
          <i class="el-icon-setting"></i>
            <span slot="title">系统配置</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-map-location"></i>
          <span slot="title">地图配置</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-s-home"></i>
          <span slot="title">站点配置</span>
        </el-menu-item>
        <el-menu-item index="4">
          <i class="el-icon-s-home"></i>
          <span slot="title">字典管理</span>
        </el-menu-item>
        <el-menu-item index="5">
          <i class="el-icon-s-home"></i>
          <span slot="title">系统监控</span>
        </el-menu-item>
        <el-menu-item index="6">
          <i class="el-icon-s-home"></i>
          <span slot="title">任务监控</span>
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col style="width: 80%;">
      <sysConfigMent v-if="this.statisticType === '1'"></sysConfigMent>
      <mapConfigMent v-if="this.statisticType === '2'"></mapConfigMent>
      <siteConfigMent v-if="this.statisticType === '3'"></siteConfigMent>
      <dictionariesConfigMent v-if="this.statisticType === '4'"></dictionariesConfigMent>
      <systemMonitoring v-if="this.statisticType === '5'"></systemMonitoring>
      <taskMonitoring v-if="this.statisticType === '6'"></taskMonitoring>
    </el-col>
  </el-row>
</div>
</template>

<script>
import sysConfigMent from './sysConfigMent'
import mapConfigMent from './mapConfigMent'
import siteConfigMent from './siteConfigMent'
import dictionariesConfigMent from './dictionariesConfigMent'
import systemMonitoring from './systemMonitoring'
import taskMonitoring from './taskMonitoring'
export default {
  name: 'configManage',
  components: {
    mapConfigMent,
    siteConfigMent,
    sysConfigMent,
    dictionariesConfigMent,
    systemMonitoring,
    taskMonitoring
  },
  data  () {
    return {
      statisticType: '1'
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.statisticType = key
    }
  }
}
</script>

<style scoped>
  .configTop{
    text-align: center;
    margin: 20px;
  }
  .configMent {
    font-family:'Arial Normal', 'Arial';
    font-weight:400;
    font-style:normal;
    font-size:20px;
    color:#333333;
    text-align:center;
    line-height:normal;
  }
  span{
    font-size: 20px;
    /*display: block;*/
    margin-left: 20px;
    text-align: center;
    width: 150px;
  }
  p{
    margin: 10px 0 40px 0px;
    font-size: 20px
  }
</style>
