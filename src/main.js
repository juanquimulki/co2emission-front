import Vue from 'vue'
import App from './App.vue'

// Bootstrap
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout project
Vue.use(BootstrapVue)
// Optional BootstrapVue icon components plugin
Vue.use(IconsPlugin)

// Axios
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// HTML to Paper
const options = {
  styles: ["./css/print.css"],
};
import VueHtmlToPaper from "vue-html-to-paper";
Vue.use(VueHtmlToPaper, options);

// Excel Export
import excel from 'vue-excel-export' 
Vue.use(excel)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
