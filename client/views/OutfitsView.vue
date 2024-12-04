<script setup lang="ts">
import OutfitsListComponent from "@/components/Outfit/OutfitsListComponent.vue";
import router from "@/router";

const navigateToCreateOutfitPage = () => {
  void router.push({ name: "CreateOutfit", params: { outfitOrChallenge: "outfit", closet: "main", challengeId: "none" } });
};
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <h1>Outfits</h1>
        <div class="outfitsListContainer centered">
          <button @click="navigateToCreateOutfitPage">Create New Outfit</button>
          <OutfitsListComponent />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.outfitsListContainer {
  background-color: var(--light);
  padding: 2vmin;
  border-radius: 3vmin;
}

h1 {
  box-sizing: border-box;
  display: block;
  width: 100%;
  font-family: "Eczar";
  color: var(--dark-green);
  text-align: left;
  margin-top: 1em;
  font-size: 4em;
}

button {
  padding: 1vmin;
  margin: 1vmin;
  background-color: var(--dark-green);
  color: var(--light);
  cursor: pointer;
}
</style>
