<template>
  <van-nav-bar
    title="PregMate"
    left-text="Back"
    left-arrow
    @click-left="goBack"
  />
  <h3 class="mt-20 pt-10 font-bold text-xl">Login</h3>
  <div class="mt-2 pt-5 px-10">
    <van-form @submit="onSubmit">
      <van-cell-group inset class="py-3">
        <van-field
          v-model="formData.email"
          name="Email"
          label="Email"
          type="email"
          placeholder="Email"
          :rules="[{ required: true, message: 'Email is required' }]"
        />
        <van-field
          v-model="formData.password"
          type="password"
          name="Password"
          label="Password"
          placeholder="Password"
          :rules="[{ required: true, message: 'Password is required' }]"
        />
      </van-cell-group>
      <div class="mt-10 mx-5">
        <van-button
          plain
          round
          block
          type="primary"
          native-type="submit"
        >
          Login
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { useSessionStore } from './../stores/session';

const router = useRouter();
const goBack = () => router.back();
const axios = inject("axios");
const baseUrl = `${import.meta.env.VITE_API_BASE_URL}`;
const apiBase = `${import.meta.env.VITE_API_URL}`;
const sessionStore = useSessionStore();

const hasErrors = ref(false);
const errorMessage = ref("null");
const validationErrors = ref([]);

const formData = ref({
  email: "",
  password: "",
});

const onSubmit = () => {
  // router.replace({name: 'home' });
  axios.get(`${baseUrl}/sanctum/csrf-cookie`).then((response) => {
    axios.post(`${apiBase}/login`, formData.value)
      .then((response) => {
        const user = response.data.data;
        sessionStore.setUser(user);
        sessionStore.saveToLocalStorage();

        Toast.success({
          message: "Authentication successful",
          onClose: () => {
            if (!user.personal_information) {
              router.replace({ name: "personal-info-form" });
            } else {
              router.replace({ name: "home" });
            }
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

onMounted(() => {
  sessionStore.getFromLocalStorage(); // Load user session from local storage
  const user = sessionStore.getCurrentUser; // get current user

  if (user && !user.personal_information) { // check if personal information have been completed
    router.replace({ name: "personal-info-form" }); // if not, go to personal profile page
  } else if (user && user.personal_information ) {
    router.replace({ name: "home" }); // else go to home page
  }
})
</script>
