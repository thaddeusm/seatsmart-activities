<template>
	<div class="container">
		<header>
			<SurveyIllustration width="280" v-if="activityType == 'survey'" id="illustration" />
			<ResponsePoolIllustration width="280" v-else-if="activityType == 'response pool'" id="illustration" />
			<InformationGapIllustration width="280" v-else id="illustration" />
		</header>
		<main>
			<h2>{{ activityType }} closed</h2>
		</main>
	</div>
</template>

<script>
import SurveyIllustration from '@/components/SurveyIllustration.vue'
import ResponsePoolIllustration from '@/components/ResponsePoolIllustration.vue'
import InformationGapIllustration from '@/components/InformationGapIllustration.vue'

export default {
	name: 'Cancel',
	components: {
		SurveyIllustration,
		ResponsePoolIllustration,
		InformationGapIllustration
	},
	computed: {
		activityType() {
			return this.$store.state.activityType
		}
	},
	methods: {
		resetStore() {
			this.$store.dispatch('resetStore')
		},
		routeToCodeView() {
			let scope = this

			setTimeout(function() {
				scope.$router.push('/code')
			}, 3000, scope)
		}
	},
	mounted() {
		this.resetStore()
		this.routeToCodeView()
	}
}
</script>

<style scoped>
.container {
	height: 100%;
	display: grid;
	grid-template-rows: 50% 50%;
	grid-template-areas: 
		"header"
		"main";
	justify-content: center;
	text-align: center;
}

header {
	grid-area: header;
	align-self: center;
}

#illustration {
	background: var(--light-gray);
	padding: 5px;
	border-radius: 2px;
}

main {
	grid-area: main;
	align-self: flex-start;
}

img {
	height: 150px;
	display: block;
	margin: 0 auto;
	background: var(--light-gray);
	padding: 5px;
	border-radius: 2px;
}

h2 {
	color: var(--light-gray);
}
</style>
