<script setup lang="ts">
import ChallengePreviewComponent from "@/components/Challenging/ChallengePreviewComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const userId = storeToRefs(useUserStore()).userId.value;
const challenges = ref<Array<Record<string, string>>>([]);

const getAllChallenges = async () => {
  let challengeInfo;
  try {
    challengeInfo = await fetchy(`/api/challenges/owner/${userId}`, "GET", {});
  } catch (e) {
    return;
  }
  challenges.value = challengeInfo;
  console.log(challenges.value);
};

const openChallengePage = async (id: string) => {
  router.push({ name: "SingleChallenge", params: { id } });
};

onBeforeMount(async () => {
  await getAllChallenges();
});
</script>

<template>
  <main>
    <div class="row centered" v-if="!challenges">
        <h1>No challenges found!</h1>
    </div>
    <div class="row centered" v-else v-for="challenge in challenges" v-on:click="openChallengePage(challenge._id)">
      <ChallengePreviewComponent :id="challenge._id" />
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
