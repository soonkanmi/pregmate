<template>
  <van-nav-bar
    v-if="showTitle"
    :title="title"
    :left-text="leftText"
    :left-arrow="leftArrow"
    @click-left="onLeftClick"
    :right-text="leftText"
    :right-arrow="leftArrow"
    @click-right="onRightClick"
  >
    <template v-if="rightIcon" #right>
      <van-icon :name="rightIconName" />
    </template>
    <template v-if="leftIcon" #left>
      <van-icon :name="leftIconName" />
    </template>
  </van-nav-bar>
  <slot></slot>
  <van-tabbar v-model="activeTab" @change="changeTab">
    <van-tabbar-item icon="home-o">Dashboard</van-tabbar-item>
    <van-tabbar-item icon="records">Vitals</van-tabbar-item>
    <!-- <van-tabbar-item icon="envelop-o">Messages</van-tabbar-item> -->
    <van-tabbar-item icon="user-o">Profile</van-tabbar-item>
    <!-- <van-tabbar-item icon="setting-o">Settings</van-tabbar-item> -->
  </van-tabbar>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  activeTab: {
    type: Number,
    default: 0,
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "PregMate",
  },
  showTitle: {
    type: Boolean,
    default: false,
  },
  leftText: {
    type: String,
    default: null,
  },
  leftArrow: {
    type: Boolean,
    default: false,
  },
  onLeftClick: {
    type: Function,
    default: () => {},
  },
  rightText: {
    type: String,
    default: null,
  },
  rightArrow: {
    type: Boolean,
    default: false,
  },
  onRightClick: {
    type: Function,
    default: () => {},
  },
  leftIcon: {
      type: Boolean,
      default: false,
  },
  leftIconName: {
      type: String,
      default: ""
  },
  rightIcon: {
      type: Boolean,
      default: false,
  },
  rightIconName: {
      type: String,
      default: ""
  }
});

const changeTab = (tabIndex) => console.log(tabIndex);

</script>
