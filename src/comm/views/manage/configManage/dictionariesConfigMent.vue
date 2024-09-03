<template>
  <div class="dictionariesConfigMent">
    <div>
      <el-button type="primary" @click="handleDialog($event)">新增值域</el-button>
      <el-button type="primary" @click="handleDialog($event)">添加值</el-button>
    </div>
    <div class="dictionariesConfigMentTable">
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        size="mini"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column
          prop="name"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="coding"
          label="编码">
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button @click="handleDialog($event)" size="mini" type="primary">修改</el-button>
            <el-button size="mini" type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog width="30%" :title="dialogName" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth">
          <el-input v-model="form.coding" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-show="rangeFlag" label="值域" :label-width="formLabelWidth">
          <el-select style="width: 100%;" v-model="form.region" placeholder="请选择">
            <el-option value="shanghai"></el-option>
            <el-option value="beijing"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">{{this.dialogButton}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [{
        id: '1',
        name: '国情数据对照',
        coding: 'DIC_NCDATA',
        children: [{
          id: '2',
          name: '普查要素',
          coding: 'PCYS'
        }, {
          id: '3',
          name: '国情地理单元',
          coding: 'DLDY'
        }]
      }, {
        id: '4',
        name: '生产年代',
        coding: 'DIC_ProductDate',
        children: [{
          id: '5',
          name: '2019',
          coding: '2019'
        }, {
          id: '6',
          name: '2018s',
          coding: '2018'
        }]
      }],
      dialogFormVisible: false,
      form: {
        name: '',
        coding: '',
        range: ''
      },
      dialogName: '',
      formLabelWidth: '50px',
      rangeFlag: false,
      dialogButton: '新 增'
    }
  },
  methods: {
    handleDialog (e) {
      this.dialogName = e.target.innerText
      if (this.dialogName === '添加值') {
        this.rangeFlag = true
        this.dialogButton = '新 增'
      } else if (this.dialogName === '修改') {
        this.rangeFlag = false
        this.dialogButton = '修 改'
      } else {
        this.rangeFlag = false
        this.dialogButton = '新 增'
      }
      this.dialogFormVisible = true
    },
    handleAdd () {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';
.dictionariesConfigMent{
  padding: .5rem;
  .dictionariesConfigMentTable{
    margin-top: .2rem;
  }
}
</style>
