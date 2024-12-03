<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const name = ref("");
const description = ref("");
const imgUrl = ref("");
const type = ref("");

const createClothing = async (name: string, description: string, imgUrl: string, type: string) => {
  try {
    await fetchy(`/api/clothes`, "POST", {
      body: { name, description, imgUrl, type },
    });
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  name.value = "";
  description.value = "";
  imgUrl.value = "";
  type.value = "";
};
</script>

<template>
  <div class="focusWidth">
    <form @submit.prevent="createClothing(name, description, imgUrl, type)">
      <fieldset>
        <div class="pure-control-group">
          <h2 for="aligned-url">Clothing Image URL</h2>
          <input v-model.trim="imgUrl" type="text" id="aligned-url" placeholder="URL" required />
        </div>
        <div class="pure-control-group">
          <h2 for="aligned-tags">Clothing Name</h2>
          <input v-model.trim="name" id="aligned-tags" placeholder="Name" required />
        </div>
        <div class="pure-control-group">
          <h2 for="aligned-tags">Clothing Description</h2>
          <input v-model.trim="description" id="aligned-tags" placeholder="Description" />
        </div>
        <div class="pure-control-group">
          <h2 for="aligned-type">Clothing Type</h2>
          <select v-model="type" id="aligned-type" required>
            <option value="" disabled>Select Type</option>
            <option value="hat">Hat</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="onepiece">Onepiece</option>
            <option value="shoe">Shoe</option>
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
