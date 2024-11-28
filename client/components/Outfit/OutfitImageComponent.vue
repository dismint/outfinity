<script setup lang="ts">
import ImageRevolverComponent from "@/components/Outfit/ImageRevolverComponent.vue";
import { defineProps } from "vue";

const props = defineProps(["headImage", "topImages", "bottomImages", "onepieceImage", "shoeImage"]);
</script>

<template>
  <main>
    <ImageRevolverComponent :images="props.headImage" :oneimage="true" />
    <ImageRevolverComponent :images="props.topImages" :oneimage="false" />
    <ImageRevolverComponent :images="props.bottomImages" :oneimage="false" />
    <ImageRevolverComponent :images="props.onepieceImage" :oneimage="true" />
    <ImageRevolverComponent :images="props.shoeImage" :oneimage="true" />
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
