const { app, dialog, autoUpdater, BrowserWindow, Menu, Tray, globalShortcut, ipcMain } = require('electron')
const menu = require('./tray.js')
const config = require('../package.json')
const ShortcutCapture = require('shortcut-capture')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit()
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let tray = null
const feedUrl = 'http://owrlb7i7j.bkt.clouddn.com/ququbao'

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
    { label: '退出', type: 'normal', click: () => { menu.quit(tray) } }
  ])
  tray.setToolTip('蛐蛐宝')
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
  // const platform = `${process.platform}_${process.arch}`
  autoUpdater.setFeedURL(`${feedUrl}/${process.platform}/latest`)

  autoUpdater.on('error', (e) => {
    sendMessage(e)
  })

  autoUpdater.on('checking-for-update', () => {
    sendMessage('checking for update')
  })

  autoUpdater.on('update-available', (e) => {
    sendMessage('update-available')
  })

  autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'question',
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

let _shortcutCapture
function initScreenShot () {
  _shortcutCapture = new ShortcutCapture()
  // 注册截图快捷键
  globalShortcut.register('ctrl+alt+s', () => _shortcutCapture.shortcutCapture())
  ipcMain.on('global-shortcut-capture', (event, arg) => _shortcutCapture.shortcutCapture())
}

var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  // 当另一个实例运行的时候，这里将会被调用，我们需要激活应用的窗口
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
  return true
})

// 这个实例是多余的实例，需要退出
if (shouldQuit) {
  app.quit()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  createTray()
  initScreenShot()
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
