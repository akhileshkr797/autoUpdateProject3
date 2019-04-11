const electron = require('electron')
const { app, webContents, BrowserWindow } = electron
const { autoUpdater } = require("electron-updater")

const path = require('path')
const url = require('url')

let mainWindow

function createWindow() {



    mainWindow = new BrowserWindow({
        show: false,
        width: 1300,
        height: 800,
        title: 'MAIN',
        backgroundColor: '#cce'
    })

    //mainWindow.webContents.openDevTools()

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('close', function() {
        mainWindow = null
    })
}

app.on('ready', () => {
    createWindow()

    autoUpdater.checkForUpdates();
})



//auto-update

function sendStatusToWindow(text) {
    mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});

autoUpdater.on('update-downloaded', (info) => {
    setTimeout(function() {
        autoUpdater.quitAndInstall()
    }, 500)
})