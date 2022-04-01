import { createApp } from "vue";
import { registerSW } from "virtual:pwa-register";
import { VueRouter } from "vue-router";

import App from "./App.vue";

const updateSW = registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
});

const routes = [
  { path: "/", component: () => import('./views/Welcome.vue'), name: 'welcome'},
  { path: "/login", component: () => import('./views/Login.vue'), name: 'login'},
  { path: "/register", component: () => import('./views/Register.vue'), name: 'register'},
  { path: "/home", component: () => import('./views/Home.vue'), name: 'home'},
];

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
});

const app = createApp(App);

app.use(router);

app.mount("#app");
