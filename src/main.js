import { createApp } from 'vue'
// import './style.css'
import App from './App.vue'

import router from './router'

import vant from 'vant'
import 'vant/lib/index.css'
import { Icon } from 'vant'
import './assets/common.css'



const app = createApp(App)
app.use(router)

app.use(vant)
app.use(Icon)

app.mount('#app')
