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
        <van-field v-model="formData['password-confirmation']" type="password"
        name="password-confirmation" label="Confirm Password"
        placeholder="Confirm Password" :rules="[{ required: true, message:
        'Confirm Password is required' }, { equalTo: 'password', message:
        'Passwords does not match' }]" required/>
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
          Register
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

const formData = ref({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const onSubmit = () => router.replace({ name: "personal-info-form" });
</script>
