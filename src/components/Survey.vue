<template>
	<div class="container">
		<header :class="[timeLimitEnabled ? 'split-header': '']">
			<img src="@/assets/survey-illustration.svg" alt="survey illustration" id="activityIcon">
			<Countdown
				id="countdown"  
				v-if="timeLimitEnabled"
				:countdownRunning="started"
				:timeLimit="timeLimitInSeconds"
				v-on:countdown-ended="endSurvey" 
			/>
		</header>
		<main>
			<h2>
				{{ prompt }}
			</h2>
			<button 
				v-for="(choice, index) in choices" 
				:class="[chosenIndex == index ? 'selected':'' , 'choice-button']" 
				@click="markChoice(index)"
				:key="`choice${index}`"
			>
				{{ choice }}
			</button>
		</main>
		<footer>
			<button class="submit-button" @click="endSurvey">
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
			chosenIndex: null
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
		choices() {
			return this.$store.state.activityData.choices
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
		endSurvey() {
			console.log('survey ended')

			// send response to host if a real session

			if (this.mode !== 'preview') {
				if (this.mode == 'anonymously') {
					console.log('sending response')

					this.$socket.emit('sendResponseData', this.encrypt({
						choice: this.choices[this.chosenIndex]
					}))
				} else {
					console.log('sending response')

					this.$socket.emit('sendResponseData', this.encrypt({
						choice: this.choices[this.chosenIndex],
						student: this.username
					}))
				}

				// attempt to prevent multiple attempts
				this.saveToStorage()
			}

			this.$store.dispatch('setActivityComplete')

			this.$router.push('/end')
		},
		markChoice(index) {
			this.chosenIndex = index
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
	grid-template-rows: 7% 1fr 10%;
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
	max-height: 100px;
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

.choice-button {
	display: block;
	background: var(--light-gray);
	width: 90%;
	max-width: 350px;
	padding: 10px;
	margin: 10px auto;
	font-size: 1.1em;
	border: 3px solid var(--black);
	text-align: left;
}

.selected {
	border: 3px solid var(--yellow);
}

footer {
	grid-area: footer;
}

.submit-button {
	padding: 5px 10px;
	font-size: 1.3em;
	border-radius: 5px;
	cursor: pointer;
	border: 1px solid var(--gray);
	margin: 0 auto;
  	display: block;
  	outline: none;
  	background: var(--yellow);
}
</style>
