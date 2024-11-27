<script setup lang="ts">
import { defineProps, onBeforeMount, ref } from "vue";
import EditLabels from "../Labeling/EditLabels.vue";

const props = defineProps(["id"]);
const item = ref<Record<string, string>>({});

const getItem = async () => {
  //// TODO: get item
  // fetch item
  // try {
  //   await fetchy(`/api/posts/${props.post._id}`, "DELETE");
  // } catch {
  //   return;
  // }
  item.value.name = "outfit name";
  item.value.description = "outfit description";
  item.value.owner = "jennifer";
};

// const woreOutfit = async () => {
//   // fetch description
//   // try {
//   //   await fetchy(`/api/posts/${props.post._id}`, "DELETE");
//   // } catch {
//   //   return;
//   // }
// };

onBeforeMount(async () => {
  await getItem();
});
</script>

<template>
  <main>
    <h1>{{ item.name }}</h1>
    <h2>id: {{ props.id }}</h2>
    <h3>{{ item.description }}</h3>
    <EditLabels :item="item" />
    <!-- <button @click="woreOutfit">I wore this today!</button> -->
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
