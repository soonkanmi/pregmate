<template>
  <div class="welcome-wrapper">
    <img src="/pregmate.png" class="logo" >
    <Row justify="center">
      <Col span="12">Welcome to PregMate</Col>
    </Row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  Col,
  Row,
  Toast,
  SwipeItem,
  ActionBar,
  ActionBarIcon,
  ActionBarButton,
} from "vant";

const router = useRouter();
</script>

<style>
.welcome-wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-items: center;
    align-items: center;
}

img.logo {
    width: 200px;
}
</style>
