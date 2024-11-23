<script setup lang="ts">
import router from "@/router";
// import { Picker } from "emoji-mart-vue";
// import "emoji-mart-vue/dist/style.css";
import { ref } from "vue";

const name = ref("");
const emoji = ref("😜");

const newMiniCloset = async (name: string, emoji: string) => {
  /// TODO: api to make new minicloset
  // try {
  //   await fetchy(`/api/posts/${props.post._id}`, "PATCH", { body: { content: content } });
  // } catch (e) {
  //   return;
  // }
  console.log(name, emoji);
  void router.push({ name: "AllClosets" });
};

const selectedEmoji = ref("");

const onEmojiSelect = (emoji: any) => {
  selectedEmoji.value = emoji;
};
</script>

<template>
  <form @submit.prevent="newMiniCloset(name, selectedEmoji)">
    <h2>Name:</h2>
    <textarea id="name" v-model="name" required> </textarea>
    <h2 class="author">Select an emoji to represent this minicloset!</h2>
    <!-- <div class="base">emoji dropdown?</div> -->
    <div>
      <!-- <Picker @emoji-select="onEmojiSelect" /> -->
      <div v-if="selectedEmoji">Selected Emoji: {{ selectedEmoji }}</div>
    </div>
    <!-- <form @submit.prevent="newMiniCloset(name, selectedEmoji.value.native)"> -->
    <button class="" type="submit">create minicloset</button>
  </form>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  cursor: pointer;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
