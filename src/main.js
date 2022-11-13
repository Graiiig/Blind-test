import { createApp } from 'vue'
import App from './App.vue'
import Buzzer from './components/Buzzer.vue'
import Home from './components/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import './assets/styles.css'
import store from './store.js'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path : '/', name: 'Home', component: Home, props: true},
        {path : '/buzzer/:googleUid/:username', name: 'Buzzer', component: Buzzer, props: true},
    ]
})

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPlay, faPause, faPlusCircle, faMusic, faTrashCan, faHome, faCompactDisc, faMicrophoneLines, faCircleXmark, faForwardStep, faBackwardStep,
    faQrcode} from "@fortawesome/free-solid-svg-icons";
// Ajout des icones dont on a besoin à la librairie
library.add(faPlay, faPause, faPlusCircle, faMusic, faTrashCan, faHome, faCompactDisc, faMicrophoneLines, faCircleXmark, faForwardStep, faBackwardStep, faQrcode);
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(router)
    .use(store)
    .mount('#app')
