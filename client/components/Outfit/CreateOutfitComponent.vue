<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { computed, defineProps, ref } from "vue";
import OutfitImageComponent from "./OutfitImageComponent.vue";
import OutfitPickerComponent from "./OutfitPickerComponent.vue";

const props = defineProps(["title", "outfitOrChallenge", "closet", "challengeId"]);

const headImage = ref("");
const topImages = ref<Array<string>>([]);
const bottomImages = ref<Array<string>>([]);
const onepieceImage = ref("");
const shoeImage = ref("");
const imageLoaded = ref(true);
const outfitComplete = ref(false);
const outfitTitle = ref("");
const description = ref("");

const getImage = async (id: string, stack: boolean) => {
  const query = { id };
  let clothingResult;
  try {
    clothingResult = await fetchy(`/api/clothes`, "GET", { query, alert: false });
  } catch (_) {
    return;
  }
  const imageMap: Record<string, typeof headImage | typeof topImages | typeof bottomImages> = {
    hat: headImage,
    onepiece: onepieceImage,
    shoe: shoeImage,
  };

  if (clothingResult.type === "top" || clothingResult.type === "bottom") {
    const images = clothingResult.type === "top" ? topImages : bottomImages;
    if (stack) {
      images.value.push(clothingResult.imgUrl);
    } else {
      const index = images.value.indexOf(clothingResult.imgUrl);
      if (index > -1) {
        images.value.splice(index, 1);
      } else {
        images.value.push(clothingResult.imgUrl);
      }
    }
  } else {
    const image = imageMap[clothingResult.type];
    if (image) {
      image.value = image.value === clothingResult.imgUrl ? "" : clothingResult.imgUrl;
    }
  }
};

const isOutfitComplete = computed(() => {
  const hasTopAndBottom = topImages.value.length > 0 && bottomImages.value.length > 0;
  const hasShoe = shoeImage.value !== "";
  const hasOnePiece = onepieceImage.value !== "";
  return (hasTopAndBottom || hasOnePiece) && hasShoe;
});

const submit = async () => {
  /// TODO: validate outfit before submitting
  /////// create outfit
  const body = {
    name: outfitTitle.value,
    description: description.value,
    clothes: [headImage.value, ...topImages.value, ...bottomImages.value, onepieceImage.value, shoeImage.value].filter((x) => x),
  };
  let outfitId;
  try {
    outfitId = await fetchy(`/api/outfits/createOutfit`, "POST", { body, alert: false });
  } catch (_) {
    return;
  }
  if (props.outfitOrChallenge === "outfit") {
    // save outfit
    try {
      await fetchy(`/api/outfits/save/${outfitId}`, "PATCH", { alert: false });
    } catch (_) {
      return;
    }
    void router.push({ name: "Outfit", params: { id: outfitId } }); // id is the outfit we just made here
  } else {
    //// TODO: submit outfit to challenge
    void router.push({ name: "Challenge", params: { id: props.challengeId } });
  }
  emptyForm();
};

const finishOutfit = async () => {
  if (!isOutfitComplete.value) return;
  outfitComplete.value = true;
};

const handleClothingClick = async (id: string) => {
  //// TODO: bruh think about how this works with stacking and hopefully we can integrate if we click clothing on outfit it removes it
  // then do stacking
  imageLoaded.value = false;
  await getImage(id, false);
  imageLoaded.value = true;
};

// const getIncompleteCategories = () => {
//   const missing = [];
//   if (!headImage.value) missing.push("hat");
//   if (!topImages.value.length && !onepieceImage.value) missing.push("top or one-piece");
//   if (!bottomImages.value.length && !onepieceImage.value) missing.push("bottom");
//   if (!shoeImage.value) missing.push("shoe");
//   return missing;
// };

const emptyForm = () => {
  headImage.value = "";
  topImages.value = [];
  bottomImages.value = [];
  onepieceImage.value = "";
  shoeImage.value = "";
};
</script>

<template>
  <div v-if="!outfitComplete" class="centered">
    <div class="compressWidth sideBySide">
      <div>
        <OutfitImageComponent :imageLoaded="imageLoaded" :head-image="headImage" :top-images="topImages" :bottom-images="bottomImages" :onepiece-image="onepieceImage" :shoe-image="shoeImage" />
        <!-- <OutfitImageComponent
          :imageLoaded="imageLoaded"
          :head-image="headImage"
          :top-images="topImages"
          :bottom-images="bottomImages"
          :onepiece-image="onepieceImage"
          :shoe-image="shoeImage"
          :incomplete-categories="!isOutfitComplete ? getIncompleteCategories() : []"
        /> -->
        <button @click="emptyForm">Clear</button>
      </div>
      <div>
        <h1>{{ props.title }}</h1>
        <OutfitPickerComponent :closet="props.closet" @clickClothing="handleClothingClick" />
        <div>
          <button :disabled="!isOutfitComplete" @click="finishOutfit">Save Outfit</button>
          <p v-if="!isOutfitComplete" class="warning">Your outfit is incomplete. Please add all required items!</p>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <form @submit.prevent="submit">
      <h1>Outfit Name</h1>
      <input v-model="outfitTitle" title="Outfit Name" required minlength="1" maxlength="70" />
      <h1>Description</h1>
      <textarea v-model="description" placeholder="ex. layering order, tucking in a shirt, etc." maxlength="1000"> </textarea>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

.sideBySide {
  display: flex;
  flex-direction: row;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}

.warning {
  color: red;
  font-size: 0.9rem;
  margin-top: 0.5em;
}
</style>
