

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

async function getData(id = "1") {
  var api =
    new Buffer('aHR0cHM6Ly9oNWFwaS5tLnhpYW1pLmNvbS9oNS9tdG9wLmFsaW11c2ljLm11c2ljLnNvbmdzZXJ2aWNlLmdldHNvbmdkZXRhaWwvMS4wLw==', 'base64').toString();
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
