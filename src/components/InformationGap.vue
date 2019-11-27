<template>
	<div class="container">
		<header>
			<InformationGapIllustration width="230" id="activityIcon" />
		</header>
		<main>
			<div v-if="assignedIndex !== null">
				<h2>
					{{ prompt }}
				</h2>
			</div>
			<div v-if="assignedIndex !== null" class="resource-display-area">
				<p v-if="assignments[assignedIndex].resourceType == 'text'">
					{{ assignments[assignedIndex].resourceData }}
				</p>
				<img 
					class="resource-image"
					v-else-if="assignments[assignedIndex].resourceType == 'img'"
					:src="assignments[assignedIndex].resourceData" 
					alt="image"
				>
				<a 
					v-else
					:href="assignments[assignedIndex].resourceData"
					target="_blank" 
				>
					link
				</a>
			</div>
		</main>
		<footer>
			<!-- <button class="submit-button" @click="leaveInformationGap">
				finish
			</button> -->
		</footer>
	</div>
</template>

<script>
import sjcl from 'sjcl'

import InformationGapIllustration from '@/components/InformationGapIllustration.vue'	

export default {
	name: 'InformationGap',
	components: {
		InformationGapIllustration
	},
	props: {
		waitingForReceipt: Boolean
	},
	data() {
		return {
			assignedIndex: null,
			started: false
		}
	},
	computed: {
		prompt() {
			return this.$store.state.activityData.prompt
		},
		assignments() {
			return this.$store.state.activityData.assignments
		},
		highlight() {
			return this.username.highlight
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
		},
		assignByHighlight() {
			return this.$store.state.activityData.assignByHighlight
		}
	},
	watch: {
		waitingForReceipt(newValue, oldValue) {
			
		}
	},
	methods: {
		endInformationGap() {
			// end activity
			this.$store.dispatch('setActivityComplete')

			// attempt to prevent multiple attempts
			this.saveToStorage()

			// send response to host if a real session
			if (this.mode !== 'preview') {
				if (this.mode == 'anonymously') {
					console.log('sending response')

					this.$emit('send-response', {
						assignment: this.assignedIndex
					})
				} else {
					console.log('sending response')

					this.$emit('send-response', {
						assignment: this.assignedIndex,
						student: this.username
					})

				}
			}
		},
		leaveInformationGap() {
			this.$router.push('/end')
		},
		setAssignment() {
			if (this.mode !== 'preview') {
				if (this.assignByHighlight && this.mode !== 'anonymously') {
					this.assignedIndex = this.$store.state.activityData.assignmentsByHighlight[this.highlight]
				} else if (!this.assignmentsByHighlight && this.mode !== 'anonymously' && this.$store.state.activityData.assignmentsByStudent !== undefined) {
					this.assignedIndex = this.$store.state.activityData.assignmentsByStudent[this.username.id]
				} else {
					this.assignedIndex = Math.floor(Math.random() * this.assignments.length)
				}
			} else {
				this.assignedIndex = Math.floor(Math.random() * this.assignments.length)
			}

			let scope = this

			setTimeout(function() {
				scope.endInformationGap()
			}, 1000, scope)
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
			scope.setAssignment()
		}, 1000, scope)
	}
}
</script>

<style scoped>
.container {
	height: 100%;
	display: grid;
	grid-template-rows: auto auto auto;
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

#activityIcon {
	grid-area: activityIcon;
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

.resource-display-area {
	text-align: center;
}

p {
	background: var(--light-gray);
	padding: 10px;
	max-width: 500px;
	margin: 0 auto;
}

.resource-image {
	width: 100%;
	max-width: 320px;
}

a {
	color: var(--yellow);
	font-size: 1.5em;
}

.submit-button {
	padding: 5px 10px;
	font-size: 1.3em;
	border-radius: 5px;
	cursor: pointer;
	border: 1px solid var(--gray);
	margin: 15px auto 50px auto;
  	display: block;
  	outline: none;
  	background: var(--yellow);
}

footer {
	grid-area: footer;
}

@keyframes spin {
	from {transform: rotate(0deg);}
	to {transform: rotate(360deg);}
}
</style>
