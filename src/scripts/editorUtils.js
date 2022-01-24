import _ from 'lodash';
import $ from 'jquery';

const EditorUtils = {

	sectionToNormal: function (section) {
		const normalString = section.replace('_', ' ');
		return normalString.charAt(0).toUpperCase() + normalString.slice(1);
	},

	camelToNormal: function(value) {
		const normalString = value.replace(/([a-z])([A-Z])/g, '$1 $2');
		return normalString.charAt(0).toUpperCase() + normalString.slice(1);
	},

	getSectionIcon: function (section) {
		switch (section) {
			case "general":
				return "archive";

			case "init":
				return "spinner";

			case "main_menu":
				return "list";

			case "server_list":
				return "server";

			case "join_game":
				return "gamepad";

			case "single_player":
				return "user";

			case "multi_player":
				return "users";

			case "generic":
				return "tachometer-alt";

			case "world_images":
				return "globe";

			case "dimension_overrides":
				return "globe";
		}
	},

	deepCopy: function (src) {
		let target = Array.isArray(src) ? [] : {};
		for (let key in src) {
			let v = src[key];
			if (v) {
				if (typeof v === "object") {
					target[key] = this.deepCopy(v);
				} else {
					target[key] = v;
				}
			} else {
				target[key] = v;
			}
		}

		return target;
	},

	msToTime: function (s) {
		const ms = s % 1000;
		s = (s - ms) / 1000;
		const secs = s % 60;
		s = (s - secs) / 60;
		const mins = s % 60;
		const hrs = (s - mins) / 60;

		let retTime;

		if (hrs > 0) {
			retTime = this.pad(hrs, 2) + ':' + this.pad(mins, 2) + ':' + this.pad(secs, 2);
		} else {
			retTime = this.pad(mins, 2) + ':' + this.pad(secs, 2);
		}
		return retTime;
	},

	pad: function (str, max) {
		str = str.toString();
		return str.length < max ? this.pad("0" + str, max) : str;
	},

	isNumeric: function (input) {
		const reg = new RegExp('^[0-9]+$');
		return reg.test(input);
	},
	isValidRPC: function (appRef, appID) {
		let retVal = false;
		$.get("https://discord.com/api/v9/oauth2/applications/" + appID + "/rpc").then(res => {
			appRef.configData.appName = res.name;
			retVal = true;
			console.log(res);
		}).catch(err => {
			appRef.configData.appName = "Minecraft";
			retVal = false;
			console.error(err.response);
		});
		console.log(retVal);
		return retVal;
	},

};

export default EditorUtils;
