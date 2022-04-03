<template>
  <van-nav-bar v-if="showTitle" :title="title" />
  <slot></slot>
  <van-tabbar v-model="activeTab">
    <van-tabbar-item icon="home-o">Dashboard</van-tabbar-item>
    <van-tabbar-item icon="info-o">Vitals</van-tabbar-item>
    <van-tabbar-item icon="envelop-o">Messages</van-tabbar-item>
    <!-- <van-tabbar-item icon="user-o">Profile</van-tabbar-item> -->
    <van-tabbar-item icon="setting-o">Settings</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  activeTab: {
    type: Number,
    default: 0,
  },
  backLink: {
    default: null,
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    type: "PregMate",
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
});
</script>
