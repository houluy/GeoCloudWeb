<template>
  <el-container class="survey-container">
    <el-header>
      <h2>“地质云遥感数据服务系统”用户满意度调查问卷</h2>
    </el-header>
    <el-main>
      <el-card class="survey-card" shadow="hover">
        <el-form ref="surveyForm" :model="surveyForm" label-width="120px" label-position="right" class="survey-form">
          <el-form-item label-width="0px">
            <p>尊敬的用户，您好！
              为了不断提升我们的服务质量，我们特此开展本次用户满意度调查。您的意见对我们至关重要，将帮助我们改进服务流程和用户体验。本问卷预计耗时3-5分钟，感谢您的宝贵时间和支持！</p>
          </el-form-item>

          <!-- 基本信息 -->
          <el-form-item label="职业：" label-width="120px"  class="left-align-label">
            <el-radio-group v-model="surveyForm.occupation" size="medium">
              <el-radio-button label="student">学生</el-radio-button>
              <el-radio-button label="teacher">教师/研究员</el-radio-button>
              <el-radio-button label="expert">行业专家</el-radio-button>
              <el-radio-button label="government">政府工作人员</el-radio-button>
              <el-radio-button label="employee">企业员工</el-radio-button>
              <el-radio-button label="other">其他</el-radio-button>
            </el-radio-group>
            <el-input v-if="surveyForm.occupation === 'other'" v-model="surveyForm.otherOccupation" placeholder="请注明"></el-input>
          </el-form-item>

          <el-form-item label="地质云使用频率：">
            <el-radio-group v-model="surveyForm.frequency" size="medium">
              <el-radio-button label="daily">每天</el-radio-button>
              <el-radio-button label="weekly">每周</el-radio-button>
              <el-radio-button label="monthly">每月</el-radio-button>
              <el-radio-button label="occasionally">偶尔</el-radio-button>
              <el-radio-button label="firstTime">首次使用</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="遥感数据质量：">
            <el-radio-group v-model="surveyForm.dataQuality" size="medium">
              <el-radio-button label="veryHigh">很高</el-radio-button>
              <el-radio-button label="high">较好</el-radio-button>
              <el-radio-button label="average">一般</el-radio-button>
              <el-radio-button label="low">较差</el-radio-button>
              <el-radio-button label="veryLow">很差</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="遇到最大问题：">
            <el-checkbox-group v-model="surveyForm.problems">
              <el-checkbox label="complex">系统操作复杂</el-checkbox>
              <el-checkbox label="slow">数据加载缓慢</el-checkbox>
              <el-checkbox label="unclear">功能不明确</el-checkbox>
              <el-checkbox label="support">客服支持不足</el-checkbox>
              <el-checkbox label="tracking">订单追踪困难</el-checkbox>
              <el-checkbox label="other">其他</el-checkbox>
            </el-checkbox-group>
            <el-input v-if="surveyForm.problems.includes('other')" v-model="surveyForm.otherProblems" placeholder="请注明"></el-input>
          </el-form-item>

          <el-form-item label="客服服务改进地方：">
            <el-checkbox-group v-model="surveyForm.customerServiceImprovements">
              <el-checkbox label="responseTime">响应时间</el-checkbox>
              <el-checkbox label="knowledge">专业知识</el-checkbox>
              <el-checkbox label="attitude">服务态度</el-checkbox>
              <el-checkbox label="problemSolving">问题解决效率</el-checkbox>
              <el-checkbox label="other">其他</el-checkbox>
            </el-checkbox-group>
            <el-input v-if="surveyForm.customerServiceImprovements.includes('other')" v-model="surveyForm.otherCustomerServiceImprovements" placeholder="请注明"></el-input>
          </el-form-item>

          <el-form-item label="推荐意愿：">
            <el-radio-group v-model="surveyForm.recommendationWillingness" size="medium">
              <el-radio-button label="veryWilling">非常愿意</el-radio-button>
              <el-radio-button label="willing">愿意</el-radio-button>
              <el-radio-button label="uncertain">不确定</el-radio-button>
              <el-radio-button label="unwilling">不愿意</el-radio-button>
              <el-radio-button label="veryUnwilling">非常不愿意</el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="建议或意见：">
            <el-input
              type="textarea"
              v-model="surveyForm.suggestions"
              placeholder="请分享您对我们系统的建议或意见">
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitSurvey">提交问卷</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-main>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      surveyForm: {
        occupation: '',
        otherOccupation: '',
        frequency: '',
        dataQuality: '',
        problems: [],
        otherProblems: '',
        customerServiceImprovements: [],
        otherCustomerServiceImprovements: '',
        recommendationWillingness: '',
        suggestions: ''
      }
    };
  },
  methods: {
    submitSurvey() {
      console.log('问卷数据：', this.surveyForm);
      this.$message({
        message: '感谢您的反馈！',
        type: 'success'
      });
      // 这里可以添加将数据发送到服务器的代码
    }
  }
};
</script>

<style scoped>
.survey-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.survey-card {
  margin-top: 20px;
}

.el-header {
  padding: 20px;
  text-align: center;
  background-color: #f5f5f5;
}

.el-form-item__label {
  font-weight: bold;
}

.el-form-item {
  margin-bottom: 20px;
}

p {
  text-align: left;
}

.left-align-label {
  text-align: left;
}
</style>