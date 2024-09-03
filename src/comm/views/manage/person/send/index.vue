<template>
  <div class="send">
    <search @getSearchData="getSearchData" @getSearchData2="getSearchData2"/>
    <tableShow ref="tableShow" @editTask="editTask"/>
    <addModal ref="addModal" @saveTableData="saveTableData" :editModalData="editModalData" @reflashTask="reflashTask"/>
  </div>
</template>

<script>
import control from './components/control'
import search from './components/search'
import tableShow from './components/tableShow'
import addModal from './components/addModal'
export default {
  data () {
    return {
      task: {},
      taskChild: {},
      editModalData: {},
      activeMenu: 'search'
    }
  },
  components: {control, search, tableShow, addModal},
  methods: {
    editTask (row) {
      this.editModalData = row
      console.log(row, 'asdfg')
      this.$nextTick(() => {
        this.$refs['addModal'].modalVisible = true
        this.$refs['addModal'].dialogTitleType = '任务详情'
      })
    },
    addTask () {
      this.editModalData = {}
      this.$nextTick(() => {
        this.$refs['addModal'].initTree()
        this.$refs['addModal'].getUserscrpge()
        this.$refs['addModal'].modalVisible = true
        this.$refs['addModal'].dialogTitleType = '添加任务'
      })
    },
    delTask () {
      this.changeStatus(12)
    },
    startTask () {
      this.changeStatus(8)
    },
    pauseTask () {
      this.changeStatus(4)
    },
    resertTask () {
      this.changeStatus(6)
    },
    stopTask () {
      this.changeStatus(10)
    },
    reflashTask () {
      this.$refs['tableShow'].getTableData()
    },
    changeStatus (index) {
      if (this.$refs['tableShow'].selectionArr.length) {
        this.$confirm('确定要进行该操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs['tableShow'].controlTask(this.$refs['tableShow'].selectionArr, index, 0)
        }).catch(() => {})
        // this.$refs['tableShow'].controlTask(this.$refs['tableShow'].selectionArr, index, 0)
      } else {
        this.$message('请勾选任务进行操作')
      }
    },
    saveTableData () {
      this.$refs['tableShow'].updateTableData()
    },
    getSearchData (searchData) {
      this.$refs['tableShow'].updateTableData(searchData)
    },
    getSearchData2 (searchData) {
      this.$refs['tableShow'].updateTableData1(searchData)
    }
  }
}
</script>

<style scoped>
.send{
  padding: 10px;
  background: #ffff;
}
</style>
