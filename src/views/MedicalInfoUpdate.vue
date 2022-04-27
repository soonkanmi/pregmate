<template>
  <van-nav-bar
    title="PregMate"
    left-text="Back"
    left-arrow
    @click-left="goBack"
  />
  <h3 class="mt-20 pt-10 font-bold text-xl">Medical Information</h3>
  <div class="mt-2 pt-5 px-10">
    <van-form @submit="onSubmit">
      <van-cell-group class="py-3">
        <van-field
          v-model="formData.bloodgroup"
          name="bloodgroup"
          label="Blood Group"
          placeholder="Bloog Group"
          label-width="7em"
          :rules="[
            {
              required: true,
              message: 'Blood group is required',
            },
          ]"
          required
          readonly
          @click="showBGPicker = true"
          @focus="showBGPicker = true"
        />
        <van-popup v-model:show="showBGPicker" round position="bottom">
          <van-picker
            title="Bloog Group"
            :columns="bloodGroups"
            @cancel="showBGPicker = false"
            @confirm="setBloodGroup"
          />
        </van-popup>
        <van-field
          v-model="formData.allergies"
          name="allergies"
          label="Any  Allergy?"
          placeholder="Allergy(ies)"
          label-width="7em"
        />
        <van-field
          v-model="formData.rhesus_factor"
          name="rhesus_factor"
          label="Rhesus Factor"
          placeholder="Rhesus factor"
          label-width="7em"
          :rules="[
            {
              required: true,
              message: 'Rhesus Factor is required',
            },
          ]"
          required
          readonly
          @click="showRFPicker = true"
          @focus="showRFPicker = true"
        />
        <van-popup v-model:show="showRFPicker" round position="bottom">
          <van-picker
            title="Rhesus Factor"
            :columns="rhesuFactors"
            @cancel="showRFPicker = false"
            @confirm="setRF"
          />
        </van-popup>
      </van-cell-group>
      <div class="mt-10 mx-5">
        <van-button plain round block type="primary" native-type="submit">
          Update
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

const currentUser = ref(null);

const showBGPicker = ref(false);
const showRFPicker = ref(false);

const formData = ref({
  bloodgroup: "",
  allergies: "",
  rhesus_factor: "",
});

const bloodGroups = [
  { text: "A", value: "A" },
  { text: "B", value: "B" },
  { text: "O", value: "O" },
  { text: "AB", value: "AB" },
];

const rhesuFactors = [
  { text: "Positive", value: "Positive" },
  { text: "Negative", value: "Negative" },
];

const setBloodGroup = (selectedOptions) => {
  showBGPicker.value = false;
  formData.value.bloodgroup = selectedOptions.value;
};

const setRF = (selectedOptions) => {
  showRFPicker.value = false;
  formData.value.rhesus_factor = selectedOptions.value;
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
      .post(`${apiBase}/update-medical-information`, formData.value)
      .then((response) => {
        const user = response.data.data;

        sessionStore.setUser(user);
        sessionStore.saveToLocalStorage();

        Toast.success({
          message: response.data.message,
          onClose: () => {
            router.replace({ name: "profile" });
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

  if (user.medical_information) {
    const medData = user.medical_information;

    formData.value = {
      bloodgroup: medData.bloodgroup,
      rhesus_factor: medData.rhesus_factor,
      allergies: medData.allergies,
    };
  }
});
</script>
