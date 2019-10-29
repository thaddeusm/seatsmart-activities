<template>
	<div class="container">
		<header>
			<ActivitiesCircle size="120" id="logo" />
		</header>
		<main>
			<h2>Something is wrong.</h2>
			<h4>Please try again.</h4>
		</main>
	</div>
</template>

<script>
import ActivitiesCircle from '@/components/ActivitiesCircle.vue'

export default {
	name: 'Error',
	components: {
		ActivitiesCircle
	}
}
</script>

<style scoped>
.container {
	height: 100%;
	display: grid;
	grid-template-rows: 40% 60%;
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

#logo {
	display: block;
	margin: 0 auto;
}

h2 {
	color: var(--red);
}

h4 {
	margin-top: 15px;
	color: var(--light-gray);
}
</style>
