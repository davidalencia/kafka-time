import { createRouter, createWebHistory } from "vue-router";

import HomeView from "./views/HomeView.vue";
import CalendarView from "./views/CalendarView.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomeView },
    { path: "/calendar", component: CalendarView },
  ],
});
