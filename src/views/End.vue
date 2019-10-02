<template>
	<div class="container">
		<header>
			<img v-if="activityType == 'survey'" src="@/assets/survey-illustration.svg" alt="survey illustration">
			<img v-else src="@/assets/response-pool-illustration.svg" alt="response pool illustration">
		</header>
		<main>
			<h2>{{ activityType }} complete</h2>
		</main>
	</div>
</template>

<script>
export default {
	name: 'End',
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
