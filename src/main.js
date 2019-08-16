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

new Vue({
	store,
	router,
	render: h => h(App)
}).$mount('#app')
