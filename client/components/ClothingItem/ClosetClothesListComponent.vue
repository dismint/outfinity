<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ClosetClothingItemComponent from "./ClosetClothingItemComponent.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
let clothes = ref<Array<Record<string, string>>>([]);

async function getClothes() {
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
  clothes.value = [
    { _id: "1", name: "Clothing Item 1" },
    { _id: "2", name: "Clothing Item 2" },
    { _id: "3", name: "Clothing Item 3" },
  ];
}

const navigateToAddRemoveClothesPage = async () => {
  void router.push({ name: "Closet", params: { id: "add remove clothes" } });
};

onBeforeMount(async () => {
  await getClothes();
  loaded.value = true;
});
</script>

<template>
  <div>
    <h1>Search bar and filtering</h1>
    <button @click="navigateToAddRemoveClothesPage">add/remove items from closet</button>
    <h3>Results</h3>
    <section class="posts" v-if="loaded && clothes.length !== 0">
      <article v-for="clothing in clothes" :key="clothing._id">
        <ClosetClothingItemComponent :id="clothing._id" :name="clothing.name" />
      </article>
    </section>
    <p v-else-if="loaded">No miniclosets yet!</p>
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
  /* background-color: var(--base-bg); */
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
