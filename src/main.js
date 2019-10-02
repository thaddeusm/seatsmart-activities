import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import SocketIO from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

Vue.use(new VueSocketIO({
    debug: true,
    connection: SocketIO('https://remote-server.seatsmart.tech'),
    vuex: {
      store,
      actionPrefix: "SOCKET_"
    }
}))

Vue.config.productionTip = false

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
