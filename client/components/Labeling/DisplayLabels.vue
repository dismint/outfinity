<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
// import AddLabelInline from "./AddLabelInline.vue";

const props = defineProps(["item"]);
const labels = ref<string[]>([]);
const showDeleteButton = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

const getLabels = async (title: string, id: string) => {
  //   let query: Record<string, string> = props.topicOrResponse === "topic" ? { topicTitle: title } : { id };
  //   let labelResults;
  //   try {
  //     labelResults = await fetchy(`/api/label/${props.topicOrResponse}`, "GET", { query });
  //   } catch (_) {
  //     return;
  //   }
  //   let finalLabels = [];
  //   for (const labelDoc of labelResults) {
  //     finalLabels.push(labelDoc.title);
  //   }
  labels.value = ["label1", "label2", "label3"];
};

const removeLabel = async (index: number) => {
  //   const itemTitle = props.topicOrResponse === "topic" ? props.item.title : props.item._id;
  //   const apiUrl = `/api/label/${labels.value[index]}/remove/${props.topicOrResponse}/${itemTitle}`;
  //   try {
  //     await fetchy(apiUrl, "PATCH");
  //   } catch {
  //     return;
  //   }
  //   labels.value.splice(index, 1);
};

onBeforeMount(async () => {
  //   showDeleteButton.value = currentUsername.value === props.item.author;
  //   await getLabels(props.item.title, props.item._id);
  await getLabels("title", "id");
});
</script>

<template>
  <div class="label-list">
    <span v-for="(label, index) in labels" :key="label" class="label" @click.stop="">
      {{ label }}
      <button v-if="showDeleteButton" @click="removeLabel(index)" class="btn-delete">x</button>
    </span>
    <!-- <AddLabelInline v-if="showDeleteButton" :item="props.item" :topicOrResponse="props.topicOrResponse" @updateLabels="getLabels(props.item.title, props.item._id)" @click.stop="" /> -->
  </div>
</template>

<style scoped>
.label-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.label {
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  display: inline-flex;
  align-items: center;
  height: 17px;
  background-color: grey;
}

.blue-label {
  background-color: var(--signature-blue);
}

.purple-label {
  background-color: var(--signature-purple);
}

.btn-delete {
  cursor: pointer;
  padding: 0 0.2em;
  font-size: 1.2em;
}
</style>
