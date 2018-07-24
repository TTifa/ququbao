module.exports = {
  packagerConfig: {
    packageManager: 'npm',
    icon: 'src/assets/icon/ququbao.ico',
    appCopyright: 'Copyright © 2018 farwind',
    osxSign: {
      identity: 'Developer ID Application:'
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        description: 'create by chan',
        setupIcon: 'src/assets/icon/ququbao.ico',
        loadingGif: 'src/assets/img/install.gif'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: [
        'darwin'
      ]
    }
  ]
}
