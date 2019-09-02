<template>
	<div>
		<Survey v-if="activityType == 'survey'" /> 
		<ResponsePool v-else />
	</div>
</template>

<script>
import Survey from '@/components/Survey.vue'
import ResponsePool from '@/components/ResponsePool.vue'

export default {
	name: 'Activity',
	components: {
		Survey,
		ResponsePool
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
	sockets: {
		disconnect() {
			this.$socket.emit('rejoinActivityRoom', this.room)
		},
		rejoinedActivityRoom() {
			console.log('rejoined room')
		},
		activityCanceled() {
			this.$router.push('/cancel')
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
