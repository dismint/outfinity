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
    <form @submit.prevent="createClothing(name, description, imgUrl, type)">
        <fieldset>
            <div class="pure-control-group">
                <label for="aligned-url">Clothing Image URL</label>
                <input v-model.trim="imgUrl" type="text" id="aligned-url" placeholder="URL" required />
            </div>
            <div class="pure-control-group">
                <label for="aligned-tags">Clothing Name</label>
                <input v-model.trim="name" id="aligned-tags" placeholder="Name" required />
            </div>
            <div class="pure-control-group">
                <label for="aligned-tags">Clothing Description</label>
                <input v-model.trim="description" id="aligned-tags" placeholder="Description" required />
            </div>
            <div class="pure-control-group">
                <label for="aligned-type">Clothing Type</label>
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
                <button type="submit" class="pure-button pure-button-primary">Submit</button>
            </div>
        </fieldset>
    </form>
</template>

<style scoped>
form {
    background-color: var(--base-bg);
    border-radius: 1em;
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    padding: 1em;
}

textarea {
    font-family: inherit;
    font-size: inherit;
    height: 6em;
    padding: 0.5em;
    border-radius: 4px;
    resize: none;
}
</style>
