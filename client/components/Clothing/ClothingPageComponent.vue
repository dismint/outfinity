<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { fetchy } from "../../utils/fetchy";
import { onBeforeMount, ref } from "vue";
import ClothingImageComponent from "./ClothingImageComponent.vue";

const props = defineProps(["id"]);
const clothing = ref<Record<string, string>>({});
const { userId } = storeToRefs(useUserStore());

const getClothingInfo = async () => {
    let clothingInfo;
    try {
        clothingInfo = await fetchy(`/api/clothes`, "GET", { query: { id: props.id } });
    } catch (e) {
        return;
    }
    clothing.value = clothingInfo;
    console.log(clothing.value, clothingInfo);
};

const deleteClothing = async () => {
    try {
        await fetchy(`/api/clothes/${props.id}`, "DELETE");
    } catch {
        return;
    }
};

onBeforeMount(async () => {
  await getClothingInfo();
});

</script>

<template>
    <ClothingImageComponent class="img" :imgUrl="clothing.imgUrl" />
    <div class="clothing-container">
        <p>{{ clothing.name }}</p>
        <p>{{ clothing.description }}</p>
    </div>
    <div class="base" v-if="userId==clothing.owner">
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
