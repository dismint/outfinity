<script setup lang="ts">
import router from "@/router";
import { defineProps } from "vue";
import OutfitSmallImageComponent from "./OutfitSmallImageComponent.vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";
import { fetchy } from "@/utils/fetchy";
import { defineEmits } from "vue";

const props = defineProps(["outfit"]);
const emit = defineEmits(["refreshOutfits"]);

const unsave = async () => {
  try {
    await fetchy(`/api/outfits/unsave/${props.outfit._id}`, "PATCH", { alert: false });
  } catch (_) {
    return;
  }
  emit("refreshOutfits");
};

const navigateToOutfitPage = async () => {
  void router.push({ name: "Outfit", params: { id: props.outfit._id } });
};
</script>

<template>
  <main @click="navigateToOutfitPage">
    <img src="../../assets/images/filledbookmark.png" alt="filled bookmark" @click.stop="unsave" />
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
