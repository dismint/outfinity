<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);

const scrollY = ref(0);
const maxScroll = 500;
const maxWidth = 1000;
const maxWidthFrac = 0.8;
const targetWidth = 800;
const targetFrac = 0.7;

// Update scroll position on scroll event
const updateScroll = () => {
  scrollY.value = window.scrollY;
};

// add and remove event listeners
onMounted(() => {
  window.addEventListener("scroll", updateScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScroll);
});

const navbarStyle = computed(() => {
  const scrollFraction = Math.min(scrollY.value / maxScroll, 1);
  const windowWidth = window.innerWidth;
  const widthPx = Math.min(windowWidth * maxWidthFrac, maxWidth);

  const targetPx = Math.min(windowWidth * targetFrac, targetWidth);
  const diff = widthPx - targetPx;
  const width = widthPx - diff * scrollFraction;

  const padding = 1 + 0.5 * scrollFraction;
  console.log(padding);
  return {
    width: `${width}px`,
    backdropFilter: `blur(${scrollFraction * 10}px)`,
    background: `rgba(249, 243, 233, ${scrollFraction * 0.8})`,
  };
});
</script>

<template>
  <div class="navContainer">
    <nav :style="navbarStyle">
      <ul class="nav-list">
        <li class="navItem left">
          <RouterLink :to="{ name: 'Home' }">Outfinity</RouterLink>
        </li>
        <li class="navItem right">
          <RouterLink :to="{ name: 'Settings' }">Settings</RouterLink>
        </li>
        <li class="navItem right">
          <RouterLink :to="{ name: 'Login' }">Login</RouterLink>
        </li>
        <li class="navItem right">
          <RouterLink :to="{ name: 'Login' }">Anodda</RouterLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

a {
  text-decoration: none;
  color: black;
}

ul {
  box-sizing: border-box;
  list-style-type: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95%;
}

.navItem.left {
  font-family: "Baloo Tamma 2";
  font-weight: 800;
  font-size: 2.5em;
  padding-top: 0.15em;
  margin-right: auto;
}

.navItem.right {
  font-family: "Eczar";
  font-size: 1em;
  font-weight: 600;
  margin-left: 5%;
}

.navContainer {
  position: sticky;
  top: 0.5em;
  width: 100%;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
}

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 3em;
  transition:
    width 0.3s ease,
    margin 0.3s ease;
  border-radius: 1em;
}
</style>
