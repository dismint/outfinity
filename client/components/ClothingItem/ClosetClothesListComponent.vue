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
  <div class="centered outside">
    <div class="centered inner">
      <div class="searchAndFilterContainer">
        <SearchBarComponent @update:query="handleSearchUpdate" />
        <DropdownFilterComponent @update:filter="handleFilterUpdate" />
        <!-- <p><strong>Search Query:</strong> {{ searchQuery }}</p> -->
        <!-- <p><strong>Selected Filter:</strong> {{ filterType }}</p> -->
      </div>
      <div v-if="props.closet.name !== 'main'" class="centered buttonContainer">
        <div class="buttonBody" @click="navigateToAddRemoveClothesPage">
          <div class="buttonText">Modify Minicloset</div>
        </div>
      </div>
      <div class="resultText">
        <h2>Results</h2>
      </div>
      <div class="centered clothesContainer" v-if="clothes.length !== 0">
        <div v-for="clothing in clothes" :key="clothing._id" class="centered" style="aspect-ratio: 1">
          <div class="elementBox">
            <ClosetClothingItemComponent :id="clothing" />
          </div>
        </div>
      </div>
      <p v-else>No clothes yet!</p>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.buttonContainer * {
  cursor: pointer;
}

.buttonContainer {
  margin-top: 0.5em;
  width: 100%;
  height: 6vmin;
  position: relative;
}

.buttonText {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Inter";
  font-weight: 700;
  z-index: 20;
  color: var(--text-color);
  transition: color 0.2s ease;
  z-index: 20;
}

.buttonBody::after {
  content: "";
  position: absolute;
  top: 0;
  buttom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: var(--dark-green);
  transition: opacity 0.2s ease;
}

.buttonBody:hover::after {
  opacity: 1;
}

.buttonContainer:hover .buttonText {
  color: var(--primary-background);
}

.buttonBody {
  position: relative;
  width: 50%;
  height: 80%;
  background-color: var(--light-green);
}

.resultText {
  width: 100%;
}

.elementBox {
  width: 80%;
  height: 80%;
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}

.clothesContainer {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
  grid-auto-rows: minmax(0, 1fr);
  width: 100%;
  height: 100%;
  place-items: center;
}

h2 {
  margin-top: 0.5em;
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

.searchAndFilterContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.inner {
  width: 95%;
}

.outside {
  width: 100%;
  border-radius: 3vmin;
  background-color: var(--light);
}
</style>
