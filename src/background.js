'use strict'

import {app, BrowserWindow, dialog, ipcMain, protocol, shell, clipboard} from 'electron'
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import installExtension, {VUEJS_DEVTOOLS} from 'electron-devtools-installer'
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(app.getAppPath(), 'preload.js')
    }
  })

  win.setMenu(null);
  
  win.webContents.on('before-input-event', (event, input) => {
	  if (input.control && input.shift && input.key.toLowerCase() === 'i') {
		win.openDevTools()
		event.preventDefault()  
	  }
  })

  ipcMain.on('set-title', (event, title) => {
    const webContents = event.sender;
    const win = BrowserWindow.fromWebContents(webContents);
    win.setTitle(title);
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.handle('load-file', async (event) => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    title: "Select Simple RPC Config File",
    openFile: true,
    filters: [
      {name: "Simple RPC Toml File", extensions: ["toml"]}
    ],
  });

  return {
    canceled: canceled,
    filePath: filePaths[0]
  };
})

ipcMain.handle('get-versions', async (event) => {
  return {
    appVer: app.getVersion(),
    osName: os.version() + " (" + os.arch() + ")",
    osPlatform: os.platform(),
    node: process.versions.node,
    chrome: process.versions.chrome
  }
})

ipcMain.handle('read-config', async (event, path) => {
  return fs.readFileSync(path, {
    encoding: 'utf-8'
  });
})

ipcMain.handle('load-url', async (event, url) => {
  await shell.openExternal(url);
})

ipcMain.handle('save-config', async (event, path, data) => {
  fs.writeFile(path, data, ret => {
    console.log(ret);
  })
})

ipcMain.handle('copy-clipboard', async (event, data) => {
  clipboard.writeText(data, 'clipboard');
})
