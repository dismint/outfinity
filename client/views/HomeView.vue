<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="centered">
    <div v-if="isLoggedIn">
      <h1>Welcome {{ currentUsername }}!</h1>
    </div>
    <div v-else class="compressWidth">
      <div class="titleContainer">
        <h1 class="title">Outfinity</h1>
      </div>
      <div class="splashContainer">
        <h1 class="splashText right">Endless<br />Outfits</h1>
        <h1 class="splashText" style="margin-top: 2em">Infinite<br />Inspiration</h1>
      </div>
    </div>
  </main>
</template>

<style scoped>
.titleContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
}

.title {
  font-family: "Baloo Tamma 2";
  font-size: 8em;
  font-weight: 800;
  margin-bottom: 20vh;
}

.splashContainer {
  display: flex;
  justify-content: center;
  width: 80%;
}

.right {
  margin-right: auto;
}

.splashText {
  font-size: 6em;
  font-weight: 800;
  text-align: center;
  color: var(--dark-green);
}

h1 {
  margin: 0;
  padding: 0;
  text-align: center;
}
</style>
