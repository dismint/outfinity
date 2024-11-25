<script setup lang="ts">
import router from "@/router";
import { defineProps, ref } from "vue";
import OutfitImageComponent from "./OutfitImageComponent.vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";

const props = defineProps(["challenegeId", "title", "outfitOrChallenge"]);

const headImages = ref<Array<string>>(["🧢", "🎩", "👒"]);
const topImages = ref<Array<string>>(["👕", "👚", "👔"]);
const bottomImages = ref<Array<string>>(["👖", "🩳", "👗"]);
const shoeImages = ref<Array<string>>(["👟", "👞", "👠"]);

const submit = async () => {
  //// using fetch make an outfit
  if (props.outfitOrChallenge === "outfit") {
    void router.push({ name: "Outfit", params: { id: "1" } }); // id is the outfit we just made here
  } else {
    void router.push({ name: "SubmitChallenge", params: { id: props.challenegeId } }); // TODO: how to move just made outfit to this page? maybe have outfit id and challenge id in params of page
  }
};
/// TODO: change images to the object id of outfit
</script>

<template>
  <OutfitImageComponent :head-images="headImages" :top-images="topImages" :bottom-images="bottomImages" :shoe-images="shoeImages" />
  <div>
    <h1>{{ props.title }}</h1>
    <p>MAKE PICKER HERE</p>
    <button @click="submit">Save Outfit</button>
  </div>
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
