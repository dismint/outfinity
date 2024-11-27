<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MiniClosetComponent from "./MiniClosetComponent.vue";

const { userId } = storeToRefs(useUserStore());

const loaded = ref(false);
let miniclosets = ref<Array<Record<string, string>>>([]);

async function getMiniclosets() {
  let query: Record<string, string> = { id: userId.value };
  let miniclosetResults;
  try {
    miniclosetResults = await fetchy("/api/closets/user", "GET", { query });
  } catch (_) {
    return;
  }
  miniclosets.value = miniclosetResults.filter((minicloset: Record<string, string>) => minicloset.name !== "main");
}

const navigateToNewMiniclosetPage = async () => {
  void router.push({ name: "CreateCloset" });
};

const navigateToNewClothesPage = async () => {
  void router.push({ name: "AddClothes" });
};

onBeforeMount(async () => {
  await getMiniclosets();
  loaded.value = true;
});
</script>

<template>
  <div>
    <button @click="navigateToNewMiniclosetPage">create new minicloset</button>
    <section class="posts" v-if="loaded && miniclosets.length !== 0">
      <article v-for="minicloset in miniclosets" :key="minicloset._id">
        <MiniClosetComponent :id="minicloset._id" :emoji="minicloset.description" :name="minicloset.name" />
      </article>
    </section>
    <p v-else-if="loaded">No miniclosets yet!</p>
    <p v-else>Loading...</p>
    <button @click="navigateToNewClothesPage">upload new clothing item</button>
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
