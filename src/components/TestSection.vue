<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
		<input v-model='msg' v-on:change='updateParent'/>
  </div>
</template>

<script>
export default {
  name: "TestSection",
  data: function() {
  	return {
			msg: "Ey",
		}
	},
	methods: {
  	updateParent: function(va) {
			this.$emit('msgChanged', va);
		}
	}
};
</script>

<style>
	.hello {
		position: absolute;
		top: 80px;
		left: 120px;
	}
</style>
