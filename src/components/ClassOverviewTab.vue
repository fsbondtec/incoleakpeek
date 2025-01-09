<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
    >
    </v-data-table>
  </v-container>
</template>

<script>
import { incoclassmemusage } from '../incoconnection.js';

export default {
  name: "ClassOverviewTab",
  data() {
    return {
      intervalId: null,
      headers: [
        { text: 'Class Name', value: 'name', sortable: true },
        { text: 'RAM (Byte)', value: 'memory', sortable: true },
      ],
      items: [
        { name: "chrome.exe", memory: 1200 },
        { name: "explorer.exe", memory: 300 },
        { name: "error.exe", memory: 700 },
        { name: "python.exe", memory: 500 },
      ],
    };
  },
  methods: {
    updateMemoryUsage() {
      incoclassmemusage().then((incoClasses) => {
                if (incoClasses && typeof incoClasses === 'object') {
                    this.processes = [];
                    for (const [classKey, classValue] of Object.entries(incoClasses)) {
                        var cla = { name: classKey, memory: classValue };
                        this.processes.push(cla);
                    }
                } else {
                    console.error('Invalid data received from getClassMemUseage');
                }
                console.log(this.processes);
            });
    },
  },
  mounted() {
        // Starte das Live-Update
        this.updateMemoryUsage()
        this.intervalId = setInterval(this.updateMemoryUsage, 5000); // Aktualisierung alle 2 Sekunden
  },
  beforeUnmount() {
    // Stoppe das Interval, wenn die Komponente entfernt wird
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>
