import { shell, app, window } from '@tauri-apps/api';
import TauriLogger from './TauriLogger';
import $ from "jquery";

const AppFunctions = {

	setWindowTitle: async function() {
		await window.getCurrent().setTitle("Simple RPC Editor - " + await app.getVersion())
	},
	openExternal: async function(urlToOpen) {
		await shell.open(urlToOpen);
	},

	loadSettings: function(appRef) {
		appRef.appSettings.showPreview = localStorage.getItem("showpreview") === 'true';
		appRef.appSettings.showChangelog = localStorage.getItem("showcl") === 'true';
		appRef.appSettings.lastInternalVer = parseInt(localStorage.getItem("internalver"));
		if (localStorage.getItem("darkmode") !== null) {
			appRef.darkMode = localStorage.getItem("darkmode") === 'true';
		}
	},
	saveSettings: function(appRef) {
		localStorage.setItem("showpreview", appRef.appSettings.showPreview.toString());
		localStorage.setItem("showcl", appRef.appSettings.showChangelog.toString());
		localStorage.setItem("internalver", appRef.appSettings.internalVer.toString());
		localStorage.setItem("darkmode", appRef.darkMode.toString());
	},

	initLogger: function() {
		TauriLogger.init('simple-rpc', true).then(r => {});
	},
	logData: async function(type, data) {
		await TauriLogger.log(type, data);
		console.log(data);
	},

	showToast: function(appRef, title, body, type) {
		appRef.$toast.open({
			message: body,
			type: type,
			position: 'top-right',
			duration: 5000
		})
	},

	updateRPC: function (appRef, sec) {

		if (appRef.configData.new[sec] != null) {
			let dat;

			if (sec !== "general" && sec !== "world_images" && sec !== "dimension_overrides") {
				dat = appRef.configData.new[sec].enabled ? appRef.configData.new[sec] : appRef.configData.new.generic;
			} else {
				dat = appRef.configData.new.generic;
			}

			$(".rpcDescription").text(this.dummyVars(dat.description)).attr("title", this.dummyVars(dat.description));
			$(".rpcState").text(this.dummyVars(dat.state)).attr("title", this.dummyVars(dat.state));

			if (dat.buttons[0] != null) {
				var buttonHTML = `<a id="rpcButton1" class="disabled btn btn-outline-primary text-white" style="border-color: white; position: absolute; top: 140px; left: 20px; width: 280px;" href="${dat.buttons[0].url}">${dat.buttons[0].label}</a>`;
				if (dat.buttons[1] != null) {
					buttonHTML += `<a id="rpcButton2" class="disabled btn btn-outline-primary text-white" style="border-color: white; position: absolute; top: 190px; left: 20px; width: 280px;" href="${dat.buttons[1].url}">${dat.buttons[1].label}</a>`;
				}
				$(".rpcButtonContainer").html(buttonHTML);
			} else {
				$(".rpcButtonContainer").html("");
			}

			var assetID = appRef.configData.appAssets.filter(c => c.name === appRef.configData.new[sec].largeImageKey);
			if (assetID[0] !== undefined && assetID[0].hasOwnProperty("id")) {
				$("#rpcLargeImage")
					.css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.new.general.clientID + "/" + assetID[0].id + ".png)")
					.css("background-size", "100% 100%")
					.attr("title", this.dummyVars(dat.largeImageText));
			} else if (appRef.configData.new[sec].largeImageKey.startsWith("http")) {
				$("#rpcLargeImage")
					.css("background", "url(" + appRef.configData.new[sec].largeImageKey + ")")
					.css("background-size", "100% 100%")
					.attr("title", this.dummyVars(dat.largeImageText));
			}

			var assetIDSmall = appRef.configData.appAssets.filter(c => c.name === appRef.configData.new[sec].smallImageKey);
			if (assetIDSmall[0] !== undefined && assetIDSmall[0].hasOwnProperty("id")) {
				$("#rpcSmallImage")
					.css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.new.general.clientID + "/" + assetIDSmall[0].id + ".png)")
					.css("background-size", "100% 100%")
					.attr("title", this.dummyVars(dat.smallImageText));
			} else if (appRef.configData.new[sec].smallImageKey.startsWith("http")) {
				$("#rpcSmallImage")
					.css("background", "url(" + appRef.configData.new[sec].smallImageKey + ")")
					.css("background-size", "100% 100%")
					.attr("title", this.dummyVars(dat.smallImageText));
			}

		}

	},

	dummyVars: function (inputText) {

		inputText = inputText.replace("%player%", "Dummy Player");
		inputText = inputText.replace("%world%", "The Overworld");
		inputText = inputText.replace("%mods%", Math.floor(Math.random() * 300) + 1);
		inputText = inputText.replace("%difficulty%", "Easy");
		inputText = inputText.replace("%position%", "x: 102 y: 52 z: 80");
		inputText = inputText.replace("%biome%", "Plains");
		inputText = inputText.replace("%mcver%", "1.17.1");
		inputText = inputText.replace("%ip%", "DEPRECATED");
		inputText = inputText.replace("%serverip%", "127.0.0.1");
		inputText = inputText.replace("%servername%", "BisectHosting Rocks");
		inputText = inputText.replace("%players%", Math.floor(Math.random() * 20) + 1);
		inputText = inputText.replace("%motd%", "Check out Simple RPC");
		inputText = inputText.replace("%launcher%", "MultiMC");
		inputText = inputText.replace("%pack%", "Dummy Pack");

		return inputText;

	},

	closeChangelog: function(appRef) {
		appRef.settings.showChangelog = false;
		this.saveSettings(appRef);
	}

};

export default AppFunctions;
