<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import MiniClosetComponent from "./MiniClosetComponent.vue";

const { userId } = storeToRefs(useUserStore());

const loaded = ref(false);
let miniclosets = ref<Array<Record<string, string>>>([]);

async function getMiniclosets() {
  let query: Record<string, string> = { id: userId.value };
  let miniclosetResults;
  try {
    miniclosetResults = await fetchy("/api/closets/user", "GET", { query });
  } catch (_) {
    return;
  }
  miniclosets.value = miniclosetResults.filter((minicloset: Record<string, string>) => minicloset.name !== "main");
}

onBeforeMount(async () => {
  await getMiniclosets();
  loaded.value = true;
});
</script>

<template>
  <div class="centered outerContainer">
    <div class="innerBox">
      <div v-if="loaded && miniclosets.length !== 0" style="width: 100%; height: 100%">
        <div class="miniClosetsContainer">
          <div v-for="minicloset in miniclosets" :key="minicloset._id" class="centered" style="aspect-ratio: 1">
            <div class="elementBox">
              <MiniClosetComponent :id="minicloset._id" :emoji="minicloset.description" :name="minicloset.name" />
            </div>
          </div>
        </div>
      </div>
      <p v-else-if="loaded">Add a Minicloset!</p>
      <p v-else>Loading...</p>
    </div>
  </div>
</template>

<style scoped>
.elementBox {
  width: 95%;
  height: 95%;
}

.miniClosetsContainer {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: 100%;
  height: 100%;
}

.innerBox {
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 98%;
  height: 100%;
  margin: 1%;
}

.outerContainer {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--light);
  border-radius: 3vh;
}

p {
  font-family: "Eczar";
  font-size: 2em;
  text-align: center;
  font-weight: 500;
}
</style>
