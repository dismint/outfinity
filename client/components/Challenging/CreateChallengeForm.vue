<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const userId = storeToRefs(useUserStore()).userId.value;

const name = ref("");
const description = ref("");
const closetId = ref("");
let closets = ref<Array<Record<string, string>>>([]);

const getClosetInfo = async () => {
    let query: Record<string, string> = { id: userId };
    let closetResults;
    try {
         closetResults = await fetchy("/api/closets/user", "GET", { query });
    } catch (_) {
        return;
    }
    closets.value = closetResults;
};

const createChallenge = async (name: string, description: string, closetId: string) => {
  try {
    await fetchy(`/api/challenges`, "POST", {
      body: { name, description, closetId },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
  description.value = "";
  closetId.value = "";
};

onBeforeMount(async () => {
  await getClosetInfo();
});
</script>

<template>
  <div class="focusWidth">
    <form @submit.prevent="createChallenge(name, description, closetId)">
      <fieldset>
        <div class="pure-control-group">
          <h2 for="aligned-tags">Challenge Name</h2>
          <input v-model.trim="name" id="aligned-tags" placeholder="Name" required />
        </div>
        <div class="pure-control-group">
          <h2 for="aligned-tags">Challenge Description</h2>
          <input v-model.trim="description" id="aligned-tags" placeholder="Description" />
        </div>
        <div class="pure-control-group">
          <h2 for="aligned-type">Closet To Pick Clothes From</h2>
            <select v-model="closetId" id="aligned-type" required>
                <option value="" disabled selected>Select a Closet</option>
                <option v-for="closet in closets" :key="closet._id" :value="closet._id">{{ closet.name }}</option>
            </select>
        </div>
        <div class="pure-controls">
          <button type="submit"><div class="above">Submit</div></button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

.focusWidth {
  background-color: var(--light);
  padding: 2vmin;
  border-radius: 2vmin;
}

select {
  width: 100%;
}

form {
  width: 100%;
  border: none;
}

input {
  width: 100%;
  height: 1.6em;
  font-family: "Inter";
  font-weight: 500;
}

h2 {
  margin: 0.75em 0em 0.5em 0em;
  font-family: "Eczar";
  font-weight: 600;
  font-size: 2.5em;
}

fieldset {
  border: none;
}

button {
  margin: 1em 0;
  width: 100%;
  height: 8vh;
  font-family: "Inter";
  font-size: 2.5vh;
  font-weight: 700;
  background-color: var(--light-green);
  border: none;
  border-radius: 2vmin;
  cursor: pointer;
  position: relative;
}

.above {
  position: relative;
  z-index: 20;
  transition: color 0.2s ease;
}

button::before {
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
  opacity: 0;
  transition: opacity 0.2s ease;
}

button * {
  z-index: 20;
}

button:hover::before {
  opacity: 1;
}

button:hover .above {
  color: var(--primary-background);
}
</style>
