<script setup lang="ts">
import ClothingPageComponent from "@/components/Clothing/ClothingPageComponent.vue";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["id"]);
</script>

<template>
  <main>
    <ClothingPageComponent :id="props.id" />
  </main>
</template>

<style scoped>
</style>
