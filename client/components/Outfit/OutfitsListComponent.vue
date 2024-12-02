<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import OutfitComponent from "./OutfitComponent.vue";

const loaded = ref(false);
let outfits = ref<Array<Record<string, string>>>([]);
const { userId } = storeToRefs(useUserStore());

async function getOutfits() {
  let query: Record<string, string> = { id: userId.value };
  let outfitResults;
  try {
    outfitResults = await fetchy("/api/outfits/user", "GET", { query });
  } catch (_) {
    return;
  }
  outfits.value = outfitResults;
}

onBeforeMount(async () => {
  await getOutfits();
  loaded.value = true;
});
</script>

<template>
  <div>
    <section class="posts" v-if="loaded && outfits.length !== 0">
      <article v-for="outfit in outfits" :key="outfit._id">
        <OutfitComponent :outfit="outfit" />
      </article>
    </section>
    <p v-else-if="loaded">No outfits yet!</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
section {
  display: flex;
  /* flex-direction: column; */
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.posts {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
