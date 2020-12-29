<template>
	<div class="container">
		<header :class="[timeLimitEnabled ? 'split-header': '']">
			<ResponsePoolIllustration width="230" id="activityIcon" />
		</header>
		<main>
			<div v-if="waitingForReceipt" id="loader">
				<img ref="logo"src="@/assets/activities-circle.svg" alt="activities logo" id="logo" key="logo">
			</div>
			<div v-else>
				<h2>
					{{ prompt }}
				</h2>
				<textarea v-model="response" :placeholder="example" @keyup.enter="handleKeyup" ref="input"></textarea>
			</div>
		</main>
		<footer v-if="!waitingForReceipt">
			<button :class="[allowMultipleResponses ? 'end-button' : 'submit-button']" @click="sendResponseAndEnd" :disabled="response == ''">
				finish
			</button>
			<button v-if="allowMultipleResponses" class="submit-button" @click="sendResponse" :disabled="response == ''">
				submit
			</button>
		</footer>
		<footer v-else>
			<button class="submit-button" @click="$emit('retry')">
				retry
			</button>
		</footer>
	</div>
</template>

<script>
import ResponsePoolIllustration from '@/components/ResponsePoolIllustration.vue'

export default {
	name: 'ResponsePool',
	components: {
		ResponsePoolIllustration
	},
	props: {
		waitingForReceipt: Boolean
	},
	data() {
		return {
			started: false,
			chosenIndex: null,
			response: '',
			end: false
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
	watch: {
		waitingForReceipt(newValue, oldValue) {
			if (newValue == false && this.end) {
				this.endResponsePool()
			} else if (newValue == false) {
				let scope = this

				setTimeout(function() {
					scope.$refs.input.focus()
				}, 1000, scope)
			}
		}
	},
	methods: {
		sendResponse() {
			// send response to host if a real session
			if (this.mode !== 'preview') {
				if (this.mode == 'anonymously') {
					console.log('sending response')

					this.$emit('send-response', {
						response: this.response
					})
				} else {
					console.log('sending response')

					this.$emit('send-response', {
						response: this.response,
						student: this.username
					})
				}
			}

			this.response = ''
		},
		sendResponseAndEnd() {
			this.sendResponse()
			this.end = true
		},
		endResponsePool() {
			// end activity
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
	height: 100%;
	display: grid;
	grid-template-rows: auto 70% auto;
	grid-template-areas: 
		"header"
		"main"
		"footer";
	align-items: center;
}

header {
	grid-area: header;
	background: var(--light-gray);
	text-align: center;
}

.split-header {
	display: grid;
	grid-template-columns: 1fr 30%;
	grid-template-areas: "activityIcon countdown";
	align-items: center;
	justify-content: center;
}

#activityIcon {
	grid-area: activityIcon;
}

#countdown {
	grid-area: countdown;
	color: var(--black);
	text-align: center;
}

#loader {
	text-align: center;
}

#logo {
	height: 5em;
	animation-name: spin;
	animation-iteration-count: infinite;
	animation-duration: 2s;
	animation-timing-function: ease-in-out;
	animation-delay: .5s;
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

textarea {
	display: block;
	margin: 0 auto;
	width: 90%;
	max-width: 250px;
	height: 150px;
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
	margin: 15px 10px;
  	outline: none;
  	background: var(--yellow);
}

.end-button {
	padding: 5px 10px;
	font-size: 1.3em;
	border-radius: 5px;
	cursor: pointer;
	border: 1px solid var(--gray);
	margin: 15px 10px;
  	outline: none;
  	background: var(--light-gray);
}

@keyframes spin {
	from {transform: rotate(0deg);}
	to {transform: rotate(360deg);}
}
</style>
