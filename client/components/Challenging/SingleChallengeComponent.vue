<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SubmissionComponent from "./SubmissionComponent.vue";

const props = defineProps(["id"]);
const challenge = ref<Record<string, string>>({});
const submissions = ref<Array<Record<string, string>>>([]);
const closetName = ref("");
const { userId } = storeToRefs(useUserStore());

const getClosetNames = async () => {
  let apiResult;
  try {
    apiResult = await fetchy(`/api/closets/${challenge.value.closet.toString()}`, "GET", {});
  } catch (e) {
    return;
  }
  closetName.value = apiResult.name;
};

const getChallengeInfo = async () => {
  let challengeInfo;
  try {
    challengeInfo = await fetchy(`/api/challenges/${props.id}`, "GET", {});
  } catch (e) {
    return;
  }
  challenge.value = challengeInfo;
  submissions.value = challengeInfo.submissions;
};

const enterChallenge = async () => {
  void router.push({ name: "CreateOutfit", params: { outfitOrChallenge: "challenge", closet: challenge.value.closet, challengeId: props.id } });
};

const endChallenge = async () => {
  try {
    await fetchy(`/api/challenges/${props.id}/end`, "PATCH", {});
  } catch (e) {
    return;
  }
  void router.push({ name: "Challenges" });
};

onBeforeMount(async () => {
  await getChallengeInfo();
  await getClosetNames();
});
</script>

<template>
  <div class="column challengeContainer">
    <div class="column infoContainer">
      <div class="textInfoContainer">
        <h3>Description</h3>
        <p style="margin-bottom: 2vmin">{{ challenge.description }}</p>
        <h3>Closet</h3>
        <p>{{ closetName }}</p>
      </div>
      <div v-if="challenge.active" class="full">
        <div class="centered delete" v-if="userId === challenge.owner">
          <button class="end" @click="endChallenge">End Challenge</button>
        </div>
        <div class="enter" v-else>
          <button class="enter" @click="enterChallenge">Enter Challenge</button>
        </div>
      </div>
    </div>
    <div class="interactingContainer">
      <h2>Entries</h2>
      <div class="challengeEntryContainer" v-for="(owner, outfit) in submissions">
        <SubmissionComponent :outfit="outfit" :owner="challenge.owner" :id="props.id" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.interactingContainer {
  width: 100%;
}

h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

h3 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2em;
}

.imageContainer {
  height: 100%;
  width: 50%;
  object-fit: coer;
}

.textInfoContainer {
  width: 100%;
  height: 85%;
}

.delete {
  width: 100%;
  height: 15%;
}

.infoContainer {
  padding: 2vmin;
  width: 100%;
}

button {
  border: none;
  padding: 1vmin;
  margin: 2vmin 0;
  background-color: var(--light-grey);
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  cursor: pointer;
}

button.end:hover {
  background-color: var(--red);
  color: var(--light);
}

button.enter:hover {
  background-color: var(--light-green);
}

.challengeContainer {
  width: 100%;
  border-radius: 3vmin;
  padding: 2vmin;
  background-color: var(--light);
}
</style>
