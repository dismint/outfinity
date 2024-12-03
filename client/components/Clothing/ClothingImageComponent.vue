<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onMounted, ref } from "vue";

const props = defineProps(["imgUrl"]);
</script>

<template>
  <div>
    <img :src="props.imgUrl" alt="Clothing Image" />
  </div>
</template>

<style scoped>
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
