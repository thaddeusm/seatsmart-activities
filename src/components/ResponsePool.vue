<template>
	<div class="container">
		<header :class="[timeLimitEnabled ? 'split-header': '']">
			<img src="@/assets/response-pool-illustration.svg" alt="response pool illustration" id="activityIcon">
			<Countdown
				id="countdown"  
				v-if="timeLimitEnabled"
				:countdownRunning="started"
				:timeLimit="timeLimitInSeconds"
				v-on:countdown-ended="sendResponseAndEnd" 
			/>
		</header>
		<main>
			<h2>
				{{ prompt }}
			</h2>
			<input type="text" v-model="response" :placeholder="example" @keyup.enter="handleKeyup">
		</main>
		<footer>
			<button :class="[allowMultipleResponses ? 'end-button' : 'submit-button']" @click="sendResponseAndEnd" :disabled="response == ''">
				finish
			</button>
			<button v-if="allowMultipleResponses" class="submit-button" @click="sendResponse" :disabled="response == ''">
				submit
			</button>
		</footer>
	</div>
</template>

<script>
import sjcl from 'sjcl'

import Countdown from '@/components/Countdown.vue'

export default {
	name: 'survey',
	components: {
		Countdown
	},
	data() {
		return {
			started: false,
			chosenIndex: null,
			response: ''
		}
	},
	computed: {
		timeLimitInSeconds() {
			if (this.timeLimitEnabled) {
				let minutes = parseInt(this.$store.state.activityData.timeLimit.minutes)
				let seconds = parseInt(this.$store.state.activityData.timeLimit.seconds)

				if (minutes > 0) {
					let minutesToSeconds = minutes * 60
					return minutesToSeconds + seconds
				} else {
					return seconds
				}
			} else {
				return undefined
			}
		},
		timeLimitEnabled() {
			return this.$store.state.activityData.timeLimit.enabled || false
		},
		prompt() {
			return this.$store.state.activityData.prompt
		},
		example() {
			return this.$store.state.activityData.example
		},
		allowMultipleResponses() {
			return this.$store.state.activityData.allowMultipleResponses
		},
		roomID() {
			return this.$store.state.roomID
		},
		mode() {
			return this.$store.state.mode
		},
		date() {
			return this.$store.state.activityDate
		},
		username() {
			return this.$store.state.username
		}
	},
	methods: {
		sendResponse() {
			// send response to host if a real session
			if (this.mode !== 'preview') {
				if (this.mode == 'anonymously') {
					console.log('sending response')

					this.$socket.emit('sendResponseData', this.encrypt({
						response: this.response
					}))
				} else {
					console.log('sending response')

					this.$socket.emit('sendResponseData', this.encrypt({
						response: this.response,
						student: this.username
					}))
				}
			}

			this.response = ''
		},
		sendResponseAndEnd() {
			this.sendResponse()

			console.log('response pool ended')

			this.$store.dispatch('setActivityComplete')

			this.$router.push('/end')

			// attempt to prevent multiple attempts
			this.saveToStorage()
		},
		handleKeyup() {
			if (this.allowMultipleResponses) {
				this.sendResponse()
			} else {
				this.sendResponseAndEnd()
			}
		},
		saveToStorage() {
    		localStorage.setItem(this.roomID, JSON.stringify({completed: true, date: this.date}))
    	},
    	encrypt(data) {
            return sjcl.encrypt(this.roomID, JSON.stringify(data))
        }
	},
	created() {
		let scope = this

		setTimeout(function() {
			scope.started = true
		}, 1000, scope)
	}
}
</script>

<style scoped>
.container {
	display: grid;
	width: 100%;
	height: 100vh;
	grid-template-rows: 20% 1fr 25%;
	grid-template-areas: 
		"header"
		"main"
		"footer";
	align-items: center;
}

header {
	grid-area: header;
	background: var(--light-gray);
}

.split-header {
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-areas: "activityIcon countdown";
	align-items: center;
	justify-content: center;
}

#activityIcon {
	grid-area: activityIcon;
	height: 100%;
}

#countdown {
	grid-area: countdown;
	color: var(--black);
	text-align: center;
}

main {
	grid-area: main;
}

h2 {
	color: var(--white);
	text-align: center;
	margin: 50px auto 30px auto;
	padding: 0 10px;
}

input[type=text] {
	display: block;
	margin: 0 auto;
	width: 90%;
	max-width: 250px;
}

footer {
	grid-area: footer;
	text-align: center;
}

.submit-button {
	padding: 5px 10px;
	font-size: 1.3em;
	border-radius: 5px;
	cursor: pointer;
	border: 1px solid var(--gray);
	margin: 0 10px;
  	outline: none;
  	background: var(--yellow);
}

.end-button {
	padding: 5px 10px;
	font-size: 1.3em;
	border-radius: 5px;
	cursor: pointer;
	border: 1px solid var(--gray);
	margin: 0 10px;
  	outline: none;
  	background: var(--light-gray);
}
</style>
