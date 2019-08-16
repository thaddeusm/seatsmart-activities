<template>
	<div class="container">
		<header>
			<img src="@/assets/activities-circle.svg" alt="activities logo">
		</header>
		<main>
			<h2>Something is wrong.</h2>
			<h4>Please try again.</h4>
		</main>
	</div>
</template>

<script>
export default {
	name: 'Error'
}
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
	min-height: 100vh;
	display: grid;
	grid-template-rows: 1fr 1fr;
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
	padding: 5px;
}

h2 {
	color: var(--red);
}

h4 {
	margin-top: 15px;
	color: var(--light-gray);
}
</style>
