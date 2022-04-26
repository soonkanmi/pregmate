<template>
  <div class="h-screen grid content-center">
    <div class="w-80 justify-self-center">
      <van-row justify="center" type="flex">
        <van-col>
          <transition name="van-slide-up">
            <img v-show="visible" src="/pregmate.png" class="logo" />
          </transition>
        </van-col>
      </van-row>
      <van-row justify="center" class="my-4">
        <transition name="van-fade" delay="2">
          <van-col span="24" class="text-lg font-bold">Welcome to PregMate</van-col>
        </transition>
      </van-row>
      <van-row justify="center" class="mb-5 mt-10">
        <van-col>
          <van-button plain hairline round type="primary" class="w-60" to="login"
            >Login</van-button
          >
        </van-col>
      </van-row>
      <van-row justify="center" class="my-4">
        <van-col>
          <van-button plain hairline round type="primary" class="w-60" to="register"
            >Create an Account</van-button
          >
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useSessionStore } from "../stores/session";

const router = useRouter();
const visible = ref(false);
const sessionStore = useSessionStore();

onMounted(() => {
  const user = sessionStore.getCurrentUser;

  if (user) {
    return router.replace({name: 'home'});
  }

  setTimeout(() => {
    visible.value = true;
  }, 1000);

});
</script>

<style>
img.logo {
  width: 200px;
}
</style>
