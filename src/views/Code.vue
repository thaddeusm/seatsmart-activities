<template>
	<main>
		<h2>
			{{ instructions }}
		</h2>
		<section>
			<input 
				ref="first"
				id="first" 
				type="number" 
				min="0"
				max="9" 
				required 
				v-model="first" 
				@keyup="moveInput"
			>
			<input 
				ref="second" 
				type="number" 
				id="second" 
				min="0" 
				max="9" 
				required 
				v-model="second" 
				@keyup="moveInput"
			>
			<input 
				ref="third" 
				id="third" 
				type="number" 
				min="0" 
				max="9" 
				required 
				v-model="third" 
				@keyup="moveInput"
			>
			<input 
				ref="fourth" 
				id="fourth" 
				type="number" 
				min="0" 
				max="9" 
				required 
				v-model="fourth"
				@keyup="moveInput"
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
			first: '',
			second: '',
			third: '',
			fourth: ''
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
		moveInput(e) {
			let pressedKey = e.key

			let el = e.srcElement.id
			let destination
			let previous

			switch (el) {
				case 'first':
					destination = 'second'
					previous = 'first'
					break
				case 'second':
					destination = 'third'
					previous = 'first'
					break
				case 'third':
					destination = 'fourth'
					previous = 'second'
					break
				case 'fourth':
					destination = 'fourth'
					previous = 'third'
					break
			}

			if (pressedKey == 'Delete' || pressedKey == 'Backspace') {
				// handle delete
			} else if (this.$refs[el].value !== '') {
				this.$refs[destination].focus()
			}

			this.checkModels()

		},
		checkModels() {
			if (this.first.length > 1) {
				this.first = this.first[0]
			}

			if (this.second.length > 1) {
				this.second = this.second[0]
			}

			if (this.third.length > 1) {
				this.third = this.third[0]
			}

			if (this.fourth.length > 1) {
				this.fourth = this.fourth[0]
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
	height: 100%;
	display: grid;
	justify-content: center;
	align-items: center;
	text-align: center;
	grid-template-rows: 30% 70%;
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