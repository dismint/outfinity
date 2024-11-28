<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const { userId } = storeToRefs(useUserStore());
const mainId = ref("");

async function getMainCloset() {
  let query: Record<string, string> = { user: userId.value, name: "main" };
  let mainIdResult;
  try {
    mainIdResult = await fetchy("/api/closets/byname", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  mainId.value = mainIdResult._id;
}

const navigateToClosetPage = async () => {
  void router.push({ name: "Closet", params: { id: mainId.value } });
};

onBeforeMount(async () => {
  await getMainCloset();
});
</script>

<template>
  <main class="centered">
    <img src="../../assets/images/closet.png" alt="closet" @click="navigateToClosetPage" />
    <h1 class="author">Main Closet</h1>
  </main>
</template>

<style scoped>
.centered {
  width: 50%;
  height: 100%;
}

img {
  height: 100%;
  width: 100%;
  height: auto;
  cursor: pointer;
}

.author {
  font-family: "Eczar";
  font-size: 2em;
  margin: 0;
}
</style>
