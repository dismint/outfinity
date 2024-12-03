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
            <div class="centered leftBlank" @click="navigateToNewClothesPage">
              <h3>Add Clothes</h3>
            </div>
            <div class="centered rightBlank" @click="navigateToNewMiniclosetPage">
              <h3>New Closet</h3>
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

h3 {
  font-family: "Eczar";
  font-size: 2em;
  color: var(--dark-green);
  transition: color 0.3s ease;
  z-index: 11;
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
  position: relative;
  height: 100%;
  width: 40%;
  margin-left: auto;
  border-radius: 3vh 0 0 3vh;
  background-color: var(--primary-background);
  cursor: pointer;
}

.rightBlank::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 100%;
  background-color: var(--medium-green);
  z-index: 10;
  transition: left 0.3s ease;
  border-radius: 3vh 0 0 3vh;
}

.rightBlank:hover::before {
  left: 0;
}

.rightBlank:hover h3 {
  color: var(--light);
}

.leftBlank {
  position: relative;
  height: 100%;
  width: 40%;
  margin-right: auto;
  border-radius: 0 3vh 3vh 0;
  background-color: var(--primary-background);
  cursor: pointer;
}

.leftBlank::before {
  content: "";
  position: absolute;
  top: 0;
  right: 100%;
  bottom: 0;
  left: 0;
  background-color: var(--medium-green);
  z-index: 10;
  transition: right 0.3s ease;
  border-radius: 0 3vh 3vh 0;
}

.leftBlank:hover::before {
  right: 0;
}

.leftBlank:hover h3 {
  color: var(--light);
}
</style>
