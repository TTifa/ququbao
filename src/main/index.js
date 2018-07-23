var Ququbao = require('./ququbao')
const {app} = require('electron')
if (require('electron-squirrel-startup')) {
  app.quit()
} else {
  var ququbao = new Ququbao()
}
