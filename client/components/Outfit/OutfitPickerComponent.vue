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
  <div>
    <h1>Pick Your Outfit</h1>
    <nav class="categories">
      <button v-for="category in categories" :key="category" :class="{ active: category === selectedCategory }" @click="switchCategory(category)">
        {{ category }}
      </button>
    </nav>
    <section class="clothes" v-if="filteredClothes.length !== 0">
      <article v-for="clothing in filteredClothes" :key="clothing._id">
        <ClosetClothingItemComponent :id="clothing._id" :clothingobject="clothing" @click="emit('clickClothing', clothing._id)" />
      </article>
    </section>
    <p v-else>No clothes found in this category!</p>
  </div>
</template>

<style scoped>
.categories {
  display: flex;
  gap: 1em;
  margin-bottom: 1em;
  justify-content: center;
}

button {
  background-color: #ddd;
  border: none;
  padding: 0.5em 1em;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

button.active {
  background-color: #aaa;
  font-weight: bold;
}

.clothes {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  justify-content: center;
}

article {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 1em;
  width: 150px;
  text-align: center;
}
</style>
