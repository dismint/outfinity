<script setup lang="ts">
import { defineProps, ref } from "vue";
import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["id", "name", "inCloset"]);
const emit = defineEmits(["add", "remove"]);
const inCloset = ref(props.inCloset);

const image = ref("");

// const navigateToClothingItemPage = async () => {
//   void router.push({ name: "ClothingItem", params: { id: props.id } });
// };

//// TODO: check this works

const add = () => {
  inCloset.value = true;
  emit("add", props.id);
};

const remove = () => {
  inCloset.value = false;
  emit("remove", props.id);
};
</script>

<template>
  <main>
    <img v-if="inCloset" src="../../assets/images/closet.png" alt="checkbox filled in" @click="remove" />
    <img v-else src="../../assets/images/checkbox.png" alt="checkbox not filled in" @click="add" />
    <!-- <img :src="image" alt="clothing" /> -->
    <!-- @click="navigateToClothingItemPage" -->
    <h1>{{ props.name }}</h1>
    <DisplayLabels :item="{ title: props.name, _id: props.id }" />
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
