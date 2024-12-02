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
          <div class="row filler">
            <div class="centered leftBlank">
              <button @click="navigateToNewClothesPage">New Clothing</button>
            </div>
            <div class="centered rightBlank">
              <button @click="navigateToNewMiniclosetPage">New Minicloset</button>
            </div>
          </div>
          <MiniClosetListComponent />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

h1 {
  box-sizing: border-box;
  display: block;
  width: 100%;
  font-family: "Eczar";
  color: var(--dark-green);
  text-align: left;
  font-size: 4em;
  margin-top: 1em;
}

.closets {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.filler {
  width: 100%;
  height: 10vh;
  background-color: var(--light);
}

.leftBlank {
  height: 100%;
  width: 40%;
  margin-right: auto;
  border-radius: 0 3vh 3vh 0;
  background-color: var(--primary-background);
}

.rightBlank {
  height: 100%;
  width: 40%;
  margin-left: auto;
  border-radius: 3vh 0 0 3vh;
  background-color: var(--primary-background);
}
</style>
