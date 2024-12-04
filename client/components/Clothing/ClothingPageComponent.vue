<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";
import ClothingImageComponent from "./ClothingImageComponent.vue";

const props = defineProps(["id"]);
const clothing = ref<Record<string, string>>({});
const { userId } = storeToRefs(useUserStore());

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

const deleteClothing = async () => {
  try {
    await fetchy(`/api/clothes/${props.id}`, "DELETE");
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getClothingInfo();
});
</script>

<template>
  <div class="row clothingPageContainer">
    <div class="centered imageContainer">
      <ClothingImageComponent :imgUrl="clothing.imgUrl" />
    </div>
    <div class="column infoContainer">
      <div class="textInfoContainer">
        <h2>Name</h2>
        <p>{{ clothing.name }}</p>
        <br />
        <h2>Description</h2>
        <p>{{ clothing.description }}</p>
      </div>
      <div class="centered delete" v-if="userId == clothing.owner">
        <button class="" @click="deleteClothing"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

.imageContainer {
  height: 100%;
  width: 50%;
  object-fit: coer;
}

.textInfoContainer {
  width: 100%;
  height: 85%;
}

.delete {
  width: 100%;
  height: 15%;
}

.infoContainer {
  padding: 2vmin;
  height: 100%;
  width: 50%;
}

button {
  width: 50%;
  height: 80%;
  border: none;
  background-color: var(--primary-background);
  position: relative;
}

button::after {
  content: "Delete";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Inter";
  font-weight: 700;
  z-index: 20;
  color: var(--text-color);
  transition: color 0.3s ease;
}

button::before {
  content: "";
  position: absolute;
  right: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 105, 97, 1);
  z-index: 10;
  border: none;
  transition: right 0.3s ease;
  overflow: hidden;
}

button:hover::before {
  right: 0;
}

button:hover::after {
  color: var(--primary-background);
}

.clothingPageContainer {
  width: 100%;
  height: 40vh;
  border-radius: 3vmin;
  padding: 3vmin;
  background-color: var(--light);
}
</style>
