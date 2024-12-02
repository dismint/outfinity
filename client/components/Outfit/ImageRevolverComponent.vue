<script setup lang="ts">
import { defineProps, ref } from "vue";
import ClothingImageComponent from "../Clothing/ClothingImageComponent.vue";

const props = defineProps(["images", "oneimage"]);
const imageOrder = ref(props.images.slice());

// const bringToFront = (index: number) => {
//   const image = imageOrder.value.splice(index, 1)[0];
//   imageOrder.value.push(image);
// };
//@click="bringToFront(index)"
</script>

<template>
  <div class="image-revolver" v-if="props.images.length !== 0">
    <div v-if="props.oneimage">
      <ClothingImageComponent :imgUrl="props.images" />
    </div>
    <div v-else v-for="(image, index) in imageOrder" :key="index" :style="{ zIndex: images.length - index, transform: `translateX(${index * 20}px)` }" class="image-container">
      <!-- <img :src="image" alt="Image" /> -->
      <ClothingImageComponent :imgUrl="image" />
      <!-- <p>{{ image }}</p> -->
    </div>
  </div>
  <p v-else>No clothes added to this type!</p>
</template>

<style scoped>
.image-revolver {
  /* position: relative; */
  display: flex;
}

.image-container {
  /* position: absolute; */
  /* cursor: pointer; */
  transition: transform 0.3s;
}

.image-container img {
  /* width: 100%; */
  height: auto;
  display: block;
}
</style>
