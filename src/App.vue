<template>
    <v-app>
        <!-- Custom Titlebar -->
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
                <v-list-item prepend-icon="mdi-information" title="About" @click="showAboutDialog"></v-list-item>
                <v-list-item prepend-icon="mdi-exit-run" title="Exit" @click="closeWindow"></v-list-item>
                <v-divider></v-divider>
                <v-list-item>
                    <v-switch label="Dark Mode" v-model="darkMode" margin-left="20px" @change="toggleDarkMode"></v-switch>
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
            >
            <template v-slot:item.memory="{ item }">
                {{ Humanize.fileSize(item.memory) }}
            </template>
            </v-data-table-virtual>
            <v-chart class="memoryChart" :option="chartOptions" style="height: 30%;" autoresize />
        </v-main>

        <!-- About Dialog -->
        <v-dialog v-model="aboutDialog" max-width="500px">
            <v-card>
                <v-card-title class="headline">About IncoLeakPeek</v-card-title>
                <v-card-text>
                    <p><strong>IncoLeakPeek</strong> is a memory usage monitoring tool designed to detecting memory leaks within <a href="https://www.indel.ch/" target="_blank">Indel</a> industrial automation systems.</p>
                    <p><strong>Version:</strong> 0.0.2</p>
                    <p><strong>Developed by:</strong> <a href="https://www.fsbondtec.at/" target="_blank">F&S BONDTEC Semiconductor GmbH</a></p>
                    <p><strong>License:</strong> This project is licensed under the MIT License.</p>
                    <p><strong>Third-Party Licenses:</strong></p>
                    <ul>
                        <li><a href="https://www.indel.ch/" target="_blank">incov.browser.min.js</a>: Subject to Indel AG's licensing terms</li>
                        <li><a href="https://github.com/electron/electron/blob/main/LICENSE" target="_blank">Electron</a>: Licensed under the MIT License</li>
                        <li><a href="https://github.com/nodejs/node/blob/main/LICENSE" target="_blank">Node.js</a>: Licensed under the MIT License</li>
                        <li><a href="https://github.com/vuejs/vue/blob/main/LICENSE" target="_blank">Vue.js</a>: Licensed under the MIT License</li>
                        <li><a href="https://github.com/vuetifyjs/vuetify/blob/master/LICENSE" target="_blank">Vuetify</a>: Licensed under the MIT License</li>
                        <li><a href="https://github.com/Templarian/MaterialDesign-Webfont/blob/master/LICENSE" target="_blank">@mdi/font</a>: Licensed under the MIT License</li>
                        <li><a href="https://github.com/apache/echarts/blob/master/LICENSE" target="_blank">echarts</a>: Licensed under the Apache License 2.0</li>
                        <li><a href="https://github.com/ecomfe/vue-echarts/blob/main/LICENSE" target="_blank">vue-echarts</a>: Licensed under the MIT License</li>
                        <li><a href="https://github.com/HubSpot/humanize/blob/master/LICENSE" target="_blank">humanize-plus</a>: Licensed under the MIT License</li>
                    </ul>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="aboutDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { useTheme } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import { incoconnect, incodisconnect, incoclassmemusage, incototalmem } from "./incoconnection.js";

import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { TooltipComponent, GridComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts';
use([TooltipComponent, GridComponent, LineChart, CanvasRenderer])

import Humanize from 'humanize-plus';

let intervalId = null;

const drawer = ref(false);
const aboutDialog = ref(false);
const totalmem = ref(1);
const membegin = ref({});
const countbegin = ref({});
const countmax = ref({});
const theme = useTheme();
const search = ref("");
const darkMode = ref(true);

const headers = ref([
    { title: "Class Name", key: "name" },
    { title: "RAM", key: "memory" },
    { title: "start count", key: "startcount" },
    { title: "count", key: "actcount" },
    { title: "count Δ", key: "countdelta" },
    { title: "max count", key: "maxcount" },
]);

const items = ref([]);

const chartOptions = ref({
    color: ['#4dc3ff', '#ff614d'],
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'line',
            label: {
                backgroundColor: '#6a7985'
            }
        },
        formatter: function (params) {
            let result = params[0].name + '<br/>';
            params.forEach(item => {
                result += item.marker + item.seriesName + ': ' + Humanize.fileSize(item.value) + '<br/>';
            });
            return result;
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
            axisLabel: {
                formatter: function (value) {
                    return Humanize.fileSize(value);
                }
            }
        }
    ],
    series: [
        {
            name: 'UsedMemory',
            type: 'line',
            smooth: true,
            lineStyle: {
                width: 3
            },
            showSymbol: false,
            data: []
        },
        {
            name: 'AllocatedMemory',
            type: 'line',
            smooth: true,
            lineStyle: {
                width: 0
            },
            showSymbol: false,
            areaStyle: {
                opacity: 0.6,
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

const isRecording = ref(false);

function toggleRecord() {
    isRecording.value = !isRecording.value;
    intervalId = setInterval(updateMemoryUsage, selectInterval.value);
    if (isRecording.value) {
        console.log("Recording started");
        chartOptions.value.xAxis[0].data = [];
        chartOptions.value.series[0].data = [];
        chartOptions.value.series[1].data = [];
        items.value = [];
        chartOptions.value.yAxis[0].max = totalmem.value;
        chartOptions.value.yAxis[0].interval = totalmem.value / 4;
    } else {
        clearInterval(intervalId);
        intervalId = null;
        console.log("Recording stopped");
    }
}

const updateMemoryUsage = () => {
    if (!isRecording.value) {
        return;
    }

    incoclassmemusage().then((incoClasses) => {
        if (incoClasses && typeof incoClasses === "object") {
            const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
            var old = items.value;
            items.value = [];
            for (const [classKey, classValue] of Object.entries(incoClasses.classes)) {
                var startcount = countbegin.value[classKey];
                var countdelta = classValue.count - startcount;
                var actcount = classValue.count;
                countmax.value[classKey] = Math.max(countmax.value[classKey], actcount);

                var cla = {
                    name: classKey,
                    memory: classValue.memory,
                    startcount: startcount,
                    actcount: actcount,
                    maxcount: countmax.value[classKey],
                    countdelta: countdelta,
                };
                items.value.push(cla);
            }
            chartOptions.value.xAxis[0].data.push(currentTime);
            chartOptions.value.series[0].data.push(incoClasses.used);
            chartOptions.value.series[1].data.push(incoClasses.alloc);
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
            countbegin: countbegin.value,
            countmax: countmax.value,
            chartopt: chartOptions.value,
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
            countbegin.value = data.countbegin;
            countmax.value = data.countmax;
            chartOptions.value = data.chartopt;
            items.value = data.items;
        } else {
            console.log("User canceled the open dialog.");
        }
    });
}

function showAboutDialog() {
    aboutDialog.value = true;
}

function toggleDarkMode() {
    theme.global.current.value.dark = darkMode.value;
    theme.global.name.value = theme.global.current.value.dark ? "dark" : "light";
    localStorage.setItem("darkMode", theme.global.current.value.dark);
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
            for (const [classKey, classValue] of Object.entries(incoClasses.classes)) {
                membegin.value[classKey] = classValue.memory;
                countbegin.value[classKey] = classValue.count;
                countmax.value[classKey] = classValue.count;
            }
        });
    });

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const isDark = savedDarkMode === 'true';
      darkMode.value = isDark;
      theme.global.current.value.dark = isDark;
      theme.global.name.value = isDark ? 'dark' : 'light';
    }
});

onBeforeUnmount(() => {
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

.v-card-text p {
    margin: 0 0 10px;
}

.v-card-text ul {
    padding-left: 20px;
    margin: 0;
}

.v-card-text ul li {
    margin-bottom: 5px;
}

</style>
