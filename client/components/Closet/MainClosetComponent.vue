<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";

const mainId = ref("");

async function getMainCloset() {
  // let query: Record<string, string> = { name: "main closet" };
  // let mainIdResult;
  // TODO: replace api
  // try {
  //   mainIdResult = await fetchy("/api/posts", "GET", { query });
  // } catch (_) {
  //   return;
  // }
  // mainId.value = mainIdResult;
  mainId.value = "293i03i3nr";
}

const navigateToClosetPage = async () => {
  void router.push({ name: "Closet", params: { id: mainId.value } });
};

onBeforeMount(async () => {
  await getMainCloset();
});
</script>

<template>
  <main>
    <img src="../../assets/images/closet.png" alt="closet" @click="navigateToClosetPage" />
    <h1 class="author">Main Closet</h1>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
