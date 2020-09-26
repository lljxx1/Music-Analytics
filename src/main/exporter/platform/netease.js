const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const isWindows = process.platform == "win32";
const userName = require("os").userInfo().username;

console.log("userName", userName);

export default class Netease {
  constructor() {
    this.type = "cloudmusic";
    this.name = "网易云音乐";
    this.existsFiles = []
  }
  isExists() {
    let files = [];
    if (isWindows) {
      files.push(
        `C:\\Users\\${userName}\\AppData\\Local\\Netease\\CloudMusic\\Library\\webdb.dat`
      );
    } else {
      files.push(
        `/Users/${userName}/Library/Containers/com.netease.163music/Data/Documents/storage/sqlite_storage.sqlite3`
      );
    }
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

  async export(file) {
    const cloudMusicDatabase = file ? file : this.existsFiles[0];
    const sequelize = new Sequelize("main", null, null, {
      dialect: "sqlite",
      logging: false,
      storage: cloudMusicDatabase,
    });

    await sequelize.authenticate();
    const allPlaylist = await sequelize.query("select * from web_playlist", {
      type: QueryTypes.SELECT,
    });

    const likePlaylist = allPlaylist
      .map((_) => {
        return JSON.parse(_.playlist);
      })
      .filter((playlist) => {
        return playlist.name == "我喜欢的音乐";
      })[0];

    if (!likePlaylist) {
        throw new Error("没有找到“我喜欢的音乐”歌单");
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
    songRows = songRows.map((_) => {
      _.track = JSON.parse(_.track);
      return _;
    });
    console.log("track.sample", songRows[0]);
    const formattedSongs = songRows.map((_) => {
      const track = _.track;
      return {
        type: "cloudmusic",
        song_id: track.id,
        song_name: track.name,
        album_name: track.album.name,
        artist_name: track.artists.map((_) => _.name).join(","),
        album_logo: track.album.picUrl,
      };
    });
    // console.log("songRows", formattedSongs.length);
    return formattedSongs;
  }
}

// exports default Netease;

// (async () => {
//   const nete = new Netease();
//   const has = nete.isExists();
//   if (has) {
//     const results = await nete.export();
//     console.log("results", results.length);
//   }
// })();
