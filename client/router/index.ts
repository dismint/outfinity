import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import AddRemoveClothesView from "../views/AddRemoveClothesView.vue";
import AllClosetsView from "../views/AllClosetsView.vue";
import ClosetView from "../views/ClosetView.vue";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProfileView from "../views/ProfileView.vue";
import CreateClosetView from "../views/CreateClosetView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: HomeView,
    },
    {
      path: "/profile",
      name: "Profile",
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Profile" };
        }
      },
    },
    {
      path: "/allclosets",
      name: "AllClosets",
      component: AllClosetsView,
      meta: { requiresAuth: true },
    },
    {
      path: "/closet/:id",
      name: "Closet",
      component: ClosetView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/addremoveclothes/:id",
      name: "AddRemoveClothes",
      component: AddRemoveClothesView,
      meta: { requiresAuth: true },
      props: true,
    },
    {
      path: "/createcloset",
      name: "CreateCloset",
      component: CreateClosetView,
      meta: { requiresAuth: true },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
