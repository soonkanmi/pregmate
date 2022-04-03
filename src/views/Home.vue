<template>
  <app-layout title="Dashboard" backLink="login" :showTitle="true">
    <div class="p-10">
      <div class="text-left text-dark mb-5">
        <p class="text-dark-500 dark:text-white-400 text-md leading-6">
          Dashboard
        </p>
      </div>
      <div
        class="bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl rounded-b-xl p-5 pb-5 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8"
      >
        <div class="flex items-center space-x-4">
          <img
            src="/pregmate.png"
            alt=""
            width="88"
            height="88"
            class="flex-none rounded-lg bg-slate-100"
          />
          <div
            class="min-w-0 flex-auto space-y-1 justify-start text-left font-semibold text-lg"
          >
            <p class="text-cyan-500 dark:text-cyan-400 text-md leading-6">
              Welcome Angelina
            </p>
          </div>
        </div>
      </div>
      <div
        class="bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl rounded-b-xl p-4 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8 mt-5"
      >
        <div class="flex items-center space-x-4">
          <h1 class="text-white text-7xl">30</h1>
          <div
            class="min-w-0 flex-auto space-y-1 justify-start text-left font-semibold text-lg"
          >
            <p class="text-cyan-500 dark:text-cyan-400 text-md leading-6">
              Weeks
            </p>
            <h2 class="text-slate-500 dark:text-slate-400 text-sm leading-6">
              3rd trimester
            </h2>
          </div>
        </div>
      </div>
      <div
        class="mt-5 bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200 rounded-t-xl rounded-b-xl flex items-center"
      >
        <div class="flex-auto flex justify-end p-5">
          <button
            type="button"
            class="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 dark:text-slate-100 dark:ring-0 dark:bg-slate-500"
          ></button>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import { ref } from "vue";
import AppLayout from "../components/Layout.vue";

const activeTab = ref(0);
</script>
