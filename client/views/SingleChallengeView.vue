<script setup lang="ts">
import SingleChallengeComponent from "@/components/Challenging/SingleChallengeComponent.vue";
import { defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../utils/fetchy";

const props = defineProps(["id"]);
const challenge = ref<Record<string, string>>({});

const getChallengeInfo = async () => {
  let challengeInfo;
  try {
    challengeInfo = await fetchy(`/api/challenges/${props.id}`, "GET", {});
  } catch (e) {
    return;
  }
  challenge.value = challengeInfo;
};

onBeforeMount(async () => {
  await getChallengeInfo();
});
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <div class="headerContainer">
          <h1>{{ challenge.name }}</h1>
        </div>
        <SingleChallengeComponent :id="props.id" />
      </div>
    </div>
  </main>
</template>

<style scoped>
.headerContainer {
  color: var(--dark-green);
  width: 100%;
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
</style>
