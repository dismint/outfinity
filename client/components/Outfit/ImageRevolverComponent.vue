<script setup lang="ts">
import { defineProps, ref } from "vue";
import ClothingImageComponent from "../Clothing/ClothingImageComponent.vue";

const props = defineProps(["images", "oneimage", "type"]);
const imageOrder = ref(props.images.slice());
</script>

<template>
  <div class="outerRevolver">
    <div v-if="props.images.length !== 0" style="width: 100%; height: 100%">
      <div class="centered adjust" v-if="props.oneimage">
        <ClothingImageComponent :imgUrl="props.images" />
      </div>
      <div class="" v-else>
        <ClothingImageComponent v-for="(image, index) in imageOrder" :key="index" :imgUrl="image" :style="{ zIndex: index, position: 'absolute', scale: 1 - index * 0.2 }" />
      </div>
    </div>
    <p v-else class="noClothes">No {{ props.type }}</p>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  margin: 0;
}

.adjust {
  width: 100%;
  aspect-ratio: 1;
}

.outerRevolver {
  box-sizing: content-box;
  width: 100%;
  aspect-ratio: 1;
  border: 0.4vmin solid var(--dark-green);
  margin: 1%;
  position: relative;
}

.noClothes {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "Inter";
  font-weight: 700;
  font-size: 1vmin;
  color: var(--dark-green);
}
</style>
