<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, } from "vue";
import OutfitImageComponentRow from "../Outfit/OutfitImageComponentRow.vue";

const props = defineProps(["outfit", "owner", "id"]);
const emit = defineEmits(["refreshOutfits"]);
const { userId } = storeToRefs(useUserStore());

const unsave = async () => {
  try {
    await fetchy(`/api/outfits/unsave/${props.outfit._id}`, "PATCH", { alert: false });
  } catch (_) {
    return;
  }
  emit("refreshOutfits");
};

const pickWinner = async () => {
    try {
        await fetchy(`/api/challenges/${props.id}/winner`, "PATCH", { 
            body: { winner: props.outfit.owner } });
    } catch (_) {
        return;
    }
}

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
    <div class="centered" v-if="userId == props.owner">
      <button @click.stop="pickWinner">Select Challenge Winner</button>
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
</style>
