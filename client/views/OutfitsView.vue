<script setup lang="ts">
import OutfitsListComponent from "@/components/Outfit/OutfitsListComponent.vue";
import router from "@/router";

const navigateToCreateOutfitPage = () => {
  void router.push({ name: "CreateOutfit" });
};
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <h1>My Saved Outfits</h1>
        <button @click="navigateToCreateOutfitPage">Create New Outfit</button>
        <OutfitsListComponent />
      </div>
    </div>
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
