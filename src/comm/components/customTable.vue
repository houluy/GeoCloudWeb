<template>
  <table class="mailTable" :style="styleObject" v-if="s_showByRow">
    <tr v-for="index in rowCount" :key="index">
      <!-- <td @click="handleEdit" class="column">{{tableData[index*2-2].key}}</td> -->
      <td class="column">{{tableData[index*2-2].key}}</td>
      <td>{{tableData[index*2-2].value}}</td>
      <td class="column">{{tableData[index*2-1] !== undefined ? tableData[index*2-1].key : ''}}</td>
      <td>{{tableData[index*2-1] !== undefined ? tableData[index*2-1].value : ''}}</td>
    </tr>
  </table>
  <table class="mailTable" :style="styleObject" v-else>
    <tr v-for="index in rowCount" :key="index">
      <td class="column">{{tableData[index-1].key}}</td>
      <td>{{tableData[index-1].value}}</td>
      <td class="column">{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].key : ''}}</td>
      <td>{{tableData[rowCount+index-1] !== undefined ? tableData[rowCount+index-1].value : ''}}</td>
    </tr>
  </table>
</template>

<script>
export default {
  data () {
    return {
      styleObject: {},
      s_showByRow: true
    }
  },
  props: ['tableData', 'tableStyle', 'showByRow'],
  computed: {
    rowCount: function () {
      return Math.ceil(this.tableData.length / 2)
    }
  },
  created () {
    this.styleObject = this.tableStyle
    if (this.showByRow !== undefined) {
      this.s_showByRow = this.showByRow
    }
  },
  methods: {
    // handleEdit () {
    //   for (var i = 1; i < this.rowCount; i++) {
    //     console.log(this.tableData[i * 2 - 2])
    //   }
    // }
  }
}
</script>

<style scoped>
.mailTable, .mailTable tr, .mailTable tr td{
  border:1px solid #E6EAEE;
}
.mailTable{
  font-size: 12px;
  color: #71787E;
}
.mailTable tr td{
  border:1px solid #E6EAEE;
  width: 150px; height: 35px;
  line-height: 35px;
  box-sizing: border-box;
  padding: 0 10px;
}
.mailTable tr td.column{
  background-color: #EFF3F6;
  color: #393C3E;
}
</style>
