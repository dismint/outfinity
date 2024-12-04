<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main>
    <div class="centered">
      <div class="compressWidth">
        <h1>Profile for {{ currentUsername }}</h1>
        <div class="contentContainer">
          <button class="logout" @click="logout">Logout</button>
          <button class="delete" @click="delete_">Delete User</button>
          <UpdateUserForm />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

button {
  padding: 1vmin;
  margin: 1vmin 1vmin 1vmin 0;
  border-radius: 1vmin;
  cursor: pointer;
  border: none;
}

.logout {
  background-color: var(--light-green);
  transition:
    background-color 0.2s,
    color 0.2s;
}

.logout:hover {
  background-color: var(--dark-green);
  color: var(--light);
}

.delete {
  background-color: var(--red);
  color: var(--light);
  transition:
    background-color 0.2s,
    color 0.2s;
}

.delete:hover {
  background-color: darkred;
}

.contentContainer {
  width: 100%;
  background-color: var(--light);
  padding: 2vmin;
  border-radius: 3vmin;
}

h1 {
  box-sizing: border-box;
  display: block;
  width: 100%;
  font-family: "Eczar";
  color: var(--dark-green);
  text-align: left;
  margin-top: 1em;
  font-size: 4em;
}
</style>
