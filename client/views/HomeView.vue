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
      <div class="compressWidth">
        <div class="scrollSeal titleContainer">
          <h1 class="title">Welcome {{ currentUsername }}!</h1>
        </div>
        <h2>(click on a navbar option to get started)</h2>
      </div>
    </div>
    <div v-else class="centered">
      <LandingView />
    </div>
  </main>
</template>

<style scoped>
.title {
  font-family: "Baloo Tamma 2";
  font-size: 8em;
  font-weight: 800;
  background: linear-gradient(to right, var(--text-color), var(--dark-green) 50%, var(--light-green));
  background-clip: text;
  color: transparent;
}

.titleContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 40vh;
  margin: auto;
}

h2 {
  margin-top: 20vh;
}
</style>
