import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		roomID: '',
		roomJoined: false,
		activityType: '',
		activityData: '',
		activityDate: {},
		mode: 'anonymously',
		activityComplete: false,
		students: [],
		username: {
			firstName: '',
			lastName: '',
			id: '',
			highlight: ''
		}
	},
	mutations: {
		setRoomID(state, roomID) {
			state.roomID = roomID
		},
		setRoomJoined(state) {
			state.roomJoined = true
		},
		setActivityData(state, data) {
			if (state.activityData == '') {
				state.activityType = data.activityType
				state.activityData = data.activityData
				state.mode = data.activityMode
				state.activityDate = data.activityDate.split('T')[0]
				if (data.students) {
					state.students = data.students
				}
			}
		},
		setActivityComplete(state) {
			state.activityComplete = true
		},
		setUsername(state, studentName) {
			state.username = studentName.fullName
		},
		resetStore(state) {
			state.roomID = ''
			state.roomJoined = false
			state.activityType = ''
			state.activityData = ''
			state.activityDate = {}
			state.mode = 'anonymously'
			state.activityComplete = false
			state.students = []
			state.username = {
				state.firstName: ''
				state.lastName: ''
				state.id: ''
				highlight: ''
			}
		}
	},
	actions: {
		setRoomID(context, roomID) {
			context.commit('setRoomID', roomID)
		},
		setRoomJoined(context) {
			context.commit('setRoomJoined')
		},
		setActivityData(context, data) {
			context.commit('setActivityData', data)
		},
		setActivityComplete(context) {
			context.commit('setActivityComplete')
		},
		setUsername(context, studentName) {
			context.commit('setUsername', studentName)
		},
		resetStore(context) {
			context.commit('resetStore')
		}
	}
})
