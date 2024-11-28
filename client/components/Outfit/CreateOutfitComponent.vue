<script setup lang="ts">
import router from "@/router";
import { fetchy } from "@/utils/fetchy";
import { defineProps, ref } from "vue";
import OutfitImageComponent from "./OutfitImageComponent.vue";
import OutfitPickerComponent from "./OutfitPickerComponent.vue";

const props = defineProps(["title", "outfitOrChallenge", "closet", "challengeId"]);

const headImage = ref("👒");
const topImages = ref<Array<string>>(["👕", "👚", "👔"]);
const bottomImages = ref<Array<string>>(["👖", "🩳", "👗"]);
const onepieceImage = ref("👗");
const shoeImage = ref("👠");

const getImage = async (id: string, add: boolean) => {
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
    if (add) {
      images.value.push(clothingResult.imgUrl);
    } else {
      const index = images.value.indexOf(clothingResult.imgUrl);
      if (index > -1) {
        images.value.splice(index, 1);
      }
    }
  } else {
    const image = imageMap[clothingResult.type];
    if (image) {
      image.value = image.value === clothingResult.imgUrl ? "" : clothingResult.imgUrl;
    }
  }
};

// const getImage = async (id: string) => {
//   const query = { id };
//   let clothingResult;
//   try {
//     clothingResult = await fetchy(`/api/clothes`, "GET", { query, alert: false });
//   } catch (_) {
//     return;
//   }
//   const imageMap: Record<string, typeof headImage> = {
//     hat: headImage,
//     onepiece: onepieceImage,
//     shoe: shoeImage,
//   };

//   if (clothingResult.type === "top" || clothingResult.type === "bottom") {
//     const images = clothingResult.type === "top" ? topImages : bottomImages;
//     const index = images.value.indexOf(clothingResult.imgUrl);
//     if (index > -1) {
//       images.value.splice(index, 1);
//     } else {
//       images.value.push(clothingResult.imgUrl);
//     }
//   } else {
//     const image = imageMap[clothingResult.type];
//     if (image) {
//       image.value = image.value === clothingResult.imgUrl ? "" : clothingResult.imgUrl;
//     }
//   }
// };

const submit = async () => {
  /// TODO: validate outfit before submitting
  //// using fetch make an outfit
  if (props.outfitOrChallenge === "outfit") {
    /// save outfit
    void router.push({ name: "Outfit", params: { id: "1" } }); // id is the outfit we just made here
  } else {
    void router.push({ name: "SubmitChallenge", params: { id: props.challengeId } }); // TODO: how to move just made outfit to this page? maybe have outfit id and challenge id in params of page
  }
};

const handleClothingClick = async (id: string) => {
  // await getImage(id, add);
  //// TODO: bruh think about how this works with stacking and hopefully we can integrate if we click clothing on outfit it removes it
};

/// TODO: change images to the object id of outfit

// TODO: emits for outfitpicker, so when something is picked it's added to image
// onBeforeMount(async () => {
//   await getImages();
//   loaded.value = true;
// });
</script>

<template>
  <div class="centered">
    <div class="compressWidth">
      <OutfitImageComponent :head-image="headImage" :top-images="topImages" :bottom-images="bottomImages" :onepiece-image="onepieceImage" :shoe-image="shoeImage" />
      <div>
        <h1>{{ props.title }}</h1>
        <OutfitPickerComponent :closet="props.closet" @clickClothing="handleClothingClick" />
        <button @click="submit">Save Outfit</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}

img {
  width: 30%;
  height: auto;
  cursor: pointer;
}
</style>
