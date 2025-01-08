<template>
    <div class="task-manager">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('name')">
              Prozessname
              <span v-if="sortColumn === 'name'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('cpu')">
              CPU (%)
              <span v-if="sortColumn === 'cpu'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('memory')">
              Arbeitsspeicher (MB)
              <span v-if="sortColumn === 'memory'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(process, index) in sortedProcesses"
            :key="index"
            :class="{ 'high-cpu': process.cpu > 50 }"
          >
            <td>{{ process.name }}</td>
            <td>{{ process.cpu }}</td>
            <td>{{ process.memory }}</td>
            <td>
              <button @click="terminateProcess(index)">Beenden</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  export default {
    name: "ClassOverviewTab",
    data() {
      return {
        processes: [
          { name: "chrome.exe", cpu: 35, memory: 1200 },
          { name: "explorer.exe", cpu: 5, memory: 300 },
          { name: "error.exe", cpu: 65, memory: 700 },
          { name: "python.exe", cpu: 10, memory: 500 },
        ],
        sortColumn: "name",
        sortDirection: "asc",
        intervalId: null,
      };
    },
    computed: {
      sortedProcesses() {
        return [...this.processes].sort((a, b) => {
          const column = this.sortColumn;
          const dir = this.sortDirection === "asc" ? 1 : -1;
          if (typeof a[column] === "string") {
            return a[column].localeCompare(b[column]) * dir;
          }
          return (a[column] - b[column]) * dir;
        });
      },
    },
    methods: {
      sortBy(column) {
        if (this.sortColumn === column) {
          this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
        } else {
          this.sortColumn = column;
          this.sortDirection = "asc";
        }
      },
      terminateProcess(index) {
        alert(`Prozess "${this.processes[index].name}" wird beendet.`);
        this.processes.splice(index, 1);
      },
      updateMemoryUsage() {
        // Simuliere zufällige Änderungen in der Arbeitsspeicherauslastung
        this.processes.forEach((process) => {
          const randomChange = Math.floor(Math.random() * 200) - 100; // -100 bis +100 MB
          process.memory = Math.max(100, process.memory + randomChange); // Minimum 100 MB
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
  
  <style scoped>
  .task-manager {
    font-family: Arial, sans-serif;
    margin: 20px;
    width: 100%;
    max-width: 800px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  thead {
    background-color: #f4f4f4;
  }
  
  th, td {
    text-align: left;
    padding: 10px;
    border: 1px solid #ddd;
  }
  
  th {
    cursor: pointer;
    user-select: none;
  }
  
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  tr:hover {
    background-color: #f1f1f1;
  }
  
  .high-cpu {
    background-color: #ffdddd;
  }
  
  button {
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    background-color: #f44336;
    color: white;
  }
  
  button:hover {
    opacity: 0.8;
  }
  
  th span {
    font-size: 0.8em;
    margin-left: 5px;
  }
  </style>