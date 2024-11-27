<script setup lang="ts">
import ClosetClothesListComponent from "@/components/ClothingItem/ClosetClothesListComponent.vue";
// const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

const props = defineProps(["id"]);
const closet = ref<Record<string, string>>({});

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
});
</script>

<template>
  <main>
    <h1>{{ closet.name }}</h1>
    <ClosetClothesListComponent :closet="closet" />
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
