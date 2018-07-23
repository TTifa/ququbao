
const { autoUpdater, dialog } = require('electron')
const feedUrl = 'http://owrlb7i7j.bkt.clouddn.com/ququbao'
module.exports = ququbao => () => {
  // const platform = `${process.platform}_${process.arch}`
  autoUpdater.setFeedURL(`${feedUrl}/${process.platform}/latest`)

  autoUpdater.on('error', (e) => {
    sendMessage(ququbao.$mainWin, e)
  })

  autoUpdater.on('checking-for-update', () => {
    sendMessage(ququbao.$mainWin, 'checking for update')
  })

  autoUpdater.on('update-available', (e) => {
    sendMessage(ququbao.$mainWin, 'update-available')
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
      if (response === 0) {
        autoUpdater.quitAndInstall()
        ququbao.quit()
      }
    })
  })

  autoUpdater.checkForUpdates()
}

function sendMessage (win, text) {
  win.webContents.send('ping', text)
}
