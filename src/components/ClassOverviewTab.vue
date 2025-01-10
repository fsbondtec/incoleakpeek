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
    { title: "Delta (Byte)", key: "deltab" },
    { title: "Delta (%)", key: "deltap" },
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
            var old = items.value;
            items.value = [];
            for (const [classKey, classValue] of Object.entries(incoClasses)) {
                var oldItem = old.find(item => item.name === classKey);
                var deltab = oldItem ? classValue - oldItem.memory : 0;
                var deltap = oldItem ? (deltab / oldItem.memory) * 100 : 0;
                var cla = { name: classKey, memory: classValue, deltab: deltab, deltap: deltap.toFixed(2) };
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
