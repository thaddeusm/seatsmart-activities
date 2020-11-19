<template>
	<div>
		<Survey 
			v-if="activityType == 'survey'" 
			v-on:send-response="sendResponse"
			:waitingForReceipt="pendingResponse !== null"
		/> 
		<ResponsePool 
			v-else-if="activityType == 'response pool'"
			v-on:send-response="sendResponse"
			v-on:retry="retrySendResponse"
			:waitingForReceipt="pendingResponse !== null"
		/>
		<ResponsePool 
			v-else-if="activityType == 'word cloud'"
			v-on:send-response="sendResponse"
			v-on:retry="retrySendResponse"
			:waitingForReceipt="pendingResponse !== null"
		/>
		<InformationGap 
			v-else
			v-on:send-response="sendResponse"
			:waitingForReceipt="pendingResponse !== null"
		/>
	</div>
</template>

<script>
import sjcl from 'sjcl'
import simpleId from 'simple-id'

import Survey from '@/components/Survey.vue'
import ResponsePool from '@/components/ResponsePool.vue'
import InformationGap from '@/components/InformationGap.vue'
import WordCloud from '@/components/WordCloud.vue'

export default {
	name: 'Activity',
	components: {
		Survey,
		ResponsePool,
		InformationGap,
		WordCloud
	},
	data() {
		return {
			pendingResponse: null
		}
	},
	computed: {
		activityType() {
			return this.$store.state.activityType
		},
		room() {
			return this.$store.state.roomID
		},
		activityComplete() {
			return this.$store.state.activityComplete
		}
	},
	methods: {
		sendResponse(response) {
			let id = simpleId()

			let obj = {
				...response,
				id: id
			}

			this.$socket.emit('sendResponseData', this.encrypt(obj))
			this.pendingResponse = obj
		},
		retrySendResponse() {
			// try to resend pending response
			if (this.pendingResponse !== null) {
				this.$socket.emit('sendResponseData', this.encrypt(this.pendingResponse))
			}
		},
		encrypt(data) {
            return sjcl.encrypt(this.room, JSON.stringify(data))
        },
        decrypt(data) {
            let decrypted = sjcl.decrypt(this.room, data)

            return JSON.parse(decrypted)
        },
	},
	sockets: {
		disconnect() {
			
		},
		reconnect() {
			this.$socket.emit('rejoinActivityRoom', this.room)
		},
		rejoinedActivityRoom() {
			this.retrySendResponse()
		},
		activityCanceled() {
			if (this.activityType !== 'information gap') {
				this.$router.push('/cancel')
			}
		},
		responseReceiptConfirmed() {
			console.log('Server received response')
			this.pendingResponse = null
		}
	},
	mounted() {
		if (this.activityComplete && this.activityType !== 'information gap') {
			this.$router.push('/end')
		}
	}
}
</script>

<style scoped>

</style>
