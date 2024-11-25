<script setup lang="ts">
import router from "@/router";
import { defineProps, ref } from "vue";
import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["id", "name"]);

const image = ref("");

const navigateToClothingItemPage = async () => {
  void router.push({ name: "ClothingItem", params: { id: props.id } });
};
</script>

<template>
  <main>
    <img :src="image" alt="clothing" @click="navigateToClothingItemPage" />
    <h1>{{ props.name }}</h1>
    <DisplayLabels :item="{ title: props.name, _id: props.id }" />
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
