import { createRouter, createWebHistory } from "vue-router";
import Gif from "./pages/gif.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "chat",
      component: () => import("./pages/index.vue"),
    },
    {
      path: "/gif/:id",
      name: "gif",
      component: () => import("./pages/gif.vue"),
    },
  ],
});

export default router;
