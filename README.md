# Simple RPC Config Editor

---

### What the heck is this?

This program/piece of software was created to simplify the process of editing [Simple RPC](https://www.curseforge.com/minecraft/mc-mods/simple-discord-rpc) config files.

The aim of this software is to allow you to edit config files without having to touch a single line of code, will also giving you a realtime mockup of what your Discord Presence will look like.

### Supported Config Files

* Simple RPC Client/Translated Config Files
* Simple RPC Server Entries Config Files

**Please note that this editor only supports the new TOML based config files, and not the old JSON Format files**

## Installation

Since the update to the new framework, only installers are available. I may add a workaround in the future, but for now, you need to use the installer. The app should auto-update as new versions release.

No extra dependencies are needed.

## Supported Platforms

This app works on Windows, Linux and MacOS

## Technologies Used

#### _Frontend_

* [Bootstrap 4](https://getbootstrap.com) -> User Interface
* [VUE.js](https://vuejs.org/) -> Data handling and realtime updates
* [Font Awesome](https://fontawesome.com/) -> Icons

#### _Backend_

* [Tauri](https://tauri.studio/) -> The main framework that interacts with the OS as well as the app used to package the executables

#### _Additional Libraries/Plugins_

* A modified version of [Fast-Toml](https://github.com/hypherionmc/fast-toml/) -> Used to parse the TOML files

---

## Building from source

* First, follow the Platform specific setup, listed here: [Tauri Setup](https://tauri.studio/docs/getting-started/prerequisites)
* Next, run `yarn tauri init` or `npm run tauri init` to download all the needed javascript packages
* To test the app, run `yarn tauri:serve` or `npm run tauri:serve`
* To build a "release", you can run `yarn tauri:build` or `npm run tauri:build`

## Contributing

Contributions are welcome, and I have no specific formatting requirements, just try to match mine where possible (even if it's terrible).

---

This app and code is licensed under the MIT license, but I do request that you change the name if you plan on releasing this yourself.
