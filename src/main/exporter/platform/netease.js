const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const isWindows = process.platform == "win32";
const userName = require("os").userInfo().username;
const sqlite3 = require('sqlite3');
const os = require('os');
console.log("userName", userName);
const homeDir = os.homedir() || `C:\\Users\\${userName}`;

let files = [];
if (isWindows) {
  files.push(
    `${homeDir}\\AppData\\Local\\Netease\\CloudMusic\\Library\\webdb.dat`
  );
} else {
  files.push(
    `${homeDir}/Library/Containers/com.netease.163music/Data/Documents/storage/sqlite_storage.sqlite3`
  );
}

class Netease {
  constructor() {
    this.type = "cloudmusic";
    this.name = "网易云音乐";
    this.existsFiles = []
  }
  isExists() {
    console.log("checkfiles", files);
    const existsFiles = files.filter((_) => fs.existsSync(_));
    console.log("existsFiles", existsFiles);
    if (existsFiles.length == 0) {
        return null;
    }
    this.existsFiles = existsFiles;
      return {
        existsFiles: existsFiles[0],
        type: this.type,
        name: this.name,
      };
  }

  getDebug () {
    const debugInfo = {}
    debugInfo.env = {
      APPDATA: process.env.APPDATA,
      USERPROFILE: process.env.USERPROFILE,
      HOME: process.env.HOME,
      platform: process.platform,
      uinfo: os.userInfo()
    };

    if(!isWindows) {
      const macBaseDirectory = `${homeDir}/Library/Containers/com.netease.163music`
      debugInfo.hasFolder = fs.existsSync(macBaseDirectory)
      if(debugInfo.hasFolder) {
        debugInfo.childFolders = fs.readdirSync(macBaseDirectory)
        const storageBaseFile = `${macBaseDirectory}/Data/Documents/storage/`
        debugInfo.hasStorage = fs.existsSync(storageBaseFile)
        if (debugInfo.hasStorage) {
          debugInfo.storageFiles = fs.readdirSync(storageBaseFile)
        }
      }
    } else {
      const winBaseFolde = `${homeDir}\\AppData\\Local\\Netease\\CloudMusic`
      debugInfo.hasFolder = fs.existsSync(winBaseFolde)
      if (debugInfo.hasFolder) {
        debugInfo.childFolders = fs.readdirSync(winBaseFolde)
        const winStorageBaseFile = `${winBaseFolde}\\Library`
        debugInfo.hasStorage = fs.existsSync(winStorageBaseFile)
        if (debugInfo.hasStorage) {
          debugInfo.storageFiles = fs.readdirSync(winStorageBaseFile)
        }
      }
    }

    debugInfo.checkFiles = files
    debugInfo.type = this.type

    return debugInfo
  }

  async export(file) {
    // throw new Error("没有找到“我喜欢的音乐”歌单 或 “我喜欢的音乐”里没有收藏的曲目");
    const cloudMusicDatabase = file ? file : this.existsFiles[0];
    const sequelize = new Sequelize("main", null, null, {
      dialect: "sqlite",
      logging: false,
      storage: cloudMusicDatabase,
      dialectOptions: {
        mode: sqlite3.OPEN_READONLY
      }
    });

    await sequelize.authenticate();
    const allPlaylist = await sequelize.query("select * from web_playlist", {
      type: QueryTypes.SELECT,
    });

    const likePlaylists = allPlaylist
      .map((_) => {
        return JSON.parse(_.playlist);
      })
      .filter((playlist) => {
        return playlist.name == "我喜欢的音乐" && playlist.trackCount > 0 && !playlist.anonimous;
      });
    
    console.log('likePlaylists', likePlaylists)
    const likePlaylist = likePlaylists[0]

    if (!likePlaylist) {
        throw new Error("没有找到“我喜欢的音乐”歌单 或 “我喜欢的音乐”里没有收藏的曲目");
    }

    const sql =
      "select web_track.* from web_playlist_track left join web_track on web_track.tid = web_playlist_track.tid where pid = " +
      likePlaylist.id  +
      " order by `order` asc";

    console.log("found", likePlaylist, likePlaylist.id, sql);
    let songRows = await sequelize.query(sql, {
      type: QueryTypes.SELECT,
    });

    // console.log("list one", allIds[0]);
    // let songRows = await sequelize.query(
    //   "select * from web_track where tid in (" +
    //     allIds.map((_) => _.tid).join(",") +
    //     ")",
    //   {
    //     type: QueryTypes.SELECT,
    //   }
    // );
    console.log("track.sample", songRows[0], songRows.length);
    songRows = songRows.filter(_ => _.track)
    .map((_) => {
      _.track = JSON.parse(_.track);
      return _;
    });
    const formattedSongs = songRows.map((_) => {
      const track = _.track;
      return {
        type: "cloudmusic",
        song_id: track.id,
        song_name: track.name,
        album_name: track.album.name,
        artist_name: track.artists.map((_) => _.name).join(","),
        album_logo: track.album.picUrl,
        // artist_logo: track.album.artistLogo,
      };
    });
    // console.log("songRows", formattedSongs.length);
    return formattedSongs.reverse();
  }
}

export default Netease;
// module.exports = Netease

// (async () => {
//   const nete = new Netease();
//   const has = nete.isExists();
//   if (has) {
//     const results = await nete.export();
//     console.log("results", results.length);
//   }
// })();
