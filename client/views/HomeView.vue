<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());

const titleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("scrollVisible");
      } else {
        entry.target.classList.remove("scrollVisible");
      }
    });
  },
  {
    threshold: 0.8,
  },
);

const splashObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("scrollVisible");
        const splashText = document.querySelectorAll(".splashText");
        splashText.forEach((text) => {
          text.classList.add("slideIn");
        });
      } else {
        entry.target.classList.remove("scrollVisible");
        const splashText = document.querySelectorAll(".splashText");
        splashText.forEach((text) => {
          text.classList.remove("slideIn");
        });
      }
    });
  },
  {
    threshold: 0.4,
  },
);

const imageObserverGone = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) return;
      entry.target.classList.remove("scrollVisible");
      if (entry.target.classList.contains("rightPlease")) {
        entry.target.classList.remove("slideSideRight");
      } else {
        entry.target.classList.remove("slideSide");
      }
    });
  },
  {
    threshold: 0.01,
  },
);

const imageObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.classList.contains("slideSide") && !entry.target.classList.contains("slideSideRight")) {
        entry.target.classList.add("scrollVisible");
        if (entry.target.classList.contains("rightPlease")) {
          entry.target.classList.add("slideSideRight");
        } else {
          entry.target.classList.add("slideSide");
        }
        entry.target.classList.add("animating");
        const handleAnimationEnd = () => {
          entry.target.classList.remove("animating");
          entry.target.removeEventListener("animationend", handleAnimationEnd);
        };
        entry.target.addEventListener("animationend", handleAnimationEnd);
      } else if (!entry.isIntersecting && !entry.target.classList.contains("animating")) {
        entry.target.classList.remove("scrollVisible");
        if (entry.target.classList.contains("rightPlease")) {
          entry.target.classList.remove("slideSideRight");
        } else {
          entry.target.classList.remove("slideSide");
        }
      }
    });
  },
  {
    threshold: 0.75,
  },
);

onMounted(() => {
  const title = document.querySelectorAll(".titleContainer");
  title.forEach((title) => {
    titleObserver.observe(title);
  });

  const splash = document.querySelectorAll(".splashContainer");
  splash.forEach((splash) => {
    splashObserver.observe(splash);
  });

  const imageBoxes = document.querySelectorAll(".imageBox");
  imageBoxes.forEach((box) => {
    imageObserver.observe(box);
    imageObserverGone.observe(box);
  });
});
</script>

<template>
  <main class="centered">
    <div v-if="isLoggedIn">
      <h1>Welcome {{ currentUsername }}!</h1>
    </div>
    <div v-else class="compressWidth">
      <div class="scrollSeal titleContainer">
        <h1 class="title">Outfinity</h1>
      </div>
      <div class="scrollSeal splashContainer">
        <h1 class="splashText left">Endless<br />Outfits</h1>
        <h1 class="splashText">Infinite<br />Inspiration</h1>
      </div>
      <div class="imageGallery row">
        <div class="col" style="width: 48.5%; height: 96%; margin: 1% 0.5% 1% 1%">
          <div class="row" style="height: 50%">
            <div class="imageSmall L scrollSeal imageBox"></div>
            <div class="imageSmall R scrollSeal imageBox rightPlease"></div>
          </div>
          <div class="imageMedium scrollSeal imageBox rightPlease"></div>
        </div>
        <div class="imageLarge scrollSeal imageBox"></div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.imageGallery {
  width: 100%;
  aspect-ratio: 2 / 1;
  margin: 5% 0;
}

.imageSmall {
  width: 98%;
  height: 98%;
  border-radius: 1em;
  background-color: var(--dark-green);
}

.imageSmall.L {
  margin: 0% 1% 1% 0%;
}

.imageSmall.R {
  margin: 0% 0% 1% 1%;
}

.imageMedium {
  width: 100%;
  height: 49%;
  background-color: var(--dark-green);
  margin: 1% 0% 0% 0%;
  border-radius: 1em;
}

.imageLarge {
  width: 48.5%;
  height: 96%;
  margin: 1% 1% 1% 0.5%;
  background-color: var(--dark-green);
  border-radius: 1em;
}

.scrollSeal {
  opacity: 0;
  transition: all 1s;
}

.slideIn {
  animation-name: slideFromTop;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
}

.slideSide {
  animation-name: slideFromLeft;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
}

.slideSideRight {
  animation-name: slideFromRight;
  animation-duration: 1.5s;
  animation-fill-mode: forwards;
}

.titleContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100vh;
}

.title {
  font-family: "Baloo Tamma 2";
  font-size: 8em;
  font-weight: 800;
  margin-bottom: 18vh;
}

.scrollVisible {
  opacity: 1;
}

.splashContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
}

.splashText {
  font-size: 6em;
  font-weight: 800;
  text-align: center;
  color: var(--dark-green);
  text-align: right;
}

.left {
  margin-right: auto;
  text-align: left;
}

h1 {
  margin: 0;
  padding: 0;
  text-align: center;
}

@keyframes slideFromTop {
  0% {
    transform: translateY(-50vh);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes slideFromLeft {
  0% {
    transform: translateX(-30vw);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  0% {
    transform: translateX(30vw);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
