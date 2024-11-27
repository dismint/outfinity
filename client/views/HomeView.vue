<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import LandingView from "@/views/LandingView.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="centered">
    <div v-if="isLoggedIn">
      <h1>Welcome {{ currentUsername }}!</h1>
    </div>
    <div v-else class="centered">
      <LandingView />
    </div>
  </main>
</template>

<style scoped></style>
