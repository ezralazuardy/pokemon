// @ts-ignore
import { registerSW } from "virtual:pwa-register";
import { createApp } from "vue";
import App from "./App.vue";
import Router from "./router";
import "./assets/styles/base.scss";

registerSW({ immediate: true });

createApp(App).use(Router).mount("#app");
