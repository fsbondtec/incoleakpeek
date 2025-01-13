// https://github.com/apexcharts/ng-apexcharts/issues/228#issuecomment-2392632549
export function updateChartThemeMode(chartOptions, darkMode) {
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
