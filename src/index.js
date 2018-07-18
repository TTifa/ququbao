const { app, dialog, autoUpdater, BrowserWindow, Menu, Tray, globalShortcut, ipcMain } = require('electron')
const ShortcutCapture = require('shortcut-capture')
const menu = require('./tray.js')

const config = require('../package.json')
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const feedUrl = 'http://localhost:10013/latest'

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

let tray = null
function createTray () {
  tray = new Tray(`${__dirname}/assets/icon/tray.png`)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '菜单',
      type: 'submenu',
      submenu:
      [{ label: '新消息', click: () => { menu.newMessage(tray) } },
        { label: '清除消息', click: () => { menu.clearMessage(tray) } }]
    },
    { label: '打开', type: 'normal', click: menu.newWindow },
    { type: 'separator' },
    { label: '退出', type: 'normal', click: menu.quit }
  ])
  tray.setToolTip('This is ququbao application.')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    if (mainWindow == null) {
      createWindow()
    } else {
      mainWindow.show()
    }
  })
}

function sendMessage (text) {
  mainWindow.webContents.send('ping', text)
}

function initUpdates () {
  // const platform = `${process.platform}_${process.arch}`;
  // const version = app.getVersion();

  autoUpdater.setFeedURL(feedUrl)

  autoUpdater.on('error', (e) => {
    sendMessage(e)
  })

  autoUpdater.on('checking-for-update', (e) => {
    sendMessage(`checking for update:${e}`)
  })

  autoUpdater.on('update-available', (e) => {
    sendMessage(`update-available:${e}`)
  })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: process.platform === 'win32' ? releaseName : releaseNotes,
      detail: 'A new version has been downloaded. Restart the application to apply the updates.'
    }

    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.checkForUpdates()
}

function initScreenShot () {
  const screenshort = new ShortcutCapture()
  // 注册截图快捷键
  globalShortcut.register('ctrl+alt+s', () => screenshort.shortcutCapture())
  ipcMain.on('screen-shot', (event, arg) => {
    console.log(arg)
    screenshort.shortcutCapture()
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  createTray()

  mainWindow.webContents.on('did-finish-load', () => {
    sendMessage(config.version)
    sendMessage(process.argv[1])
    initScreenShot()

    if (process.argv[1] !== '--squirrel-firstrun') {
      initUpdates()
    }
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
