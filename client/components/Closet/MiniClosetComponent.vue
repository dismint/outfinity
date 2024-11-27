<script setup lang="ts">
import router from "@/router";

const props = defineProps(["id", "emoji", "name"]);

const navigateToClosetPage = async () => {
  void router.push({ name: "Closet", params: { id: props.id } });
};
</script>

<template>
  <main @click="navigateToClosetPage">
    <h1>{{ props.emoji }}</h1>
    <h1 class="author">{{ props.name }}</h1>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  cursor: pointer;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
