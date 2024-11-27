<script setup lang="ts">
import CreateOutfitComponent from "@/components/Outfit/CreateOutfitComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const main = ref<Record<string, string>>({});
const { userId } = storeToRefs(useUserStore());

async function getMainCloset() {
  let query: Record<string, string> = { user: userId.value, name: "main" };
  let mainIdResult;
  try {
    mainIdResult = await fetchy("/api/closets/byname", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  main.value = mainIdResult;
  console.log(main.value);
}

onBeforeMount(async () => {
  await getMainCloset();
});
</script>

<template>
  <main class="outfitpage">
    <CreateOutfitComponent :title="'New Outfit'" :outfit-or-challenge="'outfit'" :closet="main" />
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
