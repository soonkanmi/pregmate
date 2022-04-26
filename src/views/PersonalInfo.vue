<template>
  <van-nav-bar title="PregMate" />
  <h3 class="mt-20 pt-10 font-bold text-xl">Personal Information</h3>
  <div class="mt-2 pt-5 px-10">
    <van-form @submit="onSubmit">
      <van-cell-group class="py-3">
        <van-field
          v-model="formData.name"
          name="name"
          label="Name"
          placeholder="Full Name"
          label-width="7em"
          :rules="[{ required: true, message: 'Name is required' }]"
          required
        />
        <van-field
          v-model="formData.phone"
          name="phone"
          label="Phone #"
          placeholder="Phone number"
          label-width="7em"
          :rules="[{ required: true, message: 'Phone number is required' }]"
          required
        />
        <van-field
          v-model="formData.date_of_birth"
          name="date_of_birth"
          label="Date of Birth"
          placeholder="Date or Birth"
          label-width="7em"
          :rules="[{ required: true, message: 'Date of Birth is required' }]"
          required
          readonly
          @click="showDatePicker = true"
          @focus="showDatePicker = true"
        />
        <van-calendar
          v-model:show="showDatePicker"
          @confirm="onDateSelected"
          :max-date="maxDate"
          :min-date="minDate"
          color="#1644DE"
        />
        <van-field
          v-model="formData.next_of_kin"
          name="next_of_kin"
          label="Next of Kin"
          placeholder="Next of Kin"
          label-width="7em"
          :rules="[{ required: true, message: 'Next of Kin is required' }]"
          required
        />
        <van-field
          v-model="formData.address"
          name="address"
          label="Address"
          placeholder="Address"
          label-width="7em"
          :rules="[{ required: true, message: 'Address is required' }]"
          required
          autosize
          type="textarea"
        />
        <van-field
          v-model="formData.occupation"
          name="occupation"
          label="Occupation"
          placeholder="Occupation"
          label-width="7em"
          :rules="[{ required: true, message: 'Occupation is required' }]"
          required
        />
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

const formData = ref({
  name: "",
  phone: "",
  date_of_birth: "",
  next_of_kin: "",
  address: "",
  occupation: "",
});

const formatDate = (date) => {
  let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  let month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth();

  return `${day}-${month}-${date.getFullYear()}`;
};

const onDateSelected = (value) => {
  showDatePicker.value = false;
  formData.value.date_of_birth = formatDate(value);
};

const minDate = ref(new Date());
const maxDate = ref(new Date());

minDate.value = new Date(
  minDate.value.setFullYear(minDate.value.getFullYear() - 60)
);
maxDate.value = new Date(
  maxDate.value.setFullYear(maxDate.value.getFullYear() - 15)
);

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
      .post(`${apiBase}/update-personal-information`, formData.value)
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

  formData.value.name = user.name;
});
</script>
