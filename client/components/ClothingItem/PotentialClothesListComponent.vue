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
    await fetchy(`/api/closets/${props.closet._id}/add`, "PATCH", { body: { clothes: toAddClothes.value }, alert: false });
  } catch (e) {
    return;
  }

  try {
    await fetchy(`/api/closets/${props.closet._id}/remove`, "PATCH", { body: { clothes: toRemoveClothes.value }, alert: false });
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
  <div class="centered buttonContainer" @click="submitClosetClothesChanges">
    <div class="buttonText">Save</div>
  </div>
  <div v-if="loaded && (clothesNotAdded.length !== 0 || clothesAdded.length !== 0)">
    <div class="centered clothesContainer">
      <div v-for="clothing in clothesAdded.concat(clothesNotAdded)" :key="clothing" class="centered" style="aspect-ratio: 1">
        <div class="elementBox">
          <PotentialClosetClothingItemComponent :id="clothing" @add="add" @remove="remove" :in-closet="clothesAdded.includes(clothing)" />
        </div>
      </div>
    </div>
  </div>
  <p v-else-if="loaded">No clothes!</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: 0;
}

.searchAndFilterContainer {
  width: 100%;
  margin-bottom: 2vmin;
}

.buttonContainer {
  cursor: pointer;
}

.buttonText {
  font-size: 2vmin;
  font-weight: 600;
  font-family: "Inter";
  color: var(--dark-green);
  transition: color 0.3s ease;
  z-index: 20;
}

.buttonContainer {
  position: relative;
  width: 50%;
  height: 80%;
  background-color: var(--light-green);
  padding: 2vmin;
  margin-bottom: 2vmin;
}

.buttonContainer::after {
  content: "";
  position: absolute;
  top: 0;
  right: 100%;
  left: 0;
  bottom: 0;
  background-color: var(--dark-green);
  transition: right 0.3s ease;
  z-index: 10;
}

.buttonContainer:hover::after {
  right: 0;
}

.buttonContainer:hover .buttonText {
  color: var(--primary-background);
}

.elementBox {
  width: 80%;
  height: 80%;
  max-width: 100%;
  max-height: 100%;
}

.clothesContainer {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  width: 100%;
  height: 100%;
  place-items: center;
}
</style>
