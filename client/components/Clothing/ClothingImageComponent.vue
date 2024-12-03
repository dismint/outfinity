<script setup lang="ts">
const props = defineProps(["imgUrl"]);
</script>

<template>
  <div>
    <img :src="props.imgUrl" alt="Clothing Image" />
  </div>
</template>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
