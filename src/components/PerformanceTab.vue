<template>
    <v-container>
        <apexchart type="line" height="350" :options="chartOptions1" :series="series1"></apexchart>
        <apexchart type="line" height="350" :options="chartOptions2" :series="series2"></apexchart>
    </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useTheme } from 'vuetify'

const theme = useTheme()

const series1 = ref([{
    name: 'Dataset 1',
    data: [65, 59, 80, 81, 56, 55, 40]
}]);

const chartOptions1 = ref({
    chart: {
        height: 350,
        type: 'line'
    },
    title: {
        text: 'Chart 1',
        align: 'left'
    },
    xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    },
});

const series2 = ref([{
    name: 'Dataset 2',
    data: [28, 48, 40, 19, 86, 27, 90]
}]);

const chartOptions2 = ref({
    chart: {
        height: 350,
        type: 'line'
    },
    title: {
        text: 'Chart 2',
        align: 'left'
    },
    xaxis: {
        categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    },
});

watch(() => theme.global.current.value.dark, (newVal) => {
    chartOptions1.value = updateChartThemeMode(chartOptions1.value, newVal);
    chartOptions2.value = updateChartThemeMode(chartOptions2.value, newVal);
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
      foreColor: darkMode ? '#f6f7f8' : 'undefined',
      background: darkMode ? '#424242' : 'undefined',
    },
    theme: {
      ...theme,
      // Update the theme mode.
      mode: darkMode ? 'dark' : 'light'
    },
    tooltip: {
      ...tooltip,
      // Update the tooltip theme based on the theme mode.
      theme: darkMode ? 'dark' : 'light',
    },
  };

  return chartOptions;
}

</script>
