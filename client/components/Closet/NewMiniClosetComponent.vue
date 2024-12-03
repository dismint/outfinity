<script setup lang="ts">
import router from "@/router";
// import { Picker } from "emoji-mart-vue";
// import "emoji-mart-vue/dist/style.css";
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";

const name = ref("");
const selectedEmoji = ref("");

const newMiniCloset = async (name: string, emoji: string) => {
  console.log("selected", name, emoji);
  let closetResult;
  try {
    closetResult = await fetchy(`/api/closets`, "POST", { body: { name, emoji } });
  } catch (e) {
    return;
  }
  console.log("id", closetResult.collection._id);
  emptyForm();
  void router.push({ name: "Closet", params: { id: closetResult.collection._id } });
};

const emptyForm = () => {
  name.value = "";
  selectedEmoji.value = "";
};

//  export default {
//    components: {
//      VueEmojiPicker
//    },
//    data() {
//      return {
//        message: ''
//      };
//    },
//    methods: {
//      addEmoji(emoji) {
//        this.message += emoji.native;
//      }
//    }
//  };

interface Emoji {
  i: string;
  n: string[];
  r: string;
  t: string;
  u: string;
}

function onSelectEmoji(emoji: Emoji) {
  // console.log(emoji);
  selectedEmoji.value = emoji.i;
  console.log(selectedEmoji.value);
  /*
    // result
    { 
        i: "😚", 
        n: ["kissing face"], 
        r: "1f61a", // with skin tone
        t: "neutral", // skin tone
        u: "1f61a" // without tone
    }
    */
}
</script>

<template>
  <form @submit.prevent="newMiniCloset(name, selectedEmoji)">
    <h2>Name:</h2>
    <textarea id="name" v-model="name" required> </textarea>
    <h2 class="author">Select an emoji to represent this minicloset!</h2>
    <div>
      <EmojiPicker :native="true" @select="onSelectEmoji" />
      <h3 v-if="selectedEmoji != ''">
        Emoji selected:
        <span class="emoji">{{ selectedEmoji }}</span>
      </h3>
    </div>
    <button class="centered" type="submit">create minicloset</button>
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

.emoji {
  width: 500px;
  height: auto;
}
</style>
