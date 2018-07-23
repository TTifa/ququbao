const path = require('path')
const { app, Tray, Menu } = require('electron')

module.exports = ququbao => () => {
  if (ququbao.$tray) {
    return
  }
  // 生成托盘图标及其菜单项实例
  const $tray = new Tray(path.join(app.getAppPath(), './src/assets/icon/tray.png'))

  // 设置鼠标悬浮时的标题
  $tray.setToolTip('蛐蛐宝')
  // 绑定菜单
  $tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '显示窗口',
      click: () => ququbao.showMainWin()
    },
    {
      label: '新窗口',
      click: () => ququbao.newWin('http://www.baidu.com')
    },
    {
      label: '消息',
      type: 'submenu',
      submenu:
    [{ label: '新消息',
      click: () => {
        ququbao.$notify.show('新消息')
        $tray.flicker()
      } },
    { label: '清除消息',
      click: () => {
        $tray.recover()
      }
    }]
    },
    {
      label: '退出',
      click: () => ququbao.quit()
    }
  ]))

  $tray.on('click', () => ququbao.showMainWin())

  $tray.flicker = function () {
    let count = 0
    this.trayTimer = setInterval(() => {
      count++
      if (count % 2 === 0) {
        $tray.setImage(path.join(app.getAppPath(), './src/assets/icon/tray.png'))
      } else {
        $tray.setImage(path.join(app.getAppPath(), './src/assets/icon/tray_new.png'))
      }
    }, 500)
  }

  $tray.recover = function () {
    clearInterval(this.trayTimer)
    this.trayTimer = null
    $tray.setImage(path.join(app.getAppPath(), './src/assets/icon/tray.png'))
  }

  return $tray
}
