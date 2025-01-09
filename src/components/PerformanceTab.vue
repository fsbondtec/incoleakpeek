<template>
    <v-container>
        <apexchart
            type="line"
            height="350"
            :options="chartOptions1"
            :series="series1"
        ></apexchart>
    </v-container>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useTheme } from "vuetify";
import { incousedmem, incototalmem } from "../incoconnection.js";
let intervalId = null;

const theme = useTheme();

const series1 = ref([
    {
        name: "RAM (Byte)",
        data: [],
    },
]);

const chartOptions1 = ref({
    chart: {
        height: 350,
        type: "line",
        toolbar: {
            show: false,
        },
    },
    title: {
        text: "RAM Usage",
        align: "left",
    }
});

watch(
    () => theme.global.current.value.dark,
    (newVal) => {
        chartOptions1.value = updateChartThemeMode(chartOptions1.value, newVal);
    },
);

const updateMemoryUsage = () => {
    incousedmem().then((usedmem) => {
        const currentTime = new Date().toLocaleTimeString();
        series1.value[0].data.push({ x: currentTime, y: usedmem });
        if (series1.value[0].data.length > 60) {
            series1.value[0].data.shift();
        }
    });
};

onMounted(() => {
    intervalId = setInterval(updateMemoryUsage, 1000); // Aktualisierung alle 5 Sekunden
});

onBeforeUnmount(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
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
