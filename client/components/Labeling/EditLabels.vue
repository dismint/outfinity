<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import { computed } from "vue";

const props = defineProps(["item"]);
const labels = ref<string[]>([]);
const showDeleteButton = ref(false);
const newLabel = ref("");
const isDropdownOpen = ref(false);
const { currentUsername } = storeToRefs(useUserStore());

const getLabels = async () => {
  // TODO: get labels
  //   let query: Record<string, string> = props.topicOrResponse === "topic" ? { topicTitle: title } : { id };
  let labelResults;
  //   try {
  //     labelResults = await fetchy(`/api/label/${props.topicOrResponse}`, "GET", { query });
  //   } catch (_) {
  //     return;
  //   }
  let finalLabels = [];
  labelResults = [
    { title: "label1", _id: "1" },
    { title: "label2", _id: "2" },
    { title: "label3", _id: "3" },
  ];
  for (const labelDoc of labelResults) {
    finalLabels.push(labelDoc.title);
  }
  labels.value = finalLabels;
};

const removeLabel = async (index: number) => {
  // TODO: remove label
  //   const itemTitle = props.topicOrResponse === "topic" ? props.item.title : props.item._id;
  //   const apiUrl = `/api/label/${labels.value[index]}/remove/${props.topicOrResponse}/${itemTitle}`;
  //   try {
  //     await fetchy(apiUrl, "PATCH");
  //   } catch {
  //     return;
  //   }
  //   labels.value.splice(index, 1);
};

const addOrAttachLabel = async (label: string) => {
  /// TODO: add or attach label
  if (!label) return;

  //   // If label doesn't exist, create a new one
  //   if (!labels.value.includes(label)) {
  //     try {
  //       await fetchy(`/api/label/`, "POST", {
  //         body: { label },
  //       });
  //     } catch (_) {
  //       return;
  //     }
  //     labels.value.push(label); // Add the label to the list of all labels
  //   }

  // //   const itemString = props.topicOrResponse === "topic" ? props.item.title : props.item._id;
  //   const apiUrl = `/api/label/${label}/add//${itemString}`;
  //   try {
  //     await fetchy(apiUrl, "PATCH");
  //   } catch (_) {
  //     return;
  //   }
  newLabel.value = ""; // Clear input after adding
  isDropdownOpen.value = false; // Close dropdown after adding
};

// Computed property for matching labels
const matchingLabels = computed(() => {
  return labels.value.filter((label) => label.toLowerCase().includes(newLabel.value.toLowerCase())).slice(0, 10); // Limit to 10 results
});

// Add label when clicked from dropdown
const selectLabel = async (label: string) => {
  await addOrAttachLabel(label);
};

// Handle input focus
const handleFocus = () => {
  isDropdownOpen.value = true; // Open dropdown when input is focused
};

// Handle input blur
const handleBlur = () => {
  setTimeout(() => {
    isDropdownOpen.value = false; // Close dropdown when input loses focus
  }, 100); // Delay to allow click event on dropdown items
};

onBeforeMount(async () => {
  showDeleteButton.value = currentUsername.value === props.item.author;
  await getLabels();
});
</script>

<template>
  <div class="label-list">
    <span v-for="(label, index) in labels" :key="label" :class="label" @click.stop="">
      {{ label }}
      <button v-if="showDeleteButton" @click="removeLabel(index)" :class="label">x</button>
    </span>
    <!-- <AddLabelInline v-if="showDeleteButton" :item="props.item" @updateLabels="getLabels(props.item.title, props.item._id)" @click.stop="" /> -->
    <!-- <div v-if="showDeleteButton" @click.stop="">
      <input type="text" placeholder="Add a label" />
      <button>Add</button>
    </div> -->
    <div v-if="showDeleteButton" class="label-selector">
      <div class="new-label">
        <input type="text" v-model="newLabel" placeholder="Type and add a new label" maxlength="20" @focus="handleFocus" @blur="handleBlur" />
        <button @click.prevent="addOrAttachLabel(newLabel)" class="add-button">Add</button>
      </div>

      <!-- Dropdown for matching labels -->
      <ul v-if="isDropdownOpen && matchingLabels.length > 0" class="dropdown">
        <li v-for="label in matchingLabels" :key="label" @click="selectLabel(label)" class="dropdown-item">
          {{ label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.label-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  /* Remove height if you want it to fit content */
}

.label {
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9em;
  display: inline-flex; /* Change to inline-flex to fit content */
  align-items: center; /* Center vertically */
  height: 17px;
}

.blue-label {
  background-color: var(--signature-blue);
}

.purple-label {
  background-color: var(--signature-purple);
}

.delete-btn {
  cursor: pointer;
  padding: 0 0.2em;
  font-size: 1.2em;
}

.label-selector {
  position: relative;
  width: 280px;
}

.new-label {
  display: flex;
  align-items: center;
}

.new-label input {
  flex: 1;
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.add-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  list-style: none;
  padding: 0;
  margin-top: 5px;
  z-index: 1000;
  max-height: 200px; /* Adjust height if needed */
  overflow-y: auto; /* Scroll if items exceed height */
}

.dropdown-item {
  padding: 5px 10px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f0f0f0; /* Highlight on hover */
}
</style>
