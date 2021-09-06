# Simple RPC Config Editor

---

### This is an experimental build and is not yet intended for use other than testing

___

### What the heck is this?

This program/piece of software was created to simplify the process of editing [Simple RPC](https://www.curseforge.com/minecraft/mc-mods/simple-discord-rpc) config files.

The aim of this software is to allow you to edit config files without having to touch a single line of code, will also giving you a realtime mockup of what your Discord Presence will look like.

### Supported Config Files

**Please note that this editor only supports the new TOML based config files, and not the old JSON Format files**

### Known Issues

* Comments are removed from saved Config files -> This is a FAST-TOML limitation, and will be fixed in the future, but it's not a priority at this time

## Installation

This app is designed to be portable, so no installation is required. Simply grab the latest version from the RELEASES section, unzip the file and run the app. No extra dependencies are needed.

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

### Coming soon

## Contributing

Contributions are welcome, and I have no specific formatting requirements, just try to match mine where possible (even if it's terrible).

---

This app and code is licensed under the MIT license, but I do request that you change the name if you plan on releasing this yourself.
