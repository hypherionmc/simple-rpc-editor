var app = new Vue({
    el: '#app',
    data: {
        configData: [],
        appAssets: [],
        vars: ["%player%", "%world%", "%mods%", "%difficulty% ", "%position%", "%biome%", "%mcver%", "%serverip%", "%servername%", "%players%", "%motd%", "%launcher%", "%pack%"],
        activeSection: 'general',
        timeInMS: 0,
        configPath: "Not Loaded"
    },
    created: function() {
        var appRef = this;

        Neutralino.init();

        setInterval(function () {
            appRef.timeInMS += 1000;
            $(".rpcTimer").text(msToTime(appRef.timeInMS) + " elapsed");
        }, 1000);

        setInterval(function () {
            appRef.updateRPC(appRef.activeSection);
        }, 100);

    },
    methods: {
        updateRPC: function (sec) {

            if (sec !== "general" && app.configData[sec] != null) {

                var appRef = app;

                if (appRef.configData[sec].enabled) {

                    var dat = appRef.configData[sec];

                    $(".rpcDescription").text(dat.description)
                    $(".rpcState").text(dat.state)

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
                    $("#rpcLargeImage").css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.general.clientID + "/" + assetID[0].id + ".png)");
                    $("#rpcLargeImage").css("background-size", "100% 100%");

                    var assetIDSmall = appRef.appAssets.filter(c => c.name === appRef.configData[sec].smallImageKey);
                    $("#rpcSmallImage").css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.general.clientID + "/" + assetIDSmall[0].id + ".png)");
                    $("#rpcSmallImage").css("background-size", "100% 100%");

                } else {
                    var dat = appRef.configData.generic;

                    $(".rpcDescription").text(dat.description)
                    $(".rpcState").text(dat.state)

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
                    $("#rpcLargeImage").css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.general.clientID + "/" + assetID[0].id + ".png)");
                    $("#rpcLargeImage").css("background-size", "100% 100%");

                    var assetIDSmall = appRef.appAssets.filter(c => c.name === appRef.configData[sec].smallImageKey);
                    $("#rpcSmallImage").css("background", "url(https://cdn.discordapp.com/app-assets/" + appRef.configData.general.clientID + "/" + assetIDSmall[0].id + ".png)");
                    $("#rpcSmallImage").css("background-size", "100% 100%");
                }

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
        loadConfigFile: async function () {

            let response = await Neutralino.os.showDialogOpen({
                title: "Select Simple RPC Config File",
                isDirectoryMode: false,
                filter: "toml"
            });

            if (!response.selectedEntry.endsWith(".toml")) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Selected file is not a Simple RPC Config file or the file is corrupt!',
                    showConfirmButton: false,
                    timer: 2000
                });
            } else {

                let tomlFile = await Neutralino.filesystem.readFile({
                    fileName: response.selectedEntry
                });

                const tomlString = String(tomlFile.data);
                const data = TOML.parse(tomlString);

                if (data.general != null) {
                    app.configData = data;
                    app.configPath = response.selectedEntry;

                    // This API call runs through a proxy server, because JQUERY blocks calls to the discord API due to missing headers
                    // The proxy server is powered by this code: https://github.com/jesperorb/node-api-proxy
                    $.ajax({
                        type: "GET",
                        url: "https://rpc-proxy.herokuapp.com/" + app.configData.general.clientID + "/assets"
                    }).done(function (data, textStatus, jqXHR) {
                        app.appAssets = data;
                    });

                } else {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'error',
                        title: 'Selected file is not a Simple RPC Config file or the file is corrupt!',
                        showConfirmButton: false,
                        timer: 2000
                    });
                }

            }

        },
        saveConfig: async function () {

            var outFile = "";

            $.each(app.configData, function (key, value) {

                outFile += "[" + key + "]\n";

                $.each(value, function (subkey, subvalue) {

                   if (subkey !== "buttons" && subkey !== "worlds") {

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

                   }

                });

                outFile += "\n";
            });

            let response = await Neutralino.filesystem.writeFile({
                fileName: app.configPath,
                data: outFile
            });

            if (response) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Config file has been saved',
                    showConfirmButton: false,
                    timer: 2000
                });
            }

        },
        getSectIcon: function(sec) {

            switch (sec) {
                case "init":
                    return "fa fa-spinner text-primary"

                case "main_menu":
                    return "fa fa-list text-secondary"

                case "server_list":
                    return "fa fa-server text-warning"

                case "join_game":
                    return "fa fa-gamepad text-danger"

                case "single_player":
                    return "fa fa-user text-success"

                case "multi_player":
                    return "fa fa-users text-cyan"

                case "generic":
                    return "fa fa-tachometer-alt text-yellow"

                case "world_images":
                    return "fa fa-globe text-pink"
            }

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
})

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

    return input.startsWith("0") || input.startsWith("1") || input.startsWith("2") || input.startsWith("3") || input.startsWith("4") || input.startsWith("5") || input.startsWith("6") || input.startsWith("7") || input.startsWith("8") || input.startsWith("9");

}
