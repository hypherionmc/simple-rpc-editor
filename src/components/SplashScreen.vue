<template>
	<div class="splashscreen" :class="darkMode ? 'dark' : 'light'">
		<div class="text-center">
			<img v-bind:src="darkMode ? require(`@/assets/img/rpc_edit_horizontal.svg`) : require(`@/assets/img/rpc_edit_horizontal_light.svg`)" style="width: 100%"  alt="" />
			<br><br>
			<h4 data-text="Loading..." class="loading-animation" :class="darkMode ? 'dark' : 'light'">Loading...</h4>
			<br>
		</div>
	</div>
</template>

<script>
import $ from 'jquery';

export default {
	name: 'SplashScreen',
	created() {
		setTimeout(async function() {
			$(".splashscreen").fadeOut("slow", function () {
				$(".splashscreen").hide();
			});
		}, 4000);
	},
	props: {
		darkMode: false
	}
};
</script>

<style scoped>
	.splashscreen {
		width: 100vw;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
	}

	.splashscreen.dark {
		background: #1A2035;
		color: white;
	}
	.splashscreen.light {
		background: #F0F2F5;
		color: #344767;
	}

	.loading-animation {
		position: relative;
		color: rgba(0, 0, 0, .3);
		font-size: 3em;
	}
  .loading-animation.dark {
    color: rgba(255, 255, 255, .3);
  }

	.loading-animation:before {
		content: attr(data-text);
		position: absolute;
		overflow: hidden;
		max-width: 7em;
		white-space: nowrap;
		animation: loading 5s linear;
	}
	@keyframes loading {
		0% {
			max-width: 0;
		}
	}
</style>
