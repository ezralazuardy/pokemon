import { createRouter, createWebHistory } from "vue-router";
import MainPage from "./views/MainPage.vue";

export const routes = [
  {
    path: "/",
    name: "main-page",
    component: MainPage,
  },
];

export default createRouter({ history: createWebHistory(), routes });
