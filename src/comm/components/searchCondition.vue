/* eslint-disable */
<template>
  <div class="searchCondition">
    <!--:key="item.nodeId + item.name"-->
    <div class="cont" v-for="(item, index) in tablesCondition" :key="index">
      <p class="conditionSpan" v-if="item.alisaName !== '传感器' && item.alisaName !== '数据名称'">{{ item.alisaName }}</p>
      <div class="content">
        <!-- 时间范围值 -->
        <div v-if="item.type === 'RangeDateConfig'">
          <el-date-picker
            style="width: 45%;"
            v-model="datePickerDefault"
            @change="handleendtime(datePickerDefault, 'start')"
            type="datetime"
            placeholder="选择开始时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            style="width: 45%;"
            v-model="enddatePickerDefault"
            @change="handleendtime(enddatePickerDefault, 'end')"
            type="datetime"
            placeholder="选择结束时间"
            align="right"
            :picker-options="endpickerOptions">
          </el-date-picker>
        </div>
        <!-- 时间单一值 -->
        <div v-if="item.type === 'SingleDateConfig'">
          <el-date-picker
            size="mini"
            v-model="datePickerSingleDate"
            type="date"
            @change="handletime(item)">
          </el-date-picker>
        </div>
        <div v-if="item.type === 'SingleEnumImp' && item.alisaName !== '传感器'">
          <el-checkbox-group size="mini" v-model="checked">
            <!--getTitled(city,index)-->
            <el-checkbox :title="city.value" style="width: 48%; margin-right: 0!important;" v-for="(city, index) in arrtitle" :label="city" :key="index" @change="handleBtn($event, city)">
              {{city.label}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div v-if="item.type === 'SingleEnumImplevel'">
          <el-checkbox-group size="mini" v-model="checkedlevel">
            <el-checkbox style="width: 48%; margin-right: 0!important;" v-for="(city, index) in item.defaultValue" :label="city" :key="index" @change="handleBtnlevel($event, city)">
              {{city}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <!-- 整型单一值 -->
        <div v-if="item.type === 'SingleIntConfig' || item.type === '12'">
          <el-slider style="width: 91%; margin-left: 10px;" @change="handleSingleInt(item)" v-model="SingleIntConfigVmodel" show-input></el-slider>
        </div>
        <!-- 枚举值 -->
        <div v-if="item.type === 'SingleTextConfig' && item.alisaName !== '数据名称'">
          <el-input style="width: 95%" size="mini" v-model="vmodel" @change="handleLike(item)" placeholder="请输入内容"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  export default {
    props: ['tables', 'tablesZ', 'queryFieldsListValues', 'sensorData'],
    computed: {
      tablesCondition: function () {
        if (this.tables) {
          this.checked = []
          this.checkedlevel = []
          this.tables.forEach(item => {
            if (item.type === 'RangeDateConfig') {
              const end = new Date()
              const start = new Date()
              end.setTime(start.getTime() - start.getHours() * 3600 * 1000 - start.getMinutes() * 60 * 1000 - start.getSeconds() * 1000)
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90 - start.getHours() * 3600 * 1000 - start.getMinutes() * 60 * 1000 - start.getSeconds() * 1000)
              // 采集时间选择后，在勾选传感器，时间不变
              if (sessionStorage.getItem('timeDE') || sessionStorage.getItem('endtime') && !this.restData) {
                this.datePickerDefault = sessionStorage.getItem('timeDE')
                this.enddatePickerDefault = sessionStorage.getItem('endtime')
              } else {
                this.datePickerDefault = this.commonMethod.timestampToTime(start)
                this.enddatePickerDefault = this.commonMethod.timestampToTime(end)
                sessionStorage.setItem('timeDE', this.commonMethod.timestampToTime(start))
                sessionStorage.setItem('endtime', this.commonMethod.timestampToTime(end))

              }
            }
            if (item.type === 'SingleDateConfig') {
              this.datePickerSingleDate = item.queryValue
            }
            if (item.type === 'SingleEnumImp') {
              this.arrtitle = []
              if (item.defaultValue.indexOf('+') > -1) {
                item.defaultValue = item.defaultValue.split('+')
                for (let i = 0; i < item.defaultValue.length; i++) {
                  this.arrtitle.push({
                    label: item.defaultValue[i],
                    value: this.getTitled(item.defaultValue[i], i)
                  })
                }
              } else if (Array.isArray(item.defaultValue)) {
                for (let i = 0; i < item.defaultValue.length; i++) {
                  this.arrtitle.push({
                    label: item.defaultValue[i],
                    value: this.getTitled(item.defaultValue[i], i)
                  })
                }
              } else {
                this.arrtitle.push({
                  label: item.defaultValue,
                  value: this.getTitled(item.defaultValue, 100)
                })
              }
              // this.checked = this.arrtitle
            }
            if (item.type === 'SingleEnumImplevel') {
              if (item.defaultValue.indexOf('+') > -1) {
                item.defaultValue = item.defaultValue.split('+')
              } else {
                if (item.defaultValue instanceof Array) {
                  item.defaultValue = item.defaultValue
                } else {
                  item.defaultValue = [item.defaultValue]
                }
              }
              // this.checkedlevel = item.defaultValue
            }
            if (item.type === 'SingleIntConfig') {
              this.SingleIntConfigVmodel = item.queryValue[0]
            }
            if (item.type === 'SingleTextConfig') {
              this.vmodel = item.queryValue[0]
            }
          })
        }
        return this.tables
      },
      values: function () {
        return this.queryFieldsListValues
      },
      ...mapState('searchStore', {
        searchIndex: 'searchIndex',
        nodeIndexData (state) {
          return state.nodeIndexData
        },
      })
    },
    data () {
      return {
        dataList: [],
        restData: false,
        arrtitle: [],
        clickPid: null,
        checked: [],
        checkedlevel: [],
        checkedZ: [],
        SingleIntConfigVmodel: 0,
        datePickerDefault: '',
        enddatePickerDefault: '',
        datePickerSingleDate: '',
        vmodel: '',
        checkedFlag: false,
        title: '',
        pickerOptions: {
          shortcuts: [{
            text: '一月前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          }, {
            text: '一季度前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 3);
              picker.$emit('pick', date);
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 12);
              picker.$emit('pick', date);
            }
          }]
        },
        endpickerOptions: {
          shortcuts: [{
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          },{
            text: '一月前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', date);
            }
          }, {
            text: '一季度前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30 * 3);
              picker.$emit('pick', date);
            }
          }]
        }
      }
    },
    // mounted () {
    //   this.$nextTick(() => {
    //     this.getTiem()
    //   })
    // },
    methods: {
      getTitled (val, index) {
        if (val) {
          let arry = ''
          if (index === 100) {
            arry = val
          } else {
            arry = val.split('-')
          }
          // GF2-PMS
          this.sensorData.forEach(item => {
            if (val.indexOf(item.fSensor) > -1) {
              this.title = item.fSensorstr
            }
          })
          if (val.indexOf('GF2') > -1 && val.indexOf('PMS') > -1) {
            this.title = '0.8米全色和3.2米多光谱'
          }
          if (val.indexOf('ZY02C') > -1 && val.indexOf('PMS') > -1) {
            this.title = '5米全色和10米多光谱'
          }
        }
        return this.title
      },
      handleendtime (val,type) {
        const date = new Date()
        date.setTime(date.getTime() - date.getHours() * 3600 * 1000 - date.getMinutes() * 60 * 1000 - date.getSeconds() * 1000)
        if(type === 'start'){
          sessionStorage.setItem('timeDE', this.commonMethod.timestampToTime(this.datePickerDefault))
        }else if(type === 'end') {
          sessionStorage.setItem('endtime', this.commonMethod.timestampToTime(this.enddatePickerDefault))
        }
        this.dataList[0] = this.datePickerDefault
        this.dataList[1] = this.enddatePickerDefault
        this.tabelChange(this.dataList, 'RangeDateConfig')
      },
      handletime (val) {
        val.value = this.datePickerSingleDate
      },
      handleBtn () {
        let arr = []
        if (this.checked.length > 0) {
          this.checked.forEach(item => {
            arr.push(item.label)
          })
        } else {
          arr = []
        }
        this.tabelChange(arr, 'SingleEnumImp')
      },
      handleBtnlevel () {
        this.tabelChange(this.checkedlevel, 'SingleEnumImplevel')
      },
      handleSingleInt (val) {
        this.tabelChange([this.SingleIntConfigVmodel], 'SingleIntConfig')
      },
      handleLike (val) {
        val.value = this.vmodel
        this.tabelChange([this.vmodel], 'SingleTextConfig')
      },
      // 卫星传感器联动
      handleCheckBoxTop (val, bool) {
        if (val.pid !== -1) {
          if (bool) {
            this.checked.push(val.pid)
            this.values.map(item => {
              if (item.id === val.pid) {
                this.handleCheckBoxTop(item, bool)
              }
            })
          } else {
            this.checked.splice(this.checked.indexOf(val.pid), 1)
            this.values.map(item => {
              if (item.id === val.pid) {
                this.handleCheckBoxTop(item, bool)
              }
            })
          }
        }
      },
      handleCheckBoxBottom (val, bool) {
        if (bool) {
          this.values.map(item => {
            if (item.pid === val.id) {
              this.checked.push(item.id)
            }
          })
        } else {
          this.checked.map(each => {
            if (val.id === each) {
              this.checked.splice(this.checked.indexOf(val.id), 1)
            }
          })
          this.values.map(item => {
            if (item.pid === val.id) {
              this.checked.splice(this.checked.indexOf(item.id), 1)
              this.handleCheckBoxBottom(item, bool)
            }
          })
        }
      },
      tabelChange (val, type) {
        if (this.tablesZ.length > 0) {
          this.tablesZ.forEach(item => {
            if (item.type === type) {
              item.queryValue = val
            }
          })
        }
        this.$emit('handleSearchCondition', this.tablesZ)
      },
      ...mapActions('searchStore', {
        setNodeIndexData: 'setNodeIndexData',
      }),
    },
    watch: {
      nodeIndexData (val) {
        if (val) {
          this.restData = true
          this.setNodeIndexData(false)
        }
        setTimeout(() => {
          this.restData = false
        }, 2000)
      }
    }
  }
</script>

<style scoped>
  .searchCondition{
    width: 98%;
  }
  .cont{
    display: flex;
    align-items: center;
    padding: .15rem 0;
    /*border-bottom:1px solid #eee;*/
    font-size:14px !important;
  }
  .cont>>>.el-checkbox__label{
    font-size:13px !important;
  }
  .conditionSpan{
    flex: .88;
    font-size: 14px;
  }
  .content{
    flex:5.8;
  }
</style>
