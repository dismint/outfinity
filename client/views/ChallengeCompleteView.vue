<script setup lang="ts">
import router from "@/router";

const goToHome = () => {
  void router.push("/");
};
</script>

<template>
  <div class="challenge-complete">
    <h1>Challenge Complete!</h1>
    <p>🎉Congratulations on completing the challenge!🎉</p>
    <button @click="goToHome">Go Home</button>
  </div>
</template>

<style scoped>
.challenge-complete {
  text-align: center;
  margin-top: 50px;
}

.challenge-complete h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

.challenge-complete p {
  font-size: 1.2em;
  margin-bottom: 30px;
}

.challenge-complete button {
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
}
</style>
