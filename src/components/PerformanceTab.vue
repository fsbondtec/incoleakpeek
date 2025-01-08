<template>
    <div>
        <apexchart type="line" height="350" :options="chartOptions1" :series="series1"></apexchart>
        <apexchart type="line" height="350" :options="chartOptions2" :series="series2"></apexchart>
    </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'

export default {
    name: 'PerformanceTab',
    components: {
        apexchart: VueApexCharts
    },
    data() {
        return {
            series1: [{
                name: 'Dataset 1',
                data: [65, 59, 80, 81, 56, 55, 40]
            }],
            chartOptions1: {
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
                }
            },
            series2: [{
                name: 'Dataset 2',
                data: [28, 48, 40, 19, 86, 27, 90]
            }],
            chartOptions2: {
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
                }
            }
        }
    }
}
</script>
