<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

import { fetchStream } from '@/api/requset'
import { showToast } from 'vant'
import ChatBubble from '@/components/ChatBubble.vue'


const router = useRouter()

const messages = ref([])

const quickQuestions = ref([
  '北京有哪些必去的景点？',
  '上海美食推荐',
  '成都三日游攻略',
  '如何购买旅行保险？',
])

const tagClick = (question) => { }

const inputMessage = ref('')

const isStreaming = ref(false)

const addUserMessage = (content) => {
  messages.value.push({
    id: Date.now(),
    role: 'user',
    content,
    timestamp: new Date().toISOString()
  })
}

const sendMessage = () => {
  const msg = inputMessage.value.trim()
  if (!msg || isStreaming.value) {
    return
  }
  addUserMessage(msg)
  inputMessage.value = ''

  fetchResponse(msg)
}

const fetchResponse = (msg) => {
  isStreaming.value = true
  messages.value.push({
    id: Date.now() + 1,
    role: 'ai',
    content: '',
    timestamp: new Date().toISOString()
  })

  let fullResponse = ''
  let inThinkBlock = false

  fetchStream('/chat', {
    message: msg
  }, (chunk) => {
    // fullResponse += chunk
    // const lastMessage = messages.value[messages.value.length - 1]
    // console.log(messages)
    // if (lastMessage && lastMessage.role === 'ai') {
    //   lastMessage.content = fullResponse
    // }
    fullResponse += chunk;

    // 实时更新UI（原样显示，结束后再过滤）
    const lastMessage = messages.value.at(-1);
    if (lastMessage?.role === "ai") {
      lastMessage.content = fullResponse;
    }
  },
    () => {
      isStreaming.value = false;

      // 流结束后，一次性过滤掉  标签和内容
      const lastMessage = messages.value.at(-1);
      if (lastMessage?.role === "ai") {
        // 用正则一次性过滤所有  标签内容
        const cleanContent = lastMessage.content
          .replace(/[\s\S]*?<\/think>/g, "") // 过滤标签及内容
          .replace(/\n{3,}/g, "\n\n"); // 合并多余换行

        lastMessage.content = cleanContent;
      }
    }, () => {
      isStreaming.value = false
    }, (errorMsg) => {
      const lastMessage = messages.value[messages.value.length - 1]
      if (lastMessage && lastMessage.role === 'ai') {
        lastMessage.content = errorMsg
      }
      showToast('请求失败，请稍后重试。')

    })
}
</script>

<template>
  <div class="page-container chat-page">
    <div class="page-header">
      <van-nav-bar fixed title="AI旅游助手" left-arrow left-text="返回" @click-left="router.back()" />
    </div>
    <div class="chat-container">
      <div v-if="messages.length === 0" class="chat-empty">
        <van-empty description="开始和AI旅游助手对话吧！" />
        <div class="quick-questions">
          <div class="quick-title">常见问题</div>
          <van-tag v-for="question in quickQuestions" :key="question" class="quick-tag" mark size="large"
            @click="tagClick(question)">{{ question }}</van-tag>
        </div>
      </div>
      <div v-else class="message-list">
        <ChatBubble v-for="message in messages" :key="message.id" :message="message" />
        <div class="streaming-indicator" v-if="isStreaming">
          <van-loading type="spinner" size="20" />
          <span>AI正在思考中...</span>
        </div>
      </div>
    </div>
    <div class="chat-input-area">
      <van-field v-model="inputMessage" placeholder="请输入您的问题..." :disabled="isStreaming" clearable
        @keyup.enter="sendMessage">
        <template #button>
          <van-button type="primary" @click="sendMessage" :disabled="isStreaming">发送</van-button>
        </template>
      </van-field>
    </div>
  </div>
</template>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
}

.chat-container {
  overflow: auto;
  padding: 16px;
  max-height: calc(100vh - 200px);
}

.chat-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90%;
}

.quick-questions {
  margin-top: 20px;
  text-align: center;
}

.quick-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.quick-tag {
  margin: 5px 10px;
  cursor: pointer;
}

.chat-input-area {
  position: fixed;
  bottom: 50px;
  left: 0;
  right: 0;
  padding: 8px 16px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  max-width: 750px;
  margin: 0 auto;
}
</style>
