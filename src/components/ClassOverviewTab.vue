<template>
  <v-container>
    <v-data-table
      :headers="headers"
      :items="items"
      class="elevation-1"
    >
      <template v-slot:[`item.actions`]="{ item, index }">
        <v-btn color="red" @click="terminateProcess(index)">Beenden</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
export default {
  name: "ClassOverviewTab",
  data() {
    return {
      intervalId: null,
      headers: [
        { text: 'Prozessname', value: 'name', sortable: true },
        { text: 'CPU (%)', value: 'cpu', sortable: true },
        { text: 'Arbeitsspeicher (MB)', value: 'memory', sortable: true },
        { text: 'Aktionen', value: 'actions', sortable: false },
      ],
      items: [
        { name: "chrome.exe", cpu: 35, memory: 1200 },
        { name: "explorer.exe", cpu: 5, memory: 300 },
        { name: "error.exe", cpu: 65, memory: 700 },
        { name: "python.exe", cpu: 10, memory: 500 },
      ],
    };
  },
  methods: {
    terminateProcess(index) {
      alert(`Prozess "${this.processes[index].name}" wird beendet.`);
      this.processes.splice(index, 1);
    },
    updateMemoryUsage() {
      // Simuliere zufällige Änderungen in der Arbeitsspeicherauslastung
      this.items.forEach((item) => {
        const randomChange = Math.floor(Math.random() * 200) - 100; // -100 bis +100 MB
        item.memory = Math.max(100, item.memory + randomChange); // Minimum 100 MB
      });
    },
  },
  mounted() {
    // Starte das Live-Update
    this.intervalId = setInterval(this.updateMemoryUsage, 2000); // Aktualisierung alle 2 Sekunden
  },
  beforeUnmount() {
    // Stoppe das Interval, wenn die Komponente entfernt wird
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
};
</script>
