<template>
	<div class="aboutsplash" :class="darkMode ? 'dark' : 'light'">
		<div class="text-center">
			<img v-bind:src="darkMode ? require(`@/assets/img/rpc_edit_horizontal.svg`) : require(`@/assets/img/rpc_edit_horizontal_light.svg`)" style="width: 100%"  alt="" />
			<br><br>
			<p><b>Version: <a href='#' v-on:click='showChangelog' style='text-decoration: underline !important; font-weight: bold; color: inherit;'>{{aboutInfo.appver}}</a> | Node Version: {{aboutInfo.nlversion}} | Chrome Version: {{aboutInfo.chrome}} | OS: {{aboutInfo.os}}</b></p><br>
			<p><b>Technologies:</b></p>
			<p><a href="#" v-on:click="externalMethod('https://getbootstrap.com/')">Bootstrap 4</a>, <a href="#" v-on:click="externalMethod('https://vuejs.org/')">VUE.js</a>, <a href="#" v-on:click="externalMethod('https://fontawesome.com/')">Font Awesome</a>, <a href="#" v-on:click="externalMethod('https://www.electronjs.org')">Electron</a>, <a href="#" v-on:click="externalMethod('https://github.com/hypherionmc/fast-toml/')">Fast-Toml</a></p><br>
			<p><b>License: </b></p>
			<p>This app and code is licensed under the MIT license. You can read the full license <a href="#" v-on:click="externalMethod('https://github.com/hypherionmc/simple-rpc-editor/blob/master/license.md')">HERE</a></p><br>
			<p><b>Contributors:</b></p>
			<p><a href="#" v-on:click="externalMethod('https://hypherionmc.me/')">HypherionSA</a> - Main Developer/Author</p><br>
			<a href="#" class="btn btn-sm btn-outline-success" v-on:click="aboutInfo.showAbout = false">Close</a>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AboutSplash',
	props: {
		darkMode: false,
		aboutInfo: Object,
		externalMethod: Function,
		showChangelog: Function
	}
};
</script>

<style scoped>
.aboutsplash {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 5000;
}

.aboutsplash.dark {
	background: #1A2035;
	color: white;
}
.aboutsplash.light {
	background: #F0F2F5;
	color: #344767;
}
</style>
