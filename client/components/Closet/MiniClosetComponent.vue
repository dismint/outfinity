<script setup lang="ts">
import router from "@/router";

const props = defineProps(["id", "emoji", "name"]);

const navigateToClosetPage = async () => {
  void router.push({ name: "Closet", params: { id: props.id } });
};
</script>

<template>
  <div class="centered miniClosetOutsideBox" @click="navigateToClosetPage">
    <div class="centered full">
      <div class="emojiContainer">
        <h2 v-if="props.emoji" class="emoji">{{ props.emoji }}</h2>
        <h2 v-else class="emoji">&nbsp</h2>
      </div>
      <div class="nameContainer">
        <h2 class="name">{{ props.name }}</h2>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.miniClosetOutsideBox::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  opacity: 0;
  background-color: var(--medium-green);
  border-radius: 2vmin;
  z-index: 10;
  transition: opacity 0.2s ease;
}

.miniClosetOutsideBox:hover::before {
  opacity: 1;
}

.emojiContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75%;
}

.miniClosetOutsideBox {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--light-green);
  border-radius: 2vmin;
  cursor: pointer;
  box-sizing: border-box;
}
.emoji {
  box-sizing: border-box;
  font-size: clamp(1em, 5vw, 3.5em);
  z-index: 11;
}

.name {
  box-sizing: border-box;
  font-size: 0.7vw;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nameContainer {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5% 5%;
  height: 25%;
  width: 90%;
  max-width: 90%;
  padding: 2%;
  border: 3px solid rgba(0, 0, 0, 0);
  z-index: 10;
}

h2 {
  box-sizing: border-box;
  display: inline-block;
  font-family: "Inter";
  font-size: 2em;
  text-align: center;
}

.nameContainer:hover {
  transition:
    border 0.5s,
    max-width 0.5s ease-in-out;
  max-width: 530%;
  white-space: nowrap;
  width: auto;
  background-color: var(--light-green);
  border-radius: 1vmin;
  border: 3px solid var(--dark-green);
  z-index: 11;
}
</style>
