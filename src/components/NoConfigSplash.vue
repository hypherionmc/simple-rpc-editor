<template>
	<div class="noconfigsplash" :class="darkMode ? 'dark' : 'light'" id="dragdrop">
		<div class="text-center">
			<img v-bind:src="darkMode ? require(`@/assets/img/rpc_edit_horizontal.svg`) : require(`@/assets/img/rpc_edit_horizontal_light.svg`)" style="width: 100%"  alt="" />
			<br><br>
			<p><b>Please choose a config file, or drag and drop a file here to get started</b></p>
			<a href="#" v-on:click="configMethod(null)" class="btn btn-outline-info btn-sm">Load Config</a>
			<br><br>
			<p class="text-danger">{{configError}}</p>
		</div>
	</div>
</template>

<script>
//import { listen } from '@tauri-apps/api/event';
import $ from 'jquery';

export default {
	name: 'NoConfigSplash',
	data() {
		return {
			configError: '',
		}
	},
  created() {
    var appRef = this;
    /*listen("tauri://file-drop", event => {
      appRef.configMethod(event.payload[0])
    });*/
    document.body.addEventListener('dragover', evt => {
      evt.preventDefault();
    })
    document.body.addEventListener('drop', evt => {
      evt.preventDefault();
      appRef.configMethod(evt.dataTransfer.files[0].path);
    })
  },
  mounted() {

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
