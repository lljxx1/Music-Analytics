
const express = require("express");
const cors = require("cors");
const app = express();
const API = require('./index.js');
const Dowanloader = require("../downloader/app");
const axios = require("axios");
import { webContents, BrowserWindow, Menu } from "electron";
const { session } = require('electron')
var expressWs = require('express-ws')(app);
// import API from './index'

// const API = {}

app.use(cors());
console.log("process.versions", require("./index.js"));

app.get("/downloader/create", async (req, res) => {
  var task = await Dowanloader.createTask();
  res.json({
    task: task
  });
});

app.get("/downloader/start", async (req, res) => {
  var task = Dowanloader.runDownloadTask(req.query);
  res.json({
    start: 1,
  });
});

app.get("/downloader/status", async (req, res) => {
  var status = await Dowanloader.getStatus(req.query);
  res.json({
    status: status,
  });
});

app.get("/versions", async (req, res) => {
    res.json({
        versions: process.versions, 
        API
    });
});

app.get("/api/find/source", async (req, res) => {
    try {
        res.json(API.findSources());
    } catch(e) {
        res.send(e.toString())
    }
});

app.get("/api/import", async (req, res) => {
    try {
        const rows = await API.importSource(req.query)
        res.json({
            state: rows
        });
    } catch (e) {
        res.json({
            error: 1,
            msg: e.toString()
        });
    }
});

app.get("/proxy/http/get", async (req, res) => {
  try {
    const callData = await axios.get(req.query.url);
    res.json({
        response: callData.data,
    });
  } catch (e) {
    res.json({
      error: 1,
      msg: e.toString(),
    });
  }
});
;

app.get("/api/tabs/create", async (req, res) => {
  try {
    var width = req.query.width || 800;
    var height = req.query.height || 600;
    const win = new BrowserWindow({
      darkTheme: true,
      width: parseInt(width),
      height: parseInt(height)
    });
    
    // Once dom-ready
    win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
        options.width = options.width === 800 ? 1024 : options.width;
        options.height = options.height === 600 ? 720 : options.height;
        (function loop() {
          const neteasts = webContents.getAllWebContents().filter(_ => {
            return _.webContents.getURL().indexOf('music.163.com') > -1
          }) 
          // console.log(neteasts)
          if(neteasts.length === 0) {
            setTimeout(loop, 300);
            return
          }
          if(neteasts.length) {
            neteasts.forEach(neteast => {
              console.log('excute script');
              neteast.webContents.executeJavaScript(`
              if(! window.iiiited) {
                console.log('inject api');
                window.iiiited = 1;
                var notify = window.opener ? window.opener : window.parent
                notify.postMessage(JSON.stringify({
                  method: '_musichelper.ready',
                }), '*');
                window.addEventListener("message", function (evt) {
                    try {
                      console.log('revice msg', evt.data)
                      var action = JSON.parse(evt.data);
                      if(action.method && action.method == "executeCode") {
                        if (
                          evt.origin == "https://music.wechatsync.com" ||
                          evt.origin == "http://localhost:8080"
                        ) {
                          try {
                            if(action.code) {
                              eval(action.code)
                            }
                          } catch (e) {
                            console.log('executeCode.failed', e)
                          }
                          console.log('executeCode')
                        }
                        return;
                      }
                    } catch (e) {}
                  });
                }
              `);
            })
          }
        })();
    });

    
    // win.webContents.once('dom-ready', () => {
    //   // THIS WORKS!!!
    //   win.webContents.executeJavaScript(`
    //   console.log('new window');
    //   window.addEventListener("message", function (evt) {
    //     try {
    //       var action = JSON.parse(evt.data);
    //       if(action.method && action.method == "executeCode") {
    //         if (
    //           evt.origin == "https://music.wechatsync.com" ||
    //           evt.origin == "http://localhost:8080"
    //         ) {
    //           try {
    //             if(action.code) {
    //               eval(action.code)
    //             }
    //           } catch (e) {
    //             console.log('executeCode.failed', e)
    //           }
    //           console.log('executeCode')
    //         }
    //         return;
    //       }
        
    //     } catch (e) {}
    //   });
    //   `)
    // })
    // session.loadExtension('C:\\Users\\fun\\Documents\\projects\\a-hot\\pcls\\music-recommendation\\MusicHelper')
    // Load a remote URL
    win.loadURL(req.query.url);
    // win.webContents.on('did-finish-load', () => {
    //   win.webContents.send('message', 'Hello second window!');
    // });
    res.json({
      status: 1,
    });
  } catch (e) {
    res.send(e.toString());
  }
});

// app.ws('/tags', function(ws, req) {
//   ws.on('message', function(msg) {
//     // console.log(msg);
//   });
//   console.log('socket', req.testing);
// });

app.get("/api/song/query", async (req, res) => {
    res.json(await API.listSongs(req.query));
});

export default app;