const { contextBridge, ipcRenderer } = require('electron');

console.log("Loaded Preload.js");

contextBridge.exposeInMainWorld('appApi', {
   openFile: () => ipcRenderer.invoke('load-file'),
   setTitle: (title) => ipcRenderer.send('set-title', title),
   appVersion: () => ipcRenderer.invoke('get-versions'),
   readFile: (path) => ipcRenderer.invoke("read-config", path),
   openExternal: (url) => ipcRenderer.invoke("load-url", url),
   saveConfig: (path, data) => ipcRenderer.invoke("save-config", path, data),
   copyClipboard: (data) => ipcRenderer.invoke('copy-clipboard', data),
   envVersions: () => process.versions
});
