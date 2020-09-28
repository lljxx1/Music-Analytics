import { app, BrowserWindow, Menu } from 'electron'
// main/index.js
import { ipcMain } from 'electron'
import axios from 'axios'
import querystring from 'querystring'
// import { ebtMain } from 'electron-baidu-tongji'

// const isDevelopment = process.env.NODE_ENV !== 'production'
// ebtMain(ipcMain, isDevelopment)

ipcMain.on('baidu-tongji', (event, arg) => {
  console.log(arg)
  try {
    const type = arg[0][0]
    let eventParams = {};
    let siteId = '6cf3834b31b75f76863415637a5905f8'
    if(type == '_trackEvent') {
      eventParams = {
        kb: '0',
        cc: '1',
        ck: '1',
        cl: '24-bit',
        ds: '1920x1080',
        vl: '563',
        ep: [arg[0][1], arg[0][2], arg[0][3]].join('*'),
        et: '4',
        ja: '0',
        ln: 'zh-cn',
        lo: '0',
        // lt: '1601202075',
        rnd: Math.round(Math.random() * 10000000000),
        si: siteId,
        su: 'http://localhost:9080/#/',
        v: '1.2.76',
        lv: '2',
        api: '8_0',
        sn: '51027',
        r: '0',
        ww: '780',
        u: 'http://localhost:9080/#/'
      }
    } else {
      eventParams = {
        kb: '0',
        cc: '1',
        ck: '1',
        cl: '24-bit',
        ds: '1920x1080',
        vl: '563',
        et: '0',
        ja: '0',
        ln: 'zh-cn',
        lo: '0',
        // lt: '1601202075',
        rnd: Math.round(Math.random() * 10000000000),
        si: siteId,
        su: 'http://localhost:9080/#/',
        v: '1.2.76',
        lv: '2',
        api: '4_0',
        sn: '51068',
        r: '0',
        ww: '780',
        ct: '!!',
        u: 'http://localhost:9080'+arg[0][1],
        tt: '歌单助手'
      }
    }
    console.log(eventParams)
    axios.get('https://hm.baidu.com/hm.gif', {
      params: eventParams
    })
  } catch (e) {
  }
})

const apiServer = require('./exporter/api').default


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 900,
    webPreferences: {
      nodeIntegration: true, // add this
    },
  });
  Menu.setApplicationMenu(null)
  mainWindow.loadURL(winURL)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

apiServer.listen(8956);
// console.log("apiServer", apiServer);
/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
