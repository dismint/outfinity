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
  <main>
    <img src="../../assets/images/closet.png" alt="closet" @click="navigateToClosetPage" />
    <h1 class="author">Main Closet</h1>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
