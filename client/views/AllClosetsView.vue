<script setup lang="ts">
// import PostListComponent from "@/components/Post/PostListComponent.vue";
import MainClosetComponent from "@/components/Closet/MainClosetComponent.vue";
import MiniClosetListComponent from "@/components/Closet/MiniClosetListComponent.vue";
</script>

<template>
  <main>
    <h1>My Closets</h1>
    <!-- <section>
      <h1 v-if="isLoggedIn">Welcome {{ currentUsername }}!</h1>
      <h1 v-else>Please login!</h1>
    </section> -->
    <!-- <PostListComponent /> -->
    <div class="closets">
      <MainClosetComponent />
      <MiniClosetListComponent />
    </div>
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
