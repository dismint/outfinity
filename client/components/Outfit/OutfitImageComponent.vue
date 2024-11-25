<script setup lang="ts">
import ImageRevolverComponent from "@/components/Outfit/ImageRevolverComponent.vue";
import { defineProps } from "vue";

const props = defineProps(["headImages", "topImages", "bottomImages", "shoeImages"]);
</script>

<template>
  <main>
    <ImageRevolverComponent :images="props.headImages" />
    <ImageRevolverComponent :images="props.topImages" />
    <ImageRevolverComponent :images="props.bottomImages" />
    <ImageRevolverComponent :images="props.shoeImages" />
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
