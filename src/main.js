import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import fs from "fs";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

let mainWindow;

const createWindow = () => {
    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 720,
        frame: false, // Standard-Titelleiste entfernen
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        icon: 'assets/icon.png',
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`,
            ),
        );
    }
    // Open the DevTools.
    //mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();

    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// IPC-Kommunikation für Fensteraktionen
ipcMain.on("minimize-window", () => mainWindow.minimize());
ipcMain.on("maximize-window", () => {
    if (mainWindow.isMaximized()) {
        mainWindow.restore();
    } else {
        mainWindow.maximize();
    }
});
ipcMain.on("close-window", () => mainWindow.close());

ipcMain.handle("show-save-dialog", async (event, options) => {
    const result = await dialog.showSaveDialog(options);
    return result; 
});

ipcMain.handle("show-open-dialog", async (event, options) => {
    const result = await dialog.showOpenDialog(options);
    return result;
});

ipcMain.handle("write-file", async (event, filePath, data) => {
    try {
        await fs.promises.writeFile(filePath, data, "utf-8");
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
});

ipcMain.handle("read-file", async (event, filePath) => {
    try {
        const data = await fs.promises.readFile(filePath, "utf-8");
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
});
