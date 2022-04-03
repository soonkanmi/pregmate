<template>
  <van-nav-bar title="PregMate" />
  <div class="p-10">
    <div
      class="bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl p-4 pb-6 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8"
    >
      <div class="flex items-center space-x-4">
        <img
          src="/full-stack-radio.png"
          alt=""
          width="88"
          height="88"
          class="flex-none rounded-lg bg-slate-100"
        />
        <div class="min-w-0 flex-auto space-y-1 font-semibold">
          <p class="text-cyan-500 dark:text-cyan-400 text-sm leading-6">
            <abbr title="Episode">Ep.</abbr> 128
          </p>
          <h2
            class="text-slate-500 dark:text-slate-400 text-sm leading-6 truncate"
          >
            Scaling CSS at Heroku with Utility Classes
          </h2>
          <p class="text-slate-900 dark:text-slate-50 text-lg">
            Full Stack Radio
          </p>
        </div>
      </div>
      <div class="space-y-2">
        <div class="relative">
          <div
            class="bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden"
          >
            <div
              class="bg-cyan-500 dark:bg-cyan-400 w-1/2 h-2"
              role="progressbar"
              aria-label="music progress"
              aria-valuenow="1456"
              aria-valuemin="0"
              aria-valuemax="4550"
            ></div>
          </div>
          <div
            class="ring-cyan-500 dark:ring-cyan-400 ring-2 absolute left-1/2 top-1/2 w-4 h-4 -mt-2 -ml-2 flex items-center justify-center bg-white rounded-full shadow"
          >
            <div
              class="w-1.5 h-1.5 bg-cyan-500 dark:bg-cyan-400 rounded-full ring-1 ring-inset ring-slate-900/5"
            ></div>
          </div>
        </div>
        <div
          class="flex justify-between text-sm leading-6 font-medium tabular-nums"
        >
          <div class="text-cyan-500 dark:text-slate-100">24:16</div>
          <div class="text-slate-500 dark:text-slate-400">75:50</div>
        </div>
      </div>
    </div>
    <div
      class="bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200 rounded-b-xl flex items-center"
    >
      <div class="flex-auto flex justify-end p-5">
        <button
          type="button"
          class="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 dark:text-slate-100 dark:ring-0 dark:bg-slate-500"
        >
          1x
        </button>
      </div>
    </div>
  </div>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="home-o">Dashboard</van-tabbar-item>
    <van-tabbar-item icon="info-o">Vitals</van-tabbar-item>
    <van-tabbar-item icon="envelop-o">Messages</van-tabbar-item>
    <van-tabbar-item icon="user-o">Profile</van-tabbar-item>
    <van-tabbar-item icon="setting-o">Settings</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from "vue";

const active = ref(0);
</script>
