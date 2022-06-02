<template>
	<div class="code-editor" style='vertical-align: top !important; justify-items: normal !important; align-items: normal !important; display: block;' :class="darkMode ? 'dark' : 'light'">
		<h4 id="changelog_head" class="text-center" style='width: 100%;' :class="darkMode ? 'dark' : 'light'">What's New</h4>
		<pre id="changelog" style="width: 100%; height: 95%; background: transparent !important; border: 0px;" readonly="readonly" class="w-100 form-control" :class="darkMode ? 'dark' : 'light'">
Version 3.0.1:
* Fixed Simple RPC Version 3.0.0+ configs not loading in the editor
* Added all supported variables to "dummy variables"

Version 3.0.0:
* Switched to Electron to fix previous issues of configs not loading or saving on some machines
* Portable versions are back baby! Whoooooo!

Version 2.0.5:
* Enforce discord limit of 128 chars on imageText

Version 2.0.4:
* Fix "cannot recurse directory issue"
* Upgrade Tauri to 1.0-rc

Version 2.0.3:
* Added Drag and Drop Support for Loading Files
* Replaced Buy Me A Coffee with Ko-fi
* Added support for URL based Image Keys
* Preview now shows the real app name instead of Minecraft
* You can now close and load different configs without closing the app
* Added built-in help text. Can be toggled
* Important comments are now preserved when saving the config file

Version 2.0.2 Beta:
* Fixed Code editor showing everything as [Object]

Version 2.0.1 Beta:
* Added light-theme
* Added images to image key dropdowns
* Added Copy to Clipboard function to code editor
* Improved the overall GUI
* Added support to manually enter image keys
* Added support for Server Entries Override Config File

Version 2.0.0 Beta:
* Switched to a new Framework
* New Auto Updater
		</pre>
		<a href="#" class="btn btn-outline-success" v-on:click="closeConf" style="position: absolute; bottom: 10px; right: 10px;">Done</a>
	</div>
</template>

<script>
export default {
	name: 'ChangelogSplash',
	props:{
		closeConf: Function,
		darkMode: false
	}
};
</script>

<style scoped>

</style>
