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

//<main>
//  <ClothingImageComponent :imgUrl="clothing.imgUrl" @click="navigateToClothingItemPage" />
//  <h1 v-if="loaded">{{ clothing.name }}</h1>
//  <!-- <DisplayLabels :item="{ title: props.id, _id: props.id }" /> -->
//</main>
</script>

<template>
  <div class="centered full">
    <ClothingImageComponent :imgUrl="clothing.imgUrl" @click="navigateToClothingItemPage" />
    <div class="textGap">
      <div class="nameText">{{ clothing.name }}</div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.full {
  background-color: var(--light-green);
  position: relative;
}

.nameText {
  padding: 0.5vmin;
  background-color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  position: absolute;
  top: 50%;
  left: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 1.2vmin;
  transform: translate(-50%, -50%);
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
