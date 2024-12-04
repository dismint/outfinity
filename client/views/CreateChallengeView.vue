<script setup lang="ts">
import CreateChallengeForm from "@/components/Challenging/CreateChallengeForm.vue";
</script>

<template>
  <div class="centered">
    <div class="compressWidth">
      <h1>New Challenge</h1>
      <CreateChallengeForm />
    </div>
  </div>
</template>

<style scoped>
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
