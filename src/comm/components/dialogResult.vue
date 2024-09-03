<template>
    <div class="eldialogC">
      <el-dialog
        title="数据筛选"
        :visible.sync="dialogVisible"
        :append-to-body="append"
        :close-on-click-modal="dialogappend"
        :show-close="dialogappend"
        width="30%">
        <div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="数据名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="getShow(0)">取 消</el-button>
          <el-button @click="getShow(1)">还 原</el-button>
          <el-button type="primary" @click="getShow(2)">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: "dialogResult",
  props:['dataListShow'],
  data() {
    return {
      dialogVisible: false,
      dialogappend: false,
      append: true,
      form: {
        name: ''
      }
    }
  },
  methods: {
    getShow(val) {
      if (val === 0){
        this.$emit('dialogCallBack', '取消')
      }
      if (val === 1) {
        this.$emit('dialogCallBack', '还原')
      }
      if (val === 2) {
        if (this.form.name !== '') {
          this.$emit('dialogCallBack', this.form.name)
        } else {
          this.$message({
            message: '请输入数据名称！',
            type: 'warning'
          })
        }
      }
    }
  },
  watch:{
    dataListShow (val) {
      this.dialogVisible = val
    }
  }
}
</script>

<style scoped>
  .eldialogC{

  }
</style>
