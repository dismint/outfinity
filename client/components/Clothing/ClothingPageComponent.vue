<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onMounted, ref } from "vue";
import ClothingImageComponent from "./ClothingImageComponent.vue";

const props = defineProps(["clothing"]);
const { userId } = storeToRefs(useUserStore());

const deleteClothing = async () => {
    try {
        await fetchy(`/api/clothes/${props.clothing._id}`, "DELETE");
    } catch {
        return;
    }
};
</script>

<template>
    <ClothingImageComponent class="img" :clothing="props.clothing" />
    <div class="clothing-container">
        <p>{{ props.clothing.name }}</p>
        <p>{{ props.clothing.description }}</p>
    </div>
    <div class="base" v-if="userId==props.clothing.owner">
        <menu>
            <li>
                <button class="btn-small button-error" @click="deleteClothing">Delete</button>
            </li>
        </menu>
    </div>
</template>

<style scoped>
.clothing-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    margin: auto;
}

img {
    width: 10em;
    overflow: hidden;
}

.base {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 7em;
    margin: auto;
}
</style>
