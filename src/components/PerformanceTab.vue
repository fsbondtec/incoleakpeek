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

const totalmem = ref(1);

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
    },
    xaxis: {
        type: 'numeric',
        range: 60000, // 60 seconds
        tickAmount: 1, // Only first and last ticks
        labels: {
            formatter: function (val, timestamp) {
                return Math.round((new Date().getTime() - timestamp) / 1000);
            },
        },
    },
    yaxis: {
        type: 'numeric',
        opposite: true,
        min: 0,
        max: totalmem,
        tickAmount: 1, // Only first and last ticks
    },
});

watch(
    () => theme.global.current.value.dark,
    (newVal) => {
        chartOptions1.value = updateChartThemeMode(chartOptions1.value, newVal);
    },
);

const updateMemoryUsage = () => {
    incousedmem().then((usedmem) => {
        const currentTime = new Date().getTime();
        series1.value[0].data.push({ x: currentTime, y: usedmem });
    });
};

onMounted(() => {
    incototalmem().then((total) => {
        totalmem.value = total;
    });
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
