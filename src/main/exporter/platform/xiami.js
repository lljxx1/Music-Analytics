const Sequelize = require("sequelize");
const { QueryTypes } = require("sequelize");
const fs = require("fs");
const isWindows = process.platform == "win32";
const userName = require("os").userInfo().username;
const ini = require('ini');

console.log("userName", userName);

export default class Xiami {
  constructor() {
    this.type = "xiami";
    this.name = "虾米音乐";
    this.existsFiles = [];
  }

  isExists() {
    let files = [];
    if (isWindows) {
      files.push([
        `C:\\Users\\${userName}\\AppData\\Roaming\\Xiami\\xiami_info.ini`,
        `C:\\Users\\${userName}\\AppData\\Roaming\\Xiami\\Xiami.db`,
      ]);
    } else {
      //   files.push(
      //     `/Users/${userName}/Library/Containers/com.netease.163music/Data/Documents/storage/sqlite_storage.sqlite3`
      //   );
    }
    const existsFiles = files.filter((_) =>
      typeof _ == "string"
        ? fs.existsSync(_)
        : _.filter((p) => fs.existsSync(p).length == _.length)
    );
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

  getCollectIds(xiamiConfigDatabase) {
    xiamiConfigDatabase = xiamiConfigDatabase || this.existsFiles[0][0]
    console.log('xiamiConfigDatabase', xiamiConfigDatabase)
    const configStr = fs.readFileSync(xiamiConfigDatabase, "utf-8");
    const config = ini.parse(configStr);
    const userId = config.xiami.USER_ID;
    const mapping = config.xiami[userId];
    const key = `${userId} = ${mapping};`;
    const lines = configStr.split("\n").filter((_) => _.indexOf(key) > -1);
    if (lines.length) {
      const songIds = lines[0].replace(key, "").split(",");
      return songIds;
    }
    return [];
  }

  async export(xiamiDatabase) {
    xiamiDatabase = xiamiDatabase || this.existsFiles[0][1]
    const sequelize = new Sequelize("main", null, null, {
      dialect: "sqlite",
      logging: false,
      storage: xiamiDatabase,
    });
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const songIds = this.getCollectIds();
    console.log("found song", songIds.length);
    const songRows = await sequelize.query(
      "select * from song_info where song_id in (" + songIds.join(",") + ")",
      { type: QueryTypes.SELECT }
    );
    const orderedSongs = songIds.map(_ => {
      return songRows.filter(p => p.song_id == _)[0]
    }).filter(_ => _);

    const formattedSongs = orderedSongs.map((_) => {
      return {
        type: "xiami",
        song_id: _.song_id,
        song_name: _.song_name,
        album_name: _.album_name,
        artist_name: _.singers,
        album_logo: _.album_logo,
        artist_logo: _.artistLogo,
      };
    });
    return formattedSongs;
  }
}

// (async () => {
//   const nete = new Xiami();
//   const has = nete.isExists();
//   if (has) {
//     const results = await nete.export();
//     console.log("results", results.length);
//   }
// })();
