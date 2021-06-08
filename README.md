# Simple RPC Config Editor

---

### What the heck is this?

This program/piece of software was created to simplify the process of editing [Simple RPC](https://www.curseforge.com/minecraft/mc-mods/simple-discord-rpc) config files.

The aim of this software is to allow you to edit config files without having to touch a single line of code, will also giving you a realtime mockup of what your Discord Presence will look like.

### Supported Config Files

**Please note that this editor only supports the new TOML based config files, and not the old JSON Format files**

### Known Issues

* The SelectFile dialog opens behind the main app window -> Issue reported [HERE](https://github.com/neutralinojs/neutralinojs/issues/472)
* Comments are removed from saved Config files -> This is a FAST-TOML limitation, and will be fixed in the future, but it's not a priority at this time

## Installation

This app is designed to be portable, so no installation is required. Simply grab the latest version from the RELEASES section, unzip the file and run the app. No extra dependencies are needed.

## Supported Platforms

This app works on Windows, Linux and MacOS

## Technologies Used

#### _Frontend_

* [Bootstrap 4](https://getbootstrap.com) -> User Interface
* [VUE.js](https://vuejs.org/) -> Data handling and realtime updates
* [Argon Dashboard](https://www.creative-tim.com/product/argon-dashboard) -> The theme used on the User Interface (Modifications have been made)
* [Font Awesome](https://fontawesome.com/) -> Icons
* [Nucleo](https://nucleoapp.com/) -> Icons

#### _Backend_

* [Neutralino](https://neutralino.js.org/) -> The main framework that interacts with the OS as well as the app used to package the executables

#### _Additional Libraries/Plugins_

* A modified version of [Fast-Toml](https://github.com/hypherionmc/fast-toml/) -> Used to parse the TOML files

---

## Building from source

#### Required Software

* Node.js v14 or newer
* NPM

#### Setting up an environment

* Clone/download this repo to your pc
* Then run the following commands

```bash
$ npm i -g @neutralinojs/neu
$ cd folder/where/you/cloned/this/repo
$ neu run
```

To build the app from source, just replace `neu run` with `neu build`. This will then build the Windows, Linux and Mac executables.


## Contributing

Contributions are welcome, and I have no specific formatting requirements, just try to match mine where possible (even if it's terrible).


---

## Licenses

* [NeutralinoJS](https://github.com/neutralinojs/neutralinojs/blob/master/LICENSE) -> MIT LICENSE
* [Argon](https://github.com/timcreative/freebies/blob/master/LICENSE.md) -> MIT License

This app and code is licensed under the MIT license, but I do request that you change the name if you plan on releasing this yourself.