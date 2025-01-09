<template>
    <v-app>
        <!-- Custom Titlebar -->
        <v-toolbar density="compact">
            <v-toolbar-title>IncoLeakPeek</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="toggleDarkMode">
                <v-icon>mdi-theme-light-dark</v-icon>
            </v-btn>
            <v-btn icon @click="minimizeWindow">
                <v-icon>mdi-window-minimize</v-icon>
            </v-btn>
            <v-btn icon @click="maximizeWindow">
                <v-icon>mdi-window-maximize</v-icon>
            </v-btn>
            <v-btn icon @click="closeWindow">
                <v-icon>mdi-window-close</v-icon>
            </v-btn>
        </v-toolbar>

        <!-- Main content -->
        <v-main>
            <v-container>
                <v-tabs v-model="activeTab">
                    <v-tab>ClassOverview</v-tab>
                    <v-tab>Performance</v-tab>
                </v-tabs>

                <v-tabs-window v-model="activeTab">
                    <v-tabs-window-item>
                        <ClassOverviewTab />
                    </v-tabs-window-item>
                    <v-tabs-window-item>
                        <PerformanceTab />
                    </v-tabs-window-item>
                </v-tabs-window>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useTheme } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";

import ClassOverviewTab from "./components/ClassOverviewTab.vue";
import PerformanceTab from "./components/PerformanceTab.vue";
import { incoconnect, incodisconnect } from "./incoconnection.js";

const activeTab = ref(0);

const theme = useTheme();

function toggleDarkMode() {
    theme.global.name.value = theme.global.current.value.dark
        ? "light"
        : "dark";
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
    incoconnect("http://192.168.1.251:80");
});

onBeforeUnmount(() => {
    incodisconnect();
});
</script>

<style scoped>
.v-toolbar {
    -webkit-app-region: drag; /* Ermöglicht das Verschieben des Fensters */
}

.v-btn {
    -webkit-app-region: no-drag; /* Buttons nicht verschiebbar */
}

.v-tabs-window-item {
    max-height: calc(100vh - 150px); /* Maximale Höhe des Inhaltsbereichs */
    overflow: auto; /* Scrollbar nur bei Bedarf */
}
</style>
