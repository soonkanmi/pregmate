<template>
  <app-layout :show-title="true" title="PregMate" :active-tab="1">
    <h3 class="mt-5 mb-5 pt-5 font-bold text-xl">Daily Vitals</h3>
    <van-button
      plain
      hairline
      type="primary"
      size="small"
      :to="{ name: 'vitals-form' }"
      >Submit Vital</van-button
    >
    <div class="mt-2 pt-5 px-10 h-5/6">
      <van-pull-refresh
        :head-height="80"
        v-model="refreshing"
        @refresh="onRefresh"
      >
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="Loaded"
          @load="onLoad"
        >
          <van-cell-group v-for="item in vitals" :key="item.id">
            <van-cell
              title-class="text-left"
              title="Date"
              :value="new Date(item.created_at).toDateString()"
              size="large"
            />
            <van-cell
              title-class="text-left"
              title="Weight"
              :value="`${item.weight}kg`"
              size="large"
            />
            <van-cell
              title-class="text-left"
              title="Blood Pressure"
              :value="`${item.blood_pressure_systolic}/${item.blood_pressure_diastolic}mmHg`"
              size="large"
            />
            <van-cell
              title-class="text-left"
              title="Temperature"
              :value="`${item.temperature}°`"
              size="large"
            />
            <van-cell
              title-class="text-left"
              title="Fluid Intake"
              :value="`${item.fluid_intake}°ml(s)`"
              size="large"
            />
            <van-cell
              title-class="text-left"
              title="Drug Intake"
              :value="item.drug_intake ? 'Yes' : 'No'"
              size="large"
            />
            <van-divider />
          </van-cell-group>
        </van-list>
      </van-pull-refresh>
    </div>
  </app-layout>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "../components/Layout.vue";
import { Toast } from "vant";
import { useSessionStore } from "../stores/session";

const router = useRouter();
const axios = inject("axios");
const goBack = () => router.back();
const sessionStore = useSessionStore();

const refreshing = ref(false);
const finished = ref(false);
const loading = ref(false);

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const apiBase = `${import.meta.env.VITE_API_URL}`;

const vitals = ref([]);

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

const onLoad = () => {
  const toast = Toast.loading({
    message: "Loading...",
    forbidClick: true,
    loadingType: "spinner",
    overlay: true,
    duration: 0,
  });

  refreshing.value = false;

  axios.get(`${baseUrl}/sanctum/csrf-cookie`).then((response) => {
    axios
      .get(`${apiBase}/get-vitals`)
      .then((response) => {
        vitals.value = response.data.data;
      })
      .catch((err) => {
        const errorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "An unexpected error occured";

        if (err.response && err.response.status === 401) {
          sessionStore.clearSession();
          Toast.success({
            message: "Session Expired",
            onClose: () => {
              router.replace({ name: "login" });
            },
          });

          return;
        }
      })
      .finally(() => {
        Toast.clear();
        refreshing.value = false;
        finished.value = true;
        // loading.value = false;
      });
  });
};
</script>
