import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import { createRouter, createWebHistory } from "vue-router";
import {
  Button,
  Card,
  CellGroup,
  Col,
  Field,
  Form,
  Icon,
  NavBar,
  Row,
  Tabbar,
  TabbarItem,
} from "vant";
import App from "./App.vue";

import "./index.css";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

const routes = [
  {
    path: "/",
    component: () => import("./views/Welcome.vue"),
    name: "welcome",
  },
  {
    path: "/login",
    component: () => import("./views/Login.vue"),
    name: "login",
  },
  {
    path: "/register",
    component: () => import("./views/Register.vue"),
    name: "register",
  },
  { path: "/home", component: () => import("./views/Home.vue"), name: "home" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

app.use(router);

const vantComponents = [
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Row,
  Col,
  NavBar,
  CellGroup,
  Button,
  Card,
  Icon,
];

vantComponents.forEach((vantComponent) => {
  app.use(vantComponent);
});

app.mount("#app");
