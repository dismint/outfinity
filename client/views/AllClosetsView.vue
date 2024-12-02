<script setup lang="ts">
import router from "@/router";
import MainClosetComponent from "@/components/Closet/MainClosetComponent.vue";
import MiniClosetListComponent from "@/components/Closet/MiniClosetListComponent.vue";

const navigateToNewMiniclosetPage = async () => {
  void router.push({ name: "CreateCloset" });
};

const navigateToNewClothesPage = async () => {
  void router.push({ name: "AddClothes" });
};
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <h1>Closets</h1>

        <div class="closets">
          <MainClosetComponent />
          <MiniClosetListComponent />
        </div>
        <button @click="navigateToNewClothesPage">New Clothing</button>
        <button @click="navigateToNewMiniclosetPage">New Minicloset</button>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  box-sizing: border-box;
  display: block;
  width: 100%;
  font-family: "Eczar";
  color: var(--dark-green);
  text-align: left;
  font-size: 4em;
  padding: 0;
  margin-top: 1em;
}

.closets {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  width: 100%;
  /*background: var(--light);*/
  /*height: 60vh;*/
  /*padding: 1em;*/
  /*border-radius: 4em;*/
}
</style>
