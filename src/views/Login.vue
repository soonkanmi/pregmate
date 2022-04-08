<template>
  <van-nav-bar title="PregMate" left-text="Back" left-arrow @click-left="goBack" />
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
        <van-button plain round block type="primary" native-type="submit" @click="onSubmit"> Login </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const goBack = () => router.back();

const formData = ref({
  email: "",
  password: "",
});

const onSubmit = () => router.replace({name: 'home' });
</script>
