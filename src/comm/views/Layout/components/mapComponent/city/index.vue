<template>
  <div class="city">
    <div class="currentCity">
      <div class="title line">请选择城市</div>
      <!--<div class="content line">{{cityNameTrue}}</div>-->
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
          <div @click="handleCountry" :class="active==='全国' ? 'provide active' : 'provide'">全国</div>
          <div @click="handleProvince" :class="active==='按省份' ? 'provide active' : 'provide'">按省份</div>
          <div @click="handleCitys" :class="active==='按城市' ? 'spell active' : 'spell'">按城市</div>
          <!--<div @click="handleCitys" :class="active==='全国' ? 'spell active' : 'spell'">全国</div>-->
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
                  <div class="provinceName" @click="handleItemClick(item.areaName, item.areaCode,1)">
                    <el-dropdown-item>{{ item.areaName }}</el-dropdown-item>
                  </div>
                  <!--<div class="cityName">
                    <el-dropdown-item class="cityNameSpan" v-for="(itemChildren, index) in item.children" :key="index" >
                      <span @click="handleItemClick(itemChildren.areaName, itemChildren.areaCode)">{{ itemChildren.areaName }}</span>
                    </el-dropdown-item>
                  </div>-->
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
                <span @click="handleItemClick(item.areaName, item.areaCode,2)">
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
import { gisMap } from '@comm/map/map_globel.js'
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
      cityLetters: []
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
      gisMap.clearAll()
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
        this.cityLetters = [];
        // 正例
        for (let key in obj) {
          this.cityLetters.push(key)
        }
      })
    },
    // 获取城市下面的县
    citiesCountyData (code,name) {
      http.getByCountyList({
          al:code,
          name:name
      }).then(res => {
        this.citys = res.data
      })
    },
    // 控制省份和城市显隐
    handleProvince () {
      this.active = '按省份'
      this.showFalse = true
    },
    // 控制全国
    handleCountry () {
      this.active = '全国'
      this.setCode(156000000)
      this.zoomto (156000000)
      // this.showFalse = true
    },
    // 控制省份和城市显隐
    handleCitys () {
      this.active = '按城市'
      this.showFalse = false
      this.citiesCityData()
    },
    // 点击拼音
    provinceLinkTo (ref) {
      this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['' + ref][0].offsetTop

    },
    handleItemClick (name, code,indexnum) {
      this.cityName = ''
      this.setGeometryType(1)
      this.setCode(code)
      this.setname(name)
      gisMap.clearAll()
      this.zoomto(code)
      if(indexnum===2){
        //获取市下面的县
        this.citiesCountyData(code,name);
      }
    },
    zoomto (code) {
      http.getAreaWkt({
        code
      }).then(res => {
        let wktResponse = res.data
        let feature = {
          'attributes': {},
          'style': {
            fillcolor: 'rgba(255, 255, 255, 0)',
            strokecolor: 'red',
            strokewidth: 2
          },
          'geometry': wktResponse
        }
        this.setQueryStatus(0)
        this.setWkt('') // 之前注释掉是因为行政区划这样查询太慢,这个修改成传code到后台联查,现在这里清空是为了使用code查询时候不受wkt的干扰
        // this.setWkt(wktResponse)
        gisMap.drawPolygon(feature)
        let f = gisMap.transformFeatureFromWkt(wktResponse)
        // 飞到某地
        gisMap.flyTo(f, () => {})
        this.setActiveName('condition')
      })
    },
    ...mapActions('searchStore', {
      setGeometryType: 'setGeometryType',
      setWkt: 'setWkt',
      setQueryStatus: 'setQueryStatus',
      setCode: 'setCode',
      setActiveName: 'setActiveName',
      setname: 'setname'
    })
  },
  mounted () {
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
      flex:2;
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
  width: 13%;
  display: table-cell;
}
.itemListContentListRight{
  width: 87%;
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
