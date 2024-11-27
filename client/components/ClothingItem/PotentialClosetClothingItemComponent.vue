<script setup lang="ts">
import { defineProps, ref } from "vue";
import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["clothing", "inCloset"]);
const emit = defineEmits(["add", "remove"]);
const inCloset = ref(props.inCloset);

// const navigateToClothingItemPage = async () => {
//   void router.push({ name: "ClothingItem", params: { id: props.id } });
// };

/// TODO: ClothingImageComponent

const add = () => {
  inCloset.value = true;
  emit("add", props.clothing._id);
};

const remove = () => {
  inCloset.value = false;
  emit("remove", props.clothing._id);
};
</script>

<template>
  <main>
    <img v-if="inCloset" src="../../assets/images/filledcheckbox.png" alt="checkbox filled in" @click="remove" />
    <img v-else src="../../assets/images/checkbox.png" alt="checkbox not filled in" @click="add" />
    <!-- <img :src="image" alt="clothing" /> -->
    <!-- <ClothingImageComponent :clothing="props.clothing" /> -->
    <!-- @click="navigateToClothingItemPage" -->
    <h1>{{ props.clothing.name }}</h1>
    <DisplayLabels :item="{ title: props.clothing.name, _id: props.clothing._id }" />
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
