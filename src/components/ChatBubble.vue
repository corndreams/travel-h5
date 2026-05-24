<script setup>
import { computed } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  message: {
    type: Object,
    default: () => ({})
  }
})

console.log(props.message)

const messageClass = computed(() => {
  return props.message.role === 'user' ? 'user-message' : 'ai-message'
})


const showTime = computed(() => {
  return props.message.time && props.message.content
})

const renderContent = computed(() => {
  const raw = props.message.content || ''
  // 过滤思考标签
  const cleanText = raw.replace(/[\s\S]*?<\/think>/g, '')
  return marked.parse(cleanText)
})

const formatTime = computed(() => {
  if (!props.message.time) {
    return ''
  }
  const date = new Date(props.message.time)
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})
</script>

<template>
  <div class="chat-bubble" :class="messageClass">
    <div class="bubble-content">
      <div class="message-text" v-if="message.role === 'user'">{{ message.content }}</div>
      <div class="message-text" v-else>
        <div v-html="renderContent"></div>
      </div>
    </div>
    <div class="message-time" v-if="message.time">{{ message.time }}</div>
  </div>
</template>

<style scoped>
.chat-bubble {
  display: flex;
  flex-direction: column;
  /* max-width: 80%; */
}

.user-message {
  margin-bottom: 10px;
  align-items: flex-end;
  align-self: flex-end;
}

.user-message .bubble-content {
  background: #1677ff;
  color: #fff;
  padding: 10px 14px;
  border-radius: 16px 16px 4px 16px;
}

.ai-message {
  margin-bottom: 10px;
  align-self: flex-start;
  max-width: 90%;
  align-self: flex-start;
  align-items: flex-start;
}
.ai-message .bubble-content {
  background: #ffffff;
  color: #333;
  padding: 10px 14px;
  border-radius: 16px 16px 16px 4px;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.message-text {
  font-size: 14px;
  line-height: 1.5;
  word-break: break-all;
}

/* 处理markdown html样式 */
/* markdown 通用样式 */
.message-text :deep(h1) {
  font-size: 16px;
  margin: 6px 0;
}

.message-text :deep(h2) {
  font-size: 15px;
  margin: 6px 0;
}

.message-text :deep(p) {
  margin: 4px 0;
  line-height: 1.5;
}

.message-text :deep(ul) {
  padding-left: 20px;
  margin: 4px 0;
}

/* 表格样式 */
.message-text :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
}

.message-text :deep(th),
.message-text :deep(td) {
  border: 1px solid #eee;
  padding: 5px 8px;
  font-size: 13px;
}

.message-text :deep(th) {
  background-color: #f7f7f7;
}
</style>