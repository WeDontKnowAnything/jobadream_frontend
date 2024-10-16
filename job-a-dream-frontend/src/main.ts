// main.ts
import { createApp } from 'vue'

import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'

// Styles
import '@core/scss/template/index.scss'
import '@styles/styles.scss'

// Create Vue app
const app = createApp(App)

// Register plugins (router, Vuetify, etc.)
registerPlugins(app)

// Mount Vue app
app.mount('#app')
