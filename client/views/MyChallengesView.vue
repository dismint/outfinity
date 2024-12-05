<script setup lang="ts">
import ChallengePreviewComponent from "@/components/Challenging/ChallengePreviewComponent.vue";
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const userId = storeToRefs(useUserStore()).userId.value;
const challenges = ref<Array<Record<string, string>>>([]);
const activeChallenges = ref<Array<Record<string, string>>>([]);
const inactiveChallenges = ref<Array<Record<string, string>>>([]);
const participatedChallenges = ref<Array<Record<string, string>>>([]);

const getAllChallenges = async () => {
  let challengeInfo;
  try {
    challengeInfo = await fetchy(`/api/challenges/owner/${userId}`, "GET", {});
  } catch (e) {
    return;
  }
  challenges.value = challengeInfo;
};


const openChallengePage = async (id: string) => {
  router.push({ name: "SingleChallenge", params: { id } });
};

onBeforeMount(async () => {
  await getAllChallenges();
  activeChallenges.value = challenges.value.filter((challenge: Record<string, string>) => challenge.active);
  inactiveChallenges.value = challenges.value.filter((challenge: Record<string, string>) => !challenge.active);
});
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <h1>My Challenges</h1>
        <div class="challengesContainer">
          <div class="row centered" v-if="!challenges">
            <h2>No challenges found!</h2>
          </div>
          <div v-else class="full">
            <h2>Active Challenges</h2>
            <div class="challengeContainer" v-for="challenge in activeChallenges" v-on:click="openChallengePage(challenge._id)">
              <ChallengePreviewComponent :id="challenge._id" />
            </div>
            <h2>Inactive Challenges</h2>
            <div class="challengeContainer" v-for="challenge in inactiveChallenges" v-on:click="openChallengePage(challenge._id)">
              <ChallengePreviewComponent :id="challenge._id" />
            </div>
            <h2>Participated Challenges</h2>
            <div class="challengeContainer" v-for="challenge in participatedChallenges" v-on:click="openChallengePage(challenge._id)">
              <ChallengePreviewComponent :id="challenge._id" />
            </div>  
          </div>
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

.challengesContainer {
  width: 100%;
  background-color: var(--light);
  border-radius: 3vmin;
  padding: 2vmin;
}

.challengeContainer {
  width: 100%;
  background-color: var(--light-green);
  margin: 1vmin 0;
  border-radius: 1vmin;
  cursor: pointer;
}

h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
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
