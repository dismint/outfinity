<script setup lang="ts">
// const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
import PotentialClothesListComponent from "@/components/ClothingItem/PotentialClothesListComponent.vue";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["id"]);
const name = ref("");

async function getName() {
  // let query: Record<string, string> = { name: "main closet" };
  // let mainIdResult;
  // TODO: replace api
  // try {
  //   mainIdResult = await fetchy("/api/posts", "GET", { query });
  // } catch (_) {
  //   return;
  // }
  // mainId.value = mainIdResult;
  name.value = "closet blah";
}

onBeforeMount(async () => {
  await getName();
});
</script>

<template>
  <main>
    <h1>Add/remove items to {{ name }}</h1>
    <h3>id: {{ props.id }}</h3>
    <PotentialClothesListComponent :id="props.id" />
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
