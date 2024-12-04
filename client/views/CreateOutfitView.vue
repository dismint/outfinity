<script setup lang="ts">
import CreateOutfitComponent from "@/components/Outfit/CreateOutfitComponent.vue";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";

const props = defineProps(["outfitOrChallenge", "closet", "challengeId"]);

const main = ref<Record<string, string>>({});
const { userId } = storeToRefs(useUserStore());
const loaded = ref(false);

async function getMainCloset() {
  let query: Record<string, string> = { user: userId.value, name: "main" };
  let mainResult;
  try {
    mainResult = await fetchy("/api/closets/byname", "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  main.value = mainResult;
}

onBeforeMount(async () => {
  await getMainCloset();
  loaded.value = true;
});
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <h1>Create Outfit</h1>
        <CreateOutfitComponent v-if="loaded && props.outfitOrChallenge==='outfit'" :outfitOrChallenge="'outfit'" :closet="main" />
        <CreateOutfitComponent v-else-if="loaded && props.outfitOrChallenge==='challenge'" :outfitOrChallenge="'challenge'" :closet="props.closet" :challengeId="props.challengeId" />
      </div>
    </div>
  </main>
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
