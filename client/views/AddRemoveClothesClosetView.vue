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
    <div class="centered">
      <div class="compressWidth">
        <h1>Edit {{ closet.name }}</h1>
        <PotentialClothesListComponent v-if="loaded" :closet="closet" />
      </div>
    </div>
  </main>
</template>

<style scoped>
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
