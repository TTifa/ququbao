const {app, ipcMain, BrowserWindow} = require('electron')
const tray = require('./tray')
const Notify = require('./notify')
const mainWin = require('./mainWin')
const autoupdate = require('./autoupdate')
const ShortcutCapture = require('shortcut-capture')
const shortcut = require('./shortcut')

module.exports = class Ququbao {
  constructor () {
    this.init()
      .then(() => {
        this.ready(() => {
          // 同时只能运行一个实例
          if (app.makeSingleInstance(() => this.showMainWin())) {
            return app.quit()
          }
          // 移除窗口菜单
          // Menu.setApplicationMenu(null)
          this.initMainWin()
          this.initTray()

          this.$mainWin.webContents.on('did-finish-load', () => {
            this.$mainWin.webContents.send('ping', process.version)
            this.$mainWin.webContents.send('ping', process.argv[1])
          })

          this.initUpdate()
          this.initNotify()
          this.initScreenCapture()
          this.bindShortcut()
        })
      })
  }

  /**
   * 初始化
   * @return {Promise} setting
   */
  async init () {

  }

  /**
   * 初始化主窗口
   */
  initMainWin () {
    this.$mainWin = mainWin(this)()
  }

  /**
   * 初始化托盘图标
   */
  initTray () {
    this.$tray = tray(this)()
  }

  /**
   * 初始化消息提示
   */
  initNotify () {
    this.$notify = new Notify()
    ipcMain.on('notify', (e, body) => this.$notify.show(body))
    this.$notify.on('click', () => this.showMainWin())
  }

  /**
   * 初始化更新
   */
  initUpdate () {
    if (process.argv[1] !== '--squirrel-firstrun') {
      autoupdate(this)()
    }
  }

  /**
   * 初始化截图
   */
  initScreenCapture () {
    this.$shortcutCapture = new ShortcutCapture()
    ipcMain.on('global-shortcut-capture', (event, arg) => this.$shortcutCapture.shortcutCapture())
  }

  /**
   * 绑定快捷键
   */
  bindShortcut () {
    shortcut(this)()
  }

  /**
   * 应用初始化之后执行回掉函数
   * @param {Function} callback
   * @return {Promise}
   */
  ready (callback) {
    return new Promise((resolve, reject) => {
      const ready = () => {
        if (typeof callback === 'function') {
          callback()
        }
        resolve()
      }
      if (app.isReady()) return ready()
      app.once('ready', () => ready())
      app.once('window-all-closed', () => {
        console.log('window all closed')
        if (!this.$tray.isDestroyed()) this.$tray.destroy()
      })
    })
  }

  /**
   * 截图
   */
  shortcutCapture () {
    if (this.shortcutCapture) {
      this.$shortcutCapture.shortcutCapture()
    }
  }

  /**
   * 退出应用
   */
  quit () {
    if (!this.$tray.isDestroyed()) this.$tray.destroy()
    BrowserWindow.getAllWindows()
      .forEach(item => {
        if (!item.isDestroyed()) item.destroy()
      })
    app.quit()
  }

  /**
   * 显示主窗口
   */
  showMainWin () {
    if (this.$mainWin) {
      this.$mainWin.show()
      this.$mainWin.focus()
    }
  }

  newWin (url) {
    var win = new BrowserWindow({
      title: '蛐蛐宝',
      width: 960,
      height: 600,
      minWidth: 720,
      minHeight: 450,
      useContentSize: true,
      center: true,
      frame: true,
      show: true,
      backgroundColor: '#5a83b7',
      resizable: true
    })

    win.loadURL(url)
  }
}
