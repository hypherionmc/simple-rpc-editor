<template>
	<div id="app" :class="darkMode ? 'dark' : 'light'">
		<b-container fluid>

			<SplashScreen :darkMode='darkMode' />
			<NoConfigSplash :configMethod='loadConfigFile' :darkMode='darkMode' v-show='!configData.isConfigLoaded' />
			<AboutSplash :aboutInfo='aboutInfo' :externalMethod='openExternal' :darkMode='darkMode' v-if='aboutInfo.showAbout' :showChangelog='() => appSettings.showChangelog = true' />
			<ChangelogSplash :closeConf='() => appSettings.showChangelog = false' v-if='appSettings.showChangelog && configData.isConfigLoaded' :darkMode='darkMode' />

			<div class="code-editor" :class="darkMode ? 'dark' : 'light'" v-if='codeEditor.codeEditorActive'>
				<textarea id="codeditor" style="width: 100%; height: 450px; display: none;" class="code-editor w-100 form-control" :class="darkMode ? 'dark' : 'light'">{{codeEditor.codeEditorContent}}</textarea>
				<a href="#" class="btn btn-success" v-on:click="closeCodeEditor" style="position: absolute; bottom: 10px; right: 10px;">Done</a> <a href="#" class="btn btn-danger" v-on:click="copyCode" style="position: absolute; bottom: 10px; right: 80px;">Copy To Clipboard</a>
			</div>

			<!-- NAVBAR -->
			<div class="navbox" :class="darkMode ? 'dark' : 'light'">
				<div class="logobox">
					<a href="#">
						<img v-bind:src="darkMode ? require(`@/assets/img/rpc_edit_horizontal.svg`) : require(`@/assets/img/rpc_edit_horizontal_light.svg`)" style="width: 100%"  alt="" />
					</a>
				</div>
				<hr class="horizontal" :class="darkMode ? 'dark' : 'light'" />

				<div class="linkbox" v-if="configData.configType === 'NORMAL'">
					<a v-for="(section, key) in configData.new" href="#" :class="[darkMode ? 'dark' : 'light', appVars.activeSection.current === key ? 'active' : '']" @click="appVars.activeSection.current = key">
						<font-awesome-icon :icon="['fas', getSectionIcon(key)]" />
						<span class="nav-link-text">{{key | sectionToNormal}}</span>
					</a>
          <a href="#" :class="[darkMode ? 'dark' : 'light']" @click="openExternal('https://readme.firstdarkdev.xyz/simple-rpc/introduction/')">
            <font-awesome-icon :icon="['fas', 'question']" />
            <span class="nav-link-text">Documentation</span>
          </a>
				</div>

        <div class="linkbox" v-if="configData.configType === 'SERVER'">
          <a href="#" :class="[darkMode ? 'dark' : 'light', 'active']">
            <font-awesome-icon :icon="['fas', getSectionIcon('general')]" />
            <span class="nav-link-text">General</span>
          </a>
        </div>

				<a href="#" class="coffee-button" id="coffee" @click="openExternal('https://ko-fi.com/hypherionsa')">
					<font-awesome-icon :icon="['fas', 'coffee']" /> Support Me
				</a>

				<div class="support-box" :class="darkMode ? 'dark' : 'light'">
					<a href="#" class="support-button left-border" :class="darkMode ? 'dark' : 'light'" v-b-tooltip.right title="Report Issue" @click="openExternal('https://github.com/hypherionmc/simple-rpc-editor/issues')">
						<font-awesome-icon :icon="['fab', 'github']" />
					</a>
					<a href="#" class="support-button" :class="darkMode ? 'dark' : 'light'" v-b-tooltip title="Latest Releases" @click="openExternal('https://srpcupdater.hypherionmc.me/')">
						<font-awesome-icon :icon="['fas', 'download']" />
					</a>
					<a href="#" class="support-button" :class="darkMode ? 'dark' : 'light'" v-b-tooltip title="Support Discord" @click="openExternal('https://discord.firstdarkdev.xyz')">
						<font-awesome-icon :icon="['fab', 'discord']" />
					</a>
					<a href="#" class="support-button" :class="darkMode ? 'dark' : 'light'" v-b-tooltip title="About" v-on:click='aboutInfo.showAbout = !aboutInfo.showAbout'>
						<font-awesome-icon :icon="['fas', 'question-circle']" />
					</a>
					<a href="#" class="support-button right-border" :class="darkMode ? 'dark' : 'light'" @click="darkMode = !darkMode" v-b-tooltip :title="darkMode ? 'Light Theme' : 'Dark Theme'">
						<font-awesome-icon :icon="['fas', darkMode ? 'lightbulb' : 'moon']" />
					</a>
				</div>
			</div>

			<div class="header-bar">
				<div class="pathBox" :class="darkMode ? 'dark' : 'light'">
					<font-awesome-icon :icon="['fas', 'file']" /> Config File
					<br />
					<b>{{configData.configPath}}</b>
				</div>
				<div class="app-buttons">
          <a href="#" class="editor-button" v-b-tooltip.left :title="'Close Config'" onclick='window.location.reload()'>
            <font-awesome-icon :icon="['fas', 'times']" />
          </a>
          <a href="#" class="editor-button" v-b-tooltip.left :title="showHelp ? 'Hide Help Text' : 'Show Help Text'" v-on:click='showHelp = !showHelp'>
            <font-awesome-icon :icon="['fas', 'question']" />
          </a>
					<a href="#" class="editor-button" v-b-tooltip.left :title="appSettings.showPreview ? 'Hide Preview' : 'Show Preview'" v-on:click='appSettings.showPreview = !appSettings.showPreview' v-if="configData.configType === 'NORMAL'">
						<font-awesome-icon :icon="['fas', 'eye']" />
					</a>
					<a href="#" v-on:click='openCodeEditor' class="editor-button" v-b-tooltip.left :title="codeEditor.codeEditorActive ? 'Hide Code Editor' : 'Show Code Editor'" :disabled='configData.isConfigLoaded'>
						<font-awesome-icon :icon="['fas', 'code']"/>
					</a>
					<a href="#" class="editor-button" @click="saveConfig" v-b-tooltip.left title="Save Config">
						<font-awesome-icon :icon="['fas', 'save']" />
					</a>
					<a href="#" class="editor-button" @click="loadConfigFile(null)" v-b-tooltip.left title="Load Config">
						<font-awesome-icon :icon="['fas', 'file-alt']" />
					</a>
				</div>
			</div>

			<div class="editor-body" :class="darkMode ? 'dark' : 'light'">
				<div class="card" style="height: 100%;" :class="darkMode ? 'dark' : 'light'">
					<div class="card-header">
            <h4 class="float-left" v-if="configData.configType === 'NORMAL'">{{appVars.activeSection.current | sectionToNormal}} Config</h4>
            <h4 class="float-left" v-if="configData.configType === 'SERVER'">Server Entries Config</h4>
            <a href="#" class="btn btn-success btn-sm float-end" v-if="appVars.activeSection.current === 'world_images' || appVars.activeSection.current === 'dimension_overrides'" v-on:click="appVars.activeSection.current === 'dimension_overrides' ? addDimension() : addWorld()">{{appVars.activeSection.current === 'dimension_overrides' ? 'Add Dimension' : 'Add World'}}</a>
			<a href="#" class="btn btn-success btn-sm float-end" v-if="configData.configType === 'SERVER'" v-on:click="addServer()">Add Entry</a>
          </div>

					<div class="card-body" style="height: 100%; overflow-y: auto;">

						<div class="row mb-3" v-for="(value, key) in configData.new[appVars.activeSection.current]" v-if="key !== 'buttons' && key !== 'worlds' && key !== 'dimensions'">
							<label class="col-sm-2 col-form-label" style="margin-bottom: 0px; padding-bottom: 0px;">{{key | camelToNormal}}</label>
              <label class="text-info text-sm-left" style="margin-bottom: 2px;" v-if="appVars.activeSection.current !== 'dimension_overrides' && showHelp && configData.configType !== 'SERVER'">{{ helpKeys[appVars.activeSection.current][key] }} </label>
							<div class="col-sm-12" :class="typeof value === 'boolean' ? 'pad9' : ''">

								<div class="form-check form-switch" v-if="typeof value === 'boolean'">
									<input class="form-check-input" type="checkbox" :class="darkMode ? 'dark' : 'light'" v-model="configData.new[appVars.activeSection.current][key]">
								</div>

								<input type="text" class="form-control" :class="darkMode ? 'dark' : 'light'" :readonly="key === 'version'" v-if="typeof value !== 'boolean' && key !== 'largeImageKey' && key !== 'smallImageKey'" v-model="configData.new[appVars.activeSection.current][key]"/>

								<v-select :options="configData.appAssets" class="image-chooser" :class="darkMode ? 'dark' : 'light'" label="name" v-if="(key === 'largeImageKey' || key === 'smallImageKey') && !appVars.manualEdit" v-model="configData.new[appVars.activeSection.current][key]" :reduce="option => option.name" taggable>
									<template slot="option" slot-scope="option">
										<img :src="'https://cdn.discordapp.com/app-assets/' + configData.new.general.clientID + '/' + option.id" style="width: 48px;"/>
										{{ option.name }}
									</template>
								</v-select>

								<div class="input-group mb-3" v-if="(key === 'largeImageKey' || key === 'smallImageKey') && appVars.manualEdit">
									<input type="text" class="form-control" v-model="configData.new[appVars.activeSection.current][key]" v-on:change="" style="border-radius: 5px 0px 0px 5px;">
									<div class="input-group-append">
										<button class="btn btn-success" type="button" v-on:click="appVars.manualEdit = !appVars.manualEdit">
											<font-awesome-icon :icon="['fas', 'edit']" />
										</button>
									</div>
								</div>

							</div>
						</div>

            <div class="row mb-3" v-for="(value, key) in configData.new" v-if="configData.configType === 'SERVER' && key !== 'entry'">
              <label class="col-sm-2 col-form-label">{{key | camelToNormal}}</label>
              <div class="col-sm-10" :class="typeof value === 'boolean' ? 'pad9' : ''">

                <div class="form-check form-switch" v-if="typeof value === 'boolean'">
                  <input class="form-check-input" type="checkbox" :class="darkMode ? 'dark' : 'light'" v-model="configData.new[key]">
                </div>

                <input type="text" class="form-control" :class="darkMode ? 'dark' : 'light'" :readonly="key === 'version'" v-if="typeof value !== 'boolean' && key !== 'largeImageKey' && key !== 'smallImageKey'" v-model="configData.new[key]"/>

                <v-select :options="configData.appAssets" class="image-chooser" :class="darkMode ? 'dark' : 'light'" label="name" v-if="(key === 'largeImageKey' || key === 'smallImageKey') && !appVars.manualEdit" v-model="configData.new[key]" :reduce="option => option.name" taggable>
                  <template slot="option" slot-scope="option">
                    <img :src="'https://cdn.discordapp.com/app-assets/' + configData.new.general.clientID + '/' + option.id" style="width: 48px;"/>
                    {{ option.name }}
                  </template>
                </v-select>

                <div class="input-group mb-3" v-if="(key === 'largeImageKey' || key === 'smallImageKey') && appVars.manualEdit">
                  <input type="text" class="form-control" v-model="configData.new[key]" v-on:change="" style="border-radius: 5px 0px 0px 5px;" maxlength="128">
                  <div class="input-group-append">
                    <button class="btn btn-success" type="button" v-on:click="appVars.manualEdit = !appVars.manualEdit">
                      <font-awesome-icon :icon="['fas', 'edit']" />
                    </button>
                  </div>
                </div>

              </div>
            </div>

						<div class="card" v-if="configData.configType === 'NORMAL' && configData.new.general != null && configData.new[appVars.activeSection.current].buttons != null" :class="darkMode ? 'dark' : 'light'" >

							<div class="card-header">
								Buttons <button class="btn btn-sm btn-danger float-end" v-if="configData.new[appVars.activeSection.current].buttons.length < 2" v-on:click="addButton(appVars.activeSection.current)">Add</button>
							</div>

							<div style="padding: 10px;">
								<div class="input-group mb-3" v-for="(button, index) in configData.new[appVars.activeSection.current].buttons">
									<span class="input-group-text" style="border-radius: 5px 0px 0px 5px;">Label</span>
									<input type="text" class="form-control" maxlength="32" v-model="button.label" style="border-radius: 0px;" :class="darkMode ? 'dark' : 'light'">
									<span class="input-group-text" style="border-radius: 0px;">Url</span>
									<input type="text" class="form-control" v-model="button.url" style="border-radius: 0px;" :class="darkMode ? 'dark' : 'light'">
									<button class="btn btn-warning btn-sm" v-on:click="deleteButton(appVars.activeSection.current, index)" style="border-radius: 0px 5px 5px 0px;">Delete</button>
								</div>
							</div>

						</div>

						<div v-if="configData.isConfigLoaded && Object.hasOwnProperty.bind(configData.new)('world_images')">
							<div class="card card-secondary" v-if="appVars.activeSection.current === 'world_images'" v-for="(world, key) in configData.new.world_images.worlds" style="margin-bottom: 10px;">

								<div class="card-header card-secondary text-white">
									World Override ({{world.worldname}})
									<div class="btn-group float-end" role="group" aria-label="World Actions">
										<button type="button" class="btn btn-success btn-sm" v-on:click="addWorld()">Add World</button>
										<button type="button" class="btn btn-danger btn-sm" v-on:click="deleteWorld(key)">Delete</button>
									</div>
								</div>

								<div style="padding: 10px;">
									<div class="mb-3 row" v-for="(worldData, datakey) in world">
										<label class="col-sm-2 col-form-label">{{datakey | camelToNormal}}</label>
										<div class="col-sm-10">

											<input type="text" class="form-control" :class="darkMode ? 'dark' : 'light'" v-if="datakey === 'largeImageText' || datakey === 'smallImageText' || datakey === 'worldname'" v-model="configData.new.world_images.worlds[key][datakey]">

											<v-select :options="configData.appAssets" class="image-chooser" :class="darkMode ? 'dark' : 'light'" label="name" v-if="(datakey === 'largeImageKey' || datakey === 'smallImageKey')" v-model="configData.new.world_images.worlds[key][datakey]" :reduce="option => option.name" taggable>
												<template slot="option" slot-scope="option">
													<img :src="'https://cdn.discordapp.com/app-assets/' + configData.new.general.clientID + '/' + option.id" style="width: 48px;"/>
													{{ option.name }}
												</template>
											</v-select>

										</div>
									</div>
								</div>

							</div>
						</div>

						<div v-if="configData.isConfigLoaded && Object.hasOwnProperty.bind(configData.new)('dimension_overrides')">
							<div class="card" v-if="appVars.activeSection.current === 'dimension_overrides'" v-for="(dimension, key) in configData.new.dimension_overrides.dimensions" style="margin-bottom: 10px;" :class="darkMode ? 'dark' : 'light'">

								<div class="card-header card-secondary">
									<div class="float-left">
										Dimension Override ({{dimension.name}})
										<p class="text-info text-sm-left" style="margin-bottom: 0px !important; font-size: 12px;">Note: Non Vanilla dimensions need to have their name in format "modid:dimension". For example: "dimensionpocketsii:pocket"</p>
										<p class="text-danger text-sm-left" style="margin-bottom: 0px !important; font-size: 12px;">Leave values empty to ignore them</p>
									</div>
									<div class="btn-group float-end" role="group" aria-label="World Actions">
										<button type="button" class="btn btn-success btn-sm" v-on:click="addDimension()">Add Dimension</button>
										<button type="button" class="btn btn-danger btn-sm" v-on:click="deleteDimension(key)">Delete Dimension</button>
									</div>
								</div>

								<div style="padding: 10px;">
									<div class="mb-3 row" v-for="(worldData, datakey) in dimension">
										<label class="col-sm-2 col-form-label">{{datakey | camelToNormal}}</label>
										<div class="col-sm-10">

											<input type="text" class="form-control" :class="darkMode ? 'dark' : 'light'" v-if="datakey === 'largeImageText' || datakey === 'smallImageText' || datakey === 'name' || datakey === 'description' || datakey === 'state'" v-model="configData.new.dimension_overrides.dimensions[key][datakey]" maxlength="128">

											<v-select :options="configData.appAssets" class="image-chooser" :class="darkMode ? 'dark' : 'light'"
												label="name" v-if="(datakey === 'largeImageKey' || datakey === 'smallImageKey')"
                        v-model="configData.new.dimension_overrides.dimensions[key][datakey]"
												:reduce="option => option.name" taggable>

												<template slot="option" slot-scope="option">
													<img :src="'https://cdn.discordapp.com/app-assets/' + configData.new.general.clientID + '/' + option.id" style="width: 48px;"/>
													{{ option.name }}
												</template>

											</v-select>

										</div>
									</div>
								</div>

							</div>
						</div>

            <div v-if="configData.configType === 'SERVER' && configData.isConfigLoaded && Object.hasOwnProperty.bind(configData.new)('entry')">
              <div class="card" v-for="(dimension, key) in configData.new.entry" style="margin-bottom: 10px;" :class="darkMode ? 'dark' : 'light'">

                <div class="card-header card-secondary">
                  <div class="float-left">
                    Server Override ({{dimension.ip}})
                  </div>
                  <div class="btn-group float-end" role="group" aria-label="World Actions">
                    <button type="button" class="btn btn-success btn-sm" v-on:click="addServer()">Add Entry</button>
                    <button type="button" class="btn btn-danger btn-sm" v-on:click="deleteServer(key)">Delete Entry</button>
                  </div>
                </div>

                <div style="padding: 10px;">
                  <div class="mb-3 row" v-for="(worldData, datakey) in dimension">
                    <label class="col-sm-2 col-form-label">{{datakey | camelToNormal}}</label>
                    <div class="col-sm-10">
                      <input type="text" class="form-control" :class="darkMode ? 'dark' : 'light'" v-if="datakey === 'largeImageText' || datakey === 'smallImageText' || datakey === 'ip' || datakey === 'description' || datakey === 'state' || datakey === 'largeImageKey' || datakey === 'smallImageKey'" v-model="configData.new.entry[key][datakey]" maxlength="128">
                    </div>
                  </div>
                </div>

              </div>
            </div>

					</div>
				</div>
			</div>

			<!-- Preview -->
			<div class="rpc-container" :class="appSettings.showPreview && !aboutInfo.showAbout && !codeEditor.codeEditorActive && !appSettings.showChangelog ? '' : 'hiderpc'">
				<div class="rpc" style="background: #000; width: 320px; height: 250px; border-radius: 10px;" v-if="configData.configType === 'NORMAL' && configData.isConfigLoaded && configData.new.general != null">
          <a href="#" v-on:click="appSettings.showPreview = !appSettings.showPreview" style="position: absolute; top: 10px; right: 10px; color: white;"><font-awesome-icon :icon="['fas', 'times']" /></a>
					<div id="rpcLargeImage" style="background-size: 100% 100%; background-repeat: no-repeat; position: absolute; top: 62px; left: 20px; width: 60px; height: 60px; background: white; border-radius: 10px;" title=""></div>
					<div id="rpcSmallImage" style="background-size: 100% 100%; background-repeat: no-repeat; position: absolute; top: 104px; left: 64px; width: 20px; height: 20px; background: red; border-radius: 50%; z-index: 500" title="test"></div>

					<span class="rpcTitle text-white" style="position: absolute; top: 20px; left: 20px; font-size: 12px;"><b>PLAYING A GAME</b></span>
					<span class="rpcAppName text-white" style="position: absolute; top: 58px; left: 90px; font-size: 14px;"><b>{{ configData.appName }}</b></span>
					<span class="rpcDescription text-white" style="position: absolute; top: 74px; left: 90px; white-space: nowrap; overflow: hidden; font-size: 12px; text-wrap: none; text-overflow: ellipsis; width: 200px;" title="">Config Not Loaded</span>
					<span class="rpcState text-white" style="position: absolute; top: 89px; left: 90px; white-space: nowrap; overflow: hidden; font-size: 12px; text-wrap: none; text-overflow: ellipsis; width: 200px;" title="">Config Not Loaded</span>
					<span class="rpcTimer text-white" style="position: absolute; top: 104px; left: 90px; font-size: 12px;">{{preview.totalTime|msToTime}} elapsed</span>

					<div class="rpcButtonContainer">

					</div>
				</div>
			</div>

		</b-container>
	</div>
</template>

<script>
import './assets/css/app.css';
//import { os, app, clipboard, invoke } from '@tauri-apps/api';
import EditorFunctions from '@/scripts/editorFunctions';
import EditorUtils from '@/scripts/editorUtils';
import AppFunctions from '@/scripts/appFunctions';
import SplashScreen from '@/components/SplashScreen';
import NoConfigSplash from '@/components/NoConfigSplash';
import AboutSplash from '@/components/AboutSplash';
import ChangelogSplash from '@/components/ChangelogSplash';
import _ from "lodash";
import { help_keys} from "@/scripts/help";

export default {
	name: 'App',
	components: { AboutSplash, NoConfigSplash, SplashScreen, ChangelogSplash },
	data: function () {
		return {
      helpKeys: help_keys,
      showHelp: true,
			darkMode: false,
			appVars: {
				activeSection: {
					current: 'general',
					last: 'general'
				},
				startTime: new Date(),
				manualEdit: false
			},
			configData: {
				old: [],
				new: [],
				lastConfigData: [],
				configPath: "Not Loaded",
				isConfigLoaded: false,
				appAssets: [],
				configType: "NORMAL",
				appName: "Minecraft"
			},
			appSettings: {
				showPreview: false,
				showChangelog: false,
				internalVer: 11,
				lastInternalVer: 10,
				lastUpdateVer: ""
			},
			codeEditor: {
				editorRef: Object,
				codeEditorActive: false,
				codeEditorContent: ""
			},
			aboutInfo: {
				showAbout: false,
				os: "Win",
				nlversion: "0",
				appver: "0",
        chrome: "0"
			},
			preview: {
				totalTime: 0
			}
		};
	},
	created: async function() {
		const appRef = this;

		await AppFunctions.setWindowTitle();

    const appVersion = await window.appApi.appVersion();

		this.aboutInfo = {
			showAbout: false,
			os: appVersion.osName,
			nlversion: appVersion.node,
			appver: appVersion.appVer,
      chrome: appVersion.chrome
		};

		AppFunctions.initLogger();

		await AppFunctions.logData("INFO", "OS: " + appVersion.osName);
		await AppFunctions.logData("INFO", "Node Version: " + appVersion.node);
		await AppFunctions.logData("INFO", "Chrome Version: " + appVersion.chrome);
		await AppFunctions.logData("INFO", "App Version: " + appVersion.appVer);
		await AppFunctions.logData("", "");

		this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

		AppFunctions.loadSettings(this);

		if (this.appSettings.lastInternalVer !== this.appSettings.internalVer) {
			this.appSettings.showChangelog = true;
		}

		if (this.appSettings.lastUpdateVer === "" || this.appSettings.lastUpdateVer === "null") {
		  this.appSettings.lastUpdateVer = appVersion.appVer;
		}

		AppFunctions.checkUpdate(this);

		setInterval(async function () {
			appRef.preview.totalTime += 1000;
			AppFunctions.saveSettings(appRef);
		}, 1000);

		setInterval(async function () {
			if (appRef.configData.isConfigLoaded) {
				if (appRef.configData.configType === 'NORMAL' && !_.isEqual(appRef.configData.new, appRef.configData.lastConfigData) || appRef.appVars.activeSection.last !== appRef.appVars.activeSection.current) {
					await AppFunctions.logData('INFO', 'Updating RPC');

					appRef.configData.lastConfigData = _.cloneDeep(appRef.configData.new);
					appRef.appVars.activeSection.last = appRef.appVars.activeSection.current;
					EditorFunctions.fetchDiscordAssets(appRef.configData.new.general.clientID, appRef);
					AppFunctions.updateRPC(appRef, appRef.appVars.activeSection.current);
				}
			}
		}, 10);

	},
	methods: {

		loadConfigFile: function(file) {
			if (file !== null) {
        EditorFunctions.readConfig(this, file);
      } else {
        EditorFunctions.loadConfigFile(this);
      }
		},
		getSectionIcon: function(sec) {
			return EditorUtils.getSectionIcon(sec);
		},
		addButton: function(sec) {
			EditorFunctions.addButton(this, sec);
		},
		deleteButton: function(sec, index) {
			EditorFunctions.deleteButton(this, sec, index);
		},
		saveConfig: function() {
			if (this.configData.configType === 'NORMAL') {
        EditorFunctions.saveConfig(this, true);
      } else {
        EditorFunctions.saveOverrideConfig(this, true);
      }
		},
		openCodeEditor: function() {
			if (this.configData.isConfigLoaded) {
				EditorFunctions.showCodeEditor(this);
			}
		},
		closeCodeEditor: function() {
			EditorFunctions.closeCodeEditor(this);
		},
		copyCode: async function() {
      await window.appApi.copyClipboard(this.codeEditor.codeEditorContent);
			AppFunctions.showToast(this, "Success", "Text copied to clipboard", 'success');
		},
		openExternal: function(url) {
			AppFunctions.openExternal(url);
		},
		addWorld: function() {
			EditorFunctions.addWorld(this, this.appVars.activeSection.current);
		},
		addDimension: function() {
			EditorFunctions.addDimension(this, this.appVars.activeSection.current);
		},
		deleteWorld: function(key) {
			EditorFunctions.deleteWorld(this, this.appVars.activeSection.current, key);
		},
		deleteDimension: function(key) {
			EditorFunctions.deleteDimension(this, this.appVars.activeSection.current, key);
		},
    addServer: function() {
      EditorFunctions.addServer(this);
    },
    deleteServer: function(key) {
      EditorFunctions.deleteServer(this, key);
    },

	},
	filters: {
		sectionToNormal: function(section) {
			return EditorUtils.sectionToNormal(section);
		},
		camelToNormal: function(sec) {
			return EditorUtils.camelToNormal(sec);
		},
		msToTime: function(time) {
			return EditorUtils.msToTime(time);
		}
	}
};
</script>
