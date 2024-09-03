<template>
  <div class="pagination">
    <el-pagination
      background
      small
      :page-size="pageSize"
      @current-change="(index) => this.$emit('currentChange', index)"
      layout="total, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: ['total', 'pageSize', 'currentChange']
}
</script>

<style scoped>
.pagination{
  margin-top: 25px;
  text-align: right;
}
</style>
