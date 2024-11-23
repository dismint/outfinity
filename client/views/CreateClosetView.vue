<script setup lang="ts">
import NewMiniClosetComponent from "@/components/Closet/NewMiniClosetComponent.vue";
</script>

<template>
  <main>
    <h1>Create New Minicloset</h1>
    <NewMiniClosetComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.closets {
  display: flex;
  flex-direction: row;
  gap: 1em;
  justify-content: space-around;
}
</style>
