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

onBeforeMount(async () => {
  await getMiniclosets();
  loaded.value = true;
});
</script>

<template>
  <div class="centered">
    <section class="posts centered" v-if="loaded && miniclosets.length !== 0">
      <article v-for="minicloset in miniclosets" :key="minicloset._id" :style="{ width: 100 + '%', height: 100 / miniclosets.length + '%', maxHeight: 100 / miniclosets.length + '%' }">
        <MiniClosetComponent :id="minicloset._id" :emoji="minicloset.description" :name="minicloset.name" />
      </article>
    </section>
    <p v-else-if="loaded">Add a Minicloset!</p>
    <p v-else>Loading...</p>
  </div>
</template>

<style scoped>
.centered {
  width: 50%;
}

p {
  font-family: "Eczar";
  font-size: 2em;
  text-align: center;
  font-weight: 500;
}

.posts {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100%;
  max-height: 100%;
  height: 100%;
  width: 100%;
  margin: auto;
}
</style>
