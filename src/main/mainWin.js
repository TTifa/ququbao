var path = require('path')
var { app, BrowserWindow, shell, ipcMain } = require('electron')

module.exports = ququbao => () => {
  if (ququbao.$mainWin) {
    ququbao.showMainWin()
    return
  }
  // 创建浏览器窗口
  const $win = new BrowserWindow({
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
    icon: path.join(app.getAppPath(), './src/assets/icon/tray.png'),
    resizable: true
  })

  /**
   * 优雅的显示窗口
   */
  $win.once('ready-to-show', () => {
    $win.show()
    $win.focus()
  })

  /**
   * 窗体关闭事件处理
   * 默认只会隐藏窗口
   */
  $win.on('close', (e) => {
    e.preventDefault()
    $win.hide()
  })

  // 浏览器中打开链接
  $win.webContents.on('new-window', (e, url) => {
    e.preventDefault()
    if (url !== 'about:blank') {
      shell.openExternal(url)
    }
  })

  ipcMain.on('MAINWIN:window-minimize', () => $win.minimize())

  ipcMain.on('MAINWIN:window-maximization', () => {
    if ($win.isMaximized()) {
      $win.unmaximize()
    } else {
      $win.maximize()
    }
  })

  ipcMain.on('MAINWIN:window-close', () => {
    $win.hide()
  })
  ipcMain.on('MAINWIN:window-show', () => {
    $win.show()
    $win.focus()
  })

  // 加载URL地址
  $win.loadURL(`file://${path.join(app.getAppPath(), './src/page/index/index.html')}`)
  $win.webContents.openDevTools()
  return $win
}
