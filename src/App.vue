<template>
  <v-app>
    <!-- Custom Titlebar -->
    <div class="titlebar">
      <v-row align="center" justify="space-between" class="titlebar-row">
        <v-col cols="auto">
          <span class="title-text">My Custom Title</span>
        </v-col>
        <v-col cols="auto" class="titlebar-buttons">
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
        </v-col>
      </v-row>
    </div>
    
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
import { ref } from 'vue';
import { useTheme } from 'vuetify'
import '@mdi/font/css/materialdesignicons.css';

import ClassOverviewTab from './components/ClassOverviewTab.vue';
import PerformanceTab from './components/PerformanceTab.vue';

const activeTab = ref(0);

const theme = useTheme()

function toggleDarkMode() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
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
</script>

<style scoped>
.titlebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 50px; /* Höhe der Titelleiste */
  background-color: v-bind(theme.global.current.value.dark ? '#1e1e1e' : '#282c34');
  color: white;
  z-index: 1000;
  -webkit-app-region: drag; /* Ermöglicht das Verschieben des Fensters */
}

.titlebar-row {
  margin-left: 10px;
  margin-right: 10px;
}

.titlebar-buttons {
  display: flex;
  gap: 10px;
}

.title-text {
  font-size: 18px;
  font-weight: bold;
}

.v-main {
  margin-top: 50px; /* Platz für die Titelleiste schaffen */
  overflow: auto; /* Scrollbar nur bei Bedarf */
  max-height: calc(100vh - 50px); /* Maximale Höhe des Inhaltsbereichs */
}

.v-btn {
  -webkit-app-region: no-drag; /* Buttons nicht verschiebbar */
}
</style>