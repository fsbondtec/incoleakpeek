<template>
    <div class="task-manager">
    <table>
        <thead>
        <tr>
            <th @click="sortBy('name')">
            Class Name
            <span v-if="sortColumn === 'name'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
            <th @click="sortBy('memory')">
            RAM (Byte)
            <span v-if="sortColumn === 'memory'">{{ sortDirection === 'asc' ? '▲' : '▼' }}</span>
            </th>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="(process, index) in sortedProcesses"
            :key="index"
        >
            <td>{{ process.name }}</td>
            <td>{{ process.memory }}</td>
        </tr>
        </tbody>
    </table>
    </div>
</template>

<script>
import { incoclassmemusage } from '../incoconnection.js';
export default {
    name: "ClassOverviewTab",
    data() {
        return {
            processes: [
            { name: "chrome.exe", memory: 1200 },
            { name: "explorer.exe", memory: 300 },
            { name: "error.exe", memory: 700 },
            { name: "python.exe", memory: 500 },
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
            

            // Simuliere zufällige Änderungen in der Arbeitsspeicherauslastung
            // this.processes.forEach((process) => {
            // const randomChange = Math.floor(Math.random() * 200) - 100; // -100 bis +100 MB
            // process.memory = Math.max(100, process.memory + randomChange); // Minimum 100 MB
            //});
        },
    },
    mounted() {
        // Starte das Live-Update
        updateMemoryUsage()
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