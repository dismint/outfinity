<script setup lang="ts">
import router from "@/router";
import { defineProps } from "vue";
// import DisplayLabels from "../Labeling/DisplayLabels.vue";
import OutfitImageComponentRow from "./OutfitImageComponentRow.vue";
import { fetchy } from "@/utils/fetchy";
import { defineEmits } from "vue";

const props = defineProps(["outfit"]);
const emit = defineEmits(["refreshOutfits"]);

const unsave = async () => {
  try {
    await fetchy(`/api/outfits/unsave/${props.outfit._id}`, "PATCH", { alert: false });
  } catch (_) {
    return;
  }
  emit("refreshOutfits");
};

const navigateToOutfitPage = async () => {
  void router.push({ name: "Outfit", params: { id: props.outfit._id } });
};
</script>

<template>
  <div @click="navigateToOutfitPage" class="outfitContainer">
    <img src="../../assets/images/filledbookmark.png" alt="filled bookmark" @click.stop="unsave" />
    <OutfitImageComponentRow class="rowImage" :outfit="props.outfit" />
    <div class="name">
      <h2>{{ props.outfit.name }}</h2>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

img {
  width: 10%;
  height: 100%;
  object-fit: cover;
}

.rowImage {
  width: 60%;
  aspect-ratio: 5 / 1;
}

h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.name {
  max-width: 20%;
  width: 20%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.outfitContainer {
  margin: 1vmin 0;
  padding: 1vmin;
  border-radius: 1vmin;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  height: 8vh;
  background-color: var(--light-green);
}
</style>
