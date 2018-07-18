const { Notification, app, BrowserWindow } = require('electron')

function quit () {
  try {
    app.exit()
  } catch (err) {
    console.log(err)
  }
}

let trayTimer
function newMessage (tray) {
  const message = new Notification({
    title: '标题',
    body: `通知正文内容${__dirname}`
  })
  message.show()
  message.on('click', () => {
    console.log('通知被点击')
  })

  let count = 0
  trayTimer = setInterval(() => {
    count++
    if (count % 2 === 0) {
      tray.setImage(`${__dirname}/assets/icon/tray.png`)
    } else {
      tray.setImage(`${__dirname}/assets/icon/tray_new.png`)
    }
  }, 500)
}

function clearMessage (tray) {
  clearInterval(trayTimer)
  trayTimer = null
  tray.setImage(`${__dirname}/assets/icon/tray.png`)
}

function newWindow () {
  var win = new BrowserWindow({
    width: 800,
    height: 600
  })

  // and load the index.html of the app.
  win.loadURL('http://www.baidu.com')
}

module.exports = {
  quit,
  newMessage,
  clearMessage,
  newWindow
}
