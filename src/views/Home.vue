<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const router = useRouter()

const show = ref(false)
const isLoading = ref(false)

const showPopup = () => {
  show.value = true
  console.log(show.value)
}

const onConfirm = ({ selectedOptions }) => {
  show.value = false
  searchForm.city = selectedOptions[0].value
}

const onCancel = () => {
  show.value = false
}

const allCities = ['北京', '上海', '广州', '深圳', '成都', '西安', '重庆', '杭州', '南京', '武汉', '天津', '成都', '重庆']
const hotCities = allCities.slice(0, 8)
const columns = allCities.map((city) => {
  return {
    text: city,
    value: city
  }
})

const searchForm = reactive({
  city: '',
  days: '',
  budget: ''
})

const handleSubmit = () => {
  isLoading.value = true
  if(!searchForm.city){
    isLoading.value = false
    showToast('请输入目的地')
    return
  }
  if(!searchForm.days || searchForm.days <= 0 || searchForm.days > 30){
    isLoading.value = false
    showToast('请输入行程天数,1-30天')
    return
  }
  if(!searchForm.budget || searchForm.budget <= 100){
    isLoading.value = false
    showToast('请输入预算(元),预算不能小于100元')
       return
  }

  router.push({
    path: '/detail',
    query: {
      city: searchForm.city,
      days: searchForm.days,
      budget: searchForm.budget
    }
  })
}

const toPage = (path) => {
  router.push(path)
}

const changeCity = (city) => {
  searchForm.city = city
}
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <van-nav-bar fixed title="首页" />
    </div>
    <div class="page-content">
      <van-notice-bar left-icon="info-o" text="基于AI的智能景点介绍与行程规划助手" style="margin-bottom: 10px;" />
      <div class="card search-card">
        <div class="section-title">规划你的行程</div>
        <van-field is-link readonly v-model="searchForm.city" placeholder="请输入目的地" label="目的地" @click="showPopup"
          style="background-color: #f5f5f5;border-radius: 8px;margin-top: 12px;" />
        <van-field v-model="searchForm.days" placeholder="请输入行程天数" label="行程天数" type="number"
          style="background-color: #f5f5f5;border-radius: 8px;margin-top: 12px;" />
        <van-field v-model="searchForm.budget" placeholder="请输入预算(元)" label="预算(元)" type="number"
          style="background-color: #f5f5f5;border-radius: 8px;margin-top: 12px;" />
        <van-button type="primary" block style="margin-top: 12px;" round @click="handleSubmit"
          :loading="isLoading">查询</van-button>
      </div>
      <div class="card quick-actions">
        <div class="section-title">快捷入口</div>
        <van-grid :column-num="2" :gutter="12" style="margin-top: 10px;">
          <van-grid-item icon="chat-o" text="对话" @click="toPage('/chat')" />
          <van-grid-item icon="user-o" text="我的" @click="toPage('/profile')" />
        </van-grid>
      </div>
      <div class="card hot-cities">
        <div class="section-title">热门城市</div>
        <van-grid :column-num="4" :gutter="12" style="margin-top: 10px;">
          <van-grid-item v-for="city in hotCities" :key="city" :text="city" @click="changeCity(city)">
            <div class="city-tag" :class="{ 'active': city === searchForm.city }">{{ city }}</div>
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }">
      <van-picker title="请选择目的地" :columns="columns" @confirm="onConfirm" @cancel="onCancel" />
    </van-popup>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 10px;
}

.card {
  margin-bottom: 10px;
}

.city-tag {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f5f5f5;
}

.city-tag.active {
  background-color: #1989fa;
  color: #fff;
}
</style>
