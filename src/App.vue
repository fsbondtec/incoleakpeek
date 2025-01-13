<template>
    <v-app>
        <!-- Custom Titlebar -->
        <v-toolbar density="compact">
            <v-toolbar-title>IncoLeakPeek</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="toggleDarkMode">
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
            <v-btn icon @click="minimizeWindow">
                <v-icon>mdi-window-minimize</v-icon>
            </v-btn>
            <v-btn icon @click="maximizeWindow">
                <v-icon>mdi-window-maximize</v-icon>
            </v-btn>
            <v-btn icon @click="closeWindow">
                <v-icon>mdi-window-close</v-icon>
            </v-btn>
        </v-toolbar>

        <!-- Main content -->
        <v-main>
            <apexchart
                type="line"
                height="260"
                :options="chartOptions"
                :series="series"
            ></apexchart>
            <v-data-table :headers="headers" :items="filteredItems">
                <template v-slot:top>
                    <v-text-field v-model="search" label="Search"></v-text-field>
                </template>
            </v-data-table>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { useTheme } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

import { incoconnect, incodisconnect, incoclassmemusage, incousedmem, incototalmem } from "./incoconnection.js";

let intervalId = null;
let intervalCounter = 0;

const totalmem = ref(1);
const membegin = ref({});

const theme = useTheme();
watch(() => theme.global.current.value.dark,
    (newVal) => {
        chartOptions.value = updateChartThemeMode(chartOptions.value, newVal);
    }
);

const search = ref("");

const headers = ref([
    { title: "Class Name", key: "name" },
    { title: "RAM (Byte)", key: "memory" },
    { title: "total Δ (Byte)", key: "tdeltab" },
    { title: "total Δ (%)", key: "tdeltap" },
    { title: "last Δ (Byte)", key: "ldeltab" },
    { title: "last Δ (%)", key: "ldeltap" },
]);

const items = ref([]);

const series = ref([
    {
        name: "RAM (Byte)",
        data: [],
    },
]);

const chartOptions = ref({
    chart: {
        type: "line",
        toolbar: {
            show: false,
        },
    },
    xaxis: {
        type: 'numeric',
        range: 60000, // 60 seconds
        tickAmount: 1, // Only first and last ticks
        labels: {
            formatter: function (val, timestamp) {
                var ret = Math.round((new Date().getTime() - timestamp) / 1000);
                if (ret === 0) {
                    return "0";
                }
                else if (ret === 60) {
                    return `${ret}s`;
                }
                else {
                    return "";
                }
            },
        },
    },
    yaxis: {
        type: 'numeric',
        opposite: true,
        min: 0,
        max: totalmem,
        tickAmount: 10,
        labels: {
            formatter: function (val, index) {
                if (val === 0) {
                    return "0";
                }
                else if(val === totalmem.value) {
                    return `${val}kB`;
                }
                else {
                    return "";
                }
            },
        },
    },
});

const filteredItems = computed(() =>
  items.value.filter(
    (item) => item.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const updateMemoryUsage = () => {
    incousedmem().then((usedmem) => {
        const currentTime = new Date().getTime();
        series.value[0].data.push({ x: currentTime, y: usedmem });
    });

    if (intervalCounter++ % 5 !== 0) {
        return;
    }

    incoclassmemusage().then((incoClasses) => {
        if (incoClasses && typeof incoClasses === "object") {
            var old = items.value;
            items.value = [];
            for (const [classKey, classValue] of Object.entries(incoClasses)) {
                var firstItem = membegin.value[classKey];
                var tdeltab = firstItem ? classValue - firstItem : 0;
                var tdeltap = firstItem ? (tdeltab / firstItem) * 100 : 0;
                var oldItem = old.find(item => item.name === classKey);
                var ldeltab = oldItem ? classValue - oldItem.memory : 0;
                var ldeltap = oldItem ? (ldeltab / oldItem.memory) * 100 : 0;
                var cla = {
                    name: classKey,
                    memory: classValue,
                    tdeltab: tdeltab,
                    tdeltap: tdeltap.toFixed(2),
                    ldeltab: ldeltab,
                    ldeltap: ldeltap.toFixed(2),
                };
                items.value.push(cla);
            }
        } else {
            console.error("Invalid data received from getClassMemUseage");
        }
    });
};

function toggleDarkMode() {
    theme.global.name.value = theme.global.current.value.dark
        ? "light"
        : "dark";
}

function minimizeWindow() {
    if (window.electron) window.electron.minimizeWindow();
}

function maximizeWindow() {
    if (window.electron) window.electron.maximizeWindow();
}

function closeWindow() {
    if (window.electron) window.electron.closeWindow();
}

onMounted(() => {
    incoconnect("http://192.168.1.251:80").then(() => {
        console.log("Connected to IncoServer");
        incototalmem().then((total) => {
            console.log("Total Memory: " + total);
            totalmem.value = total;
        });
        incoclassmemusage().then((incoClasses) => {
            for (const [classKey, classValue] of Object.entries(incoClasses)) {
                membegin.value[classKey] = classValue;
            }
        });
    });

    intervalId = setInterval(updateMemoryUsage, 1000); // Aktualisierung alle 1 Sekunden
});

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    incodisconnect();
});

// https://github.com/apexcharts/ng-apexcharts/issues/228#issuecomment-2392632549
function updateChartThemeMode(chartOptions, darkMode) {
    const theme = chartOptions.theme;
    const tooltip = chartOptions.tooltip;
    const chart = chartOptions.chart;

    // Create a new chart options object to avoid mutating the original object.
    chartOptions = {
        ...chartOptions,
        chart: {
            ...chart,
            // Update the foreground color and background color based on the theme mode.
            foreColor: darkMode ? "#f6f7f8" : "undefined",
            background: darkMode ? "#424242" : "undefined",
        },
        theme: {
            ...theme,
            // Update the theme mode.
            mode: darkMode ? "dark" : "light",
        },
        tooltip: {
            ...tooltip,
            // Update the tooltip theme based on the theme mode.
            theme: darkMode ? "dark" : "light",
        },
    };

    return chartOptions;
}
</script>

<style scoped>
.v-toolbar {
    -webkit-app-region: drag; /* Ermöglicht das Verschieben des Fensters */
}

.v-btn {
    -webkit-app-region: no-drag; /* Buttons nicht verschiebbar */
}

.v-main {
    max-height: calc(100vh - 48px); /* Maximale Höhe des Inhaltsbereichs */
    overflow: auto; /* Scrollbar nur bei Bedarf */
}
</style>
