<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

const name = ref("");
const selectedEmoji = ref("");

const newMiniCloset = async (name: string, emoji: string) => {
  let closetResult;
  try {
    closetResult = await fetchy(`/api/closets`, "POST", { body: { name, emoji } });
  } catch (e) {
    return;
  }
  emptyForm();
  void router.push({ name: "Closet", params: { id: closetResult.collection._id } });
};

const emptyForm = () => {
  name.value = "";
  selectedEmoji.value = "";
};

interface Emoji {
  i: string;
  n: string[];
  r: string;
  t: string;
  u: string;
}

function onSelectEmoji(emoji: Emoji) {
  selectedEmoji.value = emoji.i;
}
</script>

<template>
  <div class="focusWidth">
    <form @submit.prevent="newMiniCloset(name, selectedEmoji)">
      <h2>Name</h2>
      <input id="name" v-model="name" required />
      <h2 class="author">Emoji</h2>
      <div class="centered">
        <EmojiPicker :native="true" @select="onSelectEmoji" />
      </div>
      <button v-if="selectedEmoji != '' && name == ''" class="centered gray" type="submit">
        <div class="bold">Create Minicloset</div>
        {{ selectedEmoji }}
      </button>
      <button v-else-if="name != ''" class="centered valid" type="submit">
        <div class="bold">Create Minicloset</div>
        <div>{{ name }} {{ selectedEmoji }}</div>
      </button>
      <button v-else class="centered gray" type="submit">Please fill out form!</button>
    </form>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.bold {
  font-weight: 800;
}

.gray {
  background-color: rgba(240, 240, 240, 1);
}

.valid {
  position: relative;
  width: 100%;
  height: 10vh;
  border-radius: 2vmin;
}

.valid::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: var(--dark-green);
  border-radius: 2vmin;
  z-index: 10;
  border: none;
  transition: opacity 0.2s ease;
  opacity: 0;
  overflow: hidden;
}

.valid:hover::before {
  opacity: 1;
}

.valid:hover * {
  color: var(--primary-background);
}

.focusWidth {
  background-color: var(--light);
  padding: 2vmin;
  border-radius: 2vmin;
}

form {
  width: 100%;
}

input {
  width: 100%;
  height: 1.6em;
  font-family: "Inter";
  font-weight: 500;
}

.v3-emoji-picker {
  width: 60%;
}

h2 {
  margin-top: 1em;
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}

.emoji {
  width: 500px;
  height: 20vh;
}

button {
  margin: 1em 0;
  width: 100%;
  height: 10vh;
  font-family: "Inter";
  font-size: 2.5vh;
  font-weight: 500;
  background-color: var(--light-green);
  border: none;
  border-radius: 2vmin;
  cursor: pointer;
}

button * {
  z-index: 11;
}
</style>
