<template>
  <div class="control">
    <!--<el-button size="mini" icon="el-icon-folder-add" @click="addTaskBtn">添加</el-button>-->
    <el-button size="mini" icon="el-icon-folder-remove" @click="delTaskBtn">删除</el-button>
    <el-button size="mini" icon="el-icon-switch-button" @click="startBtn">重发</el-button>
    <el-button-group>
      <el-button size="mini" icon="el-icon-video-pause" @click="pauseBtn">暂停</el-button>
      <el-button size="mini" @click="resertBtn">重新推送<i class="el-icon-video-play"></i></el-button>
    </el-button-group>
    <el-button size="mini" icon="el-icon-circle-close" @click="stopBtn">终止</el-button>
    <!--<el-button size="mini" icon="el-icon-refresh-right" @click="reflashBtn">刷新</el-button>-->
  </div>
</template>

<script>
export default {
  props: ['addTask', 'delTask', 'startTask', 'pauseTask', 'resertTask', 'stopTask', 'reflashTask'],
  methods: {
    addTaskBtn () {
      this.$emit('addTask')
    },
    delTaskBtn () {
      this.$emit('delTask')
    },
    startBtn () {
      this.$emit('startTask')
    },
    pauseBtn () {
      this.$emit('pauseTask')
    },
    resertBtn () {
      this.$emit('resertTask')
    },
    stopBtn () {
      this.$emit('stopTask')
    },
    reflashBtn () {
      this.$emit('reflashTask')
    }
  }
}
</script>

<style>
</style>
