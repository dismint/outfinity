<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";
import ClothingImageComponent from "../Clothing/ClothingImageComponent.vue";

const props = defineProps(["id", "noclick", "clothingobject"]);
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

const navigateToClothingItemPage = async () => {
  void router.push({ name: "ClothingItem", params: { id: props.id } });
};

onBeforeMount(async () => {
  if (props.clothingobject) {
    clothing.value = props.clothingobject;
  } else {
    await getClothing();
  }
  loaded.value = true;
});
</script>

<template>
  <main>
    <ClothingImageComponent v-if="props.noclick" :imgUrl="clothing.imgUrl" />
    <ClothingImageComponent v-else :imgUrl="clothing.imgUrl" @click="navigateToClothingItemPage" />
    <h1 v-if="loaded">{{ clothing.name }}</h1>
    <!-- <DisplayLabels :item="{ title: props.id, _id: props.id }" /> -->
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
