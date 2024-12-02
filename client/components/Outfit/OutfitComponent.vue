<script setup lang="ts">
import router from "@/router";
import { defineProps } from "vue";
import OutfitSmallImageComponent from "./OutfitSmallImageComponent.vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["outfit"]);

const navigateToOutfitPage = async () => {
  void router.push({ name: "Outfit", params: { id: props.outfit._id } });
};
</script>

<template>
  <main @click="navigateToOutfitPage">
    <!-- /// TODO: call api when unsave here and then emit refresh outfits that refreshes outfits -->
    <h3>make sure to put the bookmark save thing on the img, maybe make separate img component for this</h3>
    <OutfitSmallImageComponent :outfit="props.outfit" />
    <h1>{{ props.outfit.name }}</h1>
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
