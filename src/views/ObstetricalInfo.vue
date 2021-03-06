<template>
  <van-nav-bar title="PregMate" />
  <h3 class="mt-20 pt-10 font-bold text-xl">Obstetrical Information</h3>
  <div class="mt-2 pt-5 px-10">
    <van-form @submit="onSubmit">
      <van-cell-group class="py-3">
        <van-field
          v-model="formData.previous_pregnancies"
          name="previous_pregnancies"
          label="# Previous Pregnancies"
          placeholder="No. of Previous Pregnancies"
          label-width="7em"
          :rules="[
            {
              required: true,
              message: 'No. of previous pregnancies is required',
            },
          ]"
          required
        />
        <van-field
          v-model="formData.liveborns"
          name="liveborns"
          label="# of Live born"
          placeholder="No. of Live born"
          label-width="7em"
          :rules="[{ required: true, message: 'No. of live born is required' }]"
          required
        />
        <van-field
          v-model="formData.stillbirths"
          name="stillbirths"
          label="# of Still births"
          placeholder="No. of Still births"
          label-width="7em"
          :rules="[
            { required: true, message: 'No. of still births is required' },
          ]"
          required
        />
        <van-field
          v-model="formData.previous_mode_of_delivery"
          name="previous_mode_of_delivery"
          label="Prev. mode of Delivery"
          placeholder="Prev. mode of Delivery"
          label-width="7em"
          :rules="[
            {
              required: true,
              message: 'Previous mode of delivery is required',
            },
          ]"
          required
          readonly
          @click="showPicker = true"
          @focus="showPicker = true"
        />
        <van-popup v-model:show="showPicker" round position="bottom">
          <van-picker
            title="Mode of Delivery"
            :columns="modeOfDeliveries"
            @cancel="showPicker = false"
            @confirm="setDeliveryValue"
          />
        </van-popup>
      </van-cell-group>
      <div class="mt-10 mx-5">
        <van-button plain round block type="primary" native-type="submit">
          Proceed
        </van-button>
      </div>
    </van-form>
  </div>

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
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../stores/session";
import { Toast } from "vant";

const router = useRouter();
const goBack = () => router.back();
const axios = inject("axios");
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const apiBase = `${import.meta.env.VITE_API_URL}`;
const sessionStore = useSessionStore();

const showDatePicker = ref(false);
const currentUser = ref(null);

const showPicker = ref(false);
const formData = ref({
  previous_pregnancies: 0,
  liveborns: 0,
  stillbirths: 0,
  previous_mode_of_delivery: "",
});

const modeOfDeliveries = [
  { text: "Not Applicable", value: "Not Applicable" },
  { text: "Ceaserean Session", value: "Ceaserean Session" },
  { text: "Normal Delivery", value: "Normal Delivery" },
];

const setDeliveryValue = (selectedOptions) => {
  showPicker.value = false;
  formData.value.previous_mode_of_delivery = selectedOptions.value;
};

const hasErrors = ref(false);
const errorMessage = ref("null");
const validationErrors = ref([]);

const clearErrors = () => {
  hasErrors.value = false;
  errorMessage.value = null;
  validationErrors.value = [];
};

const onSubmit = () => {
  clearErrors();

  const toast = Toast.loading({
    message: "Loading...",
    forbidClick: true,
    loadingType: "spinner",
    overlay: true,
    duration: 0,
  });

  axios.get(`${baseUrl}/sanctum/csrf-cookie`).then((response) => {
    axios
      .post(`${apiBase}/update-obstetrical-information`, formData.value)
      .then((response) => {
        const user = response.data.data;

        sessionStore.setUser(user);
        sessionStore.saveToLocalStorage();

        Toast.success({
          message: response.data.message,
          onClose: () => {
            router.replace({ name: "home" });
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
        }

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

        hasErrors.value = true;
      })
      .finally(() => {
        Toast.clear();
      });
  });
};

onMounted(() => {
  sessionStore.getFromLocalStorage(); // Load user session from local storage
  const user = sessionStore.getCurrentUser; // get current user

  if (!user) {
    // check if active user
    return router.replace("login"); // if not, go to login page
  }

  currentUser.value = user;

  if (user.obstetrical_information) {
    const obsData = user.obstetrical_information;

    formData.value = {
      previous_pregnancies: obsData.previous_pregnancies,
      liveborns: obsData.liveborns,
      stillbirths: obsData.stillbirths,
      previous_mode_of_delivery: obsData.previous_mode_of_delivery,
    };
  }
});
</script>
