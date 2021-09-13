var html_editor;
const tauri = window.__TAURI__;
const toml = window.fasttoml;
const logger = window.LoggerTauri;

var app = new Vue({
    el: '#app',
    data: {
        isConfigLoaded: false,
        configError: "",
        configData: [],
        appAssets: [],
        activeSection: 'general',
        timeInMs: 0,
        configPath: "Not Loaded",
        toast: { title: '', body: '', class: 'error' },
        showPreview: true,
        lastShowPreview: true,
        lastConfigData: [],
        lastClientId: 0,
        codeWindow: "",
        codeEditorActive: false,
        lastActiveSection: 'general',
        manualEdit: false,
        showChangelog: false,
        internalVer: 5,
        lastInternalVer: 4,
        aboutInfo: { os: "Win", nlversion: "0", appver: "0" },
        updateAvailable: false,
        showAbout: false
    },
    created: async function() {
        var appRef = this;

        $("body").tooltip({ selector: '[data-toggle=tooltip]' });
        $('.toast').toast('hide');

        appRef.setWindowTitle();
        logger.init("simple-rpc", true);

        appRef.aboutInfo = {
            os: (await tauri.os.type()).replace("_NT", ""),
            nlversion: await tauri.app.getTauriVersion(),
            appver: await tauri.app.getVersion()
        };

        appRef.logdata("INFO", "OS: " + (await tauri.os.type()).replace("_NT", "") + " (" + await tauri.os.arch() + ")");
        appRef.logdata("INFO", "Tauri Version: " + await tauri.app.getTauriVersion());
        appRef.logdata("INFO", "App Version: " + await tauri.app.getVersion());
        appRef.logdata("", "");

        appRef.showPreview = localStorage.getItem("showpreview") === 'true';
        appRef.showChangelog = localStorage.getItem("showcl") === 'true';
        appRef.lastInternalVer = parseInt(localStorage.getItem("internalver"));

        if (appRef.lastInternalVer !== appRef.internalVer) {
            appRef.showChangelog = true;
        }

        setTimeout(async function() {
            $(".splashscreen").fadeOut("slow", function () {
                $(".splashscreen").hide();
                $(".noconfigsplash").fadeIn("slow");
            });
        }, 4000);

        setInterval(async function () {

            appRef.timeInMs += 1000;
            $(".rpcTimer").text(msToTime(appRef.timeInMs) + " elapsed");
            if (appRef.lastShowPreview !== appRef.showPreview) {
                appRef.persistSettings(appRef);
                appRef.lastShowPreview = appRef.showPreview;
            }

        }, 1000);

        setInterval(async function () {

            if (appRef.configData !== appRef.lastConfigData || appRef.activeSection !== appRef.lastActiveSection) {
                console.log("Updating RPC");
                appRef.updateRPC(appRef.activeSection);
                appRef.lastConfigData = appRef.configData;
                appRef.lastActiveSection = appRef.activeSection;
            }

            if (appRef.lastClientId !== 0 && appRef.lastClientId !== appRef.configData.general.clientID) {
                appRef.fetchAppAssets(appRef.configData.general.clientID);
                appRef.lastClientId = appRef.configData.general.clientID;
            }

        }, 10);

    },
    methods: {

        // Window Methods
        setWindowTitle: async function() {

            tauri.window.getCurrent().setTitle('Simple RPC Editor Beta - ' + await tauri.app.getVersion());

        },
        openexternal: async function(urlToOpen) {

            await tauri.shell.open(urlToOpen);

        },
        showToast: function (type, title, body, timeout) {

            var appRef = app;
            appRef.toast.title = title;
            appRef.toast.body = body;
            switch (type) {
                case 'error':
                    appRef.toast.class = 'exclamation';
                    $(".toast-title").addClass('text-danger');
                    break;
                case 'info':
                    appRef.toast.class = 'info';
                    $(".toast-title").addClass('text-info');
                    break;
                case 'success':
                    appRef.toast.class = 'check-circle';
                    $(".toast-title").addClass('text-success');
                    break;
            }
            $('.toast').toast('show');

        },
        logdata: async function(type, data) {

            logger.log(type, data);
            console.log(data);

        },

        // Config Functions
        loadConfigFile: async function() {

            var appRef = app;

            tauri.dialog.open({
                defaultPath: null,
                filters: [{
                    name: "Simple RPC Toml File",
                    extensions: ["toml"]
                }],
                multiple: false,
                directory: false,
            }).then(file => {
                if (file !== "") {
                    if (file.endsWith(".toml")) {
                        tauri.fs.readTextFile(file, {}).then(tomlFile => {
                            // Fix for some windows installs adding extra line breaks, breaking the editor
                            var stringWithoutLineBreaks = tomlFile.replace(/\s*$/, "");
                            var data = toml.parse(stringWithoutLineBreaks);

                            if (data.general != null && data.general.clientID != null) {
                                appRef.configData = data;
                                appRef.configPath = file;
                                appRef.isConfigLoaded = true;
                                appRef.lastClientId = data.general.clientID;
                                appRef.fetchAppAssets(data.general.clientID);
                            } else {
                                appRef.showToast('error', "Error", 'Selected file is not a Simple RPC Config file or the file is corrupt!', 10000);
                            }
                            return tomlFile;
                        }).catch(err => {
                            appRef.logdata("ERROR", err);
                            return err;
                        });
                    } else {
                        appRef.showToast('error', "Error", 'Selected file is not a Simple RPC Config file or the file is corrupt!', 10000);
                    }
                }
                return file;
            });

        },
        saveConfig: async function (saveConf) {

            var outFile = "";

            $.each(app.configData, function (key, value) {

                outFile += "[" + key + "]\n";

                $.each(value, function (subkey, subvalue) {

                    if (subkey !== "buttons" && subkey !== "worlds" && subkey !== "dimensions") {

                        if (typeof subvalue === "string" && !isNumeric(subvalue)) {
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
            });

            if (saveConf) {
                tauri.fs.writeFile({
                    contents: outFile,
                    path: app.configPath
                }, null).then(res => {
                    app.showToast('info', "Success", "Config file has been saved", 0);
                    app.logdata('INFO', "Config saved to: " + app.configPath);
                }).catch(err => {
                    app.showToast('error', "Error", "Config file could not be saved", 0);
                    app.logdata('ERROR', err);
                    return err;
                });
            }
            return outFile;

        },
        fetchAppAssets: function (appID) {

            // This API call runs through a proxy server, because JQUERY blocks calls to the discord API due to missing headers
            // The proxy server is powered by this code: https://github.com/jesperorb/node-api-proxy
            $.ajax({
                type: "GET",
                url: "https://rpc-proxy.herokuapp.com/" + appID + "/assets"
            }).done(function (data, textStatus, jqXHR) {
                app.appAssets = data;
                app.logdata('INFO', "Successfully fetched discord assets for app with id: " + appID)
            });

        },

        // Editor Functions
        showCodeEditor: async function () {

            var appRef = app;
            app.codeEditorActive = !app.codeEditorActive;
            if (app.codeEditorActive) {
                app.saveConfig(false).then(res => {
                    appRef.codeWindow = res;
                    html_editor = ace.edit("codeditor");
                    html_editor.setTheme("ace/theme/dracula");
                    html_editor.getSession().setMode("ace/mode/toml");
                    html_editor.setFontSize("15px") ;
                    html_editor.setPrintMarginColumn(false);
                    html_editor.session.setValue(res);
                });
            }

        },
        closeCodeEditor: async function() {

            var appRef = app;
            app.codeEditorActive = false;
            var data = toml.parse(html_editor.session.getValue());

            if (data.general != null && data.general.clientID != null) {
                appRef.configData = data;
                appRef.lastClientId = data.general.clientID;
                appRef.fetchAppAssets(data.general.clientID);
            }

        },
        addButton: function (sec) {

            var buttonData = {
                label: "",
                url: ""
            };

            app.configData[sec].buttons.push(buttonData);

        },
        deleteButton: function(sec, index) {

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    app.configData[sec].buttons.splice(index, 1);
                    Swal.fire(
                        'Deleted!',
                        'Your button has been deleted.',
                        'success'
                    )
                }
            });

        },
        addWorld(sec) {

            var worldData = {
                worldname: "",
                largeImageKey: "",
                largeImageText: "",
                smallImageKey: "",
                smallImageText: ""
            };

            app.configData[sec].worlds.push(worldData);

        },
        deleteWorld: function (sec, index) {

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    app.configData[sec].worlds.splice(index, 1);
                    Swal.fire(
                        'Deleted!',
                        'The world has been deleted',
                        'success'
                    )
                }
            });

        },
        addDimension(sec) {

            var worldData = {
                name: "",
                description: "",
                state: "",
                largeImageKey: "",
                largeImageText: "",
                smallImageKey: "",
                smallImageText: ""
            };

            app.configData[sec].dimensions.push(worldData);

        },
        deleteDimension: function (sec, index) {

            Swal.fire({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    app.configData[sec].dimensions.splice(index, 1);
                    Swal.fire(
                        'Deleted!',
                        'The dimension has been deleted',
                        'success'
                    )
                }
            });

        },
        updateRPC: function (sec) {

            var appRef = this;

            if (appRef.configData[sec] != null) {
                let dat;

                if (sec !== "general" && sec !== "world_images" && sec !== "dimension_overrides") {
                    dat = appRef.configData[sec].enabled ? appRef.configData[sec] : appRef.configData.generic;
                } else {
                    dat = appRef.configData.generic;
                }

                $(".rpcDescription").text(appRef.dummyVars(dat.description)).attr("title", appRef.dummyVars(dat.description));
                $(".rpcState").text(appRef.dummyVars(dat.state)).attr("title", appRef.dummyVars(dat.state));

                if (dat.buttons[0] != null) {

                    var buttonHTML = `<a id="rpcButton1" class="disabled btn btn-outline-primary text-white" style="border-color: white; position: absolute; top: 140px; left: 20px; width: 280px;" href="${dat.buttons[0].url}">${dat.buttons[0].label}</a>`;

                    if (dat.buttons[1] != null) {
                        buttonHTML += `<a id="rpcButton2" class="disabled btn btn-outline-primary text-white" style="border-color: white; position: absolute; top: 190px; left: 20px; width: 280px;" href="${dat.buttons[1].url}">${dat.buttons[1].label}</a>`;
                    }

                    $(".rpcButtonContainer").html(buttonHTML);
                } else {
                    $(".rpcButtonContainer").html("");
                }

                var assetID = appRef.appAssets.filter(c => c.name === appRef.configData[sec].largeImageKey);
                if (assetID[0] !== undefined && assetID[0].hasOwnProperty("id")) {
                    $("#rpcLargeImage")
                        .css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.general.clientID + "/" + assetID[0].id + ".png)")
                        .css("background-size", "100% 100%")
                        .attr("title", appRef.dummyVars(dat.largeImageText));
                }

                var assetIDSmall = appRef.appAssets.filter(c => c.name === appRef.configData[sec].smallImageKey);
                if (assetIDSmall[0] !== undefined && assetIDSmall[0].hasOwnProperty("id")) {
                    $("#rpcSmallImage")
                        .css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.general.clientID + "/" + assetIDSmall[0].id + ".png)")
                        .css("background-size", "100% 100%")
                        .attr("title", appRef.dummyVars(dat.smallImageText));
                }

            }

        },
        getSectIcon: function(sec) {

            switch (sec) {
                case "general":
                    return "fa fa-archive text-purple";

                case "init":
                    return "fa fa-spinner text-primary";

                case "main_menu":
                    return "fa fa-list text-secondary";

                case "server_list":
                    return "fa fa-server text-warning";

                case "join_game":
                    return "fa fa-gamepad text-danger";

                case "single_player":
                    return "fa fa-user text-success";

                case "multi_player":
                    return "fa fa-users text-cyan";

                case "generic":
                    return "fa fa-tachometer-alt text-yellow";

                case "world_images":
                    return "fa fa-globe text-pink";

                case "dimension_overrides":
                    return "fa fa-globe text-pink";
            }

        },
        closeChangelog: async function () {

            var appRef = this;
            appRef.showChangelog = false;
            appRef.persistSettings(appRef);

        },
        persistSettings: async function (appRef) {

            localStorage.setItem("showpreview", appRef.showPreview.toString());
            localStorage.setItem("showcl", appRef.showChangelog.toString());
            localStorage.setItem("internalver", appRef.internalVer.toString());

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

        }
    },
    filters: {

        camelToNormal: function (value) {
            var normalString = value.replace(/([a-z])([A-Z])/g, '$1 $2');
            return normalString.charAt(0).toUpperCase() + normalString.slice(1);
        },
        sectionToNormal: function (value) {
            var normalString = value.replace("_", " ");
            return normalString.charAt(0).toUpperCase() + normalString.slice(1);
        }

    }
});

// Code from https://stackoverflow.com/a/9763769
// Modified to reflect Discord Time for RPC's
function msToTime(s) {

    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    var retTime;

    if (hrs > 0) {
        retTime = pad(hrs, 2) + ':' + pad(mins, 2) + ':' + pad(secs, 2);
    } else {
        retTime = pad(mins, 2) + ':' + pad(secs, 2);
    }

    return retTime;

}

function pad (str, max) {

    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;

}

function isNumeric(input) {

    const reg = new RegExp('^[0-9]+$');
    return reg.test(input);

}
