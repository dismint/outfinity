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
  <div class="centered full">
    <ClothingImageComponent :imgUrl="clothing.imgUrl" />
    <div class="checkImage">
      <img v-if="inCloset && loaded" src="../../assets/images/filledcheckbox.png" alt="checkbox filled in" @click="remove" />
      <img v-if="!inCloset && loaded" src="../../assets/images/checkbox.png" alt="checkbox not filled in" @click="add" />
    </div>
    <div class="textGap">
      <div class="nameText" v-if="loaded">{{ clothing.name }}</div>
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

img {
  width: 40%;
  height: 40%;
}

.checkImage {
  position: absolute;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
}

.nameText {
  padding: 0.5vmin;
  background-color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  position: absolute;
  bottom: 3px;
  left: 0;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  width: 100%;
  font-size: 1.2vmin;
}
</style>
