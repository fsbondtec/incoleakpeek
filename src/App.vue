<template>
    <v-app>
        <v-app-bar density="compact" class="drag">
            <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" class="nodrag"></v-app-bar-nav-icon>
            <v-container class="d-flex justify-center">
                <v-row align="center">
                    <v-col cols="2">
                        <v-app-bar-title>IncoLeakPeek</v-app-bar-title>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="1" class="nodrag">
                        <v-btn icon @click="toggleRecord" variant="flat">
                            <v-icon>{{ isRecording ? 'mdi-stop' : 'mdi-play' }}</v-icon>
                        </v-btn>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                            v-model="search"
                            label="Search"
                            append-inner-icon="mdi-magnify"
                            density="compact"
                            hide-details
                            single-line
                            class="nodrag"
                        ></v-text-field>
                    </v-col>
                    <v-col cols="1"></v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="2">
                        <v-select
                            v-model="selectInterval"
                            :items="options"
                            label="Interval"
                            density="compact"
                            hide-details
                            class="nodrag"
                            :disabled="isRecording"
                        ></v-select>
                    </v-col>
                </v-row>
            </v-container>
            <div class="titlebar-buttons">
                <button aria-label="minimize" title="Minimize" tabindex="-1" @click="minimizeWindow">
                    <svg aria-hidden="true" version="1.1" width="10" height="10">
                        <path d="M 0,5 10,5 10,6 0,6 Z"></path>
                    </svg>
                </button>
                <button aria-label="maximize" title="Maximize" tabindex="-1" @click="maximizeWindow">
                    <svg aria-hidden="true" version="1.1" width="10" height="10">
                        <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"></path>
                    </svg>
                </button>
                <button aria-label="close" title="Close" tabindex="-1" class="close" @click="closeWindow">
                    <svg aria-hidden="true" version="1.1" width="10" height="10">
                        <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"></path>
                    </svg>
                </button>
            </div>
        </v-app-bar>

        <!-- Navigation Drawer -->
        <v-navigation-drawer
            v-model="drawer"
            temporary
        >
            <v-list height="100%">
                <v-list-item prepend-icon="mdi-content-save" title="Save File" @click="saveFile"></v-list-item>
                <v-list-item prepend-icon="mdi-folder-open" title="Load File" @click="loadFile"></v-list-item>
                <v-list-item prepend-icon="mdi-exit-run" title="Exit" @click="closeWindow"></v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-switch label="Dark Mode" v-model="theme.global.current.value.dark" margin-left="20px" @change="toggleDarkMode"></v-switch>
                </v-list-item>
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
            <v-chart class="memoryChart" :option="chartOptions" style="height: 30%;" autoresize />
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, useTemplateRef } from "vue";
import { useTheme } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import { incoconnect, incodisconnect, incoclassmemusage, incousedmem, incototalmem, incoallocatedmem } from "./incoconnection.js";

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart, { THEME_KEY } from 'vue-echarts';
use([TooltipComponent, GridComponent, LineChart, CanvasRenderer])

let intervalId = null;

const drawer = ref(false);

const totalmem = ref(1);
const membegin = ref({});

const theme = useTheme();
// watch(() => theme.global.current.value.dark,
//     (newVal) => {
//         chartOptions.value = updateChartThemeMode(chartOptions.value, newVal);
//     }
// );

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
    color: ['#4dc3ff', '#ff614d'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            label: {
                backgroundColor: '#6a7985'
            }
        }
    },
    grid: {
        left: '1%',
        right: '1%',
        bottom: '1%',
        containLabel: true
    },
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            splitNumber: 10,
            data: [],
        }
    ],
    yAxis: [
        {
            type: 'value',
            splitNumber: 4,
        }
    ],
    series: [
        {
            name: 'UsedMemory',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 0
            },
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
            },
            data: []
        },
        {
            name: 'AllocatedMemory',
            type: 'line',
            stack: 'Total',
            smooth: true,
            lineStyle: {
                width: 0
            },
            showSymbol: false,
            areaStyle: {
                opacity: 0.8,
            },
            data: []
        },
    ]
});

const selectInterval = ref(10000);
const options = ref([
    { title: '1 second', value: 1000 },
    { title: '5 seconds', value: 5000 },
    { title: '10 seconds', value: 10000 },
    { title: '30 seconds', value: 30000 },
    { title: '60 seconds', value: 60000 },
]);

watch(selectInterval, (newInterval) => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    intervalId = setInterval(updateMemoryUsage, newInterval);
});

const isRecording = ref(false);

function toggleRecord() {
    isRecording.value = !isRecording.value;
    if (isRecording.value) {
        console.log("Recording started");
        series.value[0].data = [];
        items.value = [];
        chartOptions.value.yAxis[0].max = totalmem.value;
        chartOptions.value.yAxis[0].interval = totalmem.value / 4;
    } else {
        console.log("Recording stopped");
    }
}

const updateMemoryUsage = () => {
    if (!isRecording.value) {
        return;
    }

    incousedmem().then((usedmem) => {
        const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
        incoallocatedmem().then((allocatedmem) => {
            chartOptions.value.xAxis[0].data.push(currentTime);
            chartOptions.value.series[0].data.push(usedmem);
            chartOptions.value.series[1].data.push(allocatedmem);
        });
    });

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

async function saveFile() {
    const result = await window.electron.showSaveDialog({
        title: "Save a file",
        filters: [{ name: "Inco Leak Peak Files", extensions: ["ilp"] }],
    });

    if (!result.canceled) {
        console.log("Selected path:", result.filePath);
        const saveFileData = {
            totalmem: totalmem.value,
            membegin: membegin.value,
            series: series.value,
            items: items.value,
        };
        const jsonData = JSON.stringify(saveFileData);
        await window.electron.writeFile(result.filePath, jsonData);
    } else {
        console.log("User canceled the save dialog.");
    }
}

function loadFile() {
    window.electron.showOpenDialog({
        title: "Open a file",
        filters: [{ name: "Inco Leak Peak Files", extensions: ["ilp"] }],
    }).then(async (result) => {
        if (!result.canceled) {
            console.log("Selected path:", result.filePaths[0]);
            const jsonData = await window.electron.readFile(result.filePaths[0]);
            const data = JSON.parse(jsonData.data);
            totalmem.value = data.totalmem;
            membegin.value = data.membegin;
            series.value = data.series;
            items.value = data.items;
        } else {
            console.log("User canceled the open dialog.");
        }
    });
}

function toggleDarkMode() {
    localStorage.setItem("darkMode", theme.global.current.value.dark);
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

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      theme.global.current.value.dark = isDark;
      theme.global.name.value = isDark ? 'light' : 'dark';
    }

    intervalId = setInterval(updateMemoryUsage, selectInterval.value); // Use selectInterval value
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

.titlebar-buttons {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    flex-shrink: 0;
    margin-left: auto;

    button {
        -webkit-app-region: no-drag;
        display: inline-block;
        position: relative;
        width: 45px;
        height: 45px;
        padding: 0;
        margin: 0;
        overflow: hidden;
        border: none;
        box-shadow: none;
        border-radius: 0;
        color: currentColor;
        background-color: transparent;
        line-height: 100%;
        outline: none;

        svg {
            fill: currentColor;
        }

        &:hover {
            background-color: rgba(0, 0, 0, 0.2);
            color: currentColor;
        }

        &.close:hover {
            background-color: #e81123;
            color: #fff;
        }
    }
}

.v-app-bar-nav-icon {
    border-radius: 0;
}
.v-app-bar-nav-icon:hover,
.v-app-bar-nav-icon:focus,
.v-app-bar-nav-icon:active {
    border-radius: 0;
}

.v-btn {
    border-radius: 0;
}
.v-btn:hover,
.v-btn:focus,
.v-btn:active {
    border-radius: 0;
}

</style>
