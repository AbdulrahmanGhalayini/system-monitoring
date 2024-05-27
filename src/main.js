import { createApp } from 'vue'

import App from './App.vue'

import axios from "axios";
import VueAxios from "vue-axios";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const app = createApp(App)

const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674'
}

app.use(VueSweetalert2, options);


app.use(VueAxios, axios);

app.mount('#app')
