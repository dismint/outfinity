<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineProps, onBeforeMount, ref } from "vue";

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
    <div class="row centered">
      <h1>{{ challenge.name }}</h1>
      <p>{{ challenge.description }}</p>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
</style>
