<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import ClosetClothingItemComponent from "./ClosetClothingItemComponent.vue";

const { isLoggedIn, currentUsername } = storeToRefs(useUserStore());

const props = defineProps(["id"]);
const loaded = ref(false);
const clothes = ref<Array<Record<string, string>>>([]);
const newClothes = ref<Array<Record<string, string>>>([]);

async function getClothes() {
  // let query: Record<string, string> = { owner: currentUsername.value };
  // TODO: replace api get clothes not in given closet
  ///// have to filter to not show main closet
  // let miniclosetResults;
  // try {
  //   miniclosetResults = await fetchy("/api/posts", "GET", { query });
  // } catch (_) {
  //   return;
  // }
  // searchAuthor.value = author ? author : "";
  // miniclosets.value = miniclosetResults;
  console.log(props.id);
  clothes.value = [
    { _id: "1", name: "Not Clothing Item 1" },
    { _id: "2", name: "Not Clothing Item 2" },
    { _id: "3", name: "Not Clothing Item 3" },
  ];
}

///// change closet clothing component to potential clothing component

const addClothes = async () => {
  // try {
  //   await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { content: content } });
  // } catch (e) {
  //   return;
  // }
  // emit("editPost");
  // emit("refreshPosts");
  void router.push({ name: "Closet", params: { id: props.id } });
};

onBeforeMount(async () => {
  await getClothes();
  loaded.value = true;
});
</script>

<template>
  <form @submit.prevent="addClothes()">
    <section class="posts" v-if="loaded && clothes.length !== 0">
      <article v-for="clothing in clothes" :key="clothing._id">
        <ClosetClothingItemComponent :id="clothing._id" :name="clothing.name" />
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
