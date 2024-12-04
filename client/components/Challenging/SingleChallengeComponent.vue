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
const { userId } = storeToRefs(useUserStore());

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
});
</script>

<template>
  <div class="row clothingPageContainer">
    <div class="column infoContainer">
      <div class="textInfoContainer">
        <h2>Description</h2>
        <p>{{ challenge.description }}</p>
      </div>
      <div class="centered delete" v-if="userId === challenge.owner">
        <button class="end" @click="endChallenge"></button>
      </div>
      <div class="centered enter" v-else>
        <button class="enter" @click="enterChallenge"></button>
      </div>
    </div>
    <div class="challengeEntryContainer" v-for="outfit in submissions">
        <SubmissionComponent :outfit="outfit" :owner="challenge.owner" :id="props.id"/>
    </div>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

h2 {
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
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
  height: 100%;
  width: 50%;
}

button {
  width: 50%;
  height: 80%;
  border: none;
  background-color: var(--primary-background);
  position: relative;
}

button.enter::after {
  content: "Enter Challenge";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Inter";
  font-weight: 700;
  z-index: 20;
  color: var(--text-color);
  transition: color 0.3s ease;
}

button.end::after {
  content: "End Challenge";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Inter";
  font-weight: 700;
  z-index: 20;
  color: var(--text-color);
  transition: color 0.3s ease;
}

button.end::before {
  content: "";
  position: absolute;
  right: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(255, 105, 97, 1);
  z-index: 10;
  border: none;
  transition: right 0.3s ease;
  overflow: hidden;
}

button.enter::before {
  content: "";
  position: absolute;
  right: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: rgb(103, 209, 117);
  z-index: 10;
  border: none;
  transition: right 0.3s ease;
  overflow: hidden;
}

button:hover::before {
  right: 0;
}

button:hover::after {
  color: var(--primary-background);
}

.clothingPageContainer {
  width: 100%;
  height: 40vh;
  border-radius: 3vmin;
  padding: 3vmin;
  background-color: var(--light);
}
</style>
