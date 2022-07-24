import FAST_TOML from '@/scripts/fast-toml';
import $ from 'jquery';
import EditorUtils from '@/scripts/editorUtils';
import AppFunctions from '@/scripts/appFunctions';
import {help_keys} from "@/scripts/help";

let html_editor;

const EditorFunctions = {

	// Config
	loadConfigFile: async function (outRef) {
		const ret = await window.appApi.openFile();

		if (!ret.canceled) {
			await this.readConfig(outRef, ret.filePath);
		}
	},
	readConfig: async function (outRef, file) {

		if (file.endsWith(".toml")) {
			const tomlFile = await window.appApi.readFile(file);
			const data = FAST_TOML.parse(tomlFile);

			if (data.general != null && (data.general.clientID != null || data.general.applicationID != null)) {
				outRef.configData.old = tomlFile;
				outRef.configData.new = data;
				outRef.configData.configPath = file;
				outRef.configData.isConfigLoaded = true;
				outRef.configData.configType = "NORMAL";
				this.fetchDiscordAssets(data.general.applicationID != null ? data.general.applicationID : data.general.clientID, outRef);
			} else if (data.entry != null) {
				outRef.configData.old = tomlFile;
				outRef.configData.new = data;
				outRef.configData.configPath = file;
				outRef.configData.isConfigLoaded = true;
				outRef.configData.configType = "SERVER";
			} else {
				outRef.$swal.fire({
					title: "Error",
					icon: "error",
					text: "Selected file does not appear to be a valid Simple RPC config file"
				});
			}
		}
		return true;
	},

	saveConfig: async function(appRef, save) {
		let outFile = "";

		$.each(appRef.configData.new, function (key, value) {

			outFile += "[" + key + "]\n";

			$.each(value, function (subkey, subvalue) {

				if (help_keys[key] !== undefined && help_keys[key][subkey] !== undefined) {
					outFile += "\t#" + help_keys[key][subkey] + "\n";
				}

				if (subkey !== "buttons" && subkey !== "worlds" && subkey !== "dimensions") {

					if (typeof subvalue === "string" && !EditorUtils.isNumeric(subvalue)) {
						outFile += `\t${subkey} = "${subvalue}"\n`;
					} else {
						outFile += `\t${subkey} = ${subvalue}\n`;
					}

				} else if (subkey === "buttons") {

					if (subvalue.length > 0) {

						for (let i = 0; i < subvalue.length; i++) {
							outFile += `\n\t[[${key}.buttons]]\n\t\tlabel = "${subvalue[i].label}"\n\t\turl = "${subvalue[i].url}"\n`;
						}

						if (subvalue.length > 1) {
							outFile += `\n`;
						}

					} else {
						outFile += `\tbuttons = []\n`;
					}

				} else if (subkey === "worlds") {

					if (subvalue.length > 0) {

						for (let i = 0; i < subvalue.length; i++) {
							outFile += `\n\t[[${key}.worlds]]\n\t\tworldname = "${subvalue[i].worldname}"\n\t\tlargeImageKey = "${subvalue[i].largeImageKey}"\n\t\tlargeImageText = "${subvalue[i].largeImageText}"\n\t\tsmallImageKey = "${subvalue[i].smallImageKey}"\n\t\tsmallImageText = "${subvalue[i].smallImageText}"\n`;
						}

						if (subvalue.length > 1) {
							outFile += `\n`;
						}

					} else {
						outFile += `\tworlds = []\n`;
					}

				} else if (subkey === "dimensions") {

					if (subvalue.length > 0) {

						for (let i = 0; i < subvalue.length; i++) {
							outFile += `\n\t[[${key}.dimensions]]\n\t\tname = "${subvalue[i].name}"\n\t\tdescription = "${subvalue[i].description}"\n\t\tstate = "${subvalue[i].state}"\n\t\tlargeImageKey = "${subvalue[i].largeImageKey}"\n\t\tlargeImageText = "${subvalue[i].largeImageText}"\n\t\tsmallImageKey = "${subvalue[i].smallImageKey}"\n\t\tsmallImageText = "${subvalue[i].smallImageText}"\n`;
							if (subvalue[i].buttons.length > 0) {

								for (let ii = 0; ii < subvalue[i].buttons.length; ii++) {
									outFile += `\n\t\t[[${key}.buttons]]\n\t\tlabel = "${subvalue[i].buttons[ii].label}"\n\t\turl = "${subvalue[i].buttons[ii].url}"\n`;
								}

								if (subvalue.length > 1) {
									outFile += `\n`;
								}

							} else {
								outFile += `\t\tbuttons = []\n`;
							}
						}

						if (subvalue.length > 1) {
							outFile += `\n`;
						}

					} else {
						outFile += `\tdimensions = []\n`;
					}

				}

			});

			outFile += "\n";
			outFile = outFile.toString().replace(null, '""');
		});

		if (save) {
			const val = await window.appApi.saveConfig(appRef.configData.configPath, outFile);
			AppFunctions.showToast(appRef,"Error", "Config has been saved", 'success');
			AppFunctions.logData('INFO', "Config saved to: " + appRef.configData.configPath).then(r => {});
		}
		return outFile;

	},

	saveOverrideConfig: async function(appRef, save) {
		let outFile = "";

		$.each(appRef.configData.new, function (key, value) {

			if (key !== 'entry' && typeof value === "string" && !EditorUtils.isNumeric(value)) {
				outFile += `${key} = "${value}"\n`;
			} else if (key !== 'entry') {
				outFile += `${key} = ${value}\n`;
			}

			if (key === "entry") {

				if (value.length > 0) {

					for (let i = 0; i < value.length; i++) {
						outFile += `[[entry]]\n\t\tip = "${value[i].ip}"\n\t\tdescription = "${value[i].description}"\n\t\tstate = "${value[i].state}"\n\t\tlargeImageKey = "${value[i].largeImageKey}"\n\t\tlargeImageText = "${value[i].largeImageText}"\n\t\tsmallImageKey = "${value[i].smallImageKey}"\n\t\tsmallImageText = "${value[i].smallImageText}"\n`;
					}

					if (value.length > 1) {
						outFile += `\n`;
					}

				} else {
					outFile += `entry = []\n`;
				}

			}

			outFile += "\n";
			outFile = outFile.toString().replace(null, '""');
		});

		if (save) {
			const val = await window.appApi.saveConfig(appRef.configData.configPath, outFile);
			AppFunctions.showToast(appRef,"Error", "Config has been saved", 'success');
			AppFunctions.logData('INFO', "Config saved to: " + appRef.configData.configPath).then(r => {});
		}
		return outFile;

	},

	fetchDiscordAssets(appID, assetsRef) {
		// Check if the appID is valid
		EditorUtils.isValidRPC(assetsRef, appID);

		// This API call runs through a proxy server, because JQUERY blocks calls to the discord API due to missing headers
		// The proxy server is powered by this code: https://github.com/jesperorb/node-api-proxy
		$.ajax({
			type: "GET",
			url: "https://rpc-proxy.herokuapp.com/" + appID + "/assets"
		}).done(function (data, textStatus, jqXHR) {
			assetsRef.configData.appAssets = data;
			AppFunctions.logData('INFO', "Successfully fetched discord assets for app with id: " + appID).then(r => {});
			AppFunctions.updateRPC(assetsRef, assetsRef.appVars.activeSection.current);
		});
	},

	// Buttons

	addButton: function(dataRef, section) {
		var buttonData = {
			label: "",
			url: ""
		};

		dataRef.configData.new[section].buttons.push(buttonData);
	},
	deleteButton: function(dataRef, section, index) {
		dataRef.$swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				dataRef.configData.new[section].buttons.splice(index, 1);
				dataRef.$swal.fire(
					'Deleted!',
					'Your button has been deleted.',
					'success'
				)
			}
		});
	},
	addDimButton: function(dataRef, section) {
		var buttonData = {
			label: "",
			url: ""
		};

		dataRef.configData.new.dimension_overrides.dimensions[section].buttons.push(buttonData);
	},
	deleteDimButton: function(dataRef, section, index) {
		dataRef.$swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				dataRef.configData.new.dimension_overrides.dimensions[section].buttons.splice(index, 1);
				dataRef.$swal.fire(
					'Deleted!',
					'Your button has been deleted.',
					'success'
				)
			}
		});
	},

	// Worlds / Dimensions
	addWorld(appRef, sec) {
		var worldData = {
			worldname: "",
			largeImageKey: "",
			largeImageText: "",
			smallImageKey: "",
			smallImageText: ""
		};
		appRef.configData.new[sec].worlds.push(worldData);
	},
	deleteWorld: function (appRef, sec, index) {
		appRef.$swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				appRef.configData.new[sec].worlds.splice(index, 1);
				appRef.$swal.fire(
					'Deleted!',
					'The world has been deleted',
					'success'
				)
			}
		});
	},
	addDimension(appRef, sec) {
		var worldData = {
			name: "",
			description: "",
			state: "",
			largeImageKey: "",
			largeImageText: "",
			smallImageKey: "",
			smallImageText: ""
		};
		appRef.configData.new[sec].dimensions.push(worldData);
	},
	deleteDimension: function (appRef, sec, index) {
		appRef.$swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				appRef.configData.new[sec].dimensions.splice(index, 1);
				appRef.$swal.fire(
					'Deleted!',
					'The dimension has been deleted',
					'success'
				)
			}
		});
	},
	addServer(appRef) {
		var worldData = {
			ip: "",
			description: "",
			state: "",
			largeImageKey: "",
			largeImageText: "",
			smallImageKey: "",
			smallImageText: ""
		};
		appRef.configData.new.entry.push(worldData);
	},
	deleteServer: function (appRef, index) {
		appRef.$swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.isConfirmed) {
				appRef.configData.new.entry.splice(index, 1);
				appRef.$swal.fire(
					'Deleted!',
					'The entry has been deleted',
					'success'
				)
			}
		});
	},

	showCodeEditor: async function(appRef) {
		appRef.codeEditor.codeEditorActive = true;
		if (appRef.configData.configType === 'NORMAL') {
			this.saveConfig(appRef, false).then(res => {
				appRef.codeEditor.codeEditorContent = res;
				html_editor = ace.edit("codeditor");
				html_editor.setTheme(appRef.darkMode ? "ace/theme/dracula" : "ace/theme/chrome");
				html_editor.getSession().setMode("ace/mode/toml");
				html_editor.setFontSize("15px") ;
				html_editor.setPrintMarginColumn(false);
				html_editor.session.setValue(res);
			});
		} else {
			this.saveOverrideConfig(appRef, false).then(res => {
				appRef.codeEditor.codeEditorContent = res;
				html_editor = ace.edit("codeditor");
				html_editor.setTheme(appRef.darkMode ? "ace/theme/dracula" : "ace/theme/chrome");
				html_editor.getSession().setMode("ace/mode/toml");
				html_editor.setFontSize("15px") ;
				html_editor.setPrintMarginColumn(false);
				html_editor.session.setValue(res);
			});
		}
	},
	closeCodeEditor: async function(appRef) {
		appRef.codeEditor.codeEditorActive = false;
		let data = FAST_TOML.parse(html_editor.session.getValue());

		if (data.general != null && data.general.clientID != null) {
			appRef.configData.new = data;
			appRef.configData.configType = "NORMAL";
		} else if (data.entry != null) {
			appRef.configData.new = data;
			appRef.configData.configType = "SERVER";
		}
	}

}

export default EditorFunctions;
