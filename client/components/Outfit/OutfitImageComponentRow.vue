<script setup lang="ts">
import ImageRevolverComponentRow from "@/components/Outfit/ImageRevolverComponentRow.vue";
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref, onUpdated, onMounted } from "vue";

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
    if (clothingResult.type === "hat") {
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
  if (props.outfit && props.outfit.clothes) {
    await getImages();
    loaded.value = true;
  }
});

onUpdated(async () => {
  await getImages();
  loaded.value = true;
});
</script>

<template>
  <div class="row oimageContainer">
    <ImageRevolverComponentRow v-if="loaded && headImage" :imageLoaded="loaded" :images="headImage" :oneimage="true" :type="'hat'" />
    <ImageRevolverComponentRow v-if="loaded && topImages" :imageLoaded="loaded" :images="topImages" :oneimage="false" :type="'top'" />
    <ImageRevolverComponentRow v-if="loaded && bottomImages" :imageLoaded="loaded" :images="bottomImages" :oneimage="false" :type="'bottom'" />
    <ImageRevolverComponentRow v-if="loaded && onepieceImage" :imageLoaded="loaded" :images="onepieceImage" :oneimage="true" :type="'onepiece'" />
    <ImageRevolverComponentRow v-if="loaded && shoeImage" :imageLoaded="loaded" :images="shoeImage" :oneimage="true" :type="'shoe'" />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.oimageContainer {
  height: 100%;
}
</style>
