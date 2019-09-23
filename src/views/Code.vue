<template>
	<main>
		<h2>
			{{ instructions }}
		</h2>
		<section>
			<input 
				ref="first" 
				type="number" 
				min="0" 
				max="9" 
				required 
				v-model="first" 
				@keyup="moveInput('first', 'second')"
			>
			<input 
				ref="second" 
				type="number" 
				min="0" 
				max="9" 
				required 
				v-model="second" 
				@keyup="moveInput('second', 'third')"
			>
			<input 
				ref="third" 
				type="number" 
				min="0" 
				max="9" 
				required 
				v-model="third" 
				@keyup="moveInput('third', 'fourth')"
			>
			<input 
				ref="fourth" 
				type="number" 
				min="0" 
				max="9" 
				required 
				v-model="fourth"
				@keyup.enter="startRoomEntry" 
			>
			<button @click="startRoomEntry">connect</button>
		</section>
	</main>
</template>

<script>
export default {
	name: 'Code',
	data() {
		return {
			instructions: 'Enter the 4-digit code.',
			first: null,
			second: null,
			third: null,
			fourth: null
		}
	},
	methods: {
		startRoomEntry() {
			if (this.inputsComplete() == true) {
				let roomNumber = this.first + '' + this.second + '' + this.third + this.fourth

				this.$router.push(`/?room=${roomNumber}`)
			}
		},
		inputsComplete() {
			if (this.first !== null && this.second !== null && this.third !== null && this.fourth !== null) {
				return true
			} else {
				this.instructions = 'Please try again.'
				return false
			}
		},
		moveInput(from, to) {
			if (this.$refs[from].value !== '' && this.$refs[from].value !== ' ') {
				this.$refs[to].focus()
			}
		}
	},
	mounted() {
		this.$refs['first'].focus()
	}
}
</script>

<style scoped>
main {
	width: 100vw;
	height: 100vh;
	display: grid;
	justify-content: center;
	align-items: center;
	text-align: center;
	grid-template-rows: 30% 1fr;
	grid-template-areas: 
		"instructions"
		"form";
}

h2 {
	color: var(--light-gray);
	display: block;
	vertical-align: middle;
	text-align: center;
	grid-area: instructions;
}

button {
	padding: 5px 10px;
	background: var(--yellow);
	color: var(--black);
	font-size: 20px;
	border-radius: 5px;
	cursor: pointer;
	outline: none;
	display: block;
	margin: 20px auto;
}

section {
	text-align: center;
	grid-area: form;
	align-self: flex-start;
}

input {
	border-radius: 4px;
	font-size: 24px;
	padding: 7px 5px 7px 10px;
	margin: 20px 5px;
	width: 35px;
	color: var(--black);
	border: 2px solid var(--light-gray);
	outline: none;
	vertical-align: middle;
}
</style>