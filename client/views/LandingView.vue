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
    threshold: 0.4,
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
    <div class="centered">
      <div class="compressWidth">
        <div class="scrollSeal titleContainer">
          <h1 class="title">Outfinity</h1>
        </div>
      </div>
      <div class="compressWidth firstSection">
        <div class="scrollSeal splashContainer">
          <h1 class="splashText left">Endless<br />Outfits</h1>
          <h1 class="splashText">Infinite<br />Inspiration</h1>
        </div>
        <div class="imageGallery row">
          <div class="col" style="width: 48.5%; height: 96%; margin: 1% 0.5% 1% 1%">
            <div class="row" style="height: 50%">
              <div class="imageSmall L scrollSeal imageBox">
                <img class="boxImg" src="https://u.cubeupload.com/dismint/outfit.png" alt="outfit image" />
              </div>
              <div class="imageSmall R scrollSeal imageBox rightPlease">
                <img class="boxImg" src="https://u.cubeupload.com/dismint/minicloset.png" alt="outfit image" />
              </div>
            </div>
            <div class="imageMedium scrollSeal imageBox rightPlease">
              <img class="boxImg" src="https://u.cubeupload.com/dismint/closets.png" alt="outfit image" />
            </div>
          </div>
          <div class="imageLarge scrollSeal imageBox">
            <img class="boxImg" src="https://u.cubeupload.com/dismint/challenge.png" alt="outfit image" />
          </div>
        </div>
      </div>
      <div class="compressWidth">
        <div class="peopleContainer">
          <div class="personRow">
            <div class="personContainer centered">
              <img class="image" src="https://u.cubeupload.com/dismint/bottom.jpg" alt="bottom" />
              <div class="shadow"></div>
            </div>
            <div class="personContainer centered">
              <img class="image" src="https://u.cubeupload.com/dismint/top.jpg" alt="top" />
              <div class="shadow"></div>
            </div>
            <div class="personContainer centered">
              <img class="image" src="https://u.cubeupload.com/dismint/left.jpg" alt="left" />
              <div class="shadow"></div>
            </div>
            <div class="personContainer centered">
              <img class="image" src="https://u.cubeupload.com/dismint/right.jpg" alt="right" />
              <div class="shadow"></div>
            </div>
          </div>
          <div class="namesRow">
            <div class="nameContainer centered">Jennifer</div>
            <div class="nameContainer centered">Tiana</div>
            <div class="nameContainer centered">Justin</div>
            <div class="nameContainer centered">Annie</div>
          </div>
        </div>
      </div>
      <div class="bottomMark">
        <h2>Outfinity</h2>
      </div>
    </div>
  </main>
</template>

<style scoped>
h2 {
  font-family: "Baloo Tamma 2";
  font-size: 2em;
  font-weight: 800;
  color: var(--dark-green);
}

.imageBox {
  box-sizing: border-box;
  padding: 1vh;
}

.boxImg {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  object-fit: cover;
  border-radius: 1em;
}

.bottomMark {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  background-color: var(--light-green);
  height: 10vh;
  width: 100%;
  margin-top: 20vh;
  border-radius: 8em 8em 0 0;
  padding-top: 1vh;
}

.nameContainer {
  box-sizing: border-box;
  position: relative;
  align-self: flex-start;
  margin: auto 2%;
  width: 20%;
  color: var(--light-green);
  font-family: "Baloo Tamma 2";
  font-size: 2.5em;
  font-weight: 600;
}

.namesRow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 25%;
}

.shadow {
  position: absolute;
  height: 100%;
  width: 100%;
  border-radius: 50%;
  z-index: 10;
  box-shadow:
    0.5em 0.5em 0.5em rgba(37, 37, 37, 0.8) inset,
    -0.3em -0.3em 0.3em rgba(195, 206, 189, 0.8) inset;
}

.image {
  position: relative;
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border-radius: 50%;
  z-index: 5;
}

.personRow {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 75%;
}

.personContainer {
  box-sizing: border-box;
  position: relative;
  align-self: flex-start;
  margin: 4% auto 0 auto;
  width: 20vh;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  border: 0.5em solid var(--light-green);
}

.peopleContainer {
  box-sizing: border-box;
  margin: 5% 0;
  background-color: var(--dark-green);
  width: 100%;
  height: 40vh;
  border-radius: 4em;
}

.firstSection {
  box-sizing: border-box;
  background-color: var(--light-green);
  padding: 2%;
  border-radius: 4em;
}

.imageGallery {
  width: 100%;
  aspect-ratio: 2 / 1;
  margin: 5% 0 0 0;
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
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.slideSide {
  animation-name: slideFromLeft;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

.slideSideRight {
  animation-name: slideFromRight;
  animation-duration: 1s;
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
  background: linear-gradient(to right, var(--light-green), var(--dark-green) 50%, var(--light-green));
  background-clip: text;
  color: transparent;
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
  font-size: 5em;
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
    transform: translateX(-20vw);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes slideFromRight {
  0% {
    transform: translateX(20vw);
  }
  100% {
    transform: translateX(0);
  }
}
</style>
