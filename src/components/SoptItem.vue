<script setup>
import { ref, toRefs } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
const { data } = toRefs(props)
console.log(data.value)
</script>

<template>
  <div class="spot-item" v-if="data">
    <div class="spot-name">{{ data.spot }}</div>
    <div class="spot-detail" v-if="data.duration">
      <div class="detail-row">
        <van-icon name="clock-o" size="14" />
        <span>{{ data.duration }}</span>
      </div>
      <div class="detail-row">
        <van-icon name="ticket-o" size="14" />
        <span>{{ data.ticket }}</span>
      </div>
      <div class="detail-row">
        <van-icon name="logistics" size="14" />
        <span>{{ data.transportation }}</span>
      </div>
    </div>
    <div class="spot-desc" v-if="data.description">{{ data.description }}</div>
  </div>
  <div v-else class="spot-item emty">
    <van-empty class="empty" :description="暂无安排" :image-size="40" />
  </div>
</template>

<style scoped>
.spot-item {
  margin-bottom: 20px;
}

.spot-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.spot-detail {
  margin-top: 10px;
}

.detail-row {
  display: inline-block;
  margin-right: 8px;
}

.detail-row span {
  margin-left: 4px;
}

.spot-desc {
  margin-top: 10px;
}

.emty {
  text-align: center;
}

.empty {
  margin-top: 20px;
}
</style>
