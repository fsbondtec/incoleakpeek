<template>
    <v-container>
        <v-data-table :headers="headers" :items="items" class="elevation-1">
        </v-data-table>
    </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { incoclassmemusage } from "../incoconnection.js";

const headers = [
    { text: "Class Name", value: "name", sortable: true },
    { text: "RAM (Byte)", value: "memory", sortable: true },
];

const items = ref([
    { name: "chrome.exe", memory: 1200 },
    { name: "explorer.exe", memory: 300 },
    { name: "error.exe", memory: 700 },
    { name: "python.exe", memory: 500 },
]);

let intervalId = null;

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
        console.log(items.value);
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
