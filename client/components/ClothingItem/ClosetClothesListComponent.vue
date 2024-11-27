<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, ref } from "vue";
import ClosetClothingItemComponent from "./ClosetClothingItemComponent.vue";
import DropdownFilterComponent from "./DropdownFilterComponent.vue";
import SearchBarComponent from "./SearchBarComponent.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["closet"]);
const clothes = ref<Array<Record<string, string>>>(props.closet.clothes);
//// TODO: if we format collection results, then we can pass in closet.clothes and then access each clothes from there
const searchQuery = ref("");
const filterType = ref("");

function handleSearchUpdate(query: string) {
  searchQuery.value = query;
}

function handleFilterUpdate(filter: string) {
  filterType.value = filter;
}

const navigateToAddRemoveClothesPage = async () => {
  void router.push({ name: "AddRemoveClothes", params: { id: props.closet._id } });
};
</script>

<template>
  <div>
    <div>
      <h1>Clothing Search and Filter</h1>
      <SearchBarComponent @update:query="handleSearchUpdate" />
      <DropdownFilterComponent @update:filter="handleFilterUpdate" />

      <p><strong>Search Query:</strong> {{ searchQuery }}</p>
      <p><strong>Selected Filter:</strong> {{ filterType }}</p>
    </div>
    <button v-if="props.closet.name !== 'main'" @click="navigateToAddRemoveClothesPage">add/remove items from closet</button>
    <h3>Results</h3>
    <section class="posts" v-if="clothes.length !== 0">
      <article v-for="clothing in clothes" :key="clothing._id">
        <ClosetClothingItemComponent :id="clothing" />
      </article>
    </section>
    <p v-else>No clothes yet!</p>
  </div>
</template>

<style scoped>
div {
  max-width: 400px;
  margin: 0 auto;
}

h1 {
  text-align: center;
  margin-bottom: 1em;
}

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
