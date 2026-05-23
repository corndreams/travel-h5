<script setup>
import { ref } from 'vue'

const active = ref(0)

</script>

<template>
  <div class="container">
    <router-view />
      <van-tabbar v-model="active" route>
        <van-tabbar-item icon="home-o" to="/" >首页</van-tabbar-item>
        <van-tabbar-item icon="chat-o" to="/chat">对话</van-tabbar-item>
        <van-tabbar-item icon="user-o" to="/profile">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>
