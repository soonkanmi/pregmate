<template>
  <van-nav-bar
    title="PregMate"
    left-text="Back"
    left-arrow
    @click-left="goBack"
  />
  <h3 class="mt-20 pt-10 font-bold text-xl">Register</h3>
  <div class="mt-2 pt-5 px-10">
    <van-form @submit="onSubmit">
      <van-cell-group class="py-3">
        <van-field
          v-model="formData.name"
          name="name"
          label="Name"
          placeholder="Full Name"
          :rules="[{ required: true, message: 'Name is required' }]"
          required
        />
        <van-field
          v-model="formData.email"
          name="email"
          label="Email"
          type="email"
          placeholder="Email"
          :rules="[{ required: true, message: 'Email is required' }]"
          required
        />
        <van-field
          v-model="formData.password"
          type="password"
          name="password"
          label="Password"
          placeholder="Password"
          :rules="[{ required: true, message: 'Password is required' }]"
          required
        />
        <van-field
          v-model="formData['password_confirmation']"
          type="password"
          name="password_confirmation"
          label="Confirm Password"
          placeholder="Confirm Password"
          :rules="[
            { required: true, message: 'Confirm Password is required' },
            { equal: 'password', message: 'Passwords does not match' },
          ]"
          required
        />
      </van-cell-group>
      <div class="mt-10 mx-5">
        <van-button plain round block type="primary" native-type="submit">
          Register
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
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
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
      .post(`${apiBase}/register`, formData.value)
      .then((response) => {
        Toast.success({
          message: "Registration successful",
          onClose: () => {
            router.replace({ name: "personal-info-form" });
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

        hasErrors.value = true;
      })
      .finally(() => {
        Toast.clear();
      });
  });
};
</script>
