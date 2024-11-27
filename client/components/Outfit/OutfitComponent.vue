<script setup lang="ts">
import router from "@/router";
import { defineProps } from "vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["outfit"]);

// const image = ref("");

const navigateToOutfitPage = async () => {
  void router.push({ name: "Outfit", params: { id: props.outfit._id } });
};
</script>

<template>
  <main @click="navigateToOutfitPage">
    <!-- <img :src="image" alt="clothing" /> -->
    <h3>make sure to put the bookmark save thing on the img, maybe make separate img component for this</h3>
    <h1>{{ props.outfit._id }}</h1>
    <!-- <DisplayLabels :item="{ title: props.name, _id: props.id }" /> -->
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
