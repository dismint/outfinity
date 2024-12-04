<script setup lang="ts">
import ClothingPageComponent from "@/components/Clothing/ClothingPageComponent.vue";
import { defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["id"]);
const clothing = ref<Record<string, string>>({});

const getClothingInfo = async () => {
  let clothingInfo;
  try {
    clothingInfo = await fetchy(`/api/clothes`, "GET", { query: { id: props.id } });
  } catch (e) {
    return;
  }
  clothing.value = clothingInfo;
  console.log(clothing.value, clothingInfo);
};

onBeforeMount(async () => {
  await getClothingInfo();
});
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <div class="headerContainer">
          <h1>{{ clothing.name }}</h1>
        </div>
        <ClothingPageComponent :id="props.id" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.headerContainer {
  color: var(--dark-green);
  width: 100%;
}

h1 {
  box-sizing: border-box;
  display: block;
  width: 100%;
  font-family: "Eczar";
  color: var(--dark-green);
  text-align: left;
  font-size: 4em;
  margin-top: 1em;
}
</style>
