<script setup lang="ts">
import OutfitPickingComponent from "@/components/Outfit/OutfitPickingComponent.vue";
// const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
// import { defineProps, onBeforeMount, ref } from "vue";

// const props = defineProps(["id"]);
</script>

<template>
  <main class="outfitpage">
    <!-- <OutfitImageComponent :id="props.id" /> -->
    <OutfitPickingComponent :title="'New Outfit'" :outfit-or-challenge="'outfit'" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.closets {
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-content: space-around;
}
</style>
