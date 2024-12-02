<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineEmits, defineProps, onBeforeMount, ref } from "vue";
import ClothingImageComponent from "../Clothing/ClothingImageComponent.vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["id", "inCloset"]);
const emit = defineEmits(["add", "remove"]);
const inCloset = ref(props.inCloset);
const clothing = ref<Record<string, string>>({});
const loaded = ref(false);

async function getClothing() {
  const query = { id: props.id };
  let clothingResults;
  try {
    clothingResults = await fetchy(`/api/clothes`, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  clothing.value = clothingResults;
}

const add = () => {
  inCloset.value = true;
  emit("add", props.id);
};

const remove = () => {
  inCloset.value = false;
  emit("remove", props.id);
};

onBeforeMount(async () => {
  await getClothing();
  loaded.value = true;
});
</script>

<template>
  <main>
    <img v-if="inCloset && loaded" src="../../assets/images/filledcheckbox.png" alt="checkbox filled in" @click="remove" />
    <img v-if="!inCloset && loaded" src="../../assets/images/checkbox.png" alt="checkbox not filled in" @click="add" />
    <ClothingImageComponent :imgUrl="clothing.imgUrl" />
    <h1 v-if="loaded">{{ clothing.name }}</h1>
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
