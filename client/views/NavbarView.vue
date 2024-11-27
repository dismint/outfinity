<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);

const scrollY = ref(0);
const maxScroll = ref(window.innerHeight * 1.0);

// Update scroll position on scroll event
const updateScroll = () => {
  scrollY.value = window.scrollY;
};
const updateMaxScroll = () => {
  maxScroll.value = window.innerHeight * 1.0;
};

// add and remove event listeners
onMounted(() => {
  window.addEventListener("scroll", updateScroll);
  window.addEventListener("resize", updateMaxScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener("scroll", updateScroll);
  window.removeEventListener("resize", updateMaxScroll);
});

const navbarStyle = computed(() => {
  const scrollFraction = Math.min(scrollY.value / maxScroll.value, 1);
  console.log(scrollFraction, maxScroll.value);

  return {
    width: `${Math.floor(100 - 30 * scrollFraction)}%`,
    backdropFilter: `blur(${scrollFraction * 6}px)`,
    background: `rgba(122, 164, 151, ${scrollFraction * 0.75})`,
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
        <li v-if="isLoggedIn" class="navItem right">
          <RouterLink :to="{ name: 'Settings' }">Settings</RouterLink>
        </li>
        <li v-if="!isLoggedIn" class="navItem right">
          <RouterLink :to="{ name: 'Login' }">Login</RouterLink>
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
  z-index: 100;
  position: sticky;
  top: 0.5em;
  width: 100%;
  margin-bottom: 1em;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: max(55%, min(95%, 1200px));
  width: max(55%, min(95%, 1200px));
  margin: 0 auto;
}

nav {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 3em;
  padding: 0.5em;
  transition:
    width 0.3s ease,
    margin 0.3s ease;
  border-radius: 1em;
}
</style>
