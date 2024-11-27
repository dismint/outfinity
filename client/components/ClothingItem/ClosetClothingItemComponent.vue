<script setup lang="ts">
import router from "@/router";
import { defineProps, onBeforeMount, ref } from "vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["id"]);

const image = ref("");

async function getClothing() {
  /// TODO: either get clothing from formatted result or make new api for getClothingById
  // let query: Record<string, string> = { owner: currentUsername.value };
  // /// have to filter to not show main closet
  // let miniclosetResults;
  // try {
  //   miniclosetResults = await fetchy("/api/posts", "GET", { query });
  // } catch (_) {
  //   return;
  // }
  // searchAuthor.value = author ? author : "";
  // miniclosets.value = miniclosetResults;
  // // console.log(props.id);
  // clothes.value = [
  //   { _id: "1", name: "Clothing Item 1" },
  //   { _id: "2", name: "Clothing Item 2" },
  //   { _id: "3", name: "Clothing Item 3" },
  // ];
}

const navigateToClothingItemPage = async () => {
  void router.push({ name: "ClothingItem", params: { id: props.id } });
};

onBeforeMount(async () => {
  await getClothing();
});
</script>

<template>
  <main>
    <img :src="image" alt="clothing" @click="navigateToClothingItemPage" />
    <h1>{{ props.id }}</h1>
    <!-- <DisplayLabels :item="{ title: props.id, _id: props.id }" /> -->
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
