<template>
  <div class="systemMonitoring">
    <div class="systemMonitoringTop">
      <div class="systemMonitoringTopLeft">
        <p>服务器监控</p>
        <div class="systemData">
          <span>服务器总数量 xx 台</span>
          <span>正常服务器 xx 台</span>
          <span>超负荷服务器 xx 台</span>
          <span>异常服务器 xx 台</span>
        </div>
        <div class="progressBar" v-for="(item, index) in progressData" :key="index">
          <div class="">
            <i class="progressBarTitle">{{item.name}}</i>
            <div class="progressBarBottom">
              <div class="progressBarBottomDiv" v-for="(itemChildren, index) in item.children" :key="index">
                <i class="progressTitle">{{itemChildren.title}}</i>
                <el-progress :percentage="itemChildren.percentage" :color="customColorMethod"></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="systemMonitoringTopRight">
        <p>站点监控</p>
        <div class="systemData">
          <span>站点总数量 xx 台</span>
          <span>正常站点 xx 台</span>
          <span>超负荷站点 xx 台</span>
          <span>异常站点 xx 台</span>
        </div>
        <div class="progressBar" v-for="(item, index) in progressData" :key="index">
          <div class="">
            <i class="progressBarTitle">{{item.name}}</i>
            <div class="progressBarBottom">
              <div class="progressBarBottomDiv" v-for="(itemChildren, index) in item.children" :key="index">
                <i class="progressTitle">{{itemChildren.title}}</i>
                <el-progress :percentage="itemChildren.percentage" :color="customColorMethod"></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="systemMonitoringBottom">
      <div class="onlineUser">在线用户</div>
      <div class="contentDiv">
        <div class="contentDivSearch">
          <el-form :inline="true" class="demo-form-inline">
            <el-form-item label="登陆账号：">
              <el-select v-model="formline.loginAccount" placeholder="请选择">
                <!-- <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="在线状态：">
              <el-select v-model="formline.onlineStatus" placeholder="请选择">
                <!-- <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="登陆时间：">
              <el-date-picker v-model="formline.loginTime" type="date" placeholder="选择日期" style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary">查询</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="contentDivTable">
          <el-table
            :data="tableData"
            border>
            <el-table-column
              prop="loginAccount"
              label="登陆账号"
              width="180">
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="address"
              label="IP地址">
            </el-table-column>
            <el-table-column
              prop="onlineStatus"
              label="在线状态">
            </el-table-column>
            <el-table-column
              prop="loginTime"
              label="登陆时间">
            </el-table-column>
            <el-table-column
              prop="onlineTime"
              label="在线时长">
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      percentage: 20,
      progressData: [
        {
          name: '10.1.1.1',
          children: [
            {title: 'CPU', percentage: 20},
            {title: '内存', percentage: 40},
            {title: '网络', percentage: 50},
            {title: '存储', percentage: 60}
          ]
        },
        {
          name: '10.1.1.2',
          children: [
            {title: 'CPU', percentage: 20},
            {title: '内存', percentage: 40},
            {title: '网络', percentage: 50},
            {title: '存储', percentage: 60}
          ]
        }
      ],
      tableData: [{
        loginAccount: '1',
        name: '2',
        address: '3',
        onlineStatus: '4',
        loginTime: '5',
        onlineTime: '6'
      }, {
        loginAccount: '7',
        name: '8',
        address: '9',
        onlineStatus: '10',
        loginTime: '11',
        onlineTime: '12'
      }],
      value: '',
      formline: {
        loginAccount: '',
        onlineStatus: '',
        loginTime: ''
      },
      currentPage: 1,
      pageSize: 10,
      total: 2
    }
  },
  methods: {
    customColorMethod (percentage) {
      if (percentage < 30) {
        return '#909399'
      } else if (percentage < 50) {
        return '#e6a23c'
      } else if (percentage < 60) {
        return '#a6a33b'
      } else {
        return '#67c23a'
      }
    },
    handleCurrentChange (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/global.scss';
.systemMonitoring{
  padding: .5rem;
  overflow: hidden;
  .systemMonitoringTop{
    .systemMonitoringTopLeft{
      display: inline-block;
      width: 44.2%;
      height: 5.5rem;
      background-color: #E2EBFA;
      padding: .5rem;
      p{
        font-size: .4rem;
      }
      .systemData{
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        background-color: #678FFD;
        border-radius: 5px;
        margin-top: .1rem;
        span{
          margin-left: .1rem;
          color: #fff;
        }
      }
      .progressBar{
        width: 46%;
        height: 200px;
        background-color: #678FFD;
        border-radius: 5px;
        margin-top: .2rem;
        padding: .1rem 0 0 .2rem;
        float: left;
        margin-left: .1rem;
        .progressBarTitle{
          color: #fff;
          font-size: .4rem;
          font-weight: 500;
        }
        .progressBarBottom{
          margin-top: .2rem;
          .progressBarBottomDiv{
            margin-top: .2rem;
          }
          .progressTitle{
            color: #fff;
            font-weight: 500;
          }
        }
      }
    }
    .systemMonitoringTopRight{
      display: inline-block;
      width: 43.7%;
      height: 5.5rem;
      background-color: #E2EBFA;
      padding: .5rem;
      margin-left: .56rem;
      p{
        font-size: .4rem;
      }
      .systemData{
        width: 100%;
        height: .6rem;
        line-height: .6rem;
        background-color: #678FFD;
        border-radius: 5px;
        margin-top: .1rem;
        span{
          margin-left: .3rem;
          color: #fff;
        }
      }
      .progressBar{
        width: 46%;
        height: 200px;
        background-color: #678FFD;
        border-radius: 5px;
        margin-top: .2rem;
        padding: .1rem 0 0 .2rem;
        float: left;
        margin-left: .1rem;
        .progressBarTitle{
          color: #fff;
          font-size: .4rem;
          font-weight: 500;
        }
        .progressBarBottom{
          margin-top: .2rem;
          .progressBarBottomDiv{
            margin-top: .2rem;
          }
          .progressTitle{
            color: #fff;
            font-weight: 500;
          }
        }
      }
    }
  }
  .systemMonitoringBottom{
    margin-top: .2rem;
    overflow: hidden;
    width: 100%;
    .onlineUser{
      height: .6rem;
      background-color: #E1EAF9;
      font-size: .48rem;
      font-weight: 500;
      padding: .2rem;
      margin-top: .2rem;
      line-height: .6rem;
    }
    .contentDiv{
      width: 100%;
      .contentDivSearch{
        width: 100%;
        text-align: right;
        margin-top: .2rem;
      }
      .pagination{
        width: 100%;
        text-align: right;
      }
    }
  }
}
</style>
