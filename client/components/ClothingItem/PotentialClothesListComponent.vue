<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import PotentialClosetClothingItemComponent from "./PotentialClosetClothingItemComponent.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["closet"]);
const loaded = ref(false);
const clothesNotAdded = ref<Array<Record<string, string>>>([]);
const clothesAdded = ref<Array<Record<string, string>>>([]);
const toAddClothes = ref<Array<string>>([]);
const toRemoveClothes = ref<Array<string>>([]);
// const searchQuery = ref("");
// const filterType = ref("");

// function handleSearchUpdate(query: string) {
//   searchQuery.value = query;
// }

// function handleFilterUpdate(filter: string) {
//   filterType.value = filter;
// }

async function getPotentialClothes() {
  // TODO: replace api to get all clothes and then mark the clothes in current closet (also call that api) to be
  let allClothesResults;
  console.log("closet", props.closet._id);
  try {
    /// TODO: change this to api for searchAndFilterCloset
    // allClothesResults = await fetchy(`/api/closets/${props.closet._id}/clothes`, "GET", { alert: false });
    allClothesResults = await fetchy(`/api/clothes`, "GET", { alert: false });
  } catch (_) {
    return;
  }
  console.log("bruh", allClothesResults);
  clothesNotAdded.value = allClothesResults.filter((clothing: Record<string, string>) => !props.closet.clothes.includes(clothing._id)); /// TODO: objectId not do equality checking correctly
  clothesAdded.value = props.closet.clothes; /// TODO: get all the corresponding clothes by id or reformat
}

const submitClosetClothesChanges = async () => {
  try {
    const promises = toAddClothes.value.map((clothing) => fetchy(`/api/closets/${props.closet._id}/addClothing/${clothing}`, "PATCH", { alert: false }));
    await Promise.all(promises);
  } catch (e) {
    return;
  }

  try {
    const promises = toRemoveClothes.value.map((clothing) => fetchy(`/api/closets/${props.closet._id}/removeClothing/${clothing}`, "PATCH", { alert: false }));
    await Promise.all(promises);
  } catch (e) {
    return;
  }
  emptyForm();
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
  // searchQuery.value = "";
  // filterType.value = "";
}

onBeforeMount(async () => {
  await getPotentialClothes();
  loaded.value = true;
});

/// TODO: same as ClosetClothesListComponent, do we represent clothes are the fully thing from api results?
</script>

<template>
  <!-- <div>
    <h1>Clothing Search and Filter</h1>
    <SearchBarComponent @update:query="handleSearchUpdate" />
    <DropdownFilterComponent @update:filter="handleFilterUpdate" />

    <p><strong>Search Query:</strong> {{ searchQuery }}</p>
    <p><strong>Selected Filter:</strong> {{ filterType }}</p>
  </div> -->
  <form @submit.prevent="submitClosetClothesChanges()">
    <section class="posts" v-if="loaded && clothesNotAdded.length !== 0">
      <article v-for="clothing in clothesAdded" :key="clothing._id">
        <PotentialClosetClothingItemComponent :clothing="clothing" @add="add" @remove="remove" :in-closet="true" />
      </article>
      <article v-for="clothing in clothesNotAdded" :key="clothing._id">
        <PotentialClosetClothingItemComponent :clothing="clothing" @add="add" @remove="remove" :in-closet="false" />
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
