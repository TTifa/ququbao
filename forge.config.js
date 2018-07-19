module.exports = {
  packagerConfig: {
    packageManager: 'npm',
    icon: 'src/assets/icon/ququbao.ico'
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
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        background: 'src/assets/img/dmg-background.png',
        format: 'UFLO'
      }
    }
  ],
  github_repository: {
    'owner': '',
    'name': ''
  }
}
