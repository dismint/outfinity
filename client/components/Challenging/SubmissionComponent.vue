<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import OutfitImageComponentRow from "../Outfit/OutfitImageComponentRow.vue";

const props = defineProps(["outfit", "owner", "id"]);
const { userId } = storeToRefs(useUserStore());
const outfitObject = ref({});
const saved = ref(false);
const isWinner = ref(false);

const unsave = async () => {
  try {
    await fetchy(`/api/outfits/unsave/${props.outfit}`, "PATCH", { alert: false });
  } catch (_) {
    return;
  }
  saved.value = false;
};

const save = async () => {
  try {
    await fetchy(`/api/outfits/save/${props.outfit}`, "PATCH", { alert: false });
  } catch (_) {
    return;
  }
  saved.value = true;
};

const pickWinner = async () => {
  try {
    await fetchy(`/api/challenges/${props.id}/winner`, "PATCH", {
      body: { winner: outfitObject.value.owner },
      alert: false,
    });
  } catch (e) {
    console.log(e);
    return;
  }
  isWinner.value = true;
};

const removeWinner = async () => {
  try {
    await fetchy(`/api/challenges/${props.id}/remove`, "PATCH", {
      body: { uid: outfitObject.value.owner },
      alert: false });
  } catch (e) {
    console.log(e);
    return;
  }
  isWinner.value = false;
};

onBeforeMount(async () => {
  let apiResult;
  try {
    apiResult = await fetchy(`/api/outfits/${props.outfit}`, "GET", { alert: false });
  } catch (_) {
    return;
  }
  outfitObject.value = apiResult;

  try {
    apiResult = await fetchy(`/api/outfit/${props.outfit}/saved`, "GET", { alert: false });
  } catch (_) {
    return;
  }
  saved.value = apiResult;
  try {
    apiResult = await fetchy(`/api/challenges/${props.id}/${outfitObject.value.owner}`, "GET", { alert: false });
  } catch (e) {
    console.log(e);
    return;
  }
  isWinner.value = apiResult;
});

const navigateToOutfitPage = async () => {
  void router.push({ name: "Outfit", params: { id: props.outfit } });
};
</script>

<template>
  <div @click="navigateToOutfitPage" class="outfitContainer">
    <img v-if="saved" src="../../assets/images/filledbookmark.png" alt="filled bookmark" @click.stop="unsave" />
    <img v-else src="../../assets/images/bookmark.png" alt="filled bookmark" @click.stop="save" />
    <OutfitImageComponentRow class="rowImage" :outfit="outfitObject" />
    <div class="name">
      <h2>{{ outfitObject.name }}</h2>
    </div>
    <div class="centered" v-if="userId === props.owner">
      <button @click.stop="pickWinner" v-if="!isWinner">Select Challenge Winner</button>
      <button @click.stop="removeWinner" v-else>Remove Challenge Winner</button>
    </div>
    <div class="centered" v-else-if="isWinner">
      <h2>Winner!</h2> 
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.rowImage {
  width: 60%;
  aspect-ratio: 5 / 1;
}

h2 {
  width: 100%;
  font-family: "Eczar";
  font-weight: 600;
  font-size: 1.2em;
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

img {
  z-index: 100;
}
</style>
