<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
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

async function getPotentialClothes() {
  // let query: Record<string, string> = { owner: currentUsername.value };
  // TODO: replace api to get all clothes and then mark the clothes in current closet (also call that api) to be
  /// TODO: add a property to all clothes that is a boolean if it is about to be added or not (the check)
  // let miniclosetResults;
  // try {
  //   miniclosetResults = await fetchy("/api/posts", "GET", { query });
  // } catch (_) {
  //   return;
  // }
  // searchAuthor.value = author ? author : "";
  // miniclosets.value = miniclosetResults;
  // console.log(props.id);
  clothesNotAdded.value = [
    { _id: "1", name: "Not Clothing Item 1" },
    { _id: "2", name: "Not Clothing Item 2" },
    { _id: "3", name: "Not Clothing Item 3" },
  ];
  clothesAdded.value = [
    { _id: "4", name: "Not Clothing Item 4" },
    { _id: "5", name: "Not Clothing Item 5" },
    { _id: "6", name: "Not Clothing Item 6" },
  ];
}

const submitClosetClothesChanges = async () => {
  try {
    // await Promise.all(fetchy(`/api/closets/${props.closet._id}/addClothing/${clothing}`, "PATCH", { alert: false })); // iterate through all of toAddClothes
  } catch (e) {
    return;
  }

  try {
    // await Promise.all(fetchy(`/api/closets/${props.closet._id}/removeClothing/${clothing}`, "PATCH", { alert: false })); // iterate through all of toRemoveClothes
  } catch (e) {
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

onBeforeMount(async () => {
  await getPotentialClothes();
  loaded.value = true;
});

/// TODO: same as ClosetClothesListComponent, do we represent clothes are the fully thing from api results?
</script>

<template>
  <form @submit.prevent="submitClosetClothesChanges()">
    <section class="posts" v-if="loaded && clothesNotAdded.length !== 0">
      <article v-for="clothing in clothesAdded" :key="clothing._id">
        <PotentialClosetClothingItemComponent :id="clothing._id" @add="add" @remove="remove" :in-closet="true" />
      </article>
      <article v-for="clothing in clothesNotAdded" :key="clothing._id">
        <PotentialClosetClothingItemComponent :id="clothing._id" @add="add" @remove="remove" :in-closet="false" />
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
