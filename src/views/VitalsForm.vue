<template>
  <van-nav-bar
    title="PregMate"
    left-text="Back"
    left-arrow
    @click-left="goBack"
  />
  <h3 class="mt-20 pt-10 font-bold text-xl">Submit Daily Vitals</h3>
  <div class="mt-2 pt-5 px-10">
    <van-form @submit="onSubmit">
      <van-cell-group class="py-3">
        <van-field
          v-model="formData.weight"
          name="weight"
          label="Weight"
          placeholder="Weight (kg)"
          label-width="18em"
          :rules="[{ required: true, message: 'Weight is required' }]"
          required
          type="number"
        />
        <van-field
          v-model="formData.blood_pressure_systolic"
          name="blood_pressure_systolic"
          label="Blood Pressure Systolic (mmHg)"
          placeholder="Blood Pressure Systolic"
          label-width="18em"
          :rules="[
            { required: true, message: 'Blood Pressure systolic is required' },
          ]"
          required
          type="number"
        />
        <van-field
          v-model="formData.blood_pressure_diastolic"
          name="blood_pressure_diastolic"
          label="Blood Pressure Diastolic (mmHg)"
          placeholder="Blood Pressure Diastolic"
          label-width="18em"
          :rules="[
            { required: true, message: 'Blood Pressure Diastolic is required' },
          ]"
          required
          type="number"
        />
        <van-field
          v-model="formData.temperature"
          name="temperature"
          label="Temperature"
          placeholder="Temperature in degree"
          label-width="18em"
          :rules="[{ required: true, message: 'Temperature is required' }]"
          required
          type="number"
        />
        <van-field
          v-model="formData.fluid_intake"
          name="fluid_intake"
          label="Fluid Intake (ml)"
          placeholder="Fluid intake (ml)"
          label-width="18em"
          :rules="[{ required: true, message: 'Fluid intake is required' }]"
          required
          type="number"
        />
        <van-cell-group>
          <van-cell>
            <template #right-icon>
              <van-checkbox v-model="formData.drug_intake" shape="square"
                >Have you taken your drugs today?</van-checkbox
              >
            </template>
          </van-cell>
        </van-cell-group>
      </van-cell-group>

      <div class="mt-10 mx-5">
        <van-button plain round block type="primary" native-type="submit">
          Save Vitals
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
import { ref, inject } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";

const router = useRouter();
const axios = inject("axios");
const goBack = () => router.back();

const formData = ref({
  weight: "",
  blood_pressure_systolic: "",
  blood_pressure_diastolic: "",
  temperature: "",
  fluid_intake: "",
  drug_intake: "",
});

const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const apiBase = `${import.meta.env.VITE_API_URL}`;

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
      .post(`${apiBase}/record-vitals`, formData.value)
      .then((response) => {
        Toast.success({
          message: "Submit Your Vitals",
          onClose: () => {
            router.replace({ name: "vitals-list" });
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
</script>
