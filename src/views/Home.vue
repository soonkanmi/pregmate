<template>
  <app-layout :show-title="true" title="" :right-icon="true" right-icon-name="setting-o">
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
              Welcome {{ currentUser ? currentUser.name : '' }}
            </p>
          </div>
        </div>
      </div>
      <div
        class="bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-500 border-b rounded-t-xl rounded-b-xl p-4 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8 mt-5"
      >
        <div class="flex items-center space-x-4">
          <h1 class="text-black-600 dark:text-white text-7xl">30</h1>
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
        class="bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200 rounded-t-xl rounded-b-xl flex items-center p-4 sm:p-10 sm:pb-8 lg:p-6 xl:p-10 xl:pb-8 space-y-6 sm:space-y-8 lg:space-y-6 xl:space-y-8 mt-5 cursor-pointer"
        @click="goToVitals"
      >
        <div class="flex items-center space-x-4">
          <van-icon
            name="records"
            class="text-black-500 dark:text-white"
            size="4rem"
          />
          <div
            class="min-w-0 flex-auto space-y-1 justify-start text-left font-semibold text-lg"
          >
            <p class="text-cyan-500 dark:text-cyan-400 text-md leading-6">
              Vitals
            </p>
            <p class="text-slate-500 dark:text-slate-400 text-sm">
              Your vitals have been submitted for the day.
            </p>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "../components/Layout.vue";
import { useSessionStore } from "../stores/session";

const router = useRouter();
const sessionStore = useSessionStore();

const currentUser = ref(null);

const goToVitals = () => {
  console.log("Loading Vitals");
};

onMounted(() => {
  sessionStore.getFromLocalStorage(); // Load user session from local storage
  const user = sessionStore.getCurrentUser; // get current user

  if (!user) {
    // check if active user
    return router.replace("login"); // if not, go to login page
  }

  if (!user.personal_information) {
    return router.replace({'name': 'personal-info-form'});
  } else if (!user.obstetrical_information) {
    return router.replace({'name': 'obstetrical-info-form'});
  } else if (!user.medical_information) {
    return router.replace({'name': 'medical-info-form'});
  }

  currentUser.value = user;
});
</script>
