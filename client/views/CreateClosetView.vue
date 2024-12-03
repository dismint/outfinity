<script setup lang="ts">
import NewMiniClosetComponent from "@/components/Closet/NewMiniClosetComponent.vue";
</script>

<template>
  <div class="centered">
    <div class="compressWidth">
      <h1>New Minicloset</h1>
      <NewMiniClosetComponent />
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

.closets {
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-content: space-around;
}
</style>
