<template>
    <div id="app">    
        <router-view/>
    </div>
</template>

<script>

</script>

<style>
* {
    margin: 0;
    padding: 0;
}

/* inspired by FHSU colors */
:root {
    --yellow: #FCBB04;
    --red: #D2360A;
    --black: #000000;
    --dark-gray: #040404;
    --gray: #6C6C6C;
    --light-gray: #E5E5E5;
    --white: #FFFFFF;
    --vh: 1vh;
}

/* custom text highlight color */
::selection {
    background: var(--yellow);
}

html, body, #app {
    width: 100%;
    height: 100%;
    background: var(--black);
}

h1 {
    font-family: "ArchivoNarrow";
    font-weight: 400;
    font-size: 2em;
}

h2 {
    font-family: "ArchivoNarrow";
    font-weight: 400;
    font-size: 1.7em;
}

h3 {
    font-family: "ArchivoNarrow";
    font-weight: 500;
    font-size: 1.5em;
}

h4 {
    font-family: "ArchivoNarrow";
    font-weight: 400;
    font-size: 1.3em;
}

h5 {
    font-family: "ArchivoNarrow";
    font-weight: 400;
    font-size: 1.2em;
}

h6 {
    font-family: "ArchivoNarrow";
    font-weight: 400;
    font-size: 1.1em;
}

p {
    font-family: "ArchivoNarrow";
    font-size: 1em;
    line-height: 1.5;
}

span {
    font-family: "ArchivoNarrow";
}

li {
    font-family: "ArchivoNarrow";
}

input[type=text], input[type=button] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    -webkit-border-radius: none;
    outline: none;
    border: none;
    font-family: "ArchivoNarrow";
}

input[type=text], textarea {
	border-radius: 4px;
	font-size: 1.3em;
	padding: 7px 10px;
	color: var(--black);
	border: 1px solid var(--light-gray);
	outline: none;
}

*:focus {
    outline: 0 !important;
}

button {
    -webkit-appearance: none;
    -moz-appearance: none;
    -webkit-border-radius: none;
    border: none;
    background: none;
    font-family: "ArchivoNarrow";
    outline: none;
    cursor: pointer;
}

a {
    font-family: "ArchivoNarrow";
}

img {
}

input {
    font-family: "ArchivoNarrow";
}

textarea {
    font-family: "ArchivoNarrow";
}

select {
    -webkit-appearance: none;
    border-radius: 4px;
    font-size: 15px;
    min-width: 50px;
    padding: 8px 20px 8px 10px;
    margin: 10px 10px;
    color: var(--black);
    background: var(--white);
    border: 1px solid var(--light-gray);
    outline: none;
    font-family: "ArchivoNarrow";
    background-image: url("~@/assets/select.svg");
    background-repeat: no-repeat;
    background-position: center right 5px;
    background-size: 15px;
    cursor: pointer;
}

body {
    font-family: "ArchivoNarrow";
}

#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-overflow-scrolling: touch;
}
</style>
