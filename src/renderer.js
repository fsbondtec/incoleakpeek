import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import VueApexCharts from 'vue3-apexcharts';

import App from './App.vue';

const vuetify = createVuetify({
    components,
    directives,
  })
  
createApp(App).component("apexchart", VueApexCharts).use(vuetify).mount('#app');
