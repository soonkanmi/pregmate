<template>
  <app-layout
    :show-title="true"
    title=""
    :right-icon="true"
    right-icon-name="setting-o"
  >
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
              Welcome {{ currentUser ? currentUser.name : "" }}
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

    <van-popup
      v-model:show="showPregnancyForm"
      :close-on-click-overlay="false"
      round
      position="bottom"
      :style="{ height: '40%' }"
    >
      <div class="p-10">
        <h2 class="my-2 leading-2 text-xl font-bold">Pregnancy Information</h2>
        <van-form @submit="submitPregnancyInfo">
          <van-cell-group inset class="py-3">
            <van-field
              v-model="selectedDateModel"
              name="date_concieved"
              label="Last Menstrual Period"
              placeholder="Last Menstrual Period"
              label-width="7em"
              :rules="[
                {
                  required: true,
                  message: 'Last Menstrual Period is required',
                },
              ]"
              required
              readonly
              @click="showDatePicker = true"
              @focus="showDatePicker = true"
            />
            <van-calendar
              v-model:show="showDatePicker"
              @confirm="setConceiveDate"
              color="#1644DE"
              :max-date="maxDate"
              :min-date="minDate"
            />
          </van-cell-group>
          <div class="mt-10 mx-5">
            <van-button plain round block type="primary" native-type="submit">
              Save Pregnancy Info
            </van-button>
          </div>
        </van-form>
      </div>
    </van-popup>

    <van-popup
      v-model:show="hasErrors"
      closeable
      round
      close-icon="close"
      position="bottom"
      :style="{ height: '30%' }"
      @closed="clearErrors"
    >
      <div class="p-10">
        <h2 class="my-2 leading-4 text-red-500 text-lg font-bold">Error!</h2>
        <h3 class="my-2 leading-6">{{ errorMessage }}</h3>
        <ul v-if="validationErrors.length">
          <li
            class="my-1 text-red-500"
            v-for="(error, index) in validationErrors"
            :key="index"
          >
            {{ error }}
          </li>
        </ul>
      </div>
    </van-popup>
  </app-layout>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import AppLayout from "../components/Layout.vue";
import { useSessionStore } from "../stores/session";
import {
  calculateDateConcieved,
  getFirstTrimester,
  getSecondTrimester,
  getEstimatedDueDate,
} from "../utils/calculator";

import { Toast } from "vant";

const router = useRouter();
const axios = inject("axios");
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const apiBase = `${import.meta.env.VITE_API_URL}`;
const sessionStore = useSessionStore();

const currentUser = ref(null);
const showPregnancyForm = ref(false);
const showDatePicker = ref(false);
const selectedDate = ref(null);
const selectedDateModel = ref(null);

const minDate = ref(new Date());
const maxDate = ref(new Date());

minDate.value = new Date(minDate.value.setDate(minDate.value.getDate() - 90));

maxDate.value = new Date();

const formatDate = (date) => {
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();

  selectedDate.value = date;

  return `${day}-${month}-${date.getFullYear()}`;
};

const setConceiveDate = (value) => {
  showDatePicker.value = false;
  selectedDateModel.value = formatDate(value);
};

const hasErrors = ref(false);
const errorMessage = ref("null");
const validationErrors = ref([]);

const pregFormData = ref({
  date_concieved: null,
  first_trimester_ends: null,
  second_trimester_ends: null,
  estimated_due_date: null,
});

const clearErrors = () => {
  hasErrors.value = false;
  errorMessage.value = null;
  validationErrors.value = [];
};

const submitPregnancyInfo = () => {
  clearErrors();

  const toast = Toast.loading({
    message: "Loading...",
    forbidClick: true,
    loadingType: "spinner",
    overlay: true,
    duration: 0,
  });

  pregFormData.value.date_concieved = calculateDateConcieved(
    selectedDate.value
  );
  pregFormData.value.first_trimester_ends = getFirstTrimester(
    selectedDate.value
  );
  pregFormData.value.second_trimester_ends = getSecondTrimester(
    selectedDate.value
  );
  pregFormData.value.estimated_due_date = getEstimatedDueDate(
    selectedDate.value
  );

  axios.get(`${baseUrl}/sanctum/csrf-cookie`).then(() => {
    axios
      .post(`${apiBase}/save-pregnancy-information`, pregFormData.value)
      .then((response) => {
        const user = response.data.data;
        sessionStore.setUser(user);
        sessionStore.saveToLocalStorage();

        Toast.success({
          message: "Pregnancy Information saved successfully",
          onClose: () => {
            document.location.reload();
          },
        });
      })
      .catch((err) => {
        errorMessage.value =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "An unexpected error occured";

        if (err.response && err.response.status === 422) {
          errorMessage.value = "Validation errors";
          validationErrors.value = Object.values(err.response.data.errors)
            .join(",")
            .split(",");
        } else {
          Toast.fail(errorMessage.value);
        }

        hasErrors.value = true;
      });
  });
};

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
    return router.replace({ name: "personal-info-form" });
  } else if (!user.obstetrical_information) {
    return router.replace({ name: "obstetrical-info-form" });
  } else if (!user.medical_information) {
    return router.replace({ name: "medical-info-form" });
  }

  if (!user.pregnancy_information) {
    showPregnancyForm.value = true;
  }

  currentUser.value = user;
});
</script>
