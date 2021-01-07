// def __xiamiSign(self, params, token='', access_token=None):
//         appkey = '23649156'
//         t = str(int(time.time() * 1000))
//         request_str = {
//             'header': {'appId': '200', 'platformId': 'h5'},
//             'model': params
//         }
//         if access_token:
//             request_str['header']['accessToken'] = access_token
//         data = json.dumps({'requestStr': json.dumps(request_str)})
//         sign = '{}&{}&{}&{}'.format(token, t, appkey, data)
//         sign = md5(sign.encode('utf-8')).hexdigest()
//         params = {
//             't': t,
//             'appKey': appkey,
//             'sign': sign,
//             'data': data
//         }
//         return params
// !(function(n) {
//   "use strict";
//   function d(n, t) {
//     var r = (65535 & n) + (65535 & t);
//     return (((n >> 16) + (t >> 16) + (r >> 16)) << 16) | (65535 & r);
//   }
//   function f(n, t, r, e, o, u) {
//     return d(((c = d(d(t, n), d(e, u))) << (f = o)) | (c >>> (32 - f)), r);
//     var c, f;
//   }
//   function l(n, t, r, e, o, u, c) {
//     return f((t & r) | (~t & e), n, t, o, u, c);
//   }
//   function v(n, t, r, e, o, u, c) {
//     return f((t & e) | (r & ~e), n, t, o, u, c);
//   }
//   function g(n, t, r, e, o, u, c) {
//     return f(t ^ r ^ e, n, t, o, u, c);
//   }
//   function m(n, t, r, e, o, u, c) {
//     return f(r ^ (t | ~e), n, t, o, u, c);
//   }
//   function i(n, t) {
//     var r, e, o, u;
//     (n[t >> 5] |= 128 << t % 32), (n[14 + (((t + 64) >>> 9) << 4)] = t);
//     for (
//       var c = 1732584193, f = -271733879, i = -1732584194, a = 271733878, h = 0;
//       h < n.length;
//       h += 16
//     )
//       (c = l((r = c), (e = f), (o = i), (u = a), n[h], 7, -680876936)),
//         (a = l(a, c, f, i, n[h + 1], 12, -389564586)),
//         (i = l(i, a, c, f, n[h + 2], 17, 606105819)),
//         (f = l(f, i, a, c, n[h + 3], 22, -1044525330)),
//         (c = l(c, f, i, a, n[h + 4], 7, -176418897)),
//         (a = l(a, c, f, i, n[h + 5], 12, 1200080426)),
//         (i = l(i, a, c, f, n[h + 6], 17, -1473231341)),
//         (f = l(f, i, a, c, n[h + 7], 22, -45705983)),
//         (c = l(c, f, i, a, n[h + 8], 7, 1770035416)),
//         (a = l(a, c, f, i, n[h + 9], 12, -1958414417)),
//         (i = l(i, a, c, f, n[h + 10], 17, -42063)),
//         (f = l(f, i, a, c, n[h + 11], 22, -1990404162)),
//         (c = l(c, f, i, a, n[h + 12], 7, 1804603682)),
//         (a = l(a, c, f, i, n[h + 13], 12, -40341101)),
//         (i = l(i, a, c, f, n[h + 14], 17, -1502002290)),
//         (c = v(
//           c,
//           (f = l(f, i, a, c, n[h + 15], 22, 1236535329)),
//           i,
//           a,
//           n[h + 1],
//           5,
//           -165796510
//         )),
//         (a = v(a, c, f, i, n[h + 6], 9, -1069501632)),
//         (i = v(i, a, c, f, n[h + 11], 14, 643717713)),
//         (f = v(f, i, a, c, n[h], 20, -373897302)),
//         (c = v(c, f, i, a, n[h + 5], 5, -701558691)),
//         (a = v(a, c, f, i, n[h + 10], 9, 38016083)),
//         (i = v(i, a, c, f, n[h + 15], 14, -660478335)),
//         (f = v(f, i, a, c, n[h + 4], 20, -405537848)),
//         (c = v(c, f, i, a, n[h + 9], 5, 568446438)),
//         (a = v(a, c, f, i, n[h + 14], 9, -1019803690)),
//         (i = v(i, a, c, f, n[h + 3], 14, -187363961)),
//         (f = v(f, i, a, c, n[h + 8], 20, 1163531501)),
//         (c = v(c, f, i, a, n[h + 13], 5, -1444681467)),
//         (a = v(a, c, f, i, n[h + 2], 9, -51403784)),
//         (i = v(i, a, c, f, n[h + 7], 14, 1735328473)),
//         (c = g(
//           c,
//           (f = v(f, i, a, c, n[h + 12], 20, -1926607734)),
//           i,
//           a,
//           n[h + 5],
//           4,
//           -378558
//         )),
//         (a = g(a, c, f, i, n[h + 8], 11, -2022574463)),
//         (i = g(i, a, c, f, n[h + 11], 16, 1839030562)),
//         (f = g(f, i, a, c, n[h + 14], 23, -35309556)),
//         (c = g(c, f, i, a, n[h + 1], 4, -1530992060)),
//         (a = g(a, c, f, i, n[h + 4], 11, 1272893353)),
//         (i = g(i, a, c, f, n[h + 7], 16, -155497632)),
//         (f = g(f, i, a, c, n[h + 10], 23, -1094730640)),
//         (c = g(c, f, i, a, n[h + 13], 4, 681279174)),
//         (a = g(a, c, f, i, n[h], 11, -358537222)),
//         (i = g(i, a, c, f, n[h + 3], 16, -722521979)),
//         (f = g(f, i, a, c, n[h + 6], 23, 76029189)),
//         (c = g(c, f, i, a, n[h + 9], 4, -640364487)),
//         (a = g(a, c, f, i, n[h + 12], 11, -421815835)),
//         (i = g(i, a, c, f, n[h + 15], 16, 530742520)),
//         (c = m(
//           c,
//           (f = g(f, i, a, c, n[h + 2], 23, -995338651)),
//           i,
//           a,
//           n[h],
//           6,
//           -198630844
//         )),
//         (a = m(a, c, f, i, n[h + 7], 10, 1126891415)),
//         (i = m(i, a, c, f, n[h + 14], 15, -1416354905)),
//         (f = m(f, i, a, c, n[h + 5], 21, -57434055)),
//         (c = m(c, f, i, a, n[h + 12], 6, 1700485571)),
//         (a = m(a, c, f, i, n[h + 3], 10, -1894986606)),
//         (i = m(i, a, c, f, n[h + 10], 15, -1051523)),
//         (f = m(f, i, a, c, n[h + 1], 21, -2054922799)),
//         (c = m(c, f, i, a, n[h + 8], 6, 1873313359)),
//         (a = m(a, c, f, i, n[h + 15], 10, -30611744)),
//         (i = m(i, a, c, f, n[h + 6], 15, -1560198380)),
//         (f = m(f, i, a, c, n[h + 13], 21, 1309151649)),
//         (c = m(c, f, i, a, n[h + 4], 6, -145523070)),
//         (a = m(a, c, f, i, n[h + 11], 10, -1120210379)),
//         (i = m(i, a, c, f, n[h + 2], 15, 718787259)),
//         (f = m(f, i, a, c, n[h + 9], 21, -343485551)),
//         (c = d(c, r)),
//         (f = d(f, e)),
//         (i = d(i, o)),
//         (a = d(a, u));
//     return [c, f, i, a];
//   }
//   function a(n) {
//     for (var t = "", r = 32 * n.length, e = 0; e < r; e += 8)
//       t += String.fromCharCode((n[e >> 5] >>> e % 32) & 255);
//     return t;
//   }
//   function h(n) {
//     var t = [];
//     for (t[(n.length >> 2) - 1] = void 0, e = 0; e < t.length; e += 1) t[e] = 0;
//     for (var r = 8 * n.length, e = 0; e < r; e += 8)
//       t[e >> 5] |= (255 & n.charCodeAt(e / 8)) << e % 32;
//     return t;
//   }
//   function e(n) {
//     for (var t, r = "0123456789abcdef", e = "", o = 0; o < n.length; o += 1)
//       (t = n.charCodeAt(o)), (e += r.charAt((t >>> 4) & 15) + r.charAt(15 & t));
//     return e;
//   }
//   function r(n) {
//     return unescape(encodeURIComponent(n));
//   }
//   function o(n) {
//     return a(i(h((t = r(n))), 8 * t.length));
//     var t;
//   }
//   function u(n, t) {
//     return (function(n, t) {
//       var r,
//         e,
//         o = h(n),
//         u = [],
//         c = [];
//       for (
//         u[15] = c[15] = void 0,
//           16 < o.length && (o = i(o, 8 * n.length)),
//           r = 0;
//         r < 16;
//         r += 1
//       )
//         (u[r] = 909522486 ^ o[r]), (c[r] = 1549556828 ^ o[r]);
//       return (
//         (e = i(u.concat(h(t)), 512 + 8 * t.length)), a(i(c.concat(e), 640))
//       );
//     })(r(n), r(t));
//   }
//   function t(n, t, r) {
//     return t ? (r ? u(t, n) : e(u(t, n))) : r ? o(n) : e(o(n));
//   }
//   "function" == typeof define && define.amd
//     ? define(function() {
//         return t;
//       })
//     : "object" == typeof module && module.exports
//     ? (module.exports = t)
//     : (n.md5 = t);
// })(this);

// const fetch = require('node-fetch');
var isNodeEnv = typeof window === "undefined";
let cokJar = null;

// if (isNodeEnv) {
  var crypto = require("crypto");
  const nodeFetch = require("node-fetch");


console.log("nodeFetch", nodeFetch);
  const tough = require("tough-cookie");
  cokJar = new tough.CookieJar();
  const fetch = require("fetch-cookie")(nodeFetch, cokJar, false);
  function md5(str) {
    return crypto
      .createHash("md5")
      .update(str)
      .digest("hex");
  }
// }
// let accesToken = '51f81276cd653c3d829e3b1cf68f1c99rlfu2';
function requestAPI(params, access_token = "") {
  var token;
  if (isNodeEnv) {
    var cookies = cokJar
      .getCookiesSync("http://xiami.com/")
      .filter((_) => _.key == "_m_h5_tk");
    if (cookies.length) {
      token = cookies[0].value.split("_")[0];
    }
  } else {
    var cooks = document.cookie.match(/(?:^|;\s*)_m_h5_tk=([^;]*)/);
    if (cooks.length) {
      var tokenStr = cooks[1];
      token = tokenStr.split("_")[0];
    }
  }
  if (!token) {
    token = "";
  }
  var appkey = "23649156";
  var t = Date.now();
  var request_str = {
    header: { appId: "200", platformId: "h5" },
    model: params,
  };
  if (access_token) {
    request_str["header"]["accessToken"] = access_token;
  }
  var data = JSON.stringify({ requestStr: JSON.stringify(request_str) });
  var signStr = `${token}&${t}&${appkey}&${data}`;
  // console.log('signStr', signStr)
  var sign = md5(signStr);
  var params = {
    t: t,
    appKey: appkey,
    sign: sign,
    data: data,
  };
  return params;
}

var serialize = function(obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

async function login(params) {
  var api =
    "https://h5api.m.xiami.com/h5/mtop.alimusic.xuser.facade.xiamiuserservice.login/1.0/";
  var data = requestAPI({
    account: "1013221653@qq.com",
    password: md5("ACFUCK00000"),
  });
  console.log("data", data);
  var reqUrl = api + "?" + serialize(data);
  var req = await fetch(reqUrl, {
    body: null,
    method: "GET",
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip,deflate,sdch",
      "Accept-Language": "zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4",
      Connection: "keep-alive",
      Referer: "http://h.xiami.com",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
    },
  });
  return await req.json();
}

async function getData(id = "1") {
  var api =
    "https://h5api.m.xiami.com/h5/mtop.alimusic.music.songservice.getsongdetail/1.0/";
  var data = requestAPI({ songId: id });
  var reqUrl = api + "?" + serialize(data);
  var dataReq = await fetch(reqUrl, {
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    headers: {
      Accept: "*/*",
      "Accept-Encoding": "gzip,deflate,sdch",
      "Accept-Language": "zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4",
      Connection: "keep-alive",
      Referer: "http://h.xiami.com",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36",
    },
  });
  return await dataReq.json();
}

const os = require("os");
const fs = require("fs");
const homeDir = os.homedir() || `C:\\Users\\${userName}`;
const isWindows = process.platform == "win32";
const ini = require("ini");

let files = [];
if (isWindows) {
  files.push([
    `${homeDir}\\AppData\\Roaming\\Xiami\\xiami_info.ini`,
    `${homeDir}\\AppData\\Roaming\\Xiami\\Xiami.db`,
  ]);
} else {
const baseDir = `${homeDir}/Library/Application Support/com.xiami.macclient`
  const filePairs = []
  filePairs.push(`${baseDir}/DataBase/Music.sqlite`);
  if (fs.existsSync(baseDir)) {
    const dbDir = `${baseDir}/DataBase`;
    const avsAll = `${baseDir}/AVFSStorage`;
    const avfsDirs = fs
      .readdirSync(avsAll)
      .filter((_) => _.indexOf("favorite.songid@") > -1);
    if(avfsDirs.length) {
      console.log('fond', avfsDirs[0])
      filePairs.push(`${avsAll}/${avfsDirs[0]}/avfs.sqlite`);
    }
  }
  files.push(filePairs);
  console.log("files", files);
}

function isExists() {
  const existsFiles = files.filter((_) => {
    if (typeof _ == "string") {
      return fs.existsSync(_);
    } else {
      return _.filter((p) => fs.existsSync(p)).length == _.length;
    }
  });
  console.log("existsFiles", existsFiles);
  if (existsFiles.length == 0) {
    return null;
  }
//   existsFiles = existsFiles;
  const out = {
    existsFiles: existsFiles[0],
    // type: this.type,
    // name: this.name,
  };
  if (!isWindows) {
    out.tip = "点击【我的收藏】 > 【随机播放】后再导入";
  }
  return out;
}

const getXiamiSongIdsByMacAVFS = require("../exporter/platform/xiami_helpers")
  .getXiamiSongIdsByMacAVFS;
async function getCollectIds(xiamiConfigDatabase) {
    if(!isWindows) {
         const macConfig = {
           favsfile: files[0][1],
           dbFile: files[0][0],
           // skipCheck: true
         };
        return  await getXiamiSongIdsByMacAVFS(macConfig.favsfile);
    }
  // xiamiConfigDatabase = xiamiConfigDatabase || this.files[0][0];
  console.log("xiamiConfigDatabase", xiamiConfigDatabase);
  const configStr = fs.readFileSync(xiamiConfigDatabase, "utf-8");
  const config = ini.parse(configStr);
  const userId = config.xiami.USER_ID;
  const mapping = config.xiami[userId];
  const key = `${userId} = ${mapping};`;
  const lines = configStr.split("\n").filter((_) => _.indexOf(key) > -1);
  if (lines.length) {
    const songIds = lines[0]
      .replace(key, "")
      .split(",")
      .map((_) => _.trim())
      .filter((_) => !isNaN(parseInt(_)));
    return songIds;
  }
  return [];
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const { Song } = require("./db");
// const saveDir = "F:\\allsong";
const _ = require("lodash");
const sanitize = require("sanitize-filename");
const path = require("path");

  console.log("getXiamiSongIdsByMacAVFS", getXiamiSongIdsByMacAVFS);

//  const data = await getXiamiSongIdsByMacAVFS(opts.favsfile);
export async function createTask(params) {
  if (isExists()) {
    const songIds = await getCollectIds(files[0][0]);
    console.log("found", songIds.length);
    try {
      await Song.sync({ alter: true });
    } catch (e) {
      console.log(e);
    }
    try {
      await Song.bulkCreate(
        songIds.map((_) => {
          return {
            song_id: _,
            status: 0,
          };
        }),
        { ignoreDuplicates: true }
      );
    } catch (e) {}
    return songIds;;
  }

}

async function processTask(conf, taskData) {
  var songData = await getData(taskData.song_id);
  if (!songData.data.data) {
    return {
      status: 2,
    };
  }
  var detail = songData.data.data.songDetail;
  if (!detail.listenFile) {
    return {
      status: 3,
    };
  }

  // console.log(detail)
  var formatItem = {
    albumName: detail.albumName,
    albumLogo: detail.albumLogo,
    artistName: detail.artistName,
    lyric: detail.lyric,
    singers: detail.singers,
    songName: detail.songName,
    songId: detail.songId,
    styles: detail.styles,
    // detail: _.data.data.songDetail,
    listenFile: detail.listenFile,
    listenFiles: detail.listenFiles,
  };

  var saveData = {
    song_name: formatItem.songName,
    album_name: formatItem.albumName,
    artist_name: formatItem.artistName,
    album_logo: formatItem.albumLogo,
    artist_logo: detail.artistLogo,
    raw: JSON.stringify(detail),
    // local_file:
    // album_name: formatItem.albumName
  };

  var bestMp3 = formatItem.listenFiles.filter((_) => _.format === "mp3");
  var sortByFileSize = _.orderBy(bestMp3, ["filesize"], ["desc"]);
  var bestMp3File = sortByFileSize[0];
  var tackCount = detail.track;

  var saveAlbumDir = sanitize(
    `${formatItem.artistName} - ${formatItem.albumName}`
  );
  var songName = sanitize(`${tackCount} ${formatItem.songName}.mp3`);
  var saveDir = conf.saveDir || "F:\\allsong";
  var albumDir = path.join(saveDir, saveAlbumDir);
  var destFileName = path.join(albumDir, songName);
  var targetFile = bestMp3File.url;
  saveData.local_file = destFileName;
  if (!fs.existsSync(albumDir)) {
    fs.mkdirSync(albumDir);
  }
  // fileReq
  try {
    var remoteFileRes = await fetch(targetFile);
    var downloadResult = await new Promise((resolve, reject) => {
      const destFile = fs.createWriteStream(destFileName);
      remoteFileRes.body.pipe(destFile);
      remoteFileRes.body.on("end", () => resolve("it worked"));
      destFile.on("error", reject);
    });
    // console.log('file downloaed', downloadResult)
    console.log(destFileName);
    saveData.status = 1;
    return saveData;
  } catch (e) {
    console.log("failed", e);
    saveData.status = 4;
  }
  return saveData;
}


async function doTask(conf, params) {
  var state = await processTask(conf, params);
  await Song.update(state, {
    where: {
      song_id: params.song_id,
    },
  });
}

let startTime = Date.now();
let procceds = 0;
let timer = null;
let isRunning = false;
let currentSpeed = null;


export async function getStatus() {
  var undoneTasks = await Song.findAll({
    where: {
      status: 0,
    },
  });
  var doneTasks = await Song.findAll({
    where: {
      status: 1,
    },
  });
  var failedTasks = await Song.findAll({
    where: {
      status: {
        $gt: 1
      },
    },
  });
  return {
    currentSpeed: currentSpeed,
    undone: undoneTasks.length,
    // undoneTasks: undoneTasks,
    doneTasks: doneTasks,
    failed: failedTasks,
  };
}

export async function runDownloadTask(conf) {
    if (isRunning) {
        console.log('task running')
        return {
            isRunning: true
        };
    } 
    
    var data = await getData();
    console.log("data", data);
    var workerCount = conf.workerCount || 10;
    var notDoneTasks = await Song.findAll({
        where: {
            status: 0,
        },
        limit: 100,
    });
  if (!notDoneTasks.length) {
    timer = setTimeout(function() {
      runDownloadTask();
    }, 10 * 1000);
    return;
  }

  isRunning = true;

  const stepItems = chunk(notDoneTasks, workerCount);
  for (let index = 0; index < stepItems.length; index++) {
    const songs = stepItems[index];
    const saveRows = await Promise.all(
      songs.map((songId) => {
        return doTask(conf, songId);
      })
    );
    procceds += saveRows.length;
    var timePass = Date.now() - startTime;
    currentSpeed = (procceds / timePass) * 1000;
    currentSpeed = currentSpeed.toFixed(2);
    console.log("many", currentSpeed);
    // try {
    //     const songUrls = bulkSongMetas.filter(_ => _.data.data).map(_ => {
    //         if(!_.data.data) {
    //             console.log(_)
    //             process.exit(0);
    //         }
    //         var detail = _.data.data.songDetail;
    //         return {
    //             albumName: detail.albumName,
    //             albumLogo: detail.albumLogo,
    //             artistName: detail.artistName,
    //             lyric: detail.lyric,
    //             singers: detail.singers,
    //             songName: detail.songName,
    //             songId: detail.songId,
    //             styles: detail.styles,
    //             // detail: _.data.data.songDetail,
    //             listenFile: detail.listenFile,
    //             listenFiles: detail.listenFiles,
    //         }
    //     })
    //      console.log('bulkSongMetas', songUrls)
    // } catch(e) {
    //     console.log(bulkSongMetas)
    // }
  }
  timer = setTimeout(function() {
    runDownloadTask();
  }, 20);
};

// exports = {
//   createTask: createTask,
//   getStatus: getStatus,
//   runDownloadTask: runDownloadTask,
// }
// (async () => {
//   await getData();
//   var testS = await getData("1795478184");
//   console.log(testS.data.data);
//   if (isExists()) {
//     await createTask();
//     var tasks = await Song.findAll({
//       where: {
//         status: 0,
//       },
//     });
//     console.log("undone tasks", tasks.length);
//     runDownloadTask({
//       saveDir: '/Users/fun/Downloads/songs'
//     });
//   }
// })();
