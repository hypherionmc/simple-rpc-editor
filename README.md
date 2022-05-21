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

MacOS and Windows have both Portable versions and Installers available. There is no difference in these, aside from one of them creating shortcuts, and the other not.

Sadly, since electron requires code signing on MacOS for auto updates to work, the app no longer includes any form of auto updating, but instead displays a prompt whenever a new update is released.

## Supported Platforms

This app works on Windows, Linux and MacOS

## Technologies Used

#### _Frontend_

* [Bootstrap 4](https://getbootstrap.com) -> User Interface
* [VUE.js](https://vuejs.org/) -> Data handling and realtime updates
* [Font Awesome](https://fontawesome.com/) -> Icons

#### _Backend_

* [Electron](https://www.electronjs.org/) -> The main framework that interacts with the OS as well as the app used to package the executables

#### _Additional Libraries/Plugins_

* A modified version of [Fast-Toml](https://github.com/hypherionmc/fast-toml/) -> Used to parse the TOML files

---

## Building from source

* Fork and clone this repo to your local machine
* Next, run `yarn` or `npm install` to download all the needed javascript packages
* To test the app, run `yarn electron:serve` or `npm run electron:serve`
* To build a "release", you can run `yarn electron:build` or `npm run electron:build`

## Contributing

Contributions are welcome, and I have no specific formatting requirements, just try to match mine where possible (even if it's terrible).

---

This app and code is licensed under the MIT license, but I do request that you change the name if you plan on releasing this yourself.
