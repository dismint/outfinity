<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import OutfitComponent from "./OutfitComponent.vue";

const loaded = ref(false);
let outfits = ref<Array<Record<string, string>>>([]);

async function getOutfits() {
  // let query: Record<string, string> = { owner: currentUsername.value };
  // TODO: replace api
  ///// have to filter to not show main closet
  // let miniclosetResults;
  // try {
  //   miniclosetResults = await fetchy("/api/posts", "GET", { query });
  // } catch (_) {
  //   return;
  // }
  // searchAuthor.value = author ? author : "";
  // miniclosets.value = miniclosetResults;
  outfits.value = [
    { _id: "1", name: "Outfit 1", emoji: "👗" },
    { _id: "2", name: "Outfit 2", emoji: "👠" },
    { _id: "3", name: "Outfit 3", emoji: "👒" },
  ];
}

onBeforeMount(async () => {
  await getOutfits();
  loaded.value = true;
});
</script>

<template>
  <div>
    <section class="posts" v-if="loaded && outfits.length !== 0">
      <article v-for="minicloset in outfits" :key="minicloset._id">
        <OutfitComponent :id="minicloset._id" :emoji="minicloset.emoji" :name="minicloset.name" />
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
