<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import DropdownFilterComponent from "./DropdownFilterComponent.vue";
import PotentialClosetClothingItemComponent from "./PotentialClosetClothingItemComponent.vue";
import SearchBarComponent from "./SearchBarComponent.vue";

const { userId } = storeToRefs(useUserStore());

const props = defineProps(["closet"]);
const loaded = ref(false);
const clothesNotAdded = ref<Array<string>>([]);
const clothesAdded = ref<Array<string>>([]);
const toAddClothes = ref<Array<string>>([]);
const toRemoveClothes = ref<Array<string>>([]);
const searchQuery = ref("");
const filterType = ref("");

async function getPotentialClothes() {
  const mainId = (await getMainCloset())._id;
  // let allClothesResults;
  // try {
  //   allClothesResults = await fetchy(`/api/users/${userId.value}/closets/${mainId}/searchandfilter`, "GET", { alert: false });
  // } catch (_) {
  //   return;
  // }
  const typeNotInQuery = filterType.value === "all" || filterType.value === "";
  let query;
  if (typeNotInQuery && searchQuery.value === "") {
    query = {};
  } else if (!typeNotInQuery && searchQuery.value !== "") {
    query = { keyword: searchQuery.value, type: filterType.value };
  } else if (typeNotInQuery) {
    query = { keyword: searchQuery.value };
  } else {
    query = { type: filterType.value };
  }
  let allClothesResults;
  try {
    allClothesResults = await fetchy(`/api/users/${userId.value}/closets/${mainId}/searchandfilter`, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  clothesNotAdded.value = allClothesResults.filter((clothing: Record<string, string>) => !props.closet.clothes.includes(clothing));
  clothesAdded.value = allClothesResults.filter((clothing: Record<string, string>) => props.closet.clothes.includes(clothing));
}

async function getMainCloset() {
  let query: Record<string, string> = { user: userId.value, name: "main" };
  let mainIdResult;
  try {
    mainIdResult = await fetchy("/api/closets/byname", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  return mainIdResult;
}

const submitClosetClothesChanges = async () => {
  try {
    await fetchy(`/api/closets/${props.closet._id}/bulkAddClothing`, "PATCH", { body: { clothes: toAddClothes.value }, alert: false });
  } catch (e) {
    return;
  }

  try {
    await fetchy(`/api/closets/${props.closet._id}/bulkRemoveClothing`, "PATCH", { body: { clothes: toRemoveClothes.value }, alert: false });
  } catch (e) {
    return;
  }
  emptyForm();
  let mainIdResult;
  try {
    mainIdResult = await fetchy(`/api/closets/${props.closet._id}`, "GET", { alert: false });
  } catch (_) {
    return;
  }
  console.log("closet", mainIdResult);
  void router.push({ name: "Closet", params: { id: props.closet._id } });
};

function add(id: string) {
  const index = toRemoveClothes.value.indexOf(id);
  if (index > -1) {
    toRemoveClothes.value.splice(index, 1);
  } else {
    toAddClothes.value.push(id);
  }
}

function remove(id: string) {
  const index = toAddClothes.value.indexOf(id);
  if (index > -1) {
    toAddClothes.value.splice(index, 1);
  } else {
    toRemoveClothes.value.push(id);
  }
}

function emptyForm() {
  toAddClothes.value = [];
  toRemoveClothes.value = [];
  searchQuery.value = "";
  filterType.value = "";
}

async function handleSearchUpdate(query: string) {
  searchQuery.value = query;
  loaded.value = false;
  await getPotentialClothes();
  loaded.value = true;
}

async function handleFilterUpdate(filter: string) {
  filterType.value = filter;
  loaded.value = false;
  await getPotentialClothes();
  loaded.value = true;
}

onBeforeMount(async () => {
  await getPotentialClothes();
  loaded.value = true;
});
</script>

<template>
  <div class="searchAndFilterContainer">
    <SearchBarComponent @update:query="handleSearchUpdate" />
    <DropdownFilterComponent @update:filter="handleFilterUpdate" />
  </div>
  <form @submit.prevent="submitClosetClothesChanges()">
    <section class="posts" v-if="loaded && clothesNotAdded.length !== 0">
      <article v-for="clothing in clothesAdded" :key="clothing">
        <PotentialClosetClothingItemComponent :id="clothing" @add="add" @remove="remove" :in-closet="true" />
      </article>
      <article v-for="clothing in clothesNotAdded" :key="clothing">
        <PotentialClosetClothingItemComponent :id="clothing" @add="add" @remove="remove" :in-closet="false" />
      </article>
    </section>
    <p v-else-if="loaded">No potential new clothes!</p>
    <p v-else>Loading...</p>
    <button type="submit">save</button>
  </form>
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
