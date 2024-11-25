<script setup lang="ts">
import ClosetClothesListComponent from "@/components/ClothingItem/ClosetClothesListComponent.vue";
// const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
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
    <h1>{{ name }}</h1>
    <h3>id: {{ props.id }}</h3>
    <ClosetClothesListComponent :id="props.id" />
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
