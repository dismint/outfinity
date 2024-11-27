<script setup lang="ts">
import PotentialClothesListComponent from "@/components/ClothingItem/PotentialClothesListComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["id"]);
const closet = ref<Record<string, string>>({});
const loaded = ref(false);

async function getCloset() {
  let api: string = `/api/closets/${props.id}`;
  let closetResult;
  try {
    closetResult = await fetchy(api, "GET");
  } catch (_) {
    return;
  }
  closet.value = closetResult;
}

onBeforeMount(async () => {
  await getCloset();
  loaded.value = true;
});
</script>

<template>
  <main>
    <h1>Add/remove items to {{ closet.name }}</h1>
    <PotentialClothesListComponent v-if="loaded" :closet="closet" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.closets {
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-content: space-around;
}
</style>
