<template>
	<div class="container">
		<header>
			<transition name="fade" mode="out-in">
				<img ref="logo" v-if="loading" src="@/assets/activities-circle.svg" alt="activities logo" id="logo" key="logo">
				<img ref="illustration" v-else-if="activityType == 'survey'" src="@/assets/survey-illustration.svg" alt="survey illustration" id="illustration" key="illustration">
				<img ref="illustration" v-else-if="activityType == 'response pool'" src="@/assets/response-pool-illustration.svg" alt="illustration" id="illustration" key="illustration">
			</transition>
		</header>
		<main>
			<section id="autocompleteOptions">
				<button class="autocomplete-button" v-for="(student, index) in possibleNames" @click="setName(student)">
					{{ student.shortName }}
				</button>
				<span v-if="possibleNames.length == 2">...</span>
			</section>
			<section id="usernameArea" v-if="mode !== 'anonymously' && !nameConfirmed">
				<input type="text" v-model="username" placeholder="Search for your name...">
				<button id="confirmButton" @click="confirmName" :disabled="selectedName.shortName == ''">Connect</button>
			</section>
			<h4 v-if="!loading && nameConfirmed || mode == 'anonymously'">Waiting for activity to begin...</h4>
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
			username: '',
			selectedName: {
				shortName: '',
				fullName: {}
			},
			nameConfirmed: false
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
		},
		possibleNames() {
			let allNames = this.$store.state.students

			let filteredNames = allNames.filter(student => {
				return student.firstName.toLowerCase().includes(this.username.toLowerCase())
			})

			let arr = filteredNames.map(student => {
				return {
					shortName:`${student.firstName} ${student.lastName[0]}${student.lastName[1]}.`,
					fullName: student
				}
			})

			if (arr.length > 2) {
				return arr.splice(0, 2)
			} else {
				return arr
			}
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
			this.$socket.emit('requestActivityData')
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
        encrypt(data) {
            return sjcl.encrypt(this.room, JSON.stringify(data))
        },
        startActivity() {
        	if (!this.activityAlreadyCompleted(this.room)) {
        		let scope = this

				setTimeout(function() {
					scope.$router.push('/activity')
				}, 1000, scope)
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
    	},
    	setName(studentName) {
    		this.username = `${studentName.fullName.firstName} ${studentName.fullName.lastName}`
    		this.selectedName = studentName
    	},
    	confirmName() {
    		this.$store.dispatch('setUsername', this.selectedName)
    		this.nameConfirmed = true
    		this.$socket.emit('checkActivityStatus', this.room)
    		this.$socket.emit('sendingUsername', this.encrypt(this.selectedName.fullName))
    	}
	},
	mounted() {
		if (this.room) {
			this.$store.dispatch('setRoomID', this.room)
			this.$socket.emit('joinActivityRoom', this.room)
		} else {
			this.$router.push('/code')
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
	display: grid;
	grid-template-rows: 40vh 1fr;
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
	animation-name: spin;
	animation-iteration-count: infinite;
	animation-duration: 2s;
	animation-timing-function: ease-in-out;
	animation-delay: .5s;
}

#illustration {
	height: 150px;
	background: var(--light-gray);
	padding: 5px;
	border-radius: 2px;
}

h4 {
	color: var(--light-gray);
	text-align: center;
}

#usernameArea {
	text-align: center;
	width: 300px;
}

#autocompleteOptions {
	width: 300px;
	height: 50px;
	overflow-x: auto;
	overflow-y: hidden;
	overflow: -moz-scrollbars-horizontal;
	margin: 0 auto;
	text-align: center;
}

#autocompleteOptions > span {
	color: var(--light-gray);
}

.autocomplete-button {
	color: var(--white);
	margin: 10px;
	font-size: 1em;
	border-bottom: 1px solid var(--yellow);
}

#confirmButton {
	padding: 5px 10px;
	font-size: 1.3em;
	border-radius: 5px;
	cursor: pointer;
	border: 1px solid var(--gray);
  	display: block;
  	outline: none;
  	background: var(--yellow);
	margin: 20px auto 50px auto;
}

#confirmButton:disabled {
	opacity: .7;
	cursor: not-allowed;
}

@keyframes spin {
	from {transform: rotate(0deg);}
	to {transform: rotate(360deg);}
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
