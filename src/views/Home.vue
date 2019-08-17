<template>
	<div class="container">
		<header>
			<img ref="logo" :class="[loading ? 'loading':'']" src="@/assets/activities-circle.svg" alt="activities logo" id="logo">
		</header>
		<main>
			<input v-if="mode == 'chart'" type="text" v-model="username">
			<h4 v-if="!loading">Waiting for activity to begin...</h4>
		</main>
	</div>
</template>

<script>
import sjcl from 'sjcl'

export default {
	name: 'Home',
	props: {
		room: String
	},
	data() {
		return {
			username: ''
		}
	},
	computed: {
		loading() {
			return this.$store.state.activityData == ''
		},
		mode() {
			return this.$store.state.mode
		},
		activityType() {
			return this.$store.state.activityType
		},
		date() {
			return this.$store.state.activityDate
		}
	},
	sockets: {
		roomJoined() {
			this.$store.dispatch('setRoomJoined')

			this.$socket.emit('requestActivityData')
		},
		incomingActivityData(data) {
			let decrypted = this.decrypt(data)

			this.$store.dispatch('setActivityData', decrypted)

			if (this.mode == 'preview') {
				this.startActivity()
			}
		},
		allowActivityStart() {
			this.startActivity()
		},
		disconnect() {
			this.$socket.emit('rejoinActivityRoom', this.room)
		},
		rejoinedActivityRoom() {
			console.log('rejoined room')
			this.$socket.emit('checkActivityStatus', this.room)
		},
		activityCanceled() {
			this.$router.push('/cancel')
		},
		roomJoinRejected() {
			this.$router.push('/error')
		},
		participationRejected() {
			this.$router.push('/end')
		}
	},
	methods: {
		decrypt(data) {
            let decrypted = sjcl.decrypt(this.room, data)

            return JSON.parse(decrypted)
        },
        startActivity() {
        	if (!this.activityAlreadyCompleted(this.room)) {
        		if (this.mode !== 'chart') {
					let scope = this

					setTimeout(function() {
						scope.$router.push('/activity')
					}, 1000, scope)
				} else {
					// todo
				}
        	} else {
        		this.$router.push('/end')
        	}
        },
        activityAlreadyCompleted(room) {
    		let record = localStorage.getItem(room)
    		if (record !== null) {
    			let parsed = JSON.parse(record)

	    		console.log('Found record in localStorage: ', parsed)

	    		if (parsed.completed && parsed.date == this.date) {
	    			console.log('already completed')

	    			return true
	    		} else {
	    			console.log('incomplete')

	    			return false
	    		}
    		}
    	}
	},
	mounted() {
		if (this.room) {
			this.$store.dispatch('setRoomID', this.room)
			this.$socket.emit('joinActivityRoom', this.room)
		}
	}
}
</script>

<style scoped>
@media screen and (max-width: 800px) {
	
}

@media screen and (min-width: 801px) {
	
}

.container {
	width: 100%;
	height: 100%;
	min-height: 100vh;
	display: grid;
	grid-template-rows: 1fr 1fr;
	grid-template-areas: 
		"header"
		"main";
	justify-content: center;
}

header {
	grid-area: header;
	text-align: center;
	align-self: center;
}

main {
	grid-area: main;
	align-self: flex-start;
}

#logo {
	height: 5em;
}

.loading {
	animation-name: spin;
	animation-iteration-count: infinite;
	animation-duration: 1.5s;
	animation-timing-function: ease-in-out;
	animation-delay: .5s;
}

h4 {
	color: var(--light-gray);
}

@keyframes spin {
	from {transform: rotate(0deg);}
	to {transform: rotate(360deg);}
}
</style>
