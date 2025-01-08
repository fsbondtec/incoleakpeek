<template>
  <div id="app">
    <v-app>
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
    </v-app>
  </div>
</template>

<script>
import ClassOverviewTab from './components/ClassOverviewTab.vue';
import PerformanceTab from './components/PerformanceTab.vue';

export default {
  name: 'App',
  components: {
    ClassOverviewTab,
    PerformanceTab
  },
  data() {
    return {
      activeTab: 0
    };
  }
};
</script>
