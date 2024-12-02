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
  <main class="mainClosetContainer">
    <div class="innerBox">
      <div class="centered imgContainer">
        <img src="../../assets/images/closet.png" alt="closet" @click="navigateToClosetPage" />
      </div>
      <div class="centered textContainer">
        <h1>Main Closet</h1>
      </div>
    </div>
  </main>
</template>

<style scoped>
.mainClosetContainer {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 15vh;
  background-color: var(--light);
  border-radius: 3vh;
}

.innerBox {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 95%;
  height: 80%;
}

.textContainer {
  box-sizing: border-box;
  padding: 10%;
  height: 100%;
  width: 80%;
}

.imgContainer {
  box-sizing: border-box;
  height: 100%;
  width: 20%;
}

img {
  height: 100%;
  cursor: pointer;
}

h1 {
  font-family: "Eczar";
  font-size: 4em;
  width: 100%;
  text-align: center;
}
</style>
