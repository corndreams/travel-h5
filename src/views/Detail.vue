<script setup>
import { ref, onMounted, reactive } from 'vue';

import { useRoute, useRouter } from 'vue-router'
import { post } from '@/api/requset'

import SoptItem from '@/components/SoptItem.vue'
import BudgetTable from '@/components/BudgetTable.vue'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const tripData = ref(null)
const errorMsg = ref('')
const activeDays = ref([])

const formData = reactive({
  city: '',
  days: '',
  budget: ''
})

const fetchData = async () => {
  const res = await post('/travel/recommend', formData)
  console.log(res)
  if (res.success != false) {
    tripData.value = res.data
    isLoading.value = false
  } else {
    errorMsg.value = res.msg
    isLoading.value = false
  }
}

onMounted(() => {
  formData.city = route.query.city
  formData.days = route.query.days
  formData.budget = route.query.budget
  if (formData.city && formData.days && formData.budget) {
    fetchData()
  }
})

const gotoChat = () => {
  router.push({
    path: '/chat',
    query: {
      scene: 'detail',
      city: formData.city,
    }
  })
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar fixed :title="formData.city + '行程规划'" left-arrow @click-left="router.back()" left-text="返回" />
    </div>
    <div class="page-content">
      <div v-if="isLoading" class="loading-container">
        <van-loading type="spinner" size="48px">
          正在生成旅游规划
        </van-loading>
      </div>
      <div v-else-if="errorMsg">
        <van-empty class="empty" :description="errorMsg" />
        <van-button type="primary" @click="fetchData">重新生成</van-button>
      </div>
      <template v-else-if="tripData && tripData.success">
        <div class="card overview-card">
          <div class="trip-header">
            <h2>{{ tripData.city }} - {{ tripData.days }}天行程规划</h2>
            <div class="trip-budget">预算：{{ tripData.totalBudget }}元</div>
          </div>
        </div>
        <div class="card trip-collapse">
          <van-collapse v-model="activeDays">
            <van-collapse-item v-for="day in tripData.dailyItinerary" :key="day.day" :title="`第${day.day}天`"
              :name="day.day">
              <div class="day-schedule">
                <div class="schedule-section">
                  <div class="schedule-label morning">上午</div>
                  <SoptItem :data="day.morning" />
                </div>
                <div class="schedule-section">
                  <div class="schedule-label afternoon">下午</div>
                  <SoptItem :data="day.afternoon" />
                </div>
                <div class="schedule-section">
                  <div class="schedule-label evening">晚上</div>
                  <SoptItem :data="day.evening" />
                </div>
              </div>
            </van-collapse-item>
          </van-collapse>
        </div>
        <div class="card budget-card">
          <div class="section-header">预算详情</div>
          <BudgetTable :data="tripData.budgetDetail" :total="tripData.totalBudget" />
        </div>
        <div class="card tips-card">
          <div class="section-header">温馨提示</div>
          <ul class="tips-list">
            <li v-for="(tip, index) in tripData.tips" :key="index">{{ index + 1 }}. {{ tip }}</li>
          </ul>
        </div>
        <div class="card warning-card">
          <div class="section-header">注意事项</div>
          <ul class="warnings-list">
            <li v-for="(warning, index) in tripData.warnings" :key="index">{{ index + 1 }}. {{ warning }}</li>
          </ul>
        </div>
      </template>
    </div>
    <div class="detail-footer" v-if="tripData && tripData.success !== false">
      <van-button type="primary" size="large" round @click="gotoChat">咨询AI</van-button>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 10px;
}

.overview-card {
  margin-bottom: 16px;
}

.trip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.trip-header h2 {
  font-size: 20px;
  color: #323232;
}

.trip-budget {
  font-size: 16px;
  color: #ee0a24;
  font-weight: bold;
}

.trip-collapse {
  margin-bottom: 16px;
}

.day-schedule {
  padding: 8px 0;
}

.schedule-section {
  margin-bottom: 10px;
}

.schedule-label {
  font-size: 14px;
  font-weight: bold;
  border-radius: 4px;
  padding: 4px 8px;
  display: inline-block;
  margin-bottom: 5px;
  color: #333;
}

.morning {
  background-color: #fff7e6;
  color: #fa8c16;
}

.afternoon {
  background-color: #e6f7ff;
  color: #1890ff;
}

.evening {
  background-color: #f4ffe9;
  color: #52c41a;
}

.budget-card, .tips-card, .warning-card {
  margin-bottom: 16px;
}

.section-header {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.tips-list, .warnings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li, .warnings-list li {
  padding: 8px 0;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #f5f5f5;
}

.tips-list li:last-child, .warnings-list li:last-child {
  border-bottom: none;
}

.detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  max-height: 750px;
  margin: 0 auto;
}



</style>
