import Vue from 'vue'
import App from './App.vue'

import './assets/css/app.css'
import './assets/images/lessoncart-logo-32.png'
import './assets/images/lessoncart-logo-512.png'
import './assets/images/lessoncart-logo-maskable-192.png'

import './service-worker.js'


new Vue({
  render: (h) => h(App)
}).$mount('#app')
