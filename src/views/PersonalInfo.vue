<template>
  <van-nav-bar
    title="PregMate"
  />
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
          v-model="formData.dob"
          name="dob"
          label="Date of Birth"
          placeholder="Date or Birth"
          label-width="7em"
          :rules="[{ required: true, message: 'Date of Birth is required' }]"
          :max-date="maxDate"
          required
          @click="showDatePicker = true"
        />
        <van-calendar v-model:show="showDatePicker" @confirm="onDateSelected" />
        <van-field
          v-model="formData.nextOfKin"
          name="nextOfKin"
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
        <van-button
          plain
          round
          block
          type="primary"
          native-type="submit"
          @click="onSubmit"
        >
          Proceed
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => router.back();

const showDatePicker = ref(false);
const formData = ref({
  name: "",
  dob: "",
});

const formatDate = (date) => `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
const onDateSelected = (value) => {
      showDatePicker.value = false;
      formData.value.dob = formatDate(value);
};
const maxDate = new Date();

const onSubmit = () => router.replace({ name: "personal-info-form" });
</script>
