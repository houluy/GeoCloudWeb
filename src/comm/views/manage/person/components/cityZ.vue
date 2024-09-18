<template>
  <div class="city">
    <div class="currentCity">
      <div class="title line">请选择城市</div>
      <div class="content line">{{cityNameTrue}}</div>
    </div>
    <div class="Separator"></div>
    <div class="searchCity">
      <el-autocomplete
        class="inline-input"
        v-model="cityName"
        :fetch-suggestions="querySearch"
        placeholder="请输入城市名"
        :trigger-on-focus="false"
        @select="handleSelect"
        style="flex:auto"
      ></el-autocomplete>
    </div>
    <div class="Separator"></div>
    <div class="cityList line">
      <div class="title">
        <div class="left">
          全国城市列表
        </div>
        <div class="right">
          <div @click="handleProvince" :class="active==='按省份' ? 'provide active' : 'provide'">按省份</div>
          <div @click="handleCitys" :class="active==='按城市' ? 'spell active' : 'spell'">按城市</div>
        </div>
      </div>
    </div>
    <div class="itemList">
      <div class="proviceAndCityLetters" v-if="showFalse">
        <a v-for='(item, index) in proviceLetters' :key="index" href="javascript:void(0)" @click="provinceLinkTo(item)">{{ item.toUpperCase() }}</a>
      </div>
      <div class="proviceAndCityLetters" v-if="!showFalse">
        <a v-for='(item, index) in cityLetters' :key="index" href="javascript:void(0)" @click="provinceLinkTo(item)">{{ item }}</a>
      </div>
      <el-scrollbar ref="myScrollbar" style="height: 100%;">
        <!-- 按省份 -->
        <div class="itemListBox" v-if="showFalse">
          <div :ref="key" class="itemListContent" v-for="(value, key, index) of provinces" :key="index">
            <div>
              <div class="itemListContentListLeft">
                {{ key.toUpperCase() }}
              </div>
              <div class="itemListContentListRight">
                <div class="provinceAndCity" v-for="(item, index) in value" :key="index">
                  <div class="provinceName" @click="handleItemClick(item.areaName, item.areaCode)">
                    <el-dropdown-item>{{ item.areaName.substring(0, 3) }}</el-dropdown-item>
                  </div>
                  <div class="cityName">
                    <el-dropdown-item class="cityNameSpan" v-for="(itemChildren, index) in item.children" :key="index" >
                      <span @click="handleItemClick(itemChildren.areaName, itemChildren.areaCode)">{{ itemChildren.areaName }}</span>
                    </el-dropdown-item>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 按城市 -->
        <div class="itemListBox" v-if="!showFalse">
          <div :ref="key" class="itemListContent" v-for="(value, key) of citys" :key="key">
            <div class="itemListContentListLeft">
              {{ key.toUpperCase() }}
            </div>
            <div class="itemListContentListRight">
              <el-dropdown-item class="cityNameSpan" v-for="(item, index) in value" :key="index">
                <span @click="handleItemClick(item.areaName, item.areaCode)">
                  {{ item.areaName }}
                </span>
              </el-dropdown-item>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import http from '@comm/service/interface.js'
import { mapActions, mapState } from 'vuex'
export default {
  name: 'city',
  data () {
    return {
      cityName: '',
      active: '按省份',
      provinces: {},
      citys: {},
      showFalse: true,
      proviceLetters: [],
      cityLetters: [],
      gisMapDiaZ: null
    }
  },
  computed: {
    ...mapState('searchStore', {
      cityNameTrue (state) {
        return state.name
      }
    })
  },
  methods: {
    // 选择城市
    handleSelect (data) {
      this.setname(data.areaName)
      this.setGeometryType(1)
      this.setCode(data.areaCode)
      this.gisMapDiaZ.clearAll()
      this.zoomto(data.areaCode)
      this.setMapScope(data)
    },
    ...mapActions('searchStore', {
      setMapScope: 'setMapScope'
    }),
    // 检索城市名称
    querySearch (queryString, cb) {
      let {provinces, citys} = this
      provinces = this.createStateFilter(provinces, queryString)
      citys = this.createStateFilter(citys, queryString)
      let result = [...provinces, ...citys]
      cb(result)
    },
    createStateFilter (obj, queryString) {
      let result = []
      Object.keys(obj).map(key => {
        let arr = obj[key].filter(each => {
          each.value = each.areaName
          return each.areaName.indexOf(queryString) !== -1
        })
        result = [...result, ...arr]
      })
      return result
    },
    // 获取省市
    citiesData () {
      http.getByProvinceList().then(res => {
        this.provinces = res.data
        let obj = this.provinces
        // 正例
        for (let key in obj) {
          this.proviceLetters.push(key)
        }
      })
    },
    // 获取城市
    citiesCityData () {
      http.getByCityList().then(res => {
        this.citys = res.data
        let obj = this.citys
        // 正例
        for (let key in obj) {
          this.cityLetters.push(key)
        }
      })
    },
    // 控制省份和城市显隐
    handleProvince () {
      this.active = '按省份'
      this.showFalse = true
    },
    // 控制省份和城市显隐
    handleCitys () {
      this.active = '按城市'
      this.showFalse = false
    },
    // 点击拼音
    provinceLinkTo (ref) {
      this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['' + ref][0].offsetTop
    },
    handleItemClick (name, code) {
      // console.log(name, code)
      this.cityName = ''
      this.setGeometryType(1)
      this.setCode(code)
      this.setname(name)
      this.gisMapDiaZ.clearAll()
      this.zoomto(code)
    },
    zoomto (code) {
      // code = JSON.stringify(code).replace(/\"/g, "'")
      http.getAreaWkt({
        code
      }).then(res => {
        let wktResponse = res.data
        let feature = {
          'attributes': {

          },
          'style': {
            fillcolor: 'rgba(255, 255, 255, 0)',
            strokecolor: 'red',
            strokewidth: 2
          },
          'geometry': wktResponse
        }
        this.setWkt('') // 之前注释掉是因为行政区划这样查询太慢,这个修改成传code到后台联查,现在这里清空是为了使用code查询时候不熟wkt的干扰
        this.gisMapDiaZ.drawPolygon(feature)
        let f = this.gisMapDiaZ.transformFeatureFromWkt(wktResponse)
        // 飞到某地
        this.gisMapDiaZ.flyTo(f, () => {})
        this.setActiveName('condition')
      })
    },
    ...mapActions('searchStore', {
      setGeometryType: 'setGeometryType',
      setWkt: 'setWkt',
      setCode: 'setCode',
      setActiveName: 'setActiveName',
      setname: 'setname'
    })
  },
  mounted () {
    this.$nextTick(() => {
      this.gisMapDiaZ = window.gisMapDiaZ
      console.log(this.gisMapDiaZ, 'this.gisMapDiaZ')
    })
    this.citiesData()
    this.citiesCityData()
  }
}
</script>

<style lang="scss" scoped>
.city{
  font-size: 12px;
}
.line{
  padding: 0 15px;
  margin: 10px 0 0;
}
.currentCity{
  margin-bottom: 8px;
  .title{
    color: #6b6b6b;
  }
  .content{
    margin-bottom: 10px;
  }
}
.Separator{
  border-top: 1px solid #e5ebf3;
  height: 1px;
  overflow: hidden;
}
.searchCity{
  display: flex;
  padding: 0 15px;
  margin: 10px 0;
}
.cityList{
  .title{
    display: flex;
    .left{
      flex:1;
      line-height: 22px;
    }
    .right{
      flex:1;
      display: flex;
      div{
        padding:5px 10px;
        background-color: #eee;
        cursor:pointer;
      }
      div.active{
        color: #166abe;
        background: #deedff;
      }
    }
  }
}
.itemList{
  width: 100%;
  height: 3.6rem;
  .itemListContent{
    width: 100%;
    margin: .2rem 0;
    overflow: hidden;
  }
}
.provinceAndCity{
  margin-bottom: .2rem;
  overflow: hidden;
}
.itemListContentListLeft, .itemListContentListMiddle, .itemListContentListRight, .itemListContentListCityRight, .provinceName, .cityName {
  float: left;
  .cityNameSpan {
    display: inline-block;
    margin-left: .15rem;
  }
}
.itemListContentListLeft{
  width: 10%;
  display: table-cell;
}
.itemListContentListRight{
  width: 90%;
  display: table-cell;
}
.cityName{
  width: 70%;
  margin-left: .2rem;
}
.proviceAndCityLetters{
  width: 100%;
  word-wrap:break-word;
  margin-bottom: .15rem;
  a {
    display: inline-block;
    margin-left: .2rem;
    margin-top: .1rem;
  }
  a:hover{
    text-decoration: underline;
  }
}
</style>
