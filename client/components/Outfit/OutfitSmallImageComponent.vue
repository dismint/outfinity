<script setup lang="ts">
import ImageRevolverComponent from "@/components/Outfit/ImageRevolverComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["outfit"]);
const loaded = ref(false);
const headImage = ref("");
const topImages = ref<Array<string>>([]);
const bottomImages = ref<Array<string>>([]);
const onepieceImage = ref("");
const shoeImage = ref("");

const getImages = async () => {
  for (const c of props.outfit.clothes) {
    let clothingResult;
    try {
      clothingResult = await fetchy(`/api/clothes`, "GET", { query: { id: c }, alert: false });
    } catch (_) {
      return;
    }
    if (clothingResult.type === "head") {
      headImage.value = clothingResult.imgUrl;
    } else if (clothingResult.type === "top") {
      topImages.value.push(clothingResult.imgUrl);
    } else if (clothingResult.type === "bottom") {
      bottomImages.value.push(clothingResult.imgUrl);
    } else if (clothingResult.type === "onepiece") {
      onepieceImage.value = clothingResult.imgUrl;
    } else if (clothingResult.type === "shoe") {
      shoeImage.value = clothingResult.imgUrl;
    }
  }
};

onBeforeMount(async () => {
  await getImages();
  loaded.value = true;
});
</script>

<template>
  <main>
    <ImageRevolverComponent v-if="loaded" :imageLoaded="loaded" :images="headImage" :oneimage="true" />
    <ImageRevolverComponent v-if="loaded" :imageLoaded="loaded" :images="topImages" :oneimage="false" />
    <ImageRevolverComponent v-if="loaded" :imageLoaded="loaded" :images="bottomImages" :oneimage="false" />
    <ImageRevolverComponent v-if="loaded" :imageLoaded="loaded" :images="onepieceImage" :oneimage="true" />
    <ImageRevolverComponent v-if="loaded" :imageLoaded="loaded" :images="shoeImage" :oneimage="true" />
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
