<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  total: {
    type: [Number, String],
    default: 0
  }
})

console.log(props.total)



const budgetData = computed(() => {
  return {
    accommodation: props.data.accommodation || 0,
    food: props.data.food || 0,
    transportation: props.data.transportation || 0,
    tickets: props.data.tickets || 0,
    other: props.data.other || 0, 
  }
})

const labelMap = {
  accommodation: '住宿',
  food: '餐饮',
  transportation: '交通',
  tickets: '门票',
  other: '其他',
}

const getLabel = (key) => {
  return labelMap[key] || key
}

</script>

<template>
  <div class="budget-table">
    <van-cell-group :border="false">
      <van-cell v-for="(item, key) in budgetData" :key="key" :title="getLabel(key)" :value="`${item}元`"
        :border="false" />
    </van-cell-group>
    <div class="total">
      <span>总计 </span>
      <span class="total-value">{{ total }}元</span>
    </div>
  </div>
</template>

<style scoped>
.budget-table {
  margin-top: 8px;
}

.total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background-color: #f5f5f5;
  border-radius: 10px;
}

.total-value {
  font-size: 16px;
  color: #ee0a24;
  font-weight: bold;
}
</style>
