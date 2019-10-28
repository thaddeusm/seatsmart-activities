<template>
	<div class="container">
		<header>
			<SurveyIllustration width="280" v-if="activityType == 'survey'" id="illustration" />
			<ResponsePoolIllustration width="280" v-else id="illustration" />
		</header>
		<main>
			<h2>{{ activityType }} complete</h2>
		</main>
	</div>
</template>

<script>
import SurveyIllustration from '@/components/SurveyIllustration.vue'
import ResponsePoolIllustration from '@/components/ResponsePoolIllustration.vue'

export default {
	name: 'End',
	components: {
		SurveyIllustration,
		ResponsePoolIllustration
	},
	computed: {
		activityType() {
			return this.$store.state.activityType
		}
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
