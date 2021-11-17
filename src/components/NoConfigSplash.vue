<template>
	<div class="noconfigsplash" :class="darkMode ? 'dark' : 'light'">
		<div class="text-center">
			<img v-bind:src="darkMode ? require(`@/assets/img/rpc_edit_horizontal.svg`) : require(`@/assets/img/rpc_edit_horizontal_light.svg`)" style="width: 100%"  alt="" />
			<br><br>
			<p><b>Please choose a config file to get started</b></p>
			<a href="#" v-on:click="configMethod" class="btn btn-outline-info btn-sm">Load Config</a>
			<br><br>
			<p class="text-danger">{{configError}}</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'NoConfigSplash',
	data() {
		return {
			configError: ''
		}
	},
	props: {
		darkMode: false,
		configMethod: null
	}
};
</script>

<style scoped>
	.noconfigsplash {
		width: 100vw;
		height: 100vh;
		color: white;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 5000;
		position: fixed;
		top: 0;
		left: 0;
	}

	.noconfigsplash.dark {
		background: #1A2035;
		color: white;
	}
	.noconfigsplash.light {
		background: #F0F2F5;
		color: #344767;
	}
</style>
