<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import NavbarView from "@/views/NavbarView.vue";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <NavbarView />
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: black;
  text-decoration: none;
}

/*ul {*/
/*  list-style-type: none;*/
/*  margin-left: auto;*/
/*  display: flex;*/
/*  align-items: center;*/
/*  flex-direction: row;*/
/*  gap: 1em;*/
/*}*/
/**/
/*nav {*/
/*  padding: 1em 2em;*/
/*  background-color: lightgray;*/
/*  display: flex;*/
/*  align-items: center;*/
/*}*/

.underline {
  text-decoration: underline;
}
</style>
