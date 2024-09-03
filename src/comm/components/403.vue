<template>
  <el-empty description="当前无法使用此页面"></el-empty>
</template>

<script>
export default {
    name: "error_z",
    mounted () {
        document.title = '403 Forbidden'
    },
}
</script>

<style scoped>

</style>
