<script setup lang="ts">
import OutfitDescriptionComponent from "@/components/Outfit/OutfitDescriptionComponent.vue";
import OutfitImageComponent from "@/components/Outfit/OutfitImageComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["id"]);
const outfit = ref<Record<string, string>>({});
const loaded = ref(false);
const headImage = ref("");
const topImages = ref<Array<string>>([]);
const bottomImages = ref<Array<string>>([]);
const onepieceImage = ref("");
const shoeImage = ref("");

const getOutfit = async () => {
  let outfitResult;
  try {
    outfitResult = await fetchy(`/api/outfits/${props.id}`, "GET", { alert: false });
  } catch (_) {
    return;
  }
  outfit.value = outfitResult;
};

const getImages = async () => {
  for (const c of outfit.value.clothes) {
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
  await getOutfit();
  await getImages();
  loaded.value = true;
});
</script>

<template>
  <main class="outfitpage">
    <OutfitImageComponent v-if="loaded" :imageLoaded="loaded" :head-image="headImage" :top-images="topImages" :bottom-images="bottomImages" :onepiece-image="onepieceImage" :shoe-image="shoeImage" />
    <OutfitDescriptionComponent v-if="loaded" :outfit="outfit" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.outfitpage {
  display: flex;
  justify-content: space-around;
}
</style>
