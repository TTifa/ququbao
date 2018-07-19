const {ipcRenderer} = require('electron')

ipcRenderer.on('ping', (event, message) => {
  console.log(message)
})

const notification = {
  title: '基本通知',
  body: '短消息部分'
}
const notificationButton = document.getElementById('basic-noti')
notificationButton.addEventListener('click', () => {
  window.Notification.requestPermission((PERMISSION) => {
    if (PERMISSION === 'granted') {
      const myNotification = new window.Notification(notification.title, notification)

      myNotification.onclick = () => {
        console.log('Notification clicked')
      }
    } else {
      console.log('用户无情残忍的拒绝了你!!!')
    }
  })
})
const scButton = document.getElementById('screenshot')
scButton.addEventListener('click', () => {
  ipcRenderer.send('global-shortcut-capture', 1)
})
