<template>
  <div>
    <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <div class="tree_con">
            <el-tree
              :data="treeData"
              node-key="id"
              ref="treeD"
              show-checkbox
              default-expand-all
              :default-checked-keys="nodeIdData"
              @node-drag-start="handleDragStart"
              @node-drag-enter="handleDragEnter"
              @node-drag-leave="handleDragLeave"
              @node-drag-over="handleDragOver"
              @node-drag-end="handleDragEnd"
              @node-drop="handleDrop"
              @check="checkChange"
              draggable
              :allow-drop="allowDrop"
              :allow-drag="allowDrag">
            </el-tree>
          </div>
          <div class="tree_span">
            <span>注：可以拖动排序</span>
          </div>
        </div>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <div class="con_top">
            <div class="echarts_bot_top">
              <img src="./img/iconspan.jpg" height="14" width="4"/>
              <span>目录信息</span>
            </div>
            <div class="con_top_condition">
              <el-row>
                <el-col :span="10">
                  <div class="dire_name">
                    <el-form ref="form" :model="form" label-width="80px">
                      <el-form-item label="目录名称" style="width: 80%;">
                        <el-input v-model="form.nameCata"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-col>
                <el-col :span="14">
                  <div class="dire_search">
                    <span class="dire_search_span dire_search_one" @click="searchData">查 询</span>
                    <span class="dire_search_span dire_search_two" @click="resetData">重 置</span>
                    <span @click="addCataD" class="dire_search_span dire_search_there">新增目录</span>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <div class="con_content">
            <div class="echarts_bot_top">
              <img src="./img/iconspan.jpg" height="14" width="4"/>
              <span>目录名称</span>
            </div>
            <div class="table_con">
              <div class="table_con_data">
                <template>
                  <el-table
                    :height="heightD"
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                      prop="catalogname"
                      label="主目录">
                    </el-table-column>
                    <el-table-column
                      prop="fnodename"
                      label="子目录">
                    </el-table-column>
                    <!--<el-table-column-->
                      <!--prop="fnodeid"-->
                      <!--label="节点nodeId">-->
                    <!--</el-table-column>-->
                    <el-table-column
                      label="显示">
                      <template slot-scope="scope">
                        <span>{{scope.row.fshow === '1' ? '是' : '否'}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="操作">
                      <template slot-scope="scope">
                        <img @click="upDataCataLog(scope.row)" title="修改" class="imgOne" src="./img/edit.png" alt="">
                        <img @click="deleteAgrsCataLogNodeByNodeidP(scope.row)" title="删除" class="imgTwo" src="./img/delete.png" alt="">
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </div>
            </div>
            <div class="pagination_con">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageSize"
                background
                layout="prev, pager, next, sizes, jumper"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="dialog_con">
      <el-dialog
        title="目录信息"
        modal
        :close-on-click-modal="false"
        :close-on-press-escape="true"
        :visible.sync="dialogVisible"
        width="40%">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item v-show="!editD" label="目录类型" style="width: 97%; display: inline-block">
            <el-radio-group v-model="form.radioD" @change="radioGroup">
              <el-radio :label="2">创建根目录</el-radio>
              <el-radio :label="3">创建子目录</el-radio>
            </el-radio-group>
            <span class="spanlable" style="left: -80px; top: 4px;"> *</span>
          </el-form-item>
          <el-form-item label="目录名称" style="width: 48%; display: inline-block">
            <el-input v-model="form.name" placeholder="请输入目录名称"></el-input>
            <span class="spanlable" style="left: -80px; top: 4px;"> *</span>
          </el-form-item>
          <el-form-item v-show="contionD" label="所属目录" style="width: 48%; display: inline-block">
            <el-cascader
              ref="cascaderAddr"
              v-model="form.cascaderData"
              @change="cascaderChange"
              :options="options"
              :props="{ checkStrictly: true }"
              clearable></el-cascader>
            <span class="spanlable" style="left: -80px; top: 4px;"> *</span>
          </el-form-item>
          <el-form-item v-show="!contionD" label="目录查询方式" style="width: 97%; display: inline-block">
            <el-select style="width: 100%;" v-model="form.nameType" placeholder="请选择">
              <el-option
                v-for="item in optionsName"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="spanlable" style="left: -107px; top: 4px;"> *</span>
          </el-form-item>
        </el-form>
        <div class="dir_table" v-show="contionD && showData">
          <div class="dir_table_top">
            <span class="spanlable" style="left: -12px;top: -4px;"> *</span>
            <img @click="handleData(0)" class="dir_table_delete" src="./img/delete_table.png" alt="">
            <img @click="handleData(1)" class="dir_table_add" src="./img/add_table.png" alt="">
            传感器设置
          </div>
          <div class="dir_table_con">
            <template>
              <el-table
                :data="tableDataDire"
                border
                style="width: 100%">
                <el-table-column
                  prop="fSensor"
                  label="传感器"
                  width="180">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.fSensor" placeholder="格式：目录名称-传感器"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fSensorstr"
                  label="分辨率描述"
                  width="180">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.fSensorstr" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="fResolution"
                  label="分辨率值">
                  <template slot-scope="scope">
                    <el-input size="mini" v-model="scope.row.fResolution" placeholder="请输入内容"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="是否显示" style="width: 97%; display: inline-block">
            <el-radio-group v-model="form.radio">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
            <span class="spanlable" style="left: -80px; top: 4px;"> *</span>
          </el-form-item>
          <el-form-item v-show="contionD" label="关联元数据表" style="width: 97%; display: inline-block">
            <el-select style="width: 100%;" v-model="form.optionsDvalue" placeholder="请选择">
              <el-option
                v-for="item in optionsD"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="spanlable" style="left: -107px; top: 4px;"> *</span>
          </el-form-item>
          <el-form-item v-show="contionD" label="目录描述" style="width: 97%; display: inline-block">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="form.textareaD">
            </el-input>
            <span class="spanlable" style="left: -80px; top: 4px;"> *</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
           <el-button v-show="!editD" type="primary" @click="determineD">确 定</el-button>
           <el-button v-show="editD" type="primary" @click="updataDetermineD">修 改</el-button>
           <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import http from '@comm/service/interface.js'
export default {
  name: "directoryConfig",
  data () {
    return{
      editD: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      heightD: 0,
      nodeParentId: '',
      rowData: {},
      rowDpenrat: {},
      dialogVisible: false,
      form: {
        name: '',
        nameCata: '',
        nameType: '',
        radio: '',
        radioD: '',
        optionsDvalue: '',
        cascaderData: '',
        textareaD: '',
        showF: false
      },
      tableData: [],
      tableDataAll: [],
      nodeArry: [],
      nodeStrs: [],
      treeData:[],
      nodeIdData:[],
      options: [],
      cascaderD: '',
      optionsName: [],
      optionsD: [],
      tableDataDire: [
        {
          fSensor: '',
          fSensorstr: '',
          fResolution: ''
        }
      ],
      contionD: true,
      showData: true,
      indexShow: false
    }
  },
  created () {
    // table高度的确定，可以产生滚动的效果，自适应页面
    let d = document.documentElement.clientHeight
    this.heightD = (d * 0.98 -150) * 0.78 -  0.04 * d - 60
    //=============================
  },
  mounted () {
    this.getMLAgrsCatalogTreeData()
    this.getAgrsCatalogNameGroupD()
    this.getAgrsCatalogGroupD()
    this.getAgrsCatalogNodeAllTableD()
    this.searchData()
  },
  methods: {
    // 初始化
    getInit () {
      this.getMLAgrsCatalogTreeData()
      this.getAgrsCatalogNameGroupD()
      if (this.editD) {
        this.searchData()
      }
    },
    getShowData (val) {
      if (this.options.length > 0) {
        this.options.forEach(item => {
          if (item.fcatalogid === val) {
            item.fshowtype === '卫星+传感器' ? this.showData =true : this.showData = false
          }
        })
      }
    },
    // 修改节点前的数据获取
    upDataCataLog (row) {
      this.editD = true
      this.rowData = row
      this.form.radioD = 3
      this.form.name= row.fnodename
      this.form.cascaderData= row.fcatalogid
      this.cascaderD= row.fcatalogid
      this.getShowData(row.fcatalogid)
      this.form.textareaD= row.fnodedesc
      this.form.radio= parseInt(row.fshow)
      let nodeParam = {}
      if (row.fnodeid === 0) {
        nodeParam= {
          fcatalogid: row.fcatalogid
        }
        this.contionD = false
        this.form.showF = true
        http.getAgrsCataLogByCatalogId({data: nodeParam}).then(res => {
          this.form.nameType = res.data[0].fshowtype
          this.rowDpenrat = res.data[0]
          this.dialogVisible = true
        })
      } else {
        nodeParam= {
          nodeId: row.fnodeid
        }
        this.contionD = true
        this.form.showF = false
        http.getAgrsCatalogNodeTableByNodeId({data: nodeParam}).then(res => {
          this.form.optionsDvalue = res.data.toUpperCase()
          this.dialogVisible = true
        })
        let nodePage = {
          fnodeid: row.fnodeid,
          currentPage: 1,
          pageSize: 20,
        }
        http.getCatalogPage(nodePage).then(res => {
          this.tableDataDire = res.data.records
        })
      }
    },
    // 点击修改按钮触发修改事件
    updataDetermineD () {
      if (this.form.showF) {
        if (this.form.name === '') {
          this.$message({
            message: '必填项不能为空！',
            type: 'warning'
          })
          return
        }
        this.UpdateAgrsCataLogByCatalogIdP()
      } else {
        // zi
        if (this.cascaderD === '' || this.form.name === '' || this.form.textareaD === '') {
          this.$message({
            message: '必填项不能为空！',
            type: 'warning'
          })
          return
        }
        // this.UpdateAgrsCataLogNodeByNodeIdD()
        this.postUpdateArgsCatalog()
      }
    },
    postUpdateArgsCatalog () {
      this.tableDataDire.forEach(item => {
        item.fnodeid = this.rowData.fnodeid
        item.fIsshow = true
      })
      http.updateAgrsCataLog({
        data: {
          agrsCatalogNodeTableVO: {
            fcatalogid: this.cascaderD,
            fidStr: this.rowData.id,
            fnodeid: this.rowData.fnodeid,
            fnodename: this.form.name,
            fparentid: this.cascaderD,
            ftablename: this.form.optionsDvalue,
            nodeId: this.rowData.fnodeid
          },
          agrsCatalogNodeVO:{
            faliasname: this.rowData.faliasname,
            fcatalogid: this.cascaderD,
            fidStr: this.rowData.id,
            fnodedesc: this.form.textareaD,
            fnodeid: this.rowData.fnodeid,
            fnodename: this.form.name,
            forder: this.rowData.forder,
            fshow: this.form.radio.toString()
          },
          fcatalogid: this.cascaderD,
          fcatalogname: this.rowData.faliasname,
          fcatalogorder: this.rowDpenrat.fcatalogorder,
          fcatalogtype: this.rowDpenrat.fcatalogtype,
          fidStr: this.rowData.id,
          fshow: this.form.radio.toString(),
          fshowtype: this.form.nameType,
          // 传感器表格
          listSensortranslationVO: this.tableDataDire
        }
      }).then(res => {
        if (res.data) {
          this.$message({
            message: '成功！',
            type: 'success'
          })
          this.getInit()
          this.dialogVisible = false
        } else {
          this.$message({
            message: '失败！',
            type: 'error'
          })
        }
      })
    },
    UpdateAgrsCataLogByCatalogIdP () {
      let paramCata = {
        fcatalogid: this.rowData.fcatalogid,
        fcatalogorder: this.rowDpenrat.fcatalogorder,
        fcatalogtype: this.rowDpenrat.fcatalogtype,
        fidStr: this.rowDpenrat.id,
        fcatalogname: this.form.name,
        fshow: this.form.radio.toString(),
        fshowtype: this.form.nameType,
      }
      http.UpdateAgrsCataLogByCatalogId({data: paramCata}).then(res => {
        if (res.data) {
          this.$message({
            message: '成功！',
            type: 'success'
          })
          this.getInit()
          this.dialogVisible = false
        } else {
          this.$message({
            message: '失败！',
            type: 'error'
          })
        }
      })
    },
    // 修改节点属性基本属性值
    UpdateAgrsCataLogNodeByNodeIdD () {
      let paramCata = {
        fcatalogid: this.cascaderD,
        fnodeid: this.rowData.fnodeid,
        faliasname: this.rowData.faliasname,
        forder: this.rowData.forder,
        fnodename: this.form.name,
        fnodedesc: this.form.textareaD,
        fshow: this.form.radio.toString(),
        fidStr: this.rowData.id
      }
      http.UpdateAgrsCataLogNodeByNodeId({data: paramCata}).then(res => {
        if (res.data) {
          this.UpdateAgrsCataLogNodeTableByNodeIdD(paramCata)
        } else {
          this.$message({
            message: '修改失败！',
            type: 'error'
          })
        }
      })
    },
    UpdateAgrsCataLogNodeTableByNodeIdD (paramCata) {
      let paramTable = {
        fcatalogid: paramCata.fcatalogid,
        fparentid: paramCata.fcatalogid,
        fnodename: paramCata.fnodename,
        ftablename: this.form.optionsDvalue,
        fnodeid: paramCata.fnodeid,
        fidStr: paramCata.fidStr
      }
      http.UpdateAgrsCataLogNodeTableByNodeId({data: paramTable}).then(res => {
        if (res.data) {
          this.removeCataByNodeIdD({fnodeid: paramTable.fnodeid})
        } else {
          this.$message({
            message: '修改失败！',
            type: 'error'
          })
        }
      })
    },
    // 修改过程中的传感器的更新
    removeCataByNodeIdD (param) {
      http.removeCataByNodeId(param).then(res => {
        if (res.data) {
          this.addCatalogsaveP({fnodeid: param.fnodeid,})
        } else {
          this.$message({
            message: '修改失败！',
            type: 'error'
          })
        }
      })
    },
     // 删除子节点
    deleteAgrsCataLogNodeByNodeidP (row) {
      this.$confirm('此操作将永久删除该节点, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(row, '8888')
        if (row.fnodeid === 0) {
          http.deleteAgrsCataLogByCatalogids({data: {
              fcatalogidList: [row.fcatalogid]
            }}).then(res => {
            if (res.data) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              })
              this.getInitData(row.fcatalogid, 1)
            } else {
              this.$message({
                message: '删除失败！',
                type: 'error'
              })
            }
          })
        } else {
          http.deleteAgrsCataLogNodeByNodeid({data: {
              fnodeidList: [row.fnodeid]
            }}).then(res => {
            if (res.data) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              })
              this.getInitData(row.fnodeid, 0)
            } else {
              this.$message({
                message: '删除失败！',
                type: 'error'
              })
            }
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getInitData(param, index) {
      this.getMLAgrsCatalogTreeData()
      this.getAgrsCatalogNameGroupD()
      if (index === 0) {
        this.nodeStrs = {checkedNodes: []}
        this.nodeArry.checkedNodes.forEach(item => {
          if (item.id.toString() !== param.toString()) {
            this.nodeStrs.checkedNodes.push(item)
          }
        })
        if (this.nodeStrs.length !== 0) {
          this.getAgrsCatalogListTreeP(this.nodeStrs)
        } else {
          this.searchData()
        }
      } else {
        this.searchData()
      }
    },
    // 添加目录节点（父节点和子节点）
    determineD () {
      let paramD = {
        fnodename: this.form.name,  //目录名称 string
        fcatalogid: this.cascaderD,  //所属目录 int
        fshow: this.form.radio,  // 是否显示 string 0不显示， 1显示
        fnodedesc: this.form.textareaD  // 目录描述
      }
      if (this.form.radioD === '') {
        this.$message({
          message: '请选择目录类型！',
          type: 'warning'
        })
        return
      }
      if (this.form.radioD === 2) {
        this.AddAgrsCataLogP()
      } else {
        let contion = true
        this.showData ? contion = this.form.name === '' || this.cascaderD === '' || this.form.radio === '' || this.form.textareaD === '' || this.tableDataDire[0].fSensor === undefined  || this.tableDataDire[0].fSensor === '' || this.form.optionsDvalue === '' : contion = this.form.name === '' || this.cascaderD === '' || this.form.radio === '' || this.form.textareaD === ''|| this.form.optionsDvalue === ''
        if (contion) {
          this.$message({
            message: '必填项不能为空！',
            type: 'warning'
          })
          return
        }
        this.AddAgrsCataLogNodeP(paramD)
      }
      // this.dialogVisible = false
    },
    // 添加根节点数据
    AddAgrsCataLogP () {
      let indexD = {
        fcatalogname: this.form.name,  //目录名称 string
        fshowtype: this.form.nameType,  //目录名称 string
        fshow: this.form.radio,  // 是否显示 int 0不显示， 1显示
      }
      if (this.form.name === '' || this.form.nameType === '' || this.form.radio === '' ) {
        this.$message({
          message: '必填项不能为空！',
          type: 'warning'
        })
        return
      }
      http.AddAgrsCataLogN({data: indexD}).then(res => {
        if (res.data) {
          this.$message({
            message: '成功！',
            type: 'success'
          })
          // 隐藏弹框
          this.getInit()
          this.dialogVisible = false
        } else {
          this.$message({
            message: '失败！',
            type: 'error'
          })
        }
      })
    },
    // 添加新目录-第一个接口
    AddAgrsCataLogNodeP (paramD) {
      http.AddAgrsCataLogNode({data: paramD}).then(res => {
        if (res.data) {
          let param = {
            fcatalogid: paramD.fcatalogid,
            fnodeid: res.data,
            fnodename: paramD.fnodename,
            ftablename: this.form.optionsDvalue
          }
          this.AddAgrsCataLogNodeTableP(param)
        } else {
          this.$message({
            message: '添加失败！',
            type: 'error'
          })
        }
      })
    },
    // 添加新目录-第二个接口
    AddAgrsCataLogNodeTableP (paramD) {
      http.AddAgrsCataLogNodeTable({data: paramD}).then(res => {
        if (res.data) {
          this.addCatalogsaveP(paramD)
        } else {
          this.$message({
            message: '添加失败！',
            type: 'error'
          })
        }
      })
    },
    // 添加新目录-第三个接口
    addCatalogsaveP (paramD) {
      this.tableDataDire.forEach(item => {
        item.fnodeid = paramD.fnodeid
      })
      http.addCatalogsave({data: this.tableDataDire}).then(res => {
        if (res.data) {
          this.$message({
            message: '成功！',
            type: 'success'
          })
          // 隐藏弹框
          this.getInit()
          this.dialogVisible = false
        } else {
          this.$message({
            message: '添加失败！',
            type: 'error'
          })
        }
      })
    },
    // 获取数据关联表
    getAgrsCatalogNodeAllTableD () {
      let dataD = []
      http.getAgrsCatalogNodeAllTable().then(res => {
        if (res.data && res.data.length >0) {
          for (let key in res.data) {
            dataD.push({
              value: res.data[key],
              label: res.data[key]
            })
          }
          this.optionsD= dataD
        } else {
          this.optionsD = []
        }
      })
    },
    // 获取查询分类
    getAgrsCatalogGroupD () {
      http.getAgrsCatalogGroup().then(res => {
        if (res.data && res.data.length >0) {
          res.data.forEach(item => {
            item.value = item.fshowtype
            item.label = item.fshowtype
          })
          this.optionsName= res.data
        } else {
          this.optionsName= []
        }
      })
    },
    // 所属目录数据获取
    getAgrsCatalogNameGroupD () {
      http.getAgrsCatalogNameGroup().then(res => {
        if (res.data && res.data.length >0) {
          res.data.forEach(item => {
            item.value = item.fcatalogid
            item.label = item.fcatalogname
          })
          this.options= res.data
        } else {
          this.options= []
        }
      })
    },
    // 创建父子目录的切换
    radioGroup (val) {
      val === 2 ? this.contionD = false : this.contionD = true
    },
    // 所属目录选择
    cascaderChange (val) {
     let addr =  this.$refs.cascaderAddr.getCheckedNodes()[0].data
      if (addr.fshowtype === '卫星+传感器') {
        this.showData = true
      } else {
        this.showData = false
      }
      if (val) {
        this.cascaderD = val[0]
        this.form.cascaderData = val[0]
      } else {
        this.cascaderD = ''
        this.form.cascaderData = ''
      }

    },
    // 目录树数据的查询方法
    getMLAgrsCatalogTreeData () {
      http.getMLAgrsCatalogTree().then(res => {
        if (res.data && res.data.length > 0) {
          this.getIndexData(res.data)
          this.treeData = res.data
        }
      })
    },
    // 计算tree的index-排序字段
    getIndexData (data) {
      if (data.length > 0) {
        data.forEach(item => {
          if (item.children.length > 0) {
            item.children.forEach((e, index) => {
              e.order = index + 1
            })
          }
        })
      }
    },
    // 对应节点的详情查询接口
    // param 为
    // {
    // fnodename: string,
    // parentidStr: string,
    // nodeids: []
    // }
    getAgrsCatalogListByParameterData (param) {
      http.getAgrsCatalogListByParameter({data: param}).then(res => {
        if (res.data && res.data.length > 0) {
          this.tableDataAll = res.data
          this.tableData = this.tableDataAll.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
          this.total = res.data.length
        } else {
          this.tableData = []
          this.total =0
          this.$message({
            message: '暂无数据!',
            type: 'warning'
          })
        }
      })
    },
    // 新增目录节点
    addCataD () {
      this.form = {
        name: '',
          nameCata: '',
          nameType: '',
          radio: '',
          radioD: '',
          optionsDvalue: '',
          cascaderData: '',
          textareaD: ''
      }
      this.tableDataDire = [
        {
          fSensor: '',
          fSensorstr: '',
          fResolution: ''
        }
      ]
      this.dialogVisible = true
      this.editD = false
    },
    // 目录名称查询
    searchData () {
      // this.nodeIdData = []
      this.$nextTick(() => {
        this.$refs.treeD.setCheckedKeys([]) // CheckedArr 一个选中的数组element Ui的东西，关键是看$nextTick的用法
      })
      // if (this.form.nameCata) {
      let param ={
        fnodename: this.form.nameCata,
      }
      this.getAgrsCatalogListByParameterData(param)
      // } else {
      //   this.$message({
      //     message: '请输入目录名称！',
      //     type: 'warning'
      //   })
      // }
    },
    // 重置目录名称输入
    resetData () {
      this.form.nameCata = ''
    },
    // 弹框中的传感器-添加数据-删除数据
    handleData (val) {
      if (val===1) {
        this.tableDataDire.push({fSensor: '', fSensorstr: '', fResolution: ''})
      } else{
        this.tableDataDire = this.tableDataDire.splice(0, this.tableDataDire.length - 1)
      }
    },
    // 查询数据的翻页
    handleCurrentChange (val) {
      this.currentPage = val
      this.tableData = this.tableDataAll.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    // 查询数据的翻页
    handleSizeChange (val) {
      this.pageSize = val
      this.tableData = this.tableDataAll.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    handleDragStart(node, ev) {
      this.nodeParentId = node.data.parentId
    },
    handleDragEnter(draggingNode, dropNode, ev) {
      // console.log('tree drag enter: ', dropNode.label);
    },
    handleDragLeave(draggingNode, dropNode, ev) {
      // console.log('tree drag leave: ', dropNode.label);
    },
    handleDragOver(draggingNode, dropNode, ev) {
      // console.log('tree drag over: ', dropNode.label);
    },
    handleDragEnd(draggingNode, dropNode, dropType, ev) {
      let parentidStr = ''
      let catalogidAndOrder = []
      if (this.treeData.length > 0) {
        this.treeData.forEach(item => {
          if (item.id === this.nodeParentId) {
            parentidStr = item.id
            if (item.children.length > 0) {
              item.children.forEach((e, index) => {
                e.order = index + 1
                catalogidAndOrder.push(e.id + '-' + e.order)
              })
            }
          }
        })
      }
      if (this.indexShow) {
        this.updateAgrsCataLogOrderP({parentidStr: parentidStr, catalogidAndOrder: catalogidAndOrder})
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // console.log('tree drop: ', dropNode.label, dropType);
    },
    // 选择tree节点触发事件
    checkChange(data, node) {
      this.form.nameCata = ''
      this.nodeArry = node
      if (node.checkedKeys.length === 0) {
        this.searchData()
      } else {
        this.getAgrsCatalogListTreeP(node)
      }
      //
    },
    getAgrsCatalogListTreeP (param) {
      let nodeids = []
      let parentidStrs = []
      param.checkedNodes.forEach(item => {
        if (item.parentId === '0') {
          parentidStrs.push(item.id)
        } else {
          nodeids.push(item.id)
        }
      })
      this.nodeIdData = nodeids
      http.getAgrsCatalogListTree({data: {
          nodeids: nodeids,
          parentidStrs: parentidStrs
        }}).then(res => {
        if (res.data && res.data.length > 0) {
          this.tableDataAll = res.data
          this.tableData = this.tableDataAll.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
          this.total = res.data.length
        } else {
          this.tableData = []
          this.total =0
          this.$message({
            message: '暂无数据!',
            type: 'warning'
          })
        }
      })
    },
    allowDrop (draggingNode, dropNode, type) {
      // 注掉的是同级拖拽
      if (draggingNode.level === dropNode.level && draggingNode.level !== 1 && draggingNode.data.parentId === dropNode.data.parentId) {
        // if (draggingNode.data.aboveId === dropNode.data.aboveId) {
        this.indexShow = true
        return type === 'prev' || type === 'next'
        // }
      } else {
        this.indexShow = false
        // 不同级进行处理
        return false
      }
    },
    allowDrag(draggingNode) {
      return draggingNode.data.label.indexOf('三级 3-2-2') === -1;
    },
    //
    updateAgrsCataLogOrderP (param) {
      http.updateAgrsCataLogOrder({data: param}).then(res => {
        if (res.data) {
          this.getMLAgrsCatalogTreeData()
          this.$message({
            message: '成功！',
            type: 'success'
          })
        } else {
          this.$message({
            message: '失败！',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  el-col{
    border: 1px solid #edeff1;
  }
  .bg-purple{
    height: calc(98vh - 148px);
    border: 1px solid #edeff1;
    margin-right: 10px;
    box-shadow: 1px 2px 7px 2px #edeff1;
    background: #fff;
  }
  .tree_con{
    height: calc(97% - 6vh);
    margin-bottom: 2vh;
    margin-top: 4vh;
    overflow: auto;
  }
  .tree_span{
    text-align: center;
    color: red;
  }
  .bg-purple-light{
    height: calc(98vh - 150px);
  }
  .con_top{
    width: 100%;
    height: calc(22% - 1vh);
    margin-bottom: 1vh;
    background: #fff;
    border: 1px solid #edeff1;
    box-shadow: 1px 2px 7px 2px #edeff1;
  }
  .con_content{
    width: 100%;
    height: 78%;
    background: #fff;
    border: 1px solid #edeff1;
    box-shadow: 1px 2px 7px 2px #edeff1;
  }
  .echarts_bot_top{
    margin-left: 1%;
    margin-top: 2vh;
  }
  .echarts_bot_top img{
    top: -1px;
    position: relative;
  }
  .con_top_condition{
    height: calc(90% - 15px - 6vh);
    padding: 2.5vh 1%;
  }
  .dire_search{
    text-align: right;
  }
  .dire_search_span{
    border-radius: 4px;
    height: 30px;
    display: inline-block;
    width: 85px;
    text-align: center;
    line-height: 30px;
    /*font-family: PingFangSC-Regular, PingFang SC;*/
    font-weight: 400;
    font-size: .25rem;
    cursor: pointer;
  }
  .dire_search_one{
    background: #3C6EF0;
    color: #fff;
    margin-right: 10px;
  }
  .dire_search_two{
    background: #fff;
    border: 1px solid #3C6EF0;
    color: #3C6EF0;
    margin-right: 40px;
  }
  .dire_search_there{
    background: #FFAE1D;
    color: #fff;
  }
  .table_con_data{
    padding: 1vh;
  }
  .table_con_data >>> .el-table--striped .el-table__body tr.el-table__row--striped td {
    background: #FCFDFF !important;
  }
  .table_con_data >>> .el-table th {
    background: #F1F4F9 !important;
    text-align: center !important;
    /*font-family: PingFangSC-Medium, PingFang SC;*/
    font-weight: bold !important;
    color: #333333 !important;
  }
  .dir_table_con >>> .el-table th {
    background: #DDE5FC !important;
    text-align: center !important;
    /*font-family: PingFangSC-Medium, PingFang SC;*/
    font-weight: bold !important;
    color: #333333 !important;
    padding: 3px !important;
  }
  .table_con_data >>> .el-table .cell {
    text-align: center;
  }
  .dir_table_con >>> .el-table .cell {
    text-align: center;
  }
  .dir_table_con >>>.el-table--small td{
    padding: 3px 0 !important;
  }
  .table_con_data >>> img {
    cursor: pointer;
    width: 16px;
  }
  .table_con_data >>> .imgOne {
    margin-right: 16px;
  }
  .table_con_data >>> .imgTwo {

  }
  .pagination_con{
    text-align: right;
    margin-right: 20px;
  }
  .dialog_con >>>.el-dialog__header {
    padding: 13px 20px 10px !important;
    color: #333333;
    font-weight: bold;
    border-bottom: 1px solid #EAEAEA;
  }
  .dialog_con >>>.el-dialog__headerbtn {
    top: 10px !important;
    font-size: 20px !important;
  }
  .dialog_con >>>.el-dialog__body {
    padding: 20px 20px 20px 30px !important;
    border-bottom: 1px solid #EAEAEA;
  }
  .spanlable{
    position: absolute;
    color: red;
    font-size: 30px;
    display: inline-block;
    /*margin-left: 7px;*/
  }
  .dir_table{
    height: 22vh;
    background: rgba(60, 110, 240, 0.05);
    padding: 14px 14px 4px 14px;
    margin-bottom: 10px;
  }
  .dir_table_top{
    position: relative;
    width: 100%;
    vertical-align: middle;
    float: left;
    margin-bottom: 10px;
    font-size: 14px;
    color: #606266;
  }
  .dir_table_con{
    height: 80%;
    width: 95%;
    overflow: auto;
  }
  .dir_table_delete{
    position: absolute;
    right: 0;
    top: 55px;
    width: 16px;
    cursor: pointer;
  }
  .dir_table_add{
    position: absolute;
    right: 0;
    top: 30px;
    width: 16px;
    cursor: pointer;
  }
  .dialog_con>>>.el-dialog{
    margin-top: 5vh !important;
  }
  .el-tree {
    display: inline-block;
    min-width: 100%;
  }
</style>
