<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps(["images"]);
const imageOrder = ref(props.images.slice());

const bringToFront = (index: number) => {
  const image = imageOrder.value.splice(index, 1)[0];
  imageOrder.value.push(image);
};
</script>

<template>
  <div class="image-revolver">
    <div v-for="(image, index) in imageOrder" :key="index" :style="{ zIndex: images.length - index, transform: `translateX(${index * 20}px)` }" class="image-container" @click="bringToFront(index)">
      <!-- <img :src="image" alt="Image" /> -->
      <p>{{ image }}</p>
    </div>
  </div>
</template>

<style scoped>
.image-revolver {
  /* position: relative; */
  display: flex;
}

.image-container {
  /* position: absolute; */
  cursor: pointer;
  transition: transform 0.3s;
}

.image-container img {
  /* width: 100%; */
  height: auto;
  display: block;
}
</style>
