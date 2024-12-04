<script setup lang="ts">
const props = defineProps(["imgUrl"]);
</script>

<template>
  <div class="centered full">
    <img :src="props.imgUrl" alt="Clothing Image" />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

img {
  width: 100%;
  height: 100%;
  border: 0.2vmin solid var(--dark-green);
  background-color: var(--light);
  object-fit: contain;
}
</style>
