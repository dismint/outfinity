<script setup lang="ts">
import ImageRevolverComponent from "@/components/Outfit/ImageRevolverComponent.vue";
import { defineProps } from "vue";

const props = defineProps(["imageLoaded", "headImage", "topImages", "bottomImages", "onepieceImage", "shoeImage"]);
</script>

<template>
  <div class="column oimageContainer">
    <ImageRevolverComponent v-if="props.imageLoaded" :imageLoaded="props.imageLoaded" :images="props.headImage" :oneimage="true" :type="'hat'" />
    <ImageRevolverComponent v-if="props.imageLoaded" :imageLoaded="props.imageLoaded" :images="props.topImages" :oneimage="false" :type="'top'" />
    <ImageRevolverComponent v-if="props.imageLoaded" :imageLoaded="props.imageLoaded" :images="props.bottomImages" :oneimage="false" :type="'bottom'" />
    <ImageRevolverComponent v-if="props.imageLoaded" :imageLoaded="props.imageLoaded" :images="props.onepieceImage" :oneimage="true" :type="'onepiece'" />
    <ImageRevolverComponent v-if="props.imageLoaded" :imageLoaded="props.imageLoaded" :images="props.shoeImage" :oneimage="true" :type="'shoe'" />
  </div>
</template>

<style scoped>
.oimageContainer {
  width: 100%;
}
</style>
