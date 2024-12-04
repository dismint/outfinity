<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { computed, defineProps, onBeforeMount, ref } from "vue";
import ClosetClothingItemComponent from "../ClothingItem/ClosetClothingItemComponent.vue";

const props = defineProps(["closet"]);

const selectedCategory = ref("all");
const clothes = ref<Array<Record<string, string>>>([]);
const loaded = ref(false);
const emit = defineEmits(["clickClothing"]);

const categories = ["all", "hat", "top", "bottom", "onepiece", "shoe"];

const getClothes = async () => {
  let clothesResults;
  try {
    clothesResults = await Promise.all(props.closet.clothes.map((clothing: string) => fetchy(`/api/clothes`, "GET", { query: { id: clothing } })));
  } catch (_) {
    return;
  }
  clothes.value = clothesResults;
};

const filteredClothes = computed(() => {
  if (selectedCategory.value === "all") {
    return clothes.value || [];
  }
  return clothes.value.filter((clothing: any) => clothing.type === selectedCategory.value);
});

const switchCategory = (category: string) => {
  selectedCategory.value = category;
};

onBeforeMount(async () => {
  await getClothes();
  loaded.value = true;
});
</script>

<template>
  <nav class="row">
    <button v-for="category in categories" :key="category" :class="{ active: category === selectedCategory }" @click="switchCategory(category)">
      {{ category }}
    </button>
  </nav>
  <section class="clothes" v-if="filteredClothes.length !== 0">
    <article v-for="clothing in filteredClothes" :key="clothing._id">
      <ClosetClothingItemComponent :id="clothing._id" :noclick="true" :clothingobject="clothing" @click="emit('clickClothing', clothing._id)" />
    </article>
  </section>
  <p v-else>No clothes found in this category!</p>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

nav {
  margin: 1vmin;
  gap: 1vmin;
}

button {
  background-color: var(--light-grey);
  border: none;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

button.active {
  background-color: var(--light-green);
  font-weight: bold;
}

.clothes {
  display: flex;
  flex-wrap: wrap;
  gap: 1vmin;
  justify-content: flex-start;
  align-items: flex-start;
}

article {
  width: 10%;
  aspect-ratio: 1;
}
</style>
