const { app, Notification } = require('electron')
const Events = require('events')
const path = require('path')

module.exports = class Notify extends Events {
  /**
   * 显示消息
   * @param {string} body
   */
  show (body) {
    this.close()
    this.$notify = new Notification({
      title: '蛐蛐宝',
      body,
      icon: path.join(app.getAppPath(), './src/assets/icon/tray.png')
    })
    this.$notify.on('click', () => {
      this.close()
      this.emit('click')
    })
    this.$notify.show()
  }

  /**
   * 关闭消息
   */
  close () {
    if (this.$notify) {
      this.$notify.close()
      this.$notify = null
    }
  }
}
