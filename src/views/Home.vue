<template>
	<div class="container">
		<header>
			<transition name="fade" mode="out-in">
				<ActivitiesCircle size="120" v-if="loading" id="logo" />
				<SurveyIllustration width="280" v-else-if="activityType == 'survey'" id="illustration" />
				<ResponsePoolIllustration width="280" v-else-if="activityType == 'response pool'" id="illustration" />
				<InformationGapIllustration width="280" v-else-if="activityType == 'information gap'" id="illustration" />
			</transition>
		</header>
		<main>
			<section id="autocompleteOptions" v-if="!nameConfirmed">
				<button 
					class="autocomplete-button" 
					v-for="(student, index) in possibleNames" 
					@click="setName(student)" 
					v-if="!showSelector"
				>
					{{ student.shortName }}
				</button>
				<button 
					v-if="possibleNames.length == 2" 
					@click="showSelector = true"
					id="showSelectorButton"
				>
					...
				</button>
				<select 
					id="autoCompleteOptionsSelector" 
					v-if="showSelector"
					v-model="selectedName"
				>
					<option value="" disabled>Find your name:</option>
					<option v-for="(student, index) in possibleNames" :value="student">
						{{ student.shortName }}
					</option>
				</select>
			</section>
			<section id="usernameArea" v-if="!loading && mode !== 'anonymously' && !nameConfirmed">
				<input v-if="!showSelector" type="text" v-model="username" placeholder="Search for your name...">
				<button id="confirmButton" @click="confirmName" :disabled="selectedName.shortName == ''">Connect</button>
			</section>
			<h4 v-if="!loading && nameConfirmed || mode == 'anonymously'">Waiting for activity to begin...</h4>
		</main>
	</div>
</template>

<script>
import sjcl from 'sjcl'
import ActivitiesCircle from '@/components/ActivitiesCircle.vue'
import SurveyIllustration from '@/components/SurveyIllustration.vue'
import ResponsePoolIllustration from '@/components/ResponsePoolIllustration.vue'
import InformationGapIllustration from '@/components/InformationGapIllustration.vue'

export default {
	name: 'Home',
	props: {
		room: String
	},
	components: {
		ActivitiesCircle,
		SurveyIllustration,
		ResponsePoolIllustration,
		InformationGapIllustration
	},
	data() {
		return {
			username: '',
			selectedName: {
				shortName: '',
				fullName: {},
				id: '',
				highlight: ''
			},
			nameConfirmed: false,
			showSelector: false
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
		students() {
			return this.$store.state.students
		},
		possibleNames() {
			let allNames = this.students

			let filteredNames = allNames.filter(student => {
				return student.firstName.toLowerCase().includes(this.username.toLowerCase())
			})

			let arr = filteredNames.map(student => {
				if (student.highlight) {
					return {
						shortName:`${student.firstName} ${student.lastName[0]}${student.lastName[1]}.`,
						fullName: student,
						id: student.id,
						highlight: student.highlight
					}
				} else {
					return {
						shortName:`${student.firstName} ${student.lastName[0]}${student.lastName[1]}.`,
						fullName: student,
						id: student.id,
						highlight: '#E5E5E5'
					}
				}
			})

			if (!this.showSelector) {
				if (arr.length > 2) {
					return arr.splice(0, 2)
				} else {
					return arr
				}
			} else {
				return arr
			}
		}
	},
	sockets: {
		roomJoined() {
			this.$store.dispatch('setRoomJoined')

			this.$socket.emit('requestActivityData')
			this.$socket.emit('checkActivityStatus', this.room)
		},
		incomingActivityData(data) {
			let decrypted = this.decrypt(data)

			this.$store.dispatch('setActivityData', decrypted)

			if (this.mode == 'preview') {
				this.startActivity()
			}

			let scope = this

			setTimeout(function() {
				scope.checkForStoredUserInfo()
			}, 1000, scope)
		},
		allowActivityStart() {
			if (this.mode !== 'anonymously') {
				if (this.nameConfirmed) {
					this.startActivity()
				}
			} else {
				this.startActivity()
			}
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
    		this.saveUserInfoToStorage()
    	},
    	checkForStoredUserInfo() {
    		let students = this.possibleNames

    		for (let i=0; i<students.length; i++) {
    			let student = students[i].id
    			let userInfo = localStorage.getItem(student)

    			if (userInfo !== null) {
	    			let parsed = JSON.parse(userInfo)

	    			console.log('Found student record in localStorage: ', parsed)
	    			// ensure that most recent student info is used
	    			this.setName(students[i])
	    			break
	    		}
    		}
    	},
    	saveUserInfoToStorage() {
    		localStorage.setItem(this.selectedName.id, JSON.stringify(this.selectedName))
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
	height: 100%;
	display: grid;
	grid-template-rows: 40% 60%;
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

#illustration {
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
	width: 320px;
}

#autocompleteOptions {
	width: 320px;
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

#showSelectorButton {
	color: var(--white);
	margin: 10px;
	font-size: 1em;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
