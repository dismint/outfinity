<script setup lang="ts">
import OutfitDescriptionComponent from "@/components/Outfit/OutfitDescriptionComponent.vue";
import OutfitImageComponent from "@/components/Outfit/OutfitImageComponent.vue";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["id"]);

const headImages = ref<Array<string>>([]);
const topImages = ref<Array<string>>([]);
const bottomImages = ref<Array<string>>([]);
const shoeImages = ref<Array<string>>([]);

const fetchImages = async () => {
  // try {
  //   const response = await fetch(`/api/outfits/${props.id}/images`);
  //   const data = await response.json();
  //   headImages.value = data.headImages;
  //   topImages.value = data.topImages;
  //   bottomImages.value = data.bottomImages;
  //   shoeImages.value = data.shoeImages;
  // } catch {
  //   router.push({ name: "NotFound" });
  // }
  headImages.value = ["🧢", "🎩", "👒"];
  topImages.value = ["👕", "👚", "👔"];
  bottomImages.value = ["👖", "🩳", "👗"];
  shoeImages.value = ["👟", "👞", "👠"];
};

onBeforeMount(async () => {
  await fetchImages();
});
</script>

<template>
  <main class="outfitpage">
    <OutfitImageComponent :head-images="headImages" :top-images="topImages" :bottom-images="bottomImages" :shoe-images="shoeImages" />
    <OutfitDescriptionComponent :id="props.id" />
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
