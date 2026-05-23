import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home.vue"),
    },
    {
      path: "/chat",
      component: () => import("@/views/Chat.vue"),
    },
    {
      path: "/profile",
      component: () => import("@/views/Profile.vue"),
    },
    {
      path: "/detail",
      component: () => import("@/views/Detail.vue"),
    },
  ],
});

export default router;
