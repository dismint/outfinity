<script setup lang="ts">
const props = defineProps(["imgUrl"]);
</script>

<template>
  <div class="centered full">
    <img :src="props.imgUrl" alt="Clothing Image" />
  </div>
</template>

<style scoped>
.full {
  max-width: 100%;
  max-height: 100%;
}

img {
  width: 100%;
  height: 100%;
  border: 0.2vmin solid var(--dark-green);
  object-fit: contain;
}
</style>
