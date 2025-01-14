const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    minimizeWindow: () => ipcRenderer.send("minimize-window"),
    maximizeWindow: () => ipcRenderer.send("maximize-window"),
    closeWindow: () => ipcRenderer.send("close-window"),
    showSaveDialog: async (options) => {
        return ipcRenderer.invoke("show-save-dialog", options);
    },
    showOpenDialog: async (options) => {
        return ipcRenderer.invoke("show-open-dialog", options);
    },
    writeFile: async (filePath, data) => {
        return ipcRenderer.invoke("write-file", filePath, data);
    },
    readFile: async (filePath) => {
        return ipcRenderer.invoke("read-file", filePath);
    }
});
