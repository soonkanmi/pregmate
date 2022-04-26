import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import { createRouter, createWebHistory } from "vue-router";
import {
  Button,
  Calendar,
  Card,
  Cell,
  CellGroup,
  Col,
  Field,
  Form,
  Icon,
  NavBar,
  Row,
  Tabbar,
  TabbarItem,
  Locale,
  Toast,
  Popup,
  Picker,
} from "vant";
import enUS from 'vant/es/locale/lang/en-US';
import App from "./App.vue";
import axios from "axios";
import VueAxios from "vue-axios";
import SecureLS from "secure-ls";
import { createPinia } from "pinia";

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
  {
    path: "/personal-info",
    component: () => import("./views/PersonalInfo.vue"),
    name: "personal-info-form",
  },
  {
    path: "/obstetrical-info",
    component: () => import("./views/ObstetricalInfo.vue"),
    name: "obstetrical-info-form",
  },
  {
    path: "/medical-info",
    component: () => import("./views/MedicalInfo.vue"),
    name: "medical-info-form",
  },
  {
    path: "/vital-form",
    component: () => import("./views/VitalForm.vue"),
    name: "vital-form",
  },
  { path: "/home", component: () => import("./views/Home.vue"), name: "home" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const app = createApp(App);

axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json';

app.use(VueAxios, axios)
app.provide('axios', app.config.globalProperties.axios)  // provide 'axios'

var ls = new SecureLS({encodingType: 'aes'});
app.provide('secureLS', ls)

app.use(router);
app.use(createPinia())

Locale.use('en-US', enUS);
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
  Calendar,
  Cell,
  Toast,
  Popup,
  Picker,
];

vantComponents.forEach((vantComponent) => {
  app.use(vantComponent);
});

app.mount("#app");
