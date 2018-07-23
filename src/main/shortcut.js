const { globalShortcut } = require('electron')

module.exports = ququbao => () => {
  const actions = {
    'ctrl+alt+s': () => ququbao.shortcutCapture()
  }

  // 注销所有的快捷键
  globalShortcut.unregisterAll()
  Object.keys(actions)
    .forEach(key => {
      globalShortcut.register(key, actions[key])
    })
}
