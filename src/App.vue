<template>
    <v-app>
        <!-- Custom Titlebar (hat eine hoehe von 48px) -->
        <v-app-bar density="compact" class="drag">
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" class="nodrag"></v-app-bar-nav-icon>
            <v-app-bar-title>IncoLeakPeek</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-text-field
                v-model="search"
                label="Search"
                prepend-inner-icon="mdi-magnify"
                hide-details
                single-line
                class="nodrag"
            ></v-text-field>
            <v-spacer></v-spacer>
            <v-select
                v-model="selectedInterval"
                :items="intervalOptions"
                label="Update Interval"
                class="nodrag"
                hide-details
                single-line
                @change="changeInterval"
            />
            <v-spacer></v-spacer>
            <v-btn icon @click="toggleDarkMode" class="nodrag">
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
            <v-btn icon @click="minimizeWindow" class="nodrag">
                <v-icon>mdi-window-minimize</v-icon>
            </v-btn>
            <v-btn icon @click="maximizeWindow" class="nodrag">
                <v-icon>mdi-window-maximize</v-icon>
            </v-btn>
            <v-btn icon @click="closeWindow" class="nodrag">
                <v-icon>mdi-window-close</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- Navigation Drawer -->
        <v-navigation-drawer
            v-model="drawer"
            temporary
        >
            <v-list>
                <v-list-item prepend-icon="mdi-content-save" title="Save File" @click="saveFile"></v-list-item>
                <v-list-item prepend-icon="mdi-folder-open" title="Load File" @click="loadFile"></v-list-item>
                <v-list-item prepend-icon="mdi-exit-run" title="Exit" @click="closeWindow"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- Main content -->
        <v-main>
            <v-data-table-virtual
                :headers="headers"
                :items="items"
                :search="search"
                height="calc(70vh - 48px)"
                fixed-header
            ></v-data-table-virtual>
            <apexchart
                type="line"
                height="30%"
                :options="chartOptions"
                :series="series"
            ></apexchart>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useTheme } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

import { incoconnect, incodisconnect, incoclassmemusage, incousedmem, incototalmem } from "./incoconnection.js";
import { updateChartThemeMode } from "./apexcharts_patch.js";

let intervalId = null;
let intervalCounter = 0;

const drawer = ref(false);

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

function saveFile() {
    console.log("saveFile");
}

function loadFile() {
    console.log("loadFile");
}

function toggleDarkMode() {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
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

</script>

<style scoped>
.drag {
    -webkit-app-region: drag;
}

.nodrag {
    -webkit-app-region: no-drag;
}
</style>
