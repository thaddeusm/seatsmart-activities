<template>
	<div>
		<Survey 
			v-if="activityType == 'survey'" 
			v-on:send-response="sendResponse"
			:waitingForReceipt="pendingResponse !== null"
		/> 
		<ResponsePool 
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

export default {
	name: 'Activity',
	components: {
		Survey,
		ResponsePool
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

			console.log(obj)

			this.$socket.emit('sendResponseData', this.encrypt(obj))
			this.pendingResponse = obj
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
			this.$socket.emit('rejoinActivityRoom', this.room)
		},
		rejoinedActivityRoom() {
			console.log('rejoined room')

			// try to resend pending response
			if (this.pendingResponse !== null) {
				this.$socket.emit('sendResponseData', this.encrypt(this.pendingResponse))
			}
		},
		activityCanceled() {
			this.$router.push('/cancel')
		},
		responseReceiptConfirmed(encryptedResponse) {
			let decrypted = this.decrypt(encryptedResponse)

			if (decrypted == this.pendingResponse.id) {
				this.pendingResponse = null
			}
		}
	},
	mounted() {
		if (this.activityComplete) {
			this.$router.push('/end')
		}
	}
}
</script>

<style scoped>

</style>
