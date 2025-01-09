<template>
    <v-container>
        <v-text-field v-model="search" label="Search" class="mb-4"></v-text-field>
        <v-data-table :headers="headers" :items="filteredItems" class="elevation-1">
        </v-data-table>
    </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { incoclassmemusage } from "../incoconnection.js";

const headers = ref([
    { title: "Class Name", key: "name" },
    { title: "RAM (Byte)", key: "memory" },
]);

const items = ref([]);

const search = ref("");

let intervalId = null;

const filteredItems = computed(() =>
  items.value.filter(
    (item) => item.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const updateMemoryUsage = () => {
    incoclassmemusage().then((incoClasses) => {
        if (incoClasses && typeof incoClasses === "object") {
            items.value = [];
            for (const [classKey, classValue] of Object.entries(incoClasses)) {
                var cla = { name: classKey, memory: classValue };
                items.value.push(cla);
            }
        } else {
            console.error("Invalid data received from getClassMemUseage");
        }
    });
};

onMounted(() => {
    updateMemoryUsage();
    intervalId = setInterval(updateMemoryUsage, 5000); // Aktualisierung alle 5 Sekunden
});

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>
