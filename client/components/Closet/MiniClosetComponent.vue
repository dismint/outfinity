<script setup lang="ts">
import router from "@/router";

const props = defineProps(["id", "emoji", "name"]);

const navigateToClosetPage = async () => {
  void router.push({ name: "Closet", params: { id: props.id } });
};
</script>

<template>
  <div class="miniClosetOutsideBox">sup</div>
</template>

<style scoped>
.miniClosetOutsideBox {
  width: 100%;
  height: 100%;
  background-color: var(--light-green);
  border-radius: min(2vh, 2vw);
}
/*.row {*/
/*  background-color: var(--light);*/
/*  max-height: 100%;*/
/*  max-width: 100%;*/
/*  height: 100%;*/
/*  width: 100%;*/
/*  box-sizing: border-box;*/
/*  box-shadow:*/
/*    -0.3em -0.3em 0.3em rgba(195, 206, 189, 0.8) inset,*/
/*    0.5em 0.5em 0.5em rgba(37, 37, 37, 0.8) inset;*/
/*  border-radius: 2em;*/
/*}*/
/**/
/*img {*/
/*  width: 30%;*/
/*  cursor: pointer;*/
/*}*/
/**/
/*h1 {*/
/*  font-family: "Eczar";*/
/*  font-size: 2em;*/
/*  max-width: 100%;*/
/*  text-align: center;*/
/*  cursor: pointer;*/
/*}*/
</style>
